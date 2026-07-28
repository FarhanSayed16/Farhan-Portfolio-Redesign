import Phaser from 'phaser';
import BaseLevel from './BaseLevel';
import { Player } from '../sprites/Player';
import { Goomba } from '../sprites/Enemy';
import { Mushroom } from '../sprites/Item';
import { Coin, spawnBlockCoin, spawnScorePopup } from '../sprites/Coin';
import { isStomp } from '../gameplay/combat';
import { gameBridge } from '@/lib/GameBridge';
import { portfolioData } from '@/lib/portfolioData';

export default class Level1Scene extends BaseLevel {
  private player!: Player;
  private goombas!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;
  private coinsGroup!: Phaser.Physics.Arcade.Group;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super('Level1Scene');
    this.worldLabel = '1-1';
  }

  create() {
    // scene.restart() reuses this instance — ensure systems aren't left paused from a prior life
    if (this.sys.isPaused()) this.scene.resume();
    if (this.physics.world.isPaused) this.physics.world.resume();

    this.cameras.main.setBackgroundColor('#5c94fc');

    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    if (!tileset) {
      console.error('Failed to load tileset');
      return;
    }

    this.groundLayer = map.createLayer('Ground', tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
    this.groundLayer.setCollisionByExclusion([-1, 0]);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.addScenery(map.widthInPixels);

    this.goombas = this.physics.add.group();
    this.items = this.physics.add.group();
    this.coinsGroup = this.physics.add.group({ allowGravity: false, immovable: true });

    const objects = map.getObjectLayer('Objects')?.objects || [];
    let spawnX = 100;
    let spawnY = 100;
    const spawnObj = objects.find((o) => o.type === 'MarioSpawn');
    if (spawnObj) {
      spawnX = spawnObj.x || 100;
      // Tiled y is object top; player origin is feet
      spawnY = (spawnObj.y || 100) + (spawnObj.height || 32);
    }

    this.player = new Player(this, spawnX, spawnY);

    objects.forEach((obj) => {
      const x = obj.x || 0;
      const y = obj.y || 0;

      if (obj.type === 'Enemy') {
        this.goombas.add(new Goomba(this, x, y - 8));
      } else if (obj.type === 'Flagpole') {
        const pole = this.add.image(x + 16, y + (obj.height || 160) / 2, 'flagpole').setDepth(4);
        this.physics.add.existing(pole, true);
        const body = pole.body as Phaser.Physics.Arcade.StaticBody;
        body.setSize(12, obj.height || 160);
        body.setOffset(10, 0);
        this.physics.add.overlap(this.player, pole, () => {
          this.completeLevel('Level2Scene');
        });
      }
    });

    [320, 480, 640].forEach((cx) => {
      this.coinsGroup.add(new Coin(this, cx, 260));
    });

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.physics.add.collider(this.player, this.groundLayer, this.handlePlayerGroundCollision, undefined, this);
    this.physics.add.collider(this.goombas, this.groundLayer);
    this.physics.add.collider(this.items, this.groundLayer);
    // Overlap (not collider): Arcade separation zeros velocity.y and breaks stomp checks
    this.physics.add.overlap(this.player, this.goombas, this.handlePlayerEnemyCollision, undefined, this);
    this.physics.add.overlap(this.player, this.items, this.handlePlayerItemOverlap, undefined, this);
    this.physics.add.overlap(this.player, this.coinsGroup, this.handleCoinOverlap, undefined, this);

    this.bindLevelEvents(() => this.player?.die());
    this.createHUD();
  }

  update() {
    if (!this.player || this.levelComplete) return;
    this.player.update();
    this.goombas.getChildren().forEach((g) => (g as Goomba).update?.());
    this.items.getChildren().forEach((i) => (i as Mushroom).update?.());
  }

  private handleCoinOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_p, c) => {
    (c as Coin).destroy();
    this.addCoin();
  };

  private handlePlayerGroundCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (p, t) => {
    const player = p as Player;
    const tile = t as Phaser.Tilemaps.Tile;
    if (!tile || !player.body) return;

    // Hit Q-block from below
    if (tile.index === 3 && player.body.blocked.up) {
      const key = `${tile.x},${tile.y}`;
      if (this.hitTiles.has(key)) return;
      this.hitTiles.add(key);

      this.groundLayer.putTileAt(4, tile.x, tile.y); // used block
      this.addScore(50);
      this.sfx.playBlock();

      // Bump tile visually
      const worldX = tile.pixelX + 16;

      if (this.hitTiles.size % 2 === 1) {
        this.items.add(new Mushroom(this, worldX, tile.pixelY));
        this.sfx.playPowerup();
      } else {
        spawnBlockCoin(this, worldX, tile.pixelY, () => this.addCoin());
      }

      this.events.emit('post-overlay-resume'); // i-frames across pause/resume
      this.scene.pause();
      const skill = portfolioData.skills[Math.floor(Math.random() * portfolioData.skills.length)];
      gameBridge.emit('show-overlay', { type: 'skill', text: skill });
    }

    // Break bricks when super
    if (tile.index === 2 && player.body.blocked.up && this.player.isSuper) {
      this.groundLayer.removeTileAt(tile.x, tile.y);
      this.addScore(50);
      this.sfx.playStomp();
    }
  };

  private handlePlayerEnemyCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (p, e) => {
    const player = p as Player;
    const enemy = e as Goomba;
    if (!player.body || !enemy.body || enemy.dead || player.isInvincible()) return;

    if (isStomp(player, enemy)) {
      enemy.stomp();
      player.setVelocityY(-320);
      this.addScore(100);
      spawnScorePopup(this, enemy.x, enemy.y - 10, 100);
      this.sfx.playStomp();
    } else if (player.isSuper) {
      player.shrink();
      this.sfx.playStomp();
    } else {
      player.die();
    }
  };

  private handlePlayerItemOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_p, i) => {
    const item = i as Mushroom;
    if (item.isEmerging) return;
    this.player.grow();
    this.addScore(1000);
    spawnScorePopup(this, item.x, item.y - 10, 1000);
    item.destroy();
    this.sfx.playPowerup();
    // Let grow settle one tick before pause — pausing mid-separation used to kill Mario
    this.time.delayedCall(80, () => {
      if (this.levelComplete || this.deathHandled) return;
      this.events.emit('post-overlay-resume');
      this.scene.pause();
      const proj = portfolioData.projects[Math.floor(Math.random() * portfolioData.projects.length)];
      gameBridge.emit('show-overlay', { type: 'project', text: proj });
    });
  };
}

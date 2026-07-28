import Phaser from 'phaser';
import BaseLevel from './BaseLevel';
import { Player } from '../sprites/Player';
import { Goomba } from '../sprites/Enemy';
import { Mushroom } from '../sprites/Item';
import { Coin, spawnBlockCoin, spawnScorePopup } from '../sprites/Coin';
import { isStomp } from '../gameplay/combat';
import { gameBridge } from '@/lib/GameBridge';
import { portfolioData } from '@/lib/portfolioData';

export default class Level2Scene extends BaseLevel {
  private player!: Player;
  private goombas!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;
  private coinsGroup!: Phaser.Physics.Arcade.Group;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super('Level2Scene');
    this.worldLabel = '1-2';
  }

  create() {
    if (this.sys.isPaused()) this.scene.resume();
    if (this.physics.world.isPaused) this.physics.world.resume();

    this.cameras.main.setBackgroundColor('#5c94fc');

    const map = this.make.tilemap({ key: 'level2' });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    if (!tileset) return;

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
      spawnY = (spawnObj.y || 100) + (spawnObj.height || 32);
    }

    this.player = new Player(this, spawnX, spawnY);

    objects.forEach((obj) => {
      const x = obj.x || 0;
      const y = obj.y || 0;

      if (obj.type === 'Enemy') {
        this.goombas.add(new Goomba(this, x, y - 8));
      } else if (obj.type === 'WarpPipe') {
        const pipe = this.add.image(x + 32, y + 32, 'pipe').setDepth(4);
        this.physics.add.existing(pipe, true);
        const body = pipe.body as Phaser.Physics.Arcade.StaticBody;
        body.setSize(48, 56);
        body.setOffset(8, 8);
        this.physics.add.overlap(this.player, pipe, () => {
          this.completeLevel('Level3Scene');
        });
      }
    });

    [200, 360, 520].forEach((cx) => this.coinsGroup.add(new Coin(this, cx, 280)));

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.physics.add.collider(this.player, this.groundLayer, this.handlePlayerGroundCollision, undefined, this);
    this.physics.add.collider(this.goombas, this.groundLayer);
    this.physics.add.collider(this.items, this.groundLayer);
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

    if (tile.index === 3 && player.body.blocked.up) {
      const key = `${tile.x},${tile.y}`;
      if (this.hitTiles.has(key)) return;
      this.hitTiles.add(key);
      this.groundLayer.putTileAt(4, tile.x, tile.y);
      this.addScore(50);
      this.sfx.playBlock();
      const worldX = tile.pixelX + 16;
      if (this.hitTiles.size % 2 === 1) {
        this.items.add(new Mushroom(this, worldX, tile.pixelY));
        this.sfx.playPowerup();
      } else {
        spawnBlockCoin(this, worldX, tile.pixelY, () => this.addCoin());
      }
      this.events.emit('post-overlay-resume');
      this.scene.pause();
      gameBridge.emit('show-overlay', {
        type: 'skill',
        text: portfolioData.skills[Math.floor(Math.random() * portfolioData.skills.length)],
      });
    }

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
    this.time.delayedCall(80, () => {
      if (this.levelComplete || this.deathHandled) return;
      this.events.emit('post-overlay-resume');
      this.scene.pause();
      gameBridge.emit('show-overlay', {
        type: 'project',
        text: portfolioData.projects[Math.floor(Math.random() * portfolioData.projects.length)],
      });
    });
  };
}

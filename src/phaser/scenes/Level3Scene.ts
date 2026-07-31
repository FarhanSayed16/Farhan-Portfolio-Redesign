import Phaser from 'phaser';
import BaseLevel from './BaseLevel';
import { Player } from '../sprites/Player';
import { Goomba, Koopa } from '../sprites/Enemy';
import { Mushroom, FireFlower } from '../sprites/Item';
import { Fireball } from '../sprites/Fireball';
import { Coin } from '../sprites/Coin';
import { Bowser } from '../sprites/Bowser';
import { Axe } from '../sprites/Axe';
import { spawnEnemyFromObject, wireCombat, handleQBlockHit } from '../gameplay/levelCombat';
import { breakBrick, bumpBrick } from '../gameplay/brickBreak';

export default class Level3Scene extends BaseLevel {
  player!: Player;
  enemies!: Phaser.Physics.Arcade.Group;
  items!: Phaser.Physics.Arcade.Group;
  fireballs!: Phaser.Physics.Arcade.Group;
  private coinsGroup!: Phaser.Physics.Arcade.Group;
  groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private bowser!: Bowser;
  private axe!: Axe;
  private winStarted = false;

  constructor() {
    super('Level3Scene');
    this.worldLabel = '1-3';
  }

  create() {
    if (this.sys.isPaused()) this.scene.resume();
    if (this.physics.world.isPaused) this.physics.world.resume();
    this.winStarted = false;

    this.cameras.main.setBackgroundColor('#000000');

    const map = this.make.tilemap({ key: 'level3' });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    if (!tileset) return;

    this.groundLayer = map.createLayer('Ground', tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
    this.groundLayer.setCollisionByExclusion([-1, 0]);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.enemies = this.physics.add.group();
    this.items = this.physics.add.group();
    this.fireballs = this.physics.add.group();
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

    let bridgeObj: Phaser.Types.Tilemaps.TiledObject | undefined;

    objects.forEach((obj) => {
      const x = obj.x || 0;
      const y = obj.y || 0;

      if (obj.type === 'Enemy' || obj.type === 'Koopa') {
        spawnEnemyFromObject(this, this.enemies, obj);
      } else if (obj.type === 'BowserSpawn') {
        this.bowser = new Bowser(this, x, y);
      } else if (obj.type === 'Axe') {
        this.axe = new Axe(this, x, y);
        this.physics.add.overlap(this.player, this.axe, () => this.winSequence());
      } else if (obj.type === 'Bridge') {
        bridgeObj = obj;
      }
    });

    this.enemies.add(new Koopa(this, 280, 360));
    this.registry.set('bridgeObj', bridgeObj);
    [180, 320].forEach((cx) => this.coinsGroup.add(new Coin(this, cx, 260)));

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.physics.add.collider(this.player, this.groundLayer, this.handlePlayerGroundCollision, undefined, this);
    this.physics.add.collider(this.enemies, this.groundLayer);
    this.physics.add.collider(this.items, this.groundLayer);
    if (this.bowser) {
      this.physics.add.collider(this.bowser, this.groundLayer);
      this.physics.add.collider(this.player, this.bowser, this.handlePlayerBowserCollision, undefined, this);
      this.physics.add.overlap(this.fireballs, this.bowser, (b) => {
        (b as Fireball).destroy();
        this.addScore(200);
        this.sfx.playBoss();
      });
    }
    this.physics.add.overlap(this.player, this.coinsGroup, this.handleCoinOverlap, undefined, this);

    wireCombat(this);
    this.bindLevelEvents(() => this.player?.die());
    this.createHUD();
    this.startBgm('castle');
  }

  update() {
    if (!this.player || this.levelComplete || this.winStarted) return;
    this.player.update();
    this.enemies.getChildren().forEach((g) => (g as Goomba | Koopa).update?.());
    this.items.getChildren().forEach((i) => (i as Mushroom | FireFlower).update?.());
    this.fireballs.getChildren().forEach((f) => (f as Fireball).update?.());
    if (this.bowser) this.bowser.update();
  }

  private winSequence() {
    if (this.winStarted || this.levelComplete) return;
    this.winStarted = true;
    this.levelComplete = true;
    this.timeEvent?.remove(false);
    this.stopBgm();
    this.sfx.playBoss();

    this.axe?.destroy();
    this.bowser?.die?.();

    const bridge = this.registry.get('bridgeObj') as Phaser.Types.Tilemaps.TiledObject | undefined;
    if (bridge && bridge.x != null && bridge.width != null) {
      const startX = Math.floor(bridge.x / 32);
      const endX = Math.floor((bridge.x + bridge.width) / 32);
      const tileY = Math.floor((bridge.y ?? 416) / 32);
      for (let x = startX; x <= endX; x++) this.groundLayer.removeTileAt(x, tileY);
    } else {
      for (let x = 30; x <= 45; x++) this.groundLayer.removeTileAt(x, 13);
    }

    this.time.delayedCall(1200, () => {
      this.scene.start('WinScene', { score: this.score, coins: this.coins, lives: this.lives });
    });
  }

  private handleCoinOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_p, c) => {
    (c as Coin).destroy();
    this.addCoin();
  };

  private handlePlayerBowserCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (p) => {
    const player = p as Player;
    if (!player.body || player.isInvincible()) return;
    if (player.isSuper || player.isFire) player.shrink();
    else player.die();
  };

  private handlePlayerGroundCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (p, t) => {
    const player = p as Player;
    const tile = t as Phaser.Tilemaps.Tile;
    if (!tile || !player.body) return;
    if (handleQBlockHit(this, player, tile)) return;
    if (tile.index === 2 && player.body.blocked.up) {
      if (this.player.isSuper || this.player.isFire) breakBrick(this, tile);
      else bumpBrick(this, tile);
    }
  };
}

import Phaser from 'phaser';
import BaseLevel from './BaseLevel';
import { Player } from '../sprites/Player';
import { Goomba, Koopa } from '../sprites/Enemy';
import { Mushroom, FireFlower } from '../sprites/Item';
import { Fireball } from '../sprites/Fireball';
import { Coin } from '../sprites/Coin';
import { spawnEnemyFromObject, wireCombat, handleQBlockHit } from '../gameplay/levelCombat';
import { breakBrick, bumpBrick } from '../gameplay/brickBreak';
import { placePipe } from '../gameplay/placePipe';

export default class Level2Scene extends BaseLevel {
  player!: Player;
  enemies!: Phaser.Physics.Arcade.Group;
  items!: Phaser.Physics.Arcade.Group;
  fireballs!: Phaser.Physics.Arcade.Group;
  private coinsGroup!: Phaser.Physics.Arcade.Group;
  groundLayer!: Phaser.Tilemaps.TilemapLayer;

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

    this.addScenery(map, this.groundLayer);

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

    objects.forEach((obj) => {
      const x = obj.x || 0;
      const y = obj.y || 0;

      if (obj.type === 'Enemy' || obj.type === 'Koopa') {
        spawnEnemyFromObject(this, this.enemies, obj);
      } else if (obj.type === 'WarpPipe') {
        placePipe(this, x, y, { warpTo: 'Level3Scene' });
      }
    });

    this.enemies.add(new Koopa(this, 500, 360));
    this.enemies.add(new Goomba(this, 900, 360));

    [200, 360, 520].forEach((cx) => this.coinsGroup.add(new Coin(this, cx, 280)));

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.physics.add.collider(this.player, this.groundLayer, this.handlePlayerGroundCollision, undefined, this);
    this.physics.add.collider(this.enemies, this.groundLayer);
    this.physics.add.collider(this.items, this.groundLayer);
    this.physics.add.overlap(this.player, this.coinsGroup, this.handleCoinOverlap, undefined, this);

    wireCombat(this);
    this.bindLevelEvents(() => this.player?.die());
    this.createHUD();
    this.startBgm('overworld');
  }

  update() {
    if (!this.player || this.levelComplete) return;
    this.player.update();
    this.enemies.getChildren().forEach((g) => (g as Goomba | Koopa).update?.());
    this.items.getChildren().forEach((i) => (i as Mushroom | FireFlower).update?.());
    this.fireballs.getChildren().forEach((f) => (f as Fireball).update?.());
  }

  private handleCoinOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_p, c) => {
    (c as Coin).destroy();
    this.addCoin();
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

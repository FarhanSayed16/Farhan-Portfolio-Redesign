import Phaser from 'phaser';

export class Mushroom extends Phaser.Physics.Arcade.Sprite {
  private direction = 1;
  private speed = 90;
  private emerging = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mushroom');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 28);
    body.setOffset(2, 2);
    body.setAllowGravity(false);
    body.setVelocity(0, 0);
    this.setDepth(8);

    this.y += 16;
    scene.tweens.add({
      targets: this,
      y: y - 16,
      duration: 400,
      ease: 'Linear',
      onComplete: () => {
        this.emerging = false;
        body.setAllowGravity(true);
        body.setVelocityX(this.speed * this.direction);
      },
    });
  }

  get isEmerging() {
    return this.emerging;
  }

  get kind() {
    return 'mushroom' as const;
  }

  update() {
    if (this.emerging || !this.body) return;
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.left || body.blocked.right) {
      this.direction *= -1;
      body.setVelocityX(this.speed * this.direction);
    }

    if (this.y > this.scene.cameras.main.height + 200) {
      this.destroy();
    }
  }
}

/** Fire Flower — sits after emerging; grants fire suit. */
export class FireFlower extends Phaser.Physics.Arcade.Sprite {
  private emerging = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'fireflower');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 28);
    body.setOffset(2, 2);
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setVelocity(0, 0);
    this.setDepth(8);

    this.y += 16;
    scene.tweens.add({
      targets: this,
      y: y - 16,
      duration: 400,
      ease: 'Linear',
      onComplete: () => {
        this.emerging = false;
      },
    });
  }

  get isEmerging() {
    return this.emerging;
  }

  get kind() {
    return 'fireflower' as const;
  }

  update() {
    /* static after emerge */
  }
}

export type PowerItem = Mushroom | FireFlower;

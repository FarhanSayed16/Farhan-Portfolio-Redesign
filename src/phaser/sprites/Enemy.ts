import Phaser from 'phaser';

export class Goomba extends Phaser.Physics.Arcade.Sprite {
  private direction = -1;
  private speed = 45;
  private isDead = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'goomba_0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 28);
    body.setOffset(2, 4);
    this.setDepth(5);
    this.anims.play('goomba-walk', true);
  }

  get dead() {
    return this.isDead;
  }

  update() {
    if (this.isDead || !this.body) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.left || body.blocked.right) {
      this.direction *= -1;
    }

    body.setVelocityX(this.speed * this.direction);

    if (this.y > this.scene.cameras.main.height + 200) {
      this.destroy();
    }
  }

  /** Stomp from above — flatten then remove. */
  stomp() {
    if (this.isDead) return;
    this.isDead = true;
    this.anims.play('goomba-flat', true);
    this.setTexture('goomba_flat');
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = true;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);

    this.scene.time.delayedCall(500, () => {
      if (this.active) this.destroy();
    });
  }
}

import Phaser from 'phaser';

export class Bowser extends Phaser.Physics.Arcade.Sprite {
  private direction = -1;
  private speed = 70;
  private isDead = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bowser');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(56, 56);
    body.setOffset(4, 4);
    this.setDepth(6);
  }

  update() {
    if (this.isDead || !this.body) return;
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.left || body.blocked.right) {
      this.direction *= -1;
    }

    if (body.onFloor() && Math.random() < 0.01) {
      body.setVelocityY(-380);
    }

    body.setVelocityX(this.speed * this.direction);
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = true;
    body.setVelocity(0, -200);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      angle: 90,
      duration: 800,
      onComplete: () => this.destroy(),
    });
  }
}

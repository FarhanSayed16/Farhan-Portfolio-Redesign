import Phaser from 'phaser';

export class Axe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'axe');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(28, 28);
    body.setOffset(2, 2);
    this.setDepth(7);

    scene.tweens.add({
      targets: this,
      angle: { from: -15, to: 15 },
      duration: 400,
      yoyo: true,
      repeat: -1,
    });
  }
}

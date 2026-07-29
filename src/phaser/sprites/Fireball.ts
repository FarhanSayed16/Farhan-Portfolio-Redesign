import Phaser from 'phaser';
import type { Goomba, Koopa } from './Enemy';

export class Fireball extends Phaser.Physics.Arcade.Sprite {
  private life = 240;

  constructor(scene: Phaser.Scene, x: number, y: number, dir: number) {
    super(scene, x, y, 'fireball');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(10, 10);
    body.setOffset(3, 3);
    body.setAllowGravity(true);
    body.setBounce(0.95, 0.6);
    body.setVelocity(dir * 280, -80);
    this.setDepth(12);
    this.anims.play('fireball-spin', true);
  }

  update() {
    this.life -= 1;
    if (this.life <= 0 || this.y > this.scene.cameras.main.height + 40) {
      this.destroy();
      return;
    }
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body?.blocked.left || body?.blocked.right) {
      this.destroy();
    }
  }
}

export function hitEnemyWithFireball(
  ball: Fireball,
  enemy: Goomba | Koopa
) {
  if (!ball.active) return;
  enemy.burn();
  ball.destroy();
}

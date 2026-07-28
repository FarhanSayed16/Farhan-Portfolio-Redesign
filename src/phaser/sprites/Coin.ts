import Phaser from 'phaser';

/** Floating world coin — no gravity, tween-only bob. */
export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin_0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.moves = false; // tween drives Y; physics must not pull coins into the ground
    body.setVelocity(0, 0);
    body.setSize(14, 16);
    this.setDepth(6);
    this.anims.play('coin-spin', true);

    scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 450,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}

/** Coin pops out of a ? block, then vanishes (still counts). */
export function spawnBlockCoin(scene: Phaser.Scene, x: number, y: number, onCollected: () => void) {
  const coin = scene.add.sprite(x, y, 'coin_0');
  coin.setDepth(20);
  coin.anims.play('coin-spin', true);
  scene.tweens.add({
    targets: coin,
    y: y - 48,
    duration: 280,
    ease: 'Quad.easeOut',
    onComplete: () => {
      scene.tweens.add({
        targets: coin,
        y: y - 24,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          coin.destroy();
          onCollected();
        },
      });
    },
  });
}

/** Floating “100” after a stomp. */
export function spawnScorePopup(scene: Phaser.Scene, x: number, y: number, pts: number) {
  const t = scene.add
    .text(x, y, String(pts), {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff',
    })
    .setOrigin(0.5)
    .setDepth(50);
  scene.tweens.add({
    targets: t,
    y: y - 40,
    alpha: 0,
    duration: 600,
    onComplete: () => t.destroy(),
  });
}

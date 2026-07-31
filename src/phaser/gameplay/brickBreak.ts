import Phaser from 'phaser';
import type { SFXSynth } from '@/lib/SFXSynth';

type BrickHost = Phaser.Scene & {
  sfx: SFXSynth;
  addScore: (n: number) => void;
  groundLayer: Phaser.Tilemaps.TilemapLayer;
};

/** Smash a brick tile (super/fire only) — sound + debris. */
export function breakBrick(host: BrickHost, tile: Phaser.Tilemaps.Tile) {
  const wx = tile.pixelX + 16;
  const wy = tile.pixelY + 16;
  host.groundLayer.removeTileAt(tile.x, tile.y);
  host.addScore(50);
  host.sfx.playBrick();

  const bits: [number, number][] = [
    [-90, -260],
    [90, -260],
    [-50, -320],
    [50, -320],
  ];
  for (const [vx, vy] of bits) {
    const bit = host.add.image(wx, wy, 'block_brick').setDepth(25).setScale(0.4);
    host.physics.add.existing(bit);
    const body = bit.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setVelocity(vx, vy);
    host.tweens.add({
      targets: bit,
      angle: vx > 0 ? 180 : -180,
      alpha: 0,
      duration: 480,
      onComplete: () => bit.destroy(),
    });
  }
}

/** Small Mario bump — sound + brief bounce visual. */
export function bumpBrick(host: BrickHost, _tile: Phaser.Tilemaps.Tile) {
  host.sfx.playBlock();
  const ghost = host.add
    .image(_tile.pixelX + 16, _tile.pixelY + 16, 'block_brick')
    .setDepth(15);
  host.tweens.add({
    targets: ghost,
    y: ghost.y - 6,
    duration: 70,
    yoyo: true,
    onComplete: () => ghost.destroy(),
  });
}

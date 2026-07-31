import Phaser from 'phaser';
import type { Player } from '../sprites/Player';

type FlagHost = Phaser.Scene & {
  player: Player;
  completeLevel: (next: string) => void;
};

/**
 * End-of-level flagpole: pole + sliding flag + castle.
 *
 * The Tiled box gives the pole's footprint, so the sprite is anchored to the bottom of
 * that box rather than centred in it — centring is what left the old pole floating in
 * mid-air at a third of its intended height.
 */
export function placeFlagpole(
  host: FlagHost,
  obj: Phaser.Types.Tilemaps.TiledObject,
  nextScene: string
) {
  const x = obj.x ?? 0;
  const boxH = obj.height ?? 288;
  const groundY = (obj.y ?? 0) + boxH;

  const pole = host.add.image(x + 16, groundY, 'flagpole').setOrigin(0.5, 1).setDepth(4);
  const flag = host.add
    .image(pole.x - 2, groundY - pole.displayHeight + 20, 'flag')
    .setOrigin(1, 0)
    .setDepth(5);

  const castleX = x + 220;
  if (host.textures.exists('castle')) {
    host.add.image(castleX, groundY, 'castle').setOrigin(0.5, 1).setDepth(3);
  }

  const zone = host.add.zone(pole.x, groundY - boxH / 2, 28, boxH);
  host.physics.add.existing(zone, true);

  let touched = false;
  host.physics.add.overlap(host.player, zone, () => {
    if (touched) return;
    touched = true;

    // completeLevel pauses physics and waits ~2.4s for the stage-clear jingle, so the
    // slide and walk-in run as tweens inside that window.
    host.completeLevel(nextScene);

    host.tweens.add({ targets: flag, y: groundY - 48, duration: 700, ease: 'Quad.easeIn' });
    host.tweens.add({
      targets: host.player,
      x: castleX,
      y: groundY - 16,
      delay: 850,
      duration: 900,
    });
  });

  return pole;
}

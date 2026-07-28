import type { Player } from '../sprites/Player';
import type { Goomba } from '../sprites/Enemy';

/**
 * True when Mario is landing on top of the enemy (not a side bump).
 * Uses position, not post-resolve velocity — Arcade often zeroes velocity.y before the callback.
 */
export function isStomp(player: Player, enemy: Goomba): boolean {
  const pb = player.body as Phaser.Physics.Arcade.Body | undefined;
  const eb = enemy.body as Phaser.Physics.Arcade.Body | undefined;
  if (!pb || !eb) return false;

  const comingDown = pb.velocity.y > 40 || pb.deltaY() > 1.5;
  const feetNearTop = pb.bottom <= eb.top + 18;
  const mostlyAbove = pb.center.y < eb.center.y - 4;

  return comingDown && feetNearTop && mostlyAbove;
}

import type Phaser from 'phaser';

/**
 * True when the player is landing on top of the enemy (not a side bump).
 * Uses position + deltaY — Arcade often zeroes velocity.y before the callback.
 */
export function isStomp(
  player: Phaser.Physics.Arcade.Sprite,
  enemy: Phaser.Physics.Arcade.Sprite
): boolean {
  const pb = player.body as Phaser.Physics.Arcade.Body | undefined;
  const eb = enemy.body as Phaser.Physics.Arcade.Body | undefined;
  if (!pb || !eb) return false;

  const comingDown = pb.velocity.y > 40 || pb.deltaY() > 1.5;
  const feetNearTop = pb.bottom <= eb.top + 18;
  const mostlyAbove = pb.center.y < eb.center.y - 4;

  return comingDown && feetNearTop && mostlyAbove;
}

import Phaser from 'phaser';
import { gameBridge } from '@/lib/GameBridge';
import type { Player } from '../sprites/Player';

type PipeHost = Phaser.Scene & {
  player: Player;
  completeLevel: (next: string) => void;
};

/**
 * Solid pipe you can stand on and jump over. The sprite is exactly 64×64, which is
 * the size of the Tiled object box, so the body needs no hand-tuned offsets.
 * Pass `warpTo` to make it a warp pipe (stand on the rim, press down).
 */
export function placePipe(host: PipeHost, x: number, y: number, opts?: { warpTo?: string }) {
  const pipe = host.physics.add.staticImage(x + 32, y + 64, 'pipe').setOrigin(0.5, 1).setDepth(5);
  pipe.refreshBody(); // origin moved to bottom-centre, so the body has to catch up

  const warpTo = opts?.warpTo;
  if (!warpTo) {
    host.physics.add.collider(host.player, pipe);
    return pipe;
  }

  const downKey = host.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  const sKey = host.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  let hinted = false;
  let warped = false;

  host.physics.add.collider(host.player, pipe, () => {
    const body = host.player.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body?.blocked.down) return; // walked into the side, not standing on the rim
    if (!hinted) {
      hinted = true;
      gameBridge.emit('show-overlay', { type: 'achievement', text: 'Press DOWN to enter the pipe' });
    }
    if (warped || !(downKey?.isDown || sKey?.isDown)) return;
    warped = true;
    host.completeLevel(warpTo);
  });

  return pipe;
}

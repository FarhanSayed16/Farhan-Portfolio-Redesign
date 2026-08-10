import Phaser from 'phaser';
import { Player } from '../sprites/Player';
import { Goomba, Koopa, type EnemyKind } from '../sprites/Enemy';
import { Mushroom, FireFlower, type PowerItem } from '../sprites/Item';
import { Fireball, hitEnemyWithFireball } from '../sprites/Fireball';
import { spawnBlockCoin, spawnScorePopup } from '../sprites/Coin';
import { isStomp } from '../gameplay/combat';
import { gameBridge } from '@/lib/GameBridge';
import { drawGameSkill, portfolioData } from '@/lib/portfolioData';
import type { SFXSynth } from '@/lib/SFXSynth';

type LevelHost = Phaser.Scene & {
  sfx: SFXSynth;
  addScore: (n: number) => void;
  addCoin: () => void;
  hitTiles: Set<string>;
  player: Player;
  groundLayer: Phaser.Tilemaps.TilemapLayer;
  enemies: Phaser.Physics.Arcade.Group;
  items: Phaser.Physics.Arcade.Group;
  fireballs: Phaser.Physics.Arcade.Group;
  levelComplete: boolean;
  deathHandled: boolean;
};

export function spawnEnemyFromObject(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.Group,
  obj: Phaser.Types.Tilemaps.TiledObject
) {
  const x = obj.x || 0;
  const y = (obj.y || 0) - 8;
  const name = (obj.name || '').toLowerCase();
  if (name.includes('koopa') || obj.type === 'Koopa') {
    group.add(new Koopa(scene, x, y));
  } else {
    group.add(new Goomba(scene, x, y));
  }
}

export function wireCombat(host: LevelHost) {
  host.physics.add.overlap(host.player, host.enemies, (p, e) => {
    const player = p as Player;
    const enemy = e as EnemyKind;
    if (!player.body || !enemy.body || enemy.dead || player.isInvincible()) return;

    if (enemy instanceof Koopa && enemy.inShell) {
      if (enemy.shellMoving) {
        if (isStomp(player, enemy)) {
          enemy.stomp();
          player.setVelocityY(-320);
          host.addScore(100);
          host.sfx.playStomp();
        } else {
          hurtPlayer(host, player);
        }
        return;
      }
      // Still shell — kick away from player
      const dir = player.x < enemy.x ? 1 : -1;
      enemy.kick(dir);
      player.setVelocityY(-280);
      host.sfx.playStomp();
      return;
    }

    if (isStomp(player, enemy)) {
      enemy.stomp();
      player.setVelocityY(-320);
      host.addScore(100);
      spawnScorePopup(host, enemy.x, enemy.y - 10, 100);
      host.sfx.playStomp();
    } else {
      hurtPlayer(host, player);
    }
  });

  host.physics.add.overlap(host.player, host.items, (_p, i) => {
    const item = i as PowerItem;
    if (item.isEmerging) return;
    if (item.kind === 'fireflower') {
      host.player.grantFire();
    } else {
      host.player.grow();
    }
    host.addScore(1000);
    spawnScorePopup(host, item.x, item.y - 10, 1000);
    item.destroy();
    host.sfx.playPowerup();
    host.time.delayedCall(80, () => {
      if (host.levelComplete || host.deathHandled) return;
      const proj = portfolioData.projects[Math.floor(Math.random() * portfolioData.projects.length)];
      gameBridge.emit('show-overlay', { type: 'project', text: proj });
    });
  });

  host.physics.add.overlap(host.fireballs, host.enemies, (b, e) => {
    hitEnemyWithFireball(b as Fireball, e as EnemyKind);
    host.addScore(100);
    host.sfx.playStomp();
  });

  host.physics.add.collider(host.fireballs, host.groundLayer);
}

function hurtPlayer(host: LevelHost, player: Player) {
  if (player.isSuper || player.isFire) {
    player.shrink();
    host.sfx.playStomp();
  } else {
    player.die();
  }
}

export function handleQBlockHit(host: LevelHost, player: Player, tile: Phaser.Tilemaps.Tile) {
  if (tile.index !== 3 || !player.body?.blocked.up) return false;
  const key = `${tile.x},${tile.y}`;
  if (host.hitTiles.has(key)) return true;
  host.hitTiles.add(key);

  host.groundLayer.putTileAt(4, tile.x, tile.y);
  host.addScore(50);
  host.sfx.playBlock();

  const worldX = tile.pixelX + 16;
  const n = host.hitTiles.size;

  if (player.isSuper || player.isFire) {
    // Already powered — flower; else alternate mushroom / coin
    if (n % 3 === 0) {
      host.items.add(new FireFlower(host, worldX, tile.pixelY));
      host.sfx.playPowerup();
    } else if (n % 2 === 1) {
      host.items.add(new Mushroom(host, worldX, tile.pixelY));
      host.sfx.playPowerup();
    } else {
      spawnBlockCoin(host, worldX, tile.pixelY, () => host.addCoin());
    }
  } else if (n % 2 === 1) {
    host.items.add(new Mushroom(host, worldX, tile.pixelY));
    host.sfx.playPowerup();
  } else {
    spawnBlockCoin(host, worldX, tile.pixelY, () => host.addCoin());
  }

  // Toast only — game keeps running (no pause / OK click).
  // Draw without replacement so successive hits show different high-impact stacks.
  gameBridge.emit('show-overlay', { type: 'skill', text: drawGameSkill() });
  return true;
}

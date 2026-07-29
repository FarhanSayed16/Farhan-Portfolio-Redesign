/**
 * Inspired-original NES-style sprites (Farhan OS).
 * Hand-authored grids — not ripped from Nintendo sheets.
 */
import Phaser from 'phaser';

const C: Record<string, number> = {
  R: 0xf83800,
  B: 0x887000,
  S: 0xfca044,
  O: 0xe85d0b,
  G: 0x00a800,
  M: 0xb8f818,
  K: 0x000000,
  W: 0xffffff,
  L: 0xf8d820,
  D: 0x503000,
  P: 0xfc74b4, // pink / flower
  N: 0x00b800, // koopa green
  F: 0xfc9838, // fire orange
  U: 0x3cbcfc, // blue (fire flower petal / shell)
  H: 0x7c7c7c, // grey axe
  V: 0xb8b8f8, // bowser belly
};

function paint(
  g: Phaser.GameObjects.Graphics,
  grid: string[],
  scale: number,
  ox = 0,
  oy = 0,
  flipX = false,
  remap?: Record<string, string>
) {
  const w = grid[0].length;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const px = flipX ? w - 1 - x : x;
      let ch = grid[y][px];
      if (remap?.[ch]) ch = remap[ch];
      if (ch !== '.' && C[ch] !== undefined) {
        g.fillStyle(C[ch], 1);
        g.fillRect(ox + x * scale, oy + y * scale, scale, scale);
      }
    }
  }
}

function tex(
  scene: Phaser.Scene,
  key: string,
  w: number,
  h: number,
  fn: (g: Phaser.GameObjects.Graphics) => void
) {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0 });
  fn(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

const MUSHROOM = [
  '......KKKK......',
  '....KKRRRRKK....',
  '...KRRWWRRRRK...',
  '..KRRWWWRRRRRK..',
  '.KRRRRRRRRRRRRK.',
  '.KRRRRRRRRRRRRK.',
  'KKRRRRRRRRRRRRKK',
  'KRRRRRRRRRRRRRRK',
  'KKKKKKKKKKKKKKKK',
  '...KSSSSSSSSK...',
  '...KSSSSSSSSK...',
  '...KSSKKKKSSK...',
  '...KSSSSSSSSK...',
  '....KKKKKKKK....',
  '................',
  '................',
];

const FIREFLOWER = [
  '.......KK.......',
  '......KWWK......',
  '.....KWLLWK.....',
  '....KWLLLLWK....',
  '...KWLKLLKLWK...',
  '..KWLLKLLKLLWK..',
  '.KWWLLLLLLLLWWK.',
  'KKRRKKKKKKKKRRKK',
  '.KRRRGGGGGRRRK..',
  '..KRRGGGGGRRK...',
  '...KKGGGGKK.....',
  '....KGGGGK......',
  '....KMMMMK......',
  '....KMKKMK......',
  '....KMMMMK......',
  '.....KKKK.......',
];

const KOOPA = [
  '......KKKK......',
  '.....KNNNNK.....',
  '....KNNNNNNK....',
  '...KNNWWNNNNK...',
  '..KNNWWWNNNNNK..',
  '.KNNNNNNNNNNNK..',
  'KNNNNNNNNNNNNNK.',
  'KNNNKKNNNNKKNNK.',
  'KNNNNNNNNNNNNNK.',
  '.KNNNNNNNNNNNK..',
  '..KKSSSSSSSSKK..',
  '...KSSSSSSSSK...',
  '...KSSKKKKSSK...',
  '....KSSSSSSK....',
  '.....KK..KK.....',
  '....KKK..KKK....',
];

const KOOPA_SHELL = [
  '................',
  '................',
  '......KKKK......',
  '....KKNNNNKK....',
  '...KNNNNNNNNK...',
  '..KNNWWNNNNNNK..',
  '.KNNNNNNNNNNNNK.',
  'KNNNNNNNNNNNNNNK',
  'KNNNNKKNNNNKKNNK',
  'KNNNNNNNNNNNNNNK',
  '.KNNNNNNNNNNNNK.',
  '..KKNNNNNNNNKK..',
  '....KKKKKKKK....',
  '................',
  '................',
  '................',
];

const BOWSER = [
  '........KKKK........',
  '.......KLLLLK.......',
  '......KLLLLLLK......',
  '.....KLLKKKKLLK.....',
  '....KLLKWWWWKLLK....',
  '...KLLKWWWWWWKLLK...',
  '..KLLLLKKKKKKLLLLK..',
  '.KLLLLLLLLLLLLLLLLK.',
  'KLLLVVVVVVVVVVVVLLLK',
  'KLLLVVKVVVVVKVVVLLLK',
  'KLLLVVVVVVVVVVVVLLLK',
  'KLLLLGGGGGGGGLLLLLLK',
  '.KLLLGGGGGGGLLLLLK..',
  '..KKLLGGGGGLLLKK....',
  '....KKKKKKKKKK......',
  '...KK..........KK...',
];

const AXE = [
  '........KK......',
  '.......KHHK.....',
  '......KHHHHK....',
  '.....KHHHHHHK...',
  '....KHHHHHHHHK..',
  '...KHHHHHHHKK...',
  '..KHHHHHHKK.....',
  '.KHHHHHKK.......',
  'KBBBBKK.........',
  'KBBBBK..........',
  '.KBBBK..........',
  '..KBBK..........',
  '...KBK..........',
  '....KK..........',
  '................',
  '................',
];

const FIREBALL = [
  '................',
  '......KK........',
  '.....KFFK.......',
  '....KFLFFK......',
  '...KFFLLFFK.....',
  '...KFLWWLFK.....',
  '...KFFLLFFK.....',
  '....KFLFFK......',
  '.....KFFK.......',
  '......KK........',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

/** 16×24 super plumber — inspired silhouette, original pixels */
const BIG_IDLE = [
  '.....RRRRR......',
  '....RRRRRRRR....',
  '....BBBSSKS.....',
  '...BSBSSSKSK....',
  '...BSBBSSSKS....',
  '...BBSSSSS......',
  '....SSSSSSS.....',
  '...RRRRRRRRR....',
  '..RRRRBRRRBRR...',
  '.RRRRRRBBBBBR...',
  '.SSRRRRBBBBSS...',
  '.SSSSBBBBBSSS...',
  '.SSSSBBBBBSSS...',
  '..SS.BBBBB.SS...',
  '..BB.......BB...',
  '.BBB.......BBB..',
  '.BB.........BB..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const BIG_WALK1 = [
  '.....RRRRR......',
  '....RRRRRRRR....',
  '....BBBSSKS.....',
  '...BSBSSSKSK....',
  '...BSBBSSSKS....',
  '...BBSSSSS......',
  '....SSSSSSS.....',
  '...RRRRRRRRR....',
  '..RRRRBRRRBRR...',
  '.RRRRRRBBBBBR...',
  '.SSRRRRBBBBSS...',
  '.SSSSBBBBBSSS...',
  '.SSSSBBBBBSSS...',
  '..BB..BBB..BB...',
  '.BBB.......BBB..',
  'BB...........BB.',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const BIG_WALK2 = [
  '.....RRRRR......',
  '....RRRRRRRR....',
  '....BBBSSKS.....',
  '...BSBSSSKSK....',
  '...BSBBSSSKS....',
  '...BBSSSSS......',
  '....SSSSSSS.....',
  '...RRRRRRRRR....',
  '..RRRRBRRRBRR...',
  '.RRRRRRBBBB.....',
  '.SSRRRRBBBB.....',
  '.SSSSBBBBB......',
  '.SSSSBBBBB......',
  '..BB...BB.......',
  '.BBB...BBB......',
  '.BB.....BB......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const BIG_JUMP = [
  '.....RRRRR......',
  '....RRRRRRRR....',
  '....BBBSSKS.....',
  '...BSBSSSKSK....',
  '...BSBBSSSKS....',
  '...BBSSSSS......',
  '....SSSSSSS.....',
  '...RRRRRRRRR....',
  '..RRRRBRRRBRR...',
  '.RRRRRRBBBBSS...',
  '.SSRRRRBBBBSSS..',
  '.SSSSBBBBBSSS...',
  '..BB....BB......',
  '.BBB...BBB......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

export function generateExtraTextures(scene: Phaser.Scene) {
  tex(scene, 'mushroom', 32, 32, (g) => paint(g, MUSHROOM, 2));
  tex(scene, 'fireflower', 32, 32, (g) => paint(g, FIREFLOWER, 2));
  tex(scene, 'koopa_0', 32, 32, (g) => paint(g, KOOPA, 2));
  tex(scene, 'koopa_1', 32, 32, (g) => paint(g, KOOPA, 2, 0, 0, true));
  tex(scene, 'koopa_shell', 32, 32, (g) => paint(g, KOOPA_SHELL, 2));
  tex(scene, 'bowser', 64, 64, (g) => paint(g, BOWSER, 2));
  tex(scene, 'axe', 32, 32, (g) => paint(g, AXE, 2));
  tex(scene, 'fireball', 16, 16, (g) => paint(g, FIREBALL, 1));
  tex(scene, 'fireball_1', 16, 16, (g) => paint(g, FIREBALL, 1, 0, 0, true));

  // Super Mario — real tall frames (not scaled small idle)
  tex(scene, 'mario_b_idle', 32, 48, (g) => paint(g, BIG_IDLE, 2));
  tex(scene, 'mario_big_walk1', 32, 48, (g) => paint(g, BIG_WALK1, 2));
  tex(scene, 'mario_big_walk2', 32, 48, (g) => paint(g, BIG_WALK2, 2));
  tex(scene, 'mario_big_walk3', 32, 48, (g) => paint(g, BIG_WALK1, 2, 0, 0, true));
  tex(scene, 'mario_big_jump', 32, 48, (g) => paint(g, BIG_JUMP, 2));

  // Fire suit = same poses, red→orange remap on hat/shirt
  const fireRemap = { R: 'F' };
  tex(scene, 'mario_f_idle', 32, 48, (g) => paint(g, BIG_IDLE, 2, 0, 0, false, fireRemap));
  tex(scene, 'mario_f_walk1', 32, 48, (g) => paint(g, BIG_WALK1, 2, 0, 0, false, fireRemap));
  tex(scene, 'mario_f_walk2', 32, 48, (g) => paint(g, BIG_WALK2, 2, 0, 0, false, fireRemap));
  tex(scene, 'mario_f_walk3', 32, 48, (g) => paint(g, BIG_WALK1, 2, 0, 0, true, fireRemap));
  tex(scene, 'mario_f_jump', 32, 48, (g) => paint(g, BIG_JUMP, 2, 0, 0, false, fireRemap));

  // Alias for Coin.ts
  tex(scene, 'coin_0', 32, 32, (g) => {
    // thin spin frame
    g.fillStyle(0xf8d820, 1);
    g.fillRect(12, 4, 8, 24);
    g.fillStyle(0x000000, 1);
    g.fillRect(11, 3, 10, 1);
    g.fillRect(11, 28, 10, 1);
  });

  // Combined pipe for warp zones
  tex(scene, 'pipe', 64, 64, (g) => {
    // top lip
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x00a800, 1);
    g.fillRect(2, 2, 60, 28);
    g.fillStyle(0xb8f818, 1);
    g.fillRect(4, 4, 8, 24);
    // body
    g.fillStyle(0x000000, 1);
    g.fillRect(8, 32, 48, 32);
    g.fillStyle(0x00a800, 1);
    g.fillRect(10, 32, 44, 30);
    g.fillStyle(0xb8f818, 1);
    g.fillRect(12, 32, 6, 30);
  });
}

export function registerExtraAnims(scene: Phaser.Scene) {
  if (!scene.anims.exists('koopa-walk')) {
    scene.anims.create({
      key: 'koopa-walk',
      frames: [{ key: 'koopa_0' }, { key: 'koopa_1' }],
      frameRate: 6,
      repeat: -1,
    });
  }
  if (!scene.anims.exists('koopa-shell')) {
    scene.anims.create({ key: 'koopa-shell', frames: [{ key: 'koopa_shell' }] });
  }
  if (!scene.anims.exists('fireball-spin')) {
    scene.anims.create({
      key: 'fireball-spin',
      frames: [{ key: 'fireball' }, { key: 'fireball_1' }],
      frameRate: 12,
      repeat: -1,
    });
  }
  if (!scene.anims.exists('mario-fire-idle')) {
    scene.anims.create({ key: 'mario-fire-idle', frames: [{ key: 'mario_f_idle' }] });
    scene.anims.create({
      key: 'mario-fire-walk',
      frames: [
        { key: 'mario_f_walk1' },
        { key: 'mario_f_walk2' },
        { key: 'mario_f_walk3' },
      ],
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({ key: 'mario-fire-jump', frames: [{ key: 'mario_f_jump' }] });
  }
}

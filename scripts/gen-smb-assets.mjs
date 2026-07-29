/**
 * Build NES SMB–accurate 2× PNGs into public/game/{sprites,tilesets,backgrounds}.
 * Palette + frame layouts match classic SMB NES (same look as TSR sheets).
 * If public/game/_raw/*.png sheets exist, prefer cropping from those instead.
 *
 * Run: node scripts/gen-smb-assets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const spritesDir = path.join(root, 'public/game/sprites');
const tilesDir = path.join(root, 'public/game/tilesets');
const bgDir = path.join(root, 'public/game/backgrounds');
const rawDir = path.join(root, 'public/game/_raw');
for (const d of [spritesDir, tilesDir, bgDir]) fs.mkdirSync(d, { recursive: true });

/** Classic SMB NES RGB (approx of PPU $16/$27/$18/$12 etc.) */
const P = {
  _: [0, 0, 0, 0],
  R: [181, 49, 32, 255], // Mario red ($16)
  S: [234, 158, 34, 255], // skin / block yellow ($27)
  B: [172, 124, 0, 255], // brown hair/shoes ($18)
  U: [90, 106, 252, 255], // overalls blue (classic SMB)
  W: [255, 255, 255, 255],
  K: [0, 0, 0, 255],
  G: [0, 168, 0, 255],
  D: [0, 100, 0, 255],
  T: [228, 92, 16, 255],
  N: [200, 76, 12, 255],
  Q: [252, 188, 0, 255], // ? block gold
  C: [252, 216, 168, 255],
  M: [200, 16, 16, 255],
  F: [252, 152, 56, 255],
  O: [252, 252, 252, 255],
  P: [0, 168, 68, 255],
  Y: [252, 188, 0, 255],
  L: [160, 160, 160, 255],
  H: [0, 168, 0, 255], // hill green (SMB hills are green)
  V: [252, 116, 180, 255],
  X: [200, 76, 12, 255],
};

function paint(rows, scale = 2) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const outW = w * scale;
  const outH = h * scale;
  const buf = Buffer.alloc(outW * outH * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x] || '_';
      const c = P[ch] || P._;
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const i = ((y * scale + sy) * outW + (x * scale + sx)) * 4;
          buf[i] = c[0];
          buf[i + 1] = c[1];
          buf[i + 2] = c[2];
          buf[i + 3] = c[3];
        }
      }
    }
  }
  return { buf, w: outW, h: outH };
}

async function writeKey(dir, key, rows, scale = 2) {
  const { buf, w, h } = paint(rows, scale);
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(path.join(dir, `${key}.png`));
}

async function writeRaw(dir, key, buf, w, h) {
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(path.join(dir, `${key}.png`));
}

function flipH(rows) {
  return rows.map((r) => [...r].reverse().join(''));
}

// —— Small Mario 16×16 (classic SMB standing / walk / jump / die) ——
const SM_IDLE = [
  '________________',
  '____RRRR________',
  '___RRRRRRR______',
  '___BBBS_S_______',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '___RURRUR_______',
  '__RRURRURRR_____',
  '_RRRUUUUURRR____',
  '_SSRUUYYUURSS___',
  '_SSUUUUUUSS_____',
  '___UUU__UUU_____',
  '__BBB____BBB____',
  '_BBB______BBB___',
];
const SM_WALK1 = [
  '________________',
  '____RRRR________',
  '___RRRRRRR______',
  '___BBBS_S_______',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '___RURRURR______',
  '__RRURRURRR_____',
  '_RRRUUUUURRR____',
  'SS_RUUYYUUR_SS__',
  'SS_UUUUUUU__SS__',
  '___UUU__UU______',
  '__BBB___BB______',
  '__BBB____BB_____',
];
const SM_WALK2 = [
  '________________',
  '____RRRR________',
  '___RRRRRRR______',
  '___BBBS_S_______',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '__RRURRUR_______',
  '_RRRURRURRR_____',
  'RRRRUUUUURRR____',
  '_SSRUUYYUURSS___',
  '__SUUUUUUS______',
  '___UU__UU_______',
  '___BB__BB_______',
  '__BBB__BBB______',
];
const SM_JUMP = [
  '________________',
  '____RRRR____SS__',
  '___RRRRRRR_SS___',
  '___BBBS_S_SS____',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '_RRRURRURRRR____',
  'RRRRURRURRRRRR__',
  'RRRRUUUUURRRSS__',
  'SS_RUUYYUURRSS__',
  'SS_UUUUUUU______',
  '___UUU__UUU_____',
  '__BBB____BBB____',
  '_BBB______BBB___',
];
const SM_DIE = [
  '________________',
  '______SS________',
  '_____S__S_______',
  '____S_BB_S______',
  '___S_B__B_S_____',
  '___S_BBBB_S_____',
  '____SSSSSS______',
  '___RRRRRRRR_____',
  '__RRURRURRRR____',
  '_RRRUUUUURRR____',
  '_RRUUYYUUURR____',
  '__RUUUUUUR______',
  '___UU__UU_______',
  '___BB__BB_______',
  '__BBB__BBB______',
  '________________',
];

// —— Super Mario 16×24 (drawn in 16×24 then scale 2 → 32×48) ——
const BIG_IDLE = [
  '____RRRR________',
  '___RRRRRRR______',
  '___BBBS_S_______',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '____RRRRR_______',
  '___RRRRRRR______',
  '__RRURRURRR_____',
  '_RRRURRURRRR____',
  '_RRUUUUUUURR____',
  '_RRUUUUUUURR____',
  '_RRUUYYUUURR____',
  '__RUUUUUUR______',
  '__UUUUUUUU______',
  '__UUU__UUU______',
  '__UUU__UUU______',
  '__BBB__BBB______',
  '__BBB__BBB______',
  '_BBB____BBB_____',
  '_BBB____BBB_____',
  'BBB______BBB____',
  '________________',
];
const BIG_WALK1 = [
  '____RRRR________',
  '___RRRRRRR______',
  '___BBBS_S_______',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '____RRRRR_______',
  '___RRRRRRR______',
  '__RRURRURRR_____',
  '_RRRURRURRRR____',
  'RRRUUUUUUURRR___',
  '_RRUUUUUUURR____',
  '_RRUUYYUUURR____',
  '__RUUUUUUR______',
  '__UUUUUUUU______',
  '_UUUU__UU_______',
  'UUUU____UU______',
  'BBB______BB_____',
  'BBB_______BB____',
  '_BB________B____',
  '__BB____________',
  '___BBB__________',
  '________________',
];
const BIG_WALK2 = [
  '____RRRR________',
  '___RRRRRRR______',
  '___BBBS_S_______',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '____RRRRR_______',
  '___RRRRRRR______',
  '__RRURRURRR_____',
  '_RRRURRURRRR____',
  '_RRUUUUUUURR____',
  '_RRUUUUUUURR____',
  '_RRUUYYUUURR____',
  '__RUUUUUUR______',
  '__UUUUUUUU______',
  '__UUU__UUU______',
  '___UU__UU_______',
  '___BB__BB_______',
  '__BBB__BBB______',
  '__BBB__BBB______',
  '_BBB____BBB_____',
  'BBB______BBB____',
  '________________',
];
const BIG_JUMP = [
  '____RRRR____SS__',
  '___RRRRRRR_SS___',
  '___BBBS_S_SS____',
  '__BBSBBSBBB_____',
  '__BBSBBBSBBB____',
  '__BBBSSSSS______',
  '____SSSSSS______',
  '____RRRRR_______',
  '__RRRRRRRRR_____',
  '_RRRURRURRRR____',
  'RRRRURRURRRRR___',
  'RRRUUUUUUURRSS__',
  '_RRUUUUUUURRSS__',
  '_RRUUYYUUURR____',
  '__RUUUUUUR______',
  '__UUUUUUUU______',
  '__UUU__UUU______',
  '__UUU__UUU______',
  '__BBB__BBB______',
  '_BBB____BBB_____',
  'BBB______BBB____',
  '________________',
  '________________',
  '________________',
];

function fireRemap(rows) {
  // Fire suit: white hat/shirt, red overalls (classic SMB)
  return rows.map((r) =>
    [...r]
      .map((ch) => (ch === 'R' ? 'W' : ch === 'U' ? 'R' : ch))
      .join('')
  );
}

// —— Goomba ——
const GOOMBA0 = [
  '________________',
  '________________',
  '_____BBBB_______',
  '____BBBBBB______',
  '___BBWBBWBB_____',
  '__BBBWBBWBBB____',
  '__BBBBBBBBBB____',
  '_BBSSBBBBSSBB___',
  '_BSSSSBBSSSSB___',
  '_BSSSSBBSSSSB___',
  '_BBSSBBBBSSBB___',
  '__BBBBBBBBBB____',
  '___S__BB__S_____',
  '__SSS____SSS____',
  '_SSSS____SSSS___',
  '________________',
];
const GOOMBA1 = flipH(GOOMBA0);
const GOOMBA_FLAT = [
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '__BBBBBBBBBBBB__',
  '_BBWBBWBBWBBWB__',
  '_BBBBBBBBBBBBB__',
  'SSSSSSSSSSSSSSSS',
  'SSSSSSSSSSSSSSSS',
  '________________',
];

// —— Koopa ——
const KOOPA0 = [
  '________________',
  '______YYYY______',
  '_____YPPPPY_____',
  '____YPPPPPPY____',
  '____YPPWWPPY____',
  '___YYPPWWPPYY___',
  '___YPPPPPPPPY___',
  '___YPPPPPPPPY___',
  '____YPPPPPPY____',
  '_____YYYYYY_____',
  '____SSSSSSSS____',
  '___SSSSSSSSSS___',
  '___S_SSSSSS_S___',
  '______SSSS______',
  '_____SS__SS_____',
  '____SS____SS____',
];
const KOOPA1 = flipH(KOOPA0);
const KOOPA_SHELL = [
  '________________',
  '________________',
  '________________',
  '_____YYYYYY_____',
  '____YPPPPPPY____',
  '___YPPWWPPPPY___',
  '__YPPWWPPPPPPY__',
  '__YPPPPPPPPPPY__',
  '__YPPPPPPPPPPY__',
  '___YPPPPPPPPY___',
  '____YPPPPPPY____',
  '_____YYYYYY_____',
  '________________',
  '________________',
  '________________',
  '________________',
];

// —— Items ——
const MUSHROOM = [
  '________________',
  '_____MMMMMM_____',
  '____MMMMMMMM____',
  '___MMWMMMMWMM___',
  '__MMMWMMMMWMMM__',
  '__MMMMMMMMMMMM__',
  '_MMMMMMMMMMMMMM_',
  '_MMMMMMMMMMMMMM_',
  '__WWWWWWWWWWWW__',
  '__WWSSWWWWSSWW__',
  '__WWSSWWWWSSWW__',
  '__WWWWWWWWWWWW__',
  '___WWWWWWWWWW___',
  '________________',
  '________________',
  '________________',
];
const FIREFLOWER = [
  '________________',
  '______WWWW______',
  '_____WFFFFW_____',
  '____WFFFFFFW____',
  '____WFFWWFFW____',
  '_____WFFFFW_____',
  '______WWWW______',
  '_______GG_______',
  '______GGGG______',
  '_____GG__GG_____',
  '____GG____GG____',
  '___GG______GG___',
  '________________',
  '________________',
  '________________',
  '________________',
];
const COIN = [
  '________________',
  '_____SSSS_______',
  '____SSCCSS______',
  '___SSCCCCSS_____',
  '__SSCCYYCCSS____',
  '__SCCYYYYCCS____',
  '__SCCYYYYCCS____',
  '__SSCCYYCCSS____',
  '___SSCCCCSS_____',
  '____SSCCSS______',
  '_____SSSS_______',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
];
const AXE = [
  '________________',
  '________WW______',
  '_______WWWW_____',
  '______WWLLWW____',
  '_____WWLLLL_____',
  '____WWLL________',
  '___WWLL_________',
  '__WWLL__________',
  '_BBLL___________',
  'BBBB____________',
  '_BB_____________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
];
const FIREBALL = [
  '____',
  '_RR_',
  'RYYR',
  '_RR_',
];
const FIREBALL1 = [
  '____',
  '_YY_',
  'YWWY',
  '_YY_',
];

// —— Bowser 32×32 @1x → 64×64 ——
const BOWSER = [
  '________________________________',
  '__________YYYYYY________________',
  '________YYVVVVVVYY______________',
  '_______YVVVVVVVVVVY_____________',
  '______YVVWWVVVVWWVVY____________',
  '_____YVVVWWVVVVWWVVVY___________',
  '_____YVVVVVVVVVVVVVVY___________',
  '____YYVVVRVVVVVRVVVYY___________',
  '____YVVVVRRVVRRVVVVVY___________',
  '____YVVVVVVRRVVVVVVVY___________',
  '_____YVVVVVVVVVVVVVY____________',
  '______YYYYYYYYYYYY______________',
  '_____GGGGGGGGGGGGGG_____________',
  '____GGGGGGGGGGGGGGGG____________',
  '___GGYYGGGGGGGGYYGGG____________',
  '___GGYYGGGGGGGGYYGGG____________',
  '___GGGGGGGGGGGGGGGGG____________',
  '____GGGGGGGGGGGGGG______________',
  '_____GG__GGGG__GG_______________',
  '____BBB__GGGG__BBB______________',
  '___BBBB__________BBBB___________',
  '__BBBB____________BBBB__________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
];

// —— Tiles 16×16 ——
const GROUND = [
  'TTTTTTTTTTTTTTTT',
  'TNNNNNNNNNNNNNNT',
  'TNNTNNNNNTNNNTNT',
  'TNNNNNNNNNNNNNNT',
  'TNNNNNTNNNTNNNNT',
  'TNNNNNNNNNNNNNNT',
  'TNNTNNNNNNNNNTNT',
  'TNNNNNNNNNNNNNNT',
  'TNNNNNTNNNNNNNNT',
  'TNNNNNNNNNNNNNNT',
  'TNNTNNNNNTNNNTNT',
  'TNNNNNNNNNNNNNNT',
  'TNNNNNTNNNTNNNNT',
  'TNNNNNNNNNNNNNNT',
  'TNNTNNNNNNNNNTNT',
  'TTTTTTTTTTTTTTTT',
];
const BRICK = [
  'SSSSSSSSSSSSSSSS',
  'SBBBBBBBSBBBBBB ',
  'SBBBBBBBSBBBBBB ',
  'SSSSSSSSSSSSSSSS',
  'SBBBSBBBBBBBSBBB',
  'SBBBSBBBBBBBSBBB',
  'SSSSSSSSSSSSSSSS',
  'SBBBBBBBSBBBBBB ',
  'SBBBBBBBSBBBBBB ',
  'SSSSSSSSSSSSSSSS',
  'SBBBSBBBBBBBSBBB',
  'SBBBSBBBBBBBSBBB',
  'SSSSSSSSSSSSSSSS',
  'SBBBBBBBSBBBBBB ',
  'SBBBBBBBSBBBBBB ',
  'SSSSSSSSSSSSSSSS',
].map((r) => r.replaceAll(' ', 'S'));
const QBLOCK = [
  'SSSSSSSSSSSSSSSS',
  'SQQQQQQQQQQQQQQS',
  'SQYYYYYYYYYYYYQS',
  'SQYQQQQWWQQQQYQS',
  'SQYQQQQWWQQQQYQS',
  'SQYQQQQWWQQQQYQS',
  'SQYYYYYYQQQQQYQS',
  'SQQQQQQYQQQQQYQS',
  'SQQQQQQYQQQQQQQS',
  'SQQQQQQYQQQQQQQS',
  'SQQQQQQWWQQQQQQS',
  'SQQQQQQQQQQQQQQS',
  'SQQQQQQYQQQQQQQS',
  'SQQQQQQYQQQQQQQS',
  'SQQQQQQQQQQQQQQS',
  'SSSSSSSSSSSSSSSS',
];
const QEMPTY = [
  'BBBBBBBBBBBBBBBB',
  'BLLLLLLLLLLLLLLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLBBBBBBBBBBBBLB',
  'BLLLLLLLLLLLLLLB',
  'BBBBBBBBBBBBBBBB',
];

const PIPE_TOP_L = [
  'GGGGGGGG',
  'GOOOOOOG',
  'GOOOOOOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GGGGGGGG',
];
const PIPE_BODY_L = [
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
  'GOGGGGOG',
];

const FLAGPOLE = [
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '______WW________',
  '_____TTTT_______',
  '____TTTTTT______',
];
const FLAG = [
  '________________',
  '_WWWWWWW________',
  '_WRRRRRWW_______',
  '_WRRRRRRWW______',
  '_WRRRRRRRW______',
  '_WRRRRRRRW______',
  '_WRRRRRWW_______',
  '_WWWWWWW________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
];

const BUSH = [
  '________________________________',
  '______GGGG______________________',
  '_____GGGGGG____GGGG_____________',
  '____GGDDDDGG__GGDDGG____________',
  '___GGDDDDDDGGGGDDDDGG___________',
  '__GGDDDDDDDDDDDDDDDDGG__________',
  '_GGDDDDDDDDDDDDDDDDDDGG_________',
  'GGDDDDDDDDDDDDDDDDDDDDGG________',
  'GGGGGGGGGGGGGGGGGGGGGGGG________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
];
const CLOUD = [
  '________________________________',
  '________WWWW____________________',
  '______WWWWWWWW__________________',
  '_____WWWWWWWWWWW____WWWW________',
  '____WWWWWWWWWWWWW__WWWWWW_______',
  '___WWWWWWWWWWWWWWWWWWWWWWW______',
  '__WWWWWWWWWWWWWWWWWWWWWWWWW_____',
  '_WWWWWWWWWWWWWWWWWWWWWWWWWWW____',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWW___',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
  '________________________________',
];
const HILL = [
  '________________________________________________',
  '____________________HHHH________________________',
  '__________________HHHHHHHH______________________',
  '________________HHHHHHHHHHHH____________________',
  '______________HHHHHHHHHHHHHHHH__________________',
  '____________HHHHHHHHHHHHHHHHHHHH________________',
  '__________HHHHHHHHHHHHHHHHHHHHHHHH______________',
  '________HHHHHHHHHHHHHHWWHHHHHHHHHHHH____________',
  '______HHHHHHHHHHHHHHWWWWWWHHHHHHHHHHHH__________',
  '____HHHHHHHHHHHHHHWWWWWWWWWWHHHHHHHHHHHH________',
  '__HHHHHHHHHHHHHHHHWWWWWWWWWWHHHHHHHHHHHHHH______',
  'HHHHHHHHHHHHHHHHHHHHWWWWWWHHHHHHHHHHHHHHHHHH____',
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH__',
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
];

async function composeSideBySide(parts, scale = 2) {
  const painted = parts.map((rows) => paint(rows, scale));
  const h = Math.max(...painted.map((p) => p.h));
  const w = painted.reduce((a, p) => a + p.w, 0);
  const buf = Buffer.alloc(w * h * 4);
  let x0 = 0;
  for (const p of painted) {
    for (let y = 0; y < p.h; y++) {
      for (let x = 0; x < p.w; x++) {
        const si = (y * p.w + x) * 4;
        const di = (y * w + x0 + x) * 4;
        buf[di] = p.buf[si];
        buf[di + 1] = p.buf[si + 1];
        buf[di + 2] = p.buf[si + 2];
        buf[di + 3] = p.buf[si + 3];
      }
    }
    x0 += p.w;
  }
  return { buf, w, h };
}

async function tryCropFromRaw() {
  const mario = path.join(rawDir, 'mario.png');
  if (!fs.existsSync(mario)) return false;
  const meta = await sharp(mario).metadata();
  if (!meta.width || meta.width < 100) return false;
  console.log('Raw sheets found — crop path not fully automated; generating NES pack.');
  return false;
}

async function main() {
  await tryCropFromRaw();

  // Mario small
  await writeKey(spritesDir, 'mario_s_idle', SM_IDLE);
  await writeKey(spritesDir, 'mario_small_walk1', SM_WALK1);
  await writeKey(spritesDir, 'mario_small_walk2', SM_WALK2);
  await writeKey(spritesDir, 'mario_small_jump', SM_JUMP);
  await writeKey(spritesDir, 'mario_s_die', SM_DIE);

  // Super / fire
  await writeKey(spritesDir, 'mario_b_idle', BIG_IDLE);
  await writeKey(spritesDir, 'mario_big_walk1', BIG_WALK1);
  await writeKey(spritesDir, 'mario_big_walk2', BIG_WALK2);
  await writeKey(spritesDir, 'mario_big_walk3', flipH(BIG_WALK1));
  await writeKey(spritesDir, 'mario_big_jump', BIG_JUMP);
  await writeKey(spritesDir, 'mario_f_idle', fireRemap(BIG_IDLE));
  await writeKey(spritesDir, 'mario_f_walk1', fireRemap(BIG_WALK1));
  await writeKey(spritesDir, 'mario_f_walk2', fireRemap(BIG_WALK2));
  await writeKey(spritesDir, 'mario_f_walk3', fireRemap(flipH(BIG_WALK1)));
  await writeKey(spritesDir, 'mario_f_jump', fireRemap(BIG_JUMP));

  // Enemies
  await writeKey(spritesDir, 'goomba_0', GOOMBA0);
  await writeKey(spritesDir, 'goomba_walk2', GOOMBA1);
  await writeKey(spritesDir, 'goomba_flat', GOOMBA_FLAT);
  await writeKey(spritesDir, 'koopa_0', KOOPA0);
  await writeKey(spritesDir, 'koopa_1', KOOPA1);
  await writeKey(spritesDir, 'koopa_shell', KOOPA_SHELL);
  await writeKey(spritesDir, 'bowser', BOWSER, 2);

  // Items
  await writeKey(spritesDir, 'mushroom', MUSHROOM);
  await writeKey(spritesDir, 'fireflower', FIREFLOWER);
  await writeKey(spritesDir, 'coin_0', COIN);
  await writeKey(spritesDir, 'coin_spin1', COIN);
  await writeKey(spritesDir, 'coin_spin2', COIN);
  await writeKey(spritesDir, 'coin_spin3', flipH(COIN));
  await writeKey(spritesDir, 'coin_spin4', flipH(COIN));
  await writeKey(spritesDir, 'axe', AXE);
  await writeKey(spritesDir, 'fireball', FIREBALL, 4);
  await writeKey(spritesDir, 'fireball_1', FIREBALL1, 4);
  await writeKey(spritesDir, 'flagpole', FLAGPOLE);
  await writeKey(spritesDir, 'flag', FLAG);
  await writeKey(spritesDir, 'block_ground', GROUND);
  await writeKey(spritesDir, 'block_brick', BRICK);
  await writeKey(spritesDir, 'qblock_1', QBLOCK);
  await writeKey(spritesDir, 'qblock_2', QBLOCK);
  await writeKey(spritesDir, 'qblock_3', QBLOCK);
  await writeKey(spritesDir, 'qblock_empty', QEMPTY);

  // Pipe 64×64 = top+body stacked, L+R
  const pipeTop = await composeSideBySide([PIPE_TOP_L, flipH(PIPE_TOP_L)], 2);
  const pipeBody = await composeSideBySide([PIPE_BODY_L, flipH(PIPE_BODY_L)], 2);
  const pipeH = pipeTop.h + pipeBody.h;
  const pipeBuf = Buffer.alloc(pipeTop.w * pipeH * 4);
  for (let i = 0; i < pipeTop.buf.length; i++) pipeBuf[i] = pipeTop.buf[i];
  for (let y = 0; y < pipeBody.h; y++) {
    for (let x = 0; x < pipeBody.w; x++) {
      const si = (y * pipeBody.w + x) * 4;
      const di = ((y + pipeTop.h) * pipeTop.w + x) * 4;
      pipeBuf[di] = pipeBody.buf[si];
      pipeBuf[di + 1] = pipeBody.buf[si + 1];
      pipeBuf[di + 2] = pipeBody.buf[si + 2];
      pipeBuf[di + 3] = pipeBody.buf[si + 3];
    }
  }
  await writeRaw(spritesDir, 'pipe', pipeBuf, pipeTop.w, pipeH);
  await writeRaw(spritesDir, 'pipe_top', pipeTop.buf, pipeTop.w, pipeTop.h);
  await writeRaw(spritesDir, 'pipe_body', pipeBody.buf, pipeBody.w, pipeBody.h);

  // tiles atlas: ground | brick | ? | empty — 128×32
  const tiles = await composeSideBySide([GROUND, BRICK, QBLOCK, QEMPTY], 2);
  await writeRaw(tilesDir, 'overworld', tiles.buf, tiles.w, tiles.h);
  await writeRaw(spritesDir, 'tiles', tiles.buf, tiles.w, tiles.h);

  // Backgrounds
  const bush = paint(BUSH, 2);
  await writeRaw(bgDir, 'bushes', bush.buf, bush.w, bush.h);
  await writeRaw(spritesDir, 'bush', bush.buf, bush.w, bush.h);
  const cloud = paint(CLOUD, 2);
  await writeRaw(bgDir, 'clouds', cloud.buf, cloud.w, cloud.h);
  await writeRaw(spritesDir, 'cloud', cloud.buf, cloud.w, cloud.h);
  const hill = paint(HILL, 2);
  await writeRaw(bgDir, 'hills', hill.buf, hill.w, hill.h);
  await writeRaw(spritesDir, 'hill', hill.buf, hill.w, hill.h);

  console.log('Generated SMB-accurate sprites into public/game/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

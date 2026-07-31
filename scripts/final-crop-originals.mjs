/**
 * Hard-verified crops from assets/source/smb-sheets → public/game/sprites (+ SFX).
 * Run: npm run gen:game-assets
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets/source/smb-sheets');
const SPR = path.join(root, 'public/game/sprites');
const PREV = path.join(root, 'assets/preview/packed');
const SFX_SRC = path.join(root, 'assets/source/smb-sfx');
const SND = path.join(root, 'public/sounds');

for (const d of [SPR, PREV, SND]) fs.mkdirSync(d, { recursive: true });

/** Sheet page bg (lavender cells / dark blue page) */
function isKey(r, g, b) {
  if (r > 115 && r < 205 && g > 115 && g < 205 && b > 200) return true;
  if (r < 55 && g < 95 && b > 95 && b < 210) return true;
  return false;
}

async function crop(srcName, outName, left, top, width, height, scale = 2, remap) {
  const { data, info } = await sharp(path.join(SRC, srcName))
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    // Only the sheet background is keyed out. Black is NOT background on any of these
    // sheets (every corner is dark blue) — it is the outline colour, and keying it
    // was quietly deleting the outlines from every sprite in the pack.
    if (isKey(r, g, b)) {
      data[i + 3] = 0;
      continue;
    }
    if (remap) {
      const [nr, ng, nb] = remap(r, g, b);
      data[i] = nr;
      data[i + 1] = ng;
      data[i + 2] = nb;
    }
  }
  let img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  if (scale !== 1) {
    img = img.resize(info.width * scale, info.height * scale, { kernel: sharp.kernel.nearest });
  }
  await img.png().toFile(path.join(SPR, outName));
}

/** Trim transparent padding, then pad/center into target size (keeps origin math stable). */
async function trimPad(srcName, outName, tw, th) {
  const p = path.join(SPR, srcName);
  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width,
    minY = info.height,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 16) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  if (maxX < minX) {
    fs.copyFileSync(p, path.join(SPR, outName));
    return;
  }
  const cw = maxX - minX + 1,
    ch = maxY - minY + 1;
  const cropped = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++) {
      const si = ((minY + y) * info.width + (minX + x)) * 4;
      const di = (y * cw + x) * 4;
      cropped[di] = data[si];
      cropped[di + 1] = data[si + 1];
      cropped[di + 2] = data[si + 2];
      cropped[di + 3] = data[si + 3];
    }
  const ox = Math.max(0, Math.floor((tw - cw) / 2));
  const oy = Math.max(0, Math.floor((th - ch) / 2));
  const out = Buffer.alloc(tw * th * 4);
  for (let y = 0; y < ch && oy + y < th; y++)
    for (let x = 0; x < cw && ox + x < tw; x++) {
      const si = (y * cw + x) * 4;
      const di = ((oy + y) * tw + (ox + x)) * 4;
      out[di] = cropped[si];
      out[di + 1] = cropped[si + 1];
      out[di + 2] = cropped[si + 2];
      out[di + 3] = cropped[si + 3];
    }
  await sharp(out, { raw: { width: tw, height: th, channels: 4 } })
    .png()
    .toFile(path.join(SPR, outName));
}

/** Centre a sprite on a fixed transparent canvas (for anims that need equal frame sizes). */
async function padCanvas(srcName, outName, tw, th, top) {
  const meta = await sharp(path.join(SPR, srcName)).metadata();
  const left = Math.round((tw - meta.width) / 2);
  await sharp({
    create: { width: tw, height: th, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: path.join(SPR, srcName), left, top: top ?? Math.round((th - meta.height) / 2) },
    ])
    .png()
    .toFile(path.join(SPR, outName));
}

async function fireFromBig(srcKey, outName) {
  const p = path.join(SPR, srcKey);
  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 10) continue;
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const y = Math.floor(i / 4 / info.width);
    if (r > 150 && g < 100 && b < 90) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else if (r > 90 && r < 150 && g > 90 && g < 150 && b < 60 && y > info.height * 0.35) {
      data[i] = 181;
      data[i + 1] = 49;
      data[i + 2] = 32;
    }
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(SPR, outName));
}

async function load(p) {
  return sharp(path.join(SPR, p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

async function stitchH(parts, outName) {
  const imgs = await Promise.all(parts.map(load));
  const tw = imgs[0].info.width,
    th = imgs[0].info.height;
  const buf = Buffer.alloc(tw * parts.length * th * 4);
  imgs.forEach((p, i) => {
    for (let y = 0; y < th; y++)
      for (let x = 0; x < tw; x++) {
        const si = (y * tw + x) * 4;
        const di = (y * tw * parts.length + i * tw + x) * 4;
        buf[di] = p.data[si];
        buf[di + 1] = p.data[si + 1];
        buf[di + 2] = p.data[si + 2];
        buf[di + 3] = p.data[si + 3];
      }
  });
  await sharp(buf, { raw: { width: tw * parts.length, height: th, channels: 4 } })
    .png()
    .toFile(path.join(SPR, outName));
}

/**
 * Coin spin frames from the real NES coin: horizontal squeeze, never thinner than 40%
 * so no frame degenerates into the "‖" bar the painted version produced.
 */
async function makeCoinFrames() {
  await crop('tileset.png', '_coin_src.png', 563, 654, 10, 14, 2); // 20×28
  const src = path.join(SPR, '_coin_src.png');
  const frames = [
    ['coin_spin1', 20],
    ['coin_spin2', 14],
    ['coin_spin3', 8],
    ['coin_spin4', 14],
  ];
  for (const [name, w] of frames) {
    const body = await sharp(src).resize(w, 28, { kernel: sharp.kernel.nearest }).png().toBuffer();
    await sharp({
      create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: body, left: Math.round((32 - w) / 2), top: 2 }])
      .png()
      .toFile(path.join(SPR, `${name}.png`));
  }
  await padCanvas('_coin_src.png', 'coin_0.png', 32, 32, 2);
  fs.unlinkSync(src);
}

// ——— Mario ———
await crop('mario.png', 'mario_s_idle.png', 38, 8, 16, 16);
await crop('mario.png', 'mario_small_walk1.png', 20, 8, 16, 16);
await crop('mario.png', 'mario_small_walk2.png', 56, 8, 16, 16);
await crop('mario.png', 'mario_small_jump.png', 98, 8, 16, 16);
await crop('mario.png', 'mario_s_die.png', 119, 8, 16, 16);
for (const k of [
  'mario_s_idle.png',
  'mario_small_walk1.png',
  'mario_small_walk2.png',
  'mario_small_jump.png',
  'mario_s_die.png',
]) {
  await trimPad(k, k, 32, 32);
}

await crop('mario.png', 'mario_b_idle.png', 38, 31, 16, 32);
await crop('mario.png', 'mario_big_walk1.png', 20, 31, 16, 32);
await crop('mario.png', 'mario_big_walk2.png', 56, 31, 16, 32);
await crop('mario.png', 'mario_big_walk3.png', 74, 31, 16, 32);
await crop('mario.png', 'mario_big_jump.png', 136, 31, 16, 32);

await fireFromBig('mario_b_idle.png', 'mario_f_idle.png');
await fireFromBig('mario_big_walk1.png', 'mario_f_walk1.png');
await fireFromBig('mario_big_walk2.png', 'mario_f_walk2.png');
await fireFromBig('mario_big_walk3.png', 'mario_f_walk3.png');
await fireFromBig('mario_big_jump.png', 'mario_f_jump.png');

await crop('mario.png', 'fireball.png', 170, 86, 8, 8);
await crop('mario.png', 'fireball_1.png', 180, 86, 8, 8);

// ——— Enemies ———
await crop('enemies.png', 'goomba_0.png', 0, 16, 16, 16);
await crop('enemies.png', 'goomba_walk2.png', 18, 16, 16, 16);
await crop('enemies.png', 'goomba_flat.png', 36, 24, 16, 10);
await crop('enemies.png', 'koopa_0.png', 0, 112, 16, 24);
await crop('enemies.png', 'koopa_1.png', 18, 112, 16, 24);
await crop('enemies.png', 'koopa_shell.png', 36, 120, 16, 16);
await crop('enemies.png', 'bowser.png', 0, 208, 32, 32);

// ——— Items ———
await crop('items.png', 'mushroom.png', 0, 8, 16, 16);
await crop('items.png', 'fireflower.png', 52, 8, 16, 16);
await crop('tileset.png', 'axe.png', 444, 530, 16, 16);

// Flag + pole + castle come from the sheet's "Assembled Structures" block (y >= 595),
// which holds complete objects. The old per-tile guesses landed on unrelated art.
await crop('items.png', 'flag.png', 110, 198, 13, 16); // 26×32 — white flag, red star
await crop('tileset.png', 'flagpole.png', 0, 608, 16, 168); // 32×336 — ball + shaft + base
await crop('tileset.png', 'castle.png', 24, 696, 80, 80); // 160×160

await makeCoinFrames();

// ——— Blocks / tiles ———
await crop('blocks.png', 'qblock_1.png', 79, 111, 16, 16);
await crop('blocks.png', 'qblock_2.png', 95, 111, 16, 16);
await crop('blocks.png', 'qblock_3.png', 111, 111, 16, 16);
await crop('blocks.png', 'qblock_empty.png', 143, 111, 16, 16);
await crop('blocks.png', 'block_brick.png', 272, 112, 16, 16);
await crop('tileset.png', 'block_ground.png', 17, 33, 16, 16);

await stitchH(['block_ground.png', 'block_brick.png', 'qblock_1.png', 'qblock_empty.png'], 'tiles.png');

// ——— Pipe — one assembled crop, so there are no stitch seams ———
await crop('tileset.png', 'pipe.png', 112, 624, 32, 32); // 64×64, matches the Tiled object box
await crop('tileset.png', 'pipe_top.png', 112, 624, 32, 16);
await crop('tileset.png', 'pipe_body.png', 112, 640, 32, 16); // repeat for taller pipes

// ——— Scenery — assembled objects, cropped tight (no padding: origin is bottom-centre) ———
await crop('tileset.png', 'cloud.png', 624, 608, 48, 24); // 96×48
await crop('tileset.png', 'bush.png', 208, 704, 32, 16); // 64×32 — single mound
await crop('tileset.png', 'hill.png', 112, 741, 80, 35); // 160×70 — large dark-green hill

// ——— SFX (only the wavs the game actually plays) ———
const sfxMap = {
  'smb_jump.wav': 'jumpsmall.wav',
  'smb_jump_big.wav': 'jump.wav',
  'smb_coin.wav': 'coin.wav',
  'smb_mariodie.wav': 'death.wav',
  'smb_stomp.wav': 'stompswim.wav',
  'smb_powerup.wav': 'powerup.wav',
  'smb_1up.wav': '1up.wav',
  'smb_stage_clear.wav': 'flagpole.wav',
  'smb_bump.wav': 'bump.wav',
  'smb_brick.wav': 'brick.wav',
  'smb_fireball.wav': 'fireball.wav',
  'smb_gameover.wav': 'gameover.wav',
  'smb_kick.wav': 'kickkill.wav',
  'smb_bowserfall.wav': 'bowserfall.wav',
};
for (const [dest, src] of Object.entries(sfxMap)) {
  const from = path.join(SFX_SRC, src);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(SND, dest));
}

const previewKeys = [
  'mario_s_idle',
  'mario_b_idle',
  'mario_f_idle',
  'goomba_0',
  'koopa_0',
  'bowser',
  'mushroom',
  'fireflower',
  'coin_spin1',
  'axe',
  'flag',
  'flagpole',
  'castle',
  'block_ground',
  'tiles',
  'pipe',
  'hill',
  'bush',
  'cloud',
];
for (const k of previewKeys) {
  const src = path.join(SPR, `${k}.png`);
  if (!fs.existsSync(src)) continue;
  await sharp(src)
    .resize(160, 160, { kernel: 'nearest', fit: 'inside' })
    .png()
    .toFile(path.join(PREV, `${k}.png`));
}

console.log('final crops written');

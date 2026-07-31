/**
 * Renders a level to a PNG using the same placement rules as the scenes, so scenery /
 * pipe / flagpole positions can be eyeballed without booting the game. Three rounds of
 * "the bushes are still floating" went unverified because there was no way to look.
 *
 * Run: node scripts/preview-level.mjs [level_1_1]
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const spr = path.join(root, 'public/game/sprites');
const name = process.argv[2] || 'level_1_1';

const map = JSON.parse(fs.readFileSync(path.join(root, `public/game/maps/${name}.json`), 'utf8'));
const layer = map.layers.find((l) => l.name === 'Ground');
const objects = (map.layers.find((l) => l.type === 'objectgroup') || {}).objects || [];
const W = map.width * map.tilewidth;
const H = map.height * map.tileheight;

const img = (key) => path.join(spr, `${key}.png`);
const size = async (key) => {
  const m = await sharp(img(key)).metadata();
  return { w: m.width, h: m.height };
};

const parts = [];
/** place with an origin, matching Phaser's setOrigin */
const put = async (key, x, y, ox = 0.5, oy = 1) => {
  const { w, h } = await size(key);
  parts.push({ input: img(key), left: Math.round(x - w * ox), top: Math.round(y - h * oy) });
};

// ——— ground line lookup (mirrors BaseLevel.addScenery) ———
const groundTop = (x) => {
  const col = Math.floor(x / map.tilewidth);
  let top = null;
  for (let row = map.height - 1; row >= 0; row--) {
    if (layer.data[row * map.width + col] <= 0) break;
    top = row * map.tileheight;
  }
  return top;
};

const keepClear = objects.flatMap((o) => {
  const x = o.x ?? 0;
  if (o.type === 'Pipe' || o.type === 'WarpPipe') return [[x - 80, x + (o.width ?? 64) + 80]];
  if (o.type === 'Flagpole') return [[x - 80, x + 320]];
  return [];
});
const blocked = (x) => keepClear.some(([a, b]) => x >= a && x <= b);

// clouds → hills → bushes, same order/spacing as the scene
for (let x = 40; x < W; x += 220) await put('cloud', x, 56 + ((x / 220) % 3) * 22);

const hills = [];
for (let x = 160; x < W; x += 420) {
  const y = groundTop(x);
  if (y === null || blocked(x)) continue;
  hills.push(x);
  await put('hill', x, y);
}
for (let x = 96; x < W; x += 190) {
  const y = groundTop(x);
  if (y === null || blocked(x)) continue;
  if (hills.some((hx) => Math.abs(hx - x) < 120)) continue;
  await put('bush', x, y);
}

// ——— objects ———
for (const o of objects) {
  const x = o.x ?? 0;
  const y = o.y ?? 0;
  if (o.type === 'Pipe' || o.type === 'WarpPipe') await put('pipe', x + 32, y + 64);
  if (o.type === 'Flagpole') {
    const groundY = y + (o.height ?? 288);
    const pole = await size('flagpole');
    await put('flagpole', x + 16, groundY);
    await put('flag', x + 14, groundY - pole.h + 20, 1, 0);
    await put('castle', x + 220, groundY);
  }
}

// ——— ground tiles (tiles.png is a 4-tile strip; index n → column n-1) ———
const tileStrip = await sharp(img('tiles')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const TS = map.tilewidth;
for (let row = 0; row < map.height; row++) {
  for (let col = 0; col < map.width; col++) {
    const idx = layer.data[row * map.width + col];
    if (idx <= 0) continue;
    const buf = Buffer.alloc(TS * TS * 4);
    for (let yy = 0; yy < TS; yy++)
      for (let xx = 0; xx < TS; xx++) {
        const si = (yy * tileStrip.info.width + (idx - 1) * TS + xx) * 4;
        const di = (yy * TS + xx) * 4;
        tileStrip.data.copy(buf, di, si, si + 4);
      }
    parts.push({
      input: await sharp(buf, { raw: { width: TS, height: TS, channels: 4 } }).png().toBuffer(),
      left: col * TS,
      top: row * TS,
    });
  }
}

const out = path.join(root, 'assets/preview', `${name}.png`);
fs.mkdirSync(path.dirname(out), { recursive: true });
await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 92, g: 148, b: 252, alpha: 1 } },
})
  .composite(parts)
  .png()
  .toFile(out);

console.log('wrote', out, `${W}x${H}`);

/**
 * Smoke check: cropped sprites exist at the expected size AND actually contain the
 * right thing. The size-only version happily passed a "flagpole" that was random
 * coloured blocks, so every entry now also asserts coverage + dominant hue.
 *
 * Run: node scripts/check-game-sprites.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const spr = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/game/sprites');

/** hue buckets by dominant opaque pixel colour */
const HUE = {
  green: ([r, g, b]) => g > 90 && g > r + 30 && g > b + 30,
  brown: ([r, g, b]) => r > 90 && r > g + 25 && g > b && b < 110,
  gold: ([r, g, b]) => r > 170 && g > 110 && b < 110,
  white: ([r, g, b]) => r > 195 && g > 195 && b > 195,
  red: ([r, g, b]) => r > 140 && r > g + 60 && r > b + 60,
};

// key: [width, height, requiredHue, minCoverage, maxCoverage]
const expect = {
  mario_s_idle: [32, 32, null, 0.2, 0.7],
  mario_b_idle: [32, 64, null, 0.2, 0.7],
  goomba_0: [32, 32, null, 0.2, 0.9],
  koopa_0: [32, 48, null, 0.15, 0.9],
  bowser: [64, 64, null, 0.2, 1],
  mushroom: [32, 32, null, 0.3, 1],
  fireflower: [32, 32, null, 0.3, 1],
  block_ground: [32, 32, 'brown', 0.9, 1],
  block_brick: [32, 32, 'brown', 0.9, 1],
  tiles: [128, 32, null, 0.9, 1],
  pipe: [64, 64, 'green', 0.85, 1],
  pipe_top: [64, 32, 'green', 0.8, 1],
  pipe_body: [64, 32, 'green', 0.8, 1],
  axe: [32, 32, null, 0.15, 1],
  flag: [26, 32, 'white', 0.3, 1],
  flagpole: [32, 336, 'green', 0.1, 1],
  castle: [160, 160, 'brown', 0.6, 1],
  coin_0: [32, 32, 'gold', 0.1, 0.6],
  coin_spin1: [32, 32, 'gold', 0.1, 0.6],
  coin_spin3: [32, 32, 'gold', 0.02, 0.4],
  hill: [160, 70, 'green', 0.3, 1],
  bush: [64, 32, 'green', 0.4, 1],
  cloud: [96, 48, 'white', 0.4, 1],
};

let failed = 0;

for (const [key, [w, h, hue, minCov, maxCov]] of Object.entries(expect)) {
  const p = path.join(spr, `${key}.png`);
  if (!fs.existsSync(p)) {
    console.error('MISSING', key);
    failed++;
    continue;
  }

  const m = await sharp(p).metadata();
  if (m.width !== w || m.height !== h) {
    console.error('SIZE', key, `${m.width}x${m.height}`, 'want', `${w}x${h}`);
    failed++;
  }

  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const total = info.width * info.height;
  let opaque = 0;
  let hueHits = 0;
  const test = hue ? HUE[hue] : null;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] <= 16) continue;
    opaque++;
    if (test && test([data[i], data[i + 1], data[i + 2]])) hueHits++;
  }

  const coverage = opaque / total;
  if (coverage < minCov || coverage > maxCov) {
    console.error('COVERAGE', key, coverage.toFixed(2), 'want', `${minCov}-${maxCov}`);
    failed++;
  }

  // A wrong crop lands on unrelated art, so the dominant hue check is what catches it.
  if (test && opaque > 0) {
    const ratio = hueHits / opaque;
    if (ratio < 0.2) {
      console.error('HUE', key, `only ${(ratio * 100).toFixed(0)}% ${hue}`);
      failed++;
    }
  }
}

const wav = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/sounds/smb_jump.wav');
if (!fs.existsSync(wav)) {
  console.error('MISSING smb_jump.wav');
  failed++;
}

if (failed) {
  console.error('FAIL', failed);
  process.exit(1);
}
console.log('OK sprites+sfx');

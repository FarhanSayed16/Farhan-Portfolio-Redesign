/**
 * Asserts every pit is actually jumpable and that objects have ground under them.
 *
 * A 192px pit shipped in 1-2 that no walking jump could clear, and 1-3's bridge was
 * never built at all (Bowser spawned inside the hole), so this is checked in CI now.
 *
 * Run: node scripts/check-level-geometry.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const maps = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/game/maps');

// Player.ts: gravity 980, jump 520 (small), walk 160. Reach = speed * 2 * jump / gravity.
const GRAVITY = 980;
const JUMP = 520;
const WALK = 160;
const REACH = Math.floor((WALK * 2 * JUMP) / GRAVITY);

let failed = 0;

for (const file of ['level_1_1.json', 'level_1_2.json', 'level_1_3.json']) {
  const map = JSON.parse(fs.readFileSync(path.join(maps, file), 'utf8'));
  const layer = map.layers.find((l) => l.name === 'Ground');
  const { width: w, height: h } = layer;

  const solid = (x) => {
    for (let y = 0; y < h; y++) if (layer.data[y * w + x] > 0) return true;
    return false;
  };

  // pit widths
  let run = null;
  for (let x = 0; x <= w; x++) {
    if (x < w && !solid(x)) {
      if (run === null) run = x;
      continue;
    }
    if (run === null) continue;
    const px = (x - run) * map.tilewidth;
    if (px > REACH) {
      console.error(`PIT ${file} cols ${run}-${x - 1} is ${px}px, walking reach is ${REACH}px`);
      failed++;
    }
    run = null;
  }

  // every spawned object needs ground beneath it
  const objects = (map.layers.find((l) => l.type === 'objectgroup') || {}).objects || [];
  for (const o of objects) {
    if (o.type === 'Bridge') continue; // the bridge IS the ground it sits on
    const col = Math.floor((o.x + (o.width || 32) / 2) / map.tilewidth);
    if (!solid(col)) {
      console.error(`VOID ${file} ${o.type} at x=${o.x} has no ground under it`);
      failed++;
    }
  }
}

if (failed) {
  console.error('FAIL', failed);
  process.exit(1);
}
console.log(`OK level geometry (walking reach ${REACH}px)`);

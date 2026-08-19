/**
 * Square OG crop from public/images/farhan.jpeg using site.json squareFocus.
 * (profileFocus is only for the live site circle CSS.)
 * Run after /tune-photo: npm run gen:portrait-square
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'public', 'images', 'farhan.jpeg');
const out = join(root, 'public', 'images', 'farhan-square.jpg');
const site = JSON.parse(readFileSync(join(root, 'data/content/site.json'), 'utf8'));

const focus = site.squareFocus ?? site.profileFocus ?? { x: 47, y: 40, zoom: 1.05 };
const zoom = Math.max(1, Number(focus.zoom ?? 1.05));
const BASE = 720;

const meta = await sharp(srcPath).metadata();
const w = meta.width ?? 1280;
const h = meta.height ?? 853;
const size = Math.min(w, h, Math.round(BASE / zoom));
const fx = Number(focus.x ?? 47) / 100;
const fy = Number(focus.y ?? 40) / 100;

let left = Math.round(fx * w - size / 2);
let top = Math.round(fy * h - size / 2);
left = Math.max(0, Math.min(left, w - size));
top = Math.max(0, Math.min(top, h - size));

await sharp(srcPath)
  .extract({ left, top, width: size, height: size })
  .resize(1200, 1200, { fit: 'cover' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);

console.log(
  `wrote ${out} (squareFocus x=${focus.x} y=${focus.y} zoom=${zoom} → ${size}px @ ${left},${top})`
);

/**
 * Square OG crop from public/images/farhan.jpeg using site.json squareFocus.
 * Run after /tune-photo: npm run gen:portrait-square
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { portraitSquareRect } from './lib/focus-crop.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'public', 'images', 'farhan.jpeg');
const out = join(root, 'public', 'images', 'farhan-square.jpg');
const site = JSON.parse(readFileSync(join(root, 'data/content/site.json'), 'utf8'));

const focus = site.squareFocus ?? site.profileFocus ?? { x: 47, y: 40, zoom: 1.05 };
const meta = await sharp(srcPath).metadata();
const { left, top, size } = portraitSquareRect(meta, focus);

await sharp(srcPath)
  .extract({ left, top, width: size, height: size })
  .resize(1200, 1200, { fit: 'cover' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);

console.log(
  `wrote ${out} (squareFocus x=${focus.x} y=${focus.y} zoom=${focus.zoom ?? 1.05} → ${size}px @ ${left},${top})`
);

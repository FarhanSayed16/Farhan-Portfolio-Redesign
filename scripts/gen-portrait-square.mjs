/**
 * Face-centered square from public/images/farhan.jpeg (1280×853 landscape).
 * Subject sits right of frame; left is wood. Center crop ~x=185.
 * Run: node scripts/gen-portrait-square.mjs
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public', 'images', 'farhan.jpeg');
const out = join(root, 'public', 'images', 'farhan-square.jpg');

const LEFT = 270;
const TOP = 36;
const SIZE = 720;

await sharp(src)
  .extract({ left: LEFT, top: TOP, width: SIZE, height: SIZE })
  .resize(1200, 1200, { fit: 'cover' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);

console.log('wrote', out);

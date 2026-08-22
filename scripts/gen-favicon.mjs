/**
 * Generate favicon PNG/ICO set from the official FS brand mark.
 * Source: public/images/brand/fs-logo.png — layout from site.json logoFocus.
 * Run: npm run gen:favicon
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { logoLayout } from './lib/focus-crop.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const brandPath = join(root, 'public', 'images', 'brand', 'fs-logo.png');
const outDir = join(root, 'public');
const appDir = join(root, 'src', 'app');
const site = JSON.parse(readFileSync(join(root, 'data/content/site.json'), 'utf8'));
const logoFocus = site.logoFocus ?? { x: 50, y: 50, scale: 1, pad: 0.08 };

const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };

async function png(size, name) {
  const { inner, left, top } = logoLayout(size, logoFocus);
  const mark = await sharp(brandPath)
    .resize(inner, inner, { fit: 'contain', background: BLACK })
    .png()
    .toBuffer();

  const buf = await sharp({
    create: { width: size, height: size, channels: 4, background: BLACK },
  })
    .composite([{ input: mark, left, top }])
    .png()
    .toBuffer();

  writeFileSync(join(outDir, name), buf);
  return buf;
}

function icoFromPngs(pngBuffersWithSizes) {
  const count = pngBuffersWithSizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirSize = 16 * count;
  let offset = 6 + dirSize;
  const dirs = [];
  const bodies = [];

  for (const { size, buf } of pngBuffersWithSizes) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirs.push(entry);
    bodies.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirs, ...bodies]);
}

const sizes = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 48, name: 'favicon-48.png' },
  { size: 96, name: 'favicon-96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
];

const icoParts = [];
for (const { size, name } of sizes) {
  const buf = await png(size, name);
  console.log('wrote', name, buf.length);
  if ([16, 32, 48].includes(size)) icoParts.push({ size, buf });
}

const ico = icoFromPngs(icoParts);
writeFileSync(join(outDir, 'favicon.ico'), ico);
writeFileSync(join(appDir, 'favicon.ico'), ico);
console.log('wrote public/favicon.ico + src/app/favicon.ico', ico.length);

const master512 = await png(512, 'icon-512.png');
const b64 = master512.toString('base64');
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="FS — Farhan Sayed">
  <image width="512" height="512" href="data:image/png;base64,${b64}"/>
</svg>
`;
writeFileSync(join(outDir, 'favicon.svg'), svg);
console.log('wrote favicon.svg');

const manifest = {
  name: 'Farhan Sayed — Farhan Builds',
  short_name: 'Farhan',
  description: 'AI & Full-Stack Engineer · SIH 2025 National Winner · Mumbai',
  start_url: '/',
  display: 'standalone',
  background_color: '#000000',
  theme_color: '#0a1628',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
};
writeFileSync(join(outDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
console.log('wrote site.webmanifest');

const icon192 = readFileSync(join(outDir, 'icon-192.png'));
const apple = readFileSync(join(outDir, 'apple-touch-icon.png'));
writeFileSync(join(appDir, 'icon.png'), icon192);
writeFileSync(join(appDir, 'apple-icon.png'), apple);
writeFileSync(join(outDir, 'fs-icon-48.png'), readFileSync(join(outDir, 'favicon-48.png')));
console.log('wrote src/app/icon.png + src/app/apple-icon.png + public/fs-icon-48.png');

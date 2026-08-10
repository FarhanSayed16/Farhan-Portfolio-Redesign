/**
 * Generate favicon PNG/ICO set from the official FS brand mark.
 * Source: public/images/brand/fs-logo.png
 * Run: node scripts/gen-favicon.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const brandPath = join(root, 'public', 'images', 'brand', 'fs-logo.png');
const outDir = join(root, 'public');
// Next.js App Router prefers src/app/favicon.ico over public/ — must stay in sync
const appDir = join(root, 'src', 'app');

// Solid black — gold mark needs contrast in Google's light SERP / tab chips
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };

async function png(size, name, { pad = 0.08 } = {}) {
  // Slight padding so the orbit ring survives Google's circular crop
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(brandPath)
    .resize(inner, inner, { fit: 'contain', background: BLACK })
    .png()
    .toBuffer();

  const buf = await sharp({
    create: { width: size, height: size, channels: 4, background: BLACK },
  })
    .composite([{ input: mark, gravity: 'centre' }])
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
  { size: 16, name: 'favicon-16.png', pad: 0.06 },
  { size: 32, name: 'favicon-32.png', pad: 0.07 },
  { size: 48, name: 'favicon-48.png', pad: 0.08 },
  { size: 96, name: 'favicon-96.png', pad: 0.08 },
  { size: 180, name: 'apple-touch-icon.png', pad: 0.06 },
  { size: 192, name: 'icon-192.png', pad: 0.06 },
  { size: 512, name: 'icon-512.png', pad: 0.05 },
];

const icoParts = [];
for (const { size, name, pad } of sizes) {
  const buf = await png(size, name, { pad });
  console.log('wrote', name, buf.length);
  if ([16, 32, 48].includes(size)) icoParts.push({ size, buf });
}

const ico = icoFromPngs(icoParts);
writeFileSync(join(outDir, 'favicon.ico'), ico);
writeFileSync(join(appDir, 'favicon.ico'), ico);
console.log('wrote public/favicon.ico + src/app/favicon.ico', ico.length);

// SVG wrapper (browsers that prefer vector still get the official mark)
const master512 = await png(512, 'icon-512.png', { pad: 0.05 });
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

// App Router metadata files (these override the create-next-app Vercel triangle)
const icon192 = readFileSync(join(outDir, 'icon-192.png'));
const apple = readFileSync(join(outDir, 'apple-touch-icon.png'));
writeFileSync(join(appDir, 'icon.png'), icon192);
writeFileSync(join(appDir, 'apple-icon.png'), apple);
console.log('wrote src/app/icon.png + src/app/apple-icon.png');

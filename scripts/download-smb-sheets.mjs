/**
 * Download SMB NES sheets from Spriters Resource (browser, for Cloudflare).
 * Writes to public/game/_raw/*.png
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/game/_raw');
fs.mkdirSync(outDir, { recursive: true });

const sheets = [
  { id: 50365, name: 'mario' },
  { id: 52570, name: 'enemies' },
  { id: 52571, name: 'tileset' },
  { id: 52569, name: 'items' },
  { id: 164123, name: 'hills' },
  { id: 164125, name: 'clouds' },
  { id: 164124, name: 'bushes' },
  { id: 65962, name: 'blocks' },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setUserAgent(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
);
await page.setViewport({ width: 1280, height: 900 });

for (const s of sheets) {
  const pageUrl = `https://www.spriters-resource.com/nes/supermariobros/sheet/${s.id}/`;
  console.log('open', s.name, pageUrl);
  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 120000 });
    await new Promise((r) => setTimeout(r, 3000));

    const imgUrl = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')];
      const sheet = imgs.find(
        (i) => i.src.includes('/resources/sheets/') && i.src.includes('.png')
      );
      return sheet ? sheet.src : null;
    });
    console.log('  img', imgUrl);
    if (!imgUrl) {
      // dump page title for debug
      console.log('  title', await page.title());
      console.log('  SKIP no img');
      continue;
    }

    const b64 = await page.evaluate(async (url) => {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('fetch ' + res.status);
      const ab = await res.arrayBuffer();
      const bytes = new Uint8Array(ab);
      let bin = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      return btoa(bin);
    }, imgUrl);

    const buf = Buffer.from(b64, 'base64');
    const dest = path.join(outDir, `${s.name}.png`);
    fs.writeFileSync(dest, buf);
    const isPng = buf[0] === 0x89 && buf[1] === 0x50;
    console.log('  wrote', dest, buf.length, isPng ? 'PNG' : 'NOT-PNG');
  } catch (e) {
    console.log('  ERR', e.message);
  }
}

await browser.close();
console.log('done');

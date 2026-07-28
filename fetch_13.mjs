import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, 'data', 'content', 'certifications.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'certifications');

const INDICES = [0, 1, 2, 19, 20, 22, 27, 29, 30, 33, 34, 35, 36];

async function main() {
  const rawData = fs.readFileSync(JSON_PATH, 'utf8');
  let certs = JSON.parse(rawData);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  for (let i of INDICES) {
    const cert = certs[i];
    if (!cert.url) continue;

    console.log(`[${i}] Fetching: ${cert.url}`);
    
    try {
      await page.goto(cert.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 5000)); // wait for renders

      const fileName = `cert_${i}.png`;
      const filePath = path.join(IMAGES_DIR, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      cert.image = `/images/certifications/${fileName}`;
      console.log(`Saved: ${fileName}`);
    } catch (e) {
      console.log(`Failed [${i}]: ${e.message}`);
    }
  }

  await browser.close();
  fs.writeFileSync(JSON_PATH, JSON.stringify(certs, null, 2));
}

main().catch(console.error);

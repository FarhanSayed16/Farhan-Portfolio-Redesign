import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, 'data', 'content', 'certifications.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'certifications');

// Categorize problematic certs by index
const BAD_INDICES = new Set([
  19,  // Google Drive - "file does not exist" error
  20,  // Coursera verify - 404 page
  22,  // Coursera verify - likely 404
  25,  // eLearnMarkets - shows verify form, not the actual cert
  33,  // eLearnMarkets - verify form
  34,  // eLearnMarkets - verify form
  35,  // Google Drive - "file does not exist"
  36,  // Google Drive - "file does not exist"
]);

const RE_RUN_INDICES = new Set([2, 16, 18, 21, 23, 24, 26, 27, 28, 29, 30, 31, 32]);

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const rawData = fs.readFileSync(JSON_PATH, 'utf8');
  let certs = JSON.parse(rawData);

  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  let fetched = 0;
  let failed = 0;

  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i];
    if (!cert.url) continue;

    if (!RE_RUN_INDICES.has(i)) {
      continue;
    }

    if (BAD_INDICES.has(i)) {
      console.log(`⏭️  [${i}] Skipping known dead/private link: ${cert.name}`);
      continue;
    }

    const url = cert.url;
    console.log(`\n[${i}/${certs.length}] FETCHING CROPPED: ${cert.name}`);
    console.log(`   URL: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise(r => setTimeout(r, 4000)); // wait for dynamic content

      // Try to dismiss popups/cookies
      try {
        await page.evaluate(() => {
          const buttons = document.querySelectorAll('button, [role="button"]');
          for (const btn of buttons) {
            const text = btn.textContent?.toLowerCase() || '';
            if (text.includes('accept') || text.includes('close') || text.includes('dismiss') || text.includes('got it') || text.includes('reject all')) {
              btn.click();
              break;
            }
          }
        });
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) { /* ignore */ }

      let elementToScreenshot = null;

      // Platform-specific DOM selectors
      if (url.includes('credly.com')) {
        elementToScreenshot = await page.$('.cr-badge-header') || await page.$('.cr-badge-image-container') || await page.$('.cr-standard-grid-item-content') || await page.$('.badge-image');
      } 
      else if (url.includes('cloudskillsboost.google')) {
        elementToScreenshot = await page.$('.profile-badge') || await page.$('ql-badge') || await page.$('.badge-image');
      }
      else if (url.includes('coursera.org')) {
        elementToScreenshot = await page.$('.rc-CourseCertificate') || await page.$('.rc-CertificateImage') || await page.$('.rc-AccomplishmentCertificate') || await page.$('.certificate-container') || await page.$('.rc-AccomplishmentsApp');
      }
      else if (url.includes('guvi.in')) {
        elementToScreenshot = await page.$('.certificate-wrapper') || await page.$('img[src*="certificate"]');
      }
      else if (url.includes('givemycertificate.com')) {
        elementToScreenshot = await page.$('.certificate-image') || await page.$('canvas');
      }
      else if (url.includes('oracle.com')) {
        elementToScreenshot = await page.$('img.rc10img') || await page.$('img[src*="certview"]') || await page.$('.badge-image') || await page.$('img[alt*="badge"]');
      }

      const fileName = `cert_${i}.png`;
      const filePath = path.join(IMAGES_DIR, fileName);

      if (elementToScreenshot) {
        console.log('   🎯 Found specific certificate DOM element! Capturing cropped screenshot...');
        await elementToScreenshot.screenshot({ path: filePath });
      } else {
        console.log('   ⚠️  Could not find specific container, capturing full page...');
        await page.screenshot({ path: filePath });
      }

      cert.image = `/images/certifications/${fileName}`;
      fetched++;
      console.log(`   ✅ Saved: ${fileName}`);
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      failed++;
    }
  }

  await browser.close();

  fs.writeFileSync(JSON_PATH, JSON.stringify(certs, null, 2));
  console.log(`\n=== DONE ===`);
  console.log(`Re-fetched: ${fetched} | Failed: ${failed}`);
}

main().catch(console.error);

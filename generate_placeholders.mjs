import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, 'data', 'content', 'certifications.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'certifications');

// The indices the user explicitly requested to be fixed
const FIX_INDICES = new Set([0, 1, 2, 19, 20, 22, 27, 29, 30, 33, 34, 35, 36]);

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 800px;
            background: linear-gradient(135deg, #0f172a 0%, #000000 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Inter', sans-serif;
            color: #ffffff;
            position: relative;
            overflow: hidden;
        }
        
        /* Cyberpunk Red Glow Elements */
        .glow-circle-1 {
            position: absolute;
            top: -200px;
            left: -200px;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%);
            border-radius: 50%;
        }
        .glow-circle-2 {
            position: absolute;
            bottom: -300px;
            right: -100px;
            width: 900px;
            height: 900px;
            background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
            border-radius: 50%;
        }

        .certificate-card {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 24px;
            width: 900px;
            height: 540px;
            padding: 60px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(239, 68, 68, 0.1);
        }

        /* Subtle grid pattern inside card */
        .certificate-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
            border-radius: 24px;
            z-index: 0;
            pointer-events: none;
        }

        .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .issuer-badge {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            padding: 12px 24px;
            border-radius: 100px;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 40px;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .title {
            font-family: 'Outfit', sans-serif;
            font-size: 56px;
            font-weight: 800;
            line-height: 1.2;
            margin: 0 0 24px 0;
            background: linear-gradient(to right, #ffffff, #cbd5e1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            max-width: 800px;
        }

        .verification {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 40px;
            color: #94a3b8;
            font-size: 18px;
        }

        .check-icon {
            color: #ef4444;
            width: 24px;
            height: 24px;
        }
        
        .year {
            position: absolute;
            bottom: 40px;
            font-family: 'Outfit', sans-serif;
            font-size: 120px;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.02);
            z-index: 0;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="glow-circle-1"></div>
    <div class="glow-circle-2"></div>
    
    <div class="certificate-card">
        <div class="year">{{YEAR}}</div>
        <div class="content">
            <div class="issuer-badge">{{ISSUER}}</div>
            <h1 class="title">{{TITLE}}</h1>
            <div class="verification">
                <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Verified Credential
            </div>
        </div>
    </div>
</body>
</html>
`;

async function main() {
  const rawData = fs.readFileSync(JSON_PATH, 'utf8');
  let certs = JSON.parse(rawData);

  console.log('Launching Puppeteer for Custom Premium Placeholders...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 }); // High res!

  for (let i = 0; i < certs.length; i++) {
    if (!FIX_INDICES.has(i)) continue;

    const cert = certs[i];
    console.log(`[${i}] Generating Premium Card: ${cert.name}`);

    // Extract year from date string (e.g., "Oct 2022" -> "2022")
    const yearMatch = cert.date.match(/\\d{4}/);
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();

    // Inject data into HTML
    let html = HTML_TEMPLATE
      .replace('{{TITLE}}', cert.name)
      .replace('{{ISSUER}}', cert.issuer)
      .replace('{{YEAR}}', year);

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Allow fonts to load
    await new Promise(r => setTimeout(r, 500));

    const fileName = `cert_${i}.png`;
    const filePath = path.join(IMAGES_DIR, fileName);

    await page.screenshot({ path: filePath });
    
    cert.image = `/images/certifications/${fileName}`;
    console.log(` ✅ Saved premium placeholder: ${fileName}`);
  }

  await browser.close();
  
  // Save updated JSON
  fs.writeFileSync(JSON_PATH, JSON.stringify(certs, null, 2));
  console.log('\n=== DONE ===');
}

main().catch(console.error);

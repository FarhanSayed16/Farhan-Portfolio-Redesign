import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDFs = [
  { file: 'Coursera 4SDEZMJKA9V6 (1).pdf', dest: 'cert_30.png' },
  { file: 'Coursera HQTH8TDJ2XYN.pdf', dest: 'cert_20.png' },
  { file: 'Coursera JP32TL3HQXWL.pdf', dest: 'cert_22.png' }
];

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"></script>
    <style>
        body, html { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; min-height: 100vh;}
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="pdf-canvas"></canvas>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';
        
        async function renderPDF(pdfDataUrl) {
            try {
                // Convert base64 to Uint8Array
                const base64 = pdfDataUrl.split(',')[1];
                const binaryString = window.atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const loadingTask = pdfjsLib.getDocument({data: bytes});
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                
                // Increase scale for high quality
                const scale = 2.0;
                const viewport = page.getViewport({scale: scale});
                
                const canvas = document.getElementById('pdf-canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                
                // Signal puppeteer we are done
                const doneDiv = document.createElement('div');
                doneDiv.id = 'render-done';
                document.body.appendChild(doneDiv);
            } catch (err) {
                console.error(err);
                const errDiv = document.createElement('div');
                errDiv.id = 'render-error';
                document.body.appendChild(errDiv);
            }
        }
    </script>
</body>
</html>
`;

async function main() {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  for (const item of PDFs) {
    const pdfPath = path.join(__dirname, 'CERTIFICATES', item.file);
    if (!fs.existsSync(pdfPath)) {
      console.log(`File not found: ${pdfPath}`);
      continue;
    }

    console.log(`Processing: ${item.file}`);
    
    // Read PDF and convert to base64 data URL
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${pdfBase64}`;

    await page.setContent(HTML_TEMPLATE, { waitUntil: 'networkidle0' });
    
    // Evaluate and wait for render
    await page.evaluate(async (url) => {
        await window.renderPDF(url);
    }, dataUrl);

    // Wait for the done div
    await page.waitForSelector('#render-done, #render-error', { timeout: 30000 });
    
    const hasError = await page.$('#render-error');
    if (hasError) {
        console.log(`Failed to render ${item.file}`);
        continue;
    }

    // Adjust viewport to canvas size
    const canvasRect = await page.evaluate(() => {
        const c = document.getElementById('pdf-canvas');
        return { width: c.width, height: c.height };
    });
    
    await page.setViewport({ width: canvasRect.width, height: canvasRect.height, deviceScaleFactor: 1 });
    
    const destPath = path.join(__dirname, 'public', 'images', 'certifications', item.dest);
    
    // Screenshot only the canvas element
    const canvasElement = await page.$('#pdf-canvas');
    await canvasElement.screenshot({ path: destPath });
    
    console.log(`Saved converted image to: ${item.dest}`);
  }
  
  await browser.close();
}

main().catch(console.error);

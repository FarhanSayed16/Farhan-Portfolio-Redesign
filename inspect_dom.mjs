import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://certificate.givemycertificate.com/c/d6a4b28a-63f3-49bc-b9a7-faa1b5811f25', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 6000));
  
  const gmcStructure = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      className: img.className
    }));
    const canvas = Array.from(document.querySelectorAll('canvas')).map(c => c.className);
    return { images, canvas };
  });
  
  console.log("GiveMyCertificate Candidates:", JSON.stringify(gmcStructure, null, 2));

  await browser.close();
}

main();

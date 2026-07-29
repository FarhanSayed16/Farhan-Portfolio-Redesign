/**
 * Smoke: mobile default = modern portfolio; Nokia egg; no eras on phone path.
 * Run: node scripts/check-mobile-modern.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const checks = [
  {
    file: 'src/app/page.tsx',
    must: ['ModernPortfolioShell', 'view=nokia', 'PhoneShell', 'easterEgg'],
  },
  {
    file: 'src/components/mobile/ModernPortfolioShell.tsx',
    // Phone site scrolls inside .mps-root; Nokia egg + ModernSite only
    must: ['standalone', 'Try Nokia phone', 'ModernSite', 'mps-nav', 'mps-root'],
    mustNot: ['BrowserTimeMachine', 'mps-stage'],
  },
  {
    file: 'src/components/desktop/windows/browser/ModernSite.tsx',
    // FloatingDock + marquee stay desktop-only; SIH stays on-image (no --below)
    must: ['standalone', 'onReplayEras?', 'onOpenProjects', '{!standalone && <FloatingDock'],
    mustNot: ['bv-portrait-caption--below'],
  },
  {
    file: 'src/components/mobile/modernPortfolio.css',
    must: [
      'overflow-y: auto',
      'backdrop-filter: none !important',
      '.bv-modern-viewport--standalone .bv-portrait-caption',
    ],
    // Global SIH rules must not leak into desktop IE
    mustNot: ['.bv-portrait-sih {', '.bv-portrait-caption--below {'],
  },
  {
    file: 'src/components/mobile/PhoneShell.tsx',
    must: ['easterEgg', 'Portfolio site'],
  },
  {
    file: 'src/app/connectQR/page.tsx',
    must: ['cq-page'],
  },
];

let failed = 0;
for (const { file, must = [], mustNot = [] } of checks) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`FAIL missing: ${file}`);
    failed++;
    continue;
  }
  const src = read(file);
  for (const n of must) {
    if (!src.includes(n)) {
      console.error(`FAIL ${file} missing: ${n}`);
      failed++;
    }
  }
  for (const n of mustNot) {
    if (src.includes(n)) {
      console.error(`FAIL ${file} must not contain: ${n}`);
      failed++;
    }
  }
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('OK mobile modern default smoke');

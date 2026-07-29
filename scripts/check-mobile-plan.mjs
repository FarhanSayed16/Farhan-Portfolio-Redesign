/**
 * ponytail: M5 smoke — fails if mobile plan wiring regresses.
 * Run: node scripts/check-mobile-plan.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const checks = [
  {
    file: 'src/components/mobile/PhoneShell.tsx',
    must: ['OsLiteShell', 'PhoneFrame', 'farhan-os'],
  },
  {
    file: 'src/components/mobile/phoneFrame.css',
    must: ['nokia-lcd::after', 'nokia-device--playing', 'nokia-game-pad'],
  },
  {
    file: 'src/components/mobile/PhoneScreen.tsx',
    must: [
      '1. Profile',
      '2. Achievements',
      '5. Experience',
      '7. Farhan OS',
      '8. Reset Device',
      'Connect card',
      '/connectQR',
    ],
  },
  {
    file: 'src/components/mobile/PhoneGame.tsx',
    must: ['GameLauncherScreen', 'Start game', 'How to play'],
  },
  {
    file: 'src/components/mobile/OsLiteShell.tsx',
    must: ['AboutWindow', 'ProjectsWindow', 'backToPhone', "navigate('menu')"],
  },
  {
    file: 'src/app/connectQR/page.tsx',
    must: ['cq-page', 'Save to contacts'],
  },
];

let failed = 0;
for (const { file, must } of checks) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    console.error(`FAIL missing file: ${file}`);
    failed++;
    continue;
  }
  const src = read(file);
  for (const needle of must) {
    if (!src.includes(needle)) {
      console.error(`FAIL ${file} missing: ${needle}`);
      failed++;
    }
  }
}

for (const ghost of [
  'src/components/mobile/PhoneKeypad.tsx',
  'src/components/mobile/screens',
]) {
  if (fs.existsSync(path.join(root, ghost))) {
    console.error(`FAIL unexpected path still present: ${ghost}`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('OK mobile plan smoke (%d files)', checks.length);

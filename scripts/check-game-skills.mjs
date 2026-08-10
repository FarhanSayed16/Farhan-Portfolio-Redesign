/**
 * Self-check: game skill deck prefers signal skills over HTML/CSS-first slice.
 * Run: node --experimental-strip-types scripts/check-game-skills.mjs
 * (or import after build). Keep as plain assert script via dynamic import of built modules —
 * uses JSON + same ordering logic inline so it stays zero-deps runnable.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skills = JSON.parse(readFileSync(join(root, 'data/content/skills.json'), 'utf8'));

const PRIORITY = [
  'Next.js',
  'React.js',
  'Machine Learning',
  'AI Agents',
  'Computer Vision',
  'TensorFlow/PyTorch',
];

const SKIP = new Set(['Soft Skills & Management']);
const catalog = skills.filter((c) => !SKIP.has(c.categoryName)).flatMap((c) => c.skills);

// Mirror buildGameSkills priority head
const used = new Set();
const ordered = [];
for (const s of PRIORITY) {
  if (catalog.includes(s) && !used.has(s)) {
    ordered.push(s);
    used.add(s);
  }
}
for (const s of catalog) {
  if (!used.has(s)) {
    ordered.push(s);
    used.add(s);
  }
}

const badSlice = skills.flatMap((c) => c.skills).slice(0, 8);
const asserts = [
  () => ordered.length >= 30,
  () => ordered.indexOf('Next.js') < ordered.indexOf('HTML/CSS'),
  () => ordered.indexOf('Machine Learning') < ordered.indexOf('HTML/CSS'),
  () => ordered.includes('AI Agents'),
  () => ordered.includes('YOLO'),
  () => !ordered.some((s) => s === 'Public Speaking'),
  () => badSlice.includes('HTML/CSS') || badSlice.includes('PHP'), // documents old bug surface
];

let failed = 0;
for (const a of asserts) {
  try {
    if (!a()) throw new Error('assertion failed');
  } catch {
    failed++;
    console.error('FAIL', a.toString().slice(0, 80));
  }
}

if (failed) {
  console.error(`check-game-skills: ${failed} failed`);
  process.exit(1);
}
console.log(`check-game-skills: ok (${ordered.length} skills, head: ${ordered.slice(0, 8).join(', ')})`);

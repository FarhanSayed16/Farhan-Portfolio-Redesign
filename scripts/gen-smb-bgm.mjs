/**
 * Generate simple PCM WAV loops (SMB-overworld–style square melody).
 * Run: node scripts/gen-smb-bgm.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/game/audio');
fs.mkdirSync(outDir, { recursive: true });

const SAMPLE_RATE = 22050;

/** Note index → Hz (A4=440). -1 = rest */
function midiToHz(n) {
  if (n < 0) return 0;
  return 440 * Math.pow(2, (n - 69) / 12);
}

function writeWav(filename, samples) {
  const dataSize = samples.length * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((v * 32000) | 0, 44 + i * 2);
  }
  fs.writeFileSync(path.join(outDir, filename), buf);
}

function renderMelody(notes, beatSec, vol = 0.18) {
  const samples = [];
  let phase = 0;
  for (const n of notes) {
    const hz = midiToHz(n);
    const nSamples = Math.floor(SAMPLE_RATE * beatSec);
    for (let i = 0; i < nSamples; i++) {
      if (hz === 0) {
        samples.push(0);
        continue;
      }
      phase += (2 * Math.PI * hz) / SAMPLE_RATE;
      // soft square
      const s = Math.sin(phase) > 0 ? 1 : -1;
      const env = i < 40 ? i / 40 : i > nSamples - 80 ? (nSamples - i) / 80 : 1;
      samples.push(s * vol * env);
    }
  }
  return samples;
}

// Classic overworld opening motif (approximate MIDI of SMB overworld lead)
const overworld = [
  76, 76, -1, 76, -1, 72, 76, -1, 79, -1, -1, -1, 67, -1, -1, -1,
  72, -1, -1, 67, -1, -1, 64, -1, -1, 69, -1, 71, -1, 70, 69, -1,
  67, 76, 79, 81, -1, 77, 79, -1, 76, -1, 72, 74, 71, -1, -1, -1,
];

const castle = [
  60, -1, 60, -1, 60, 63, -1, 65, 60, -1, 60, -1, 60, 63, 65, -1,
  58, -1, 58, -1, 58, 61, -1, 63, 58, -1, 58, -1, 58, 61, 63, -1,
];

writeWav('overworld.wav', renderMelody(overworld, 0.14));
writeWav('castle.wav', renderMelody(castle, 0.16, 0.14));
console.log('Wrote overworld.wav + castle.wav');

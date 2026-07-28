const https = require('https');
const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '..', 'public', 'sounds');

if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

const downloads = [
  // Mario Sounds
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/jump.mp3', file: 'smb_jump.mp3' },
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/coin.mp3', file: 'smb_coin.mp3' },
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/death.mp3', file: 'smb_mariodie.mp3' },
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/kick.mp3', file: 'smb_stomp.mp3' },
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/1up.mp3', file: 'smb_1up.mp3' },
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/boing.mp3', file: 'smb_powerup.mp3' },
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/bump.mp3', file: 'smb_bump.mp3' },
  { url: 'https://raw.githubusercontent.com/CrazyTim/mario-soundboard/master/audio/goal.mp3', file: 'smb_stage_clear.mp3' },

  // OS Sounds
  { url: 'https://raw.githubusercontent.com/CybersecurityLST/windows-xp-startup-shutdown-sounds/main/poweron.wav', file: 'os_startup.wav' },
  { url: 'https://raw.githubusercontent.com/skoch9/win95-sounds/master/Ding.wav', file: 'os_click.wav' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const { url, file } of downloads) {
    try {
      await downloadFile(url, path.join(SOUNDS_DIR, file));
    } catch (e) {
      console.error(`Error downloading ${file}:`, e.message);
    }
  }
}

run();

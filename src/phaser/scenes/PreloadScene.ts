import Phaser from 'phaser';
import { SHEET_TEXTURE_KEYS } from '../assets/sheetKeys';
import { generateGameTextures, registerGameAnims } from '../assets/SmTextureFactory';
import { generateExtraTextures, registerExtraAnims } from '../assets/ExtraTextures';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: { font: '20px monospace', color: '#ffffff' },
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xfcd21c, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn('[Preload] missing asset:', file.key, file.url);
    });

    this.load.tilemapTiledJSON('level1', '/game/maps/level_1_1.json');
    this.load.tilemapTiledJSON('level2', '/game/maps/level_1_2.json');
    this.load.tilemapTiledJSON('level3', '/game/maps/level_1_3.json');

    for (const key of SHEET_TEXTURE_KEYS) {
      this.load.image(key, `/game/sprites/${key}.png`);
    }

    this.load.audio('smb_jump', '/sounds/smb_jump.mp3');
    this.load.audio('smb_coin', '/sounds/smb_coin.mp3');
    this.load.audio('smb_mariodie', '/sounds/smb_mariodie.mp3');
    this.load.audio('smb_stomp', '/sounds/smb_stomp.mp3');
    this.load.audio('smb_1up', '/sounds/smb_1up.mp3');
    this.load.audio('smb_powerup', '/sounds/smb_powerup.mp3');
    this.load.audio('smb_stage_clear', '/sounds/smb_stage_clear.mp3');
    this.load.audio('bgm_overworld', '/game/audio/overworld.wav');
    this.load.audio('bgm_castle', '/game/audio/castle.wav');
  }

  create() {
    const missing = SHEET_TEXTURE_KEYS.filter((k) => !this.textures.exists(k));
    if (missing.length) {
      console.warn('[Preload] sheet fallback for', missing.length, 'keys');
      generateGameTextures(this);
      generateExtraTextures(this);
    }

    registerGameAnims(this);
    registerExtraAnims(this);
    this.scene.start('MainMenuScene');
  }
}

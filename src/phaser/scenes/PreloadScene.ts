import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Add loading progress bar
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
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
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

    // Load actual game assets here (sprites, maps, audio)
    this.load.tilemapTiledJSON('level1', '/game/maps/level_1_1.json');
    this.load.tilemapTiledJSON('level2', '/game/maps/level_1_2.json');
    this.load.tilemapTiledJSON('level3', '/game/maps/level_1_3.json');

    this.load.audio('smb_jump', '/sounds/smb_jump.mp3');
    this.load.audio('smb_coin', '/sounds/smb_coin.mp3');
    this.load.audio('smb_mariodie', '/sounds/smb_mariodie.mp3');
    this.load.audio('smb_stomp', '/sounds/smb_stomp.mp3');
    this.load.audio('smb_1up', '/sounds/smb_1up.mp3');
    this.load.audio('smb_powerup', '/sounds/smb_powerup.mp3');
    this.load.audio('smb_stage_clear', '/sounds/smb_stage_clear.mp3');
  }

  create() {
    this.scene.start('MainMenuScene');
  }
}

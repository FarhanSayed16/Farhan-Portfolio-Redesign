import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    // Sheets load in PreloadScene; procedural factory is fallback only.
    this.scene.start('PreloadScene');
  }
}

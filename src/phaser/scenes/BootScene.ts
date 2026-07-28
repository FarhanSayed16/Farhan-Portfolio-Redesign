import Phaser from 'phaser';
import { generateGameTextures, registerGameAnims } from '../assets/SmTextureFactory';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    generateGameTextures(this);
    registerGameAnims(this);
    this.scene.start('PreloadScene');
  }
}

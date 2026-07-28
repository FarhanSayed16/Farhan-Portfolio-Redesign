import Phaser from 'phaser';
import { SFXSynth } from '@/lib/SFXSynth';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    new SFXSynth().playGameOver();

    this.add
      .text(width / 2, height / 2 - 30, 'GAME OVER', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '32px',
        color: '#ff0000',
      })
      .setOrigin(0.5);

    const btn = this.add
      .text(width / 2, height / 2 + 40, '> RETRY <', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#ffff00'));
    btn.on('pointerout', () => btn.setColor('#ffffff'));
    btn.on('pointerdown', () => {
      this.scene.start('Level1Scene', { score: 0, coins: 0, lives: 3 });
    });
  }
}

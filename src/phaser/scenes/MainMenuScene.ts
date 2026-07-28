import Phaser from 'phaser';
import { gameBridge } from '@/lib/GameBridge';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.cameras.main.setBackgroundColor('#5c94fc');

    this.add.image(120, height - 80, 'hill').setOrigin(0.5, 1);
    this.add.image(width - 100, height - 80, 'hill').setOrigin(0.5, 1).setScale(0.8);
    this.add.image(width / 2, 90, 'cloud');
    this.add.image(80, 120, 'cloud').setScale(0.7);
    this.add.image(width - 90, 100, 'cloud').setScale(0.6);

    // Ground strip
    const g = this.add.graphics();
    g.fillStyle(0xc84c0c, 1);
    g.fillRect(0, height - 48, width, 48);
    g.lineStyle(2, 0x000000, 1);
    for (let x = 0; x < width; x += 32) {
      g.strokeRect(x, height - 48, 32, 48);
    }

    this.add
      .text(width / 2, height / 2 - 70, "SUPER MARIO BROS.", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '22px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    let high = 0;
    try {
      const raw = localStorage.getItem('farhan-high-score');
      high = raw ? (JSON.parse(raw) as number) : 0;
    } catch {
      high = 0;
    }

    if (high > 0) {
      this.add
        .text(width / 2, height / 2 - 20, `HI ${high.toString().padStart(6, '0')}`, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '12px',
          color: '#ffff00',
        })
        .setOrigin(0.5);
    }

    const startText = this.add
      .text(width / 2, height / 2 + 40, 'PRESS SPACE', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(width / 2, height / 2 + 70, 'OR CLICK TO START', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const start = () => this.scene.start('Level1Scene', { score: 0, coins: 0, lives: 3 });
    startText.on('pointerdown', start);
    this.input.keyboard?.once('keydown-SPACE', start);
    this.input.keyboard?.once('keydown-ENTER', start);
    this.input.on('pointerdown', start);

    this.tweens.add({
      targets: startText,
      alpha: 0.35,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.add.image(90, height - 80, 'mario_s_idle').setOrigin(0.5, 1);

    gameBridge.emit('menu-ready');
  }
}

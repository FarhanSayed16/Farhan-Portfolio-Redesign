import Phaser from 'phaser';
import { gameBridge } from '@/lib/GameBridge';
import { portfolioData } from '@/lib/portfolioData';

type WinData = { score?: number; coins?: number; lives?: number };

export default class WinScene extends Phaser.Scene {
  private score = 0;
  private coins = 0;

  constructor() {
    super('WinScene');
  }

  init(data: WinData = {}) {
    this.score = data.score || 0;
    this.coins = data.coins || 0;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .text(width / 2, height / 2 - 50, 'WORLD COMPLETE!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 12, 'You actually played till the end.', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: '#78f878',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 10, `SCORE: ${this.score}  COINS: ${this.coins}`, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#ffff00',
      })
      .setOrigin(0.5);

    const btn = this.add
      .text(width / 2, height / 2 + 80, '> PLAY AGAIN <', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#00ff00',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerout', () => btn.setColor('#00ff00'));
    btn.on('pointerdown', () => {
      gameBridge.emit('play-again');
    });

    try {
      const raw = localStorage.getItem('farhan-high-score');
      const prev = raw ? (JSON.parse(raw) as number) : 0;
      if (this.score > prev) {
        localStorage.setItem('farhan-high-score', JSON.stringify(this.score));
      }
    } catch {
      /* ignore */
    }

    gameBridge.emit('show-overlay', { type: 'win', text: portfolioData.bossDefeat });
  }
}

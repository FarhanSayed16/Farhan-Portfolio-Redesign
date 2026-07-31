import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Die() already plays game-over jingle before transitioning — don't stack another.

    this.add
      .text(width / 2, height / 2 - 30, 'GAME OVER', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '32px',
        color: '#ff0000',
      })
      .setOrigin(0.5);

    const button = (y: number, label: string, onClick: () => void) => {
      const btn = this.add
        .text(width / 2, y, label, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '16px',
          color: '#ffffff',
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setColor('#ffff00'));
      btn.on('pointerout', () => btn.setColor('#ffffff'));
      btn.on('pointerdown', onClick);
    };

    button(height / 2 + 40, '> RETRY <', () =>
      this.scene.start('Level1Scene', { score: 0, coins: 0, lives: 3 })
    );
    button(height / 2 + 76, '> MENU <', () => this.scene.start('MainMenuScene'));
  }
}

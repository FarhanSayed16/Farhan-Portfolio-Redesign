import Phaser from 'phaser';
import { SFXSynth } from '@/lib/SFXSynth';
import { portfolioData } from '@/lib/portfolioData';
import { gameBridge } from '@/lib/GameBridge';

export type LevelProgress = {
  score?: number;
  coins?: number;
  lives?: number;
};

const sharedSfx = typeof window !== 'undefined' ? new SFXSynth() : null;

export default class BaseLevel extends Phaser.Scene {
  protected score = 0;
  protected coins = 0;
  protected lives = 3;
  protected timeLeft = 400;
  protected levelComplete = false;
  protected deathHandled = false;
  protected worldLabel = '1-1';
  /** Cleared in init — scene.restart() reuses the instance, so Sets must not survive a death. */
  protected hitTiles = new Set<string>();

  private scoreText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private worldText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private hireMeEggTriggered = false;
  private resumeHandler: ((data?: unknown) => void) | null = null;
  protected timeEvent!: Phaser.Time.TimerEvent;
  protected sfx: SFXSynth;

  constructor(key: string) {
    super({ key });
    this.sfx = sharedSfx ?? new SFXSynth();
  }

  init(data: LevelProgress = {}) {
    this.score = data.score ?? 0;
    this.coins = data.coins ?? 0;
    this.lives = data.lives !== undefined ? data.lives : 3;
    this.timeLeft = 400;
    this.levelComplete = false;
    this.deathHandled = false;
    this.hireMeEggTriggered = false;
    this.hitTiles.clear();
    // Death mid-overlay left the React modal + paused scene stuck for the next life
    gameBridge.emit('hide-overlay');
  }

  protected bindLevelEvents(onTimeUp: () => void) {
    this.events.off('player-died');
    this.events.off('time-up');

    this.events.on('player-died', () => {
      if (this.deathHandled) return;
      this.deathHandled = true;
      this.time.delayedCall(1200, () => this.die());
    });

    this.events.on('time-up', () => {
      if (this.deathHandled || this.levelComplete) return;
      onTimeUp();
    });
  }

  /** Place hills / bushes / clouds for that SMB overworld feel. */
  protected addScenery(mapWidth: number) {
    const groundY = this.cameras.main.height - 64;
    for (let x = 40; x < mapWidth; x += 280) {
      this.add.image(x, groundY - 20, 'hill').setOrigin(0.5, 1).setDepth(0).setScrollFactor(0.4);
    }
    for (let x = 120; x < mapWidth; x += 200) {
      this.add.image(x, groundY - 2, 'bush').setOrigin(0.5, 1).setDepth(1).setScrollFactor(0.85);
    }
    for (let x = 80; x < mapWidth; x += 260) {
      this.add
        .image(x, 70 + ((x / 60) % 3) * 20, 'cloud')
        .setDepth(0)
        .setScrollFactor(0.25)
        .setAlpha(0.95);
    }
  }

  createHUD() {
    const w = this.cameras.main.width;
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff',
      align: 'center',
    };

    const col = (cx: number, title: string, value: string) => {
      const label = this.add
        .text(cx, 8, title, style)
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(100);
      const val = this.add
        .text(cx, 22, value, style)
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(100);
      return { label, val };
    };

    this.scoreText = col(70, 'SCORE', this.score.toString().padStart(6, '0')).val;
    this.coinsText = col(200, 'COINS', `×${this.coins.toString().padStart(2, '0')}`).val;
    this.worldText = col(w / 2, 'WORLD', this.worldLabel).val;
    this.timeText = col(w - 200, 'TIME', String(this.timeLeft)).val;
    this.livesText = col(w - 70, 'LIVES', String(this.lives)).val;

    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.levelComplete || this.deathHandled) return;
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.timeText.setText(String(this.timeLeft));
        } else {
          this.events.emit('time-up');
        }
      },
      loop: true,
    });

    const handleResume = () => {
      try {
        // Do NOT gate on sys.isActive() — paused scenes are not "active", so that never resumes.
        if (this.sys?.isPaused()) {
          this.scene.resume();
        }
        if (this.physics?.world?.isPaused) {
          this.physics.world.resume();
        }
        this.events.emit('post-overlay-resume');
      } catch {
        /* ignore */
      }
    };

    // Avoid stacking resume listeners across scene.restart()
    if (this.resumeHandler) {
      gameBridge.off('resume-game', this.resumeHandler);
    }
    this.resumeHandler = handleResume;
    gameBridge.on('resume-game', handleResume);
    this.events.off('shutdown', this.onHudShutdown);
    this.events.once('shutdown', this.onHudShutdown);
  }

  private onHudShutdown = () => {
    if (this.resumeHandler) {
      gameBridge.off('resume-game', this.resumeHandler);
      this.resumeHandler = null;
    }
    this.timeEvent?.remove(false);
  };

  addScore(pts: number) {
    this.score += pts;
    if (this.score > 9999 && !this.hireMeEggTriggered) {
      this.hireMeEggTriggered = true;
      let toggle = false;
      this.time.addEvent({
        delay: 500,
        callback: () => {
          toggle = !toggle;
          this.scoreText.setText(toggle ? 'HIREME' : this.score.toString().padStart(6, '0'));
          this.scoreText.setColor(toggle ? '#ffff00' : '#ffffff');
        },
        loop: true,
      });
    } else if (!this.hireMeEggTriggered) {
      this.scoreText.setText(this.score.toString().padStart(6, '0'));
    }
  }

  addCoin() {
    this.coins++;
    this.sfx.playCoin();

    if (this.coins >= 100) {
      this.coins = 0;
      this.lives++;
      this.livesText.setText(String(this.lives));
      this.sfx.playPowerup();
    }

    this.coinsText.setText(`×${this.coins.toString().padStart(2, '0')}`);
    this.addScore(200);

    if (this.coins > 0 && this.coins % 10 === 0) {
      const idx = (this.coins / 10 - 1) % portfolioData.coinFacts.length;
      this.events.emit('post-overlay-resume');
      this.scene.pause();
      gameBridge.emit('show-overlay', { type: 'coin', text: portfolioData.coinFacts[idx] });
    }
  }

  protected completeLevel(nextScene: string) {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.timeEvent?.remove(false);
    this.sfx.playFlagpole();
    this.physics.pause();
    this.time.delayedCall(400, () => {
      this.scene.start(nextScene, {
        score: this.score,
        coins: this.coins,
        lives: this.lives,
      });
    });
  }

  die() {
    this.timeEvent?.remove(false);
    gameBridge.emit('hide-overlay');
    this.lives--;
    this.sfx.playDie();

    if (this.lives <= 0) {
      this.scene.start('GameOverScene', { score: this.score });
    } else {
      this.scene.restart({
        score: this.score,
        coins: this.coins,
        lives: this.lives,
      });
    }
  }
}

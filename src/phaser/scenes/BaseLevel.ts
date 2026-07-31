import Phaser from 'phaser';
import { getGameSFX, type SFXSynth } from '@/lib/SFXSynth';
import { getGameBGM } from '@/lib/GameBGM';
import { portfolioData } from '@/lib/portfolioData';
import { gameBridge } from '@/lib/GameBridge';

export type LevelProgress = {
  score?: number;
  coins?: number;
  lives?: number;
};

export default class BaseLevel extends Phaser.Scene {
  protected score = 0;
  protected coins = 0;
  protected lives = 3;
  protected timeLeft = 400;
  /** Cleared in init — scene.restart() reuses the instance, so Sets must not survive a death. */
  hitTiles = new Set<string>();
  levelComplete = false;
  deathHandled = false;

  protected worldLabel = '1-1';
  private scoreText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private worldText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private hireMeEggTriggered = false;
  private resumeHandler: ((data?: unknown) => void) | null = null;
  protected timeEvent!: Phaser.Time.TimerEvent;
  sfx: SFXSynth;

  constructor(key: string) {
    super({ key });
    const sfx = getGameSFX();
    if (!sfx) throw new Error('Game SFX unavailable');
    this.sfx = sfx;
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
  protected addScenery(map: Phaser.Tilemaps.Tilemap, ground?: Phaser.Tilemaps.TilemapLayer) {
    const mapWidth = map.widthInPixels;
    const fallbackY = this.cameras.main.height - 64;

    /**
     * Surface of the *ground*, found by walking up from the bottom row while tiles are
     * solid. Scanning downward instead lands on floating brick platforms, which is how
     * hills ended up perched in mid-air. Null means this column is a pit.
     */
    const groundTop = (x: number): number | null => {
      if (!ground) return fallbackY;
      const col = ground.worldToTileX(x);
      let top: number | null = null;
      for (let row = map.height - 1; row >= 0; row--) {
        const tile = ground.getTileAt(col, row);
        if (!tile || tile.index <= 0) break;
        top = tile.pixelY;
      }
      return top;
    };

    // Keep decoration off pipes and the finish line, where it just collides with the art.
    const keepClear = (map.getObjectLayer('Objects')?.objects ?? []).flatMap((o) => {
      const x = o.x ?? 0;
      if (o.type === 'Pipe' || o.type === 'WarpPipe') return [[x - 80, x + (o.width ?? 64) + 80]];
      if (o.type === 'Flagpole') return [[x - 80, x + 320]];
      return [];
    });
    const blocked = (x: number) => keepClear.some(([a, b]) => x >= a && x <= b);

    // SMB has no parallax: everything scrolls 1:1 with the world. Mixed scroll factors
    // were what made hills slide across bushes and read as duplicated scenery.
    // Negative depths keep scenery behind the tilemap layer (depth 0).
    const hills: number[] = [];
    for (let x = 160; x < mapWidth; x += 420) {
      const y = groundTop(x);
      if (y === null || blocked(x)) continue;
      hills.push(x);
      this.add.image(x, y, 'hill').setOrigin(0.5, 1).setDepth(-3);
    }

    for (let x = 96; x < mapWidth; x += 190) {
      const y = groundTop(x);
      if (y === null || blocked(x)) continue; // a pit would leave the bush hanging
      if (hills.some((hx) => Math.abs(hx - x) < 120)) continue;
      this.add.image(x, y, 'bush').setOrigin(0.5, 1).setDepth(-2);
    }

    for (let x = 40; x < mapWidth; x += 220) {
      this.add.image(x, 56 + ((x / 220) % 3) * 22, 'cloud').setOrigin(0.5, 1).setDepth(-4);
    }
  }

  protected startBgm(mood: 'overworld' | 'castle' = 'overworld') {
    this.sfx.stopExclusive();
    getGameBGM()?.start(mood);
  }

  protected stopBgm() {
    getGameBGM()?.stop();
  }

  createHUD() {
    const w = this.cameras.main.width;
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
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
    this.stopBgm();
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
      this.sfx.playOneup();
    }

    this.coinsText.setText(`×${this.coins.toString().padStart(2, '0')}`);
    this.addScore(200);

    if (this.coins > 0 && this.coins % 10 === 0) {
      const idx = (this.coins / 10 - 1) % portfolioData.coinFacts.length;
      gameBridge.emit('show-overlay', { type: 'coin', text: portfolioData.coinFacts[idx] });
    }
  }

  completeLevel(nextScene: string) {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.timeEvent?.remove(false);
    this.stopBgm();
    this.sfx.playFlagpole();
    this.physics.pause();
    // Wait for stage-clear jingle so next BGM doesn't stack on top of it.
    this.time.delayedCall(2400, () => {
      this.scene.start(nextScene, {
        score: this.score,
        coins: this.coins,
        lives: this.lives,
      });
    });
  }

  die() {
    this.timeEvent?.remove(false);
    this.stopBgm();
    gameBridge.emit('hide-overlay');
    this.lives--;
    this.physics.pause();

    if (this.lives <= 0) {
      this.sfx.playGameOver();
      this.time.delayedCall(2800, () => {
        this.scene.start('GameOverScene', { score: this.score });
      });
    } else {
      this.sfx.playDie();
      // Wait for death jingle — restarting immediately was stacking die + overworld BGM.
      this.time.delayedCall(2600, () => {
        this.scene.restart({
          score: this.score,
          coins: this.coins,
          lives: this.lives,
        });
      });
    }
  }
}

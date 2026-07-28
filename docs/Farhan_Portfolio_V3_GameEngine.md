# FARHAN SAYED — PORTFOLIO V3
# Game Engine — Complete Technical Plan
### "Farhan's World" — Super Mario Implementation
**Built with Phaser.js 3 · Works on Desktop OS Window + Nokia Phone Screen**

---

## THE SHORT ANSWER TO YOUR QUESTION

**Farhan's role in the game engine: Almost zero.**

The only things Farhan does:
1. Approve the coin fact text (30 minutes, already drafted in V3 plan)
2. Decide if Mario wears a custom look or stays classic (one decision)
3. Provide project screenshots (already required for the rest of the portfolio anyway)

Everything else — the engine, physics, sprites, levels, audio, controls, scaling, portfolio popups — is built entirely by Antigravity. This document explains exactly how.

---

---

# PART 1 — WHAT IS THE GAME ENGINE

---

## Phaser.js 3 — Why This Specific Tool

Phaser.js is the most widely used HTML5 game framework in the world. It runs inside a browser using the HTML5 Canvas API. It is not a game engine you install separately — it is an npm package that gets imported into the Next.js project like any other library.

```
What Phaser handles:
  ✅ Game loop (60fps render loop, requestAnimationFrame)
  ✅ Physics simulation (gravity, velocity, collision)
  ✅ Sprite animation (frame-by-frame from sprite sheets)
  ✅ Tilemap loading (reads Tiled JSON → renders level)
  ✅ Input handling (keyboard, touch, gamepad)
  ✅ Asset loading (images, audio, JSON)
  ✅ Camera system (follows Mario as he runs right)
  ✅ Scene management (Boot → Preload → Level1 → Level2 → Win)
  ✅ Audio playback (works alongside Howler.js)
  ✅ Scaling (fits game to any container size)

What Phaser does NOT handle (React handles these):
  ❌ Portfolio info popups (React overlay)
  ❌ "Hire Farhan" button (React UI)
  ❌ Window chrome in OS (React component)
  ❌ Nokia phone frame (React/CSS)
```

The relationship is clean: **Phaser owns the canvas. React owns everything else.**

---

## The Two-Layer Architecture

This is the most important concept in the entire game system.

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 2 — REACT (z-index: 10)                         │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  GameOverlay.tsx                               │    │
│  │  Portfolio info popups, Hire button,           │    │
│  │  Win screen, Game Over screen overlay          │    │
│  │  Rendered by React, triggered by Phaser events │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  LAYER 1 — PHASER CANVAS (z-index: 0)                  │
│                                                         │
│  The actual Mario game.                                 │
│  Sprites, tiles, physics, enemies, coins.               │
│  Completely unchanged authentic SMB.                    │
│  Knows nothing about the React layer above it.          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

These two layers communicate through a **one-way event bridge**:

```
Phaser emits event → Bridge catches it → React state updates → Overlay renders

Primarily Phaser → React for overlays, with React → Phaser for control signals (dismiss, play-again, mobile-input).
```

---

---

# PART 2 — HOW THE GAME IS MOUNTED IN REACT

---

## GameWrapper.tsx — The Container

This React component is what creates the game on both platforms. The desktop OS window and the Nokia phone both use this same component — they just give it different container sizes.

```typescript
// src/components/game/GameWrapper.tsx

'use client';
import { useEffect, useRef, useState } from 'react';
import GameOverlay from './GameOverlay';

interface GameWrapperProps {
  platform: 'desktop' | 'mobile';
  containerWidth: number;    // desktop: ~768px, mobile: ~260px
  containerHeight: number;   // desktop: ~480px, mobile: ~200px
  onClose: () => void;       // desktop: closes window, mobile: exits game screen
}

export default function GameWrapper({
  platform,
  containerWidth,
  containerHeight,
  onClose
}: GameWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [overlayData, setOverlayData] = useState<OverlayPayload | null>(null);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused'>('loading');

  useEffect(() => {
    // Dynamic import — Phaser NOT in main bundle
    // Only loads when this component mounts (when user opens game)
    import('./phaser/main').then(({ createGame }) => {
      if (!containerRef.current) return;

      gameRef.current = createGame({
        container: containerRef.current,
        width: containerWidth,
        height: containerHeight,
        platform,
        callbacks: {
          onOverlayShow: (payload) => {
            setOverlayData(payload);
            setGameState('paused');
          },
          onOverlayHide: () => {
            setOverlayData(null);
            setGameState('playing');
          },
          onGameOver: () => setGameState('paused'),
          onWin: () => setGameState('paused'),
        }
      });
    });

    return () => {
      // Cleanup: destroy Phaser when component unmounts
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []); // Empty deps — game created once, never recreated

  const handleOverlayDismiss = () => {
    setOverlayData(null);
    setGameState('playing');
    // Tell Phaser to resume
    gameRef.current?.events.emit('overlay-dismissed');
  };

  return (
    <div style={{ position: 'relative', width: containerWidth, height: containerHeight }}>
      {/* Layer 1: Phaser canvas mounts here */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Layer 2: React overlay — only renders when overlayData exists */}
      {overlayData && (
        <GameOverlay
          data={overlayData}
          platform={platform}
          onDismiss={handleOverlayDismiss}
        />
      )}
    </div>
  );
}
```

---

## How It's Used on Desktop vs Mobile

```typescript
// DESKTOP — inside the OS window (Farhan's World.exe window)
<GameWrapper
  platform="desktop"
  containerWidth={768}
  containerHeight={480}
  onClose={() => closeWindow('game')}
/>

// MOBILE — inside the Nokia phone screen
<GameWrapper
  platform="mobile"
  containerWidth={260}
  containerHeight={195}
  onClose={() => navigateTo('menu')}
/>
```

**Same component. Same game engine. Different container size.**
Phaser's Scale Manager automatically scales the 768×480 game canvas to fill whatever container it's given, maintaining aspect ratio.

---

---

# PART 3 — PHASER GAME CONFIGURATION

---

## main.ts — The Game Factory

```typescript
// src/components/game/phaser/main.ts

import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { Level1_1 } from './scenes/Level1_1';
import { Level1_2 } from './scenes/Level1_2';
import { Level1_3 } from './scenes/Level1_3';
import { WinScene } from './scenes/WinScene';
import type { GameBridgeCallbacks } from './bridge/GameBridge';

interface CreateGameOptions {
  container: HTMLDivElement;
  width: number;
  height: number;
  platform: 'desktop' | 'mobile';
  callbacks: GameBridgeCallbacks;
}

export function createGame({ container, width, height, platform, callbacks }: CreateGameOptions) {

  // Store callbacks in a singleton bridge (Phaser scenes access this)
  GameBridge.init(callbacks);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,           // WebGL if available, Canvas fallback
    width: 768,                  // Native game resolution (NES-era)
    height: 480,
    parent: container,           // Mount into the React container div
    backgroundColor: '#5C94FC', // Original SMB sky blue

    pixelArt: true,              // CRITICAL: disables antialiasing
                                 // Without this, pixel sprites look blurry

    scale: {
      mode: Phaser.Scale.FIT,   // Scale to fill container, maintain aspect ratio
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 768,
      height: 480,
    },

    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 980 },  // Tuned to match SMB feel
        debug: false,                // Set true during development
      },
    },

    input: {
      keyboard: platform === 'desktop',  // Keyboard only on desktop
      touch: platform === 'mobile',       // Touch only on mobile
      gamepad: false,
    },

    audio: {
      disableWebAudio: false,
      noAudio: false,
    },

    // Scene order matters — they load in sequence
    scene: [
      BootScene,
      PreloadScene,
      Level1_1,
      Level1_2,
      Level1_3,
      WinScene,
    ],
  };

  return new Phaser.Game(config);
}
```

---

---

# PART 4 — THE SCENE SYSTEM

Every state of the game is a Phaser "Scene". Scenes are like pages — only one (or a few) run at a time, they start and stop cleanly.

```
BootScene
  ↓  (immediately goes to Preload)
PreloadScene
  ↓  (loads all assets, shows loading bar)
Level1_1          → if player dies: restart Level1_1
  ↓  (reaches flagpole)
Level1_2          → if player dies: restart Level1_2
  ↓  (reaches flagpole or warp zone)
Level1_3          → if player dies: restart Level1_3
  ↓  (Bowser defeated)
WinScene          → "Hire Farhan" button shown
```

---

## Scene 1 — BootScene.ts

The very first thing that runs. Sets up global settings, then immediately starts PreloadScene.

```typescript
export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  create() {
    // Set world bounds (SMB levels are much wider than the screen)
    // Level 1-1 is approximately 6800px wide at NES scale
    this.scene.start('PreloadScene');
  }
}
```

---

## Scene 2 — PreloadScene.ts

Loads every asset the game needs before any gameplay begins. Shows a loading bar.

```typescript
export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'PreloadScene' }); }

  preload() {
    // Loading bar UI (drawn with Phaser graphics, no sprites needed)
    const bar = this.add.graphics();
    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0x00D4FF); // Cyan
      bar.fillRect(100, 230, 568 * value, 20);
    });

    // ── SPRITE SHEETS ──────────────────────────────────────────
    // frameWidth/Height must match the actual pixel dimensions
    // in the sprite sheet files from spriters-resource.com

    this.load.spritesheet('mario', '/game/sprites/mario_sprites.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('enemies', '/game/sprites/enemies_sprites.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('items', '/game/sprites/items_sprites.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('tiles', '/game/sprites/tiles_sprites.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    // ── TILEMAPS ───────────────────────────────────────────────
    this.load.tilemapTiledJSON('level_1_1', '/game/maps/level_1_1.json');
    this.load.tilemapTiledJSON('level_1_2', '/game/maps/level_1_2.json');
    this.load.tilemapTiledJSON('level_1_3', '/game/maps/level_1_3.json');

    // ── AUDIO (BGM only — SFX are synthesized) ─────────────────
    this.load.audio('bgm_overworld',   ['/game/audio/bgm_overworld.ogg',   '/game/audio/bgm_overworld.mp3']);
    this.load.audio('bgm_underground', ['/game/audio/bgm_underground.ogg', '/game/audio/bgm_underground.mp3']);
    this.load.audio('bgm_castle',      ['/game/audio/bgm_castle.ogg',      '/game/audio/bgm_castle.mp3']);
    this.load.audio('bgm_victory',     ['/game/audio/bgm_victory.ogg',     '/game/audio/bgm_victory.mp3']);
    this.load.audio('bgm_gameover',    ['/game/audio/bgm_gameover.ogg',    '/game/audio/bgm_gameover.mp3']);
  }

  create() {
    // All assets loaded — define animations ONCE here,
    // all scenes reuse them
    this.createAnimations();
    this.scene.start('Level1_1');
  }

  private createAnimations() {
    // Mario animations (frame numbers match the sprite sheet layout)
    this.anims.create({
      key: 'mario-walk',
      frames: this.anims.generateFrameNumbers('mario', { frames: [1, 2, 3] }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({ key: 'mario-stand', frames: [{ key: 'mario', frame: 0 }], frameRate: 1 });
    this.anims.create({ key: 'mario-jump',  frames: [{ key: 'mario', frame: 4 }], frameRate: 1 });
    this.anims.create({ key: 'mario-die',   frames: [{ key: 'mario', frame: 5 }], frameRate: 1 });

    // Goomba animation
    this.anims.create({
      key: 'goomba-walk',
      frames: this.anims.generateFrameNumbers('enemies', { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: 'goomba-squish',
      frames: [{ key: 'enemies', frame: 2 }],
      frameRate: 1,
    });

    // Coin spin animation
    this.anims.create({
      key: 'coin-spin',
      frames: this.anims.generateFrameNumbers('items', { frames: [0, 1, 2, 3] }),
      frameRate: 12,
      repeat: -1,
    });

    // Question block animation
    this.anims.create({
      key: 'qblock-idle',
      frames: this.anims.generateFrameNumbers('tiles', { frames: [0, 1, 2, 1] }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({ key: 'qblock-empty', frames: [{ key: 'tiles', frame: 3 }], frameRate: 1 });

    // Bowser animation
    this.anims.create({
      key: 'bowser-walk',
      frames: this.anims.generateFrameNumbers('enemies', { frames: [20, 21] }),
      frameRate: 4,
      repeat: -1,
    });
  }
}
```

---

## Scene 3 — Level1_1.ts (Overworld)

The most complex scene — this is the core gameplay loop. All other level scenes inherit from a `BaseLevel` class.

```typescript
// src/components/game/phaser/scenes/BaseLevel.ts
// All 3 levels share this base — avoids repeating physics/HUD setup

export abstract class BaseLevel extends Phaser.Scene {
  // Core game objects
  protected mario!: Phaser.Physics.Arcade.Sprite;
  protected groundLayer!: Phaser.Tilemaps.TilemapLayer;
  protected enemies!: Phaser.Physics.Arcade.Group;
  protected coins!: Phaser.Physics.Arcade.StaticGroup;
  protected questionBlocks!: Phaser.Physics.Arcade.StaticGroup;

  // Game state
  protected score: number = 0;
  protected coinCount: number = 0;
  protected lives: number = 3;
  protected marioState: 'small' | 'super' | 'fire' = 'small';
  protected isInvincible: boolean = false;
  protected isDead: boolean = false;
  protected timer: number = 300;
  protected timerInterval!: number;

  // BGM
  protected bgm!: Phaser.Sound.BaseSound;
  protected abstract bgmKey: string;
  protected abstract mapKey: string;
  protected abstract nextScene: string;

  create() {
    // ── TILEMAP SETUP ──────────────────────────────────────
    const map = this.make.tilemap({ key: this.mapKey });
    const tileset = map.addTilesetImage('tiles', 'tiles')!;

    // Create layers from Tiled JSON
    // Layer names must match what Antigravity named them in Tiled
    const bgLayer     = map.createLayer('Background', tileset, 0, 0)!;
    this.groundLayer  = map.createLayer('Ground', tileset, 0, 0)!;
    const objectLayer = map.getObjectLayer('Objects')!;

    // Set world bounds to full map width
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Enable collision on ground layer
    // Any tile with a collides property in Tiled becomes solid
    this.groundLayer.setCollisionByProperty({ collides: true });

    // ── SPAWN MARIO ────────────────────────────────────────
    // Spawn point set in Tiled as an Object named "MarioSpawn"
    const spawnPoint = this.findObject(objectLayer, 'MarioSpawn');
    this.mario = this.physics.add.sprite(spawnPoint.x!, spawnPoint.y!, 'mario');
    this.mario.setCollideWorldBounds(true);
    this.mario.play('mario-stand');

    // Mario-ground collision
    this.physics.add.collider(this.mario, this.groundLayer);

    // ── CAMERA FOLLOWS MARIO ──────────────────────────────
    this.cameras.main.startFollow(this.mario, true, 0.1, 0); // lerp X only

    // ── SPAWN ENEMIES FROM TILED ──────────────────────────
    this.enemies = this.physics.add.group();
    this.spawnEnemiesFromMap(objectLayer);
    this.physics.add.collider(this.enemies, this.groundLayer);

    // ── SPAWN COINS ───────────────────────────────────────
    this.coins = this.physics.add.staticGroup();
    this.spawnCoinsFromMap(objectLayer);

    // ── SPAWN QUESTION BLOCKS ─────────────────────────────
    this.questionBlocks = this.physics.add.staticGroup();
    this.spawnQBlocksFromMap(objectLayer);

    // ── OVERLAPS (non-physics, trigger only) ──────────────
    // Mario + coin = collect
    this.physics.add.overlap(this.mario, this.coins, this.collectCoin, undefined, this);
    // Mario + enemy = stomp or die
    this.physics.add.overlap(this.mario, this.enemies, this.marioHitEnemy, undefined, this);
    // Mario + question block = bump from below
    this.physics.add.collider(this.mario, this.questionBlocks, this.hitQuestionBlock, undefined, this);

    // ── HUD ───────────────────────────────────────────────
    this.setupHUD();

    // ── INPUT ─────────────────────────────────────────────
    this.setupInput();

    // ── BGM ───────────────────────────────────────────────
    this.bgm = this.sound.add(this.bgmKey, { loop: true, volume: 0.6 });
    this.bgm.play();

    // ── TIMER ─────────────────────────────────────────────
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timer--;
        this.updateHUD();
        if (this.timer <= 0) this.marioOutOfTime();
      }
    });

    // ── LISTEN FOR OVERLAY DISMISSED ──────────────────────
    // When React dismisses a popup, resume the game
    this.game.events.on('overlay-dismissed', () => {
      this.physics.resume();
      this.bgm.resume();
    });

    // ── PORTFOLIO TRIGGERS — COIN COUNT TRACKING ──────────
    this.coinCount = 0;
  }

  // ── INPUT SETUP ─────────────────────────────────────────────
  private setupInput() {
    if (this.input.keyboard) {
      // Desktop keyboard
      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.addKey('Z');  // Run
      this.input.keyboard.addKey('X');  // Fire
    }

    // Touch input (mobile) — handled by virtual D-pad in React
    // React sends touch events to the game via the bridge
    this.game.events.on('mobile-input', (input: MobileInput) => {
      this.mobileInput = input;
    });
  }

  // ── MARIO MOVEMENT LOOP ──────────────────────────────────────
  update() {
    if (this.isDead || !this.mario) return;
    this.handleMarioMovement();
    this.handleEnemyMovement();
    this.checkFallDeath();
  }

  private handleMarioMovement() {
    const speed = this.isRunning ? 180 : 130;
    const onGround = this.mario.body!.blocked.down;

    // Horizontal movement
    if (this.isMovingLeft()) {
      this.mario.setVelocityX(-speed);
      this.mario.setFlipX(true);
      if (onGround) this.mario.play('mario-walk', true);
    } else if (this.isMovingRight()) {
      this.mario.setVelocityX(speed);
      this.mario.setFlipX(false);
      if (onGround) this.mario.play('mario-walk', true);
    } else {
      this.mario.setVelocityX(0);
      if (onGround) this.mario.play('mario-stand', true);
    }

    // Jump
    if (this.isJumping() && onGround) {
      // Jump height varies with how long jump button held (SMB mechanic)
      this.mario.setVelocityY(-500);
      SFXSynth.playJump();
      this.mario.play('mario-jump', true);
    }

    // Variable jump height — release early = lower jump
    if (!this.isJumping() && this.mario.body!.velocity.y < -200) {
      this.mario.setVelocityY(this.mario.body!.velocity.y * 0.85);
    }
  }

  // ── COIN COLLECTION ──────────────────────────────────────────
  private collectCoin(mario: any, coin: any) {
    coin.destroy();
    this.score += 100;
    this.coinCount++;
    SFXSynth.playCoin();
    this.updateHUD();

    // Show coin pop animation (floating "+100" text)
    this.showFloatingText(coin.x, coin.y, '+100');

    // ── PORTFOLIO TRIGGER ─────────────────────────────────
    this.checkCoinTriggers(this.coinCount);
  }

  private checkCoinTriggers(count: number) {
    const triggers = PortfolioData.getCoinTrigger(count, this.scene.key);
    if (triggers) {
      this.showPortfolioOverlay(triggers);
    }
  }

  // ── QUESTION BLOCK HIT ───────────────────────────────────────
  private hitQuestionBlock(mario: any, block: any) {
    if (block.getData('hit')) return;  // Already hit

    block.setData('hit', true);
    block.play('qblock-empty');
    SFXSynth.playBlockHit();

    // Bump animation
    this.tweens.add({ targets: block, y: block.y - 8, duration: 80,
                      yoyo: true, ease: 'Quad.easeOut' });

    // Spawn item based on what the block contains (set in Tiled)
    const contains = block.getData('contains') as string;
    this.spawnItemFromBlock(block.x, block.y, contains);

    // ── PORTFOLIO TRIGGER ─────────────────────────────────
    const blockIndex = block.getData('portfolioIndex') as number;
    const data = PortfolioData.getQuestionBlockData(this.scene.key, blockIndex);
    if (data) this.showPortfolioOverlay(data);
  }

  // ── MARIO ENEMY INTERACTION ──────────────────────────────────
  private marioHitEnemy(mario: any, enemy: any) {
    const marioBottom = mario.body.bottom;
    const enemyTop = enemy.body.top;
    const stompThreshold = 10; // pixels

    if (marioBottom <= enemyTop + stompThreshold && mario.body.velocity.y > 0) {
      // STOMP — Mario lands on enemy
      this.stompEnemy(enemy);
    } else {
      // HIT — Enemy hurts Mario
      this.marioHit();
    }
  }

  private stompEnemy(enemy: any) {
    const type = enemy.getData('type') as string;
    SFXSynth.playStomp();
    this.score += 200;

    if (type === 'goomba') {
      enemy.play('goomba-squish');
      this.time.delayedCall(400, () => enemy.destroy());
    }
    // Koopa: becomes shell
    // Bowser: needs multiple hits + fireball

    // Bounce Mario up after stomp
    this.mario.setVelocityY(-350);
    this.showFloatingText(enemy.x, enemy.y, '200');
  }

  private marioHit() {
    if (this.isInvincible) return;

    if (this.marioState === 'super' || this.marioState === 'fire') {
      // Shrink back to small Mario
      this.marioState = 'small';
      this.setInvincible(2000); // 2 seconds invincibility after hit
      SFXSynth.playPowerup();   // Plays "shrink" variation
    } else {
      // Small Mario → die
      this.marioKill();
    }
  }

  private marioKill() {
    if (this.isDead) return;
    this.isDead = true;

    this.lives--;
    this.bgm.stop();
    SFXSynth.playMarioDie();
    this.mario.play('mario-die');
    this.mario.setVelocityY(-500); // Death bounce
    this.physics.pause();

    this.time.delayedCall(2000, () => {
      if (this.lives > 0) {
        this.scene.restart();
      } else {
        this.showGameOver();
      }
    });
  }

  // ── PORTFOLIO OVERLAY TRIGGER ────────────────────────────────
  // This is THE key function that connects game to portfolio
  protected showPortfolioOverlay(payload: OverlayPayload) {
    // Pause physics + music
    this.physics.pause();
    this.bgm.pause();
    clearInterval(this.timerInterval);

    // Tell React to show the overlay
    // GameBridge is a singleton that holds the React callback
    GameBridge.emit('showOverlay', payload);
    // React's onOverlayShow callback fires → setOverlayData → overlay renders

    // Auto-dismiss fallback: if user doesn't press anything in 5s, auto-resume
    // (only for toast-style facts, not for win/achievement screens)
    if (payload.type === 'fact' || payload.type === 'skill') {
      this.time.delayedCall(4000, () => {
        if (GameBridge.isOverlayVisible()) {
          GameBridge.emit('hideOverlay', null);
          this.physics.resume();
          this.bgm.resume();
        }
      });
    }
  }

  // ── LEVEL COMPLETE ───────────────────────────────────────────
  protected levelComplete() {
    this.bgm.stop();
    clearInterval(this.timerInterval);
    // Bonus points for remaining time
    const timeBonus = this.timer * 50;
    this.score += timeBonus;

    // Short pause, then show level clear overlay, then next scene
    this.time.delayedCall(1500, () => {
      this.showPortfolioOverlay(PortfolioData.getLevelClearData(this.scene.key));
      // After overlay dismissed, GameWrapper moves to nextScene
      this.game.events.once('overlay-dismissed', () => {
        this.bgm.stop();
        this.scene.start(this.nextScene, { score: this.score, lives: this.lives });
      });
    });
  }
}
```

---

## Scenes 4 & 5 — Level1_2 and Level1_3 (Underground + Castle)

These extend BaseLevel and override only what's different:

```typescript
// Level1_2.ts — Underground
export class Level1_2 extends BaseLevel {
  protected bgmKey = 'bgm_underground';
  protected mapKey = 'level_1_2';
  protected nextScene = 'Level1_3';
  // BaseLevel handles everything. This file is ~20 lines.
}

// Level1_3.ts — Castle (Bowser level)
export class Level1_3 extends BaseLevel {
  protected bgmKey = 'bgm_castle';
  protected mapKey = 'level_1_3';
  protected nextScene = 'WinScene';
  private bowser!: Phaser.Physics.Arcade.Sprite;
  private axe!: Phaser.Physics.Arcade.Sprite;
  private bridge!: Phaser.Tilemaps.TilemapLayer;

  create() {
    super.create();
    this.spawnBowser();
    this.spawnAxe();
  }

  private spawnBowser() {
    const pos = this.findObject(this.map.getObjectLayer('Objects')!, 'BowserSpawn');
    this.bowser = this.physics.add.sprite(pos.x!, pos.y!, 'enemies', 20);
    this.bowser.play('bowser-walk');
    this.bowser.setData('health', 1); // One axe hit to defeat (original SMB)

    // Bowser fires at Mario every 3 seconds
    this.time.addEvent({
      delay: 3000,
      callback: this.bowserFire,
      callbackScope: this,
      loop: true
    });
  }

  private spawnAxe() {
    const pos = this.findObject(this.map.getObjectLayer('Objects')!, 'Axe');
    this.axe = this.physics.add.staticSprite(pos.x!, pos.y!, 'tiles', 28);
    // Mario touching axe = bridge collapses = Bowser falls
    this.physics.add.overlap(this.mario, this.axe, this.bowserDefeated, undefined, this);
  }

  private bowserDefeated() {
    this.axe.destroy();
    this.bowser.setVelocityY(500);  // Falls into lava
    this.bowser.setVelocityX(100);
    SFXSynth.playBossDie();
    this.bgm.stop();

    // Bridge collapse animation (remove bridge tiles one by one)
    this.collapseBridge();

    this.time.delayedCall(2000, () => {
      // SHOW THE BIG WIN OVERLAY — the full portfolio summary
      this.showPortfolioOverlay(PortfolioData.getBowserDefeatedData());
      this.game.events.once('overlay-dismissed', () => {
        this.scene.start('WinScene', { score: this.score, lives: this.lives });
      });
    });
  }
}
```

---

## Scene 6 — WinScene.ts

Shown after Bowser is defeated and the win overlay is dismissed.

```typescript
export class WinScene extends Phaser.Scene {
  constructor() { super({ key: 'WinScene' }); }

  create(data: { score: number; lives: number }) {
    // Play victory music
    this.sound.add('bgm_victory', { loop: false }).play();

    // This scene just holds the game canvas steady
    // The actual Win content is rendered by React's GameOverlay
    // which was already triggered in Level1_3's bowserDefeated()

    // The GameOverlay at this point shows the full portfolio summary
    // with the HIRE FARHAN button

    // "Play Again" in the overlay restarts from Level1_1
    this.game.events.on('play-again', () => {
      this.scene.start('Level1_1');
    });
  }
}
```

---

---

# PART 5 — THE GAME BRIDGE (PHASER ↔ REACT)

This is the most technically important piece. It allows Phaser (which runs outside React's component tree) to communicate with React.

```typescript
// src/components/game/phaser/bridge/GameBridge.ts

type OverlayEvent = 'showOverlay' | 'hideOverlay';

export interface GameBridgeCallbacks {
  onOverlayShow: (payload: OverlayPayload) => void;
  onOverlayHide: () => void;
  onGameOver: () => void;
  onWin: () => void;
}

// Singleton — one instance for the whole game session
class GameBridgeClass {
  private callbacks: GameBridgeCallbacks | null = null;
  private overlayVisible = false;

  init(callbacks: GameBridgeCallbacks) {
    this.callbacks = callbacks;
  }

  emit(event: OverlayEvent, payload: OverlayPayload | null) {
    if (!this.callbacks) return;

    if (event === 'showOverlay' && payload) {
      this.overlayVisible = true;
      this.callbacks.onOverlayShow(payload);
    } else if (event === 'hideOverlay') {
      this.overlayVisible = false;
      this.callbacks.onOverlayHide();
    }
  }

  isOverlayVisible() { return this.overlayVisible; }

  destroy() {
    this.callbacks = null;
    this.overlayVisible = false;
  }
}

export const GameBridge = new GameBridgeClass();
```

---

---

# PART 6 — PORTFOLIO OVERLAY DATA

## portfolioData.ts — The Content File

This is the file where all of Farhan's portfolio info lives in game context. Antigravity drafts it from the V3 plan B3 section. Farhan reviews and approves the wording.

```typescript
// src/components/game/phaser/data/portfolioData.ts

// ── TYPES ───────────────────────────────────────────────────────
export type OverlayType = 'fact' | 'skill' | 'project' | 'achievement' | 'level-clear' | 'game-over' | 'win';

export interface OverlayPayload {
  type: OverlayType;
  title?: string;
  subtitle?: string;
  body?: string;
  badge?: string;
  tech?: string[];
  github?: string;
  autoDismiss?: boolean;
  autoDismissMs?: number;
}

// ── COIN FACT TRIGGERS ──────────────────────────────────────────
// Coin count → fact shown (per level)

const COIN_FACTS: Record<string, Record<number, OverlayPayload>> = {
  Level1_1: {
    1: {
      type: 'fact',
      body: '🪙 Started coding at 16. Still going.',
      autoDismiss: true, autoDismissMs: 3000,
    },
    10: {
      type: 'fact',
      body: '🪙 SIH 2025 National Winner — Project Lead.',
      autoDismiss: true, autoDismissMs: 3000,
    },
    20: {
      type: 'fact',
      body: '🪙 Led 120+ members as CSI President.',
      autoDismiss: true, autoDismissMs: 3000,
    },
  },
  Level1_2: {
    1:  { type: 'fact', body: '🪙 6 internships. 0 days wasted.', autoDismiss: true, autoDismissMs: 3000 },
    10: { type: 'fact', body: '🪙 33+ certifications. Google, IBM, TCS.', autoDismiss: true, autoDismissMs: 3000 },
    20: { type: 'fact', body: '🪙 Open Group International Finalist.', autoDismiss: true, autoDismissMs: 3000 },
  },
  Level1_3: {
    1:  { type: 'fact', body: '🪙 Built DudeDice — a real live brand.', autoDismiss: true, autoDismissMs: 3000 },
    10: { type: 'fact', body: '🪙 MCA @ VSIT. Still learning every day.', autoDismiss: true, autoDismissMs: 3000 },
  },
};

// ── QUESTION BLOCK TRIGGERS ─────────────────────────────────────
// Each block has an index (set in Tiled as object property portfolioIndex)

const QUESTION_BLOCK_DATA: Record<string, Record<number, OverlayPayload>> = {
  Level1_1: {
    1: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'React.js', body: 'Frontend · Used in Kavach, DudeDice, SwachhCity' },
    2: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'Node.js',  body: 'Backend · Used in 8+ projects' },
    3: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'Python',   body: 'AI & ML · FastAPI, Django, Flask, ML models' },
  },
  Level1_2: {
    1: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'FastAPI',         body: 'Backend API · Used in JalSevak, SwachhCity' },
    2: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'Flutter',         body: 'Cross-Platform · iOS + Android + Web' },
    3: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'ESP32 / IoT',     body: 'Embedded Systems · Kavach, EcoSweep' },
    4: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'PostgreSQL+PostGIS', body: 'Geospatial Database · JalSevak, SwachhCity' },
  },
  Level1_3: {
    1: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'TensorFlow/PyTorch', body: 'Deep Learning · AI systems and CV models' },
    2: { type: 'skill', title: 'SKILL UNLOCKED', subtitle: 'Docker+WebSockets',  body: 'DevOps + Real-time · JalSevak, SwachhCity' },
  },
};

// ── MUSHROOM PROJECT CARDS ──────────────────────────────────────
const MUSHROOM_PROJECTS: Record<string, OverlayPayload> = {
  Level1_1: {
    type: 'project',
    title: 'PROJECT UNLOCKED',
    subtitle: 'Kavach',
    badge: '🏆 SIH 2025 NATIONAL WINNER',
    body: 'AI + IoT disaster preparedness platform for schools & colleges. Endorsed by Govt of Punjab.',
    tech: ['IoT (ESP32)', 'Next.js', 'Flutter', 'Socket.io', 'Redis'],
    github: 'https://github.com/FarhanSayed16',
  },
  Level1_2: {
    type: 'project',
    title: 'PROJECT UNLOCKED',
    subtitle: 'JalSevak',
    badge: '🌊 AI COASTAL PLATFORM',
    body: 'Real-time coastal hazard intelligence. AI-analyzed citizen reports + authority dashboards.',
    tech: ['Flutter', 'FastAPI', 'NLP (spaCy)', 'PostGIS', 'Docker'],
    github: 'https://github.com/FarhanSayed16',
  },
  Level1_3: {
    type: 'project',
    title: 'PROJECT UNLOCKED',
    subtitle: 'EcoSweep',
    badge: '🤖 FINAL YEAR PROJECT',
    body: 'Semi-autonomous terrain-adaptive garbage collection robot with computer vision.',
    tech: ['Arduino', 'ESP32', 'Raspberry Pi', 'Python', 'Flutter'],
    github: 'https://github.com/FarhanSayed16',
  },
};

// ── STAR ACHIEVEMENT FLASHES ────────────────────────────────────
const STAR_ACHIEVEMENTS: Record<string, OverlayPayload> = {
  Level1_1: { type: 'achievement', title: '⭐ ACHIEVEMENT', subtitle: 'SIH 2025 NATIONAL WINNER', body: 'Government of Punjab · Ministry of Education', autoDismiss: true, autoDismissMs: 4000 },
  Level1_2: { type: 'achievement', title: '⭐ ACHIEVEMENT', subtitle: 'MECHN0VA 1ST PLACE', body: 'Universal Terrain Cleaning Robot · 2025', autoDismiss: true, autoDismissMs: 4000 },
  Level1_3: { type: 'achievement', title: '⭐ ACHIEVEMENT', subtitle: 'OPEN GROUP INTERNATIONAL FINALIST', body: 'Enterprise Architecture Competition · GovBuy', autoDismiss: true, autoDismissMs: 4000 },
};

// ── THE BIG WIN PAYLOAD — shown when Bowser is defeated ─────────
export const BOWSER_DEFEATED: OverlayPayload = {
  type: 'win',
  title: '🏆 WORLD 1 COMPLETE',
  subtitle: 'Farhan Sayed',
  body: `Full Stack Developer · AI Builder · Mumbai

🏆 SIH 2025 National Winner
🌍 Open Group International Finalist
🥇 MechNova 1st Place · 2025
🎓 CSI President — 120+ members
💼 5 Internships Completed
📦 11 Projects Shipped
🧠 58+ Technologies Mastered`,
};

// ── LEVEL CLEAR DATA ────────────────────────────────────────────
const LEVEL_CLEAR: Record<string, OverlayPayload> = {
  Level1_1: { type: 'level-clear', title: '🏁 LEVEL CLEAR!', body: '3 projects shipped in 2024 alone.' },
  Level1_2: { type: 'level-clear', title: '🏁 LEVEL CLEAR!', body: '58+ technologies mastered.' },
};

// ── PUBLIC API ──────────────────────────────────────────────────
export const PortfolioData = {
  getCoinTrigger: (count: number, scene: string) => COIN_FACTS[scene]?.[count] ?? null,
  getQuestionBlockData: (scene: string, index: number) => QUESTION_BLOCK_DATA[scene]?.[index] ?? null,
  getMushroomProject: (scene: string) => MUSHROOM_PROJECTS[scene] ?? null,
  getStarAchievement: (scene: string) => STAR_ACHIEVEMENTS[scene] ?? null,
  getLevelClearData: (scene: string) => LEVEL_CLEAR[scene] ?? null,
  getBowserDefeatedData: () => BOWSER_DEFEATED,
};
```

---

---

# PART 7 — GAME OVERLAY (REACT LAYER)

```typescript
// src/components/game/GameOverlay.tsx
// This renders on top of the Phaser canvas

interface GameOverlayProps {
  data: OverlayPayload;
  platform: 'desktop' | 'mobile';
  onDismiss: () => void;
}

export default function GameOverlay({ data, platform, onDismiss }: GameOverlayProps) {
  const isMobile = platform === 'mobile';

  return (
    <motion.div
      className="game-overlay"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: data.type === 'fact' || data.type === 'skill'
          ? 'rgba(0,0,0,0.6)'   // Semi-transparent for quick facts
          : 'rgba(0,0,0,0.88)', // Nearly opaque for big popups
      }}
    >
      {/* Pixel art border box */}
      <div className={`overlay-box ${isMobile ? 'overlay-box--mobile' : ''}`}
           style={{ fontFamily: 'var(--font-pixel)' }}>

        {/* Badge */}
        {data.badge && <div className="overlay-badge">{data.badge}</div>}

        {/* Title */}
        {data.title && <h2 className="overlay-title">{data.title}</h2>}

        {/* Subtitle */}
        {data.subtitle && <h3 className="overlay-subtitle">{data.subtitle}</h3>}

        {/* Body */}
        {data.body && <p className="overlay-body">{data.body}</p>}

        {/* Tech stack tags (project cards) */}
        {data.tech && (
          <div className="overlay-tech">
            {data.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
          </div>
        )}

        {/* Action buttons */}
        {data.type === 'win' ? (
          <div className="overlay-actions">
            <button onClick={() => window.open('mailto:farhan@farhanbuilds.in')}
                    className="btn-hire">
              ✉ HIRE FARHAN
            </button>
            <button onClick={() => { onDismiss(); /* triggers play-again */ }}
                    className="btn-secondary">
              PLAY AGAIN
            </button>
          </div>
        ) : data.type === 'game-over' ? (
          <div className="overlay-actions">
            <button onClick={onDismiss} className="btn-secondary">TRY AGAIN</button>
          </div>
        ) : !data.autoDismiss ? (
          <button onClick={onDismiss} className="btn-secondary">KEEP PLAYING →</button>
        ) : (
          <div className="overlay-autodismiss">
            Press any key to continue · auto-closes in {data.autoDismissMs! / 1000}s
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

---

---

# PART 8 — DUAL PLATFORM: DESKTOP vs MOBILE

---

## How the Same Game Runs on Both

```
DESKTOP (OS Window)                    MOBILE (Nokia Phone Screen)
───────────────────                    ───────────────────────────
Container: 768 × 480px                 Container: 260 × 195px
Phaser Scale: FIT mode                 Phaser Scale: FIT mode (same)
Phaser renders at 768×480 internally   Phaser renders at 768×480 internally
Canvas CSS scales to fill container    Canvas CSS scales to fill container
Result: full game, crisp pixels        Result: same game, smaller, still crisp

Input: keyboard                        Input: React D-pad buttons → Bridge
Controls: arrow keys, space, Z/X       Controls: tap A/B/up/down buttons

Overlay: centered in OS window         Overlay: centered in Nokia screen area
HUD text size: normal                  HUD text size: scaled down (CSS)

Exit: ESC closes window                Exit: "Back" button in Nokia keypad
```

---

## Mobile Touch Controls (React D-pad)

The Nokia phone's virtual buttons are React elements. When pressed, they send input to Phaser via the bridge:

```typescript
// Inside PhoneKeypad.tsx — the Nokia buttons
const handleButtonPress = (button: 'left' | 'right' | 'up' | 'A' | 'B') => {
  // Tell the game about this input
  if (gameInstanceRef.current) {
    gameInstanceRef.current.events.emit('mobile-input', {
      left:  button === 'left',
      right: button === 'right',
      jump:  button === 'A' || button === 'up',
      run:   button === 'B',
    });
  }
};

// Layout (shown on Nokia screen bottom when game is active)
// Replaces the normal number pad with game controls
```

```
Nokia in game mode:
  ┌────────────────────────────────┐
  │       [GAME CANVAS HERE]       │  ← Phaser canvas fills this
  └────────────────────────────────┘
  
  ┌──────┐  ┌───┐  ┌───────────┐
  │  ◄ ► │  │ A │  │ B (run)   │
  │ D-pad│  │(jump)│           │
  └──────┘  └───┘  └───────────┘
  
  [PAUSE]  [MENU (exit game)]
```

---

## Phaser Input Handling (Desktop + Mobile)

```typescript
// In BaseLevel.create() — input setup handles both platforms

private isMovingLeft(): boolean {
  // Desktop: arrow key
  if (this.cursors?.left?.isDown) return true;
  // Mobile: bridge input
  if (this.mobileInput?.left) return true;
  return false;
}

private isMovingRight(): boolean {
  if (this.cursors?.right?.isDown) return true;
  if (this.mobileInput?.right) return true;
  return false;
}

private isJumping(): boolean {
  if (this.cursors?.space?.isDown || this.cursors?.up?.isDown) return true;
  if (this.mobileInput?.jump) return true;
  return false;
}

private isRunning(): boolean {
  const Z = this.input.keyboard?.addKey('Z');
  if (Z?.isDown) return true;
  if (this.mobileInput?.run) return true;
  return false;
}
```

---

---

# PART 9 — LEVEL DESIGN PROCESS

---

## How the Levels Are Built (Tiled Map Editor)

Antigravity uses Tiled (free, mapeditor.org) to design all 3 levels. This is the process:

```
Step 1: Import the tiles_sprites.png into Tiled as a tileset
        Set tile size: 16×16px

Step 2: Create a new map
        Map size: match original SMB (1-1 is 212 tiles wide × 15 tiles tall)
        Tile size: 16×16

Step 3: Create layers in Tiled:
        - Background  (sky, hills, clouds)
        - Ground      (collision tiles, set collides=true in tile properties)
        - Objects     (question blocks, bricks, pipes — as Tiled Objects)
        - Spawns      (enemy positions, item positions, warp zones)

Step 4: Recreate original SMB 1-1/1-2/1-3 layouts
        Reference: Search "super mario bros level maps" for exact tile layouts.
        The original layouts are extremely well-documented by the community.

Step 5: Set Object Properties in Tiled
        Each question block gets:
          - type: "question-block"
          - contains: "mushroom" | "coin" | "star" | "fire-flower"
          - portfolioIndex: 1 | 2 | 3 (which portfolio popup to show)
        Each enemy spawn gets:
          - type: "goomba" | "koopa" | "piranha"
        Special objects:
          - MarioSpawn (player start position)
          - Flagpole (end of level 1-1/1-2)
          - BowserSpawn (level 1-3 only)
          - Axe (level 1-3 only)
          - WarpZone (level 1-2 — triggers warp overlay)

Step 6: Export as JSON → save to /public/game/maps/
        level_1_1.json, level_1_2.json, level_1_3.json

Step 7: Phaser reads the JSON with:
        const map = this.make.tilemap({ key: 'level_1_1' });
```

---

## Level Reference (for Antigravity)

```
Level 1-1 (Overworld):
  Width:    212 tiles = 3392px at 16px/tile
  Key features:  First pipe at tile 28, underground block at tile 18-23,
                 first Goomba at tile 22, flagpole at tile 198
  Reference:     Search "SMB World 1-1 full map" — pixel-perfect maps exist

Level 1-2 (Underground):
  Width:    222 tiles = 3552px
  Key features:  Warp zone near end (3 pipes to worlds 2,3,4 — use only
                 as shortcut to 1-3 in our version), darkness effect
  Reference:     Search "SMB World 1-2 full map"

Level 1-3 (Castle):
  Width:    200 tiles = 3200px
  Key features:  Lava pits, castle wall tiles, Bowser on bridge at end,
                 axe at far right
  Reference:     Search "SMB World 1-4 map" (classic castle layout)
                 Note: Use World 1-4 for the castle — it's the definitive
                 first Bowser castle level in SMB1
```

---

---

# PART 10 — FARHAN'S COMPLETE INVOLVEMENT

---

## What Farhan Does vs What Antigravity Does

```
FARHAN DOES (total time: ~1–2 hours across 4 weeks)
─────────────────────────────────────────────────────────────────
✅ Review portfolioData.ts draft from Antigravity (30 min)
   — Check the coin facts are accurate
   — Check the project descriptions read well
   — Approve the Bowser win screen text

✅ One decision: does Mario look custom or classic?
   Option A: Standard red Mario (fastest, most nostalgic)
   Option B: Mario with a slight skin tone adjustment (simple)
   Option C: Custom outfit on Mario (more work, but distinctive)
   → Decision needed before Week 3 Day 11

✅ Provide project screenshots when ready (already required anyway)
   — Game popups use the same /public/images/projects/ folder
   — Same 33 screenshots as the OS Projects window

✅ Test the game when Antigravity delivers Day 15 build
   — Play through all 3 levels
   — Check all portfolio overlays feel right
   — Note any text you want changed (Antigravity updates portfolioData.ts)


ANTIGRAVITY DOES (everything else)
─────────────────────────────────────────────────────────────────
✅ Write all 6 Phaser scenes (~1500 lines of TypeScript)
✅ Write GameBridge singleton
✅ Write GameOverlay React component
✅ Write SFXSynth.ts (all 12 synthesized sounds)
✅ Write mobile D-pad input bridge
✅ Download and integrate all sprites from spriters-resource.com
✅ Build all 3 level tilemaps in Tiled Map Editor
✅ Download CC0 BGM from opengameart.org + convert to OGG+MP3
✅ Tune physics (gravity, jump height, run speed to match original SMB)
✅ Implement all enemy AI (Goomba, Koopa, Bowser, Piranha Plant)
✅ Implement all power-up logic (Mushroom, Fire Flower, Star, 1-Up)
✅ Implement Bowser boss fight (walk, fire, bridge collapse)
✅ Draft portfolioData.ts content from V3 plan
✅ Performance optimization (dynamic import, sprite atlas if needed)
✅ Cross-browser testing
✅ Test on actual mobile device (real Nokia-sized screen area)
```

---

## What Could Block the Game (and How to Prevent It)

```
POTENTIAL BLOCKER            PREVENTION
────────────────────────     ──────────────────────────────────────
Phaser physics feels wrong   Antigravity has reference: real SMB
                             physics values are well-documented.
                             Tune in first 2 days of game build.

Sprite sheet frame numbers   Download sprites Day 1 of Week 3.
don't match Phaser config    Inspect pixel dimensions carefully.
                             Note exact frameWidth/frameHeight.

BGM files not found          Download all 5 BGM files before
                             starting PreloadScene code.

portfolioData.ts content     Antigravity drafts it in Day 13.
not approved by Farhan       Farhan reviews within 24 hours.
                             Hard deadline: before Day 15.

Mobile game too small        This is expected — Nokia screen is small.
                             Solution: slightly reduce game complexity
                             on mobile (fewer on-screen enemies at once).
                             HUD text uses smaller Press Start 2P size.

Phaser and React fighting    NEVER modify Phaser game object state
over the same canvas         from React. Bridge is one-way only.
                             This rule prevents all race conditions.
```

---

---

# SUMMARY — GAME ENGINE IN 10 POINTS

```
1. Phaser.js 3 runs the Mario game inside an HTML5 Canvas
2. The Canvas is mounted by a React component (GameWrapper.tsx)
3. Phaser knows nothing about React — they communicate ONE way only
4. All portfolio info is stored in portfolioData.ts
5. Game events (coin, block, boss) → Bridge → React overlay renders
6. The same game runs on both desktop (768×480px) and mobile (260×195px)
   via Phaser's built-in Scale Manager (FIT mode)
7. Desktop uses keyboard. Mobile uses React D-pad → bridge → Phaser
8. Sprites come from spriters-resource.com (fan-use, non-commercial)
9. Audio: BGM from opengameart.org (CC0). SFX synthesized in code (Web Audio API)
10. Farhan's only job: approve the text content in portfolioData.ts
    Everything else is built entirely by Antigravity
```

---

*Game Engine Technical Plan — Portfolio V3 "Farhan's World"*
*farhanbuilds.in · Farhan Sayed · Mumbai*
*Document version 1.0 — Complete reference for Antigravity game developer*

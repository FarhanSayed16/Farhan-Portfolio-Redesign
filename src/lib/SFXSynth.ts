const audioCache = new Map<string, HTMLAudioElement>();

const audioFiles = {
  jump: '/sounds/smb_jump.wav',
  jumpBig: '/sounds/smb_jump_big.wav',
  coin: '/sounds/smb_coin.wav',
  die: '/sounds/smb_mariodie.wav',
  stomp: '/sounds/smb_stomp.wav',
  powerup: '/sounds/smb_powerup.wav',
  oneup: '/sounds/smb_1up.wav',
  flagpole: '/sounds/smb_stage_clear.wav',
  block: '/sounds/smb_bump.wav',
  brick: '/sounds/smb_brick.wav',
  fireball: '/sounds/smb_fireball.wav',
  kick: '/sounds/smb_kick.wav',
  boss: '/sounds/smb_bowserfall.wav',
  gameover: '/sounds/smb_gameover.wav',
};

/** Long jingles — only one may play; stops previous + should pause BGM. */
const EXCLUSIVE = new Set(['die', 'flagpole', 'gameover', 'boss']);

export class SFXSynth {
  private isMuted = false;
  private exclusive: HTMLAudioElement | null = null;
  private active = new Set<HTMLAudioElement>();

  constructor() {
    this.checkMute();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => this.checkMute());
      window.addEventListener('farhan-mute-change', () => this.checkMute());

      if (audioCache.size === 0) {
        for (const [key, url] of Object.entries(audioFiles)) {
          const a = new Audio(url);
          a.preload = 'auto';
          audioCache.set(key, a);
        }
      }
    }
  }

  private checkMute() {
    try {
      const raw = localStorage.getItem('farhan-muted');
      this.isMuted = raw === 'true' || raw === JSON.stringify(true);
    } catch {
      this.isMuted = false;
    }
  }

  /** Stop die / stage-clear / game-over so they don't stack with BGM or each other. */
  stopExclusive() {
    if (this.exclusive) {
      this.exclusive.pause();
      this.exclusive.currentTime = 0;
      this.exclusive = null;
    }
  }

  /** Kill every in-flight SFX (window close / game unmount). */
  stopAll() {
    this.stopExclusive();
    for (const a of this.active) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    this.active.clear();
    for (const a of audioCache.values()) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }

  private playAudio(key: keyof typeof audioFiles) {
    if (this.isMuted) return;
    try {
      const cached = audioCache.get(key);
      if (!cached) return;
      if (EXCLUSIVE.has(key)) {
        this.stopExclusive();
        const a = cached.cloneNode() as HTMLAudioElement;
        a.volume = 0.55;
        this.exclusive = a;
        this.active.add(a);
        a.addEventListener('ended', () => {
          if (this.exclusive === a) this.exclusive = null;
          this.active.delete(a);
        });
        void a.play().catch(() => {});
        return;
      }
      const clone = cached.cloneNode() as HTMLAudioElement;
      clone.volume = 0.5;
      this.active.add(clone);
      clone.addEventListener('ended', () => this.active.delete(clone));
      void clone.play().catch(() => {});
    } catch {
      // silent catch for autoplay policies
    }
  }

  playJump(big = false) {
    this.playAudio(big ? 'jumpBig' : 'jump');
  }
  playCoin() {
    this.playAudio('coin');
  }
  playStomp() {
    this.playAudio('stomp');
  }
  playBlock() {
    this.playAudio('block');
  }
  playBrick() {
    this.playAudio('brick');
  }
  playFireball() {
    this.playAudio('fireball');
  }
  playKick() {
    this.playAudio('kick');
  }
  playPowerup() {
    this.playAudio('powerup');
  }
  playOneup() {
    this.playAudio('oneup');
  }
  playDie() {
    this.playAudio('die');
  }
  playFlagpole() {
    this.playAudio('flagpole');
  }
  playGameOver() {
    this.playAudio('gameover');
  }
  playBoss() {
    this.playAudio('boss');
  }
}

export function notifyMuteChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('farhan-mute-change'));
  }
}

let sharedSfx: SFXSynth | null = null;

export function getGameSFX() {
  if (typeof window === 'undefined') return null;
  if (!sharedSfx) sharedSfx = new SFXSynth();
  return sharedSfx;
}

import { getGameBGM } from '@/lib/GameBGM';

/** Stop BGM + SFX when the game window closes. */
export function silenceGameAudio() {
  getGameSFX()?.stopAll();
  getGameBGM()?.stop();
}

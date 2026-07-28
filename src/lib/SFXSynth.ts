const audioCache = new Map<string, HTMLAudioElement>();

const audioFiles = {
  jump: '/sounds/smb_jump.mp3',
  coin: '/sounds/smb_coin.mp3',
  die: '/sounds/smb_mariodie.mp3',
  stomp: '/sounds/smb_stomp.mp3',
  powerup: '/sounds/smb_powerup.mp3',
  oneup: '/sounds/smb_1up.mp3',
  flagpole: '/sounds/smb_stage_clear.mp3',
  // Re-use stomp for block and boss for now, since we skipped bump.mp3
  block: '/sounds/smb_stomp.mp3',
  boss: '/sounds/smb_stomp.mp3',
  gameover: '/sounds/smb_mariodie.mp3',
};

export class SFXSynth {
  private isMuted = false;

  constructor() {
    this.checkMute();
    
    if (typeof window !== 'undefined') {
      // Cross-tab mute sync
      window.addEventListener('storage', () => this.checkMute());
      // Same-tab mute sync
      window.addEventListener('farhan-mute-change', () => this.checkMute());
      
      // Preload
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

  private playAudio(key: keyof typeof audioFiles) {
    if (this.isMuted) return;
    try {
      const cached = audioCache.get(key);
      if (cached) {
        const clone = cached.cloneNode() as HTMLAudioElement;
        clone.volume = 0.5;
        void clone.play().catch(() => {});
      }
    } catch {
      // silent catch for autoplay policies
    }
  }

  playJump() { this.playAudio('jump'); }
  playCoin() { this.playAudio('coin'); }
  playStomp() { this.playAudio('stomp'); }
  playBlock() { this.playAudio('block'); }
  playPowerup() { this.playAudio('powerup'); }
  playDie() { this.playAudio('die'); }
  playFlagpole() { this.playAudio('flagpole'); }
  playGameOver() { this.playAudio('gameover'); }
  playBoss() { this.playAudio('boss'); }
}

export function notifyMuteChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('farhan-mute-change'));
  }
}

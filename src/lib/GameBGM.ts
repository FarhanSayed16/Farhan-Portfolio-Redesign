/**
 * Game BGM — loops overworld/castle WAV (SMB-style fan recreation).
 */
export class GameBGM {
  private audio: HTMLAudioElement | null = null;
  private muted = false;
  private playing = false;
  private mood: 'overworld' | 'castle' = 'overworld';
  private gen = 0;

  private checkMute() {
    try {
      const raw = localStorage.getItem('farhan-muted');
      this.muted = raw === 'true' || raw === JSON.stringify(true);
    } catch {
      this.muted = false;
    }
  }

  start(mood: 'overworld' | 'castle' = 'overworld') {
    if (typeof window === 'undefined') return;
    this.checkMute();
    // Always restart clean — avoids stacked Audio elements after death/restart races.
    this.stop();
    this.mood = mood;
    this.playing = true;
    const myGen = ++this.gen;
    const src =
      mood === 'castle' ? '/game/audio/castle.wav' : '/game/audio/overworld.wav';
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0.35;
    this.audio.muted = this.muted;
    void this.audio.play().catch(() => {});

    const poll = () => {
      if (myGen !== this.gen || !this.playing || !this.audio) return;
      this.checkMute();
      this.audio.muted = this.muted;
      window.setTimeout(poll, 500);
    };
    poll();
  }

  stop() {
    this.playing = false;
    this.gen += 1;
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }
}

let sharedBgm: GameBGM | null = null;

export function getGameBGM() {
  if (typeof window === 'undefined') return null;
  if (!sharedBgm) sharedBgm = new GameBGM();
  return sharedBgm;
}

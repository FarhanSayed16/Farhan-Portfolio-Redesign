'use client';
import { useCallback } from 'react';

// Global AudioContext and Buffers for zero-latency playback
let audioCtx: AudioContext | null = null;
const audioBuffers: Record<string, AudioBuffer> = {};

const AUDIO_FILES = {
  startup: '/sounds/os_startup.mp3',
  typing: '/audiotyping.mp3',
  password: '/audio_passwordscreen.mp3'
};

if (typeof window !== 'undefined') {
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (AudioContextClass) {
    audioCtx = new AudioContextClass();
    
    // Pre-fetch and decode all audio files into memory
    Object.entries(AUDIO_FILES).forEach(([key, url]) => {
      fetch(url)
        .then(res => res.arrayBuffer())
        .then(buffer => audioCtx?.decodeAudioData(buffer))
        .then(decoded => {
          if (decoded) audioBuffers[key] = decoded;
        })
        .catch(err => console.warn(`Failed to decode ${url}:`, err));
    });
  }
}

const activeSources: Record<string, AudioBufferSourceNode> = {};

function playBuffer(key: keyof typeof AUDIO_FILES, volume: number, allowOverlap = false) {
  if (!audioCtx || !audioBuffers[key]) return;
  
  const play = () => {
    try {
      if (!allowOverlap && activeSources[key]) {
        activeSources[key].stop();
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffers[key];
      const gain = audioCtx.createGain();
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(audioCtx.destination);
      source.start(0);
      
      activeSources[key] = source;
      source.onended = () => {
        if (activeSources[key] === source) {
          delete activeSources[key];
        }
      };
    } catch (e) {
      console.warn(`Error playing ${key}:`, e);
    }
  };

  if (audioCtx.state === 'running') {
    play();
  } else if (audioCtx.state === 'suspended') {
    // If we don't have user interaction, resume() won't resolve.
    // We expire the sound request after 100ms so they don't pile up.
    let expired = false;
    setTimeout(() => { expired = true; }, 100);
    
    audioCtx.resume().then(() => {
      if (!expired) {
        play();
      }
    }).catch(() => {});
  }
}

function playWarp(durationSec = 6.5) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  try {
    const t = audioCtx.currentTime;
    const dur = Math.max(4, Math.min(10, durationSec));

    // Noise buffer whoosh under the pitch ramp
    const noiseLen = Math.floor(audioCtx.sampleRate * dur);
    const noiseBuf = audioCtx.createBuffer(1, noiseLen, audioCtx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      const env = Math.sin((i / noiseLen) * Math.PI); // swell mid-trip
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuf;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(350, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(7000, t + dur);
    noiseFilter.Q.value = 0.65;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.05, t + 0.35);
    noiseGain.gain.linearRampToValueAtTime(0.09, t + dur * 0.7);
    noiseGain.gain.linearRampToValueAtTime(0, t + dur);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(t);
    noise.stop(t + dur);

    // Main warp oscillator (ascending pitch) — synced to trip length
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, t);
    osc.frequency.exponentialRampToValueAtTime(820, t + dur);

    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(3.5, t);
    lfo.frequency.linearRampToValueAtTime(18, t + dur);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(140, t);
    lfoGain.gain.linearRampToValueAtTime(720, t + dur);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.11, t + 0.4);
    gain.gain.setValueAtTime(0.11, t + dur - 0.45);
    gain.gain.linearRampToValueAtTime(0, t + dur);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 3.5;
    filter.frequency.setValueAtTime(120, t);
    filter.frequency.exponentialRampToValueAtTime(11000, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + dur);
    osc.stop(t + dur);
  } catch (e) {
    console.warn('Error playing warp sound:', e);
  }
}

/** Short thud / lock when the wormhole lands on the modern site */
function playWarpLand() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  try {
    const t = audioCtx.currentTime;

    const thud = audioCtx.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(120, t);
    thud.frequency.exponentialRampToValueAtTime(40, t + 0.22);

    const thudGain = audioCtx.createGain();
    thudGain.gain.setValueAtTime(0.22, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    thud.connect(thudGain);
    thudGain.connect(audioCtx.destination);
    thud.start(t);
    thud.stop(t + 0.3);

    // Soft click sparkle
    const click = audioCtx.createOscillator();
    click.type = 'triangle';
    click.frequency.setValueAtTime(880, t + 0.04);
    click.frequency.exponentialRampToValueAtTime(220, t + 0.18);
    const clickGain = audioCtx.createGain();
    clickGain.gain.setValueAtTime(0.06, t + 0.04);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    click.connect(clickGain);
    clickGain.connect(audioCtx.destination);
    click.start(t + 0.04);
    click.stop(t + 0.22);
  } catch (e) {
    console.warn('Error playing warp land:', e);
  }
}

export function useOSAudio() {
  const playClick = useCallback(() => {}, []); // Disabled per user request
  const playStartup = useCallback(() => playBuffer('startup', 0.8), []);
  const playTyping = useCallback(() => playBuffer('typing', 0.4), []); // No overlap for typing
  const playPasswordScreen = useCallback(() => playBuffer('password', 0.8), []);
  const playWarpCb = useCallback((durationSec?: number) => playWarp(durationSec), []);
  const playWarpLandCb = useCallback(() => playWarpLand(), []);

  return {
    playClick,
    playStartup,
    playTyping,
    playPasswordScreen,
    playWarp: playWarpCb,
    playWarpLand: playWarpLandCb,
  };
}

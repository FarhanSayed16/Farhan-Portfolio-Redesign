'use client';

import type { CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { usePhone } from '@/context/PhoneContext';
import { MobileControls } from './MobileControls';

const GameWrapper = dynamic(() => import('@/components/shared/GameWrapper'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: 'var(--nokia-green)',
        fontFamily: 'var(--font-pixel)',
        fontSize: '8px',
      }}
    >
      LOADING…
    </div>
  ),
});

const lcd: CSSProperties = {
  height: '100%',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--font-pixel)',
  fontSize: '8px',
  color: 'var(--nokia-green)',
  overflow: 'hidden',
};

/**
 * In-LCD Phaser session. Exit only via Nokia Back (no floating X).
 */
export default function PhoneGame() {
  const { navigate } = usePhone();

  const exit = () => navigate('game-launcher');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#000',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <GameWrapper platform="mobile" onClose={exit} onHire={() => navigate('contact')} />
      </div>
      <MobileControls />
    </div>
  );
}

/** Pre-game firmware screen — Start / How / Back. */
export function GameLauncherScreen() {
  const { state, navigate, dispatch } = usePhone();
  const items = [
    { id: 'start' as const, label: '1. Start game' },
    { id: 'how' as const, label: '2. How to play' },
  ];
  const showingHow = Boolean(state.payload?.gameHowTo);
  const idx = Math.min(state.selectedIndex, items.length - 1);

  if (showingHow) {
    return (
      <div style={lcd}>
        <div
          style={{
            textAlign: 'center',
            borderBottom: '1px solid rgba(67, 217, 124, 0.3)',
            paddingBottom: 4,
            marginBottom: 8,
          }}
        >
          HOW TO PLAY
        </div>
        <div style={{ flex: 1, fontSize: 6, lineHeight: 1.55, opacity: 0.85, overflow: 'auto' }}>
          <div>◄ ► move</div>
          <div>OK / ▲ jump</div>
          <div>RUN on pad = dash</div>
          <div style={{ marginTop: 8 }}>Soft Back = quit</div>
          <div style={{ marginTop: 8, opacity: 0.55 }}>
            Tiny screen — full run feels best on desktop Farhan OS.
          </div>
        </div>
        <div style={{ fontSize: 6, opacity: 0.4, textAlign: 'center' }}>Back = launcher</div>
      </div>
    );
  }

  return (
    <div style={lcd}>
      <div
        style={{
          textAlign: 'center',
          borderBottom: '1px solid rgba(67, 217, 124, 0.3)',
          paddingBottom: 4,
          marginBottom: 8,
        }}
      >
        PLAY GAME
      </div>
      <div style={{ fontSize: 7, opacity: 0.7, marginBottom: 10, textAlign: 'center', lineHeight: 1.4 }}>
        Farhan&apos;s World
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === 'start') navigate('game-play');
              else dispatch({ type: 'SET_PAYLOAD', payload: { gameHowTo: true } });
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '5px 6px',
              background: i === idx ? 'var(--nokia-green)' : 'transparent',
              color: i === idx ? 'var(--nokia-screen)' : 'var(--nokia-green)',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'var(--font-pixel)',
              fontSize: 8,
              borderRadius: 2,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 6, opacity: 0.4, textAlign: 'center' }}>OK / Start = play</div>
    </div>
  );
}

export function selectGameLauncherAction(
  selectedIndex: number,
  payload?: Record<string, unknown>
): 'start' | 'how' | 'close-how' {
  if (payload?.gameHowTo) return 'close-how';
  return selectedIndex <= 0 ? 'start' : 'how';
}

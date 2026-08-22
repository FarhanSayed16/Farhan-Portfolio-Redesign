'use client';

import { useEffect, useRef, useState } from 'react';
import { gameBridge } from '@/lib/GameBridge';

interface OverlayState {
  visible: boolean;
  type: 'coin' | 'skill' | 'project' | 'win' | 'achievement' | null;
  text: string;
  leaving: boolean;
}

interface GameOverlayProps {
  onHire?: () => void;
}

const TOAST_MS = 2800;
const FADE_MS = 220;

const toastMeta: Record<
  string,
  { label: string; accent: string; glyph: string }
> = {
  coin: { label: 'DID YOU KNOW', accent: '#f8d878', glyph: '●' },
  skill: { label: 'SKILL UNLOCKED', accent: '#78f878', glyph: '★' },
  project: { label: 'PROJECT FOUND', accent: '#78c8f8', glyph: '◆' },
  achievement: { label: 'HINT', accent: '#ffffff', glyph: '!' },
};

function isToast(type: OverlayState['type']) {
  return type === 'coin' || type === 'skill' || type === 'project' || type === 'achievement';
}

export function GameOverlay({ onHire }: GameOverlayProps) {
  const [overlay, setOverlay] = useState<OverlayState>({
    visible: false,
    type: null,
    text: '',
    leaving: false,
  });
  const overlayRef = useRef(overlay);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);

  useEffect(() => {
    const clearTimers = () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
        toastTimer.current = null;
      }
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current);
        fadeTimer.current = null;
      }
    };

    const dismissToast = () => {
      setOverlay((s) => ({ ...s, leaving: true }));
      fadeTimer.current = setTimeout(() => {
        setOverlay({ visible: false, type: null, text: '', leaving: false });
        fadeTimer.current = null;
      }, FADE_MS);
    };

    const handleShow = (data: unknown) => {
      const d = data as { type: OverlayState['type']; text: string };
      clearTimers();
      setOverlay({ visible: true, type: d.type, text: d.text, leaving: false });
      if (isToast(d.type)) {
        toastTimer.current = setTimeout(dismissToast, TOAST_MS);
      }
    };

    const handleHide = () => {
      clearTimers();
      setOverlay({ visible: false, type: null, text: '', leaving: false });
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !overlayRef.current.visible) return;
      if (isToast(overlayRef.current.type)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setOverlay({ visible: false, type: null, text: '', leaving: false });
    };

    gameBridge.on('show-overlay', handleShow);
    gameBridge.on('hide-overlay', handleHide);
    window.addEventListener('keydown', handleEsc, true);
    return () => {
      clearTimers();
      gameBridge.off('show-overlay', handleShow);
      gameBridge.off('hide-overlay', handleHide);
      window.removeEventListener('keydown', handleEsc, true);
    };
  }, []);

  if (!overlay.visible || !overlay.type) return null;

  // Win stays a blocking XP-style modal — it's the end of the portfolio pitch.
  if (overlay.type === 'win') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-auto p-2">
        <div
          style={{
            width: '100%',
            maxWidth: 320,
            background: '#ece9d8',
            border: '2px solid #0831d9',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.35)',
            fontFamily: 'var(--font-os)',
            color: '#000',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #0a246a 0%, #a6caf0 100%)',
              color: '#fff',
              padding: '4px 8px',
              fontSize: 12,
              fontWeight: 700,
              textShadow: '1px 1px 0 rgba(0,0,0,0.4)',
            }}
          >
            Plot twist!
          </div>
          <div style={{ padding: 16, fontSize: 12, lineHeight: 1.5, textAlign: 'center' }}>
            <p style={{ margin: '0 0 14px', whiteSpace: 'pre-line' }}>{overlay.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <button
                type="button"
                className="os-button"
                onClick={() => {
                  setOverlay({ visible: false, type: null, text: '', leaving: false });
                  onHire?.();
                }}
                style={{ minWidth: 140 }}
              >
                Hire Farhan
              </button>
              <button
                type="button"
                className="os-button"
                onClick={() => {
                  setOverlay({ visible: false, type: null, text: '', leaving: false });
                  gameBridge.emit('play-again');
                }}
                style={{ minWidth: 140 }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const meta = toastMeta[overlay.type] ?? toastMeta.achievement;

  return (
    <div
      className="absolute left-0 right-0 z-50 flex justify-center pointer-events-none px-3"
      style={{ top: 48 }}
      aria-live="polite"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          maxWidth: 340,
          width: '100%',
          background: 'rgba(8, 12, 40, 0.92)',
          border: `3px solid ${meta.accent}`,
          boxShadow: `0 0 0 2px #000, 4px 4px 0 rgba(0,0,0,0.45)`,
          fontFamily: '"Press Start 2P", monospace',
          color: '#fff',
          animation: overlay.leaving
            ? `farhan-toast-out ${FADE_MS}ms ease-in forwards`
            : 'farhan-toast-in 200ms ease-out',
        }}
      >
        <div
          style={{
            width: 36,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: meta.accent,
            color: '#081028',
            fontSize: 16,
            fontWeight: 700,
          }}
          aria-hidden
        >
          {meta.glyph}
        </div>
        <div style={{ padding: '10px 12px', minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 8,
              letterSpacing: '0.08em',
              color: meta.accent,
              marginBottom: 6,
              textShadow: '1px 1px 0 #000',
            }}
          >
            {meta.label}
          </div>
          <div
            style={{
              fontSize: 10,
              lineHeight: 1.55,
              color: '#fff',
              textShadow: '1px 1px 0 #000',
              wordBreak: 'break-word',
            }}
          >
            {overlay.text}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes farhan-toast-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes farhan-toast-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-8px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}

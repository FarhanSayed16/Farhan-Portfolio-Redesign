'use client';

import { useEffect, useRef, useState } from 'react';
import { gameBridge } from '@/lib/GameBridge';

interface OverlayState {
  visible: boolean;
  type: 'coin' | 'skill' | 'project' | 'win' | 'achievement' | null;
  text: string;
}

interface GameOverlayProps {
  onHire?: () => void;
}

export function GameOverlay({ onHire }: GameOverlayProps) {
  const [overlay, setOverlay] = useState<OverlayState>({
    visible: false,
    type: null,
    text: '',
  });
  const overlayRef = useRef(overlay);

  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);

  useEffect(() => {
    const handleShow = (data: unknown) => {
      const d = data as { type: OverlayState['type']; text: string };
      setOverlay({ visible: true, type: d.type, text: d.text });
    };
    const handleHide = () => setOverlay({ visible: false, type: null, text: '' });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !overlayRef.current.visible) return;
      e.preventDefault();
      e.stopImmediatePropagation(); // don't also close the XP window / remount game
      const type = overlayRef.current.type;
      setOverlay({ visible: false, type: null, text: '' });
      if (type !== 'win') gameBridge.emit('resume-game');
    };

    gameBridge.on('show-overlay', handleShow);
    gameBridge.on('hide-overlay', handleHide);
    window.addEventListener('keydown', handleEsc, true);
    return () => {
      gameBridge.off('show-overlay', handleShow);
      gameBridge.off('hide-overlay', handleHide);
      window.removeEventListener('keydown', handleEsc, true);
    };
  }, []);

  if (!overlay.visible) return null;

  const titles: Record<string, string> = {
    coin: 'Did you know?',
    skill: 'Skill Unlocked!',
    project: 'Project Discovered!',
    win: 'Victory!',
    achievement: 'Achievement!',
  };

  const dismiss = (hire = false) => {
    setOverlay({ visible: false, type: null, text: '' });
    if (hire && onHire) {
      onHire();
      return;
    }
    gameBridge.emit('resume-game');
  };

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
          {overlay.type ? titles[overlay.type] : 'Farhan OS'}
        </div>
        <div style={{ padding: 16, fontSize: 12, lineHeight: 1.5, textAlign: 'center' }}>
          <p style={{ margin: '0 0 14px' }}>{overlay.text}</p>
          {overlay.type === 'win' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <button type="button" className="os-button" onClick={() => dismiss(true)} style={{ minWidth: 140 }}>
                Hire Farhan
              </button>
              <button
                type="button"
                className="os-button"
                onClick={() => {
                  setOverlay({ visible: false, type: null, text: '' });
                  gameBridge.emit('play-again');
                }}
                style={{ minWidth: 140 }}
              >
                Play Again
              </button>
            </div>
          ) : (
            <button type="button" className="os-button" onClick={() => dismiss(false)} style={{ minWidth: 100 }}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

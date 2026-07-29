'use client';

import React from 'react';
import { gameBridge } from '@/lib/GameBridge';

function bindKey(key: string) {
  const send = (state: 'down' | 'up') => (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    gameBridge.emit('mobile-input', { key, state });
  };
  return {
    onTouchStart: send('down'),
    onTouchEnd: send('up'),
    onTouchCancel: send('up'),
    onMouseDown: send('down'),
    onMouseUp: send('up'),
    onMouseLeave: send('up'),
    onContextMenu: (e: React.SyntheticEvent) => e.preventDefault(),
  };
}

/** LCD-adjacent game pad — matches Nokia green firmware, no Lucide/modern chrome. */
export function MobileControls() {
  return (
    <div className="nokia-game-pad" aria-label="Game controls">
      <div className="nokia-game-pad__group">
        <button type="button" className="nokia-game-btn" aria-label="Move left" {...bindKey('left')}>
          ◄
        </button>
        <button type="button" className="nokia-game-btn" aria-label="Move right" {...bindKey('right')}>
          ►
        </button>
      </div>
      <div className="nokia-game-pad__group">
        <button type="button" className="nokia-game-btn nokia-game-btn--run" aria-label="Run" {...bindKey('shift')}>
          RUN
        </button>
        <button type="button" className="nokia-game-btn nokia-game-btn--jump" aria-label="Jump" {...bindKey('up')}>
          JMP
        </button>
      </div>
    </div>
  );
}

/** Emit holdable input from the physical Nokia D-pad while playing. */
export function emitGamePad(key: string, state: 'down' | 'up') {
  gameBridge.emit('mobile-input', { key, state });
}

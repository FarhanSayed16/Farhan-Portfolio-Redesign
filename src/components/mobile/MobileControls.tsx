import React from 'react';
import { gameBridge } from '@/lib/GameBridge';
import { ArrowLeft, ArrowRight, ArrowUp, Circle } from 'lucide-react';

/** Compact on-screen pad for the Nokia viewport (~220px tall). */
export function MobileControls() {
  const handleTouch = (key: string, state: 'down' | 'up') => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    gameBridge.emit('mobile-input', { key, state });
  };

  const bind = (key: string) => ({
    onTouchStart: handleTouch(key, 'down'),
    onTouchEnd: handleTouch(key, 'up'),
    onTouchCancel: handleTouch(key, 'up'),
    onMouseDown: handleTouch(key, 'down'),
    onMouseUp: handleTouch(key, 'up'),
    onMouseLeave: handleTouch(key, 'up'),
  });

  const btn =
    'w-9 h-9 bg-black/50 active:bg-white/30 border border-white/40 rounded flex items-center justify-center touch-none';

  return (
    <div className="absolute inset-x-0 bottom-0 h-12 flex items-center justify-between px-1.5 pb-1 pointer-events-none z-40 select-none">
      <div className="flex gap-1 pointer-events-auto">
        <button type="button" className={btn} aria-label="Move left" {...bind('left')}>
          <ArrowLeft className="text-white opacity-90 w-4 h-4" />
        </button>
        <button type="button" className={btn} aria-label="Move right" {...bind('right')}>
          <ArrowRight className="text-white opacity-90 w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-1 pointer-events-auto">
        <button type="button" className={`${btn} rounded-full`} aria-label="Run" {...bind('shift')}>
          <Circle className="text-white opacity-90 w-3.5 h-3.5" />
        </button>
        <button type="button" className={`${btn} rounded-full`} aria-label="Jump" {...bind('up')}>
          <ArrowUp className="text-white opacity-90 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

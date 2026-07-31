'use client';

import { useEffect, useRef, useState } from 'react';
import type Phaser from 'phaser';
import { Loader2 } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { gameBridge } from '@/lib/GameBridge';
import { silenceGameAudio } from '@/lib/SFXSynth';

interface GameWrapperProps {
  platform?: 'desktop' | 'mobile';
  onClose?: () => void;
  onHire?: () => void;
}

export default function GameWrapper({ platform = 'desktop', onClose, onHire }: GameWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const onCloseRef = useRef(onClose);
  const onHireRef = useRef(onHire);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  onCloseRef.current = onClose;
  onHireRef.current = onHire;

  // Mount Phaser once. Do NOT depend on onClose/onHire — parent re-renders
  // (window FOCUS on every click) used to destroy & recreate the game = “reset”.
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    import('@/phaser/main')
      .then(({ createGame }) => {
        if (!mounted || !containerRef.current) return;
        try {
          gameRef.current = createGame(containerRef.current);
          setIsLoading(false);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to initialize game engine.';
          setError(message);
        }
      })
      .catch((err) => {
        console.error('Error loading game:', err);
        setError('Error loading game engine.');
      });

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseRef.current) onCloseRef.current();
    };
    const onPlayAgain = () => {
      const game = gameRef.current;
      if (!game) return;
      for (const scene of game.scene.getScenes(true)) {
        game.scene.stop(scene.scene.key);
      }
      game.scene.start('MainMenuScene');
      gameBridge.emit('hide-overlay');
    };

    window.addEventListener('keydown', onEsc);
    gameBridge.on('play-again', onPlayAgain);

    return () => {
      mounted = false;
      window.removeEventListener('keydown', onEsc);
      gameBridge.off('play-again', onPlayAgain);
      // BGM lives outside Phaser — destroy alone leaves music playing.
      silenceGameAudio();
      if (gameRef.current) {
        gameRef.current.destroy(true, false);
        gameRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <p>Error initializing game.</p>
        <p style={{ fontSize: '12px' }}>{error}</p>
        {onClose && (
          <button type="button" onClick={onClose} style={{ marginTop: '10px', padding: '4px 8px' }}>
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative bg-black flex items-center justify-center"
      data-platform={platform}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-black">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="font-pixel text-xs animate-pulse">BOOTING FARHAN&apos;S WORLD...</p>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />
      <GameOverlay onHire={() => onHireRef.current?.()} />
    </div>
  );
}

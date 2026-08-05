'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindows } from '@/context/WindowContext';
import { BrowserTimeMachine } from './browser/BrowserTimeMachine';
import { ModernSite } from './browser/ModernSite';
import './browser/browserTheme.css';

type Phase = 'eras' | 'morph' | 'modern';

/**
 * In-memory only — resets on every full page refresh.
 * (sessionStorage survived refresh, which forced “clear site data” to see the trip again.)
 * Still skips if you close/reopen Internet in the same visit; footer “Replay” always works.
 */
let erasPlayedThisVisit = false;

// Drop the old sticky key if present from earlier builds
if (typeof window !== 'undefined') {
  try {
    sessionStorage.removeItem('farhan-browser-eras-seen');
  } catch {
    /* ignore */
  }
}

/**
 * Browser.exe — IE chrome stays; page viewport runs Time Machine → modern portfolio.
 */
export default function BrowserWindow() {
  const { dispatch } = useWindows();
  const [phase, setPhase] = useState<Phase>(() => (erasPlayedThisVisit ? 'modern' : 'eras'));
  const [addressValue, setAddressValue] = useState('https://farhanbuilds.in');
  const [history, setHistory] = useState<string[]>(['https://farhanbuilds.in']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyIndexRef = useRef(0);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  const finishEras = useCallback(() => {
    erasPlayedThisVisit = true;
    setPhase('morph');
    setAddressValue('https://farhanbuilds.in');
    window.setTimeout(() => setPhase('modern'), 400);
  }, []);

  const replayEras = useCallback(() => {
    setPhase('eras');
    setAddressValue('http://farhan.tripod.com/~home');
  }, []);

  const softReload = useCallback(() => {
    if (phase === 'eras') return;
    setPhase('morph');
    window.setTimeout(() => setPhase('modern'), 280);
  }, [phase]);

  const goBack = useCallback(() => {
    if (historyIndex <= 0) return;
    const next = historyIndex - 1;
    setHistoryIndex(next);
    setAddressValue(history[next]);
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = historyIndex + 1;
    setHistoryIndex(next);
    setAddressValue(history[next]);
  }, [history, historyIndex]);

  // Stable callback — must not retrigger era timers when history updates
  const handleAddressHint = useCallback((url: string) => {
    setAddressValue(url);
    setHistory((h) => {
      const idx = historyIndexRef.current;
      const next = [...h.slice(0, idx + 1), url];
      historyIndexRef.current = next.length - 1;
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, []);

  const handleAddressSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      const val = addressValue.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');

      if (val.includes('github.com')) {
        window.open('https://github.com/FarhanSayed16', '_blank');
        setAddressValue('https://farhanbuilds.in');
        return;
      }

      if (phase !== 'modern') {
        finishEras();
        return;
      }

      setAddressValue('https://farhanbuilds.in');
      softReload();
    },
    [addressValue, phase, finishEras, softReload]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderBottom: '1px solid var(--os-border)',
          background: 'var(--os-window)',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={goBack}
          className="os-button"
          style={{ padding: '4px 6px' }}
          disabled={historyIndex === 0 || phase === 'eras'}
        >
          <ArrowLeft size={13} />
        </button>
        <button
          type="button"
          onClick={goForward}
          className="os-button"
          style={{ padding: '4px 6px' }}
          disabled={historyIndex >= history.length - 1 || phase === 'eras'}
        >
          <ArrowRight size={13} />
        </button>
        <button type="button" onClick={softReload} className="os-button" style={{ padding: '4px 6px' }}>
          <RotateCw size={13} />
        </button>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2px 6px',
            background: '#fff',
            borderTop: '1px solid #808080',
            borderLeft: '1px solid #808080',
            borderRight: '1px solid #fff',
            borderBottom: '1px solid #fff',
            boxShadow: 'inset 1px 1px 0 #000',
          }}
        >
          <Globe size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            onKeyDown={handleAddressSubmit}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#000',
              fontSize: '12px',
              fontFamily: 'var(--font-os)',
            }}
          />
        </div>
      </div>

      <div data-browser-viewport style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <AnimatePresence mode="wait">
          {phase === 'eras' && (
            <motion.div
              key="eras"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ height: '100%' }}
            >
              <BrowserTimeMachine onComplete={finishEras} onAddressHint={handleAddressHint} />
            </motion.div>
          )}
          {phase === 'morph' && (
            <motion.div
              key="morph"
              className="bv-slam-flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.85, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38, times: [0, 0.15, 0.5, 1] }}
              style={{ height: '100%', position: 'relative' }}
            />
          )}
          {phase === 'modern' && (
            <motion.div
              key="modern"
              initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px) brightness(1.5)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%' }}
            >
              <ModernSite
                onReplayEras={replayEras}
                onOpenProjects={(projectId) =>
                  dispatch({
                    type: 'OPEN',
                    id: 'projects',
                    title: 'Projects — Explorer',
                    component: 'projects',
                    payload: projectId ? { projectId } : undefined,
                  })
                }
                onOpenContact={() =>
                  dispatch({
                    type: 'OPEN',
                    id: 'contact',
                    title: 'Contact — New Message',
                    component: 'contact',
                  })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

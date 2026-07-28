'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindows } from '@/context/WindowContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { notifyMuteChanged } from '@/lib/SFXSynth';
import { useOSAudio } from '@/lib/useOSAudio';
import { XpStartLogo, XP_ICONS } from './XpIcons';
import StartMenu from './StartMenu';

export default function Taskbar({
  startOpen,
  onStartToggle,
}: {
  startOpen: boolean;
  onStartToggle: () => void;
}) {
  const { windows, dispatch } = useWindows();
  const [time, setTime] = useState('');
  const [isMuted, setIsMuted] = useLocalStorage('farhan-muted', false);
  const { playClick } = useOSAudio();

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindows = windows.filter((w) => w.isOpen);

  const handleTaskbarButton = useCallback(
    (id: string) => {
      playClick();
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (win.isMinimized) {
        dispatch({ type: 'RESTORE', id });
      } else {
        const topZ = Math.max(
          ...windows.filter((w) => w.isOpen && !w.isMinimized).map((w) => w.zIndex),
          0
        );
        if (win.zIndex === topZ) {
          dispatch({ type: 'MINIMIZE', id });
        } else {
          dispatch({ type: 'FOCUS', id });
        }
      }
    },
    [windows, dispatch]
  );

  return (
    <>
      <AnimatePresence>
        {startOpen && (
          <StartMenu
            onClose={onStartToggle}
            onOpenWindow={(id, title, component, payload) => {
              dispatch({ type: 'OPEN', id, title, component, payload });
              onStartToggle();
            }}
          />
        )}
      </AnimatePresence>

      <div
        data-taskbar
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 30,
          background: 'linear-gradient(180deg, #1e52b5 0%, #245edc 12%, #4993e6 55%, #245edc 100%)',
          borderTop: '1px solid #0831d9',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2px',
          zIndex: 9000,
          gap: 2,
          fontFamily: 'var(--font-os)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
        }}
      >
        {/* Green Start */}
        <button
          type="button"
          onClick={() => {
            playClick();
            onStartToggle();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            height: 24,
            padding: '0 10px 0 6px',
            background: startOpen
              ? 'linear-gradient(180deg, #2d6b2d 0%, #3c8a3c 50%, #2d6b2d 100%)'
              : 'linear-gradient(180deg, #5eba5e 0%, #3c8a3c 45%, #2d6b2d 100%)',
            border: 'none',
            borderRadius: '0 12px 12px 0',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontStyle: 'italic',
            flexShrink: 0,
            textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
            boxShadow: startOpen
              ? 'inset 1px 1px 2px rgba(0,0,0,0.4)'
              : '1px 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
          }}
        >
          <XpStartLogo size={16} />
          start
        </button>

        <div style={{ flex: 1, display: 'flex', gap: 2, overflow: 'hidden', padding: '0 4px' }}>
          {openWindows.map((win) => {
            const topZ = Math.max(
              ...windows.filter((w) => w.isOpen && !w.isMinimized).map((w) => w.zIndex),
              0
            );
            const isActive = win.zIndex === topZ && !win.isMinimized;
            const Icon = XP_ICONS[win.component] ?? XP_ICONS.readme;

            return (
              <button
                key={win.id}
                type="button"
                onClick={() => handleTaskbarButton(win.id)}
                style={{
                  height: 22,
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: isActive
                    ? 'linear-gradient(180deg, #1a4fb5 0%, #3980f4 100%)'
                    : 'linear-gradient(180deg, #3c81f3 0%, #1a4fb5 100%)',
                  border: isActive ? '1px solid #0831d9' : '1px solid #5a9cf5',
                  borderRadius: 2,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 11,
                  maxWidth: 150,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  opacity: win.isMinimized ? 0.7 : 1,
                  boxShadow: isActive
                    ? 'inset 1px 1px 2px rgba(0,0,0,0.35)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                <Icon size={14} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {win.title.split(' — ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tray */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 10px',
            height: 22,
            background: 'linear-gradient(180deg, #0f8fe8 0%, #0c6ec0 100%)',
            border: '1px solid #085a9c',
            borderRadius: 2,
            flexShrink: 0,
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.25)',
            marginRight: 2,
          }}
        >
          {/* Security Shield */}
          <span 
            style={{ color: '#fff', fontSize: 12, cursor: 'help' }} 
            title="Windows Security Center: No viruses found. You are safe!"
          >
            🛡️
          </span>

          {/* Battery */}
          <span 
            style={{ color: '#fff', fontSize: 12, cursor: 'help' }} 
            title="Battery: 99% (Plugged in, but trying its best)"
          >
            🔋
          </span>

          {/* Network */}
          <span 
            style={{ color: '#fff', fontSize: 12, cursor: 'help' }} 
            title="Wireless Network Connection: Excellent signal strength. Connected to the matrix."
          >
            📶
          </span>

          {/* Sound */}
          <button
            type="button"
            onClick={() => {
              setIsMuted((prev) => {
                queueMicrotask(() => notifyMuteChanged());
                return !prev;
              });
            }}
            title={isMuted ? 'Volume: Muted' : 'Volume: 100% (Rock on!)'}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 0,
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Clock */}
          <div 
            style={{ 
              fontSize: 11, 
              color: '#fff', 
              minWidth: 58, 
              textAlign: 'right',
              cursor: 'default',
              paddingLeft: 4
            }}
            title={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          >
            {time}
          </div>
        </div>
      </div>
    </>
  );
}

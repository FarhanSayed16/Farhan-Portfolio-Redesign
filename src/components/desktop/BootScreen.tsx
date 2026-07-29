'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSAudio } from '@/lib/useOSAudio';
import { XpStartLogo } from './XpIcons';
import { siteData } from '@/lib/content';
import './bootScreen.css';

type BootPhase = 'power' | 'bios' | 'progress' | 'login' | 'done';

const BIOS_LINES = [
  'FarhanBIOS 3.0 — Copyright (C) 2026 Farhan Sayed',
  'CPU: AI & Full-Stack Engineer @ 3.0GHz',
  'Memory Test: 128MB OK',
  '',
  'Detecting IDE drives...',
  '  Primary Master: FARHAN-SSD ......... [OK]',
  '  Primary Slave:  None',
  '',
  'Loading modules...',
  '  Projects (11) ...................... [OK]',
  '  SIH 2025 National Trophy ........... [OK]',
  '  Contact stack ...................... [OK]',
  '',
  'Press any key to skip boot...',
  'Starting Farhan OS...',
];

interface BootScreenProps {
  onComplete: () => void;
}

function PowerGlyph() {
  return (
    <svg className="boot-power-btn-icon" viewBox="0 0 24 24" aria-hidden>
      {/* Classic physical power mark: stem + arc (not a flat Unicode emoji) */}
      <path
        d="M12 3v9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M7.2 6.4a7.2 7.2 0 1 0 9.6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<BootPhase>('power');
  const [biosIndex, setBiosIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { playStartup, playTyping, playPasswordScreen } = useOSAudio();
  const [shutdownClicks, setShutdownClicks] = useState(0);

  const shutdownMessages = [
    'Turn off computer',
    "Wait, you're leaving already?",
    'Did you even check out my projects?',
    'A true developer never quits.',
    'Okay, fine... restarting system....',
  ];

  const bumpShutdown = useCallback(() => {
    if (shutdownClicks < shutdownMessages.length - 2) {
      setShutdownClicks((c) => c + 1);
    } else if (shutdownClicks === shutdownMessages.length - 2) {
      setShutdownClicks((c) => c + 1);
      setTimeout(() => {
        setShutdownClicks(0);
        setPhase('power');
        setBiosIndex(0);
        setProgress(0);
      }, 2000);
    }
  }, [shutdownClicks, shutdownMessages.length]);

  const handleShutdownClick = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      bumpShutdown();
    },
    [bumpShutdown]
  );

  useEffect(() => {
    if (phase !== 'bios') return;
    if (biosIndex < BIOS_LINES.length) {
      if (biosIndex > 0) playTyping();
      const timeout = setTimeout(() => setBiosIndex((i) => i + 1), biosIndex === 0 ? 200 : 80);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setPhase('progress'), 400);
    return () => clearTimeout(timeout);
  }, [phase, biosIndex, playTyping]);

  useEffect(() => {
    if (phase !== 'progress') return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('login'), 300);
          return 100;
        }
        return Math.min(p + (p < 40 ? 5 : 3), 100);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === 'login') {
      playPasswordScreen();
    }
  }, [phase, playPasswordScreen]);

  const handleSkip = useCallback(() => {
    if (phase !== 'power') {
      playStartup();
      onComplete();
    }
  }, [onComplete, playStartup, phase]);

  const handleLogin = useCallback(() => {
    playStartup();
    onComplete();
  }, [onComplete, playStartup]);

  const powerOn = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setPhase('bios');
  };

  if (phase === 'done') return null;

  const shellClass =
    phase === 'login'
      ? 'boot-screen boot-screen--login'
      : phase === 'progress'
        ? 'boot-screen boot-screen--dark'
        : phase === 'bios' || phase === 'power'
          ? 'boot-screen boot-screen--dark'
          : 'boot-screen boot-screen--xp';

  return (
    <div
      className={shellClass}
      onClick={phase === 'login' || phase === 'power' ? undefined : handleSkip}
      role="presentation"
    >
      <AnimatePresence mode="wait">
        {phase === 'power' && (
          <motion.div
            key="power"
            className="boot-power"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="boot-power-plate">
              <div className="boot-power-brand">Turn on PC</div>

              <div className="boot-power-leds" aria-hidden>
                <div className="boot-led">
                  <span className="boot-led-dot boot-led-dot--standby" />
                  <span className="boot-led-label">Power</span>
                </div>
                <div className="boot-led">
                  <span className="boot-led-dot boot-led-dot--hdd" />
                  <span className="boot-led-label">HDD</span>
                </div>
              </div>

              <button
                type="button"
                className="boot-power-btn"
                aria-label="Power On"
                onClick={powerOn}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    powerOn(e);
                  }
                }}
              >
                <PowerGlyph />
              </button>
            </div>

            <div className="boot-power-caption">
              <p className="boot-power-title">POWER ON</p>
              <p className="boot-power-hint">Press the power button to start Farhan OS</p>
            </div>
          </motion.div>
        )}

        {phase === 'bios' && (
          <motion.div
            key="bios"
            className="boot-bios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {BIOS_LINES.slice(0, biosIndex).map((line, i) => (
              <div
                key={i}
                className={`boot-bios-line${i === 0 ? ' boot-bios-line--head' : ''}`}
              >
                {line || '\u00a0'}
              </div>
            ))}
          </motion.div>
        )}

        {phase === 'progress' && (
          <motion.div
            key="progress"
            className="boot-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="boot-progress-logo-row">
              <span className="boot-progress-ms">Microsoft</span>
              <span className="boot-progress-win">OS</span>
              <sup className="boot-progress-xp">XP</sup>
            </div>
            <div className="boot-progress-spacer" />
            <div className="boot-progress-loader" aria-hidden>
              <div className="boot-progress-blocks">
                {/* Duplicate strips so the scroll loop never gaps */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="boot-progress-block" />
                ))}
              </div>
            </div>
            {/* Keep progress state ticking so phase advances; bar is the XP marquee */}
            <span className="boot-sr-only" aria-live="polite">
              Loading {progress}%
            </span>
          </motion.div>
        )}

        {phase === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#5a7edc',
              position: 'relative',
              fontFamily: 'Tahoma, "Segoe UI", sans-serif',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100px',
                background: 'linear-gradient(180deg, #1c3280 0%, #2954ab 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100px',
                background: 'linear-gradient(180deg, #4b71d6 0%, #1c3280 100%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '2px',
                background:
                  'linear-gradient(90deg, transparent 0%, #85a2f2 20%, #85a2f2 80%, transparent 100%)',
                transform: 'translateY(-50%)',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '20px',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(133, 162, 242, 0.15) 20%, rgba(133, 162, 242, 0.15) 80%, transparent 100%)',
                transform: 'translateY(-50%)',
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '800px',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  paddingRight: '40px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '36px',
                      fontWeight: 700,
                      color: '#fff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontStyle: 'italic',
                    }}
                  >
                    Farhan
                  </span>
                  <span
                    style={{
                      fontSize: '36px',
                      fontWeight: 400,
                      color: '#ffb900',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    OS
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#e0e5f5', marginTop: '4px' }}>
                  To begin, click your user name
                </div>
              </div>

              <div
                style={{
                  width: '1px',
                  height: '180px',
                  background: 'linear-gradient(180deg, transparent 0%, #fff 50%, transparent 100%)',
                  opacity: 0.4,
                }}
              />

              <div
                style={{
                  flex: 1,
                  paddingLeft: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    background: '#fff',
                    borderTop: '2px solid #ffb900',
                    borderLeft: '2px solid #ffb900',
                    borderRight: '2px solid #a67800',
                    borderBottom: '2px solid #a67800',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      border: '1px solid #000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f0f0f0',
                    }}
                  >
                    <XpStartLogo size={40} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                      marginBottom: '4px',
                    }}
                  >
                    {siteData.name}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                    <input
                      type="password"
                      placeholder="Type your password"
                      disabled
                      style={{
                        padding: '4px 6px',
                        border: '1px solid #000',
                        borderTopColor: '#808080',
                        borderLeftColor: '#808080',
                        borderBottomColor: '#fff',
                        borderRightColor: '#fff',
                        background: '#fff',
                        fontSize: '12px',
                        width: '160px',
                        color: '#000',
                        fontFamily: 'Tahoma, sans-serif',
                        cursor: 'not-allowed',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleLogin}
                      style={{
                        background: 'linear-gradient(180deg, #387bd5 0%, #20509a 100%)',
                        border: '1px solid #14356a',
                        borderRadius: '3px',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow:
                          'inset 1px 1px 1px rgba(255,255,255,0.4), 1px 1px 2px rgba(0,0,0,0.3)',
                      }}
                      title="Log On"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="square"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#c0c8e0',
                      marginTop: '8px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    AI & FULL-STACK ENGINEER
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={handleShutdownClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleShutdownClick(e);
                }
              }}
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '32px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(180deg, #f04e3a 0%, #c41e0a 100%)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #7a0c00',
                  boxShadow:
                    'inset 1px 1px 1px rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.4)',
                  transform: shutdownClicks > 0 ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.1s',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0" />
                </svg>
              </div>
              <span
                style={{
                  color: '#fff',
                  fontSize: '14px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                  transition: 'all 0.3s',
                }}
              >
                {shutdownMessages[shutdownClicks]}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

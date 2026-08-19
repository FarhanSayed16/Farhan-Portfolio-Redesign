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
            className="boot-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="boot-login-bar boot-login-bar--top" />
            <div className="boot-login-bar boot-login-bar--bot" />
            <div className="boot-login-glow" aria-hidden />

            <div className="boot-login-row">
              <div className="boot-login-brand">
                <div className="boot-login-wordmark">
                  <span className="boot-login-farhan">Farhan</span>
                  <span className="boot-login-os">OS</span>
                </div>
                <div className="boot-login-prompt">To begin, tap your user name</div>
              </div>

              <div className="boot-login-rule" aria-hidden />

              <div className="boot-login-user">
                <button type="button" className="boot-login-tile" onClick={handleLogin}>
                  <span className="boot-login-avatar">
                    <XpStartLogo size={40} />
                  </span>
                  <span className="boot-login-name">{siteData.name}</span>
                </button>

                <div className="boot-login-passrow">
                  <input
                    type="password"
                    placeholder="Type your password"
                    disabled
                    className="boot-login-pass"
                  />
                  <button
                    type="button"
                    className="boot-login-go"
                    onClick={handleLogin}
                    title="Log On"
                    aria-label="Log On"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="square"
                      aria-hidden
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span className="boot-login-go-label">Log On</span>
                  </button>
                </div>
                <div className="boot-login-role">AI & FULL-STACK ENGINEER</div>
              </div>
            </div>

            <div
              className="boot-login-shutdown"
              onClick={handleShutdownClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleShutdownClick(e);
                }
              }}
            >
              <div
                className="boot-login-off"
                style={{
                  transform: shutdownClicks > 0 ? 'scale(0.95)' : 'scale(1)',
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
                  aria-hidden
                >
                  <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0" />
                </svg>
              </div>
              <span>{shutdownMessages[shutdownClicks]}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

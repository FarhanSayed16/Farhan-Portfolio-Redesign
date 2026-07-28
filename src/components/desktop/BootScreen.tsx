'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOSAudio } from '@/lib/useOSAudio';
import { XpStartLogo } from './XpIcons';
import { siteData } from '@/lib/content';

type BootPhase = 'power' | 'bios' | 'progress' | 'login' | 'done';

const BIOS_LINES = [
  'Farhan OS (v3.0.0) [Boot Sequence Initiated]',
  'Copyright (C) 2026 Farhan Sayed. All rights reserved.',
  '',
  '[SYSTEM CHECK]',
  'CPU: Neuro-Synced Processor',
  'MEM: 128TB Quantum RAM ......... [OK]',
  'GPU: Reality Rendering Engine .... [OK]',
  '',
  '[MODULES LOADING]',
  '>> Loading AI Subsystems ......... [OK]',
  '>> Loading Robotics Protocols .... [OK]',
  '>> Initializing SIH Trophy ....... [ACQUIRED]',
  '>> Mounting Projects (11) ........ [MOUNTED]',
  '',
  'System integrity verified. Ready to launch.',
  'Starting Farhan OS...',
];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<BootPhase>('power');
  const [biosIndex, setBiosIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted] = useLocalStorage('farhan-muted', false);
  const { playStartup, playTyping, playPasswordScreen } = useOSAudio();
  const [shutdownClicks, setShutdownClicks] = useState(0);

  const shutdownMessages = [
    "Turn off computer",
    "Wait, you're leaving already?",
    "Did you even check out my projects?",
    "A true developer never quits.",
    "Okay, fine... restarting system...."
  ];

  const handleShutdownClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (shutdownClicks < shutdownMessages.length - 2) {
      setShutdownClicks(c => c + 1);
    } else if (shutdownClicks === shutdownMessages.length - 2) {
      setShutdownClicks(c => c + 1);
      setTimeout(() => {
        setShutdownClicks(0);
        setPhase('power');
        setBiosIndex(0);
        setProgress(0);
      }, 2000);
    }
  }, [shutdownClicks, shutdownMessages.length]);

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

  if (phase === 'done') return null;

  return (
    <div
      onClick={phase === 'login' ? undefined : handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: phase === 'bios' || phase === 'power' ? '#000' : '#245edc',
        display: 'flex',
        flexDirection: 'column',
        cursor: phase === 'login' ? 'default' : 'pointer',
        overflow: 'hidden',
        fontFamily: 'var(--font-os)',
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'power' && (
          <motion.div
            key="power"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                // We play a brief silent sound or just start to unlock the context
                setPhase('bios');
              }}
              style={{
                background: 'transparent',
                border: '2px solid #3c8a3c',
                color: '#3c8a3c',
                padding: '16px 32px',
                fontSize: '18px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3c8a3c';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#3c8a3c';
              }}
            >
              Power On
            </button>
          </motion.div>
        )}

        {phase === 'bios' && (
          <motion.div
            key="bios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1, padding: '2rem', color: '#c0c0c0', fontFamily: 'var(--font-mono)', fontSize: 13 }}
          >
            {BIOS_LINES.slice(0, biosIndex).map((line, i) => (
              <div key={i} style={{ lineHeight: 1.7, color: i === 0 ? '#fff' : '#c0c0c0' }}>
                {line}
              </div>
            ))}
          </motion.div>
        )}

        {phase === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              color: '#fff',
            }}
          >
            <XpStartLogo size={48} />
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>Farhan OS</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Please wait…</div>
            <div
              style={{
                width: 280,
                maxWidth: '70vw',
                height: 18,
                background: '#0a246a',
                border: '2px solid #fff',
                padding: 2,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #3c8a3c, #5eba5e, #3c8a3c)',
                  backgroundSize: '40px 100%',
                }}
              />
            </div>
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
              background: '#5a7edc', // Classic XP base blue
              position: 'relative',
              fontFamily: 'Tahoma, "Segoe UI", sans-serif',
            }}
          >
            {/* Top and Bottom Bands */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(180deg, #1c3280 0%, #2954ab 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(180deg, #4b71d6 0%, #1c3280 100%)' }} />
            
            {/* The main horizontal dividing line */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent 0%, #85a2f2 20%, #85a2f2 80%, transparent 100%)', transform: 'translateY(-50%)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '20px', background: 'linear-gradient(90deg, transparent 0%, rgba(133, 162, 242, 0.15) 20%, rgba(133, 162, 242, 0.15) 80%, transparent 100%)', transform: 'translateY(-50%)' }} />

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
              {/* Left Side: Logo and instructions */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 700, color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', fontStyle: 'italic' }}>Farhan</span>
                  <span style={{ fontSize: '36px', fontWeight: 400, color: '#ffb900', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>OS</span>
                </div>
                <div style={{ fontSize: '14px', color: '#e0e5f5', marginTop: '4px' }}>To begin, click your user name</div>
              </div>

              {/* Vertical Divider */}
              <div style={{ width: '1px', height: '180px', background: 'linear-gradient(180deg, transparent 0%, #fff 50%, transparent 100%)', opacity: 0.4 }} />

              {/* Right Side: User login */}
              <div style={{ flex: 1, paddingLeft: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                
                {/* Authentic XP Picture Frame */}
                <div style={{
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
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    border: '1px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f0f0f0'
                  }}>
                    <XpStartLogo size={40} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.6)', marginBottom: '4px' }}>{siteData.name}</div>
                  
                  {/* Password Input Area */}
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
                        cursor: 'not-allowed'
                      }}
                    />
                    <button 
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
                        boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.4), 1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                      title="Log On"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="square">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                  <div style={{ fontSize: '11px', color: '#c0c8e0', marginTop: '8px', letterSpacing: '0.5px' }}>AI & FULL-STACK ENGINEER</div>
                </div>
              </div>
            </div>

            {/* Bottom Left: Turn off computer */}
            <div 
              onClick={handleShutdownClick}
              style={{ position: 'absolute', bottom: '24px', left: '32px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(180deg, #f04e3a 0%, #c41e0a 100%)', 
                borderRadius: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '1px solid #7a0c00',
                boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.4)',
                transform: shutdownClicks > 0 ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.1s'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontSize: '14px', textShadow: '1px 1px 2px rgba(0,0,0,0.6)', transition: 'all 0.3s' }}>
                {shutdownMessages[shutdownClicks]}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

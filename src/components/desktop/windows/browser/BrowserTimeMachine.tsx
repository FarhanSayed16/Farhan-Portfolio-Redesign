'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOSAudio } from '@/lib/useOSAudio';

type EraId = '2005' | '2010' | '2015' | '2020' | 'now';

const ERAS: {
  id: EraId;
  targetYear: number | 'now';
  label: string;
  duration: number;
  /** Dense layout only for early eras — late ones are gag + flash */
  dense: boolean;
  url: string;
}[] = [
  {
    id: '2005',
    targetYear: 2005,
    label: 'Welcome to my homepage!!1',
    duration: 3200,
    dense: true,
    url: 'http://farhan.tripod.com/~home?t=2005',
  },
  {
    id: '2010',
    targetYear: 2010,
    label: 'Web 2.0 — now with rounded corners',
    duration: 1800,
    dense: true,
    url: 'http://farhan.webs.com/profile?era=2010',
  },
  {
    id: '2015',
    targetYear: 2015,
    label: 'Everything is a card now',
    duration: 850,
    dense: false,
    url: 'https://farhan.github.io/?v=2015&flat=1',
  },
  {
    id: '2020',
    targetYear: 2020,
    label: 'Dark mode + purple = professional',
    duration: 480,
    dense: false,
    url: 'https://farhan.vercel.app/?utm=wormhole&y=2020',
  },
  {
    id: 'now',
    targetYear: 'now',
    label: 'Arriving…',
    duration: 700,
    dense: false,
    url: 'https://farhanbuilds.in',
  },
];

interface BrowserTimeMachineProps {
  onComplete: () => void;
  onAddressHint?: (url: string) => void;
}

export function BrowserTimeMachine({ onComplete, onAddressHint }: BrowserTimeMachineProps) {
  const reduceMotion = useReducedMotion();
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [index, setIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [tickingYear, setTickingYear] = useState(2005);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [slamming, setSlamming] = useState(false);
  const yearRef = useRef(2005);
  const rafRef = useRef(0);
  const finishedRef = useRef(false);
  const { playWarp, playWarpLand } = useOSAudio();

  const era = ERAS[index];
  const intensity = index / (ERAS.length - 1); // 0 → 1

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setSlamming(true);
    playWarpLand();
    window.setTimeout(() => onComplete(), 280);
  }, [onComplete, playWarpLand]);

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }
    const skipTimer = window.setTimeout(() => setShowSkip(true), 900);
    playWarp();
    return () => window.clearTimeout(skipTimer);
  }, [reduceMotion, onComplete, playWarp]);

  // Micro-glitch on year digits — ramps with intensity
  useEffect(() => {
    if (reduceMotion) return;
    const rate = 80 + intensity * 40;
    const id = window.setInterval(() => {
      if (Math.random() < 0.25 + intensity * 0.55) {
        const amp = 1 + intensity * 5;
        setGlitchOffset({
          x: (Math.random() - 0.5) * amp * 2,
          y: (Math.random() - 0.5) * amp,
        });
        window.setTimeout(() => setGlitchOffset({ x: 0, y: 0 }), 40 + intensity * 40);
      }
    }, rate);
    return () => window.clearInterval(id);
  }, [intensity, reduceMotion, index]);

  useEffect(() => {
    if (reduceMotion) return;

    onAddressHint?.(era.url);

    const duration = era.duration;
    const targetY = era.targetYear === 'now' ? currentYear : era.targetYear;
    const startY = yearRef.current;
    let startTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-in so late digits fly faster
      const eased = progress * progress;
      const current = Math.floor(startY + (targetY - startY) * eased);
      yearRef.current = current;
      setTickingYear(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        yearRef.current = targetY;
        setTickingYear(targetY);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const t = window.setTimeout(() => {
      if (index >= ERAS.length - 1) {
        finish();
      } else {
        setIndex((i) => i + 1);
      }
    }, duration);

    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, [index, era, currentYear, reduceMotion, onAddressHint, finish]);

  if (reduceMotion) return null;

  const chroma = 2 + intensity * 6;
  const scanOpacity = intensity < 0.85 ? 0.15 + intensity * 0.35 : Math.max(0, 0.5 - (intensity - 0.85) * 3);
  const vignette = 0.25 + intensity * 0.65;

  return (
    <div
      className="bv-wormhole"
      style={
        {
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#000',
          perspective: '900px',
          perspectiveOrigin: '50% 45%',
          ['--bv-warp-i' as string]: String(intensity),
        } as React.CSSProperties
      }
    >
      <div
        className="bv-wormhole-stage"
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={era.id}
            initial={{
              opacity: 0,
              scale: 0.42,
              rotateX: 8 - intensity * 4,
              rotateY: (index % 2 === 0 ? -1 : 1) * (2 + intensity * 3),
              z: -200,
              filter: `blur(${intensity * 1.2}px)`,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              z: 0,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              scale: 2.4 + intensity * 0.6,
              rotateX: -4,
              z: 280,
              filter: `blur(${2 + intensity * 4}px)`,
            }}
            transition={{
              duration: Math.min(era.duration / 1000, 0.85),
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: '50% 50%',
              willChange: 'transform, opacity, filter',
            }}
          >
            <EraScreen id={era.id} tagline={era.label} name="Farhan" dense={era.dense} year={tickingYear} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Warp intensity overlays */}
      <div
        className="bv-warp-overlay"
        style={{
          opacity: vignette,
          boxShadow: `inset 0 0 ${60 + intensity * 120}px rgba(20, 60, 180, ${0.15 + intensity * 0.35})`,
        }}
      />
      <div className="bv-warp-lines" style={{ opacity: scanOpacity }} />
      <div
        className="bv-warp-streaks"
        style={{
          opacity: intensity * 0.85,
          animationDuration: `${Math.max(0.35, 1.2 - intensity * 0.85)}s`,
        }}
      />
      <div
        className="bv-warp-chroma"
        style={{
          opacity: intensity * 0.7,
          boxShadow: `
            inset ${chroma}px 0 0 rgba(255, 0, 80, 0.35),
            inset -${chroma}px 0 0 rgba(0, 220, 255, 0.35)
          `,
        }}
      />

      <div className="bv-year-counter-wrapper">
        <motion.div
          className={`bv-year-counter${intensity > 0.55 ? ' bv-year-counter--hot' : ''}`}
          animate={{
            scale: slamming ? [1, 1.15, 0.92] : 1 + intensity * 0.08,
            opacity: slamming ? [1, 1, 0] : 1,
            x: glitchOffset.x,
            y: glitchOffset.y,
          }}
          transition={slamming ? { duration: 0.28 } : { type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            textShadow: `
              0 0 ${12 + intensity * 28}px rgba(255,255,255,${0.35 + intensity * 0.4}),
              ${-2 - intensity * 3}px 0 0 rgba(255,40,80,${0.55 + intensity * 0.35}),
              ${2 + intensity * 3}px 0 0 rgba(0,240,255,${0.55 + intensity * 0.35})
            `,
          }}
        >
          {tickingYear}
        </motion.div>
        {intensity > 0.35 && (
          <motion.div
            className="bv-year-ghost"
            animate={{ opacity: [0.15, 0.4, 0.15], x: glitchOffset.x * 1.5 }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            {tickingYear}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {slamming && (
          <motion.div
            className="bv-slam-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, times: [0, 0.15, 0.45, 1] }}
          />
        )}
      </AnimatePresence>

      {showSkip && !slamming && (
        <button type="button" className="bv-skip" onClick={finish}>
          Skip →
        </button>
      )}
    </div>
  );
}

function EraScreen({
  id,
  tagline,
  name,
  dense,
  year,
}: {
  id: EraId;
  tagline: string;
  name: string;
  dense: boolean;
  year: number;
}) {
  if (!dense) {
    return (
      <div className={`bv-era bv-era-flash bv-era-${id === 'now' ? 'now' : id}`}>
        <div className="bv-flash-copy">
          <div className="bv-flash-year">{year}</div>
          <p className="bv-flash-gag">{tagline}</p>
        </div>
      </div>
    );
  }

  if (id === '2005') {
    return (
      <div className="bv-era bv-era-2005">
        <table>
          <tbody>
            <tr>
              <td colSpan={2} style={{ background: '#000080', color: '#fff', textAlign: 'center' }}>
                <strong>★ {name}&apos;s Home Page ★</strong>
              </td>
            </tr>
            <tr>
              <td style={{ width: '30%', background: '#e8e8ff' }}>
                <div>◆ Home</div>
                <div>◆ About Me</div>
                <div>◆ Cool Links</div>
                <div>◆ Guestbook</div>
              </td>
              <td>
                <h1>Hello World!!!</h1>
                <p className="blink">⚠ UNDER CONSTRUCTION ⚠</p>
                <p>Welcome to my website on the World Wide Web.</p>
                <p className="bv-era-tagline">{tagline}</p>
                <div className="counter">Visitors: 001002</div>
                <div style={{ marginTop: 8, fontSize: 10, color: '#888', fontFamily: 'Courier, monospace' }}>
                  Best viewed in 800×600 · Netscape Navigator 4.0
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (id === '2010') {
    return (
      <div className="bv-era bv-era-2010">
        <div className="gloss">
          <h1>{name}</h1>
          <p style={{ margin: 0, color: '#456' }}>Building cool stuff on the internet :)</p>
          <p className="bv-era-tagline">{tagline}</p>
          <div className="badges">
            <span className="badge">👍 Follow me</span>
            <span className="badge">📡 RSS</span>
            <span className="badge">❤️ Like</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: '#999', fontStyle: 'italic' }}>
            Powered by Web 2.0™
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bv-era bv-era-now">
      <div className="ship-label">{tagline}</div>
    </div>
  );
}

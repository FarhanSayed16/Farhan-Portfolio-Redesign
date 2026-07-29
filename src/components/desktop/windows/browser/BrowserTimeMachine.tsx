'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOSAudio } from '@/lib/useOSAudio';

type EraId = '2005' | '2010' | '2015' | '2020' | 'now';

/**
 * Pacing model (per era):
 *   HOLD  — screen readable, year LOCKED to this era (fixes “2005 on 2010 screen”)
 *   FLY   — year rolls toward next era + wormhole zoom-out
 * Curve is gentle acceleration, not a cliff (old: 3.2s → 0.48s felt broken).
 */
const ERAS: {
  id: EraId;
  year: number | 'now';
  label: string;
  holdMs: number;
  flyMs: number;
  dense: boolean;
  url: (y: number) => string;
}[] = [
  {
    id: '2005',
    year: 2005,
    label: 'Welcome to my homepage!!1',
    holdMs: 1600,
    flyMs: 700,
    dense: true,
    url: (y) => `http://farhan.tripod.com/~home?t=${y}`,
  },
  {
    id: '2010',
    year: 2010,
    label: 'Web 2.0 — now with rounded corners',
    holdMs: 1200,
    flyMs: 650,
    dense: true,
    url: (y) => `http://farhan.webs.com/profile?era=${y}`,
  },
  {
    id: '2015',
    year: 2015,
    label: 'Everything is a card now',
    holdMs: 950,
    flyMs: 600,
    dense: false,
    url: (y) => `https://farhan.github.io/?v=${y}&flat=1`,
  },
  {
    id: '2020',
    year: 2020,
    label: 'Dark mode + purple = professional',
    holdMs: 800,
    flyMs: 550,
    dense: false,
    url: (y) => `https://farhan.vercel.app/?utm=wormhole&y=${y}`,
  },
  {
    id: 'now',
    year: 'now',
    label: 'Arriving…',
    holdMs: 700,
    flyMs: 450,
    dense: false,
    url: () => 'https://farhanbuilds.in',
  },
];

const TOTAL_MS = ERAS.reduce((s, e) => s + e.holdMs + e.flyMs, 0);

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInQuad(t: number) {
  return t * t;
}

interface BrowserTimeMachineProps {
  onComplete: () => void;
  onAddressHint?: (url: string) => void;
}

export function BrowserTimeMachine({ onComplete, onAddressHint }: BrowserTimeMachineProps) {
  const reduceMotion = useReducedMotion();
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'hold' | 'fly'>('hold');
  const [showSkip, setShowSkip] = useState(false);
  const [tickingYear, setTickingYear] = useState(2005);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [slamming, setSlamming] = useState(false);
  const [flyProgress, setFlyProgress] = useState(0);
  const yearRef = useRef(2005);
  const rafRef = useRef(0);
  const finishedRef = useRef(false);
  const { playWarp, playWarpLand } = useOSAudio();

  const era = ERAS[index];
  const resolveYear = useCallback(
    (y: number | 'now') => (y === 'now' ? currentYear : y),
    [currentYear]
  );
  const eraYear = resolveYear(era.year);
  const nextYear = index < ERAS.length - 1 ? resolveYear(ERAS[index + 1].year) : eraYear;
  // During hold, always show the era’s year (keeps counter in sync with the screen)
  const displayYear = phase === 'hold' ? eraYear : tickingYear;

  // 0 → 1 across whole trip (smooth warp intensity, not stepped)
  const tripProgress = useMemo(() => {
    let elapsed = 0;
    for (let i = 0; i < index; i++) elapsed += ERAS[i].holdMs + ERAS[i].flyMs;
    if (phase === 'hold') elapsed += era.holdMs * 0.35;
    else elapsed += era.holdMs + flyProgress * era.flyMs;
    return Math.min(1, elapsed / TOTAL_MS);
  }, [index, phase, flyProgress, era.holdMs, era.flyMs]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setSlamming(true);
    yearRef.current = currentYear;
    setTickingYear(currentYear);
    playWarpLand();
    window.setTimeout(() => onComplete(), 300);
  }, [onComplete, playWarpLand, currentYear]);

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }
    const skipTimer = window.setTimeout(() => setShowSkip(true), 700);
    playWarp(TOTAL_MS / 1000);
    return () => window.clearTimeout(skipTimer);
  }, [reduceMotion, onComplete, playWarp]);

  // Glitch intensity follows continuous trip progress
  useEffect(() => {
    if (reduceMotion) return;
    const rate = Math.max(45, 110 - tripProgress * 70);
    const id = window.setInterval(() => {
      if (phase === 'fly' || tripProgress > 0.25) {
        if (Math.random() < 0.2 + tripProgress * 0.5) {
          const amp = 1 + tripProgress * 6;
          setGlitchOffset({
            x: (Math.random() - 0.5) * amp * 2,
            y: (Math.random() - 0.5) * amp,
          });
          window.setTimeout(() => setGlitchOffset({ x: 0, y: 0 }), 35 + tripProgress * 30);
        }
      }
    }, rate);
    return () => window.clearInterval(id);
  }, [tripProgress, phase, reduceMotion]);

  // Per-era timeline: HOLD (year locked) → FLY (year rolls + zoom)
  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    yearRef.current = eraYear;
    onAddressHint?.(era.url(eraYear));

    // Defer phase reset so we don’t sync-setState in the effect body (lint)
    const boot = window.setTimeout(() => {
      if (cancelled) return;
      setPhase('hold');
      setFlyProgress(0);
      setTickingYear(eraYear);
    }, 0);

    const holdTimer = window.setTimeout(() => {
      if (cancelled) return;
      setPhase('fly');
      const startY = eraYear;
      const endY = nextYear;
      const flyMs = era.flyMs;
      let startTs: number | null = null;

      const tick = (ts: number) => {
        if (cancelled) return;
        if (!startTs) startTs = ts;
        const raw = Math.min(1, (ts - startTs) / flyMs);
        setFlyProgress(raw);
        const eased = easeInQuad(raw);
        const y = Math.round(startY + (endY - startY) * eased);
        yearRef.current = y;
        setTickingYear(y);
        if (raw > 0.12) onAddressHint?.(era.url(y));
        if (raw < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          yearRef.current = endY;
          setTickingYear(endY);
          if (index >= ERAS.length - 1) finish();
          else setIndex((i) => i + 1);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, era.holdMs);

    return () => {
      cancelled = true;
      window.clearTimeout(boot);
      window.clearTimeout(holdTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [index, era, eraYear, nextYear, reduceMotion, onAddressHint, finish]);

  if (reduceMotion) return null;

  const intensity = tripProgress;
  const chroma = 2 + intensity * 7;
  const scanOpacity =
    intensity < 0.75 ? 0.12 + intensity * 0.4 : Math.max(0.05, 0.55 - (intensity - 0.75) * 2);
  const vignette = 0.2 + intensity * 0.7;
  const isFlying = phase === 'fly';

  // Zoom: hold = settled; fly = accelerate out
  const flyEase = easeInOutCubic(flyProgress);

  return (
    <div
      className="bv-wormhole"
      style={
        {
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#000',
          perspective: '1100px',
          perspectiveOrigin: '50% 42%',
          ['--bv-warp-i' as string]: String(intensity),
        } as React.CSSProperties
      }
    >
      <div
        className="bv-wormhole-stage"
        style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={era.id}
            initial={{
              opacity: 0,
              scale: 0.55,
              rotateX: 6,
              rotateY: (index % 2 === 0 ? -1 : 1) * 3,
              z: -160,
              filter: 'blur(3px)',
            }}
            animate={
              isFlying
                ? {
                    opacity: 1 - flyEase * 0.85,
                    scale: 1 + flyEase * (1.6 + intensity * 0.5),
                    rotateX: -flyEase * 5,
                    rotateY: (index % 2 === 0 ? 1 : -1) * flyEase * 4,
                    z: flyEase * 320,
                    filter: `blur(${flyEase * (3 + intensity * 3)}px)`,
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    z: 0,
                    filter: 'blur(0px)',
                  }
            }
            exit={{
              opacity: 0,
              scale: 2.2,
              z: 200,
              filter: 'blur(6px)',
            }}
            transition={
              isFlying
                ? { duration: 0.05, ease: 'linear' }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: '50% 50%',
              willChange: 'transform, opacity, filter',
            }}
          >
            <EraScreen id={era.id} tagline={era.label} name="Farhan" dense={era.dense} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="bv-warp-overlay"
        style={{
          opacity: vignette + (isFlying ? flyProgress * 0.2 : 0),
          boxShadow: `inset 0 0 ${50 + intensity * 140}px rgba(20, 60, 180, ${0.12 + intensity * 0.4})`,
        }}
      />
      <div className="bv-warp-lines" style={{ opacity: scanOpacity }} />
      <div
        className="bv-warp-streaks"
        style={{
          opacity: (isFlying ? 0.35 : 0.1) + intensity * 0.7,
          animationDuration: `${Math.max(0.28, 1.15 - intensity * 0.9)}s`,
        }}
      />
      <div
        className="bv-warp-chroma"
        style={{
          opacity: (isFlying ? 0.35 : 0.1) + intensity * 0.55,
          boxShadow: `
            inset ${chroma}px 0 0 rgba(255, 0, 80, 0.4),
            inset -${chroma}px 0 0 rgba(0, 220, 255, 0.4)
          `,
        }}
      />

      <div className="bv-year-counter-wrapper">
        <motion.div
          className={`bv-year-counter${isFlying || intensity > 0.4 ? ' bv-year-counter--hot' : ''}`}
          animate={{
            scale: slamming ? [1, 1.18, 0.9] : isFlying ? 1 + flyProgress * 0.12 : 1,
            opacity: slamming ? [1, 1, 0] : 1,
            x: glitchOffset.x,
            y: glitchOffset.y,
          }}
          transition={slamming ? { duration: 0.28 } : { duration: 0.08 }}
          style={{
            textShadow: `
              0 0 ${10 + intensity * 32}px rgba(255,255,255,${0.3 + intensity * 0.45}),
              ${-2 - intensity * 4}px 0 0 rgba(255,40,80,${0.5 + intensity * 0.4}),
              ${2 + intensity * 4}px 0 0 rgba(0,240,255,${0.5 + intensity * 0.4})
            `,
          }}
        >
          {displayYear}
        </motion.div>
        {(isFlying || intensity > 0.3) && (
          <motion.div
            className="bv-year-ghost"
            animate={{ opacity: [0.12, 0.35, 0.12], x: glitchOffset.x * 1.4 }}
            transition={{ duration: 0.18, repeat: Infinity }}
          >
            {displayYear}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {slamming && (
          <motion.div
            className="bv-slam-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, times: [0, 0.12, 0.45, 1] }}
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
}: {
  id: EraId;
  tagline: string;
  name: string;
  dense: boolean;
}) {
  if (!dense) {
    return (
      <div className={`bv-era bv-era-flash bv-era-${id === 'now' ? 'now' : id}`}>
        <div className="bv-flash-copy">
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
            <span className="badge">Follow me</span>
            <span className="badge">RSS</span>
            <span className="badge">Like</span>
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

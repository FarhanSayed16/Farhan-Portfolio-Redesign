'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Project } from '@/lib/content';

/* Soft fallback only when a screenshot is missing — not tinted over photos */
const FALLBACK: Record<string, string> = {
  platforms: 'linear-gradient(135deg, #141820 0%, #1c2430 100%)',
  web: 'linear-gradient(135deg, #141820 0%, #1c2430 100%)',
  ai: 'linear-gradient(135deg, #14141c 0%, #1a1a28 100%)',
  mobile: 'linear-gradient(135deg, #141820 0%, #1a2230 100%)',
  hardware: 'linear-gradient(135deg, #121816 0%, #1a241e 100%)',
  robotics: 'linear-gradient(135deg, #121816 0%, #1a241e 100%)',
  default: 'linear-gradient(135deg, #0f1218 0%, #161b24 100%)',
};

function fallbackBg(category: string): string {
  return FALLBACK[category] || FALLBACK.default;
}

interface Props {
  projects: Project[];
  /** Desktop OS: open Projects Explorer on this case study. Mobile: optional no-op. */
  onOpenCaseStudy?: (projectId: string) => void;
}

/**
 * Selected Work carousel.
 * Intent: sell the *product*, not the file manager.
 * Primary = live site (proof). Secondary = case study (story) when the OS can host it.
 */
export function ProjectShowcase({ projects, onOpenCaseStudy }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const count = projects.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [paused, count, go]);

  const p = projects[index];
  const hasLive = Boolean(p?.demoUrl);
  const hasCaseStudy = typeof onOpenCaseStudy === 'function';

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0, scale: 0.95 }),
  };

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setPaused(false);
  };

  if (!p || count === 0) return null;

  return (
    <section className="bv-section bv-showcase" id="bv-work">
      <div className="bv-showcase-inner">
        <h2 className="bv-section-label">Selected Work</h2>

        <div className="bv-showcase-stage" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={p.id}
              ref={ref}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="bv-showcase-card"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bv-frame-bracket top-left" aria-hidden />
              <div className="bv-frame-bracket top-right" aria-hidden />
              <div className="bv-frame-bracket bottom-left" aria-hidden />
              <div className="bv-frame-bracket bottom-right" aria-hidden />

              <div className="bv-showcase-visual" style={{ background: fallbackBg(p.category) }}>
                {p.image && !p.image.includes('placeholder') ? (
                  <>
                    {/* Blurred bleed so letterboxing never reads as empty */}
                    <img 
                      src={p.image} 
                      alt="" 
                      className="bv-showcase-bg-fill" 
                      style={p.id === 'knoq' ? { filter: 'blur(32px) saturate(1.08) brightness(0.15)' } : undefined}
                      aria-hidden 
                    />
                    <div className="bv-showcase-shot">
                      <img src={p.image} alt={`${p.title} preview`} className="bv-showcase-bg-img" />
                    </div>
                  </>
                ) : (
                  <div className="bv-showcase-no-preview">
                    <span className="bv-showcase-no-preview-icon" aria-hidden>
                      {p.category === 'ai'
                        ? '🧠'
                        : p.category === 'hardware' || p.category === 'robotics'
                          ? '🤖'
                          : p.category === 'platforms'
                            ? '🧩'
                            : p.category === 'mobile'
                              ? '📱'
                              : '💻'}
                    </span>
                    <span className="bv-showcase-no-preview-label">Preview Coming Soon</span>
                  </div>
                )}
              </div>

              <div className="bv-showcase-info" style={{ transform: 'translateZ(40px)' }}>
                <h3 className="bv-showcase-title">{p.title}</h3>
                <p className="bv-showcase-tagline">{p.tagline}</p>
                {p.award && <span className="bv-showcase-award">🏆 {p.award}</span>}
                <p className="bv-showcase-desc">{p.shortDescription}</p>

                <div className="bv-showcase-tech-cloud">
                  {p.tech.slice(0, 5).map((t) => (
                    <span key={t} className="bv-showcase-tech-pill">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="bv-showcase-actions">
                  {hasLive ? (
                    <a
                      className="bv-btn bv-btn-glow"
                      href={p.demoUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="btn-content">Open Live Site</span>
                      <span className="btn-arrow">↗</span>
                    </a>
                  ) : hasCaseStudy ? (
                    <button
                      type="button"
                      className="bv-btn bv-btn-glow"
                      onClick={() => onOpenCaseStudy!(p.id)}
                    >
                      <span className="btn-content">View Case Study</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  ) : null}

                  {hasLive && hasCaseStudy && (
                    <button
                      type="button"
                      className="bv-btn bv-btn-ghost"
                      onClick={() => onOpenCaseStudy!(p.id)}
                    >
                      Case study
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <>
              <button
                type="button"
                className="bv-showcase-arrow bv-showcase-arrow--left"
                onClick={() => go(-1)}
                aria-label="Previous project"
              >
                ←
              </button>
              <button
                type="button"
                className="bv-showcase-arrow bv-showcase-arrow--right"
                onClick={() => go(1)}
                aria-label="Next project"
              >
                →
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div className="bv-showcase-dots">
            {projects.map((proj, i) => (
              <button
                key={proj.id}
                type="button"
                className={`bv-showcase-dot ${i === index ? 'active' : ''}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

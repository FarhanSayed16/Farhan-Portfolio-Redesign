'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Project } from '@/lib/content';

/* ── Gradient palettes per project category ─────────────────── */
const GRADIENTS: Record<string, string> = {
  web: 'linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)',
  ai: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  mobile: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  default: 'linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%)',
};

function getGradient(category: string): string {
  return GRADIENTS[category] || GRADIENTS.default;
}

interface Props {
  projects: Project[];
  openProjects: () => void;
}

export function ProjectShowcase({ projects, openProjects }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [paused, setPaused] = useState(false);

  const count = projects.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  // Auto-advance every 5s
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [paused, count, go]);

  const p = projects[index];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0, scale: 0.95 }),
  };

  // --- 3D Hover Tilt Logic ---
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
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setPaused(false);
  };

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
              {/* Corner framing for cyberpunk aesthetic */}
              <div className="bv-frame-bracket top-left" aria-hidden />
              <div className="bv-frame-bracket top-right" aria-hidden />
              <div className="bv-frame-bracket bottom-left" aria-hidden />
              <div className="bv-frame-bracket bottom-right" aria-hidden />

              {/* Visual Side (Left) */}
              <div
                className="bv-showcase-visual"
                style={{ background: getGradient(p.category) }}
              >
                {/* Embedded Generative Artwork/Mockup */}
                {p.image && (
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="bv-showcase-bg-img"
                  />
                )}
                
                <div className="bv-showcase-visual-overlay" />
                
                <div className="bv-showcase-visual-content" style={{ transform: 'translateZ(30px)' }}>
                  <span className="bv-showcase-num">0{index + 1}</span>
                  <div className="bv-showcase-tech-cloud">
                    {p.tech.slice(0, 5).map((t) => (
                      <span key={t} className="bv-showcase-tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Decorative grid overlay */}
                <div className="bv-showcase-grid-overlay" aria-hidden />
              </div>

              {/* Text Content (Right) */}
              <div className="bv-showcase-info" style={{ transform: 'translateZ(40px)' }}>
                <h3 className="bv-showcase-title">{p.title}</h3>
                <p className="bv-showcase-tagline">{p.tagline}</p>
                {p.award && (
                  <span className="bv-showcase-award">🏆 {p.award}</span>
                )}
                <p className="bv-showcase-desc">{p.shortDescription}</p>
                <button
                  type="button"
                  className="bv-btn bv-btn-glow"
                  onClick={openProjects}
                >
                  <span className="btn-content">View Details</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
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

        {/* Dots */}
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

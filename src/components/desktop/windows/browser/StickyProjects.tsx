import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { Project } from '@/lib/content';

export function StickyProjects({ projects, openProjects }: { projects: Project[], openProjects: () => void }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Depending on how many projects, we scroll left by a certain percentage.
  // 3 projects = scroll by -66% of the container width to show the last one.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '-66.66%']);

  return (
    <section ref={targetRef} className="bv-sticky-projects-section" id="bv-work">
      <div className="bv-sticky-projects-sticky">
        <div className="bv-sticky-projects-header">
          <h2>Selected Work</h2>
        </div>
        <motion.div style={{ x }} className="bv-sticky-projects-scroll">
          {projects.map((p, i) => (
            <div key={p.id} className="bv-sticky-project-card">
              <div className="bv-sticky-project-content">
                <span className="bv-work-index">0{i + 1}</span>
                <h3 className="title">{p.title}</h3>
                <p className="tag">{p.tagline}</p>
                {p.award && <span className="meta">{p.award}</span>}
                <button type="button" className="bv-btn bv-btn-ghost bv-sticky-project-btn" onClick={openProjects}>
                  View Details →
                </button>
              </div>
              <div className="bv-sticky-project-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="bv-sticky-project-image" 
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

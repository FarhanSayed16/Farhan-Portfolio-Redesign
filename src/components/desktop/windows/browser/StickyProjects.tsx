import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { Project } from '@/lib/content';

export function StickyProjects({
  projects,
  onOpenCaseStudy,
}: {
  projects: Project[];
  onOpenCaseStudy?: (projectId: string) => void;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {p.demoUrl ? (
                    <a
                      className="bv-btn bv-btn-ghost bv-sticky-project-btn"
                      href={p.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Live Site ↗
                    </a>
                  ) : null}
                  {onOpenCaseStudy && (
                    <button
                      type="button"
                      className="bv-btn bv-btn-ghost bv-sticky-project-btn"
                      onClick={() => onOpenCaseStudy(p.id)}
                    >
                      {p.demoUrl ? 'Case study' : 'View Case Study →'}
                    </button>
                  )}
                </div>
              </div>
              <div className="bv-sticky-project-image-wrapper">
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

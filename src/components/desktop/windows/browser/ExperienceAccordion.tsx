'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Experience } from '@/lib/content';

interface Props {
  experiences: Experience[];
}

export function ExperienceAccordion({ experiences }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default to first item expanded

  return (
    <div className="bv-experience-layout">
      {/* Sideways Growth Pathway */}
      <div className="bv-growth-pathway" aria-hidden>
        <div className="bv-pathway-line">
          <motion.div 
            className="bv-pathway-progress" 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
        {experiences.map((_, index) => (
          <div 
            key={`node-${index}`} 
            className={`bv-pathway-node ${activeIndex === index ? 'active' : ''}`} 
            style={{ top: `calc(${index * (100 / Math.max(1, experiences.length - 1))}% + 24px)` }}
          />
        ))}
        <div className="bv-pathway-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
      </div>

      <div className="bv-accordion-container">
        {experiences.map((exp, index) => {
        const isActive = activeIndex === index;

        return (
          <motion.div
            key={exp.role + exp.company}
            className={`bv-accordion-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveIndex(isActive ? null : index)}
            onMouseEnter={() => setActiveIndex(index)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Minimal Strip (Always Visible) */}
            <div className="bv-accordion-header">
              <div className="bv-accordion-title-wrap">
                <span className="bv-accordion-index">0{index + 1}</span>
                <h3 className="bv-accordion-company">{exp.company}</h3>
              </div>
              <span className="bv-accordion-duration">{exp.duration}</span>
            </div>

            {/* Expanded Content */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  className="bv-accordion-content-wrap"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto', marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 },
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="bv-accordion-content">
                    <h4 className="bv-accordion-role">{exp.role}</h4>
                    <p className="bv-accordion-desc">{exp.description}</p>
                    
                    {/* Cyberpunk Accents */}
                    <div className="bv-acc-bracket top-left" aria-hidden />
                    <div className="bv-acc-bracket bottom-right" aria-hidden />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
}

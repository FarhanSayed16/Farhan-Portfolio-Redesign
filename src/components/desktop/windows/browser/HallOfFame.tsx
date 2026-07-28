'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement, Certification } from '@/lib/content';

interface Props {
  achievements: Achievement[];
  certifications: Certification[];
}

const ease = [0.22, 1, 0.36, 1];

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const CertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// Interactive Sub-component for individual bento cards (supports manual carousel)
function BentoCard({ ach, index }: { ach: Achievement; index: number }) {
  const [currentImg, setCurrentImg] = useState(0);
  const hasImages = ach.images && ach.images.length > 0;
  const numImages = hasImages ? ach.images!.length : 0;

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % numImages);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + numImages) % numImages);
  };

  const getIcon = () => {
    const place = ach.place.toLowerCase();
    if (place.includes('1st') || place.includes('winner')) return '✦';
    if (place.includes('finalist')) return '✧';
    if (ach.level.toLowerCase().includes('international')) return '❖';
    return '•';
  };

  return (
    <motion.div
      className={`hof-bento-card hof-size-${ach.gridSize || 'square'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease }}
    >
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="popLayout">
        {hasImages && (
          <motion.div
            key={currentImg}
            className="hof-bento-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ '--bg-img': `url('${ach.images![currentImg]}')`, '--bg-fit': ach.fit || 'contain' } as React.CSSProperties}
          />
        )}
      </AnimatePresence>

      <div className="hof-bento-overlay" />

      {/* Manual Carousel Controls */}
      {numImages > 1 && (
        <>
          <button className="hof-carousel-btn left" onClick={prevImg}>‹</button>
          <button className="hof-carousel-btn right" onClick={nextImg}>›</button>
          <div className="hof-carousel-dots">
            {ach.images!.map((_, i) => (
              <span key={i} className={`hof-dot ${i === currentImg ? 'active' : ''}`} />
            ))}
          </div>
        </>
      )}

      <div className="hof-bento-year">{ach.year}</div>

      <div className="hof-bento-info">
        <span className="hof-bento-tag">
          <span className="tag-icon">{getIcon()}</span>
          {ach.level.toUpperCase()} · {ach.place.toUpperCase()}
        </span>
        <h3 className="hof-bento-title">{ach.title}</h3>
        <p className="hof-bento-desc">{ach.description}</p>
      </div>
    </motion.div>
  );
}

export function HallOfFame({ achievements, certifications }: Props) {
  const [activeTab, setActiveTab] = useState<'awards' | 'certifications'>('awards');
  const tabRef = useRef<HTMLDivElement>(null);

  return (
    <div className="hof-root">
      {/* Editorial Header */}
      <div className="hof-header">
        <span className="hof-overline">ACHIEVEMENTS</span>
        <h2 className="hof-title">
          Recognition & <em>milestones.</em>
        </h2>
        <p className="hof-subtitle">
          Four years of building, competing, and shipping — every stage, every award, every moment.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="hof-tabs" ref={tabRef}>
        <button
          className={`hof-tab ${activeTab === 'awards' ? 'active' : ''}`}
          onClick={() => setActiveTab('awards')}
        >
          <span className="hof-tab-icon"><AwardIcon /></span>
          Awards & Hall of Fame
        </button>
        <button
          className={`hof-tab ${activeTab === 'certifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('certifications')}
        >
          <span className="hof-tab-icon"><CertIcon /></span>
          Certifications
          <span className="hof-tab-count">{certifications.length}</span>
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'awards' ? (
          <motion.div
            key="awards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease }}
            className="hof-bento-grid"
          >
            {achievements.map((ach, i) => (
              <BentoCard key={ach.title} ach={ach} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="certifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease }}
            className="hof-cert-grid"
          >
            {certifications.map((cert, i) => (
              <motion.a
                key={cert.name}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`hof-cert-card ${cert.featured ? 'featured' : ''} ${cert.image ? 'has-image' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10px' }}
                transition={{ delay: i * 0.04, duration: 0.5, ease }}
              >
                {cert.image && (
                  <div className="hof-cert-img-wrapper">
                    <img src={cert.image} alt={cert.name} className="hof-cert-img" />
                  </div>
                )}
                <div className="hof-cert-content">
                  <div className="hof-cert-issuer">{cert.issuer}</div>
                  <h4 className="hof-cert-name">{cert.name}</h4>
                  <p className="hof-cert-description">{cert.description}</p>
                  <div className="hof-cert-footer">
                    <span className="hof-cert-date">{cert.date}</span>
                    <span className="hof-cert-arrow">↗</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

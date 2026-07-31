'use client';

import { useRef, useState, useEffect, type MouseEvent } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import {
  siteData,
  aboutData,
  projectsData,
  skillsData,
  experienceData,
  achievementsData,
  testimonialsData,
  certificationsData,
  stats,
  getEmailAddress,
  getMailtoHref,
  getWhatsAppHref,
} from '@/lib/content';
import { TestimonialSlider } from './TestimonialSlider';
import { ProjectShowcase } from './ProjectShowcase';
import { FloatingDock } from './FloatingDock';
import { ExperienceAccordion } from './ExperienceAccordion';
import { HallOfFame } from './HallOfFame';
import InteractiveGitHubGrid from './InteractiveGitHubGrid';
import LaserDivider from './LaserDivider';
import { Mail, Terminal, ArrowUpRight } from 'lucide-react';
import Lenis from 'lenis';
import ContactForm from '@/components/shared/ContactForm';

interface ModernSiteProps {
  /** Desktop IE only — hidden on mobile standalone (no Time Machine on phones). */
  onReplayEras?: () => void;
  /** Desktop: open Projects window. Standalone: falls back to in-page scroll. */
  onOpenProjects?: () => void;
  /** Desktop: open Contact window. Standalone: falls back to #bv-contact. */
  onOpenContact?: () => void;
  /** Full-page mobile portfolio (not inside XP browser). */
  standalone?: boolean;
}

const ease = [0.16, 1, 0.3, 1] as const;

const GithubIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const WhatsappIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease },
  }),
};

export function ModernSite({
  onReplayEras,
  onOpenProjects,
  onOpenContact,
  standalone = false,
}: ModernSiteProps) {
  const reduceMotion = useReducedMotion();
  const featured = projectsData.filter((p) => p.featured && !p.archived).slice(0, 5);
  const aboutBlurb = aboutData.bio.split('\n\n')[0] ?? aboutData.bio;
  const SKILL_ICONS: Record<string, { slug: string; color: string }> = {
    Python: { slug: 'python', color: '3776AB' },
    JavaScript: { slug: 'javascript', color: 'F7DF1E' },
    TypeScript: { slug: 'typescript', color: '3178C6' },
    'C/C++': { slug: 'cplusplus', color: '00599C' },
    Dart: { slug: 'dart', color: '0175C2' },
    'HTML/CSS': { slug: 'html5', color: 'E34F26' },
    'Tailwind CSS': { slug: 'tailwindcss', color: '06B6D4' },
    PHP: { slug: 'php', color: '777BB4' },
    'MERN Stack': { slug: 'react', color: '61DAFB' },
    'React.js': { slug: 'react', color: '61DAFB' },
    'Next.js': { slug: 'nextdotjs', color: 'ffffff' },
    Svelte: { slug: 'svelte', color: 'FF3E00' },
    SvelteKit: { slug: 'svelte', color: 'FF3E00' },
    'Node.js': { slug: 'nodedotjs', color: '339933' },
    Express: { slug: 'express', color: 'ffffff' },
    FastAPI: { slug: 'fastapi', color: '009688' },
    'REST APIs': { slug: 'postman', color: 'FF6C37' },
    'Socket.io': { slug: 'socketdotio', color: 'ffffff' },
    WebSockets: { slug: 'json', color: 'ffffff' },
    MySQL: { slug: 'mysql', color: '4479A1' },
    MongoDB: { slug: 'mongodb', color: '47A248' },
    PostgreSQL: { slug: 'postgresql', color: '4169E1' },
    PostGIS: { slug: 'postgresql', color: '336791' },
    Firebase: { slug: 'firebase', color: 'FFCA28' },
    Redis: { slug: 'redis', color: 'DC382D' },
    Flutter: { slug: 'flutter', color: '02569B' },
    'Cross-Platform Apps': { slug: 'flutter', color: '02569B' },
    Docker: { slug: 'docker', color: '2496ED' },
    Figma: { slug: 'figma', color: 'F24E1E' },
    'UI/UX': { slug: 'figma', color: 'A259FF' },
    'IBM Cloud': { slug: 'ibmcloud', color: '1261FE' },
    'TensorFlow/PyTorch': { slug: 'tensorflow', color: 'FF6F00' },
    'Machine Learning': { slug: 'scikitlearn', color: 'F7931E' },
    'Neural Networks': { slug: 'pytorch', color: 'EE4C2C' },
    'Computer Vision': { slug: 'opencv', color: '5C3EE8' },
    YOLO: { slug: 'opencv', color: '5C3EE8' },
    MediaPipe: { slug: 'google', color: '4285F4' },
    NLP: { slug: 'huggingface', color: 'FFD21E' },
    Transformers: { slug: 'huggingface', color: 'FFD21E' },
    'AI System Design': { slug: 'openai', color: '412991' },
    'Google AI Studio': { slug: 'google', color: '4285F4' },
    'AI Agents': { slug: 'langchain', color: '1C3C3C' },
    'IoT & Embedded Systems': { slug: 'espressif', color: 'E7352C' },
    'Arduino Mega': { slug: 'arduino', color: '00979D' },
    ESP32: { slug: 'espressif', color: 'E7352C' },
    'Raspberry Pi': { slug: 'raspberrypi', color: 'A22846' },
    Sensors: { slug: 'adafruit', color: 'ffffff' },
    'Robotics Automation': { slug: 'ros', color: '22314E' },
    'Enterprise Architecture': { slug: 'architecture', color: '00599C' },
    'TOGAF ADM': { slug: 'opengroup', color: '003366' },
    ArchiMate: { slug: 'uml', color: 'F24E1E' },
    'Chrome Extension API': { slug: 'googlechrome', color: '4285F4' },
    Celery: { slug: 'celery', color: '37814A' },
    'API Integration': { slug: 'postman', color: 'FF6C37' },
    'Project Management': { slug: 'jira', color: '0052CC' },
    Agile: { slug: 'confluence', color: '172B4D' },
    'Team Leadership': { slug: 'github', color: 'ffffff' },
  };

  const CORE_TECH_SKILLS = [
    'Python',
    'JavaScript',
    'TypeScript',
    'C/C++',
    'Next.js',
    'React.js',
    'Node.js',
    'FastAPI',
    'Tailwind CSS',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Machine Learning',
    'Neural Networks',
    'Computer Vision',
    'YOLO',
    'MediaPipe',
    'NLP',
    'Transformers',
    'TensorFlow/PyTorch',
    'Flutter',
    'Firebase',
    'IoT & Embedded Systems',
    'ESP32',
    'Raspberry Pi',
  ].filter((s) => s in SKILL_ICONS);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  // Standalone scrolls the document (native, compositor-friendly); embedded scrolls its own box.
  const { scrollYProgress } = useScroll(standalone ? {} : { container: scrollContainerRef });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Native scroll on mobile standalone — Lenis + custom cursor feel janky on touch
  useEffect(() => {
    if (standalone || reduceMotion) return;
    if (!scrollContainerRef.current || !scrollContentRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContentRef.current,
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [standalone, reduceMotion]);

  // #9 Parallax hero portrait (desktop / embedded only)
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.3], [0, standalone ? 0 : -40]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (standalone) {
      const root = document.querySelector('.mps-root');
      if (root instanceof HTMLElement) {
        const top =
          el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
        root.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
        return;
      }
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openProjects = () => {
    if (onOpenProjects) onOpenProjects();
    else scrollTo('bv-work');
  };

  const openContact = () => {
    if (onOpenContact) onOpenContact();
    else scrollTo('bv-contact');
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const glowBackground = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(239, 68, 68, 0.10), transparent 80%)`;
  const dotsMask = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;

  const handlePointerMove = (e: MouseEvent) => {
    if (standalone) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    mouseX.set(localX);
    mouseY.set(localY + (scrollContainerRef.current?.scrollTop ?? 0));
    cursorX.set(localX);
    cursorY.set(localY);
  };

  return (
    <div
      className={`bv-modern-viewport${standalone ? ' bv-modern-viewport--standalone' : ''}`}
      onPointerMove={handlePointerMove}
      style={
        standalone
          ? { position: 'relative', width: '100%' }
          : { position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }
      }
      data-standalone={standalone ? 'true' : undefined}
    >
      <div
        className="bv-modern"
        ref={scrollContainerRef}
        style={standalone ? undefined : { height: '100%', overflowY: 'auto' }}
      >
        <div ref={scrollContentRef} className="bv-scroll-content">
      <div className="bv-modern-atmosphere" aria-hidden />
      
      {/* Glow + cursor: desktop / embedded only */}
      {!standalone && (
        <>
          <motion.div
            className="bv-modern-glow"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background: glowBackground,
            }}
          />
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              backgroundImage:
                'radial-gradient(circle, rgba(239, 68, 68, 0.5) 1.5px, transparent 1.5px)',
              backgroundSize: '60px 60px',
              backgroundPosition: '-0.5px -0.5px',
              maskImage: dotsMask,
              WebkitMaskImage: dotsMask,
            }}
          />
        </>
      )}
      
      {/* Scroll progress bar */}
      <div className="bv-scroll-progress">
        <motion.div className="bv-scroll-progress-bar" style={{ scaleX }} />
      </div>

      {/* Removed old navigation, using FloatingDock at bottom instead */}

      <header className="bv-hero">
        <div className="bv-hero-grid">
          <div className="bv-hero-copy">
            <motion.div
              className="bv-hero-role"
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              {siteData.tagline}
            </motion.div>
            <motion.h1
              className="bv-hero-name"
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <span className="bv-hero-name-line">{siteData.name.split(' ')[0]}</span>
              <span className="bv-hero-name-line bv-hero-name-accent">
                {siteData.name.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>
            <motion.p
              className="bv-hero-lead"
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              {siteData.taglineShort}
            </motion.p>
            <motion.div
              className="bv-cta-row"
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <button type="button" className="bv-btn bv-btn-primary" onClick={() => scrollTo('bv-work')}>
                View work
                <span className="bv-btn-arrow">→</span>
              </button>
              <button type="button" className="bv-btn bv-btn-ghost" onClick={() => window.open(siteData.resumeUrl, '_blank')}>
                Download resume
              </button>
            </motion.div>
            <motion.div
              className="bv-hero-meta"
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <span>{siteData.location}</span>
              <span className="bv-meta-sep" />
              <span className="bv-status">{siteData.availability}</span>
            </motion.div>
          </div>

          <motion.div
            className="bv-hero-visual"
            initial={{ opacity: 0, scale: 0.92, rotateY: standalone ? 0 : -12 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease }}
            style={{ perspective: 900, y: standalone ? 0 : heroParallaxY }}
          >
            <PortraitCard
              src={siteData.profileImage}
              name={siteData.name}
              reduceMotion={!!reduceMotion || standalone}
              staticMode={standalone}
            />
          </motion.div>
        </div>
      </header>

      <LaserDivider color="#ef4444" />

      {/* #12 Tech Stack Marquee — skipped on phones: 50+ icon requests for a hidden strip */}
      {!standalone && (
        <>
          <div className="bv-marquee-section">
            <div className="bv-marquee-track">
              {[...CORE_TECH_SKILLS, ...CORE_TECH_SKILLS].map((s, i) => {
                const iconData = SKILL_ICONS[s];
                return (
                  <span key={`${s}-${i}`} className="bv-marquee-item">
                    {iconData && (
                      <img
                        src={`https://cdn.simpleicons.org/${iconData.slug}/${iconData.color}`}
                        alt={`${s} icon`}
                        className="bv-marquee-icon"
                      />
                    )}
                    <span className="bv-marquee-text">{s}</span>
                    <span className="bv-marquee-sep">·</span>
                  </span>
                );
              })}
            </div>
          </div>

          <LaserDivider color="#ef4444" />
        </>
      )}

      <ProjectShowcase projects={featured} openProjects={openProjects} />

      <LaserDivider color="#ef4444" />

      {/* Brand Statement / The Story Section */}
      <motion.section
        className="bv-section bv-story-section"
        id="bv-story"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.h2 className="bv-section-label" variants={fadeUp} custom={0} style={{ marginBottom: 40 }}>
          Why I Build
        </motion.h2>
        
        <div className="bv-story-grid">
          <div className="bv-story-content">
            <motion.h3 className="bv-story-headline" variants={fadeUp} custom={1}>
              I build <span className="bv-text-highlight">intelligent systems</span> to solve the unsolved.
            </motion.h3>
            
            <motion.p className="bv-story-text" variants={fadeUp} custom={2}>
              My mission is to transform complex problems into elegant, highly scalable solutions. Whether it&apos;s architecting <span className="bv-text-highlight">government platforms</span>, scaling <span className="bv-text-highlight">startup ventures</span>, or deploying <span className="bv-text-highlight">enterprise-grade AI</span>, I blend cutting-edge technology with visionary innovation to build systems that truly matter.
            </motion.p>
          </div>
          
          <div className="bv-story-stats">
            <StatsBar />
          </div>
        </div>
      </motion.section>

      <LaserDivider color="#ef4444" />

      <motion.section
        className="bv-section"
        id="bv-skills"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.h2 variants={fadeUp} custom={0}>
          Stacks
        </motion.h2>
        <StacksBlock
          skills={CORE_TECH_SKILLS}
          icons={SKILL_ICONS}
          reduceMotion={!!reduceMotion}
          collapsible={standalone}
        />

        <motion.div variants={fadeUp} custom={2} className="bv-github-header">
          <h2>GitHub Contributions</h2>
          <span className="bv-github-username">@FarhanSayed16</span>
        </motion.div>
        
        <motion.div variants={fadeUp} custom={3}>
          <InteractiveGitHubGrid compact={standalone} />
        </motion.div>
      </motion.section>

      <LaserDivider color="#ef4444" />

      <motion.section
        className="bv-section"
        id="bv-experience"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '40px' }}>
          Experience
        </motion.h2>
        
        <ExperienceAccordion experiences={experienceData} />
      </motion.section>

      <LaserDivider color="#ef4444" />

      <motion.section
        className="bv-section"
        id="bv-achievements"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <HallOfFame achievements={achievementsData} certifications={certificationsData} />
      </motion.section>

      {testimonialsData && testimonialsData.length > 0 && (
        <motion.section
          className="bv-section"
          id="bv-testimonials"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          <motion.h2 variants={fadeUp} custom={0}>
            What People Say
          </motion.h2>
          <motion.div variants={fadeUp} custom={1}>
            <TestimonialSlider testimonials={testimonialsData} />
          </motion.div>
        </motion.section>
      )}

      <LaserDivider color="#ef4444" />

      <motion.section
        className="bv-contact-section-premium"
        id="bv-contact"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.div className="premium-contact-container" variants={fadeUp} custom={0}>
          <div className="premium-contact-bg-glow" />
          
          <div className="premium-contact-content">
            <h2 className="premium-contact-title">
              Let&apos;s build something <br/> <span className="text-glow">intelligent</span> together.
            </h2>
            
            <p className="premium-contact-subtitle">
              Always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>

            <div className="premium-contact-actions">
              {composeOpen && standalone ? (
                <div className="mps-contact-panel">
                  <div className="mps-contact-panel-head">
                    <span>Send a message</span>
                    <button type="button" className="mps-contact-close" onClick={() => setComposeOpen(false)} aria-label="Close form">
                      ×
                    </button>
                  </div>
                  <ContactForm onDone={() => setComposeOpen(false)} />
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="cyber-btn-primary"
                    onClick={() => {
                      if (standalone) setComposeOpen(true);
                      else openContact();
                    }}
                  >
                    <span className="cyber-btn-glitch" />
                    Initiate Contact <ArrowUpRight size={18} className="cyber-arrow" />
                  </button>
                  <button type="button" className="cyber-btn-secondary" onClick={openContact}>
                    <Terminal size={18} className="terminal-icon" /> Open Terminal
                  </button>
                </>
              )}
            </div>

            <div className="premium-social-cards">
              <a href={siteData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-card">
                <div className="social-card-inner">
                  <GithubIcon size={20} className="social-icon-svg" />
                  <span className="social-label">GitHub</span>
                </div>
              </a>
              <a href={siteData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-card">
                <div className="social-card-inner">
                  <LinkedinIcon size={20} className="social-icon-svg" />
                  <span className="social-label">LinkedIn</span>
                </div>
              </a>
              {standalone ? (
                <button type="button" className="social-card email-card" onClick={() => setComposeOpen(true)}>
                  <div className="social-card-inner">
                    <Mail size={20} className="social-icon-svg" />
                    <span className="social-label">{getEmailAddress()}</span>
                  </div>
                </button>
              ) : (
                <a href={getMailtoHref('Hello')} className="social-card email-card">
                  <div className="social-card-inner">
                    <Mail size={20} className="social-icon-svg" />
                    <span className="social-label">{getEmailAddress()}</span>
                  </div>
                </a>
              )}
              {getWhatsAppHref() && (
                <a href={getWhatsAppHref('Hello Farhan') || ''} target="_blank" rel="noopener noreferrer" className="social-card">
                  <div className="social-card-inner">
                    <WhatsappIcon size={20} className="social-icon-svg" />
                    <span className="social-label">WhatsApp</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.section>

      <footer className="premium-footer">
        <LaserDivider color="#ef4444" />
        <div className="premium-footer-content">
          <div className="footer-left">
            <span>Built with ♥ and a Time Machine</span>
            <span className="footer-separator">·</span>
            <span>{new Date().getFullYear()}</span>
          </div>
          <div className="footer-right">
            {onReplayEras ? (
              <button type="button" className="terminal-replay-btn" onClick={onReplayEras}>
                <span className="prompt">{'>'}</span> <span className="command">execute replay_history()</span>
                <span className="cursor blink">_</span>
              </button>
            ) : (
              <span className="footer-standalone-hint">farhanbuilds.in</span>
            )}
          </div>
        </div>
      </footer>
      </div> {/* End bv-scroll-content */}
      </div> {/* End scrollable container */}

      {/* Phones use the shell's fixed bottom nav instead — one bottom chrome only */}
      {!standalone && <FloatingDock />}

      {!standalone && (
        <motion.div
          className="bv-custom-cursor"
          style={{
            left: cursorX,
            top: cursorY,
          }}
        >
          <div className="bv-cursor-dot" />
          <div className="bv-cursor-brackets">
            <span className="bv-cbr bv-cbr-tl" />
            <span className="bv-cbr bv-cbr-tr" />
            <span className="bv-cbr bv-cbr-bl" />
            <span className="bv-cbr bv-cbr-br" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── Stats Counter Bar ──────────────────────────────────────── */
const STATS_DATA = [
  { value: 32, suffix: '+', label: 'Products Built' },
  { value: 12, suffix: '+', label: 'Major Awards' },
  { value: 6, suffix: '+', label: 'Startups Scaled' },
  { value: 4, suffix: '+', label: 'Years Building' },
];

const MOBILE_STACK_PREVIEW = 8;

function StacksBlock({
  skills,
  icons,
  reduceMotion,
  collapsible,
}: {
  skills: string[];
  icons: Record<string, { slug: string; color: string }>;
  reduceMotion: boolean;
  collapsible: boolean;
}) {
  const [open, setOpen] = useState(false);
  const visible = collapsible && !open ? skills.slice(0, MOBILE_STACK_PREVIEW) : skills;
  const hiddenCount = Math.max(0, skills.length - MOBILE_STACK_PREVIEW);

  return (
    <motion.div variants={fadeUp} custom={1} className="bv-stacks-wrap">
      <div className={`bv-stacks-container${collapsible ? ' bv-stacks-container--mobile' : ''}`}>
        {visible.map((s, i) => {
          const icon = icons[s];
          if (!icon) return null;
          return (
            <motion.div
              key={s}
              className="bv-stack-badge"
              whileHover={reduceMotion || collapsible ? undefined : { y: -2, scale: 1.02 }}
              transition={{ delay: 0.02 * i, duration: 0.2, ease }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`}
                alt=""
                className="bv-stack-icon"
              />
              {s}
            </motion.div>
          );
        })}
      </div>
      {collapsible && hiddenCount > 0 && (
        <button
          type="button"
          className="bv-stacks-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? 'Show less' : `Show ${hiddenCount} more stacks`}
          <span className={`bv-stacks-chevron${open ? ' is-open' : ''}`} aria-hidden>
            ▾
          </span>
        </button>
      )}
    </motion.div>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className="bv-stats-bar"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {STATS_DATA.map((s) => (
        <div key={s.label} className="bv-stat">
          <div className="bv-stat-number">
            <AnimatedNumber target={s.value} active={isInView} />
            {s.suffix && <span className="bv-stat-plus">{s.suffix}</span>}
          </div>
          <div className="bv-stat-label">{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

function AnimatedNumber({ target, active }: { target: number; active: boolean }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return <>{value}</>;
}

function PortraitCard({
  src,
  name,
  reduceMotion,
  staticMode = false,
}: {
  src: string;
  name: string;
  reduceMotion: boolean;
  staticMode?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 55%)`;

  const onMove = (e: MouseEvent) => {
    if (staticMode || reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 14);
    rotateY.set((px - 0.5) * 16);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(40);
  };

  return (
    <div className="bv-portrait-stage">
      <div className="bv-portrait-ring" aria-hidden />
      <motion.div
        ref={ref}
        className="bv-portrait-card"
        style={{
          rotateX: staticMode ? 0 : springX,
          rotateY: staticMode ? 0 : springY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="bv-portrait-frame">
          {imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={name}
              className="bv-portrait-img"
              onError={() => setImgOk(false)}
              draggable={false}
            />
          ) : (
            <div className="bv-portrait-fallback">
              <span>{initials}</span>
              <small>Add public/images/farhan.jpeg</small>
            </div>
          )}
          {!staticMode && (
            <motion.div className="bv-portrait-glare" style={{ background: glare }} aria-hidden />
          )}
        </div>
        {/* Caption moved OUTSIDE the clipped frame so it's not cut by overflow:hidden + border-radius:50% */}
        <div
          className="bv-portrait-caption"
          style={staticMode ? undefined : { transform: 'translateZ(28px)' }}
        >
          <strong>{name}</strong>
          <span>SIH 2025 National Winner</span>
        </div>
      </motion.div>
    </div>
  );
}

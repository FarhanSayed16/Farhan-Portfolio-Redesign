'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, BriefcaseBusiness, Trophy, Mail } from 'lucide-react';
import { ModernSite } from '@/components/desktop/windows/browser/ModernSite';
import '@/components/desktop/windows/browser/browserTheme.css';
import './modernPortfolio.css';

/**
 * Mobile / tablet “portfolio site” door.
 * ModernSite only — no Time Machine eras. Nokia is an easter egg (?view=nokia).
 */
const NAV = [
  { id: 'bv-work', label: 'Work', Icon: Terminal },
  { id: 'bv-skills', label: 'Skills', Icon: BriefcaseBusiness },
  { id: 'bv-achievements', label: 'Awards', Icon: Trophy },
  { id: 'bv-contact', label: 'Contact', Icon: Mail },
];

export default function ModernPortfolioShell() {
  const router = useRouter();
  const [active, setActive] = useState<string>('bv-work');

  // Farhan OS locks html/body. Phone site scrolls inside .mps-root (own scrollport).
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlHeight: html.style.height,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
    };

    html.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.height = '100%';
    html.classList.add('mps-unlocked');
    body.classList.add('mps-unlocked');

    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.height = prev.htmlHeight;
      body.style.overflow = prev.bodyOverflow;
      body.style.height = prev.bodyHeight;
      html.classList.remove('mps-unlocked');
      body.classList.remove('mps-unlocked');
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector('.mps-root');
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      {
        root: root instanceof Element ? root : null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    const root = document.querySelector('.mps-root');
    if (!el) return;
    if (root instanceof HTMLElement) {
      const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
      root.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mps-root" data-portfolio="modern">
      <ModernSite standalone />

      <nav className="mps-nav" aria-label="Sections">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`mps-nav-btn${active === id ? ' is-active' : ''}`}
            onClick={() => go(id)}
            aria-current={active === id ? 'true' : undefined}
          >
            <Icon size={18} strokeWidth={1.9} aria-hidden />
            <span>{label}</span>
          </button>
        ))}
        <button
          type="button"
          className="mps-nav-egg"
          aria-label="Try Nokia phone"
          onClick={() => router.push('/?view=nokia')}
        >
          Nokia
        </button>
      </nav>
    </div>
  );
}

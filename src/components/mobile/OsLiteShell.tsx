'use client';

import { useState } from 'react';
import { usePhone } from '@/context/PhoneContext';
import AboutWindow from '@/components/desktop/windows/AboutWindow';
import ProjectsWindow from '@/components/desktop/windows/ProjectsWindow';
import ExperienceWindow from '@/components/desktop/windows/ExperienceWindow';
import ResumeWindow from '@/components/desktop/windows/ResumeWindow';
import ContactWindow from '@/components/desktop/windows/ContactWindow';
import './osLite.css';

type OsLiteApp = 'about' | 'projects' | 'experience' | 'resume' | 'contact';

const APPS: { id: OsLiteApp; label: string; title: string; mark: string }[] = [
  { id: 'about', label: 'About', title: 'About Me', mark: 'A' },
  { id: 'projects', label: 'Projects', title: 'My Projects', mark: 'P' },
  { id: 'experience', label: 'Work', title: 'Experience', mark: 'W' },
  { id: 'resume', label: 'Resume', title: 'Resume.pdf', mark: 'R' },
  { id: 'contact', label: 'Contact', title: 'Contact', mark: 'C' },
];

/**
 * Portrait Farhan OS Lite — one app at a time + bottom dock.
 * Full viewport (not inside Nokia LCD). Mute prefs stay in localStorage.
 */
export default function OsLiteShell() {
  const { navigate } = usePhone();
  const [active, setActive] = useState<OsLiteApp>('about');
  const current = APPS.find((a) => a.id === active) ?? APPS[0];

  const backToPhone = () => navigate('menu');

  return (
    <div data-theme="xp" className="oslite" aria-label="Farhan OS Lite">
      <header className="oslite-top">
        <div>
          <h1>Farhan OS</h1>
          <p>Lite · portrait mode</p>
        </div>
        <button type="button" className="oslite-phone-btn" onClick={backToPhone}>
          ← Phone
        </button>
      </header>

      <section className="oslite-stage">
        <div className="oslite-titlebar">{current.title}</div>
        <div className="oslite-body">{renderApp(active)}</div>
      </section>

      <nav className="oslite-dock" aria-label="Farhan OS dock">
        {APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            className={`oslite-dock-btn${active === app.id ? ' is-active' : ''}`}
            onClick={() => setActive(app.id)}
            aria-current={active === app.id ? 'page' : undefined}
          >
            <span className="oslite-dock-mark" aria-hidden>
              {app.mark}
            </span>
            <span>{app.label}</span>
          </button>
        ))}
        <button type="button" className="oslite-dock-btn is-back" onClick={backToPhone}>
          <span className="oslite-dock-mark" aria-hidden>
            ←
          </span>
          <span>Phone</span>
        </button>
      </nav>
    </div>
  );
}

function renderApp(id: OsLiteApp) {
  switch (id) {
    case 'about':
      return <AboutWindow />;
    case 'projects':
      return (
        <div className="oslite-projects">
          <ProjectsWindow />
        </div>
      );
    case 'experience':
      return <ExperienceWindow />;
    case 'resume':
      return <ResumeWindow />;
    case 'contact':
      return <ContactWindow />;
    default:
      return <AboutWindow />;
  }
}

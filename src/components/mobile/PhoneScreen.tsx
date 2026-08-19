'use client';

import { useEffect, useRef, useState } from 'react';
import { usePhone, type PhoneScreen } from '@/context/PhoneContext';
import {
  siteData,
  aboutData,
  projectsData,
  skillsData,
  achievementsData,
  experienceData,
  getEmailAddress,
  getMailtoHref,
  getWhatsAppHref,
} from '@/lib/content';
import PhoneGame, { GameLauncherScreen } from './PhoneGame';
// OsLite mounts at PhoneShell level (full viewport), not inside the LCD


/** Hire-first main menu (M2). Reset is Select-only — `#` is reserved for list toggles. */
export const MENU_ITEMS: { key: PhoneScreen; label: string; digit?: string }[] = [
  { key: 'profile', label: '1. Profile', digit: '1' },
  { key: 'achievements', label: '2. Achievements', digit: '2' },
  { key: 'projects', label: '3. Projects', digit: '3' },
  { key: 'skills', label: '4. Skills', digit: '4' },
  { key: 'experience', label: '5. Experience', digit: '5' },
  { key: 'contact', label: '6. Contact', digit: '6' },
  { key: 'game-launcher', label: '0. Play Game', digit: '0' },
  { key: 'farhan-os', label: '7. Farhan OS', digit: '7' },
  { key: 'reset', label: '8. Reset Device', digit: '8' },
];

export function getSoftKeyLabels(
  screen: PhoneScreen,
  payload?: Record<string, unknown>
): { left: string; right: string } {
  switch (screen) {
    case 'boot':
      return { left: 'Skip', right: '—' };
    case 'menu':
      return { left: 'Select', right: '—' };
    case 'contact':
      return { left: 'Open', right: 'Back' };
    case 'projects':
    case 'achievements':
    case 'experience':
      return { left: 'Open', right: 'Back' };
    case 'project-detail':
    case 'profile':
    case 'skills':
    case 'farhan-os':
      return { left: '—', right: 'Back' };
    case 'game-launcher':
      if (payload?.gameHowTo) return { left: '—', right: 'Back' };
      return { left: 'Start', right: 'Back' };
    case 'game-play':
      return { left: '—', right: 'Quit' };
    default:
      return { left: 'Options', right: 'Back' };
  }
}

/**
 * Renders the current screen content inside the Nokia display.
 */
export default function PhoneScreen() {
  const { state, navigate } = usePhone();

  const content = (() => {
    switch (state.currentScreen) {
      case 'boot':
        return <BootScreen onDone={() => navigate('menu')} />;
      case 'menu':
        return <MainMenu />;
      case 'profile':
        return <ProfileScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'projects':
        return <ProjectsListScreen />;
      case 'project-detail':
        return <ProjectDetailScreen />;
      case 'skills':
        return <SkillsScreen />;
      case 'experience':
        return <ExperienceScreen />;
      case 'contact':
        return <ContactScreen />;
      case 'farhan-os':
        return null;
      case 'game-launcher':
        return <GameLauncherScreen />;
      case 'game-play':
        return <PhoneGame />;
      default:
        return <MainMenu />;
    }
  })();

  if (
    state.currentScreen === 'game-play' ||
    state.currentScreen === 'boot' ||
    state.currentScreen === 'farhan-os'
  ) {
    return content;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <ToastBanner />
      <div key={state.currentScreen} className="nokia-screen-fade" style={{ flex: 1, minHeight: 0 }}>
        {content}
      </div>
    </div>
  );
}

const screenStyle: React.CSSProperties = {
  height: '100%',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--font-pixel)',
  fontSize: '8px',
  color: 'var(--nokia-green)',
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  borderBottom: '1px solid rgba(67, 217, 124, 0.3)',
  paddingBottom: '4px',
  marginBottom: '6px',
  fontSize: '8px',
};

function ToastBanner() {
  const { state, dispatch } = usePhone();
  const toast = state.payload?.toast as string | undefined;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => {
      dispatch({ type: 'SET_PAYLOAD', payload: { toast: undefined } });
    }, 1800);
    return () => window.clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;
  return (
    <div style={{ fontSize: '6px', textAlign: 'center', opacity: 0.7, marginBottom: 4 }}>
      {toast}
    </div>
  );
}

function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 300);
          return 100;
        }
        return p + 5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div style={{ ...screenStyle, alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <div style={{ fontSize: '10px' }}>FARHAN OS</div>
      <div style={{ fontSize: '7px', opacity: 0.6 }}>Nokia Edition</div>
      <div
        style={{
          width: '80%',
          height: 6,
          background: 'rgba(67, 217, 124, 0.15)',
          borderRadius: 2,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--nokia-green)',
            borderRadius: 2,
            transition: 'width 0.1s',
          }}
        />
      </div>
      <div style={{ fontSize: '6px', opacity: 0.45 }}>Options = skip</div>
    </div>
  );
}

function MainMenu() {
  const { state, navigate } = usePhone();
  const idx = Math.min(state.selectedIndex, MENU_ITEMS.length - 1);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  const handleItem = (key: PhoneScreen) => {
    if (key === 'reset') {
      window.localStorage.removeItem('farhan-device-preference');
      window.localStorage.removeItem('farhan-has-booted');
      window.location.reload();
      return;
    }
    navigate(key);
  };

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>MAIN MENU</div>
      <div
        ref={listRef}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'auto' }}
      >
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleItem(item.key)}
            style={{
              display: 'block',
              width: '100%',
              padding: '4px 6px',
              background: i === idx ? 'var(--nokia-green)' : 'transparent',
              color: i === idx ? 'var(--nokia-screen)' : 'var(--nokia-green)',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'var(--font-pixel)',
              fontSize: '8px',
              borderRadius: '2px',
              flexShrink: 0,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  const edu = aboutData.timeline[0];
  const bioShort = aboutData.bio.split('\n\n')[0]?.slice(0, 90) ?? siteData.taglineShort;

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>PROFILE</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteData.profileImage}
            alt=""
            width={40}
            height={40}
            style={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              objectPosition: 'var(--portrait-x, 47%) var(--portrait-y, 40%)',
              borderRadius: 2,
              border: '1px solid rgba(67, 217, 124, 0.45)',
              flexShrink: 0,
              imageRendering: 'auto',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '8px' }}>{siteData.name}</div>
            <div style={{ opacity: 0.7, fontSize: '6px', marginTop: 2 }}>{siteData.location}</div>
          </div>
        </div>
        <div style={{ opacity: 0.85, fontSize: '7px' }}>AI & Full-Stack Engineer</div>
        <div style={{ fontSize: '6px', lineHeight: 1.45, opacity: 0.75 }}>
          ★ SIH 2025 National Winner
        </div>
        <div style={{ fontSize: '6px', lineHeight: 1.45, opacity: 0.75 }}>
          ★ Intl. Finalist · GEA 2025
        </div>
        {edu && (
          <div style={{ opacity: 0.6, fontSize: '6px', lineHeight: 1.4 }}>
            {edu.year}: {edu.title}
          </div>
        )}
        <div
          style={{
            borderTop: '1px solid rgba(67, 217, 124, 0.2)',
            paddingTop: '4px',
            lineHeight: 1.5,
            opacity: 0.75,
            fontSize: '6px',
          }}
        >
          {bioShort}
          {bioShort.length >= 90 ? '…' : ''}
        </div>
        <div style={{ opacity: 0.55, marginTop: 'auto', fontSize: '6px' }}>
          {siteData.availability}
        </div>
      </div>
    </div>
  );
}

function ProjectsListScreen() {
  const { state, navigate } = usePhone();
  const showArchived = Boolean(state.payload?.showArchived);
  const list = showArchived ? projectsData : projectsData.filter((p) => p.featured);
  const idx = Math.min(state.selectedIndex, Math.max(list.length - 1, 0));
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>
        PROJECTS ({list.length})
        {showArchived ? ' ALL' : ''}
      </div>
      <div
        ref={listRef}
        style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}
      >
        {list.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() =>
              navigate('project-detail', {
                projectId: p.id,
                showArchived: state.payload?.showArchived,
              })
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              width: '100%',
              padding: '3px 4px',
              background: i === idx ? 'var(--nokia-green)' : 'transparent',
              color: i === idx ? 'var(--nokia-screen)' : 'var(--nokia-green)',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'var(--font-pixel)',
              fontSize: '7px',
              borderRadius: '1px',
              flexShrink: 0,
            }}
          >
            {p.award ? '★ ' : '  '}
            {p.title}
          </button>
        ))}
      </div>
      <div style={{ fontSize: '6px', opacity: 0.4, textAlign: 'center' }}># = show all</div>
    </div>
  );
}

function ProjectDetailScreen() {
  const { state } = usePhone();
  const projectId = (state.payload?.projectId as string) || '';
  const project = projectsData.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div style={screenStyle}>
        <div style={titleStyle}>NOT FOUND</div>
      </div>
    );
  }

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>{project.title.toUpperCase()}</div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          lineHeight: 1.5,
        }}
      >
        <div style={{ opacity: 0.8 }}>{project.tagline}</div>
        {project.award && <div style={{ fontSize: '7px' }}>★ {project.award}</div>}
        <div
          style={{
            borderTop: '1px solid rgba(67, 217, 124, 0.2)',
            paddingTop: '3px',
            opacity: 0.7,
            fontSize: '7px',
          }}
        >
          {project.shortDescription}
        </div>
        <div style={{ fontSize: '6px', opacity: 0.5, marginTop: 'auto' }}>
          {project.tech.slice(0, 4).join(' · ')}
        </div>
      </div>
    </div>
  );
}

function SkillsScreen() {
  const { state } = usePhone();
  const showAll = Boolean(state.payload?.showAllSkills);
  const catIdx = Math.min(state.selectedIndex, skillsData.length - 1);
  const cat = skillsData[catIdx];
  const skills = showAll ? skillsData.flatMap((c) => c.skills) : cat.skills;

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>
        {showAll ? 'SKILLS ALL' : `SKILLS ◄ ${cat.categoryName} ►`}
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {skills.map((skill, i) => (
          <div key={`${skill}-${i}`} style={{ padding: '2px 4px', opacity: 0.8, fontSize: '7px' }}>
            • {skill}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '6px', opacity: 0.4, textAlign: 'center' }}>
        {showAll ? '# = categories' : '◄► cats · # = all'}
      </div>
    </div>
  );
}

function AchievementsScreen() {
  const { state } = usePhone();
  const idx = Math.min(state.selectedIndex, achievementsData.length - 1);
  const selected = achievementsData[idx];
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>ACHIEVEMENTS ({achievementsData.length})</div>
      <div
        ref={listRef}
        style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}
      >
        {achievementsData.map((a, i) => (
          <div
            key={i}
            style={{
              padding: '3px 4px',
              background: i === idx ? 'var(--nokia-green)' : 'transparent',
              color: i === idx ? 'var(--nokia-screen)' : 'var(--nokia-green)',
              borderRadius: '1px',
              fontSize: '7px',
              flexShrink: 0,
            }}
          >
            {a.title} ({a.year})
          </div>
        ))}
      </div>
      {selected && (
        <div
          style={{
            borderTop: '1px solid var(--nokia-green)',
            padding: '4px',
            fontSize: '6px',
            lineHeight: 1.4,
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          <div style={{ marginBottom: '2px' }}>{selected.place}</div>
          <div>{selected.description}</div>
        </div>
      )}
    </div>
  );
}

function ExperienceScreen() {
  const { state } = usePhone();
  const list = experienceData.slice(0, 5);
  const idx = Math.min(state.selectedIndex, Math.max(list.length - 1, 0));
  const selected = list[idx];
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>EXPERIENCE</div>
      <div
        ref={listRef}
        style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}
      >
        {list.map((e, i) => (
          <div
            key={`${e.company}-${e.duration}`}
            style={{
              padding: '3px 4px',
              background: i === idx ? 'var(--nokia-green)' : 'transparent',
              color: i === idx ? 'var(--nokia-screen)' : 'var(--nokia-green)',
              borderRadius: '1px',
              fontSize: '6px',
              flexShrink: 0,
              lineHeight: 1.35,
            }}
          >
            {e.role}
          </div>
        ))}
      </div>
      {selected && (
        <div
          style={{
            borderTop: '1px solid var(--nokia-green)',
            padding: '4px',
            fontSize: '6px',
            lineHeight: 1.4,
            opacity: 0.75,
            flexShrink: 0,
          }}
        >
          <div>{selected.company}</div>
          <div style={{ opacity: 0.7 }}>{selected.duration}</div>
        </div>
      )}
    </div>
  );
}

type ContactAction = 'linkedin' | 'whatsapp' | 'email' | 'save' | 'resume' | 'card';

const CONTACT_ITEMS: { id: ContactAction; label: string }[] = [
  { id: 'linkedin', label: '1. LinkedIn' },
  { id: 'whatsapp', label: '2. WhatsApp' },
  { id: 'email', label: '3. Email' },
  { id: 'save', label: '4. Save contact' },
  { id: 'resume', label: '5. Download resume' },
  { id: 'card', label: '6. Connect card' },
];

function runContactAction(id: ContactAction) {
  const wa = getWhatsAppHref('Hi Farhan — found you on Farhan OS (Nokia).');
  switch (id) {
    case 'linkedin':
      window.open(siteData.socialLinks.linkedin, '_blank', 'noopener,noreferrer');
      break;
    case 'whatsapp':
      if (wa) window.open(wa, '_blank', 'noopener,noreferrer');
      break;
    case 'email':
      window.open(getMailtoHref('Hello from Farhan OS'), '_blank');
      break;
    case 'save':
      window.location.href = '/farhan.vcf';
      break;
    case 'resume':
      window.open(siteData.resumeUrl, '_blank', 'noopener,noreferrer');
      break;
    case 'card':
      window.location.href = '/connectQR';
      break;
  }
}

function ContactScreen() {
  const { state } = usePhone();
  const items = CONTACT_ITEMS.filter((i) => i.id !== 'whatsapp' || getWhatsAppHref());
  const idx = Math.min(state.selectedIndex, items.length - 1);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>CONTACT</div>
      <div style={{ fontSize: '6px', opacity: 0.55, marginBottom: 4, textAlign: 'center' }}>
        {getEmailAddress()}
      </div>
      <div
        ref={listRef}
        style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => runContactAction(item.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '4px 6px',
              background: i === idx ? 'var(--nokia-green)' : 'transparent',
              color: i === idx ? 'var(--nokia-screen)' : 'var(--nokia-green)',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'var(--font-pixel)',
              fontSize: '7px',
              borderRadius: '2px',
              flexShrink: 0,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: '6px', opacity: 0.4, textAlign: 'center' }}>OK / Options = open</div>
    </div>
  );
}



/** Used by PhoneFrame Select on contact. */
export function openContactSelection(selectedIndex: number) {
  const items = CONTACT_ITEMS.filter((i) => i.id !== 'whatsapp' || getWhatsAppHref());
  const item = items[Math.min(selectedIndex, items.length - 1)];
  if (item) runContactAction(item.id);
}

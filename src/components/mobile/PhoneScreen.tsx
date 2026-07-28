'use client';

import { useEffect, useRef, useState } from 'react';
import { usePhone } from '@/context/PhoneContext';
import {
  siteData,
  aboutData,
  projectsData,
  skillsData,
  achievementsData,
  getEmailAddress,
  getMailtoHref,
} from '@/lib/content';
import PhoneGame from './PhoneGame';

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
      case 'projects':
        return <ProjectsListScreen />;
      case 'project-detail':
        return <ProjectDetailScreen />;
      case 'skills':
        return <SkillsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'contact':
        return <ContactScreen />;
      case 'game-launcher':
        return <PhoneGame />;
      default:
        return <MainMenu />;
    }
  })();

  if (state.currentScreen === 'game-launcher' || state.currentScreen === 'boot') {
    return content;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <ToastBanner />
      <div style={{ flex: 1, minHeight: 0 }}>{content}</div>
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
      setProgress(p => {
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
      <div style={{ width: '80%', height: 6, background: 'rgba(67, 217, 124, 0.15)', borderRadius: 2 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--nokia-green)', borderRadius: 2, transition: 'width 0.1s' }} />
      </div>
    </div>
  );
}

const MENU_ITEMS = [
  { key: 'profile' as const, label: '1. Profile' },
  { key: 'projects' as const, label: '2. Projects' },
  { key: 'skills' as const, label: '3. Skills' },
  { key: 'achievements' as const, label: '4. Achievements' },
  { key: 'contact' as const, label: '5. Contact' },
  { key: 'game-launcher' as const, label: '0. Play Game' },
  { key: 'reset' as const, label: '#. Reset Device' },
];

function MainMenu() {
  const { state, navigate } = usePhone();
  const idx = Math.min(state.selectedIndex, MENU_ITEMS.length - 1);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  const handleItem = (key: (typeof MENU_ITEMS)[number]['key']) => {
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
      <div ref={listRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'auto' }}>
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.key}
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
  const bioShort = aboutData.bio.split('\n\n')[0]?.slice(0, 120) ?? siteData.taglineShort;

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>PROFILE</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflow: 'auto' }}>
        <div style={{ fontSize: '9px' }}>{siteData.name}</div>
        <div style={{ opacity: 0.7 }}>{siteData.location}</div>
        <div style={{ opacity: 0.7 }}>{siteData.roles[0]}</div>
        {edu && (
          <div style={{ opacity: 0.65, fontSize: '7px', lineHeight: 1.5 }}>
            {edu.year}: {edu.title}
          </div>
        )}
        <div style={{ borderTop: '1px solid rgba(67, 217, 124, 0.2)', paddingTop: '4px', marginTop: '2px', lineHeight: 1.6, opacity: 0.8, fontSize: '7px' }}>
          {bioShort}
          {bioShort.length >= 120 ? '…' : ''}
        </div>
        <div style={{ opacity: 0.6, marginTop: 'auto' }}>{siteData.availability}</div>
      </div>
    </div>
  );
}

function ProjectsListScreen() {
  const { state, navigate } = usePhone();
  const showArchived = Boolean(state.payload?.showArchived);
  const list = showArchived ? projectsData : projectsData.filter(p => p.featured);
  const idx = Math.min(state.selectedIndex, Math.max(list.length - 1, 0));
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>
        PROJECTS ({list.length}){showArchived ? ' ALL' : ''}
      </div>
      <div ref={listRef} style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {list.map((p, i) => (
          <button
            key={p.id}
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
            {p.award ? '★ ' : '  '}{p.title}
          </button>
        ))}
      </div>
      <div style={{ fontSize: '6px', opacity: 0.4, textAlign: 'center' }}># toggle all</div>
    </div>
  );
}

function ProjectDetailScreen() {
  const { state } = usePhone();
  const projectId = (state.payload?.projectId as string) || '';
  const project = projectsData.find(p => p.id === projectId);

  if (!project) {
    return <div style={screenStyle}><div style={titleStyle}>NOT FOUND</div></div>;
  }

  return (
    <div style={screenStyle}>
      <div style={titleStyle}>{project.title.toUpperCase()}</div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: 1.5 }}>
        <div style={{ opacity: 0.8 }}>{project.tagline}</div>
        {project.award && <div style={{ fontSize: '7px' }}>★ {project.award}</div>}
        <div style={{ borderTop: '1px solid rgba(67, 217, 124, 0.2)', paddingTop: '3px', opacity: 0.7, fontSize: '7px' }}>
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
  const skills = showAll ? skillsData.flatMap(c => c.skills) : cat.skills;

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
        {showAll ? '# categories' : '◄► categories · # all'}
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
      <div ref={listRef} style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
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
        <div style={{ borderTop: '1px solid var(--nokia-green)', padding: '4px', fontSize: '6px', lineHeight: 1.4, opacity: 0.7, flexShrink: 0 }}>
          <div style={{ marginBottom: '2px' }}>{selected.place}</div>
          <div>{selected.description}</div>
        </div>
      )}
    </div>
  );
}

function ContactScreen() {
  return (
    <div style={screenStyle}>
      <div style={titleStyle}>CONTACT</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '7px', opacity: 0.8 }}>Email:</div>
        <a
          href={getMailtoHref()}
          style={{ color: 'var(--nokia-green)', fontSize: '7px', textDecoration: 'underline' }}
        >
          {getEmailAddress()}
        </a>
        <div style={{ fontSize: '7px', opacity: 0.8, marginTop: '6px' }}>GitHub:</div>
        <a
          href={siteData.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--nokia-green)', fontSize: '6px', textDecoration: 'underline' }}
        >
          github.com/FarhanSayed16
        </a>
        <div style={{ fontSize: '7px', opacity: 0.8, marginTop: '6px' }}>LinkedIn:</div>
        <a
          href={siteData.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--nokia-green)', fontSize: '6px', textDecoration: 'underline' }}
        >
          LinkedIn Profile
        </a>
        <div style={{ fontSize: '6px', opacity: 0.4, marginTop: '8px' }}>OK / Options = email</div>
      </div>
    </div>
  );
}

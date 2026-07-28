'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteData, projectsData } from '@/lib/content';
import { useOSAudio } from '@/lib/useOSAudio';
import { XP_ICONS, XpStartLogo } from './XpIcons';

interface StartMenuProps {
  onClose: () => void;
  onOpenWindow: (id: string, title: string, component: string, payload?: Record<string, unknown>) => void;
}

const MENU_ITEMS: Array<
  | { id: string; label: string; title: string; component: string; accent?: boolean }
  | { divider: true }
> = [
  { id: 'readme', label: 'README.txt', title: 'README.txt — Notepad', component: 'readme' },
  { id: 'about', label: 'About Me', title: 'About Me.txt — Notepad', component: 'about' },
  { id: 'projects', label: 'Projects', title: 'Projects — Explorer', component: 'projects' },
  { id: 'skills', label: 'Skills', title: 'Skills.exe', component: 'skills' },
  { id: 'experience', label: 'Experience', title: 'Experience — Timeline', component: 'experience' },
  { id: 'achievements', label: 'Achievements', title: 'Achievements — Explorer', component: 'achievements' },
  { id: 'resume', label: 'Resume.pdf', title: 'Resume.pdf — Viewer', component: 'resume' },
  { id: 'browser', label: 'Internet Explorer', title: 'Browser — farhanbuilds.in', component: 'browser' },
  { id: 'contact', label: 'Contact', title: 'Contact — New Message', component: 'contact' },
  { divider: true },
  { id: 'game', label: "Super Mario Bros. - Farhan's Story", title: "Super Mario Bros. - Farhan's Story", component: 'game', accent: true },
  { divider: true },
  { id: 'system-info', label: 'My Computer', title: 'System Information', component: 'system-info' },
];

export default function StartMenu({ onClose, onOpenWindow }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [projectsHover, setProjectsHover] = useState(false);
  const { playClick } = useOSAudio();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKey);
    }, 50);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.12 }}
      style={{
        position: 'fixed',
        bottom: 30,
        left: 0,
        width: 380,
        height: 420,
        zIndex: 9500,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-os)',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.45)',
        border: '1px solid #0831d9',
      }}
    >
      {/* User strip */}
      <div
        style={{
          height: 54,
          background: 'linear-gradient(180deg, #1a4fb5 0%, #3a7ae0 50%, #1a4fb5 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 12px',
          color: '#fff',
          borderBottom: '1px solid #0831d9',
        }}
      >
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          title="Wheeeeee!"
          style={{
            width: 40,
            height: 40,
            borderRadius: 4,
            background: 'linear-gradient(180deg, #fff 0%, #c0c0c0 100%)',
            border: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '1px 1px 2px rgba(0,0,0,0.4)',
            cursor: 'grab',
          }}
        >
          <XpStartLogo size={22} />
        </motion.div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
            {siteData.name}
          </div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>System Administrator</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', background: '#fff', minHeight: 0 }}>
        {/* Left white list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 0', borderRight: '1px solid #d0d0d0' }}>
          {MENU_ITEMS.map((item, i) => {
            if ('divider' in item) {
              return (
                <div key={`d-${i}`} style={{ height: 1, background: '#d0d0d0', margin: '4px 10px' }} />
              );
            }
            const Icon = XP_ICONS[item.id] ?? XP_ICONS.readme;
            return (
              <button
                key={item.id}
                type="button"
                title={`Launch ${item.label}`}
                onClick={() => onOpenWindow(item.id, item.title, item.component)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--os-highlight)';
                  e.currentTarget.style.color = '#fff';
                  if (item.id === 'projects') setProjectsHover(true);
                  else setProjectsHover(false);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#000';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '5px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: item.accent ? '#000080' : '#000',
                  cursor: 'pointer',
                  fontSize: 12,
                  textAlign: 'left',
                  fontWeight: item.accent ? 700 : 400,
                }}
              >
                <Icon size={24} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.id === 'projects' && <span style={{ opacity: 0.6 }}>▸</span>}
              </button>
            );
          })}
        </div>

        {/* Right blue pane shortcuts */}
        <div
          style={{
            width: 150,
            background: 'linear-gradient(180deg, #7ba2e7 0%, #6375d6 100%)',
            padding: '8px 6px',
            color: '#fff',
            fontSize: 11,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8, textShadow: '1px 1px 0 #000' }}>
            My Places
          </div>
          {[
            { id: 'about', label: 'About Me', title: 'About Me.txt — Notepad', component: 'about' },
            { id: 'projects', label: 'My Projects', title: 'Projects — Explorer', component: 'projects' },
            { id: 'resume', label: 'My Resume', title: 'Resume.pdf — Viewer', component: 'resume' },
            { id: 'contact', label: 'Hire Me', title: 'Contact — New Message', component: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playClick();
                onOpenWindow(item.id, item.title, item.component);
                onClose();
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                padding: '6px 4px',
                cursor: 'pointer',
                fontSize: 11,
                textDecoration: 'underline',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {projectsHover && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            onMouseEnter={() => setProjectsHover(true)}
            onMouseLeave={() => setProjectsHover(false)}
            style={{
              position: 'absolute',
              left: 230,
              top: 100,
              width: 200,
              maxHeight: 260,
              overflow: 'auto',
              background: '#fff',
              border: '1px solid #808080',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.35)',
              padding: '2px 0',
              zIndex: 2,
            }}
          >
            {projectsData
              .filter((p) => p.featured)
              .map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    onOpenWindow('projects', 'Projects — Explorer', 'projects', { projectId: proj.id });
                    onClose();
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '5px 10px',
                    background: 'transparent',
                    border: 'none',
                    color: '#000',
                    cursor: 'pointer',
                    fontSize: 11,
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--os-highlight)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  {proj.title}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div
        style={{
          height: 36,
          background: 'linear-gradient(180deg, #3a7ae0 0%, #1a4fb5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          padding: '0 8px',
          borderTop: '1px solid #0831d9',
        }}
      >
        <FooterBtn
          label="Log Off"
          onClick={() => {
            onClose();
            window.localStorage.removeItem('farhan-has-booted');
            window.location.reload();
          }}
        />
        <FooterBtn
          label="Turn Off Computer"
          onClick={() => {
            onClose();
            const curtain = document.createElement('div');
            curtain.style.cssText = `
              position:fixed;inset:0;background:#000;z-index:99999;
              display:flex;align-items:center;justify-content:center;
              opacity:0;transition:opacity .8s;font-family:Tahoma,sans-serif;
              font-size:14px;color:#fff;
            `;
            curtain.textContent = 'Windows is shutting down…';
            document.body.appendChild(curtain);
            requestAnimationFrame(() => {
              curtain.style.opacity = '1';
            });
            setTimeout(() => {
              window.localStorage.removeItem('farhan-has-booted');
              window.location.reload();
            }, 1500);
          }}
        />
      </div>
    </motion.div>
  );
}

function FooterBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="os-button"
      style={{ fontSize: 11, color: '#000' }}
    >
      {label}
    </button>
  );
}

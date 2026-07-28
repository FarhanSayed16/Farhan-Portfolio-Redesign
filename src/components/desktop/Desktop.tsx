'use client';

import { useCallback, useRef, useEffect, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindows } from '@/context/WindowContext';
import { useOSAudio } from '@/lib/useOSAudio';
import Window from './Window';
import Taskbar from './Taskbar';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import ContextMenuComponent, { useContextMenu } from './ContextMenu';
import { XP_ICONS } from './XpIcons';
import ReadmeWindow from './windows/ReadmeWindow';
import AboutWindow from './windows/AboutWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import SkillsWindow from './windows/SkillsWindow';
import ExperienceWindow from './windows/ExperienceWindow';
import AchievementsWindow from './windows/AchievementsWindow';
import ResumeWindow from './windows/ResumeWindow';
import BrowserWindow from './windows/BrowserWindow';
import ContactWindow from './windows/ContactWindow';
import SystemInfoWindow from './windows/SystemInfoWindow';
import RecycleBinWindow from './windows/RecycleBinWindow';
import GameWindow from './windows/GameWindow';

interface DesktopIcon {
  id: string;
  label: string;
  windowTitle: string;
  component: string;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'recycle-bin', label: 'Recycle Bin', windowTitle: 'Recycle Bin', component: 'recycle-bin' },
  { id: 'about', label: 'About Me', windowTitle: 'About Me.txt — Notepad', component: 'about' },
  { id: 'projects', label: 'Projects', windowTitle: 'Projects — Explorer', component: 'projects' },
  { id: 'skills', label: 'Skills', windowTitle: 'Skills.exe', component: 'skills' },
  { id: 'experience', label: 'Experience', windowTitle: 'Experience — Timeline', component: 'experience' },
  { id: 'achievements', label: 'Achievements', windowTitle: 'Achievements — Explorer', component: 'achievements' },
  { id: 'resume', label: 'Resume.pdf', windowTitle: 'Resume.pdf — Viewer', component: 'resume' },
  { id: 'browser', label: 'Internet', windowTitle: 'Browser — farhanbuilds.in', component: 'browser' },
  { id: 'contact', label: 'Contact', windowTitle: 'Contact — New Message', component: 'contact' },
  { id: 'game', label: <><div style={{textAlign: 'center'}}>Super Mario Bros.<br/><span style={{fontSize: 9, opacity: 0.8}}>Farhan's Story</span></div></> as any, windowTitle: "Super Mario Bros. - Farhan's Story", component: 'game' },
  { id: 'system-info', label: 'My Computer', windowTitle: 'System Information', component: 'system-info' },
];

const WINDOW_COMPONENTS: Record<string, React.ComponentType<{ windowId?: string }>> = {
  readme: ReadmeWindow,
  about: AboutWindow,
  skills: SkillsWindow,
  experience: ExperienceWindow,
  achievements: AchievementsWindow,
  resume: ResumeWindow,
  browser: BrowserWindow,
  contact: ContactWindow,
  'system-info': SystemInfoWindow,
  'recycle-bin': RecycleBinWindow,
  game: GameWindow,
};

function WindowContent({
  component,
  payload,
  windowId,
}: {
  component: string;
  payload?: Record<string, unknown>;
  windowId?: string;
}) {
  if (component === 'projects') {
    return (
      <ProjectsWindow
        key={String(payload?.projectId ?? 'projects-default')}
        payload={payload}
      />
    );
  }

  const Component = WINDOW_COMPONENTS[component];
  if (!Component) {
    return (
      <div style={{ padding: '1.5rem', color: 'var(--text)', fontFamily: 'var(--font-os)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '0.5rem' }}>
          {component}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
          Window content not yet implemented.
        </div>
      </div>
    );
  }
  return <Component windowId={windowId} />;
}

export default function Desktop() {
  const { windows, dispatch } = useWindows();
  const desktopRef = useRef<HTMLDivElement>(null);
  const { menu, closeMenu } = useContextMenu(desktopRef);
  const readmeOpenedRef = useRef(false);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const toggleStart = useCallback(() => {
    setStartOpen((prev) => !prev);
  }, []);

  const openWindow = useCallback(
    (icon: DesktopIcon) => {
      dispatch({
        type: 'OPEN',
        id: icon.id,
        title: icon.windowTitle,
        component: icon.component,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (readmeOpenedRef.current) return;
    readmeOpenedRef.current = true;
    const shown = window.localStorage.getItem('farhan-readme-shown');
    if (!shown) {
      window.localStorage.setItem('farhan-readme-shown', 'true');
      dispatch({ type: 'OPEN', id: 'readme', title: 'README.txt — Notepad', component: 'readme' });
    }
  }, [dispatch]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          setStartOpen((prev) => !prev);
          break;
        case 'F2': {
          e.preventDefault();
          dispatch({ type: 'OPEN', id: 'game', title: "Super Mario Bros. - Farhan's Story", component: 'game' });
          break;
        }
        case 'Escape': {
          if (startOpen) {
            setStartOpen(false);
            return;
          }
          if (menu) {
            closeMenu();
            return;
          }
          const topWindow = windows
            .filter((w) => w.isOpen && !w.isMinimized)
            .sort((a, b) => b.zIndex - a.zIndex)[0];
          if (topWindow) dispatch({ type: 'CLOSE', id: topWindow.id });
          break;
        }
        case '?':
          dispatch({ type: 'OPEN', id: 'readme', title: 'README.txt — Notepad', component: 'readme' });
          break;
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [dispatch, windows, closeMenu, startOpen, menu]);

  const openWindows = windows.filter((w) => w.isOpen && !w.isMinimized);
  const taskbarH = 30;

  // Left column icons + README centered
  const leftIcons = DESKTOP_ICONS;
  const readmeIcon: DesktopIcon = {
    id: 'readme',
    label: 'README.txt',
    windowTitle: 'README.txt — Notepad',
    component: 'readme',
  };

  return (
    <div
      ref={desktopRef}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'var(--font-os)',
      }}
    >
      {/* Bliss wallpaper — no logo watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          bottom: taskbarH,
          backgroundColor: '#5b9bd5',
          backgroundImage: 'url(/wallpapers/bliss.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            right: 20,
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.55)',
            userSelect: 'none',
            letterSpacing: 0.3,
          }}
        >
          Farhan OS · farhanbuilds.in
        </div>
      </div>

      {/* Icon column (left) */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: '4px 18px',
          zIndex: 1,
          maxHeight: `calc(100vh - ${taskbarH}px)`,
          overflow: 'hidden',
        }}
        onClick={() => setSelectedIconId(null)}
      >
        {leftIcons.map((icon) => (
          <DesktopIconButton
            key={icon.id}
            icon={icon}
            isSelected={selectedIconId === icon.id}
            onSelect={() => setSelectedIconId(icon.id)}
            onOpen={() => openWindow(icon)}
            dragConstraints={desktopRef}
          />
        ))}

        {/* README center */}
        <DesktopIconButton
          icon={readmeIcon}
          isSelected={selectedIconId === 'readme'}
          onSelect={() => setSelectedIconId('readme')}
          onOpen={() => openWindow(readmeIcon)}
          dragConstraints={desktopRef}
          styleOverride={{
            position: 'absolute',
            left: 'calc(50% - 39px)',
            top: 'calc(38% - 39px)',
          }}
        />
      </div>

      <AnimatePresence>
        {openWindows.map((win) => (
          <Window key={win.id} window={win}>
            <ErrorBoundary>
              <WindowContent component={win.component} payload={win.payload} windowId={win.id} />
            </ErrorBoundary>
          </Window>
        ))}
      </AnimatePresence>

      <Taskbar startOpen={startOpen} onStartToggle={toggleStart} />

      <AnimatePresence>
        {menu && <ContextMenuComponent x={menu.x} y={menu.y} />}
      </AnimatePresence>
    </div>
  );
}

function DesktopIconButton({
  icon,
  isSelected,
  onSelect,
  onOpen,
  dragConstraints,
  styleOverride = {},
}: {
  icon: DesktopIcon;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  dragConstraints: React.RefObject<Element>;
  styleOverride?: React.CSSProperties;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { playClick } = useOSAudio();
  const Icon = XP_ICONS[icon.id] ?? XP_ICONS.readme;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints}
      onPointerDown={() => {
        playClick();
        // Just select without stopping propagation, allowing drag to initiate
        onSelect();
      }}
      onClick={(e) => {
        // Prevent click from bubbling to desktop and clearing selection
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      title={icon.label}
      aria-label={`Open ${icon.label}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 4,
        padding: '4px 2px',
        background: isSelected ? 'rgba(49, 106, 197, 0.45)' : (isHovered ? 'rgba(255, 255, 255, 0.15)' : 'transparent'),
        border: isSelected ? '1px dotted #fff' : (isHovered ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent'),
        cursor: 'default',
        width: 78,
        minHeight: 78,
        zIndex: isSelected ? 10 : 1,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitUserDrag: 'none',
        ...styleOverride,
      }}
    >
      <div style={{ pointerEvents: 'none' }}>
        <Icon size={48} />
      </div>
      <span
        style={{
          fontSize: 12,
          textAlign: 'center',
          lineHeight: 1.15,
          maxWidth: 74,
          color: '#fff',
          textShadow: '1px 1px 2px #000, 0px 1px 2px #000, 1px 0px 2px #000',
          wordBreak: 'break-word',
          fontFamily: 'Tahoma, sans-serif',
          pointerEvents: 'none',
        }}
      >
        {icon.label}
      </span>
    </motion.div>
  );
}

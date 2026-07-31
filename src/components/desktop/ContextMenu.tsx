'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '@/context/WindowContext';

const MENU_ITEMS = [
  { label: 'View', disabled: true },
  { label: 'Sort By', disabled: true },
  { label: 'Refresh', action: 'refresh' },
  { label: 'New', disabled: true },
  { divider: true },
  { label: 'About Farhan', action: 'about' },
  { label: 'Hire Farhan', action: 'contact', accent: true },
  { divider: true },
  { label: 'Properties', disabled: true },
];

type MenuItem =
  | { label: string; action?: string; disabled?: boolean; accent?: boolean }
  | { divider: true };

export function useContextMenu(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-window]') || target.closest('[data-taskbar]')) return;
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => setMenu(null);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(null);
    };

    el.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);

    return () => {
      el.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [containerRef]);

  return { menu, closeMenu: () => setMenu(null) };
}

export default function ContextMenu({ x, y }: { x: number; y: number }) {
  const { dispatch } = useWindows();

  const handleAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'refresh':
          // Desktop listens — blinks icons off then back on.
          window.dispatchEvent(new Event('farhan-desktop-refresh'));
          break;
        case 'about':
          dispatch({ type: 'OPEN', id: 'about', title: 'About Me.txt — Notepad', component: 'about' });
          break;
        case 'contact':
          dispatch({ type: 'OPEN', id: 'contact', title: 'Contact — New Message', component: 'contact' });
          break;
      }
    },
    [dispatch]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.08 }}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        minWidth: 160,
        background: '#fff',
        borderTop: '1px solid #fff',
        borderLeft: '1px solid #fff',
        borderRight: '1px solid #404040',
        borderBottom: '1px solid #404040',
        boxShadow: '2px 2px 4px rgba(0,0,0,0.35)',
        padding: '2px 0',
        zIndex: 9800,
        fontFamily: 'var(--font-os)',
      }}
    >
      {(MENU_ITEMS as MenuItem[]).map((item, i) => {
        if ('divider' in item) {
          return (
            <div key={i} style={{ height: 1, background: '#d0d0d0', margin: '3px 4px' }} />
          );
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => item.action && handleAction(item.action)}
            disabled={item.disabled}
            style={{
              display: 'block',
              width: '100%',
              padding: '4px 18px',
              background: 'transparent',
              border: 'none',
              color: item.disabled ? '#808080' : item.accent ? '#000080' : '#000',
              cursor: item.disabled ? 'default' : 'pointer',
              fontSize: 12,
              textAlign: 'left',
              fontWeight: item.accent ? 700 : 400,
            }}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.background = 'var(--os-highlight)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = item.disabled
                ? '#808080'
                : item.accent
                  ? '#000080'
                  : '#000';
            }}
          >
            {item.label}
          </button>
        );
      })}
    </motion.div>
  );
}

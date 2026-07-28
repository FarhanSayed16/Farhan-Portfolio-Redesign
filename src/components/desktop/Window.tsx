'use client';

import { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useWindows, type WindowState } from '@/context/WindowContext';
import { XP_ICONS } from './XpIcons';

interface WindowProps {
  window: WindowState;
  children: ReactNode;
  minWidth?: number;
  minHeight?: number;
}

const TASKBAR_HEIGHT = 30;

export default function Window({ window: win, children, minWidth = 280, minHeight = 200 }: WindowProps) {
  const { windows, dispatch } = useWindows();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, winX: 0, winY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, posX: 0, posY: 0 });

  const isActive =
    windows
      .filter((w) => w.isOpen && !w.isMinimized)
      .reduce((top, w) => (w.zIndex > top.zIndex ? w : top), win).id === win.id;

  const onDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      dispatch({ type: 'FOCUS', id: win.id });
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragStart.current = { x: clientX, y: clientY, winX: win.position.x, winY: win.position.y };
      setIsDragging(true);
    },
    [dispatch, win.id, win.position]
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;
      let newX = dragStart.current.winX + dx;
      let newY = dragStart.current.winY + dy;

      newX = Math.max(-win.size.width + 100, Math.min(newX, window.innerWidth - 100));
      newY = Math.max(0, Math.min(newY, window.innerHeight - TASKBAR_HEIGHT - 30));

      dispatch({ type: 'MOVE', id: win.id, position: { x: newX, y: newY } });
    };

    const onUp = () => setIsDragging(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, [isDragging, dispatch, win.id, win.size.width]);

  type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  const resizeDir = useRef<ResizeDir>('se');

  const onResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, dir: ResizeDir) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({ type: 'FOCUS', id: win.id });
      resizeDir.current = dir;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      resizeStart.current = {
        x: clientX,
        y: clientY,
        w: win.size.width,
        h: win.size.height,
        posX: win.position.x,
        posY: win.position.y,
      };
      setIsResizing(true);
    },
    [dispatch, win.id, win.size, win.position]
  );

  useEffect(() => {
    if (!isResizing) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - resizeStart.current.x;
      const dy = clientY - resizeStart.current.y;
      const dir = resizeDir.current;

      let newW = resizeStart.current.w;
      let newH = resizeStart.current.h;
      let newX = resizeStart.current.posX;
      let newY = resizeStart.current.posY;

      if (dir.includes('e')) newW = Math.max(minWidth, resizeStart.current.w + dx);
      if (dir.includes('s')) newH = Math.max(minHeight, resizeStart.current.h + dy);
      if (dir.includes('w')) {
        newW = Math.max(minWidth, resizeStart.current.w - dx);
        newX = resizeStart.current.posX + (resizeStart.current.w - newW);
      }
      if (dir.includes('n')) {
        newH = Math.max(minHeight, resizeStart.current.h - dy);
        newY = resizeStart.current.posY + (resizeStart.current.h - newH);
      }

      dispatch({ type: 'RESIZE', id: win.id, size: { width: newW, height: newH } });
      if (dir.includes('w') || dir.includes('n')) {
        dispatch({ type: 'MOVE', id: win.id, position: { x: newX, y: newY } });
      }
    };

    const onUp = () => setIsResizing(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, [isResizing, dispatch, win.id, minWidth, minHeight]);

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        top: win.position.y,
        left: win.position.x,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      };

  const Icon = XP_ICONS[win.component] ?? XP_ICONS.readme;

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.12 }}
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--os-window)',
        border: '3px solid',
        borderColor: isActive ? '#0831d9' : '#758cc5',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        boxShadow: isActive ? '2px 4px 12px rgba(0,0,0,0.45)' : '1px 2px 6px rgba(0,0,0,0.3)',
        userSelect: isDragging || isResizing ? 'none' : 'auto',
        fontFamily: 'var(--font-os)',
      }}
      data-window
      onMouseDown={() => dispatch({ type: 'FOCUS', id: win.id })}
    >
      {/* Title bar */}
      <div
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onDoubleClick={() =>
          dispatch({ type: win.isMaximized ? 'RESTORE' : 'MAXIMIZE', id: win.id })
        }
        style={{
          height: 26,
          padding: '0 3px 0 4px',
          background: isActive
            ? 'linear-gradient(180deg, #0a246a 0%, #3a6ea5 8%, #a6caf0 100%)'
            : 'linear-gradient(180deg, #758cc5 0%, #9db2e0 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'default',
          flexShrink: 0,
          gap: 4,
          borderRadius: '5px 5px 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0, flex: 1 }}>
          <Icon size={16} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              textShadow: '1px 1px 0 rgba(0,0,0,0.4)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {win.title}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <CaptionBtn
            title="Minimize"
            onClick={() => dispatch({ type: 'MINIMIZE', id: win.id })}
            bg="#3c81f3"
          >
            _
          </CaptionBtn>
          <CaptionBtn
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            onClick={() =>
              dispatch({ type: win.isMaximized ? 'RESTORE' : 'MAXIMIZE', id: win.id })
            }
            bg="#3c81f3"
          >
            {win.isMaximized ? '❐' : '□'}
          </CaptionBtn>
          <CaptionBtn
            title="Close"
            onClick={() => dispatch({ type: 'CLOSE', id: win.id })}
            bg="#e81123"
            close
          >
            ✕
          </CaptionBtn>
        </div>
      </div>

      {/* Client area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--os-window-body)',
          borderTop: '1px solid #0831d9',
          margin: '0 3px 3px',
          color: 'var(--text)',
        }}
      >
        {children}
      </div>

      {!win.isMaximized && (
        <>
          <div onMouseDown={(e) => onResizeStart(e, 'n')} onTouchStart={(e) => onResizeStart(e, 'n')} style={{ position: 'absolute', top: -3, left: 6, right: 6, height: 6, cursor: 'ns-resize' }} />
          <div onMouseDown={(e) => onResizeStart(e, 's')} onTouchStart={(e) => onResizeStart(e, 's')} style={{ position: 'absolute', bottom: -3, left: 6, right: 6, height: 6, cursor: 'ns-resize' }} />
          <div onMouseDown={(e) => onResizeStart(e, 'w')} onTouchStart={(e) => onResizeStart(e, 'w')} style={{ position: 'absolute', left: -3, top: 6, bottom: 6, width: 6, cursor: 'ew-resize' }} />
          <div onMouseDown={(e) => onResizeStart(e, 'e')} onTouchStart={(e) => onResizeStart(e, 'e')} style={{ position: 'absolute', right: -3, top: 6, bottom: 6, width: 6, cursor: 'ew-resize' }} />
          <div onMouseDown={(e) => onResizeStart(e, 'nw')} onTouchStart={(e) => onResizeStart(e, 'nw')} style={{ position: 'absolute', top: -3, left: -3, width: 15, height: 15, cursor: 'nwse-resize', zIndex: 10 }} />
          <div onMouseDown={(e) => onResizeStart(e, 'ne')} onTouchStart={(e) => onResizeStart(e, 'ne')} style={{ position: 'absolute', top: -3, right: -3, width: 15, height: 15, cursor: 'nesw-resize', zIndex: 10 }} />
          <div onMouseDown={(e) => onResizeStart(e, 'sw')} onTouchStart={(e) => onResizeStart(e, 'sw')} style={{ position: 'absolute', bottom: -3, left: -3, width: 15, height: 15, cursor: 'nesw-resize', zIndex: 10 }} />
          <div onMouseDown={(e) => onResizeStart(e, 'se')} onTouchStart={(e) => onResizeStart(e, 'se')} style={{ position: 'absolute', bottom: -3, right: -3, width: 15, height: 15, cursor: 'nwse-resize', zIndex: 10 }} />
        </>
      )}
    </motion.div>
  );
}

function CaptionBtn({
  children,
  onClick,
  title,
  bg,
  close,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
  bg: string;
  close?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        width: 21,
        height: 21,
        padding: 0,
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.7)',
        background: `linear-gradient(180deg, ${close ? '#ff7b82' : '#7eb1f8'} 0%, ${bg} 100%)`,
        color: '#fff',
        fontSize: close ? 12 : 14,
        fontWeight: 700,
        lineHeight: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textShadow: '0 1px 0 rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </button>
  );
}

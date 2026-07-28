'use client';

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';

// ── TYPES ─────────────────────────────────────────────────────

export interface WindowState {
  id: string;
  title: string;
  component: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  payload?: Record<string, unknown>;
}

export type WindowAction =
  | { type: 'OPEN'; id: string; title: string; component: string; size?: { width: number; height: number }; payload?: Record<string, unknown> }
  | { type: 'CLOSE'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MAXIMIZE'; id: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MOVE'; id: string; position: { x: number; y: number } }
  | { type: 'RESIZE'; id: string; size: { width: number; height: number } };

interface WindowContextValue {
  windows: WindowState[];
  dispatch: Dispatch<WindowAction>;
}

// ── DEFAULT WINDOW SIZES ──────────────────────────────────────

const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  projects: { width: 750, height: 500 },
  about: { width: 500, height: 400 },
  readme: { width: 520, height: 420 },
  'system-info': { width: 420, height: 350 },
  'recycle-bin': { width: 400, height: 320 },
  skills: { width: 600, height: 450 },
  experience: { width: 550, height: 450 },
  achievements: { width: 600, height: 450 },
  certifications: { width: 620, height: 500 },
  resume: { width: 600, height: 700 },
  browser: { width: 800, height: 550 },
  contact: { width: 550, height: 450 },
  game: { width: 800, height: 540 },
};

// ── REDUCER ───────────────────────────────────────────────────

let nextZ = 10;

function getNewPosition(windows: WindowState[]): { x: number; y: number } {
  const openCount = windows.filter(w => w.isOpen && !w.isMinimized).length;
  const offset = (openCount % 8) * 30;
  return { x: 80 + offset, y: 40 + offset };
}

function windowReducer(state: WindowState[], action: WindowAction): WindowState[] {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.find(w => w.id === action.id);
      if (existing) {
        // Already exists — bring to front and unminimize
        return state.map(w =>
          w.id === action.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: ++nextZ, payload: action.payload ?? w.payload }
            : w
        );
      }
      // New window
      const defaultSize = action.size || DEFAULT_SIZES[action.component] || { width: 500, height: 400 };
      const position = getNewPosition(state);
      return [
        ...state,
        {
          id: action.id,
          title: action.title,
          component: action.component,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          position,
          size: defaultSize,
          zIndex: ++nextZ,
          payload: action.payload,
        },
      ];
    }

    case 'CLOSE':
      return state.map(w =>
        w.id === action.id ? { ...w, isOpen: false, isMinimized: false, isMaximized: false } : w
      );

    case 'MINIMIZE':
      return state.map(w =>
        w.id === action.id ? { ...w, isMinimized: true } : w
      );

    case 'MAXIMIZE':
      return state.map(w =>
        w.id === action.id ? { ...w, isMaximized: true, zIndex: ++nextZ } : w
      );

    case 'RESTORE':
      return state.map(w =>
        w.id === action.id ? { ...w, isMaximized: false, isMinimized: false, zIndex: ++nextZ } : w
      );

    case 'FOCUS': {
      const target = state.find((w) => w.id === action.id);
      if (!target || !target.isOpen || target.isMinimized) return state;
      const topZ = Math.max(0, ...state.filter((w) => w.isOpen && !w.isMinimized).map((w) => w.zIndex));
      if (target.zIndex === topZ) return state; // already focused — skip re-render (keeps Phaser alive)
      return state.map((w) => (w.id === action.id ? { ...w, zIndex: ++nextZ } : w));
    }

    case 'MOVE':
      return state.map(w =>
        w.id === action.id ? { ...w, position: action.position } : w
      );

    case 'RESIZE':
      return state.map(w =>
        w.id === action.id ? { ...w, size: action.size } : w
      );

    default:
      return state;
  }
}

// ── CONTEXT ───────────────────────────────────────────────────

const WindowContext = createContext<WindowContextValue | null>(null);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, dispatch] = useReducer(windowReducer, []);

  return (
    <WindowContext.Provider value={{ windows, dispatch }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error('useWindows must be used inside WindowProvider');
  return ctx;
}

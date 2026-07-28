'use client';

import { createContext, useContext, useReducer, useCallback, type ReactNode, type Dispatch } from 'react';

// ── TYPES ─────────────────────────────────────────────────────

export type PhoneScreen =
  | 'boot'
  | 'menu'
  | 'profile'
  | 'projects'
  | 'project-detail'
  | 'skills'
  | 'achievements'
  | 'contact'
  | 'game-launcher';

export interface PhoneState {
  currentScreen: PhoneScreen;
  screenHistory: PhoneScreen[];
  selectedIndex: number;
  payload?: Record<string, unknown>;
}

export type PhoneAction =
  | { type: 'NAVIGATE'; screen: PhoneScreen; payload?: Record<string, unknown> }
  | { type: 'BACK' }
  | { type: 'MOVE_CURSOR'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'SET_CURSOR'; index: number }
  | { type: 'SET_PAYLOAD'; payload: Record<string, unknown> }
  | { type: 'SELECT' };

interface PhoneContextValue {
  state: PhoneState;
  dispatch: Dispatch<PhoneAction>;
  navigate: (screen: PhoneScreen, payload?: Record<string, unknown>) => void;
  goBack: () => void;
}

// ── REDUCER ───────────────────────────────────────────────────

const initialState: PhoneState = {
  currentScreen: 'boot',
  screenHistory: [],
  selectedIndex: 0,
};

function phoneReducer(state: PhoneState, action: PhoneAction): PhoneState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        // Don't push boot onto history — Back from menu shouldn't return to boot
        screenHistory:
          state.currentScreen === 'boot'
            ? []
            : [...state.screenHistory, state.currentScreen],
        currentScreen: action.screen,
        selectedIndex: 0,
        payload: action.payload,
      };

    case 'BACK': {
      if (state.screenHistory.length === 0) return state;
      const prev = state.screenHistory[state.screenHistory.length - 1];
      // Keep list filters when returning from project detail
      const payload =
        prev === 'projects'
          ? {
              showArchived: state.payload?.showArchived,
              showAllSkills: state.payload?.showAllSkills,
            }
          : undefined;
      return {
        ...state,
        screenHistory: state.screenHistory.slice(0, -1),
        currentScreen: prev,
        selectedIndex: 0,
        payload,
      };
    }

    case 'MOVE_CURSOR': {
      const delta = action.direction === 'up' || action.direction === 'left' ? -1 : 1;
      return {
        ...state,
        // Upper bound enforced per-screen in UI; never go below 0
        selectedIndex: Math.max(0, state.selectedIndex + delta),
      };
    }

    case 'SET_CURSOR':
      return { ...state, selectedIndex: action.index };

    case 'SET_PAYLOAD':
      return { ...state, payload: { ...state.payload, ...action.payload } };

    case 'SELECT':
      return state;

    default:
      return state;
  }
}

// ── CONTEXT ───────────────────────────────────────────────────

const PhoneContext = createContext<PhoneContextValue | null>(null);

export function PhoneProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(phoneReducer, initialState);

  const navigate = useCallback(
    (screen: PhoneScreen, payload?: Record<string, unknown>) => {
      dispatch({ type: 'NAVIGATE', screen, payload });
    },
    []
  );

  const goBack = useCallback(() => {
    dispatch({ type: 'BACK' });
  }, []);

  return (
    <PhoneContext.Provider value={{ state, dispatch, navigate, goBack }}>
      {children}
    </PhoneContext.Provider>
  );
}

export function usePhone() {
  const ctx = useContext(PhoneContext);
  if (!ctx) throw new Error('usePhone must be used inside PhoneProvider');
  return ctx;
}

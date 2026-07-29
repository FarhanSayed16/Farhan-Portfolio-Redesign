'use client';

import { usePhone, type PhoneScreen } from '@/context/PhoneContext';
import { projectsData } from '@/lib/content';
import { notifyMuteChanged } from '@/lib/SFXSynth';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { emitGamePad } from './MobileControls';
import PhoneScreenComponent, {
  MENU_ITEMS,
  getSoftKeyLabels,
  openContactSelection,
} from './PhoneScreen';
import { selectGameLauncherAction } from './PhoneGame';
import './phoneFrame.css';

const PAD_KEYS: { key: string; sub?: string }[] = [
  { key: '1' },
  { key: '2', sub: 'abc' },
  { key: '3', sub: 'def' },
  { key: '4', sub: 'ghi' },
  { key: '5', sub: 'jkl' },
  { key: '6', sub: 'mno' },
  { key: '7', sub: 'pqrs' },
  { key: '8', sub: 'tuv' },
  { key: '9', sub: 'wxyz' },
  { key: '*' },
  { key: '0', sub: '+' },
  { key: '#' },
];

const DIGIT_MENU: Record<number, PhoneScreen> = {
  1: 'profile',
  2: 'achievements',
  3: 'projects',
  4: 'skills',
  5: 'experience',
  6: 'contact',
  7: 'farhan-os',
  8: 'reset',
  0: 'game-launcher',
};

const GAME_DIR: Record<string, string> = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

/**
 * Nokia 3310–inspired handset: industrial body, LCD well, soft keys, nav, keypad.
 */
export default function PhoneFrame() {
  const { state, dispatch, navigate, goBack } = usePhone();
  const soft = getSoftKeyLabels(state.currentScreen, state.payload);
  const playing = state.currentScreen === 'game-play';

  const runReset = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('farhan-device-preference');
    window.localStorage.removeItem('farhan-has-booted');
    window.location.reload();
  };

  const handleBack = () => {
    if (state.currentScreen === 'boot' || state.currentScreen === 'menu') return;
    if (state.currentScreen === 'game-launcher' && state.payload?.gameHowTo) {
      dispatch({ type: 'SET_PAYLOAD', payload: { gameHowTo: false } });
      return;
    }
    goBack();
  };

  const handleKey = (key: string) => {
    if (playing) {
      if (key === 'back') {
        handleBack();
        return;
      }
      if (key === 'select') {
        emitGamePad('up', 'down');
        window.setTimeout(() => emitGamePad('up', 'up'), 120);
        return;
      }
      // Directional hold is handled via pointer handlers on the D-pad
      return;
    }

    switch (key) {
      case 'up':
        dispatch({ type: 'MOVE_CURSOR', direction: 'up' });
        break;
      case 'down':
        dispatch({ type: 'MOVE_CURSOR', direction: 'down' });
        break;
      case 'left':
        dispatch({ type: 'MOVE_CURSOR', direction: 'left' });
        break;
      case 'right':
        dispatch({ type: 'MOVE_CURSOR', direction: 'right' });
        break;
      case 'select':
        handleSelect();
        break;
      case 'back':
        handleBack();
        break;
      case 'options':
        if (state.currentScreen === 'boot') {
          navigate('menu');
        } else if (state.currentScreen === 'menu') {
          handleSelect();
        } else if (state.currentScreen === 'contact') {
          openContactSelection(state.selectedIndex);
        } else if (state.currentScreen === 'game-launcher') {
          if (!state.payload?.gameHowTo) navigate('game-play');
        } else if (
          state.currentScreen === 'projects' ||
          state.currentScreen === 'achievements' ||
          state.currentScreen === 'experience'
        ) {
          handleSelect();
        }
        break;
      case '*': {
        let muted = false;
        try {
          muted = JSON.parse(localStorage.getItem('farhan-muted') || 'false') === true;
        } catch {
          muted = false;
        }
        localStorage.setItem('farhan-muted', JSON.stringify(!muted));
        notifyMuteChanged();
        dispatch({
          type: 'SET_PAYLOAD',
          payload: { muted: !muted, toast: muted ? 'SOUND ON' : 'MUTED' },
        });
        break;
      }
      case '#':
        if (state.currentScreen === 'skills') {
          dispatch({
            type: 'SET_PAYLOAD',
            payload: { showAllSkills: !state.payload?.showAllSkills },
          });
        } else if (state.currentScreen === 'projects') {
          dispatch({
            type: 'SET_PAYLOAD',
            payload: { showArchived: !state.payload?.showArchived },
          });
        }
        break;
      default: {
        const num = parseInt(key, 10);
        if (!isNaN(num) && state.currentScreen === 'menu') {
          const screen = DIGIT_MENU[num];
          if (screen === 'reset') {
            runReset();
          } else if (screen) {
            navigate(screen);
          }
        } else if (!isNaN(num) && state.currentScreen === 'game-launcher' && !state.payload?.gameHowTo) {
          if (num === 1) navigate('game-play');
          if (num === 2) dispatch({ type: 'SET_PAYLOAD', payload: { gameHowTo: true } });
        }
        break;
      }
    }
  };

  const handleSelect = () => {
    switch (state.currentScreen) {
      case 'boot':
        navigate('menu');
        break;
      case 'menu': {
        const item = MENU_ITEMS[Math.min(state.selectedIndex, MENU_ITEMS.length - 1)];
        if (!item) break;
        if (item.key === 'reset') {
          runReset();
        } else {
          navigate(item.key);
        }
        break;
      }
      case 'projects': {
        const list = state.payload?.showArchived
          ? projectsData
          : projectsData.filter((p) => p.featured);
        const proj = list[Math.min(state.selectedIndex, Math.max(list.length - 1, 0))];
        if (proj) {
          navigate('project-detail', {
            projectId: proj.id,
            showArchived: state.payload?.showArchived,
          });
        }
        break;
      }
      case 'contact':
        openContactSelection(state.selectedIndex);
        break;
      case 'game-launcher': {
        const action = selectGameLauncherAction(state.selectedIndex, state.payload);
        if (action === 'start') navigate('game-play');
        else if (action === 'how') dispatch({ type: 'SET_PAYLOAD', payload: { gameHowTo: true } });
        else if (action === 'close-how')
          dispatch({ type: 'SET_PAYLOAD', payload: { gameHowTo: false } });
        break;
      }
      default:
        break;
    }
  };

  const gamePadBind = (dir: string) => {
    const key = GAME_DIR[dir] ?? dir;
    return {
      onPointerDown: (e: ReactPointerEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        emitGamePad(key, 'down');
      },
      onPointerUp: (e: ReactPointerEvent) => {
        e.preventDefault();
        emitGamePad(key, 'up');
      },
      onPointerCancel: () => emitGamePad(key, 'up'),
    };
  };

  return (
    <div
      className={`nokia-device${playing ? ' nokia-device--playing' : ''}`}
      aria-label="Farhan OS Nokia handset"
    >
      <div className="nokia-earpiece">
        <div className="nokia-grille" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <p className="nokia-brand-top">Farhan OS</p>
      </div>

      <div className="nokia-bezel">
        <div className="nokia-lcd nokia-glow">
          <div className="nokia-lcd-inner">
            <PhoneScreenComponent />
          </div>
        </div>
      </div>

      <div className="nokia-softrow">
        <button
          type="button"
          className="nokia-soft"
          onClick={() => handleKey('options')}
          disabled={soft.left === '—'}
          aria-label={soft.left}
        >
          {soft.left}
        </button>
        <button
          type="button"
          className="nokia-soft"
          onClick={() => handleKey('back')}
          disabled={soft.right === '—'}
          aria-label={soft.right}
        >
          {soft.right}
        </button>
      </div>

      <div className="nokia-nav" role="group" aria-label="Navigation">
        <button
          type="button"
          className="nokia-dpad nokia-dpad--up"
          onClick={playing ? undefined : () => handleKey('up')}
          {...(playing ? gamePadBind('up') : {})}
          aria-label="Up"
        >
          ▲
        </button>
        <button
          type="button"
          className="nokia-dpad nokia-dpad--down"
          onClick={playing ? undefined : () => handleKey('down')}
          {...(playing ? gamePadBind('down') : {})}
          aria-label="Down"
        >
          ▼
        </button>
        <button
          type="button"
          className="nokia-dpad nokia-dpad--left"
          onClick={playing ? undefined : () => handleKey('left')}
          {...(playing ? gamePadBind('left') : {})}
          aria-label="Left"
        >
          ◄
        </button>
        <button
          type="button"
          className="nokia-dpad nokia-dpad--right"
          onClick={playing ? undefined : () => handleKey('right')}
          {...(playing ? gamePadBind('right') : {})}
          aria-label="Right"
        >
          ►
        </button>
        <button
          type="button"
          className="nokia-ok"
          onClick={() => handleKey('select')}
          {...(playing
            ? {
                onPointerDown: (e: ReactPointerEvent) => {
                  e.preventDefault();
                  emitGamePad('up', 'down');
                },
                onPointerUp: (e: ReactPointerEvent) => {
                  e.preventDefault();
                  emitGamePad('up', 'up');
                },
                onPointerCancel: () => emitGamePad('up', 'up'),
              }
            : {})}
          aria-label={playing ? 'Jump' : 'Select'}
        >
          OK
        </button>
      </div>

      <div className="nokia-pad" role="group" aria-label="Keypad">
        {PAD_KEYS.map(({ key, sub }) => (
          <button
            type="button"
            key={key}
            className="nokia-key"
            onClick={() => handleKey(key)}
            disabled={playing}
            aria-label={sub ? `${key} ${sub}` : key}
          >
            <span>{key}</span>
            {sub ? <small>{sub}</small> : null}
          </button>
        ))}
      </div>

      <p className="nokia-stamp">NOKIA</p>
    </div>
  );
}

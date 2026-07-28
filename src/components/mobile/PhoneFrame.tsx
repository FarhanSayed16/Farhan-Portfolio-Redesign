'use client';

import { usePhone, type PhoneScreen } from '@/context/PhoneContext';
import { projectsData, getMailtoHref } from '@/lib/content';
import { notifyMuteChanged } from '@/lib/SFXSynth';
import PhoneScreenComponent from './PhoneScreen';

/**
 * Nokia 3310-inspired phone frame with CSS body, screen, and keypad.
 */
export default function PhoneFrame() {
  const { state, dispatch, navigate, goBack } = usePhone();

  const MENU_SCREENS = ['profile', 'projects', 'skills', 'achievements', 'contact', 'game-launcher', 'reset'] as const;

  const handleKey = (key: string) => {
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
        goBack();
        break;
      case 'options':
        if (state.currentScreen === 'boot') {
          navigate('menu');
        } else if (state.currentScreen === 'contact') {
          window.open(getMailtoHref(), '_blank');
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
        dispatch({ type: 'SET_PAYLOAD', payload: { muted: !muted, toast: muted ? 'SOUND ON' : 'MUTED' } });
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
        if (!isNaN(num) && num >= 0 && num <= 9 && state.currentScreen === 'menu') {
          const menuMap: Record<number, PhoneScreen> = {
            1: 'profile',
            2: 'projects',
            3: 'skills',
            4: 'achievements',
            5: 'contact',
            0: 'game-launcher',
          };
          const screen = menuMap[num];
          if (screen) navigate(screen);
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
        const item = MENU_SCREENS[Math.min(state.selectedIndex, MENU_SCREENS.length - 1)];
        if (item === 'reset') {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('farhan-device-preference');
            window.localStorage.removeItem('farhan-has-booted');
            window.location.reload();
          }
        } else if (item) {
          navigate(item); // item excludes 'reset' after guard
        }
        break;
      }
      case 'projects': {
        const list = state.payload?.showArchived
          ? projectsData
          : projectsData.filter(p => p.featured);
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
        window.open(getMailtoHref(), '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <div
      style={{
        width: 'min(300px, calc(100vw - 2rem))',
        background: 'var(--nokia-body)',
        borderRadius: '28px 28px 36px 36px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', gap: '3px', padding: '4px 0' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      <div
        className="font-pixel"
        style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.25)', letterSpacing: '3px' }}
      >
        FARHAN OS
      </div>

      <div
        className="scanlines nokia-glow"
        style={{
          width: '100%',
          height: 220,
          background: 'var(--nokia-screen)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <PhoneScreenComponent />
      </div>

      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 12px' }}>
        <PhoneButton label="Options" onClick={() => handleKey('options')} />
        <PhoneButton label="Back" onClick={() => handleKey('back')} />
      </div>

      <div
        style={{
          position: 'relative',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '4px 0',
        }}
      >
        <button onClick={() => handleKey('up')} style={{ ...dpadStyle, top: 2, left: '50%', transform: 'translateX(-50%)' }} aria-label="Up">▲</button>
        <button onClick={() => handleKey('down')} style={{ ...dpadStyle, bottom: 2, left: '50%', transform: 'translateX(-50%)' }} aria-label="Down">▼</button>
        <button onClick={() => handleKey('left')} style={{ ...dpadStyle, left: 2, top: '50%', transform: 'translateY(-50%)' }} aria-label="Left">◄</button>
        <button onClick={() => handleKey('right')} style={{ ...dpadStyle, right: 2, top: '50%', transform: 'translateY(-50%)' }} aria-label="Right">►</button>
        <button
          onClick={() => handleKey('select')}
          style={{
            position: 'absolute',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(67, 217, 124, 0.15)',
            border: '1px solid rgba(67, 217, 124, 0.3)',
            color: 'var(--nokia-green)',
            fontSize: '8px',
            fontFamily: 'var(--font-pixel)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Select"
        >
          OK
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          width: '100%',
          padding: '0 20px',
        }}
      >
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            style={{
              height: 32,
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.1s',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div
        style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.12)',
          letterSpacing: '2px',
          padding: '4px 0',
          fontWeight: 700,
        }}
      >
        NOKIA
      </div>
    </div>
  );
}

function PhoneButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        background: 'transparent',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '10px',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        transition: 'color 0.15s',
      }}
    >
      {label}
    </button>
  );
}

const dpadStyle: React.CSSProperties = {
  position: 'absolute',
  width: 26,
  height: 26,
  background: 'transparent',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  padding: 0,
};

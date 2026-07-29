'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { DeviceMode } from '@/hooks/useDeviceMode';
import { XpStartLogo } from '@/components/desktop/XpIcons';

interface TabletChoiceProps {
  onChoose: (mode: 'desktop' | 'mobile') => void;
}

/**
 * One-time choice for tablet users: Farhan OS (desktop) or modern portfolio site.
 * Nokia phone is an easter egg inside the portfolio (Try Nokia / ?view=nokia).
 */
export default function TabletChoice({ onChoose }: TabletChoiceProps) {
  const [, setPreference] = useLocalStorage<DeviceMode | null>('farhan-device-preference', null);

  const handleChoice = (mode: 'desktop' | 'mobile') => {
    setPreference(mode);
    onChoose(mode);
  };

  return (
    <div
      data-theme="xp"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1.5rem',
        padding: '2rem',
        background: 'linear-gradient(180deg, #245edc 0%, #5b9bd5 100%)',
        fontFamily: 'var(--font-os)',
      }}
    >
      <div
        style={{
          background: '#ece9d8',
          border: '2px solid #0831d9',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
          padding: '24px 32px',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <XpStartLogo size={36} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Farhan&apos;s World</div>
        <div style={{ fontSize: 12, color: '#404040', marginBottom: 20 }}>
          Choose your experience. You can change this later from the Start menu.
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => handleChoice('desktop')}
            className="os-button"
            style={{
              width: 160,
              height: 100,
              flexDirection: 'column',
              gap: 8,
              fontSize: 12,
            }}
          >
            <XpStartLogo size={28} />
            Farhan OS
            <span style={{ fontSize: 10, color: '#404040', fontWeight: 400 }}>Windows XP · Time Machine</span>
          </button>
          <button
            type="button"
            onClick={() => handleChoice('mobile')}
            style={{
              width: 160,
              height: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 12,
              background: '#0a0a0a',
              border: '1px solid #ef4444',
              borderRadius: 8,
              color: '#f1f5f9',
              fontFamily: 'var(--font-outfit), sans-serif',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
              padding: '12px',
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-body), sans-serif', color: '#ef4444' }}>Aa</span>
            Portfolio site
            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>Modern · Nokia easter egg</span>
          </button>
        </div>
      </div>
    </div>
  );
}

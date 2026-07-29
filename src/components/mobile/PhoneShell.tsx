'use client';

import { useRouter } from 'next/navigation';
import { PhoneProvider, usePhone } from '@/context/PhoneContext';
import PhoneFrame from './PhoneFrame';
import OsLiteShell from './OsLiteShell';
import './phoneFrame.css';

/**
 * Nokia handset shell — optional easter egg from modern mobile portfolio.
 * Default phone door is ModernPortfolioShell (no Time Machine).
 */
export default function PhoneShell({ easterEgg = false }: { easterEgg?: boolean }) {
  return (
    <PhoneProvider>
      <PhoneShellBody easterEgg={easterEgg} />
    </PhoneProvider>
  );
}

function PhoneShellBody({ easterEgg }: { easterEgg: boolean }) {
  const { state } = usePhone();
  const router = useRouter();

  if (state.currentScreen === 'farhan-os') {
    return (
      <>
        {easterEgg && <NokiaEggExit onExit={() => router.push('/')} />}
        <OsLiteShell />
      </>
    );
  }

  return (
    <div data-theme="nokia" className="nokia-shell">
      {easterEgg && <NokiaEggExit onExit={() => router.push('/')} />}
      <div className="nokia-stage">
        <PhoneFrame />
      </div>
    </div>
  );
}

function NokiaEggExit({ onExit }: { onExit: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 'max(8px, env(safe-area-inset-top))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}
    >
      <button
        type="button"
        onClick={onExit}
        style={{
          minHeight: 40,
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid rgba(239, 68, 68, 0.45)',
          background: 'rgba(18, 18, 18, 0.92)',
          color: '#f87171',
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
      >
        ← Portfolio site
      </button>
    </div>
  );
}

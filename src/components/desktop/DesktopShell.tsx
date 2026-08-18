'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BootScreen from './BootScreen';
import Desktop from './Desktop';
import { WindowProvider } from '@/context/WindowContext';

/**
 * Top-level desktop shell: Boot → Desktop OS (Windows XP Luna theme).
 * mobileExit: phone/QR preview of the same OS — chip back to the modern site.
 */
export default function DesktopShell({ mobileExit = false }: { mobileExit?: boolean }) {
  const [hasBooted, setHasBooted] = useState(false);
  const handleBootComplete = useCallback(() => {
    setHasBooted(true);
  }, []);

  return (
    <div data-theme="xp" style={{ height: '100%', width: '100%' }}>
      {mobileExit && <DesktopMobileExit />}
      <WindowProvider>
        {!hasBooted && <BootScreen onComplete={handleBootComplete} />}
        {hasBooted && <Desktop />}
      </WindowProvider>
    </div>
  );
}

function DesktopMobileExit() {
  const router = useRouter();
  return (
    <div
      style={{
        position: 'fixed',
        top: 'max(8px, env(safe-area-inset-top))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
      }}
    >
      <button
        type="button"
        onClick={() => router.push('/')}
        style={{
          minHeight: 40,
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid rgba(8, 49, 217, 0.55)',
          background: 'rgba(236, 233, 216, 0.95)',
          color: '#0a246a',
          fontFamily: 'Tahoma, sans-serif',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          touchAction: 'manipulation',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.25)',
        }}
      >
        ← Portfolio site
      </button>
    </div>
  );
}

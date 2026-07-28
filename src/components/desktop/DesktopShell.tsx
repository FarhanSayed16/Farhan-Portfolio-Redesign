'use client';

import { useState, useCallback } from 'react';
import BootScreen from './BootScreen';
import Desktop from './Desktop';
import { WindowProvider } from '@/context/WindowContext';

/**
 * Top-level desktop shell: Boot → Desktop OS (Windows XP Luna theme).
 */
export default function DesktopShell() {
  // Use local state so that BootScreen runs EVERY time the user refreshes the page
  const [hasBooted, setHasBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setHasBooted(true);
  }, []);

  return (
    <div data-theme="xp" style={{ height: '100%', width: '100%' }}>
      <WindowProvider>
        {!hasBooted && <BootScreen onComplete={handleBootComplete} />}
        {hasBooted && <Desktop />}
      </WindowProvider>
    </div>
  );
}

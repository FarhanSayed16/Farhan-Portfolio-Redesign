'use client';

import { useState, useEffect } from 'react';

export type DeviceMode = 'desktop' | 'mobile' | 'tablet';

function getDeviceMode(width: number): DeviceMode {
  if (width >= 1024) return 'desktop';
  if (width < 768) return 'mobile';
  return 'tablet';
}

/**
 * Detects the current device mode based on viewport width.
 * SSR-safe: returns null until mounted to prevent hydration mismatch.
 *
 * Rules: ≥1024 desktop, <768 mobile, else tablet.
 */
export function useDeviceMode(): DeviceMode | null {
  const [mode, setMode] = useState<DeviceMode | null>(null);

  useEffect(() => {
    const update = () => setMode(getDeviceMode(window.innerWidth));
    update();

    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  return mode;
}

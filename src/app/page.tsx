'use client';

import { useState } from 'react';
import { useDeviceMode, type DeviceMode } from '@/hooks/useDeviceMode';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TabletChoice from '@/components/shared/TabletChoice';
import DesktopShell from '@/components/desktop/DesktopShell';
import PhoneShell from '@/components/mobile/PhoneShell';

/**
 * Root page — routes to the correct surface based on device mode.
 */
export default function Home() {
  const deviceMode = useDeviceMode();
  const [tabletPreference, , prefHydrated] = useLocalStorage<DeviceMode | null>(
    'farhan-device-preference',
    null
  );
  const [chosenMode, setChosenMode] = useState<'desktop' | 'mobile' | null>(null);

  // SSR / not-yet-mounted — or tablet waiting on preference hydrate (avoids choice flash)
  if (deviceMode === null || (deviceMode === 'tablet' && !prefHydrated && !chosenMode)) {
    return (
      <div
        data-theme="xp"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#245edc',
          color: '#fff',
          fontFamily: 'var(--font-os)',
          fontSize: 13,
        }}
      >
        Loading…
      </div>
    );
  }

  if (deviceMode === 'desktop') {
    return <DesktopShell />;
  }

  if (deviceMode === 'mobile') {
    return <PhoneShell />;
  }

  const resolvedMode =
    chosenMode ||
    (tabletPreference === 'desktop' || tabletPreference === 'mobile'
      ? tabletPreference
      : null);

  if (resolvedMode === 'desktop') {
    return <DesktopShell />;
  }

  if (resolvedMode === 'mobile') {
    return <PhoneShell />;
  }

  return <TabletChoice onChoose={setChosenMode} />;
}

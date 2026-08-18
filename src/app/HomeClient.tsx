'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDeviceMode, type DeviceMode } from '@/hooks/useDeviceMode';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TabletChoice from '@/components/shared/TabletChoice';
import BootSplash from '@/components/shared/BootSplash';
import DesktopShell from '@/components/desktop/DesktopShell';
import PhoneShell from '@/components/mobile/PhoneShell';
import ModernPortfolioShell from '@/components/mobile/ModernPortfolioShell';

/**
 * Interactive shell — desktop Farhan OS · phone modern portfolio.
 * Phone extras: /?view=nokia (handset) · /?view=desktop (XP preview).
 * Crawlable copy lives in the server page sibling (SeoContent).
 */
export default function HomeClient() {
  return (
    <Suspense fallback={<BootSplash />}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const deviceMode = useDeviceMode();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const nokiaEgg = view === 'nokia';
  const desktopPreview = view === 'desktop';
  const [tabletPreference, , prefHydrated] = useLocalStorage<DeviceMode | null>(
    'farhan-device-preference',
    null
  );
  const [chosenMode, setChosenMode] = useState<'desktop' | 'mobile' | null>(null);

  if (deviceMode === null) {
    return <BootSplash />;
  }

  if (deviceMode === 'desktop') {
    return <DesktopShell />;
  }

  if (desktopPreview) {
    return <DesktopShell mobileExit />;
  }

  if (deviceMode === 'tablet' && !prefHydrated && !chosenMode && !nokiaEgg) {
    return <BootSplash />;
  }

  if (deviceMode === 'mobile') {
    return nokiaEgg ? <PhoneShell easterEgg /> : <ModernPortfolioShell />;
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
    return nokiaEgg ? <PhoneShell easterEgg /> : <ModernPortfolioShell />;
  }

  return <TabletChoice onChoose={setChosenMode} />;
}

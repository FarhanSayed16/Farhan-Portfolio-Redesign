'use client';

import { PhoneProvider } from '@/context/PhoneContext';
import PhoneFrame from './PhoneFrame';

/**
 * Top-level mobile shell: Nokia 3310 frame wrapping portfolio screens.
 */
export default function PhoneShell() {
  return (
    <PhoneProvider>
      <div
        data-theme="nokia"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--os-bg)',
          padding: '1rem',
        }}
      >
        <PhoneFrame />
      </div>
    </PhoneProvider>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Sheet = 'closed' | 'pick' | 'confirm-desktop';

/**
 * Bottom-nav “Modes” — pick Farhan OS (desktop) or Nokia egg.
 * Desktop is gated by a laptop-recommended confirm; query is not persisted.
 */
export default function ExperiencePicker() {
  const router = useRouter();
  const [sheet, setSheet] = useState<Sheet>('closed');

  useEffect(() => {
    if (sheet === 'closed') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheet('closed');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet]);

  return (
    <>
      <button
        type="button"
        className="mps-nav-egg"
        aria-haspopup="dialog"
        aria-expanded={sheet !== 'closed'}
        onClick={() => setSheet('pick')}
      >
        Modes
      </button>

      {sheet !== 'closed' && (
        <div className="mps-mode-root" role="presentation">
          <button
            type="button"
            className="mps-mode-backdrop"
            aria-label="Close"
            onClick={() => setSheet('closed')}
          />
          <div
            className="mps-mode-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mps-mode-title"
          >
            {sheet === 'pick' ? (
              <>
                <h2 id="mps-mode-title">Choose experience</h2>
                <p className="mps-mode-lead">
                  This phone site is the default. The Windows XP desktop and Nokia phone are extra
                  builds — pick one to open.
                </p>
                <button
                  type="button"
                  className="mps-mode-choice"
                  onClick={() => setSheet('confirm-desktop')}
                >
                  <span className="mps-mode-choice-kicker">Full OS</span>
                  Farhan OS
                  <span className="mps-mode-choice-sub">Windows XP desktop · best on a laptop</span>
                </button>
                <button
                  type="button"
                  className="mps-mode-choice"
                  onClick={() => router.push('/?view=nokia')}
                >
                  <span className="mps-mode-choice-kicker">Easter egg</span>
                  Nokia phone
                  <span className="mps-mode-choice-sub">Classic handset UI</span>
                </button>
                <button type="button" className="mps-mode-cancel" onClick={() => setSheet('closed')}>
                  Stay here
                </button>
              </>
            ) : (
              <>
                <h2 id="mps-mode-title">Open on a computer if you can</h2>
                <p className="mps-mode-lead">
                  Farhan OS is a full Windows XP desktop. It is built for a laptop or monitor. On
                  this phone you&apos;ll get the same OS, but windows and the taskbar will feel
                  small.
                </p>
                <p className="mps-mode-lead">
                  For the complete experience, open farhanbuilds.in on a computer. You can still
                  preview it here.
                </p>
                <button
                  type="button"
                  className="mps-mode-choice mps-mode-choice--primary"
                  onClick={() => router.push('/?view=desktop')}
                >
                  Open Farhan OS anyway
                </button>
                <button type="button" className="mps-mode-cancel" onClick={() => setSheet('closed')}>
                  Not now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

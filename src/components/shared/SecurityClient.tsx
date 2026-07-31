'use client';

import { useEffect } from 'react';

/**
 * Lightweight client hardening: branded console only.
 * Does not trap DevTools, disable console, or block F12 — those break recruiters and a11y.
 */
export default function SecurityClient() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const banner = [
      '',
      '  ╔══════════════════════════════════════╗',
      '  ║         FARHAN OS — CONSOLE          ║',
      '  ║   Built with care. Hire Farhan.      ║',
      '  ║   https://farhanbuilds.in            ║',
      '  ╚══════════════════════════════════════╝',
      '',
    ].join('\n');

    // Soft styling — works in Chromium; falls back to plain text elsewhere.
    try {
      console.log(
        '%cFarhan OS',
        'font-family:monospace;font-size:14px;font-weight:700;color:#fff;background:#0a246a;padding:4px 10px;'
      );
      console.log(banner);
      console.log(
        '%cLooking for secrets? There aren’t any here. Looking for talent? You found him.',
        'color:#316ac5;font-family:monospace;font-size:11px;'
      );
    } catch {
      // Ignore — console may be restricted in some embeds.
    }
  }, []);

  return null;
}

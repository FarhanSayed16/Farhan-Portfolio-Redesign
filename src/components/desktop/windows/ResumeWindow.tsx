'use client';

import { Download } from 'lucide-react';

/**
 * Resume.pdf — PDF viewer or placeholder.
 */
export default function ResumeWindow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderBottom: '1px solid var(--os-border)',
          background: 'var(--os-window)',
          flexShrink: 0,
        }}
      >
        <a
          href="/resume.pdf"
          download
          className="os-button"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '11px' }}
        >
          <Download size={13} /> Download PDF
        </a>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>resume.pdf</span>
      </div>

      {/* PDF viewer */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
        <object
          data="/resume.pdf"
          type="application/pdf"
          style={{ width: '100%', height: '100%', border: 'none' }}
        >
          {/* Fallback when PDF can't be displayed */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px' }}>📄</div>
            <div className="font-pixel" style={{ fontSize: '10px', color: 'var(--cyan)' }}>
              RESUME.PDF
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              PDF preview unavailable in this browser.
            </div>
            <a
              href="/resume.pdf"
              download
              className="os-button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginTop: '0.5rem' }}
            >
              <Download size={14} /> Download Instead
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}

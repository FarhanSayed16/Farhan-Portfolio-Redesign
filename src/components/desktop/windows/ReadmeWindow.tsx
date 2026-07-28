'use client';

import { useWindows } from '@/context/WindowContext';
import { siteData } from '@/lib/content';

/**
 * README.txt — Notepad-style welcome window.
 * Auto-opens once after first boot (handled by Desktop).
 */
export default function ReadmeWindow() {
  const { dispatch } = useWindows();

  const openApp = (id: string, component: any, title: string) => {
    dispatch({ type: 'OPEN', id, component, title });
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.8, color: 'var(--text)' }}>
      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
{`╔══════════════════════════════════════════════════╗
║  WELCOME TO FARHAN OS v3.0                       ║
║  farhanbuilds.in                                 ║
╚══════════════════════════════════════════════════╝
`}
      </pre>

      <div style={{ margin: '16px 0', fontFamily: 'var(--font-sans)' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>Hey! I'm {siteData.name}.</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0055aa', marginTop: '2px', letterSpacing: '0.5px' }}>{siteData.tagline}</div>
        <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text)', opacity: 0.8, marginTop: '4px' }}>Building Scalable Systems & Global Businesses.</div>
      </div>

      <div style={{ padding: '0.5rem 0', marginTop: '1rem', borderTop: '1px solid var(--os-border)' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Quick Links</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#0000ee' }}>
          <div 
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => openApp('projects', 'projects', 'Projects')}
          >
            💼 Projects — See my work
          </div>
          <div 
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => openApp('resume', 'resume', 'Resume')}
          >
            📄 Resume.pdf — Download resume
          </div>
          <div 
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => openApp('game', 'game', "Farhan's World")}
          >
            🎮 Super Mario Bros. (Farhan's Story) — Play the classic game!
          </div>
        </div>
      </div>

      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
{`
This portfolio isn't just a website. It's an interactive desktop OS
built to showcase my journey, projects, and skills. 
Explore it like you would a real computer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUICK START
───────────
• Double-click any desktop icon to open an app
• Use the Start menu (bottom-left) for all apps
• Drag windows by their title bars
• Resize windows from the bottom-right corner

KEYBOARD SHORTCUTS
──────────────────
  F1     Open Start Menu
  F2     Launch Super Mario Bros. (Farhan's Story)
  Esc    Close focused window
  ?      Open this README

WHAT'S INSIDE
─────────────
📁 Projects      — 23 projects, from SIH winners to robots
💻 Skills.exe    — 58+ technologies across 8 categories
📋 Experience    — 6 internships & counting
🏆 Achievements  — National wins, international finals
📄 Resume.pdf    — Download my resume
🌐 Browser       — A mini web browser (try it!)
✉️  Contact       — Send me a message directly
🎮 Farhan's World — Play the Mario-style game!

EASTER EGGS
───────────
• Right-click the desktop for a surprise
• Check the Recycle Bin 🗑️
• Play the game and beat all 3 levels!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Built with Next.js, TypeScript, and ❤️
© ${new Date().getFullYear()} ${siteData.name} — Mumbai, India
`}
      </pre>
    </div>
  );
}

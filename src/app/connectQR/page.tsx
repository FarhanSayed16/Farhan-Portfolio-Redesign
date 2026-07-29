import Link from 'next/link';
import {
  siteData,
  getEmailAddress,
  getMailtoHref,
  getWhatsAppHref,
} from '@/lib/content';

const AWARDS = [
  {
    title: 'National Winner',
    detail: 'Smart India Hackathon 2025 · Govt. of India',
  },
  {
    title: 'International Finalist',
    detail: 'Global Enterprise Architecture · 2025',
  },
] as const;

function IconLinkedIn() {
  return (
    <svg className="cq-ico" viewBox="0 0 24 24" aria-hidden width="16" height="16" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.59-2.19-3.59-2.19 0-2.53 1.71-2.53 3.48V23h-4V8.5z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg className="cq-ico" viewBox="0 0 24 24" aria-hidden width="16" height="16" fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.79 8.21 11.37.6.11.82-.26.82-.58 0-.28-.01-1.03-.02-2.02-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.25 1.85 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.77-1.62-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="cq-ico" viewBox="0 0 24 24" aria-hidden width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg className="cq-ico" viewBox="0 0 24 24" aria-hidden width="16" height="16" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.5 2 2.01 6.49 2.01 12.02c0 1.77.46 3.45 1.27 4.91L2 22l5.21-1.36c1.4.76 2.99 1.19 4.66 1.19h.01c5.54 0 10.03-4.49 10.03-10.02C21.91 6.49 17.42 2 12.04 2zm0 18.28h-.01c-1.5 0-2.96-.4-4.23-1.16l-.3-.18-3.09.81.82-3.01-.2-.31a8.25 8.25 0 0 1-1.26-4.41c0-4.56 3.71-8.27 8.28-8.27 4.56 0 8.27 3.71 8.27 8.27 0 4.56-3.71 8.26-8.28 8.26z" />
    </svg>
  );
}

export default function ConnectQRPage() {
  const email = getEmailAddress();
  const whatsapp = getWhatsAppHref(
    `Hi Farhan — scanned your card. Would love to connect.`
  );

  return (
    <main className="cq-page">
      <div className="cq-shell">
        <article className="cq-card">
          <header className="cq-header">
            <div>
              <p className="cq-domain">farhanbuilds.in</p>
              <p className="cq-eyebrow">Scan to connect</p>
            </div>
            <p className="cq-loc">{siteData.location}</p>
          </header>

          <div className="cq-hero">
            <div className="cq-photo-wrap">
              <div className="cq-photo-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={siteData.profileImage}
                  alt={siteData.name}
                  className="cq-photo"
                  width={160}
                  height={160}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <span className="cq-status" title={siteData.availability}>
                <span className="cq-status-dot" />
                Open to work
              </span>
            </div>

            <div className="cq-identity">
              <h1 className="cq-name">{siteData.name}</h1>
              <p className="cq-role">AI &amp; Full-Stack Engineer</p>
              <p className="cq-tag">{siteData.taglineShort}</p>
            </div>
          </div>

          <ul className="cq-awards">
            {AWARDS.map((a) => (
              <li key={a.title}>
                <span className="cq-award-mark" aria-hidden>
                  ★
                </span>
                <span className="cq-award-copy">
                  <strong>{a.title}</strong>
                  <span>{a.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <nav className="cq-socials" aria-label="Connect">
            <a
              className="cq-chip"
              href={siteData.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconLinkedIn />
              LinkedIn
            </a>
            {whatsapp && (
              <a
                className="cq-chip cq-chip-wa"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWhatsApp />
                WhatsApp
              </a>
            )}
            <a className="cq-chip" href={getMailtoHref('Hello from your business card')}>
              <IconMail />
              Email
            </a>
            <a
              className="cq-chip"
              href={siteData.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconGitHub />
              GitHub
            </a>
          </nav>

          <div className="cq-actions">
            <a className="cq-btn cq-btn-gold" href="/farhan.vcf" download="Farhan-Sayed.vcf">
              Save to contacts
            </a>
            <a className="cq-btn cq-btn-primary" href={siteData.resumeUrl} download>
              Download resume
            </a>
            <Link className="cq-btn cq-btn-ghost" href="/">
              Enter full portfolio
              <span className="cq-btn-hint">Farhan OS experience</span>
            </Link>
          </div>

          <p className="cq-email-line">
            <a href={getMailtoHref()}>{email}</a>
            <span className="cq-phone">+91 98678 68597</span>
          </p>

          <footer className="cq-foot">
            <span>Business card</span>
            <span className="cq-foot-sep">·</span>
            <span>Building scalable systems</span>
          </footer>
        </article>
      </div>
    </main>
  );
}

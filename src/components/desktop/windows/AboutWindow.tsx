'use client';

import { aboutData, siteData, testimonialsData, volunteeringData, researchData, getMailtoHref } from '@/lib/content';
import { ExternalLink } from 'lucide-react';

/**
 * About Me.txt — Notepad-style window showing bio and timeline.
 */
export default function AboutWindow() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--text)' }}>
      {/* Bio */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="font-pixel" style={{ fontSize: '11px', color: 'var(--cyan)', marginBottom: '1rem', letterSpacing: '1px' }}>
          ABOUT ME
        </div>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '15px', color: 'var(--text)' }}>{aboutData.bio}</p>
      </div>

      {/* Socials */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="font-pixel" style={{ fontSize: '10px', color: 'var(--cyan)', marginBottom: '0.75rem' }}>
          CONNECT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <SocialLink href={getMailtoHref()} label="Email" />
          <SocialLink href={siteData.socialLinks.github} label="GitHub" />
          <SocialLink href={siteData.socialLinks.linkedin} label="LinkedIn" />
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="font-pixel" style={{ fontSize: '11px', color: 'var(--cyan)', marginBottom: '1rem', letterSpacing: '1px' }}>
          TIMELINE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {aboutData.timeline.map((entry, i) => (
            <div
              key={i}
              style={{
                paddingLeft: '1rem',
                borderLeft: '2px solid var(--os-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="font-pixel" style={{ fontSize: '9px', color: 'var(--gold)' }}>
                  {entry.year}
                </span>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{entry.title}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {entry.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      {testimonialsData.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div className="font-pixel" style={{ fontSize: '11px', color: 'var(--cyan)', marginBottom: '1rem', letterSpacing: '1px' }}>
            TESTIMONIALS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {testimonialsData.map((t, i) => (
              <div key={i} style={{ 
                padding: '16px 20px', 
                background: 'var(--bg-muted, #f8f9fa)', 
                borderLeft: '4px solid var(--cyan, #0055aa)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '12px' }}>
                  &ldquo;{t.content}&rdquo;
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  — {t.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {t.role} at {t.organization}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteering */}
      {volunteeringData.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="font-pixel" style={{ fontSize: '10px', color: 'var(--cyan)', marginBottom: '0.75rem' }}>
            VOLUNTEERING
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {volunteeringData.map((v, i) => (
              <div key={i} style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--nokia-green)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{v.role}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{v.organization} · {v.duration}</div>
                <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.5, marginTop: '2px' }}>{v.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research */}
      {researchData.length > 0 && (
        <div>
          <div className="font-pixel" style={{ fontSize: '10px', color: 'var(--cyan)', marginBottom: '0.75rem' }}>
            RESEARCH INTERESTS
          </div>
          {researchData.map((r, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{r.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {r.interests.map((interest, j) => (
                  <span key={j} style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '3px', color: 'var(--violet)' }}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--cyan)',
        fontSize: '12px',
        textDecoration: 'none',
      }}
    >
      {label}
      <ExternalLink size={11} />
    </a>
  );
}

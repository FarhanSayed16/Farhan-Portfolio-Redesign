'use client';

import { achievementsData, certificationsData } from '@/lib/content';
import { useState, useEffect } from 'react';
import { Trophy, Award, ExternalLink, X } from 'lucide-react';
import type { Achievement } from '@/lib/content';

/**
 * Achievements.zip — Unzip animation → Grid of award cards + certifications tab.
 */
export default function AchievementsWindow() {
  const [tab, setTab] = useState<'achievements' | 'certifications'>('achievements');
  const [showAll, setShowAll] = useState(false);
  const [extracting, setExtracting] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const featuredCerts = certificationsData.filter(c => c.featured);
  const displayCerts = showAll ? certificationsData : featuredCerts;

  // Unzip extraction animation
  useEffect(() => {
    const timer = setTimeout(() => setExtracting(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (extracting) {
    return <ExtractingAnimation />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Classic Windows Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: '8px 8px 0 8px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <TabButton active={tab === 'achievements'} onClick={() => setTab('achievements')}>
          <Trophy size={14} /> Achievements ({achievementsData.length})
        </TabButton>
        <TabButton active={tab === 'certifications'} onClick={() => setTab('certifications')}>
          <Award size={14} /> Certifications ({certificationsData.length})
        </TabButton>
      </div>

      {/* Classic Tab Content Frame */}
      <div 
        style={{ 
          flex: 1, 
          margin: '0 8px 8px 8px', 
          padding: '12px', 
          background: 'var(--os-window-body, #ece9d8)',
          border: '1px solid',
          borderColor: '#fff #808080 #808080 #fff',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {tab === 'achievements' ? (
          <div style={{ 
            flex: 1,
            background: '#fff',
            border: '1px solid',
            borderColor: '#808080 #e0e0e0 #e0e0e0 #808080',
            padding: '4px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {achievementsData.map((a, i) => (
              <div
                key={i}
                onClick={() => setSelectedAchievement(a)}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = 'var(--os-highlight)'; 
                  e.currentTarget.style.color = '#fff';
                  const title = e.currentTarget.querySelector('.title-text') as HTMLElement;
                  const year = e.currentTarget.querySelector('.year-text') as HTMLElement;
                  const desc = e.currentTarget.querySelector('.desc-text') as HTMLElement;
                  if (title) title.style.color = '#fff';
                  if (year) year.style.color = '#fff';
                  if (desc) desc.style.color = '#fff';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = 'transparent'; 
                  e.currentTarget.style.color = 'var(--text)';
                  const title = e.currentTarget.querySelector('.title-text') as HTMLElement;
                  const year = e.currentTarget.querySelector('.year-text') as HTMLElement;
                  const desc = e.currentTarget.querySelector('.desc-text') as HTMLElement;
                  if (title) title.style.color = 'var(--text)';
                  if (year) year.style.color = '#808080';
                  if (desc) desc.style.color = '#666';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="title-text" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>{a.title}</div>
                  <div className="year-text" style={{ fontSize: '11px', fontWeight: 700, color: '#808080', flexShrink: 0 }}>{a.year}</div>
                </div>
                <div style={{ fontSize: '11px', color: 'inherit', marginBottom: '4px', fontStyle: 'italic' }}>{a.place}</div>
                <div className="desc-text" style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>{a.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ 
              flex: 1,
              background: '#fff',
              border: '1px solid',
              borderColor: '#808080 #e0e0e0 #e0e0e0 #808080',
              padding: '4px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {displayCerts.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderBottom: '1px solid #eee',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--os-highlight)';
                    e.currentTarget.style.color = '#fff';
                    const link = e.currentTarget.querySelector('a');
                    const text2 = e.currentTarget.querySelector('.cert-meta') as HTMLElement;
                    if (link) link.style.color = '#fff';
                    if (text2) text2.style.color = '#ddd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text)';
                    const link = e.currentTarget.querySelector('a');
                    const text2 = e.currentTarget.querySelector('.cert-meta') as HTMLElement;
                    if (link) link.style.color = '#0000ee';
                    if (text2) text2.style.color = '#666';
                  }}
                >
                  <Award size={14} style={{ color: c.featured ? 'var(--gold)' : 'currentColor', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '12px', color: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </div>
                    <div className="cert-meta" style={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap' }}>
                      {c.issuer} · {c.date}
                    </div>
                  </div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#0000ee', 
                      flexShrink: 0, 
                      display: 'flex', 
                      alignItems: 'center',
                      textDecoration: 'underline',
                      fontSize: '11px',
                    }}
                    title="Verify Certification"
                  >
                    Verify
                  </a>
                </div>
              ))}
            </div>
            {!showAll && certificationsData.length > featuredCerts.length && (
              <button
                onClick={() => setShowAll(true)}
                className="os-button"
                style={{ marginTop: '12px', fontSize: '11px' }}
              >
                Show all {certificationsData.length} certifications
              </button>
            )}
          </>
        )}
      </div>

      {/* Achievement Detail Popup */}
      {selectedAchievement && (
        <div
          onClick={() => setSelectedAchievement(null)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--os-window)',
              border: '1px solid var(--gold)',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: 400,
              width: '100%',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedAchievement(null)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Trophy size={20} style={{ color: 'var(--gold)' }} />
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                {selectedAchievement.title}
              </div>
            </div>
            <div className="font-pixel" style={{ fontSize: '9px', color: 'var(--gold)', marginBottom: '8px' }}>
              {selectedAchievement.year} · {selectedAchievement.place}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.7, borderTop: '1px solid var(--os-border)', paddingTop: '12px' }}>
              {selectedAchievement.description}
            </div>
            {selectedAchievement.link && (
              <a
                href={selectedAchievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="os-button"
                style={{ marginTop: '12px', display: 'inline-flex', gap: '6px', textDecoration: 'none' }}
              >
                <ExternalLink size={13} /> View Details
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ExtractingAnimation() {
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<string[]>([]);

  const allFiles = achievementsData.map(a => `${a.title.replace(/\s+/g, '_')}.award`);

  useEffect(() => {
    const files = allFiles;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(100, p + 6);
        const fileIdx = Math.floor((next / 100) * files.length);
        setFiles(files.slice(0, fileIdx));
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
    // only length matters for progress steps; titles are static JSON
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFiles.length]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '12px',
      padding: '2rem',
    }}>
      <Trophy size={32} style={{ color: 'var(--gold)', opacity: 0.8 }} />
      <div className="font-pixel" style={{ fontSize: '9px', color: 'var(--cyan)' }}>
        Extracting Achievements.zip...
      </div>
      <div style={{ width: '60%', height: 6, background: 'var(--os-border)', borderRadius: 3 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--cyan)', borderRadius: 3, transition: 'width 0.08s' }} />
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
        {files.slice(-2).map((f, i) => (
          <div key={i} style={{ opacity: i === 0 ? 0.5 : 1 }}>{f}</div>
        ))}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--os-window-body, #ece9d8)',
        border: '1px solid',
        borderColor: active ? '#fff #808080 var(--os-window-body) #fff' : '#fff #808080 #808080 #fff',
        padding: active ? '4px 14px 6px' : '2px 12px 2px',
        marginTop: active ? '0' : '4px',
        marginRight: '2px',
        marginBottom: active ? '-1px' : '0',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px',
        color: 'var(--text)',
        cursor: 'pointer',
        fontSize: '12px',
        fontFamily: 'var(--font-sans)',
        boxShadow: active ? 'none' : 'inset 0 -1px 2px rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: active ? 3 : 1,
      }}
    >
      {children}
    </button>
  );
}

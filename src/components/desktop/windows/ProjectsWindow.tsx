'use client';

import { useState } from 'react';
import { projectsData } from '@/lib/content';
import { ExternalLink, FolderOpen, Star, GitFork } from 'lucide-react';

/**
 * Projects Explorer — Two-panel file explorer for all projects.
 */
export default function ProjectsWindow({
  payload,
}: {
  payload?: Record<string, unknown>;
} = {}) {
  const featured = projectsData.filter(p => p.featured);
  const archived = projectsData.filter(p => p.archived);
  const initialId = (payload?.projectId as string | undefined) || featured[0]?.id || '';
  const [selectedId, setSelectedId] = useState(initialId);

  const selected = projectsData.find(p => p.id === selectedId);

  const categories = Array.from(new Set(projectsData.filter(p => !p.archived).map(p => p.category)));
  const categoryGroups = categories.map(cat => ({
    name: cat,
    projects: projectsData.filter(p => p.category === cat && !p.archived),
  }));

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div
        style={{
          width: 220,
          borderRight: '1px solid var(--os-border)',
          overflow: 'auto',
          flexShrink: 0,
        }}
      >
        {categoryGroups.map(group => (
          <div key={group.name}>
            <div className="font-pixel" style={{ fontSize: '8px', color: 'var(--cyan)', padding: '10px 12px 4px' }}>
              📁 {group.name.toUpperCase()}
            </div>
            {group.projects.map(p => (
              <ProjectListItem key={p.id} project={p} isSelected={p.id === selectedId} onClick={() => setSelectedId(p.id)} />
            ))}
          </div>
        ))}

        {archived.length > 0 && (
          <>
            <div className="font-pixel" style={{ fontSize: '8px', color: 'var(--text-muted)', padding: '14px 12px 4px' }}>
              ARCHIVED
            </div>
            {archived.map(p => (
              <ProjectListItem key={p.id} project={p} isSelected={p.id === selectedId} onClick={() => setSelectedId(p.id)} />
            ))}
          </>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem' }}>
        {selected ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {selected.title}
              </h2>
              {selected.featured && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)', 
                  borderRadius: '50%', width: '24px', height: '24px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(234, 179, 8, 0.4)'
                }}>
                  <Star size={14} color="#854d0e" fill="#854d0e" />
                </div>
              )}
            </div>

            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cyan)', marginBottom: '16px' }}>
              {selected.tagline}
            </div>

            {selected.award && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#854d0e',
                  padding: '6px 12px',
                  background: 'linear-gradient(90deg, #fef9c3 0%, #fef08a 100%)',
                  borderRadius: '20px',
                  boxShadow: '0 2px 4px rgba(234, 179, 8, 0.2)',
                  marginBottom: '16px',
                }}
              >
                <span>🏆</span> {selected.award}
              </div>
            )}

            <ProjectImage project={selected} />

            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--violet)' }}></span>
              Role: {selected.role}
            </div>

            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text)', margin: '16px 0 24px' }}>
              {selected.shortDescription}
            </p>

            {(selected.problem || selected.solution || selected.impact) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {selected.problem && (
                  <InfoBlock label="PROBLEM" text={selected.problem} color="#eab308" bg="rgba(234, 179, 8, 0.05)" />
                )}
                {selected.solution && (
                  <InfoBlock label="SOLUTION" text={selected.solution} color="var(--cyan)" bg="rgba(6, 182, 212, 0.05)" />
                )}
                {selected.impact && (
                  <InfoBlock label="IMPACT" text={selected.impact} color="#22c55e" bg="rgba(34, 197, 94, 0.05)" />
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
              {selected.tech.map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: '10px',
                    padding: '3px 8px',
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '3px',
                    color: 'var(--cyan)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {selected.repoUrl && (
                <a
                  href={selected.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <GitFork size={13} /> GitHub
                </a>
              )}
              {selected.demoUrl && (
                <a
                  href={selected.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Select a project</div>
        )}
      </div>
    </div>
  );
}

function ProjectListItem({
  project,
  isSelected,
  onClick,
}: {
  project: { id: string; title: string; award: string | null };
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '7px 12px',
        background: isSelected ? 'var(--os-highlight)' : 'transparent',
        border: 'none',
        borderLeft: isSelected ? '2px solid #0831d9' : '2px solid transparent',
        color: isSelected ? '#fff' : 'var(--text)',
        cursor: 'pointer',
        fontSize: '12px',
        textAlign: 'left',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = '#e8f0ff';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'transparent';
      }}
    >
      <FolderOpen size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {project.title}
      </span>
      {project.award && <span style={{ fontSize: '10px', flexShrink: 0 }}>🏆</span>}
    </button>
  );
}

function InfoBlock({ label, text, color, bg }: { label: string; text: string; color: string; bg: string }) {
  return (
    <div style={{ 
      padding: '16px', 
      borderLeft: `4px solid ${color}`, 
      background: bg, 
      borderRadius: '0 8px 8px 0' 
    }}>
      <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', color, marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function ProjectImage({ project }: { project: { image: string; title: string; category: string } }) {
  const [hasError, setHasError] = useState(false);
  const gradients: Record<string, string> = {
    web: 'radial-gradient(circle at 0% 0%, #3b82f6 0%, #06b6d4 100%)',
    ai: 'radial-gradient(circle at 100% 100%, #8b5cf6 0%, #6366f1 100%)',
    robotics: 'radial-gradient(circle at 50% 0%, #10b981 0%, #14b8a6 100%)',
  };
  const gradient = gradients[project.category] || 'radial-gradient(circle at 50% 50%, #64748b 0%, #475569 100%)';

  if (hasError || !project.image) {
    return (
      <div
        style={{
          width: '100%',
          height: 220,
          background: gradient,
          borderRadius: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        {/* Decorative mesh shapes */}
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'rgba(255,255,255,0.1)', transform: 'rotate(30deg)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '60%', height: '100%', background: 'rgba(0,0,0,0.15)', transform: 'rotate(-15deg)', filter: 'blur(30px)' }} />
        
        <h3 style={{ 
          position: 'relative', zIndex: 1, color: '#fff', fontSize: '24px', fontWeight: 800, 
          textAlign: 'center', padding: '0 32px', textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          letterSpacing: '-0.02em', lineHeight: 1.3
        }}>
          {project.title}
        </h3>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.image}
      alt={project.title}
      onError={() => setHasError(true)}
      style={{
        width: '100%',
        height: 220,
        objectFit: 'cover',
        borderRadius: '16px',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      }}
    />
  );
}

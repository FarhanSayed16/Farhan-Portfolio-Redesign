'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  projectsData,
  projectFolders,
  PROJECT_FOLDER_META,
  type Project,
} from '@/lib/content';
import { ExternalLink, FolderOpen, Star, GitFork, X } from 'lucide-react';

/**
 * Projects Explorer — case studies live here.
 * Folders are multi-home: a platform can sit under Platforms + AI + Hardware at once.
 */
export default function ProjectsWindow({
  payload,
}: {
  payload?: Record<string, unknown>;
} = {}) {
  const featured = projectsData.filter((p) => p.featured);
  const archived = projectsData.filter((p) => p.archived);
  const active = projectsData.filter((p) => !p.archived);
  const initialId = (payload?.projectId as string | undefined) || featured[0]?.id || '';
  const [selectedId, setSelectedId] = useState(initialId);
  const [preview, setPreview] = useState<{ src: string; label: string } | null>(null);

  useEffect(() => {
    const id = payload?.projectId as string | undefined;
    if (id && projectsData.some((p) => p.id === id)) setSelectedId(id);
  }, [payload?.projectId]);

  useEffect(() => {
    setPreview(null);
  }, [selectedId]);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreview(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  const selected = projectsData.find((p) => p.id === selectedId);

  const folderGroups = PROJECT_FOLDER_META.map((meta) => ({
    ...meta,
    projects: active.filter((p) => projectFolders(p).includes(meta.id)),
  })).filter((g) => g.projects.length > 0);

  const openPreview = useCallback((src: string, label: string) => {
    if (!src || src.includes('placeholder')) return;
    setPreview({ src, label });
  }, []);

  const gallery =
    selected &&
    [
      ...(selected.image && !selected.image.includes('placeholder') ? [selected.image] : []),
      ...(selected.media || []),
    ].filter((src, i, arr) => arr.indexOf(src) === i);

  const selectedFolderLabels = selected
    ? projectFolders(selected)
        .map((id) => PROJECT_FOLDER_META.find((f) => f.id === id)?.label || id)
        .filter(Boolean)
    : [];

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      <div
        style={{
          width: 230,
          borderRight: '1px solid var(--os-border)',
          overflow: 'auto',
          flexShrink: 0,
        }}
      >
        {folderGroups.map((group) => (
          <div key={group.id}>
            <div
              className="font-pixel"
              title={folderHint(group.id)}
              style={{ fontSize: '8px', color: 'var(--cyan)', padding: '10px 12px 4px' }}
            >
              📁 {group.label.toUpperCase()}
            </div>
            {group.projects.map((p) => (
              <ProjectListItem
                key={`${group.id}-${p.id}`}
                project={p}
                isSelected={p.id === selectedId}
                onClick={() => setSelectedId(p.id)}
              />
            ))}
          </div>
        ))}

        {archived.length > 0 && (
          <>
            <div className="font-pixel" style={{ fontSize: '8px', color: 'var(--text-muted)', padding: '14px 12px 4px' }}>
              ARCHIVED
            </div>
            {archived.map((p) => (
              <ProjectListItem
                key={p.id}
                project={p}
                isSelected={p.id === selectedId}
                onClick={() => setSelectedId(p.id)}
              />
            ))}
          </>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem' }}>
        {selected ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                {selected.title}
              </h2>
              {selected.featured && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(234, 179, 8, 0.4)',
                  }}
                >
                  <Star size={14} color="#854d0e" fill="#854d0e" />
                </div>
              )}
            </div>

            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cyan)', marginBottom: '10px' }}>
              {selected.tagline}
            </div>

            {selectedFolderLabels.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {selectedFolderLabels.map((label) => (
                  <span
                    key={label}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#0a246a',
                      background: '#e8f0ff',
                      border: '1px solid #b8ccee',
                      borderRadius: 3,
                      padding: '3px 8px',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

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

            <ProjectImage
              project={selected}
              onPreview={() => openPreview(selected.image, selected.title)}
            />

            {gallery && gallery.length > 1 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: 8,
                  margin: '0 0 16px',
                }}
              >
                {gallery.slice(1).map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => openPreview(src, `${selected.title} — ${i + 2}`)}
                    style={{
                      display: 'block',
                      padding: 0,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid var(--os-border)',
                      aspectRatio: '16/10',
                      background: '#0f172a',
                      cursor: 'zoom-in',
                    }}
                    title="Preview"
                  >
                    <img
                      src={src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--violet)' }} />
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
              {selected.tech.map((t) => (
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

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selected.demoUrl && (
                <a
                  href={selected.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <ExternalLink size={13} /> Open Live Site
                </a>
              )}
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
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Select a project</div>
        )}
      </div>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={preview.label}
          onClick={() => setPreview(null)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.78)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            cursor: 'zoom-out',
          }}
        >
          <button
            type="button"
            onClick={() => setPreview(null)}
            aria-label="Close preview"
            className="os-button"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              zIndex: 2,
            }}
          >
            <X size={14} /> Close
          </button>
          <img
            src={preview.src}
            alt={preview.label}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 4,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              cursor: 'default',
              background: '#111',
            }}
          />
        </div>
      )}
    </div>
  );
}

function folderHint(id: string): string {
  if (id === 'platforms') return 'Multi-surface products: web + app + backends';
  if (id === 'ai') return 'AI / ML / vision / threat pipelines';
  if (id === 'hardware') return 'IoT, embedded, robotics, AR/VR devices';
  if (id === 'web') return 'Web apps, portals, and commerce';
  return '';
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
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</span>
      {project.award && <span style={{ fontSize: '10px', flexShrink: 0 }}>🏆</span>}
    </button>
  );
}

function InfoBlock({ label, text, color, bg }: { label: string; text: string; color: string; bg: string }) {
  return (
    <div
      style={{
        padding: '16px',
        borderLeft: `4px solid ${color}`,
        background: bg,
        borderRadius: '0 8px 8px 0',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', color, marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function ProjectImage({
  project,
  onPreview,
}: {
  project: Project;
  onPreview: () => void;
}) {
  const [hasError, setHasError] = useState(false);
  const isPlaceholder = !project.image || project.image.includes('placeholder') || hasError;

  const gradients: Record<string, string> = {
    platforms: 'radial-gradient(circle at 0% 0%, #3b82f6 0%, #06b6d4 100%)',
    web: 'radial-gradient(circle at 0% 0%, #3b82f6 0%, #06b6d4 100%)',
    ai: 'radial-gradient(circle at 100% 100%, #8b5cf6 0%, #6366f1 100%)',
    hardware: 'radial-gradient(circle at 50% 0%, #10b981 0%, #14b8a6 100%)',
    robotics: 'radial-gradient(circle at 50% 0%, #10b981 0%, #14b8a6 100%)',
  };
  const gradient = gradients[project.category] || 'radial-gradient(circle at 50% 50%, #64748b 0%, #475569 100%)';

  if (isPlaceholder) {
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
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '100%',
            height: '200%',
            background: 'rgba(255,255,255,0.1)',
            transform: 'rotate(30deg)',
            filter: 'blur(40px)',
          }}
        />
        <h3
          style={{
            position: 'relative',
            zIndex: 1,
            color: '#fff',
            fontSize: '24px',
            fontWeight: 800,
            textAlign: 'center',
            padding: '0 32px',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h3>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPreview}
      title="Click to preview"
      style={{
        display: 'block',
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'zoom-in',
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      }}
    >
      <img
        src={project.image}
        alt={project.title}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: 240,
          objectFit: 'contain',
          objectPosition: 'center',
          display: 'block',
          pointerEvents: 'none',
          background: '#0b0f14',
        }}
      />
    </button>
  );
}

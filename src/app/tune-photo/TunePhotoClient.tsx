'use client';

import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { siteData } from '@/lib/content';

type Focus = { x: number; y: number; zoom: number };

const siteStart: Focus = {
  x: siteData.profileFocus?.x ?? 47,
  y: siteData.profileFocus?.y ?? 40,
  zoom: siteData.profileFocus?.zoom ?? 1.05,
};

const squareStart: Focus = {
  x: siteData.squareFocus?.x ?? siteStart.x,
  y: siteData.squareFocus?.y ?? siteStart.y,
  zoom: siteData.squareFocus?.zoom ?? 1.05,
};

export default function TunePhotoClient() {
  const [site, setSite] = useState<Focus>(siteStart);
  const [square, setSquare] = useState<Focus>(squareStart);

  const snippet = `"profileFocus": { "x": ${site.x.toFixed(0)}, "y": ${site.y.toFixed(0)}, "zoom": ${site.zoom.toFixed(2)} },
  "squareFocus": { "x": ${square.x.toFixed(0)}, "y": ${square.y.toFixed(0)}, "zoom": ${square.zoom.toFixed(2)} }`;

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '20px 16px 40px',
        background: '#0b0b0d',
        color: '#f4f0e8',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 20, margin: '0 0 8px' }}>Tune portrait</h1>
      <p style={{ margin: '0 0 20px', opacity: 0.7, fontSize: 14, lineHeight: 1.5, maxWidth: 640 }}>
        Each frame is independent — drag and use sliders under that preview. Paste both lines into{' '}
        <code>data/content/site.json</code>, then run <code>npm run gen:portrait-square</code> so
        Google gets the square crop. This page is not linked in the site.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 28,
          maxWidth: 720,
        }}
      >
        <FrameEditor
          title="Site circle"
          hint="Hero, connect QR, Nokia"
          round
          value={site}
          onChange={setSite}
        />
        <FrameEditor
          title="Google square"
          hint="Search thumbnail / Open Graph"
          round={false}
          value={square}
          onChange={setSquare}
        />
      </div>

      <pre
        style={{
          marginTop: 24,
          padding: 12,
          background: '#16161a',
          borderRadius: 8,
          fontSize: 13,
          overflowX: 'auto',
          maxWidth: 720,
        }}
      >
        {snippet}
      </pre>
      <button
        type="button"
        className="os-button"
        onClick={() => navigator.clipboard.writeText(snippet)}
        style={{ marginTop: 8 }}
      >
        Copy JSON
      </button>
    </div>
  );
}

function FrameEditor({
  title,
  hint,
  round,
  value,
  onChange,
}: {
  title: string;
  hint: string;
  round: boolean;
  value: Focus;
  onChange: (next: Focus) => void;
}) {
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const set = (patch: Partial<Focus>) => onChange({ ...value, ...patch });

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLImageElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { px: e.clientX, py: e.clientY, x: value.x, y: value.y };
    },
    [value.x, value.y]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLImageElement>) => {
      const d = drag.current;
      if (!d) return;
      const box = e.currentTarget.getBoundingClientRect();
      const dx = ((e.clientX - d.px) / box.width) * 100;
      const dy = ((e.clientY - d.py) / box.height) * 100;
      onChange({
        ...value,
        x: clamp(d.x - dx, 0, 100),
        y: clamp(d.y - dy, 0, 100),
      });
    },
    [onChange, value]
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  return (
    <section>
      <h2 style={{ fontSize: 16, margin: '0 0 4px' }}>{title}</h2>
      <p style={{ margin: '0 0 10px', fontSize: 12, opacity: 0.55 }}>{hint}</p>
      <div
        style={{
          width: 240,
          height: 240,
          borderRadius: round ? '50%' : 8,
          overflow: 'hidden',
          border: round ? '3px solid #ef4444' : '3px solid #888',
          background: '#111',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={siteData.profileImage}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${value.x}% ${value.y}%`,
            transform: `scale(${value.zoom})`,
            touchAction: 'none',
            cursor: 'grab',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
      <label style={labelStyle}>
        Horizontal {value.x.toFixed(0)}%
        <input
          type="range"
          min={0}
          max={100}
          value={value.x}
          onChange={(e) => set({ x: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </label>
      <label style={labelStyle}>
        Vertical {value.y.toFixed(0)}%
        <input
          type="range"
          min={0}
          max={100}
          value={value.y}
          onChange={(e) => set({ y: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </label>
      <label style={labelStyle}>
        Zoom {value.zoom.toFixed(2)}
        <input
          type="range"
          min={1}
          max={1.35}
          step={0.01}
          value={value.zoom}
          onChange={(e) => set({ zoom: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </label>
    </section>
  );
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginTop: 12,
  fontSize: 13,
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

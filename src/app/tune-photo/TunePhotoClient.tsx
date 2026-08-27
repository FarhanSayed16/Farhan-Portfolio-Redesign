'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { siteData } from '@/lib/content';
import { logoLayout, portraitSquareRect, type Focus, type LogoFocus } from '@/lib/focusCrop';

const PORTRAIT_SRC = siteData.profileImage;
const LOGO_SRC = '/images/brand/fs-logo.png';

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

const logoStart: LogoFocus = {
  x: siteData.logoFocus?.x ?? 50,
  y: siteData.logoFocus?.y ?? 50,
  scale: siteData.logoFocus?.scale ?? 1,
  pad: siteData.logoFocus?.pad ?? 0.08,
};

export default function TunePhotoClient() {
  const [site, setSite] = useState<Focus>(siteStart);
  const [square, setSquare] = useState<Focus>(squareStart);
  const [logo, setLogo] = useState<LogoFocus>(logoStart);

  const snippet = `"profileFocus": { "x": ${site.x.toFixed(0)}, "y": ${site.y.toFixed(0)}, "zoom": ${(site.zoom ?? 1).toFixed(2)} },
  "squareFocus": { "x": ${square.x.toFixed(0)}, "y": ${square.y.toFixed(0)}, "zoom": ${(square.zoom ?? 1).toFixed(2)} },
  "logoFocus": { "x": ${logo.x.toFixed(0)}, "y": ${logo.y.toFixed(0)}, "scale": ${(logo.scale ?? 1).toFixed(2)}, "pad": ${(logo.pad ?? 0.08).toFixed(2)} }`;

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: 20, margin: '0 0 8px' }}>Tune Google & site assets</h1>
      <p style={introStyle}>
        Private tool — not linked in the nav. Each preview is independent. When done: paste the JSON
        into <code>data/content/site.json</code>, then run{' '}
        <code>npm run gen:portrait-square</code> and <code>npm run gen:favicon</code>, commit, and
        deploy. Google can take days to refresh search thumbnails.
      </p>

      <SerpPreview square={square} logo={logo} />

      <div style={gridStyle}>
        <SiteCircleEditor value={site} onChange={setSite} />
        <SquareCropEditor value={square} onChange={setSquare} />
        <LogoEditor value={logo} onChange={setLogo} />
      </div>

      <pre style={snippetStyle}>{snippet}</pre>
      <button type="button" className="os-button" onClick={() => navigator.clipboard.writeText(snippet)} style={{ marginTop: 8 }}>
        Copy JSON
      </button>
    </div>
  );
}

function SerpPreview({ square, logo }: { square: Focus; logo: LogoFocus }) {
  return (
    <div style={serpBoxStyle}>
      <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 10, letterSpacing: '0.04em' }}>
        GOOGLE SEARCH PREVIEW (approximate)
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <LogoCanvas focus={logo} size={28} circle />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: '#8ab4f8', marginBottom: 2 }}>Farhan Sayed — AI & Full-Stack Engineer</div>
          <div style={{ fontSize: 11, color: '#9aa0a6' }}>https://farhanbuilds.in</div>
        </div>
        <PortraitCanvas focus={square} size={72} rounded />
      </div>
    </div>
  );
}

function SiteCircleEditor({ value, onChange }: { value: Focus; onChange: (v: Focus) => void }) {
  return (
    <EditorSection title="Site circle" hint="Hero, connect QR, Nokia — live CSS on the site">
      <CssPortraitFrame round value={value} onChange={onChange} />
      <FocusSliders value={value} onChange={onChange} zoomMax={1.4} />
    </EditorSection>
  );
}

function SquareCropEditor({ value, onChange }: { value: Focus; onChange: (v: Focus) => void }) {
  return (
    <EditorSection
      title="Google profile square"
      hint="Exact crop used by gen:portrait-square — drag or use sliders"
    >
      <PortraitCanvas focus={value} size={240} onDrag={onChange} />
      <FocusSliders value={value} onChange={onChange} zoomMax={1.6} />
    </EditorSection>
  );
}

function LogoEditor({ value, onChange }: { value: LogoFocus; onChange: (v: LogoFocus) => void }) {
  const set = (patch: Partial<LogoFocus>) => onChange({ ...value, ...patch });

  return (
    <EditorSection title="FS logo / favicon" hint="Google tab icon — run gen:favicon after saving">
      <LogoCanvas focus={value} size={240} onDrag={onChange} />
      <label style={labelStyle}>
        Horizontal {value.x.toFixed(0)}%
        <input type="range" min={35} max={65} value={value.x} onChange={(e) => set({ x: Number(e.target.value) })} style={{ width: '100%' }} />
      </label>
      <label style={labelStyle}>
        Vertical {value.y.toFixed(0)}%
        <input type="range" min={35} max={65} value={value.y} onChange={(e) => set({ y: Number(e.target.value) })} style={{ width: '100%' }} />
      </label>
      <label style={labelStyle}>
        Scale {(value.scale ?? 1).toFixed(2)}
        <input type="range" min={0.75} max={1.25} step={0.01} value={value.scale ?? 1} onChange={(e) => set({ scale: Number(e.target.value) })} style={{ width: '100%' }} />
      </label>
      <label style={labelStyle}>
        Padding {(value.pad ?? 0.08).toFixed(2)}
        <input type="range" min={0.02} max={0.18} step={0.01} value={value.pad ?? 0.08} onChange={(e) => set({ pad: Number(e.target.value) })} style={{ width: '100%' }} />
      </label>
    </EditorSection>
  );
}

function EditorSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 style={{ fontSize: 16, margin: '0 0 4px' }}>{title}</h2>
      <p style={{ margin: '0 0 10px', fontSize: 12, opacity: 0.55 }}>{hint}</p>
      {children}
    </section>
  );
}

function FocusSliders({
  value,
  onChange,
  zoomMax,
}: {
  value: Focus;
  onChange: (v: Focus) => void;
  zoomMax: number;
}) {
  const set = (patch: Partial<Focus>) => onChange({ ...value, ...patch });
  return (
    <>
      <label style={labelStyle}>
        Horizontal {value.x.toFixed(0)}%
        <input type="range" min={0} max={100} value={value.x} onChange={(e) => set({ x: Number(e.target.value) })} style={{ width: '100%' }} />
      </label>
      <label style={labelStyle}>
        Vertical {value.y.toFixed(0)}%
        <input type="range" min={0} max={100} value={value.y} onChange={(e) => set({ y: Number(e.target.value) })} style={{ width: '100%' }} />
      </label>
      <label style={labelStyle}>
        Zoom {(value.zoom ?? 1).toFixed(2)}
        <input type="range" min={1} max={zoomMax} step={0.01} value={value.zoom ?? 1} onChange={(e) => set({ zoom: Number(e.target.value) })} style={{ width: '100%' }} />
      </label>
    </>
  );
}

function CssPortraitFrame({
  round,
  value,
  onChange,
}: {
  round: boolean;
  value: Focus;
  onChange: (v: Focus) => void;
}) {
  const drag = useDragRef(value, onChange);

  return (
    <div style={frameStyle(round, '#ef4444')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PORTRAIT_SRC}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${value.x}% ${value.y}%`,
          transform: `scale(${value.zoom ?? 1})`,
          touchAction: 'none',
          cursor: 'grab',
        }}
        {...drag}
      />
    </div>
  );
}

function PortraitCanvas({
  focus,
  size,
  rounded,
  circle,
  onDrag,
}: {
  focus: Focus;
  size: number;
  rounded?: boolean;
  circle?: boolean;
  onDrag?: (v: Focus) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const img = useLoadedImage(PORTRAIT_SRC);
  const drag = useDragRef(focus, onDrag ?? (() => {}), !onDrag);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = portraitSquareRect({ width: img.naturalWidth, height: img.naturalHeight }, focus);
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(img, rect.left, rect.top, rect.size, rect.size, 0, 0, size, size);
  }, [img, focus, size]);

  const borderRadius = circle ? '50%' : rounded ? 12 : 8;

  return (
    <div
      style={{
        ...frameStyle(false, rounded || circle ? '#888' : '#888'),
        width: size,
        height: size,
        borderRadius,
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, borderRadius, touchAction: 'none', cursor: onDrag ? 'grab' : 'default' }}
        {...(onDrag ? drag : {})}
      />
    </div>
  );
}

function LogoCanvas({
  focus,
  size,
  circle,
  onDrag,
}: {
  focus: LogoFocus;
  size: number;
  circle?: boolean;
  onDrag?: (v: LogoFocus) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const img = useLoadedImage(LOGO_SRC);
  const drag = useLogoDragRef(focus, onDrag ?? (() => {}), !onDrag);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { inner, left, top } = logoLayout(size, focus);
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, left, top, inner, inner);
  }, [img, focus, size]);

  const borderRadius = circle ? '50%' : 8;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        overflow: 'hidden',
        border: circle ? 'none' : '3px solid #888',
        background: '#000',
        flexShrink: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, borderRadius, touchAction: 'none', cursor: onDrag ? 'grab' : 'default' }}
        {...(onDrag ? drag : {})}
      />
    </div>
  );
}

function useLoadedImage(src: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const el = new Image();
    el.onload = () => setImg(el);
    el.src = src;
  }, [src]);
  return img;
}

function useDragRef(value: Focus, onChange: (v: Focus) => void, disabled = false) {
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { px: e.clientX, py: e.clientY, x: value.x, y: value.y };
    },
    [disabled, value.x, value.y]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (disabled || !drag.current) return;
      const box = e.currentTarget.getBoundingClientRect();
      const dx = ((e.clientX - drag.current.px) / box.width) * 100;
      const dy = ((e.clientY - drag.current.py) / box.height) * 100;
      onChange({
        ...value,
        x: clamp(drag.current.x - dx, 0, 100),
        y: clamp(drag.current.y - dy, 0, 100),
      });
    },
    [disabled, onChange, value]
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}

function useLogoDragRef(value: LogoFocus, onChange: (v: LogoFocus) => void, disabled = false) {
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { px: e.clientX, py: e.clientY, x: value.x, y: value.y };
    },
    [disabled, value.x, value.y]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (disabled || !drag.current) return;
      const box = e.currentTarget.getBoundingClientRect();
      const dx = ((e.clientX - drag.current.px) / box.width) * 30;
      const dy = ((e.clientY - drag.current.py) / box.height) * 30;
      onChange({
        ...value,
        x: clamp(drag.current.x - dx, 35, 65),
        y: clamp(drag.current.y - dy, 35, 65),
      });
    },
    [disabled, onChange, value]
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}

function frameStyle(round: boolean, borderColor: string): CSSProperties {
  return {
    width: 240,
    height: 240,
    borderRadius: round ? '50%' : 8,
    overflow: 'hidden',
    border: `3px solid ${borderColor}`,
    background: '#111',
  };
}

const pageStyle: CSSProperties = {
  minHeight: '100dvh',
  padding: '20px 16px 40px',
  background: '#0b0b0d',
  color: '#f4f0e8',
  fontFamily: 'system-ui, sans-serif',
};

const introStyle: CSSProperties = {
  margin: '0 0 20px',
  opacity: 0.7,
  fontSize: 14,
  lineHeight: 1.5,
  maxWidth: 720,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 28,
  maxWidth: 900,
};

const serpBoxStyle: CSSProperties = {
  maxWidth: 520,
  marginBottom: 28,
  padding: '14px 16px',
  background: '#16161a',
  borderRadius: 12,
  border: '1px solid #2a2a32',
};

const snippetStyle: CSSProperties = {
  marginTop: 24,
  padding: 12,
  background: '#16161a',
  borderRadius: 8,
  fontSize: 13,
  overflowX: 'auto',
  maxWidth: 720,
};

const labelStyle: CSSProperties = {
  display: 'block',
  marginTop: 12,
  fontSize: 13,
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

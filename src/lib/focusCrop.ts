/** Browser mirror of scripts/lib/focus-crop.mjs */

export type Focus = { x: number; y: number; zoom?: number };
export type LogoFocus = { x: number; y: number; scale?: number; pad?: number };

export function portraitSquareRect(
  meta: { width: number; height: number },
  focus: Focus
) {
  const zoom = Math.max(1, Number(focus.zoom ?? 1.05));
  const BASE = 720;
  const w = meta.width;
  const h = meta.height;
  const size = Math.min(w, h, Math.round(BASE / zoom));
  const fx = focus.x / 100;
  const fy = focus.y / 100;
  let left = Math.round(fx * w - size / 2);
  let top = Math.round(fy * h - size / 2);
  left = Math.max(0, Math.min(left, w - size));
  top = Math.max(0, Math.min(top, h - size));
  return { left, top, size };
}

export function logoLayout(size: number, focus: LogoFocus) {
  const pad = Number(focus.pad ?? 0.08);
  const scale = Number(focus.scale ?? 1);
  const x = focus.x;
  const y = focus.y;
  const inset = size * pad;
  const maxInner = Math.max(8, Math.floor(size - inset * 2));
  const inner = Math.min(maxInner, Math.max(8, Math.round((size - inset * 2) * scale)));
  const baseLeft = Math.round((size - inner) / 2);
  const baseTop = Math.round((size - inner) / 2);
  const offsetX = Math.round(((x - 50) / 50) * (size * 0.12));
  const offsetY = Math.round(((y - 50) / 50) * (size * 0.12));
  const left = Math.max(0, Math.min(baseLeft + offsetX, size - inner));
  const top = Math.max(0, Math.min(baseTop + offsetY, size - inner));
  return { inner, left, top };
}

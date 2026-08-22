/** Shared crop math for portrait square + logo favicons. Keep in sync with src/lib/focusCrop.ts */

export function portraitSquareRect(meta, focus) {
  const zoom = Math.max(1, Number(focus?.zoom ?? 1.05));
  const BASE = 720;
  const w = meta.width ?? 1280;
  const h = meta.height ?? 853;
  const size = Math.min(w, h, Math.round(BASE / zoom));
  const fx = Number(focus?.x ?? 47) / 100;
  const fy = Number(focus?.y ?? 40) / 100;
  let left = Math.round(fx * w - size / 2);
  let top = Math.round(fy * h - size / 2);
  left = Math.max(0, Math.min(left, w - size));
  top = Math.max(0, Math.min(top, h - size));
  return { left, top, size, w, h };
}

/** Where the FS mark sits inside a square favicon canvas. */
export function logoLayout(size, focus = {}) {
  const pad = Number(focus.pad ?? 0.08);
  const scale = Number(focus.scale ?? 1);
  const x = Number(focus.x ?? 50);
  const y = Number(focus.y ?? 50);
  const inset = size * pad;
  const maxInner = Math.max(8, Math.floor(size - inset * 2));
  const inner = Math.min(maxInner, Math.max(8, Math.round((size - inset * 2) * scale)));
  const baseLeft = Math.round((size - inner) / 2);
  const baseTop = Math.round((size - inner) / 2);
  const offsetX = Math.round(((x - 50) / 50) * (size * 0.12));
  const offsetY = Math.round(((y - 50) / 50) * (size * 0.12));
  const left = Math.max(0, Math.min(baseLeft + offsetX, size - inner));
  const top = Math.max(0, Math.min(baseTop + offsetY, size - inner));
  return { inner, left, top, pad };
}

'use client';

import React from 'react';

export default function LaserDivider({ color = '#ef4444' }: { color?: string }) {
  // Enforce subtle, elegant red across all partition lines
  const redColor = '#ef4444';

  return (
    <div className="bv-laser-divider-container" aria-hidden="true">
      {/* Base Track Line */}
      <div className="bv-laser-track" />

      {/* Traveling Laser Beam shooting from left to right with light, subtle red glow */}
      <div
        className="bv-laser-beam"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.25) 40%, rgba(248, 113, 113, 0.85) 75%, transparent 100%)`,
          boxShadow: `0 0 8px rgba(239, 68, 68, 0.45)`,
        }}
      />

      {/* Center Zooming HUD Square & Diamond */}
      <div className="bv-laser-center-box">
        <div
          className="bv-laser-center-diamond"
          style={{
            borderColor: 'rgba(239, 68, 68, 0.85)',
            boxShadow: `0 0 6px rgba(239, 68, 68, 0.5), inset 0 0 2px rgba(239, 68, 68, 0.3)`,
          }}
        />
      </div>
    </div>
  );
}

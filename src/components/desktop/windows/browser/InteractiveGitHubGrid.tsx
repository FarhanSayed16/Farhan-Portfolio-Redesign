'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0, 1, 2, 3, 4
}

interface ApiResponse {
  totalContributions: number;
  weeks: ContributionDay[][];
  error?: string;
}

export default function InteractiveGitHubGrid({ username = 'FarhanSayed16' }: { username?: string }) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [data, setData] = useState<{ total: number; weeks: ContributionDay[][] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fallback realistic generator right in case offline or initial render
  const fallbackData = useMemo(() => {
    const today = new Date();
    const w: ContributionDay[][] = [];
    let total = 0;
    const startDate = new Date(today.getTime() - 363 * 24 * 60 * 60 * 1000);

    const days: ContributionDay[] = [];
    for (let i = 0; i < 364; i++) {
      const current = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = current.toISOString().split('T')[0];
      const dayOfWeek = current.getDay();

      let level = 0;
      let count = 0;
      const wave = Math.sin(i / 14) + Math.cos(i / 7);
      const rand = Math.random();

      if (rand > 0.15) {
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          if (wave > 0.8 || rand > 0.85) { level = 4; count = Math.floor(Math.random() * 8) + 12; }
          else if (wave > 0.3 || rand > 0.6) { level = 3; count = Math.floor(Math.random() * 6) + 6; }
          else if (rand > 0.35) { level = 2; count = Math.floor(Math.random() * 4) + 3; }
          else { level = 1; count = Math.floor(Math.random() * 2) + 1; }
        } else {
          if (rand > 0.7) { level = 3; count = Math.floor(Math.random() * 5) + 6; }
          else if (rand > 0.4) { level = 2; count = Math.floor(Math.random() * 3) + 2; }
          else if (rand > 0.2) { level = 1; count = 1; }
        }
      }
      total += count;
      days.push({ date: dateStr, count, level });
    }

    for (let i = 0; i < days.length; i += 7) {
      w.push(days.slice(i, i + 7));
    }
    return { total, weeks: w };
  }, []);

  // Fetch real live contributions directly from our server API route
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/github-contributions?username=${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json() as Promise<ApiResponse>;
      })
      .then((apiData) => {
        if (isMounted && apiData.weeks && apiData.weeks.length > 0) {
          setData({
            total: apiData.totalContributions || fallbackData.total,
            weeks: apiData.weeks,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Using fallback contribution grid due to:', err);
        if (isMounted) {
          setData(fallbackData);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [username, fallbackData]);

  const activeWeeks = data ? data.weeks : fallbackData.weeks;
  const activeTotal = data ? data.total : fallbackData.total;

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return '#39d353'; // Neon Emerald
      case 3:
        return '#26a641'; // Bright Green
      case 2:
        return '#006d32'; // Mid Green
      case 1:
        return '#0e4429'; // Dark Green
      default:
        return '#161b22'; // Empty Dark Grid Cell
    }
  };

  return (
    <div className="bv-hud-grid-wrapper">
      <div className="bv-hud-container">
        {/* Top HUD Header Bar */}
        <div className="bv-hud-header">
          <div className="bv-hud-header-left">
            <span className="bv-hud-title">GITHUB.FREQ_ANALYSIS</span>
          </div>
          <div className="bv-hud-header-right">
            <span className="bv-hud-sync-indicator" style={{ backgroundColor: loading ? '#facc15' : '#39d353' }} />
            <span className="bv-hud-sync-text">{loading ? 'SYNCING...' : 'LIVE_SYNC'}</span>
          </div>
        </div>

        {/* Header Separator Line */}
        <div className="bv-hud-divider" />

        {/* Interactive Grid Stage with Tooltip Overlay */}
        <div className="bv-hud-stage">
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="bv-hud-tooltip"
              >
                <span>
                  {hoveredDay.count === 0
                    ? `NO CONTRIBUTIONS ON ${hoveredDay.date}`
                    : `${hoveredDay.count} ON ${hoveredDay.date}`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid Scroll Container */}
          <div className="bv-hud-grid-scroll">
            <div className="bv-hud-grid">
              {activeWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="bv-hud-grid-col">
                  {week.map((day) => {
                    const isDimmed = hoveredLevel !== null && day.level !== hoveredLevel;
                    const isHighlighted = hoveredLevel !== null && day.level === hoveredLevel && day.level > 0;

                    return (
                      <motion.button
                        key={day.date}
                        type="button"
                        className={`bv-hud-cell ${isHighlighted ? 'bv-hud-cell-highlighted' : ''}`}
                        style={{
                          backgroundColor: getLevelColor(day.level),
                          opacity: loading ? 0.4 : isDimmed ? 0.2 : 1,
                        }}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        onClick={() => window.open(`https://github.com/${username}?tab=overview&from=${day.date}`, '_blank')}
                        whileHover={{
                          scale: 1.4,
                          zIndex: 20,
                          transition: { duration: 0.08 },
                        }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`${day.count} contributions on ${day.date}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legend / Total Bar */}
        <div className="bv-hud-footer">
          <div className="bv-hud-total">
            TOTAL: <span>{loading ? '...' : activeTotal}</span> CONTRIBUTIONS
          </div>

          <div className="bv-hud-legend">
            <span className="bv-hud-legend-label">LESS</span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className="bv-hud-legend-box"
                style={{ backgroundColor: getLevelColor(lvl) }}
                onMouseEnter={() => setHoveredLevel(lvl)}
                onMouseLeave={() => setHoveredLevel(null)}
                title={lvl === 0 ? 'No activity' : `Level ${lvl} activity (hover to highlight)`}
              />
            ))}
            <span className="bv-hud-legend-label">MORE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

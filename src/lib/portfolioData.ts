import {
  achievementsData,
  projectsData,
  skillsData,
  siteData,
  stats,
} from '@/lib/content';

/** Game overlay copy derived from portfolio JSON (no parallel drift). */
export const portfolioData = {
  skills: skillsData.flatMap((c) => c.skills).slice(0, 8),
  projects: projectsData
    .filter((p) => p.featured)
    .slice(0, 6)
    .map((p) => `${p.title}${p.tagline ? ` — ${p.tagline}` : ''}`),
  coinFacts: [
    ...achievementsData.slice(0, 4).map((a) => a.title),
    `Built this retro OS portfolio from scratch.`,
    `${stats.experienceCount}+ roles. Still shipping.`,
  ],
  achievements: achievementsData.slice(0, 3).map((a) => a.title),
  levelClear: [
    'Level clear! Projects shipped that matter.',
    `Underground clear! ${stats.skillCount}+ tech tools touched.`,
  ],
  bossDefeat: `World complete. ${siteData.name} — ${siteData.tagline}. Ready to ship for you.`,
};

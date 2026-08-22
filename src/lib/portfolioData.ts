import {
  achievementsData,
  projectsData,
  skillsData,
  siteData,
  stats,
} from '@/lib/content';

/**
 * High-signal skills first for in-game "SKILL UNLOCKED" toasts.
 * (Previously only the first 8 flatMap entries: Python…HTML/CSS — weak variety.)
 */
const GAME_SKILL_PRIORITY = [
  'Next.js',
  'React.js',
  'Python',
  'Machine Learning',
  'AI Agents',
  'Computer Vision',
  'TensorFlow/PyTorch',
  'AI System Design',
  'Neural Networks',
  'YOLO',
  'NLP',
  'Transformers',
  'MediaPipe',
  'Google AI Studio',
  'FastAPI',
  'Node.js',
  'MERN Stack',
  'SvelteKit',
  'Express',
  'REST APIs',
  'WebSockets',
  'Socket.io',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Firebase',
  'PostGIS',
  'Flutter',
  'IoT & Embedded Systems',
  'ESP32',
  'Raspberry Pi',
  'Arduino Mega',
  'Robotics Automation',
  'Sensors',
  'Docker',
  'Enterprise Architecture',
  'TOGAF ADM',
  'ArchiMate',
  'Chrome Extension API',
  'JavaScript',
  'C/C++',
  'Svelte',
  'MySQL',
  'Figma',
  'UI/UX',
  'API Integration',
  'IBM Cloud',
  'Celery',
  'Data Analysis',
] as const;

const SKIP_GAME_CATEGORIES = new Set(['Soft Skills & Management']);

function buildGameSkills(): string[] {
  const catalog = skillsData
    .filter((c) => !SKIP_GAME_CATEGORIES.has(c.categoryName))
    .flatMap((c) => c.skills);

  const have = new Set(catalog);
  const ordered: string[] = [];
  const used = new Set<string>();

  for (const s of GAME_SKILL_PRIORITY) {
    if (have.has(s) && !used.has(s)) {
      ordered.push(s);
      used.add(s);
    }
  }
  // Remaining tech skills after priority (still tech — not soft-skills)
  for (const s of catalog) {
    if (!used.has(s)) {
      ordered.push(s);
      used.add(s);
    }
  }
  return ordered;
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Game overlay copy derived from portfolio JSON (no parallel drift). */
export const portfolioData = {
  skills: buildGameSkills(),
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
  bossDefeat: `Plot twist — you're not just beating a boss screen.

You played through my projects, collected the skills, and stayed till the end. Be honest: I caught your attention, didn't I?

If this journey felt fun, imagine what ${siteData.name.split(' ')[0]} would ship on your team.`,
};

// Draw bag: no-repeat until every skill has been shown once, then reshuffle.
let skillBag: string[] = [];

/**
 * Next skill toast for Q-blocks — cycles through high-impact skills without
 * dumping HTML/CSS every other hit.
 */
export function drawGameSkill(): string {
  if (skillBag.length === 0) {
    skillBag = shuffleInPlace([...portfolioData.skills]);
  }
  return skillBag.pop() ?? portfolioData.skills[0] ?? 'Next.js';
}

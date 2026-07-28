import type { ReactElement } from 'react';

type IconProps = { size?: number };

const IconBase = ({ src, size = 48, alt }: { src: string; size?: number; alt: string }) => (
  <img
    src={src}
    width={size}
    height={size}
    alt={alt}
    style={{
      filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))',
    }}
  />
);

export function XpStartLogo({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <rect x="0.5" y="0.5" width="6.5" height="6.5" rx="0.5" fill="#e03c3c" stroke="#8b0000" strokeWidth="0.4" />
      <rect x="9" y="0.5" width="6.5" height="6.5" rx="0.5" fill="#3cb43c" stroke="#006400" strokeWidth="0.4" />
      <rect x="0.5" y="9" width="6.5" height="6.5" rx="0.5" fill="#3c6ce0" stroke="#00008b" strokeWidth="0.4" />
      <rect x="9" y="9" width="6.5" height="6.5" rx="0.5" fill="#e0c03c" stroke="#8b7500" strokeWidth="0.4" />
    </svg>
  );
}

export const IconRecycle = (p: IconProps) => <IconBase src="/icons/recycle-bin.png?v=2" alt="Recycle Bin" {...p} />;
export const IconComputer = (p: IconProps) => <IconBase src="/icons/system-info.png?v=2" alt="My Computer" {...p} />;
export const IconUser = (p: IconProps) => <IconBase src="/icons/about.svg?v=3" alt="User" {...p} />;
export const IconFolder = (p: IconProps) => <IconBase src="/icons/projects.png?v=2" alt="Folder" {...p} />;
export const IconCode = (p: IconProps) => <IconBase src="/icons/readme.png?v=2" alt="Text File" {...p} />;
export const IconCpu = (p: IconProps) => <IconBase src="/icons/skills.svg?v=3" alt="CPU" {...p} />;
export const IconBriefcase = (p: IconProps) => <IconBase src="/icons/experience.png?v=2" alt="Briefcase" {...p} />;
export const IconTrophy = (p: IconProps) => <IconBase src="/icons/achievements.png?v=2" alt="Trophy" {...p} />;
export const IconPdf = (p: IconProps) => <IconBase src="/icons/readme.png?v=2" alt="PDF" {...p} />; // Fallback to text icon
export const IconGlobe = (p: IconProps) => <IconBase src="/icons/browser.png?v=2" alt="Internet" {...p} />;
export const IconMail = (p: IconProps) => <IconBase src="/icons/contact.png?v=2" alt="Mail" {...p} />;
export const IconGame = (p: IconProps) => <IconBase src="/icons/game.svg?v=2" alt="Game" {...p} />;
export const IconInfo = (p: IconProps) => <IconComputer {...p} />;

export const XP_ICONS: Record<string, (p: IconProps) => ReactElement> = {
  readme: IconCode,
  about: IconUser,
  projects: IconFolder,
  skills: IconCpu,
  experience: IconBriefcase,
  achievements: IconTrophy,
  resume: IconPdf,
  browser: IconGlobe,
  contact: IconMail,
  game: IconGame,
  'system-info': IconComputer,
  'recycle-bin': IconRecycle,
};

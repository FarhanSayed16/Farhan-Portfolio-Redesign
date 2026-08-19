// Content type definitions and data loader
// Single import point for all portfolio content from data/content/*.json

import siteJson from '@data/content/site.json';
import aboutJson from '@data/content/about.json';
import projectsJson from '@data/content/projects.json';
import skillsJson from '@data/content/skills.json';
import experienceJson from '@data/content/experience.json';
import achievementsJson from '@data/content/achievements.json';
import certificationsJson from '@data/content/certifications.json';
import testimonialsJson from '@data/content/testimonials.json';
import volunteeringJson from '@data/content/volunteering.json';
import researchJson from '@data/content/research.json';

// ── TYPE DEFINITIONS ──────────────────────────────────────────

export interface SiteData {
  name: string;
  tagline: string;
  taglineShort: string;
  roles: string[];
  location: string;
  availability: string;
  profileImage: string;
  /** Circle crop on the site (CSS object-position). Tune at /tune-photo */
  profileFocus?: { x: number; y: number; zoom?: number };
  /** Square crop for Google / OG. Tune separately at /tune-photo */
  squareFocus?: { x: number; y: number; zoom?: number };
  resumeUrl: string;
  metaDescription: string;
  socialLinks: {
    email: string;
    personalEmail?: string;
    github: string;
    linkedin: string;
    /** E.164 digits only, e.g. 919867868597 */
    whatsapp?: string;
  };
}

export interface TimelineEntry {
  title: string;
  year: string;
  description: string;
}

export interface AboutData {
  bio: string;
  timeline: TimelineEntry[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  role: string;
  award: string | null;
  shortDescription: string;
  problem?: string | null;
  solution?: string | null;
  impact?: string | null;
  image: string;
  media?: string[];
  tech: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  /** Primary axis for colors / legacy filters */
  category: string;
  /**
   * Explorer folders this project lives in (multi-surface work sits in many).
   * Falls back to [category] when omitted.
   */
  folders?: string[];
  featured: boolean;
  archived: boolean;
}

/** Explorer folder ids and stable display order */
export const PROJECT_FOLDER_META: { id: string; label: string }[] = [
  { id: 'platforms', label: 'Platforms' },
  { id: 'ai', label: 'AI Systems' },
  { id: 'hardware', label: 'Hardware · IoT' },
  { id: 'web', label: 'Web · Commerce' },
];

export function projectFolders(p: Project): string[] {
  if (p.folders?.length) return p.folders;
  // Map legacy single categories into the new tree
  if (p.category === 'robotics') return ['hardware'];
  if (p.category === 'mobile') return ['platforms'];
  if (p.category === 'ai') return ['ai'];
  return [p.category || 'web'];
}

export interface SkillCategory {
  categoryName: string;
  skills: string[];
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Achievement {
  title: string;
  description: string;
  level: string;
  year: string;
  place: string;
  link: string | null;
  images?: string[];
  gridSize?: 'large' | 'medium' | 'small' | 'wide' | 'square';
  fit?: 'contain' | 'cover';
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  description: string;
  url: string;
  image?: string;
  featured?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  organization: string;
  content: string;
  avatar: string;
  image?: string;
}

export interface Volunteering {
  role: string;
  organization: string;
  duration: string;
  description: string;
}

export interface ResearchEntry {
  title: string;
  interests: string[];
  links: string[];
}

// ── EXPORTED DATA ─────────────────────────────────────────────

export const siteData: SiteData = siteJson as SiteData;
export const aboutData: AboutData = aboutJson as AboutData;
export const projectsData: Project[] = projectsJson as Project[];
export const skillsData: SkillCategory[] = skillsJson as SkillCategory[];
export const experienceData: Experience[] = experienceJson as Experience[];
export const achievementsData: Achievement[] = achievementsJson as Achievement[];
export const certificationsData: Certification[] = certificationsJson as Certification[];
export const testimonialsData: Testimonial[] = testimonialsJson as Testimonial[];
export const volunteeringData: Volunteering[] = volunteeringJson as Volunteering[];
export const researchData: ResearchEntry[] = researchJson as ResearchEntry[];

/** Bare address — never includes `mailto:` */
export function getEmailAddress(): string {
  return siteData.socialLinks.email.replace(/^mailto:/i, '').trim();
}

/** Safe `mailto:` href for anchors / window.open */
export function getMailtoHref(subject?: string, body?: string): string {
  const base = `mailto:${getEmailAddress()}`;
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

/** WhatsApp click-to-chat (requires socialLinks.whatsapp as E.164 digits) */
export function getWhatsAppHref(prefill?: string): string | null {
  const raw = siteData.socialLinks.whatsapp?.replace(/\D/g, '');
  if (!raw) return null;
  const base = `https://wa.me/${raw}`;
  if (!prefill) return base;
  return `${base}?text=${encodeURIComponent(prefill)}`;
}

// ── DERIVED COUNTS ────────────────────────────────────────────

export const stats = {
  projectCount: projectsData.length,
  featuredProjectCount: projectsData.filter(p => p.featured).length,
  skillCount: skillsData.reduce((sum, cat) => sum + cat.skills.length, 0),
  certCount: certificationsData.length,
  achievementCount: achievementsData.length,
  experienceCount: experienceData.length,
};

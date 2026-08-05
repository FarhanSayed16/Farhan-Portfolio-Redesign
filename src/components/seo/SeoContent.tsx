import {
  aboutData,
  achievementsData,
  experienceData,
  projectsData,
  siteData,
  skillsData,
  stats,
} from '@/lib/content';

/**
 * Server-rendered, screen-reader-oriented copy so crawlers (and a11y tools)
 * get a real HTML document for the client-heavy Farhan OS shell.
 * Visually clipped — not display:none keyword spam; genuine page content.
 */
export default function SeoContent() {
  const featured = projectsData.filter((p) => p.featured && !p.archived);
  const topAchievements = achievementsData.slice(0, 6);
  const skillLabels = skillsData.flatMap((c) => c.skills).slice(0, 40);

  return (
    <main id="seo-about" className="seo-crawl" tabIndex={-1}>
      <header>
        <h1>{siteData.name}</h1>
        <p>
          {siteData.tagline} · {siteData.location}
        </p>
        <p>{siteData.taglineShort}</p>
        <p>
          Also known as Farhan, Farhan Builds, farhanbuilds, and{' '}
          {siteData.roles.join(', ')}.
        </p>
      </header>

      <section aria-labelledby="seo-bio-heading">
        <h2 id="seo-bio-heading">About</h2>
        <p>{aboutData.bio}</p>
        <p>
          {stats.projectCount} projects · {stats.certCount}+ certifications ·{' '}
          {stats.achievementCount} achievements · {siteData.availability}
        </p>
      </section>

      <section aria-labelledby="seo-work-heading">
        <h2 id="seo-work-heading">Selected work</h2>
        <ul>
          {featured.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              {p.award ? ` — ${p.award}` : ''}
              {': '}
              {p.shortDescription}
              {p.demoUrl ? (
                <>
                  {' '}
                  <a href={p.demoUrl} rel="noopener noreferrer">
                    Live demo
                  </a>
                </>
              ) : null}
              {p.repoUrl ? (
                <>
                  {' '}
                  <a href={p.repoUrl} rel="noopener noreferrer">
                    Source
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="seo-achievements-heading">
        <h2 id="seo-achievements-heading">Achievements</h2>
        <ul>
          {topAchievements.map((a) => (
            <li key={`${a.title}-${a.year}`}>
              <strong>{a.title}</strong>
              {a.place ? ` (${a.place})` : ''}
              {a.year ? ` · ${a.year}` : ''}
              {a.level ? ` · ${a.level}` : ''}
              {a.description ? ` — ${a.description}` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="seo-experience-heading">
        <h2 id="seo-experience-heading">Experience</h2>
        <ul>
          {experienceData.map((e) => (
            <li key={`${e.company}-${e.role}`}>
              <strong>
                {e.role} · {e.company}
              </strong>
              {e.duration ? ` (${e.duration})` : ''}
              {e.description ? ` — ${e.description}` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="seo-skills-heading">
        <h2 id="seo-skills-heading">Skills</h2>
        <p>{skillLabels.join(' · ')}</p>
      </section>

      <section aria-labelledby="seo-contact-heading">
        <h2 id="seo-contact-heading">Contact</h2>
        <p>
          <a href={`mailto:${siteData.socialLinks.email}`}>
            {siteData.socialLinks.email}
          </a>
          {' · '}
          <a href={siteData.socialLinks.linkedin} rel="me noopener noreferrer">
            LinkedIn
          </a>
          {' · '}
          <a href={siteData.socialLinks.github} rel="me noopener noreferrer">
            GitHub
          </a>
          {' · '}
          <a href={siteData.resumeUrl}>Resume (PDF)</a>
          {' · '}
          <a href="/connectQR">Connect card / QR</a>
        </p>
      </section>
    </main>
  );
}

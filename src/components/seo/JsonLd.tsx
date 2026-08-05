import { aboutData, siteData } from '@/lib/content';

const SITE_URL = 'https://farhanbuilds.in';
const PROFILE_IMAGE = `${SITE_URL}${siteData.profileImage}`;

/**
 * Person + WebSite graph for Google rich results / Knowledge Panel signals.
 * alternateName stays modest (real aliases, not misspelling spam).
 */
export default function JsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Farhan OS',
        alternateName: ['farhanbuilds.in', 'Farhan Builds', siteData.name],
        description: siteData.metaDescription,
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: siteData.name,
        alternateName: [
          'Farhan',
          'Farhan Builds',
          'farhanbuilds',
          'sayed farhan',
          'Farhan Sayed Mumbai',
          'farhansayed16',
        ],
        url: SITE_URL,
        image: {
          '@type': 'ImageObject',
          url: PROFILE_IMAGE,
          caption: siteData.name,
        },
        jobTitle: siteData.tagline,
        description: aboutData.bio,
        email: siteData.socialLinks.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        knowsAbout: [
          'Artificial Intelligence',
          'Full-Stack Development',
          'Robotics',
          'Enterprise Architecture',
          'Government Platforms',
          'Next.js',
          'React',
          'Machine Learning',
        ],
        sameAs: [siteData.socialLinks.linkedin, siteData.socialLinks.github],
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'VSIT Mumbai',
        },
        award: 'Smart India Hackathon 2025 National Winner',
        knowsLanguage: ['en', 'hi'],
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: `${siteData.name} — Portfolio`,
        description: siteData.metaDescription,
        mainEntity: { '@id': `${SITE_URL}/#person` },
        about: { '@id': `${SITE_URL}/#person` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

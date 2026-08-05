import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Press_Start_2P, Outfit, Syne } from 'next/font/google';
import './globals.css';
import SecurityClient from '@/components/shared/SecurityClient';

// Import site data for metadata (static import works in Server Components)
import siteJson from '../../data/content/site.json';

// preload: false — first paint is XP/Tahoma; these fonts load when their CSS is used
// (Browser / ConnectQR / mobile / game). Avoids “preloaded but not used” console spam.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
  preload: false,
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: false,
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://farhanbuilds.in'),
  title: {
    default: `${siteJson.name} — AI & Full-Stack Engineer | SIH 2025 Winner`,
    template: `%s · ${siteJson.name}`,
  },
  description: siteJson.metaDescription,
  keywords: [
    'Farhan Sayed',
    'Farhan Builds',
    'farhanbuilds',
    'sayed farhan',
    'Farhan Sayed Mumbai',
    'AI Full Stack Engineer',
    'Full Stack Developer Mumbai',
    'Smart India Hackathon 2025 Winner',
    'SIH 2025',
    'Robotics Developer',
    'Government platforms',
    'Next.js Developer',
    'Portfolio',
  ],
  authors: [{ name: siteJson.name, url: 'https://farhanbuilds.in' }],
  creator: siteJson.name,
  publisher: siteJson.name,
  category: 'technology',
  alternates: {
    canonical: 'https://farhanbuilds.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://farhanbuilds.in',
    siteName: 'farhanbuilds.in',
    title: `${siteJson.name} — AI & Full-Stack Engineer · SIH 2025 Winner`,
    description: siteJson.metaDescription,
    images: [
      {
        url: siteJson.profileImage,
        width: 800,
        height: 1000,
        alt: `${siteJson.name} — AI & Full-Stack Engineer, Mumbai`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteJson.name} — AI & Full-Stack Engineer · SIH 2025 Winner`,
    description: siteJson.metaDescription,
    images: [siteJson.profileImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} ${outfit.variable} ${syne.variable}`}
    >
      <body>
        {children}
        <SecurityClient />
        <noscript>
          <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
            <h1>Farhan Sayed</h1>
            <p>AI &amp; Full-Stack Engineer — Mumbai, India · Smart India Hackathon 2025 National Winner</p>
            <p>{siteJson.metaDescription}</p>
            <p>
              <a href="/resume.pdf">Resume (PDF)</a>
              {' · '}
              <a href={`mailto:${siteJson.socialLinks.email}`}>Email</a>
              {' · '}
              <a href={siteJson.socialLinks.linkedin}>LinkedIn</a>
              {' · '}
              <a href={siteJson.socialLinks.github}>GitHub</a>
              {' · '}
              <a href="/connectQR">Connect card</a>
            </p>
            <p>Enable JavaScript for the interactive Farhan OS portfolio experience.</p>
          </div>
        </noscript>
      </body>
    </html>
  );
}

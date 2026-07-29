import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono, Press_Start_2P, Outfit, Syne } from 'next/font/google';
import './globals.css';

// Import site data for metadata (static import works in Server Components)
import siteJson from '../../data/content/site.json';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://farhanbuilds.in'),
  title: `${siteJson.name} — ${siteJson.tagline}`,
  description: siteJson.metaDescription,
  keywords: [
    'Farhan Sayed',
    'Full Stack Developer',
    'AI Developer',
    'Portfolio',
    'Smart India Hackathon',
    'Mumbai',
  ],
  authors: [{ name: siteJson.name }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://farhanbuilds.in',
    siteName: "Farhan OS",
    title: `${siteJson.name} — ${siteJson.tagline}`,
    description: siteJson.metaDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${siteJson.name} — Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteJson.name} — ${siteJson.tagline}`,
    description: siteJson.metaDescription,
    images: ['/og-image.png'],
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} ${outfit.variable} ${syne.variable}`}
    >
      <body>
        {children}
        <noscript>
          <div className="md:hidden flex flex-col items-center justify-center min-h-screen bg-[#008080] text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-4 font-os">Farhan OS</h1>
            <p>AI & FULL-STACK ENGINEER — Mumbai, India</p>
            <p>Smart India Hackathon 2025 Winner • 11 Projects • 35+ Certifications</p>
            <p>
              <a href="/resume.pdf">Download Resume</a> |{' '}
              <a href="mailto:farhanbuilds16@gmail.com">Contact</a>
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}

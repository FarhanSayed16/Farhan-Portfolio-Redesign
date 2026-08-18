import type { Metadata, Viewport } from 'next';
import UnlockScroll from './UnlockScroll';
import './connect.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070707',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Connect',
  description:
    'Connect with Farhan Sayed (Farhan Builds) — AI & Full-Stack Engineer · SIH 2025 National Winner · Mumbai. LinkedIn, GitHub, resume, portfolio.',
  alternates: {
    canonical: 'https://farhanbuilds.in/connectQR',
  },
  openGraph: {
    title: 'Farhan Sayed — Connect',
    description:
      'AI & Full-Stack Engineer · SIH 2025 National Winner · Mumbai. Save contact, LinkedIn, resume.',
    url: 'https://farhanbuilds.in/connectQR',
    siteName: 'farhanbuilds.in',
    images: [
      {
        url: '/images/farhan-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Farhan Sayed',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Farhan Sayed — Connect',
    description: 'AI & Full-Stack Engineer · SIH 2025 National Winner · Mumbai.',
    images: ['/images/farhan-square.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cq-root">
      <UnlockScroll />
      {children}
    </div>
  );
}

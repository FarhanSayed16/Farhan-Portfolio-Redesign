import type { Metadata } from 'next';
import TunePhotoClient from './TunePhotoClient';

export const metadata: Metadata = {
  title: 'Tune portrait',
  robots: { index: false, follow: false },
};

export default function TunePhotoPage() {
  return <TunePhotoClient />;
}

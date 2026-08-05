import HomeClient from './HomeClient';
import SeoContent from '@/components/seo/SeoContent';
import JsonLd from '@/components/seo/JsonLd';

/**
 * Server shell: crawlable HTML + JSON-LD first, interactive Farhan OS client second.
 */
export default function Home() {
  return (
    <>
      <JsonLd />
      <SeoContent />
      <HomeClient />
    </>
  );
}

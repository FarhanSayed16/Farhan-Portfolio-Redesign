import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.101'],
  async redirects() {
    return [
      {
        source: '/card',
        destination: '/connectQR',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

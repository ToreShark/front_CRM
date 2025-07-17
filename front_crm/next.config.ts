import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Proxy для dev режима
  async rewrites() {
    // Только в dev режиме
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3000/:path*'
        }
      ];
    }
    return [];
  }
};

export default nextConfig;

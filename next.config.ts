import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'plp.moeys.gov.kh', 'tarl.dashboardkh.com'],
    minimumCacheTTL: 60,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',

  // Optimize production builds
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Generate unique build IDs to force cache invalidation
  generateBuildId: async () => {
    // Include timestamp to force new chunk filenames and bypass cache
    const timestamp = Date.now();
    if (process.env.NODE_ENV === 'production') {
      return `build-${process.env.VERCEL_GIT_COMMIT_SHA || 'production'}-${timestamp}`;
    }
    return `build-${timestamp}`;
  },

  // Optimized caching strategy
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
};

export default nextConfig;

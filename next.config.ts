import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'plp.moeys.gov.kh', 'tarl.dashboardkh.com'],
    minimumCacheTTL: 86400, // 24 hours caching for images
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'lib'],
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

  // Use git commit hash for stable build IDs (better CDN cache hit rate)
  generateBuildId: async () => {
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    // Fallback to git commit hash locally
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse HEAD').toString().trim();
    } catch {
      return 'development';
    }
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
    // Enable parallel build processing
    workerThreads: false,
    cpus: 2,
  },

  // Optimize for production builds
  swcMinify: true,
};

export default nextConfig;

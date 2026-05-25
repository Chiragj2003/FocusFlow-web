import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Allow Server Actions from forwarded hosts (GitHub Codespaces, etc.)
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev',
        '*.github.dev',
        '*.vercel.app',
      ],
    },
    // Enable optimizations
    optimizePackageImports: ['lucide-react', '@clerk/nextjs', 'recharts'],
  },

  // CORS headers for API routes (mobile app support)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Enable gzip/brotli compression
  compress: true,

  // Reduce bundle size by excluding unused packages from client
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
};

export default nextConfig;

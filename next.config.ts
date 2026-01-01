import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark Prisma packages as external to avoid bundling issues
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon', '@neondatabase/serverless'],

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

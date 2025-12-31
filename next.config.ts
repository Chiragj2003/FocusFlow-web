import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15 uses Webpack by default (no Turbopack)
  
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
  },
};

export default nextConfig;

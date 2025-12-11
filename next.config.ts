import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15 uses Webpack by default (no Turbopack)
  
  // Mark Prisma packages as external to avoid bundling issues
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon', '@neondatabase/serverless'],
};

export default nextConfig;

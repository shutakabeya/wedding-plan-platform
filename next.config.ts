import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // 開発環境での画像最適化エラーを回避
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;

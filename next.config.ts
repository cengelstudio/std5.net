import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'std5.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

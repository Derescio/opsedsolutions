import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },    
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
    // domains: ['cdn.sanity.io'],
  },
  transpilePackages: ['next-sanity'],
  // Set outputFileTracingRoot to silence lockfile warning
  outputFileTracingRoot: path.join(__dirname),
  // darkMode: 'class',
};

export default nextConfig;

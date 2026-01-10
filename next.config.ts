import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' }, // Spotify
      { protocol: 'https', hostname: 'placehold.co' }, // Placeholders
      { protocol: 'https', hostname: 'assets.leetcode.com' }, // LeetCode
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' }, // GitHub
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' }, // Goodreads Legacy
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;

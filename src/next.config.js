/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.mcpilled.com",
        port: "",
      },
    ],
    unoptimized: true, // This helps with Netlify deployment
  },
  // Disable static optimization for problematic pages
  experimental: {
    // This disables automatic static optimization for all pages
    disableOptimizedLoading: true,
  },
  // This helps with Netlify deployment
  output: 'standalone',
  async redirects() {
    return [
      {
        source: "/feed",
        destination: "/feed.xml",
        permanent: true,
      },
      { source: "/suggest", destination: "/contribute", permanent: true },
      { source: "/charts", destination: "/charts/top", permanent: false },
    ];
  },
};

module.exports = nextConfig;

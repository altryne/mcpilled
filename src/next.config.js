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
  },
  experimental: {
    disableOptimizedLoading: true,
  },
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

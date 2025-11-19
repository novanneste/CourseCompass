import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore type errors during build if needed
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

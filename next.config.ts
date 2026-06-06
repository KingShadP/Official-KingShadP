import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  transpilePackages: ["three"],
  webpack: (config: any, { dev }: { dev: boolean }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.ksonsgroup.com",
      },
    ],
  },
  allowedDevOrigins: ["192.168.8.38"],
};

export default nextConfig;
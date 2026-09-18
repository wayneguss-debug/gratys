import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jbwrnvmidjvcnkexjsqj.supabase.co",
        pathname: "/storage/v1/object/public/media/**"
      }
    ]
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/get-involved/contact-legislator",
        destination: "/get-involved/toolkit",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/magaza/cineplato",
        destination: "/magaza/cinegreen",
        permanent: true,
      },
      {
        source: "/magaza/cineplato/:path*",
        destination: "/magaza/cinegreen",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

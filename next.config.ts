import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Files upload directly from the browser to Supabase Storage now, so
      // this only needs to cover text content + small attachment metadata.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;

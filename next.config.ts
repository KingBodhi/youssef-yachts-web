import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the signature font is bundled into the waiver API serverless function.
  outputFileTracingIncludes: {
    "/api/waivers": ["./src/lib/pdf/fonts/**"],
  },
};

export default nextConfig;

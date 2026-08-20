import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the signature font is bundled into the waiver API serverless function.
  outputFileTracingIncludes: {
    "/api/waivers": ["./src/lib/pdf/fonts/**"],
  },
  experimental: {
    // Turbopack's persistent dev cache (default-on since Next 16.1) corrupts and
    // desyncs server/client bundles, causing ChunkLoadError, DB-corruption panics,
    // and hydration mismatches. Disable it; dev compiles stay fast in memory.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;

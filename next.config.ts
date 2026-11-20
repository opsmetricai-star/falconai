import type { NextConfig } from "next";

// cacheComponents is left off: the dashboard is per-user and the API routes use
// route-segment config (runtime / dynamicParams), which that mode disallows.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

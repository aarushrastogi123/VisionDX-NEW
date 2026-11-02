import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the 4317 dev server's build state separate from a pre-existing server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev-4317" : ".next",
};

export default nextConfig;

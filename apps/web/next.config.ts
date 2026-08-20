import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Monorepo: lockfile lives at repo root
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;

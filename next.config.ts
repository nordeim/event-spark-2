import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // The hosting sandbox fronts the dev server with a per-session preview
  // subdomain (*.space-z.ai); without this, Next 16 warns on cross-origin
  // /_next/* requests and will block them in a future major.
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;

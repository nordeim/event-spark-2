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
  // Conservative baseline security headers for a pure content site.
  // CSP is deliberately omitted (framer-motion/Tailwind inline styles would
  // require unsafe-inline); add CSP/frame-ancestors at the edge when deployed.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

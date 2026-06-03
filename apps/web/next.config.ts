import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const backendOrigin =
  process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  transpilePackages: ["@mazad/api", "@mazad/auth", "@mazad/config", "@mazad/ui"],
  // Django requires trailing slashes; don't 308-strip them on POST /api/v1/.../
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      // Paths with trailing slash (Django default) — must be listed first
      {
        source: "/api/:path*/",
        destination: `${backendOrigin}/api/:path*/`,
      },
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

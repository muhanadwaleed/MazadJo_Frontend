import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@mazad/api", "@mazad/auth", "@mazad/config", "@mazad/ui"],
  // Django requires trailing slashes; don't 308-strip them on POST /api/v1/.../
  skipTrailingSlashRedirect: true,
  // API proxying is handled by the runtime route handler at /api/[...path]
  // so env vars are read at request time, not baked in at build time.
};

export default withNextIntl(nextConfig);

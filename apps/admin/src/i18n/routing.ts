import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  /** `/en/…` and `/ar/…` — same URL pattern as the consumer web app */
  localePrefix: "always",
  /**
   * Rely on the URL after the user picks a language. With detection on,
   * middleware can redirect back to the cookie locale and the switcher looks broken.
   */
  localeDetection: false,
});

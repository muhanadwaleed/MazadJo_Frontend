import type { Locale } from "@/i18n/routing";

/** BCP 47 tag for Intl APIs (Jordan). */
export function intlLocale(locale: Locale | string): string {
  return locale === "ar" ? "ar-JO" : "en-JO";
}

export function isRtl(locale: Locale | string): boolean {
  return locale === "ar";
}

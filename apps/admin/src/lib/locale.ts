import type { Locale } from "@/i18n/routing";

export function isRtl(locale: Locale | string): boolean {
  return locale === "ar";
}

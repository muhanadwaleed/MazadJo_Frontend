import { intlLocale } from "@/lib/locale";
import type { Locale } from "@/i18n/routing";

export function formatMoney(
  value: string | number,
  locale: Locale | string = "en",
  currency = "JOD"
) {
  const amount = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(iso: string, locale: Locale | string = "en") {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function displayName(
  profile: {
    full_name_en?: string;
    full_name_ar?: string;
    username: string;
  },
  locale: Locale | string = "en"
) {
  if (locale === "ar") {
    return profile.full_name_ar || profile.full_name_en || profile.username;
  }
  return profile.full_name_en || profile.full_name_ar || profile.username;
}

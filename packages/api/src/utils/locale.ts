/** Pick localized text from bilingual API fields. */
export function pickLocalized(
  locale: string,
  ar: string | null | undefined,
  en: string | null | undefined
): string {
  if (locale.startsWith("ar")) {
    return ar || en || "";
  }
  return en || ar || "";
}

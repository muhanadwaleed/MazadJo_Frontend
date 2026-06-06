/** Matches a leading locale segment used by next-intl (`/en`, `/ar`). */
export const LOCALE_SEGMENT_PATTERN = /^\/(en|ar)(?=\/|$)/;

/** Remove a leading `/en` or `/ar` segment for next-intl navigation paths. */
export function stripLocalePrefix(path: string): string {
  const match = path.match(LOCALE_SEGMENT_PATTERN);
  if (!match) return path;
  const rest = path.slice(match[0].length);
  return rest === "" ? "/" : rest;
}

/** Prefix a path with the locale from the current URL (for plain Next.js router). */
export function withLocalePrefix(path: string, pathname?: string): string {
  const base = path.startsWith("/") ? path : `/${path}`;
  if (LOCALE_SEGMENT_PATTERN.test(base)) return base;

  const source =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const match = source.match(LOCALE_SEGMENT_PATTERN);
  if (!match) return base;

  return `/${match[1]}${base}`;
}

import { stripLocalePrefix } from "./locale-path";

/**
 * Validates post-login redirect targets — same-app relative paths only.
 * Returns locale-agnostic paths for next-intl navigation.
 */
export function sanitizeInternalPath(
  next: string | null | undefined,
  fallback: string
): string {
  if (!next) return fallback;

  const value = next.trim();
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes(":") || value.includes("\\")) return fallback;

  return stripLocalePrefix(value);
}

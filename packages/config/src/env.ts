const API_V1_SUFFIX = "/api/v1";

/**
 * Ensures every API base ends with `/api/v1` (MazadJo_Backend contract).
 * Accepts `http://localhost:8000`, `http://localhost:8000/api/v1`, or `/api/v1`.
 */
export function normalizeApiBaseUrl(raw: string | undefined, fallback: string): string {
  const value = (raw?.trim() || fallback).replace(/\/$/, "");
  if (!value) return fallback;

  if (value.endsWith(API_V1_SUFFIX)) return value;

  if (value.endsWith("/api")) return `${value}/v1`;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return `${value}${API_V1_SUFFIX}`;
  }

  if (value === "/api") return API_V1_SUFFIX;

  return value.startsWith("/") ? value : fallback;
}

/** Public env vars (client-safe). */
export const env = {
  /** Browser: prefer `/api/v1` so Next.js proxies to Django */
  publicApiUrl: normalizeApiBaseUrl(
    process.env.NEXT_PUBLIC_API_URL,
    "/api/v1"
  ),
  /** Server Components: absolute URL to Django */
  serverApiUrl: normalizeApiBaseUrl(
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL,
    "http://127.0.0.1:8000/api/v1"
  ),
} as const;

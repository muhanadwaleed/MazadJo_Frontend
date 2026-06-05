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
  /**
   * Browser API base — always the relative proxy path.
   * The browser NEVER calls the backend directly; all requests go through
   * the Next.js /api/[...path] route handler which reads API_URL at
   * request time and proxies server-side.  This avoids CORS entirely and
   * means NEXT_PUBLIC_API_URL has no effect on browser calls.
   */
  publicApiUrl: "/api/v1" as string,

  /**
   * Server Components API base — absolute URL to Django.
   * Set API_URL=https://your-backend.up.railway.app in Railway.
   */
  serverApiUrl: normalizeApiBaseUrl(
    process.env.API_URL,
    "http://127.0.0.1:8000/api/v1"
  ),
} as const;

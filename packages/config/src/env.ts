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
   * Browser API base — absolute URL to Django, called directly from the
   * browser. MUST be a NEXT_PUBLIC_ var: Next.js only exposes NEXT_PUBLIC_*
   * env vars to browser code. Set NEXT_PUBLIC_API_URL in .env / Railway, e.g.
   *   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   * Django CORS must allow the frontend origin (already configured in settings).
   */
  publicApiUrl: normalizeApiBaseUrl(
    process.env.NEXT_PUBLIC_API_URL,
    "http://127.0.0.1:8000/api/v1"
  ),

  /**
   * Server Components / SSR API base — absolute URL to Django.
   * Prefers the server-only API_URL; falls back to NEXT_PUBLIC_API_URL.
   * On Railway you can point this at the private network URL for speed.
   */
  serverApiUrl: normalizeApiBaseUrl(
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL,
    "http://127.0.0.1:8000/api/v1"
  ),
} as const;

/**
 * Resolve the API base URL on the SERVER at request time (reads process.env
 * live, so it works on Railway with just a restart — no rebuild needed).
 *
 * Used in two places:
 *   - SSR / Server Components: as the fetch base.
 *   - Injected into the HTML so the browser learns the URL at runtime
 *     (see <ApiUrlScript /> in the root layout), avoiding the build-time
 *     baking that NEXT_PUBLIC_* requires.
 *
 * Set API_URL on each frontend service in Railway. NEXT_PUBLIC_API_URL still
 * works as a fallback for fully-static hosting.
 */
export function getRuntimeApiUrl(): string {
  return normalizeApiBaseUrl(
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL,
    "http://127.0.0.1:8000/api/v1"
  );
}

/** Global the server injects and the browser reads at runtime. */
export const RUNTIME_API_URL_GLOBAL = "__MAZAD_API_URL__";

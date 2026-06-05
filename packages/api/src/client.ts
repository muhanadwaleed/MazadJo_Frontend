import {
  env,
  getRuntimeApiUrl,
  normalizeApiBaseUrl,
  RUNTIME_API_URL_GLOBAL,
} from "@mazad/config";
import { endpoints } from "./endpoints";
import { ApiError, parseApiError } from "./errors";

export { ApiError } from "./errors";
import type { ApiErrorEnvelope, TokenPair } from "./types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./session";

export type ApiClientConfig = {
  /**
   * Base URL, or a function resolving it per-call. A function lets the same
   * client be isomorphic: browser base (NEXT_PUBLIC_API_URL) vs SSR base
   * (API_URL). Resolved on every request.
   */
  baseUrl: string | (() => string);
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  onTokensUpdated?: (tokens: TokenPair) => void;
  onUnauthorized?: () => void;
};

export type RequestOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  auth?: boolean;
  idempotencyKey?: string;
  skipRefresh?: boolean;
  /** When true, do not set Content-Type (for FormData uploads). */
  formData?: boolean;
};

/** Django APPEND_SLASH requires trailing slashes on POST URLs. */
function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function buildUrl(baseUrl: string, path: string, params?: RequestOptions["params"]) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = withTrailingSlash(
    path.startsWith("/") ? path : `/${path}`
  );
  let href = `${normalizedBase}${normalizedPath}`;

  if (params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      search.set(key, String(value));
    }
    const qs = search.toString();
    if (qs) href = `${href}?${qs}`;
  }

  return href;
}

export function createApiClient(config: ApiClientConfig) {
  const {
    baseUrl,
    getAccessToken: readAccess = () => null,
    getRefreshToken: readRefresh = () => null,
    onTokensUpdated,
    onUnauthorized,
  } = config;

  let refreshPromise: Promise<boolean> | null = null;

  const resolveBaseUrl = (): string =>
    typeof baseUrl === "function" ? baseUrl() : baseUrl;

  async function refreshAccessToken(): Promise<boolean> {
    const refresh = readRefresh();
    if (!refresh) return false;

    const response = await fetch(buildUrl(resolveBaseUrl(), endpoints.auth.refresh), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      onUnauthorized?.();
      return false;
    }

    const data = (await response.json()) as { access: string };
    const tokens: TokenPair = { access: data.access, refresh };
    onTokensUpdated?.(tokens);
    return true;
  }

  async function request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      params,
      body,
      auth = false,
      idempotencyKey,
      skipRefresh = false,
      formData = false,
      headers: initHeaders,
      ...init
    } = options;

    const headers = new Headers(initHeaders);
    headers.set("Accept", "application/json");

    if (body !== undefined && !formData) {
      headers.set("Content-Type", "application/json");
    }

    if (auth) {
      const token = readAccess();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    if (idempotencyKey) {
      headers.set("Idempotency-Key", idempotencyKey);
    }

    const execute = () =>
      fetch(buildUrl(resolveBaseUrl(), path, params), {
        ...init,
        headers,
        body:
          body !== undefined
            ? formData
              ? (body as BodyInit)
              : JSON.stringify(body)
            : undefined,
      });

    let response = await execute();

    if (
      response.status === 401 &&
      auth &&
      !skipRefresh &&
      readRefresh()
    ) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const refreshed = await refreshPromise;
      if (refreshed) {
        const token = readAccess();
        if (token) headers.set("Authorization", `Bearer ${token}`);
        response = await execute();
      }
    }

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const error = await parseApiError(response);
      if (error.status === 401 && auth) {
        onUnauthorized?.();
      }
      throw error;
    }

    if (response.headers.get("content-type")?.includes("application/json")) {
      return (await response.json()) as T;
    }

    return undefined as T;
  }

  return {
    get: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "GET" }),
    post: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "POST" }),
    postForm: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "POST", formData: true }),
    patch: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "PATCH" }),
    put: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "PUT" }),
    delete: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "DELETE" }),
  };
}

/**
 * Resolve the API base per request, so the SAME client works in both contexts:
 *   - Server (SSR): getRuntimeApiUrl() reads API_URL live at request time.
 *   - Browser: the URL the server injected at runtime (window.__MAZAD_API_URL__),
 *     falling back to the build-time env.publicApiUrl if the script is absent.
 * All are absolute backend URLs; Django CORS must allow the frontend origin.
 */
function resolveApiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server: read live env every call.
    return getRuntimeApiUrl();
  }
  // Browser: prefer the runtime value injected by the server into the HTML.
  const injected = (window as unknown as Record<string, unknown>)[
    RUNTIME_API_URL_GLOBAL
  ];
  if (typeof injected === "string" && injected) {
    return normalizeApiBaseUrl(injected, env.publicApiUrl);
  }
  return env.publicApiUrl;
}

/**
 * Isomorphic API client — sessionStorage tokens + refresh on 401 in the
 * browser; in SSR the token getters return null (no sessionStorage), so it
 * simply fetches public data. Used for both browser and server calls.
 */
export const api = createApiClient({
  baseUrl: resolveApiBaseUrl,
  getAccessToken,
  getRefreshToken,
  onTokensUpdated: setTokens,
  onUnauthorized: clearTokens,
});

/**
 * Alias kept for existing imports. Identical to `api` — resolves base URL per
 * call, so calling a `serverApi.*` service from a client component correctly
 * uses the browser base (NEXT_PUBLIC_API_URL) and attaches the JWT.
 */
export const serverApi = api;

export function isAccountDisabledError(error: unknown): boolean {
  return error instanceof ApiError && error.code === "account_disabled";
}

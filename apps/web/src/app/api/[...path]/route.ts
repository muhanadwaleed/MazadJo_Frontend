/**
 * Runtime API proxy — reads API_URL at request time, not at build time.
 *
 * Why a route handler instead of next.config.ts rewrites:
 *   next.config.ts rewrites() bakes the destination URL into
 *   .next/routes-manifest.json at `next build`. Changing the env var in
 *   Railway after the first build has no effect until a full rebuild.
 *   A route handler runs server-side on every request, so changing API_URL
 *   in Railway and redeploying is always enough.
 *
 * How requests flow:
 *   Browser → GET /api/v1/auctions/
 *          → this handler (server-side, reads API_URL at runtime)
 *          → fetch("https://your-backend.railway.app/api/v1/auctions/")
 *          → streams response back to browser
 *   No CORS needed. Browser never contacts the backend directly.
 *
 * Railway env var to set (only one needed):
 *   API_URL = https://your-backend.up.railway.app
 */

import { type NextRequest, NextResponse } from "next/server";

const REQ_HEADERS = [
  "authorization",
  "content-type",
  "accept",
  "accept-language",
  "idempotency-key",
  "x-request-id",
] as const;

const RES_HEADERS = [
  "content-type",
  "content-language",
  "cache-control",
  "x-request-id",
] as const;

/**
 * Read API_URL at request time (never falls back to NEXT_PUBLIC_API_URL —
 * that would cause an infinite loop if it resolves to the frontend domain).
 */
function getBackendOrigin(): string {
  const raw = (process.env.API_URL ?? "").trim();
  if (!raw) {
    // Dev fallback — in production Railway will always have API_URL set.
    return "http://127.0.0.1:8000";
  }
  // Strip any trailing /api or /api/v1 — we forward the full pathname ourselves.
  return raw.replace(/\/api(\/v1)?\/?$/, "").replace(/\/$/, "");
}

async function proxyToBackend(req: NextRequest): Promise<NextResponse> {
  const origin = getBackendOrigin();
  const target = `${origin}${req.nextUrl.pathname}${req.nextUrl.search}`;

  const reqHeaders = new Headers();
  for (const key of REQ_HEADERS) {
    const val = req.headers.get(key);
    if (val !== null) reqHeaders.set(key, val);
  }

  const withBody = req.method !== "GET" && req.method !== "HEAD";
  const fetchInit: RequestInit = {
    method: req.method,
    headers: reqHeaders,
    body: withBody ? req.body : undefined,
  };
  // Node 18+ fetch requires duplex:"half" when forwarding a streaming body.
  if (withBody && req.body) {
    (fetchInit as Record<string, unknown>).duplex = "half";
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, fetchInit);
  } catch (err) {
    console.error(`[api-proxy] Cannot reach backend at ${target}:`, err);
    return NextResponse.json(
      { detail: "Backend service unavailable." },
      { status: 502 }
    );
  }

  const resHeaders = new Headers();
  for (const key of RES_HEADERS) {
    const val = upstream.headers.get(key);
    if (val !== null) resHeaders.set(key, val);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = proxyToBackend;
export const POST = proxyToBackend;
export const PUT = proxyToBackend;
export const PATCH = proxyToBackend;
export const DELETE = proxyToBackend;
export const HEAD = proxyToBackend;
export const OPTIONS = proxyToBackend;

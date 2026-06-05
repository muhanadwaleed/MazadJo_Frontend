/**
 * Runtime API proxy — reads API_URL at request time, not at build time.
 *
 * Browser → /api/v1/...  → this handler (server-side, runtime)
 *        → fetch(`${API_URL}/api/v1/...`) → streams response back.
 * No CORS. Browser never contacts the backend directly.
 *
 * Railway: set ONE variable on each frontend service:
 *   API_URL = https://your-backend.up.railway.app
 */

import { type NextRequest, NextResponse } from "next/server";

// Force this handler to run on every request in the Node runtime.
// Without these, Next.js may statically optimize the route and never
// re-read process.env.API_URL at runtime on Railway.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

const REQ_HEADERS = [
  "authorization",
  "content-type",
  "accept",
  "accept-language",
  "idempotency-key",
  "x-request-id",
  "cookie",
] as const;

const RES_HEADERS = [
  "content-type",
  "content-language",
  "cache-control",
  "set-cookie",
  "x-request-id",
] as const;

/**
 * Resolve the backend origin from API_URL at REQUEST time.
 * Never falls back to NEXT_PUBLIC_API_URL (that could point at the frontend
 * domain and create an infinite proxy loop).
 */
function getBackendOrigin(): string | null {
  const raw = (process.env.API_URL ?? "").trim();
  if (!raw) return null;
  // Strip a trailing /api or /api/v1 — we forward the full pathname ourselves.
  return raw.replace(/\/api(\/v1)?\/?$/, "").replace(/\/$/, "");
}

async function proxyToBackend(req: NextRequest): Promise<NextResponse> {
  const origin = getBackendOrigin();

  if (!origin) {
    console.error(
      "[api-proxy] API_URL is not set. Set API_URL=https://your-backend.up.railway.app in Railway."
    );
    return NextResponse.json(
      { detail: "API_URL is not configured on the server." },
      { status: 500 }
    );
  }

  const target = `${origin}${req.nextUrl.pathname}${req.nextUrl.search}`;

  const reqHeaders = new Headers();
  for (const key of REQ_HEADERS) {
    const val = req.headers.get(key);
    if (val !== null) reqHeaders.set(key, val);
  }

  // Buffer the body (more reliable on Railway/undici than streaming + duplex).
  let body: ArrayBuffer | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const buf = await req.arrayBuffer();
    if (buf.byteLength > 0) body = buf;
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers: reqHeaders,
      body,
      redirect: "manual",
      cache: "no-store",
    });
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

  const respBody = await upstream.arrayBuffer();
  return new NextResponse(respBody, {
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

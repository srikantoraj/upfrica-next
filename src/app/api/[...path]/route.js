// src/app/api/[...path]/route.js
import { NextResponse } from "next/server";

// Django origin
const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://127.0.0.1:8000";

const looksLikeFile = (p = "") => /\.[a-z0-9]+$/i.test(p);
const trimSlashes = (p = "") => String(p).replace(/^\/+|\/+$/g, "");

/** Ensure trailing slash for DRF unless it looks like a file. */
function ensureDrfSlash(pathname = "") {
  if (!pathname) return "";
  return looksLikeFile(pathname) || pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/** Drop any number of leading api/ or b/ segments; we’ll re-add api/. */
function stripLeadingRoots(p = "") {
  let s = trimSlashes(p);
  while (/^(api|b)\//i.test(s)) s = s.replace(/^(api|b)\//i, "");
  return s;
}

/** Build passthrough headers (cookie, auth, content negotiation, etc.) */
function buildForwardHeaders(req) {
  const fwd = new Headers();
  const allow = new Set([
    "cookie",
    "authorization",
    "x-requested-with",
    "content-type",
    "accept",
    "x-csrftoken",
    "x-timezone",
  ]);
  for (const [k, v] of req.headers) {
    if (allow.has(k.toLowerCase())) fwd.set(k, v);
  }
  return fwd;
}

async function forward(req, url) {
  const init = {
    method: req.method,
    headers: buildForwardHeaders(req),
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
    redirect: "follow",
  };
  const upstream = await fetch(url.toString(), init);

  // Strip hop-by-hop headers
  const h = new Headers(upstream.headers);
  h.delete("transfer-encoding");
  h.delete("content-encoding");

  return new NextResponse(upstream.body, { status: upstream.status, headers: h });
}

function jsonOk(obj) {
  return new NextResponse(JSON.stringify(obj ?? {}), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

async function handler(req, ctx) {
  const parts = Array.isArray(ctx?.params?.path) ? ctx.params.path : [];
  // join → trim → replace stray commas with slashes
  const raw = trimSlashes(parts.join("/")).replace(/,+/g, "/");

  // ---- Shipping preview shim (accepts with or without "api/" prefix) ----
  const mProd = raw.match(/^(?:api\/)?(product|products)\/(\d+)\/shipping\/preview\/?$/i);
  const mShop = raw.match(/^(?:api\/)?(shop|shops)\/([^/]+)\/shipping\/preview\/?$/i);
  if (mProd || mShop) {
    const u = new URL(`${trimSlashes(BACKEND)}/api/shipping/preview/`);
    req.nextUrl.searchParams.forEach((v, k) => u.searchParams.set(k, v));
    if (mProd) u.searchParams.set("product_id", mProd[2]);
    if (mShop) u.searchParams.set("shop_slug", mShop[2]);

    const resp = await forward(req, u);
    if (resp.status === 404) {
      // Quiet fallback payload
      return jsonOk({ available: null, currency: null, options: [] });
    }
    return resp;
  }

  // ---- Normalize to /api/<path>/ upstream (kill /b/) ----
  const body = stripLeadingRoots(raw);                 // remove leading api/ or b/
  const normalized = ensureDrfSlash(body);             // ensure trailing slash (DRF)
  const upstreamPath = `api/${trimSlashes(normalized)}/`;

  const url = new URL(`${trimSlashes(BACKEND)}/${upstreamPath}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.append(k, v));

  return forward(req, url);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
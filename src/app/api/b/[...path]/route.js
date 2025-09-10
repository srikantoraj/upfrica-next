// app/api/b/[...path]/route.js
import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://127.0.0.1:8000";

const looksLikeFile = (p = "") => /\.[a-z0-9]+$/i.test(p);
const trim = (p = "") => p.replace(/^\/+|\/+$/g, "");
const ensureApiRoot = (p = "") => (p.toLowerCase().startsWith("api/") ? p : `api/${p}`);
const ensureDrfSlash = (p = "") =>
  !p ? p : looksLikeFile(p) || p.endsWith("/") ? p : `${p}/`;

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

  // 👇 sanitize: replace any stray commas users put between segments
  const rawSanitized = trim(parts.join("/")).replace(/,+/g, "/");

  const withRoot = ensureApiRoot(rawSanitized);
  const finalPath = ensureDrfSlash(withRoot);

  // ---- Shipping preview shim (plural/singular product|shop) ----
  const mProd = finalPath.match(/^api\/(product|products)\/(\d+)\/shipping\/preview\/$/i);
  const mShop = finalPath.match(/^api\/(shop|shops)\/([^/]+)\/shipping\/preview\/$/i);

  if (mProd || mShop) {
    const u = new URL(`${trim(BACKEND)}/api/shipping/preview/`);
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

  // ---- Default proxy ----
  const url = new URL(`${trim(BACKEND)}/${finalPath}`);
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
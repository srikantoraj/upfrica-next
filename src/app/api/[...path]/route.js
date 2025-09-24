// src/app/api/[...path]/route.js
import { NextResponse } from "next/server";
import { cookies, headers as nextHeaders } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // must be a string literal

const BACKEND =
  process.env.BACKEND_BASE ||
  process.env.UP_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

const PUBLIC_TOKEN  = process.env.SOURCING_PUBLIC_TOKEN || "";
const PUBLIC_HEADER = process.env.SOURCING_PUBLIC_HEADER || "Authorization";
const PUBLIC_SCHEME = (process.env.SOURCING_PUBLIC_SCHEME ?? "Token").trim();

const looksLikeFile = (p = "") => /\.[a-z0-9]+$/i.test(p);
const trimSlashes   = (p = "") => String(p).replace(/^\/+|\/+$/g, "");

function ensureDrfSlash(pathname = "") {
  if (!pathname) return "";
  return looksLikeFile(pathname) || pathname.endsWith("/") ? pathname : `${pathname}/`;
}
function stripLeadingRoots(p = "") {
  let s = trimSlashes(p);
  while (/^(api|b)\//i.test(s)) s = s.replace(/^(api|b)\//i, "");
  return s;
}

function isSameOrigin(req) {
  const h = nextHeaders();
  const origin = h.get("origin");
  if (!origin) return true;
  try {
    const o = new URL(origin);
    const u = new URL(req.url);
    return o.protocol === u.protocol && o.host === u.host;
  } catch { return false; }
}

// normalize deliver cc (accept “uk” → “gb”)
const CC_ALIASES = { uk: "gb" };
function canonCc(x) {
  const v = String(x || "").trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(v)) return "";
  return CC_ALIASES[v] || v;
}

// Read token from any historical cookie name
function readAnyTokenCookie() {
  const jar = cookies();
  return (
    jar.get("up_auth")?.value ||
    jar.get("authToken")?.value ||
    jar.get("auth_token")?.value ||
    jar.get("token")?.value ||
    null
  );
}

function isPublicRequestsBrowse(pathNoRoot, method) {
  if (method !== "GET") return false;
  const p = trimSlashes(pathNoRoot).toLowerCase();
  return p === "sourcing/requests" || p === "sourcing/requests/";
}

/** Decide auth → also return debug flags */
function computeAuthForUpstream(req, pathNoRoot) {
  const h = nextHeaders();
  const incomingAuth = h.get("authorization");
  const cookieAuth = readAnyTokenCookie();
  const safeMethod = req.method === "GET" || req.method === "HEAD";

  if (incomingAuth) {
    return {
      useAuthHeader: true,
      authHeaderValue: incomingAuth,
      source: "header",
      hadCookie: Boolean(cookieAuth),
      sameOrigin: isSameOrigin(req),
    };
  }

  if (cookieAuth && (safeMethod || isSameOrigin(req))) {
    return {
      useAuthHeader: true,
      authHeaderValue: `Token ${cookieAuth}`,
      source: "cookie",
      hadCookie: true,
      sameOrigin: isSameOrigin(req),
    };
  }

  if (isPublicRequestsBrowse(pathNoRoot, req.method) && PUBLIC_TOKEN && !incomingAuth && !cookieAuth) {
    const val = PUBLIC_SCHEME ? `${PUBLIC_SCHEME} ${PUBLIC_TOKEN}` : PUBLIC_TOKEN;
    if (PUBLIC_HEADER.toLowerCase() === "authorization") {
      return {
        useAuthHeader: true,
        authHeaderValue: val,
        injectPublicParam: true,
        source: "public",
        hadCookie: false,
        sameOrigin: isSameOrigin(req),
      };
    }
    return {
      useAuthHeader: false,
      publicHeaderKV: [PUBLIC_HEADER, val],
      injectPublicParam: true,
      source: "public",
      hadCookie: false,
      sameOrigin: isSameOrigin(req),
    };
  }

  return {
    useAuthHeader: false,
    source: "none",
    hadCookie: Boolean(cookieAuth),
    sameOrigin: isSameOrigin(req),
  };
}

// Build upstream headers, injecting currency/region/lang/tz from cookies when missing
function buildForwardHeaders(req, { useAuthHeader, authHeaderValue } = {}) {
  const out = new Headers();
  const h = nextHeaders();
  const jar = cookies();

  // Client-provided (don’t over-write)
  out.set("Accept", h.get("accept") || "application/json");
  const ct = h.get("content-type"); if (ct) out.set("Content-Type", ct);
  const tzH = h.get("x-timezone"); if (tzH) out.set("X-Timezone", tzH);
  const xhr = h.get("x-requested-with"); if (xhr) out.set("X-Requested-With", xhr);
  const csrf = h.get("x-csrftoken"); if (csrf) out.set("X-CSRFToken", csrf);
  const uiCcyH = h.get("x-ui-currency"); if (uiCcyH) out.set("X-UI-Currency", uiCcyH);
  const deliverCcH = h.get("x-deliver-cc"); if (deliverCcH) out.set("X-Deliver-CC", deliverCcH);
  const uiLangH = h.get("x-ui-language"); if (uiLangH) out.set("X-UI-Language", uiLangH);

  if (useAuthHeader && authHeaderValue) {
    out.set("Authorization", authHeaderValue);
  }

  // Cookie fallbacks (only if not already set by headers)
  if (!out.has("X-UI-Currency")) {
    const ccyCookie = jar.get("upfrica_currency")?.value;
    if (ccyCookie) out.set("X-UI-Currency", String(ccyCookie).toUpperCase());
  }
  if (!out.has("X-Deliver-CC")) {
    const dccCookie = canonCc(jar.get("deliver_cc")?.value);
    if (dccCookie) out.set("X-Deliver-CC", dccCookie); // 2-letter (gb, gh, ng…)
  }
  if (!out.has("X-UI-Language")) {
    const langCookie = jar.get("upfrica_lang")?.value;
    if (langCookie) out.set("X-UI-Language", langCookie);
  }
  if (!out.has("X-Timezone")) {
    const tzCookie = jar.get("tz")?.value;
    if (tzCookie) out.set("X-Timezone", tzCookie);
  }

  // (Optional) also pass browsing cc (from URL) for analytics/rules
  if (!out.has("X-Browsing-CC")) {
    const browseCc = canonCc(jar.get("cc")?.value);
    if (browseCc) out.set("X-Browsing-CC", browseCc);
  }

  return out;
}

async function forward(req, url, extra = {}) {
  const method = req.method;
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  if (!(method === "GET" || method === "HEAD")) {
    if (!isSameOrigin(req)) {
      const hasAuth = nextHeaders().get("authorization");
      if (!hasAuth) {
        return new NextResponse(JSON.stringify({ detail: "Cross-site write blocked" }), {
          status: 403,
          headers: { "content-type": "application/json" },
        });
      }
    }
  }

  const headers = buildForwardHeaders(req, extra.auth);
  if (extra.publicHeaderKV) {
    const [k, v] = extra.publicHeaderKV;
    headers.set(k, v);
  }

  const upstream = await fetch(url.toString(), {
    method,
    headers,
    body,
    redirect: "follow",
    cache: "no-store",
    credentials: "omit",
  });

  const h = new Headers(upstream.headers);
  h.delete("transfer-encoding");
  h.delete("content-encoding");

  // 🔎 Debug crumbs
  h.set("x-up-proxy-auth", extra.auth?.useAuthHeader ? "1" : "0");
  if (extra.auth?.source) h.set("x-up-proxy-auth-source", extra.auth.source);
  h.set("x-up-had-cookie", extra.auth?.hadCookie ? "1" : "0");
  h.set("x-up-same-origin", extra.auth?.sameOrigin ? "1" : "0");
  h.set("x-up-proxy-target", url.toString());

  return new NextResponse(upstream.body, { status: upstream.status, headers: h });
}

function jsonOk(obj) {
  return new NextResponse(JSON.stringify(obj ?? {}), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

// ── entry ───────────────────────────────────────────────────────────────
async function route(req, ctx) { // <— not exported; Next only sees method exports below
  const parts = Array.isArray(ctx?.params?.path) ? ctx.params.path : [];
  const raw = trimSlashes(parts.join("/")).replace(/,+/g, "/");

  // ✅ Shipping preview convenience (product_id OR shop_slug)
  const mProd = raw.match(/^(?:api\/)?(product|products)\/(\d+)\/shipping\/preview\/?$/i);
  const mShop = raw.match(/^(?:api\/)?(shop|shops)\/([^/]+)\/shipping\/preview\/?$/i);
  if (mProd || mShop) {
    const u = new URL(`${trimSlashes(BACKEND)}/api/shipping/preview/`);
    req.nextUrl.searchParams.forEach((v, k) => u.searchParams.set(k, v));
    if (mProd) u.searchParams.set("product_id", mProd[2]);
    if (mShop) u.searchParams.set("shop_slug", mShop[2]);

    const auth = computeAuthForUpstream(req, "shipping/preview");
    const resp = await forward(req, u, { auth });

    if (resp.status === 404) {
      return jsonOk({ available: null, currency: null, options: [] });
    }
    return resp;
  }

  // Normal proxy path
  const pathNoRoot = stripLeadingRoots(raw);
  const normalized = ensureDrfSlash(pathNoRoot);

  const upstreamBase = `${trimSlashes(BACKEND)}/api/`;
  const url = new URL(upstreamBase + normalized.replace(/^\/+/, ""));
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.append(k, v));

  const auth = computeAuthForUpstream(req, pathNoRoot);
  if (auth.injectPublicParam && !url.searchParams.has("public")) {
    url.searchParams.set("public", "1");
  }

  return forward(req, url, { auth, publicHeaderKV: auth.publicHeaderKV });
}

export const GET     = route;
export const POST    = route;
export const PUT     = route;
export const PATCH   = route;
export const DELETE  = route;
export const OPTIONS = route;
export const HEAD    = route;
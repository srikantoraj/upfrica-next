// app/api/revalidate/route.js
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { cookies, headers as nextHeaders } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- CORS ----------------------------------------------------
const ORIGIN = process.env.REVALIDATE_ALLOW_ORIGIN || "*";
const ALLOWED = new Set(
  ORIGIN === "*"
    ? ["*"]
    : ORIGIN.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
);

function corsHeaders(origin) {
  const allow =
    ALLOWED.has("*") || (origin && ALLOWED.has(origin))
      ? origin || "*"
      : Array.from(ALLOWED)[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST,GET,OPTIONS,HEAD",
    "Access-Control-Allow-Headers":
      "Authorization, X-Upfrica-Secret, X-Revalidate-Token, X-Next-Revalidate, X-API-Key, Content-Type",
    "Access-Control-Allow-Credentials": "true",
    "Cache-Control": "no-store",
  };
}

// ---- utils ---------------------------------------------------
const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

function sanitizeStrings(arr, limit = 50) {
  const out = [];
  const seen = new Set();
  for (const v of arr) {
    if (typeof v !== "string") continue;
    const s = v.trim();
    if (!s || seen.has(s)) continue;
    out.push(s);
    seen.add(s);
    if (out.length >= limit) break;
  }
  return out;
}
function normalizePaths(arr) {
  return sanitizeStrings(arr).map((p) => (p.startsWith("/") ? p : `/${p}`));
}

function isSameOrigin(req) {
  try {
    const h = nextHeaders();
    const origin = h.get("origin");
    if (!origin) return true; // server-to-server / curl
    const o = new URL(origin);
    const u = new URL(req.url);
    return o.protocol === u.protocol && o.host === u.host;
  } catch {
    return false;
  }
}

// ---- responses ------------------------------------------------
function unauthorized(h, why = "unauthorized") {
  return NextResponse.json({ ok: false, error: why }, { status: 401, headers: h });
}
function badRequest(h, msg) {
  return NextResponse.json({ ok: false, error: msg || "bad request" }, { status: 400, headers: h });
}
function ok(h, body) {
  return NextResponse.json(body, { status: 200, headers: h });
}

// ---- auth ----------------------------------------------------
function getSecret() {
  return (
    process.env.REVALIDATE_SECRET ||
    process.env.NEXT_REVALIDATE_SECRET ||
    process.env.REVALIDATE_TOKEN ||
    ""
  );
}

/**
 * Auth rules:
 *  1) If a secret env is set → require it via:
 *     - Authorization: Bearer <secret>  OR
 *     - X-Upfrica-Secret / X-Revalidate-Token / X-Next-Revalidate / X-API-Key  OR
 *     - ?secret= / ?token=
 *  2) Else (no secret configured), allow same-origin calls that have the `up_auth` cookie
 *     (useful for admin UI buttons calling revalidate from the browser).
 *  3) Dev-only override: REVALIDATE_TRUST_ANY_AUTH=1 accepts any Authorization header.
 */
function checkAuth(req) {
  const secret = getSecret();
  const h = nextHeaders();
  const url = new URL(req.url);

  const auth = h.get("authorization") || "";
  const bearerMatch = auth.match(/^Bearer\s+(.+)$/i);
  const bearer = bearerMatch ? bearerMatch[1].trim() : "";

  const altHeader =
    h.get("x-upfrica-secret") ||
    h.get("x-revalidate-token") ||
    h.get("x-next-revalidate") ||
    h.get("x-api-key") ||
    "";

  const altQuery = url.searchParams.get("secret") || url.searchParams.get("token") || "";

  if (secret) {
    if (bearer === secret || altHeader === secret || altQuery === secret) return true;
    return false;
  }

  // No secret configured → allow same-origin + session cookie
  const hasCookie = !!cookies().get("up_auth")?.value;
  if (isSameOrigin(req) && hasCookie) return true;

  // Dev override: accept any Authorization header (Bearer/Token/etc.)
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.REVALIDATE_TRUST_ANY_AUTH === "1" &&
    auth
  ) {
    return true;
  }

  return false;
}

// ---- handlers ------------------------------------------------
export async function OPTIONS(req) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function HEAD(req) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function GET(req) {
  const h = corsHeaders(req.headers.get("origin"));
  if (!checkAuth(req)) return unauthorized(h);

  const { searchParams } = new URL(req.url);
  const tags = sanitizeStrings(searchParams.getAll("tag"));
  const paths = normalizePaths(searchParams.getAll("path"));

  if (tags.length === 0 && paths.length === 0) return badRequest(h, "Provide at least one 'tag' or 'path'");

  const revalidated = { tags: [], paths: [] };
  const errors = [];

  for (const t of tags) {
    try {
      revalidateTag(t);
      revalidated.tags.push(t);
    } catch (e) {
      errors.push({ tag: t, error: String(e) });
    }
  }
  for (const p of paths) {
    try {
      revalidatePath(p);
      revalidated.paths.push(p);
    } catch (e) {
      errors.push({ path: p, error: String(e) });
    }
  }

  return ok(h, {
    ok: errors.length === 0,
    count: { tags: revalidated.tags.length, paths: revalidated.paths.length },
    revalidated,
    errors,
  });
}

export async function POST(req) {
  const h = corsHeaders(req.headers.get("origin"));
  if (!checkAuth(req)) return unauthorized(h);

  let body = {};
  try { body = await req.json(); } catch {}

  const url = new URL(req.url);
  const tags = sanitizeStrings([
    ...toArray(body.tags ?? body.tag),
    ...url.searchParams.getAll("tag"),
  ]);
  const paths = normalizePaths([
    ...toArray(body.paths ?? body.path),
    ...url.searchParams.getAll("path"),
  ]);

  if (tags.length === 0 && paths.length === 0) return badRequest(h, "Provide at least one 'tag' or 'path'");

  const revalidated = { tags: [], paths: [] };
  const errors = [];

  for (const t of tags) {
    try {
      revalidateTag(t);
      revalidated.tags.push(t);
    } catch (e) {
      errors.push({ tag: t, error: String(e) });
    }
  }
  for (const p of paths) {
    try {
      revalidatePath(p);
      revalidated.paths.push(p);
    } catch (e) {
      errors.push({ path: p, error: String(e) });
    }
  }

  return ok(h, {
    ok: errors.length === 0,
    count: { tags: revalidated.tags.length, paths: revalidated.paths.length },
    revalidated,
    errors,
  });
}
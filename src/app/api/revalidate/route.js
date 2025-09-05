// app/api/revalidate/route.js
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- CORS ----------------------------------------------------
const ORIGIN = process.env.REVALIDATE_ALLOW_ORIGIN || "*"; // e.g. "http://127.0.0.1:8000,https://www.upfrica.com"
const ALLOWED = new Set(
  ORIGIN === "*" ? ["*"] : ORIGIN.split(",").map((s) => s.trim()).filter(Boolean)
);

function corsHeaders(origin) {
  const allow =
    ALLOWED.has("*") || (origin && ALLOWED.has(origin)) ? origin || "*" : Array.from(ALLOWED)[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, X-Upfrica-Secret, Content-Type",
    "Cache-Control": "no-store",
  };
}

// ---- auth ----------------------------------------------------
function unauthorized(h) {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401, headers: h });
}
function badRequest(h, msg) {
  return NextResponse.json({ ok: false, error: msg || "bad request" }, { status: 400, headers: h });
}
function ok(h, body) {
  return NextResponse.json(body, { status: 200, headers: h });
}

function checkAuth(req) {
  const secret = process.env.REVALIDATE_SECRET || process.env.NEXT_REVALIDATE_SECRET || "";
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const alt = req.headers.get("x-upfrica-secret") || "";
  return bearer === secret || alt === secret;
}

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

// ---- handlers ------------------------------------------------
export async function OPTIONS(req) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

// simple health check (optional)
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
    try { revalidateTag(t); revalidated.tags.push(t); }
    catch (e) { errors.push({ tag: t, error: String(e) }); }
  }
  for (const p of paths) {
    try { revalidatePath(p); revalidated.paths.push(p); }
    catch (e) { errors.push({ path: p, error: String(e) }); }
  }

  return ok(h, { ok: errors.length === 0, count: { tags: revalidated.tags.length, paths: revalidated.paths.length }, revalidated, errors });
}

export async function POST(req) {
  const h = corsHeaders(req.headers.get("origin"));
  if (!checkAuth(req)) return unauthorized(h);

  let body = {};
  try { body = await req.json(); } catch { /* ignore */ }

  const url = new URL(req.url);
  const tags  = sanitizeStrings([...toArray(body.tags ?? body.tag),  ...url.searchParams.getAll("tag")]);
  const paths = normalizePaths([...toArray(body.paths ?? body.path), ...url.searchParams.getAll("path")]);

  if (tags.length === 0 && paths.length === 0) return badRequest(h, "Provide at least one 'tag' or 'path'");

  const revalidated = { tags: [], paths: [] };
  const errors = [];

  for (const t of tags)  {
    try { revalidateTag(t);  revalidated.tags.push(t); }
    catch (e) { errors.push({ tag: t,  error: String(e) }); }
  }
  for (const p of paths) {
    try { revalidatePath(p); revalidated.paths.push(p); }
    catch (e) { errors.push({ path: p, error: String(e) }); }
  }

  return ok(h, { ok: errors.length === 0, count: { tags: revalidated.tags.length, paths: revalidated.paths.length }, revalidated, errors });
}
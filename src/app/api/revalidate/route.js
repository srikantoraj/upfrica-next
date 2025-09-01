// app/api/revalidate/route.js
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, X-Upfrica-Secret, Content-Type",
  "Cache-Control": "no-store",
};

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401, headers: CORS });
}
function badRequest(msg) {
  return NextResponse.json({ ok: false, error: msg || "bad request" }, { status: 400, headers: CORS });
}

function checkAuth(req) {
  const secret = process.env.REVALIDATE_SECRET || process.env.NEXT_REVALIDATE_SECRET || "";
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const alt = req.headers.get("x-upfrica-secret") || "";
  return bearer === secret || alt === secret;
}

function toArray(val) { return !val ? [] : Array.isArray(val) ? val : [val]; }
function sanitizeStrings(arr, limit = 50) {
  const out = [];
  for (const v of arr) {
    if (typeof v !== "string") continue;
    const s = v.trim();
    if (!s) continue;
    out.push(s);
    if (out.length >= limit) break;
  }
  return [...new Set(out)];
}

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }
export async function GET(req) {
  if (!checkAuth(req)) return unauthorized();
  const { searchParams } = new URL(req.url);
  const tags = sanitizeStrings(searchParams.getAll("tag"));
  const paths = sanitizeStrings(searchParams.getAll("path"));
  if (tags.length === 0 && paths.length === 0) return badRequest("Missing 'tag' or 'path'");
  const revalidated = { tags: [], paths: [] }, errors = [];
  for (const t of tags) { try { revalidateTag(t); revalidated.tags.push(t); } catch (e) { errors.push({ tag: t, error: String(e) }); } }
  for (const p of paths){ try { revalidatePath(p); revalidated.paths.push(p);} catch (e) { errors.push({ path: p, error: String(e) }); } }
  return NextResponse.json({ ok: errors.length === 0, revalidated, errors }, { headers: CORS });
}
export async function POST(req) {
  if (!checkAuth(req)) return unauthorized();
  let body = {}; try { body = await req.json(); } catch {}
  const url = new URL(req.url);
  const tags  = sanitizeStrings([ ...toArray(body.tags || body.tag),  ...url.searchParams.getAll("tag") ]);
  const paths = sanitizeStrings([ ...toArray(body.paths || body.path), ...url.searchParams.getAll("path") ]);
  if (tags.length === 0 && paths.length === 0) return badRequest("Provide at least one 'tag' or 'path'");
  const revalidated = { tags: [], paths: [] }, errors = [];
  for (const t of tags)  { try { revalidateTag(t);  revalidated.tags.push(t); }  catch (e) { errors.push({ tag: t,  error: String(e) }); } }
  for (const p of paths) { try { revalidatePath(p); revalidated.paths.push(p); } catch (e) { errors.push({ path: p, error: String(e) }); } }
  return NextResponse.json({ ok: errors.length === 0, revalidated, errors }, { headers: CORS });
}
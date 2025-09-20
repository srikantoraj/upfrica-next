//src/app/api/pdp/route.js
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export const runtime = "nodejs";

// hour bucket used for counters
function bucketKey(id, kind, d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  return `p:${id}:${kind}:h:${y}${m}${day}${h}`;
}

async function sumLastHours(id, kind, hours = 24) {
  if (!redis) return 0;
  const now = Date.now();
  const keys = [];
  for (let i = 0; i < hours; i++) {
    keys.push(bucketKey(id, kind, new Date(now - i * 3600_000)));
  }
  const vals = (await redis.mget(...keys)) || [];
  return vals.reduce((a, v) => a + Number(v || 0), 0);
}

async function bump(id, kind, delta = 1) {
  if (!redis) return;
  const key = bucketKey(id, kind, new Date());
  await redis.incrby(key, delta);
  if (typeof redis.expire === "function") {
    await redis.expire(key, 60 * 60 * 27); // ~27h, so old buckets expire naturally
  }
  if (kind === "views") {
    await redis.set(`p:${id}:lastSeenAt`, Date.now());
  }
}

// --- NEW: claim-once helper (dedupe) ---
function hourBucketUTC(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  return `${y}${m}${day}${h}`;
}

function readSID(req) {
  const h = req.headers;
  return (
    h.get("x-session-id") ||
    h.get("x-upfrica-sid") ||
    h.get("x-sid") ||
    new URL(req.url).searchParams.get("sid") ||
    null
  );
}

/** Returns true if this is the first time within TTL; false if we’ve seen it. */
async function claimOnce(id, kind, sid, ttlSeconds) {
  if (!redis || !sid) return true; // best-effort if no redis or no sid
  const scope =
    kind === "views"
      ? hourBucketUTC() // views: once per session per hour bucket
      : "short";        // baskets: short anti-double-click lock

  const k =
    kind === "views"
      ? `p:${id}:${kind}:seen:${sid}:${scope}`
      : `p:${id}:${kind}:seen:${sid}`;

  try {
    // Prefer NX + EX if available
    const res = await redis.set(k, "1", { nx: true, ex: ttlSeconds });
    if (res === "OK" || res?.ok === true) return true; // first time
    return false; // already seen in ttl
  } catch {
    // Fallback if NX options unsupported
    const had = await redis.get(k);
    if (had) return false;
    await redis.set(k, "1");
    if (typeof redis.expire === "function") await redis.expire(k, ttlSeconds);
    return true;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const [views24h, baskets24h, wishlists24h, lastSeen] = await Promise.all([
      sumLastHours(id, "views", 24),
      sumLastHours(id, "baskets", 24),
      sumLastHours(id, "wishlists", 24),
      redis ? redis.get(`p:${id}:lastSeenAt`) : 0,
    ]);

    return NextResponse.json({
      views24h,
      baskets24h,
      wishlistsTotal: wishlists24h,
      lastSeenAt: Number(lastSeen || 0),
    });
  } catch {
    return NextResponse.json({
      views24h: 0,
      baskets24h: 0,
      wishlistsTotal: 0,
      lastSeenAt: 0,
    });
  }
}

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const qpId = url.searchParams.get("id");
    const qpKind = url.searchParams.get("kind");
    const qpDelta = url.searchParams.get("delta");
    let body = {};
    try { body = await req.json(); } catch {}

    const id = String(body.id ?? qpId ?? "").trim();
    const kind = String(body.kind ?? qpKind ?? "").toLowerCase().trim();
    const delta = Number(body.delta ?? qpDelta ?? 1);
    const allowed = new Set(["views", "baskets", "wishlists"]);
    if (!id || !allowed.has(kind)) {
      return NextResponse.json({ error: "id and valid kind required" }, { status: 400 });
    }

    // Per-kind dedupe windows
    const sid = readSID(req);
    const ttl =
      kind === "views"   ? 60 * 60 :         // 1 hour: don’t count repeated page refreshes
      kind === "baskets" ? 10 :              // 10s: prevent double-clicks
                           0;                // wishlists: handled by +1/-1, no dedupe

    if (!ttl || (await claimOnce(id, kind, sid, ttl))) {
      await bump(id, kind, Number.isFinite(delta) ? delta : 1);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 }); // non-fatal
  }
}
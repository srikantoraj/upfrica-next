// src/lib/pdp-signals-server.js
import { headers } from "next/headers";

function getOrigin() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) return `${proto}://${host}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function getPdpSignals(productId) {
  const origin = getOrigin();
  try {
    const res = await fetch(`${origin}/api/pdp/signals?id=${encodeURIComponent(productId)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return {
      views24h: Number(j.views24h || 0),
      baskets24h: Number(j.baskets24h || 0),
      wishlistsTotal: Number(j.wishlistsTotal || 0),
      buyers7d: Number(j.buyers7d || 0),
      lastSeenAt: Number(j.lastSeenAt || 0),
    };
  } catch {
    return { views24h: 0, baskets24h: 0, wishlistsTotal: 0, buyers7d: 0, lastSeenAt: 0 };
  }
}
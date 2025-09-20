//app/(pages)/[cc]/[slug]/SignalsBadge.jsx  Server badge (reads Redis directly; no extra HTTP)
import { redis } from "@/lib/redis";

function bucket(n) {
  const x = Number(n || 0);
  if (x >= 200) return "200+";
  if (x >= 100) return "100+";
  if (x >= 50)  return "50+";
  if (x >= 20)  return "20+";
  if (x > 0)    return "a few";
  return null;
}

export default async function SignalsBadge({ productId }) {
  if (!productId) return null;

  const [views, baskets] = await redis.mget(
    `p:${productId}:views:24h`,
    `p:${productId}:baskets:24h`,
  );

  const viewsTxt   = bucket(views);
  const basketsTxt = bucket(baskets);

  let message = null;
  // prioritize “in basket” like eBay
  if (basketsTxt) message = `${basketsTxt} people added this to basket in the last 24h`;
  else if (viewsTxt) message = `${viewsTxt} people viewed this in the last 24h`;

  if (!message) return null;

  return (
    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-50 text-amber-900 px-3 py-1.5 text-sm border border-amber-200">
      <span className="font-semibold">Popular</span>
      <span className="opacity-80">•</span>
      <span>{message}</span>
    </div>
  );
}
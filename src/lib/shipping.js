//src/lib/shipping.js
// Small client/server-safe helper for product shipping preview
import { api } from "@/lib/api";

/**
 * Preview shipping for a product to a given country/city.
 * - productId: number
 * - deliverCC: two-letter (e.g., "ng")
 * - city: optional
 */
export async function previewProductShipping({ productId, deliverCC, city }) {
  if (!productId || !deliverCC) return { available: null, currency: null, options: [] };
  const qs = new URLSearchParams();
  if (deliverCC) qs.set("deliver_cc", deliverCC);
  if (city) qs.set("deliver_to", city);

  // Uses the proxy shortcut you added: /api/products/:id/shipping/preview/ → upstream /api/shipping/preview/?product_id=...
  return api(`/products/${productId}/shipping/preview/?${qs.toString()}`)
    .catch(() => ({ available: null, currency: null, options: [] }));
}

/** Find cheapest & fastest options from an options array [{price_cents, price, currency, eta_min_days, eta_max_days}, ...] */
export function pickCheapestFastest(options = []) {
  const arr = Array.isArray(options) ? options.slice() : [];
  const normPrice = (o) =>
    Number.isFinite(o?.price_cents) ? o.price_cents / 100 :
    Number(o?.price ?? NaN);

  const withPrice = arr
    .map((o) => ({ ...o, _price: normPrice(o) }))
    .filter((o) => Number.isFinite(o._price));

  const cheapest = withPrice.slice().sort((a, b) => a._price - b._price)[0] || null;

  const etaScore = (o) => {
    const lo = Number(o?.eta_min_days ?? NaN);
    const hi = Number(o?.eta_max_days ?? lo);
    if (Number.isFinite(lo) && Number.isFinite(hi)) return (lo + hi) / 2;
    if (Number.isFinite(lo)) return lo;
    if (Number.isFinite(hi)) return hi;
    return Infinity;
  };
  const fastest = withPrice.slice().sort((a, b) => etaScore(a) - etaScore(b))[0] || null;

  return { cheapest, fastest };
}

export function formatEta(o) {
  const lo = Number(o?.eta_min_days ?? NaN);
  const hi = Number(o?.eta_max_days ?? NaN);
  if (Number.isFinite(lo) && Number.isFinite(hi)) return `${lo}–${hi} days`;
  if (Number.isFinite(lo)) return `${lo} days`;
  if (Number.isFinite(hi)) return `${hi} days`;
  return null;
}
import { api } from "./api";

/**
 * Fetch latest FX snapshot from the backend.
 * Accepts optional base and currency whitelist for slimmer payloads.
 */
export async function fetchFx({ base = "USD", currencies = [], revalidate = 900 } = {}) {
  const params = new URLSearchParams({ base, shape: "map" });
  if (currencies.length) params.set("currencies", currencies.join(","));
  // Works client or server; api() handles BASE prefix.
  const data = await api(`/api/fx/latest/?${params.toString()}`, {
    next: { revalidate, tags: ["fx"] },
  });
  // Normalize
  return {
    base: data.base || "USD",
    rates: data.rates || {},
    asOf: data.as_of ? new Date(data.as_of) : null,
  };
}

/** Apply an optional display margin (basis points) for non-charge display only. */
export function withMargin(rate, marginBps = 0) {
  if (!rate || !Number.isFinite(+rate) || !marginBps) return +rate;
  return +rate * (1 + marginBps / 10_000);
}

/**
 * Convert amount between currencies using a rate map quoted vs base.
 * rates: { GHS: 11.75, GBP: 0.746, ... } where keys are 1 BASE → X CCY
 */
export function convert(amount, from, to, { base = "USD", rates = {} } = {}) {
  if (from === to) return +amount;
  if (!Number.isFinite(+amount)) return 0;

  const toRate = to === base ? 1 : +rates[to];     // BASE→to
  const fromRate = from === base ? 1 : +rates[from]; // BASE→from
  if (!toRate || !fromRate) return 0;

  // amount_in_base = amount / (BASE→from)
  // amount_in_to   = amount_in_base * (BASE→to)
  return (+amount / fromRate) * toRate;
}
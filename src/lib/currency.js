// src/lib/currency.js
import { getRates } from "./fx";

const CC_TO_CUR = {
  gh: "GHS",
  ng: "NGN",
  uk: "GBP",
  us: "USD",
  za: "ZAR",
  ke: "KES",
  ca: "CAD",
  eu: "EUR",
};

export function currencyForCc(cc) {
  return CC_TO_CUR[String(cc || "").toLowerCase()] || "USD";
}

export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${currency.toUpperCase()} ${Number(amount || 0).toLocaleString()}`;
  }
}

// Fetch (and ISR-cache) the latest FX rates (map shape)
export async function getFx(revalidate = 3600, { base = "USD", currencies } = {}) {
  const { rates, asOf } = await getRates({ base, currencies, revalidate });
  return { base, asOf, rates };
}
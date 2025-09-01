import { api } from "./api";

const CC_TO_CUR = { gh: "GHS", ng: "NGN", uk: "GBP" };

export function currencyForCc(cc) {
  return CC_TO_CUR[cc] || "USD";
}
export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount}`;
  }
}

// Optional: cache exchange rates via ISR
export async function getFx(revalidate = 3600) {
  const data = await api(`/api/exchange-rates/`, { next: { revalidate, tags: ["fx"] } }).catch(() => null);
  return data || {};
}
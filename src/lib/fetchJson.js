// src/lib/fetchJson.js
import { cookies } from "next/headers";

/**
 * Server-only helper. Adds user locale headers from cookies written by
 * LocalizationProvider/middleware so API responses can be tailored (and cached)
 * per currency/country/language.
 *
 * Use ONLY in server components or route handlers.
 */
export async function fetchJson(input, init = {}) {
  const c = cookies();

  // UI currency preference (what we want prices returned in)
  const uiCurrency = c.get("upfrica_currency")?.value;

  // Delivery country (affects shipping, availability, etc.)
  const deliverCc = c.get("deliver_cc")?.value;

  // Browsing market from the URL (/[cc]) — mirrored cookie for SSR
  const browseCc =
    c.get("upfrica_cc")?.value || c.get("cc")?.value; // fallback to `cc` if present

  // UI language preference (or "auto")
  const uiLanguage = c.get("upfrica_lang")?.value;

  const headers = new Headers(init.headers || {});
  if (uiCurrency) headers.set("x-ui-currency", uiCurrency);
  if (deliverCc)  headers.set("x-deliver-cc", deliverCc);
  if (browseCc)   headers.set("x-browse-cc", browseCc);
  if (uiLanguage) headers.set("x-ui-language", uiLanguage);

  // Optional: a composite variant header that some CDNs/backends prefer
  headers.set(
    "x-site-variant",
    [uiCurrency || "", deliverCc || "", browseCc || "", uiLanguage || ""].join("|")
  );

  const res = await fetch(input, { ...init, headers });

  // Hint for your API/CDN to cache per-variant (mirror these header names server-side):
  // res.headers.set("Vary", "x-ui-currency, x-deliver-cc, x-browse-cc, x-ui-language");

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} ${text ? `– ${text}` : ""}`);
  }

  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}
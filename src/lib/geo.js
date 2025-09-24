// src/lib/geo.js

// --- Canonical slug aliases (UI slugs) ---
export const CC_ALIAS = { gb: "uk" }; // prefer /uk over /gb

export function canonCc(cc) {
  const v = String(cc || "").trim().toLowerCase();
  return v ? (CC_ALIAS[v] || v) : "";
}

export function isTwoLetter(s) {
  return /^[a-z]{2}$/i.test(String(s || ""));
}

// --- ISO <-> slug helpers (for GB/UK and generic fallbacks) ---
export const ISO_TO_SLUG = { GB: "uk" }; // add more if you ever need
export const SLUG_TO_ISO = { uk: "GB" };

export function slugFromIso(iso) {
  const i = String(iso || "").toUpperCase();
  if (!i) return "";
  return ISO_TO_SLUG[i] || i.toLowerCase();
}

export function isoFromSlug(slug) {
  const s = canonCc(slug);
  if (!s) return "";
  return SLUG_TO_ISO[s] || s.toUpperCase();
}

// --- Cookie keys (keep browse vs deliver separate) ---
export const COOKIE_BROWSE_CC = "cc";          // drives routing (/[cc]/…)
export const COOKIE_DELIVER_CC = "deliver_cc"; // drives shipping/currency

// Safe cookie setters for client-side use
function canUseDOM() {
  return typeof document !== "undefined";
}

export function setCookie(name, value, {
  maxAge = 60 * 60 * 24 * 365, // 1 year
  path = "/",
  sameSite = "Lax",
} = {}) {
  if (!canUseDOM()) return;
  const v = String(value ?? "");
  if (!v) return;
  document.cookie = `${name}=${v}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;
}

export function setBrowseCc(cc) {
  const v = canonCc(cc);
  if (v) setCookie(COOKIE_BROWSE_CC, v);
}

export function setDeliverCc(cc) {
  const v = canonCc(cc);
  if (v) setCookie(COOKIE_DELIVER_CC, v);
}

// Light Accept-Language -> cc extractor (best-effort)
export function ccFromAcceptLanguage(header) {
  const h = String(header || "").toLowerCase();
  const m = h.match(/(?:^|,)\s*[a-z]{1,8}-(?<cc>[a-z]{2})\b/); // e.g., en-GB,en;q=0.9
  return canonCc(m?.groups?.cc || "");
}

// Choose a browsing cc (used by middleware) with fallbacks
export function chooseBrowseCc({ forcedCc, cookieCc, geoCc, alCc, fallback = "gh" } = {}) {
  return canonCc(forcedCc || cookieCc || geoCc || alCc || fallback) || "gh";
}
// src/lib/i18n.js
import { api } from "./api";

/* -------------------------------------------------------------
 * Country helpers
 * ----------------------------------------------------------- */
export function isoToSlug(iso) {
  const s = String(iso || "").toUpperCase();
  return s === "GB" ? "uk" : s.toLowerCase();
}
export function slugToIso(slug) {
  const s = String(slug || "").toLowerCase();
  return s === "uk" ? "GB" : s.toUpperCase();
}
export function normalizeCountry(input) {
  if (!input) return null;
  const s = String(input).trim();
  // Accept ISO (“GH”, “NG”, “GB”) or slugs (“gh”, “ng”, “uk”, “ke”)
  if (/^[A-Z]{2}$/.test(s)) return isoToSlug(s);
  if (/^[a-z]{2}$/.test(s)) return s === "gb" ? "uk" : s;
  return null;
}

/* -------------------------------------------------------------
 * Shape helpers
 * ----------------------------------------------------------- */
function toArray(x) {
  return Array.isArray(x) ? x : x ? [x] : [];
}

function sanitizeInit(payload = {}) {
  const country = payload.country || {};
  const fx = payload.fx || {};

  // supported lists
  const supported = payload.supported || {};
  const countries = toArray(supported.countries).map((c) => ({
    code: c.code || "",
    name: c.name || c.label || c.code || "",
    flag_emoji: c.flag_emoji || "🌍",
  }));

  // allow either [{code}] or ["GHS", ...]
  const currencies = toArray(supported.currencies).map((c) =>
    typeof c === "string" ? { code: c } : { code: c.code || "" }
  );

  // allow either [{code,label}] or ["en-GB", ...]
  const languages = toArray(supported.languages).map((l) =>
    typeof l === "string" ? { code: l, label: l } : { code: l.code || "", label: l.label || l.code || "" }
  );

  return {
    country: {
      code: country.code || "",
      name: country.name || "",
      default_currency: country.default_currency || "",
      default_language: country.default_language || "",
    },
    currency: payload.currency || "",
    language: payload.language || "",
    supported: { countries, currencies, languages },
    fx: {
      base: fx.base || "USD",
      rates: fx.rates || {},
      as_of: fx.as_of || null,
      margin_bps: Number(fx.margin_bps || 0),
      stale: Boolean(fx.stale),
    },
  };
}

/* -------------------------------------------------------------
 * Network
 * ----------------------------------------------------------- */
/**
 * Fetch the bootstrap/init payload for localization.
 *
 * Uses the unified proxy via `api('i18n/init?...')`. The helper will:
 * - root the path under `/api/…`
 * - ensure a trailing slash for DRF
 * - include cookies and X-Timezone header
 * - work on both server and client
 */
export async function fetchI18nInit(
  country,
  { timeout = 6000, revalidate = 900 } = {}
) {
  const cc = normalizeCountry(country) || "uk";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  // Only add Next.js caching hints on the server.
  const nextHints =
    typeof window === "undefined"
      ? { next: { revalidate, tags: [`i18n-init-${cc}`] } }
      : {};

  try {
    // Pass a clean path; the api() helper will turn this into `/api/i18n/init/?country=…`
    const data = await api(`i18n/init?country=${encodeURIComponent(cc)}`, {
      signal: controller.signal,
      ...nextHints,
    }).catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("[i18n] init fetch failed:", err?.message || err);
      }
      return null;
    });

    if (!data) return null;
    return sanitizeInit(data);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Optional: reads the country slug from a pathname like “/gh/products…”.
 * Useful on the server if you want to pass routeCc into your Provider.
 */
export function slugFromPath(pathname = "/") {
  const first = String(pathname || "/")
    .split("/")
    .filter(Boolean)[0];
  const slug = (first || "").toLowerCase();
  return ["gh", "ng", "ke", "uk"].includes(slug) ? slug : null;
}
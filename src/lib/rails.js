// src/lib/rails.js
import { api } from "./api";
import { ccToISO } from "./cc";

// Pick the field name via env to match your DRF ProductFilterView
const COUNTRY_PARAM = process.env.NEXT_COUNTRY_PARAM || "user__country__code";

/**
 * Base rail loader with ISR + revalidate tag.
 * Accepts arbitrary ProductFilterView params.
 */
export async function loadRail(cc, params = {}, tag, revalidate = 600) {
  const ISO = ccToISO(cc);
  const base = { [COUNTRY_PARAM]: ISO, page_size: "12", ...params };

  const qs = new URLSearchParams(
    Object.entries(base).filter(([, v]) => v != null && v !== "")
  ).toString();

  try {
    const data = await api(`/api/products/?${qs}`, {
      next: { revalidate, tags: [tag] }, // <- required for ISR + tag revalidate
    });
    const results = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
      ? data
      : [];
    return results;
  } catch (e) {
    // Be resilient: show page even if rail call fails
    console.warn("loadRail error", e);
    return [];
  }
}

/** Common rails (tweak filters to match your API) */
export const loadTrending = (cc) => loadRail(cc, { ordering: "-created_at" },        `rail:trending:${cc}`, 600);
export const loadRecent   = (cc) => loadRail(cc, { ordering: "-updated_at" },        `rail:recent:${cc}`,   600);
export const loadVerified = (cc) => loadRail(cc, { user__verified: "verified" },     `rail:verified:${cc}`, 900);
export const loadSameDay  = (cc) => loadRail(cc, { delivery: "same-day" },           `rail:sameday:${cc}`,  900);
// Later ideas:
// export const loadUnder100  = (cc) => loadRail(cc, { price_lte: 100 },                `rail:under100:${cc}`, 900);
// export const loadWholesale = (cc) => loadRail(cc, { is_wholesale: true },            `rail:wholesale:${cc}`,900);
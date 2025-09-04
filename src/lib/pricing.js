// Canonical product pricing logic for PDP + basket
// - Prefer product *_cents; accept pricing.*_cents as fallback
// - Seller currency: product.price_currency -> product.currency -> pricing.currency -> "USD"
// - Applies variant add-ons (minor→major)
// - Safe FX: if conversion fails or UI==seller → keep seller currency
// - If no positive price → expose null so UI can render "Ask for price"
// - Tracer: add ?debugPrice=1 to the URL to dump a full trace to console

/* ---------------- tracer ---------------- */
const shouldTrace = () => {
  try {
    if (typeof window === "undefined") return false;
    const qs = new URLSearchParams(window.location.search);
    if (qs.has("debugPrice")) return true;
    if (window.__UP_DEBUG_PRICE__) return true;
    if (localStorage.getItem("debugPrice") === "1") return true;
  } catch {}
  return false;
};
const trace = (...args) => console.log("[pricing]", ...args);

/* ---------------- helpers ---------------- */
const toNum = (v) => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  let s = String(v).trim();
  if (!s) return null;
  // keep digits, dot, comma, minus
  s = s.replace(/[^\d,.\-]/g, "");
  // If both dot & comma → assume comma is thousands
  if (s.includes(".") && s.includes(",")) s = s.replace(/,/g, "");
  // If only commas → treat as thousands
  else if (s.includes(",") && !s.includes(".")) s = s.replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const isPos = (n) => n != null && Number.isFinite(n) && n > 0;

const pickPositive = (...vals) => {
  for (const v of vals) {
    const n = toNum(v);
    if (isPos(n)) return n;
  }
  return null;
};

export const symbolFor = (currency, locale = "en") => {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).formatToParts(1);
    return parts.find((p) => p.type === "currency")?.value || currency;
  } catch {
    return currency || "";
  }
};

export const formatAmountOnly = (amount, currency, locale = "en") => {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).formatToParts(amount);
    return parts
      .filter((p) => p.type !== "currency")
      .map((p) => p.value)
      .join("")
      .trim();
  } catch {
    return Number(amount || 0).toFixed(2);
  }
};

const isSaleActiveNow = (saleEndISO) => {
  if (!saleEndISO) return false;
  const end = new Date(saleEndISO);
  if (isNaN(end)) return false;
  return end.getTime() > Date.now();
};

/* ---------------- main ---------------- */
/**
 * Build canonical pricing for a product.
 *
 * @param {object} product
 * @param {object} opts
 *  - uiCurrency: string (UI currency preference)
 *  - locale: string (e.g. 'en-GB')
 *  - conv: (amountMajor, fromCurrency) => number (safe FX; may throw/return NaN)
 *  - selectedVariants: map of variant.id -> value (each may include additional_price_cents)
 */
export function buildPricing(
  product,
  { uiCurrency, locale = "en", conv, selectedVariants = {} } = {}
) {
  const p =
    (product && typeof product.pricing === "object" && product.pricing) || null;

  // chooseCents that reports its source (product|backend|null)
  const chooseCents = (productCents, backendCents) => {
    const prod = toNum(productCents);
    if (isPos(prod)) return { cents: prod, source: "product" };
    const back = toNum(backendCents);
    if (isPos(back)) return { cents: back, source: "backend" };
    return { cents: 0, source: null };
  };

  const pickCurrency = (...vals) => {
    for (const v of vals) {
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return null;
  };

  // Base/sale/postage cents with source tagging
  const baseSel = chooseCents(product?.price_cents, p?.base_cents);
  const saleSel = chooseCents(product?.sale_price_cents, p?.sale_cents);
  const postSel = chooseCents(product?.postage_fee_cents, p?.postage_cents);

  // Derive sellerCurrency from the source that supplied cents (prevents currency drift).
  const anyFromProduct =
    baseSel.source === "product" ||
    saleSel.source === "product" ||
    postSel.source === "product";
  const anyFromBackend =
    baseSel.source === "backend" ||
    saleSel.source === "backend" ||
    postSel.source === "backend";

  let sellerCurrency = null;
  if (anyFromProduct) {
    sellerCurrency =
      pickCurrency(
        product?.price_currency,
        product?.currency,
        p?.currency
      ) || "USD";
  } else if (anyFromBackend) {
    sellerCurrency =
      pickCurrency(
        p?.currency,
        product?.price_currency,
        product?.currency
      ) || "USD";
  } else {
    // Neither cents source available — fall back in documented order.
    sellerCurrency =
      pickCurrency(
        product?.price_currency,
        product?.currency,
        p?.currency
      ) || "USD";
  }

  // Additional price (minor → major)
  const additionalCentsFromVariants = Object.values(selectedVariants).reduce(
    (s, v) => s + (toNum(v?.additional_price_cents) || 0),
    0
  );
  const additionalCentsProduct = toNum(product?.total_additional_cents) || 0;
  const addMajor =
    (additionalCentsFromVariants + additionalCentsProduct) / 100;

  // Convert to seller-major; if no minor units, fall back to any (major) fields
  const baseMajorFromCents = isPos(baseSel.cents) ? baseSel.cents / 100 : null;
  const saleMajorFromCents = isPos(saleSel.cents) ? saleSel.cents / 100 : null;

  const baseMajorRaw =
    baseMajorFromCents ??
    pickPositive(
      product?.price,
      product?.unit_price,
      product?.base_price,
      product?.secondary_data?.price
    );

  const saleMajorRaw =
    saleMajorFromCents ??
    pickPositive(product?.sale_price, product?.secondary_data?.sale_price);

  // Sale active? Respect backend boolean if present; else use end date.
  const backendSaleFlag =
    p && Object.prototype.hasOwnProperty.call(p, "sale_active")
      ? !!p.sale_active
      : null;

  const saleActive =
    (backendSaleFlag ?? isSaleActiveNow(product?.sale_end_date)) &&
    isPos(saleMajorRaw);

  // Core price to show (seller major)
  const chosenCoreMajor = saleActive ? saleMajorRaw : baseMajorRaw;
  const fallbackCoreMajor = baseMajorRaw ?? saleMajorRaw ?? null;
  const coreMajorToShow = isPos(chosenCoreMajor)
    ? chosenCoreMajor
    : isPos(fallbackCoreMajor)
    ? fallbackCoreMajor
    : null;

  // Final seller majors (+ add-ons)
  const activeSellerMajor =
    coreMajorToShow != null ? coreMajorToShow + addMajor : null;
  const originalSellerMajor = saleActive
    ? (baseMajorRaw ?? 0) + addMajor
    : null;
  const postageSellerMajor = isPos(postSel.cents) ? postSel.cents / 100 : 0;

  // Safe FX — NEVER convert when UI==seller
  const tryFX = (amt) => {
    if (amt == null) return null;
    try {
      if (conv && uiCurrency && sellerCurrency && uiCurrency !== sellerCurrency) {
        const out = Number(conv(amt, sellerCurrency));
        if (Number.isFinite(out) && out > 0) return out;
      }
    } catch {}
    return amt; // fallback to seller major
  };

  // Decide display currency: only switch if conversion worked
  let displayCurrency = sellerCurrency;
  if (uiCurrency && uiCurrency !== sellerCurrency && activeSellerMajor != null) {
    const maybe = tryFX(activeSellerMajor);
    if (maybe !== activeSellerMajor) {
      displayCurrency = uiCurrency;
    }
  }

  const toDisplay = (amtSellerMajor) => {
    if (amtSellerMajor == null || amtSellerMajor <= 0) return null;
    const value =
      displayCurrency === sellerCurrency ? amtSellerMajor : tryFX(amtSellerMajor);
    return {
      major: value,
      currency: displayCurrency,
      symbol: symbolFor(displayCurrency, locale),
      amountOnly: formatAmountOnly(value, displayCurrency, locale),
    };
  };

  const active = toDisplay(activeSellerMajor);
  const original = saleActive ? toDisplay(originalSellerMajor) : null;
  const postage = postageSellerMajor > 0 ? toDisplay(postageSellerMajor) : null;

  // -------- TRACE --------
  if (shouldTrace()) {
    trace({
      id: product?.id,
      title: product?.title,
      uiCurrency,
      sellerCurrency,
      pricingCurrency: p?.currency || null,
      centsSources: {
        base: baseSel.source,
        sale: saleSel.source,
        postage: postSel.source,
      },
      base_cents: baseSel.cents,
      sale_cents: saleSel.cents,
      postage_cents: postSel.cents,
      baseMajorRaw,
      saleMajorRaw,
      addMajor,
      saleActive,
      coreMajorToShow,
      activeSellerMajor,
      displayCurrency,
      display: {
        symbol: active?.symbol || symbolFor(displayCurrency, locale),
        activeAmountOnly: active?.amountOnly || null,
        originalAmountOnly: original?.amountOnly || null,
        postageAmountOnly: postage?.amountOnly || null,
      },
    });
  }
  // ------ END TRACE ------

  return {
    // raw facts
    sellerCurrency,
    saleActive,
    sale_end_date: product?.sale_end_date || null,

    // seller-major (for basket/analytics)
    seller: {
      activeMajor: activeSellerMajor,
      originalMajor: originalSellerMajor,
      postageMajor: postageSellerMajor,
    },

    // display payload (what UI needs)
    display: {
      currency: displayCurrency,
      symbol: active?.symbol || symbolFor(displayCurrency, locale),
      activeAmountOnly: active?.amountOnly || null,
      originalAmountOnly: original?.amountOnly || null,
      postageAmountOnly: postage?.amountOnly || null,
    },
  };
}
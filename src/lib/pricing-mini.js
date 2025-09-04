// Minimal canonical pricing (no images, no extras)
// Prefers *_cents; uses pricing.*_cents only if currency matches seller.
// One-shot FX; postage always shown in seller currency. Includes tracer.

/* ---------------- tracer ---------------- */
const shouldTrace = () => {
  try {
    if (typeof window === "undefined") return false;
    const qs = new URLSearchParams(window.location.search);
    return (
      qs.has("debugPrice") ||
      window.__UP_DEBUG_PRICE__ === true ||
      localStorage.getItem("debugPrice") === "1"
    );
  } catch {}
  return false;
};
const trace = (...a) => console.log("[pricing-mini]", ...a);

/* ---------------- helpers ---------------- */
const toNum = (v) => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  let s = String(v).trim();
  if (!s) return null;
  s = s.replace(/[^\d,.\-]/g, "");
  if (s.includes(".") && s.includes(",")) s = s.replace(/,/g, "");
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
const isSaleActiveNow = (iso) => {
  if (!iso) return false;
  const end = new Date(iso);
  return !isNaN(end) && end.getTime() > Date.now();
};

export const symbolFor = (currency, locale = "en") => {
  // small override for nicer symbols
  const OVERRIDE = { GHS: "₵", NGN: "₦", KES: "KSh", ZAR: "R" };
  if (OVERRIDE[currency]) return OVERRIDE[currency];
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

/**
 * @param {object} product
 * @param {object} opts { uiCurrency, locale, conv }
 */
export function buildPricing(product, { uiCurrency, locale = "en", conv } = {}) {
  const p =
    (product && typeof product.pricing === "object" && product.pricing) || null;

  // Seller currency precedence
 const sellerCurrency = product?.price_currency || p?.currency || "USD";
  const backendCurrency = p?.currency || null;

  // Use cents source first, but only accept backend cents if currencies match.
  const pickCents = (prodCents, beCents) => {
    const a = toNum(prodCents);
    if (isPos(a)) return { cents: a, src: "product" };
    const b = toNum(beCents);
    if (isPos(b) && (!backendCurrency || backendCurrency === sellerCurrency)) {
      return { cents: b, src: "pricing" };
    }
    return { cents: 0, src: null };
  };
  const baseSel = pickCents(product?.price_cents, p?.base_cents);
  const saleSel = pickCents(product?.sale_price_cents, p?.sale_cents);
  const postSel = pickCents(product?.postage_fee_cents, p?.postage_cents);

  // Major from cents first; otherwise any major fields (sanitized)
  const baseMajor = isPos(baseSel.cents)
    ? baseSel.cents / 100
    : pickPositive(
        product?.price,
        product?.unit_price,
        product?.base_price,
        product?.secondary_data?.price
      );

  const saleMajor = isPos(saleSel.cents)
    ? saleSel.cents / 100
    : pickPositive(product?.sale_price, product?.secondary_data?.sale_price);

  const postageMajor = isPos(postSel.cents) ? postSel.cents / 100 : 0;

  // Sale flag
  const saleActive =
    (p && Object.prototype.hasOwnProperty.call(p, "sale_active")
      ? !!p.sale_active
      : isSaleActiveNow(product?.sale_end_date)) && isPos(saleMajor);

  // Core price (seller major)
  const coreMajor = isPos(saleActive ? saleMajor : baseMajor)
    ? saleActive
      ? saleMajor
      : baseMajor
    : isPos(baseMajor)
    ? baseMajor
    : isPos(saleMajor)
    ? saleMajor
    : null;

  // One-shot FX (prices only). If UI==seller or conversion fails → keep seller figures.
  const convert = (amt) => {
    if (amt == null) return null;
    if (!conv || !uiCurrency || uiCurrency === sellerCurrency) return amt;
    try {
      const out = Number(conv(amt, sellerCurrency));
      return Number.isFinite(out) && out > 0 ? out : amt;
    } catch {
      return amt;
    }
  };

  // Freeze display currency choice (only if conversion changed the number)
// prefer UI currency if provided & different
const wantUiDisplay = !!uiCurrency && uiCurrency !== sellerCurrency;
const displayCurrency = wantUiDisplay ? uiCurrency : sellerCurrency;

const asDisplay = (amtSellerMajor) => {
  if (!isPos(amtSellerMajor)) return null;
  // try converting when we want UI currency; fall back to seller major if conversion fails
  const maybe = wantUiDisplay ? convert(amtSellerMajor) : amtSellerMajor;
  const val = isPos(maybe) ? maybe : amtSellerMajor;
  return {
    currency: displayCurrency,
    symbol: symbolFor(displayCurrency, locale),
    amountOnly: formatAmountOnly(val, displayCurrency, locale),
    major: val,
  };
};

  // Postage ALWAYS shown in seller currency
  const asSellerDisplay = (amtSellerMajor) => {
    if (!isPos(amtSellerMajor)) return null;
    return {
      currency: sellerCurrency,
      symbol: symbolFor(sellerCurrency, locale),
      amountOnly: formatAmountOnly(amtSellerMajor, sellerCurrency, locale),
      major: amtSellerMajor,
    };
  };

  const active = asDisplay(coreMajor);
  const original = saleActive && isPos(baseMajor) ? asDisplay(baseMajor) : null;
  const postage = postageMajor > 0 ? asSellerDisplay(postageMajor) : null;

  if (shouldTrace()) {
    trace({
      id: product?.id,
      title: product?.title,
      sellerCurrency,
      uiCurrency,
      backendCurrency,
      base_cents: baseSel.cents,
      sale_cents: saleSel.cents,
      postage_cents: postSel.cents,
      base_src: baseSel.src,
      sale_src: saleSel.src,
      postage_src: postSel.src,
      baseMajor,
      saleMajor,
      coreMajor,
      saleActive,
      displayCurrency,
      display: {
        activeAmountOnly: active?.amountOnly ?? null,
        originalAmountOnly: original?.amountOnly ?? null,
        postageAmountOnly: postage?.amountOnly ?? null,
      },
    });
  }

  return {
    // raw facts
    sellerCurrency,
    saleActive,
    sale_end_date: product?.sale_end_date || null,

    // seller-major (for analytics/basket)
    seller: {
      activeMajor: coreMajor,
      originalMajor: saleActive ? baseMajor : null,
      postageMajor,
    },

    // display payload
    display: {
      currency: displayCurrency,
      symbol: active?.symbol || symbolFor(displayCurrency, locale),
      activeAmountOnly: active?.amountOnly || null,
      originalAmountOnly: original?.amountOnly || null,
      postageAmountOnly: postage?.amountOnly || null, // seller currency
    },
  };
}
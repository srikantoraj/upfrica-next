// pdp-shipping-preview.js
'use client';
import * as React from 'react';
import { api as request, apiJSON } from "@/lib/api";
import { b } from "@/lib/api-path";

/* ---------------------------------- */
const EP = {
  sellerZoneConfigs: [
    "core/shipping/seller-zone-configs",
    "shipping/seller-zone-configs",
    "core/shipping/seller-zone-config",
    "shipping/seller-zone-config",
  ],
  methods: ["core/shippingmethod","shippingmethod","shipping/methods","core/shipping/methods"],
  zones: ["core/shippingzone","shippingzone","shipping/zones","core/shipping/zones"],
  deliveryOptions: ["shipping/options","core/shipping/options"],
};

const CCY_BY_COUNTRY = { GH:"GHS", NG:"NGN", KE:"KES", ZA:"ZAR", UG:"UGX", TZ:"TZS", RW:"RWF", GB:"GBP", EU:"EUR", US:"USD", CA:"CAD", AU:"AUD" };
const CCY_SYMBOLS = { GHS:"GH₵", NGN:"₦", KES:"KSh", ZAR:"R", UGX:"USh", TZS:"TSh", RWF:"FRw", GBP:"£", EUR:"€", USD:"$", CAD:"C$", AUD:"A$" };
const inferCurrencyFromCountry = (cc) => CCY_BY_COUNTRY[String(cc||"").toUpperCase()] || "USD";
const ccySymbol = (c) => CCY_SYMBOLS[String(c||"").toUpperCase()] || String(c||"").toUpperCase();
const toMinor = (o) => (o==null||o===""||Number.isNaN(Number(o)))?0:Math.round(Number(o)*100);
const asList = (x) => Array.isArray(x) ? x :
  (x?.options || x?.results || x?.items || x?.data || x?.objects || []);

const ensureSlash = (p="") => (p && !p.endsWith("/") ? `${p}/` : p);
const expand = (paths) => (Array.isArray(paths)?paths:[paths]).flatMap(p => [p, ensureSlash(p)]);
const is404 = (e) => (e?.status ?? e?.response?.status) === 404;
const cleanedParams = (o={}) => Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined&&v!==null&&v!==""));
async function apiGet(pathOrPaths, params) {
  let last;
  for (const p of expand(pathOrPaths)) {
    try { return await request(b(p, cleanedParams(params))); }
    catch(e){ if(!is404(e)) throw e; last=e; }
  }
  throw last || new Error("All GET candidates failed");
}

/* FIX: don’t wrap EP.deliveryOptions in [] */
const previewPath = ({productId, shopSlug}) => {
  const p=[];
  if(productId){ p.push(`products/${productId}/shipping/preview`,`product/${productId}/shipping/preview`); }
  if(shopSlug){ p.push(`shops/${shopSlug}/shipping/preview`,`shop/${shopSlug}/shipping/preview`); }
  return p.length ? p : EP.deliveryOptions;
};

/* ------------ zone helpers + synth ------------- */
const countryCodeOf = (z) => (z?.country_code || z?.country?.code || "").toUpperCase();
const isAllZone = (z) => {
  const name=String(z?.name||"").toLowerCase(),
        code=String(z?.code||"").toUpperCase(),
        region=String(z?.region_code||"").toUpperCase();
  return /(^|\s|\()all(\)|\s|$)/i.test(name) || code.endsWith("_ALL") || region==="ALL";
};
const zoneMatches = (z,{country,city}) => {
  if (countryCodeOf(z)!==String(country||"").toUpperCase()) return false;
  const name=String(z?.name||"").toLowerCase();
  return !city || isAllZone(z) || name.includes(String(city).toLowerCase());
};

async function hydrateFromConfigIds(cfgs) {
  const ids = (arr, k) => Array.from(new Set(arr.map(c => c[k]).filter(Boolean)));
  const zoneIds = ids(cfgs.map(c => ({...c, zone_id: c.zone?.id ?? c.zone_id})), "zone_id");
  const methodIds = ids(cfgs.map(c => ({...c, shipping_method_id: c.shipping_method?.id ?? c.shipping_method_id})), "shipping_method_id");
  const fetchOne = (id, bases) => apiGet(bases.map(base => `${ensureSlash(base)}${id}/`)).catch(()=>null);
  const [zs, ms] = await Promise.all([
    Promise.all(zoneIds.map(id => fetchOne(id, EP.zones))).then(r => r.filter(Boolean)),
    Promise.all(methodIds.map(id => fetchOne(id, EP.methods))).then(r => r.filter(Boolean)),
  ]);
  return {
    zoneById: Object.fromEntries(zs.map(z => [z.id, z])),
    methodById: Object.fromEntries(ms.map(m => [m.id, m])),
  };
}

function computeOptionsFromConfigs(cfgs, { country, city }) {
  const active = (cfgs||[]).filter(c => (c?.is_active ?? true) && zoneMatches(c?.zone, { country, city }));
  const toOption = (c) => {
    const cc = countryCodeOf(c.zone);
    const etaMin = (c.handling_min_days||0)+(c.transit_min_days||0);
    const etaMax = ((c.handling_max_days ?? c.handling_min_days)||0)+((c.transit_max_days ?? c.transit_min_days)||0);
    return {
      fee_minor: Number.isFinite(c.fee_minor)? c.fee_minor : toMinor(c.fee),
      fee: c.fee,
      currency: c.currency || inferCurrencyFromCountry(cc),
      eta_min_days: etaMin,
      eta_max_days: etaMax,
      method_code: c.shipping_method?.code || String(c.shipping_method?.id ?? c.shipping_method_id ?? ""),
      zone_code: c.zone?.code || "",
    };
  };
  if (!city) return active.map(toOption); // show all matches when city isn’t set
  const byMethod = new Map();
  for (const c of active) {
    const key = String(c.shipping_method?.id ?? c.shipping_method_id);
    const cur = byMethod.get(key);
    if (!cur || (isAllZone(cur.zone) && !isAllZone(c.zone))) byMethod.set(key, c);
  }
  return Array.from(byMethod.values()).map(toOption);
}

/* --------- build preview param variants --------- */
function buildParamVariants({ productId, sellerId, deliverTo }) {
  const cc = String(deliverTo.country || "GB").toUpperCase();
  const city = deliverTo.city?.trim() || "";
  const postcode = deliverTo.postcode?.trim() || "";

  const base = (extra = {}) =>
    cleanedParams({
      product_id: productId,
      seller_id: sellerId,
      include_payments: false,
      ...extra,
    });

  const variants = [];
  const ccKeys   = [{ country: cc }, { deliver_cc: cc }];
  const cityKeys = [{}, { city }, { deliver_to_city: city }];
  const postKeys = [{}, { postcode }, { deliver_to_postcode: postcode }, { zip: postcode }];

  for (const ck of ccKeys) for (const ck2 of cityKeys) for (const pk of postKeys)
    variants.push(base({ ...ck, ...ck2, ...pk }));

  // also try dropping city (cookie/foreign-city over-filter guard)
  for (const ck of ccKeys) variants.push(base({ ...ck, city: "" }));

  return variants;
}

/* -------- main: preview -> synth fallback (always) -------- */
async function getOptions({ productId, sellerId, deliverTo }) {
  const candidates = previewPath({ productId, shopSlug: null });
  const variants = buildParamVariants({ productId, sellerId, deliverTo });

  // 1) backend preview (try variants until we get options)
  for (const params of variants) {
    try {
      const data = await apiGet(candidates, params);
      const list = asList(data);
      if (list.length) return list;
    } catch {}
  }

  // 2) synth from configs (filter to sellerId if provided)
  try {
    const cfgsRaw = asList(await apiGet(EP.sellerZoneConfigs));
    if (!cfgsRaw.length) return [];
    // optionally try other sellers if sellerId is missing (best-effort)
    if (!sellerId) {
      const sellerIds = Array.from(new Set(cfgsRaw.map(c => c.seller?.id || c.seller_id).filter(Boolean)));
      for (const sid of sellerIds) {
        for (const params of variants) {
          try {
            const data = await apiGet(candidates, { ...params, seller_id: sid });
            const list = asList(data);
            if (list.length) return list;
          } catch {}
        }
      }
    }

    const { zoneById, methodById } = await hydrateFromConfigIds(cfgsRaw);
    const filtered = sellerId
      ? cfgsRaw.filter(c => String(c.seller?.id ?? c.seller_id) === String(sellerId))
      : cfgsRaw;

    const hydrated = filtered.map(c => ({
      ...c,
      zone: c.zone || zoneById[c.zone_id],
      shipping_method: c.shipping_method || methodById[c.shipping_method_id],
    }));

    return computeOptionsFromConfigs(hydrated, {
      country: deliverTo.country,
      city: deliverTo.city,
    });
  } catch {
    return [];
  }
}

/* ----------------- Public hook for PDP ------------------ */
export function usePdpShippingPreview({ productId, sellerId }) {
  const [state, setState] = React.useState({ loading: true, min: null, ccy: null });

  React.useEffect(() => {
    let cancelled = false;
    const readDeliverTo = () => {
      try { return JSON.parse(localStorage.getItem("upfrica.deliverTo")||"{}"); } catch { return {}; }
    };
    (async () => {
      const deliverTo = readDeliverTo();
      const opts = await getOptions({ productId, sellerId, deliverTo });
      if (cancelled) return;
      if (opts.length) {
        const minOpt = opts.reduce((m, x) => {
          const fm = x.fee_minor ?? toMinor(x.fee);
          return fm < (m.fee_minor ?? toMinor(m.fee)) ? x : m;
        }, opts[0]);
        const ccy = minOpt.currency || inferCurrencyFromCountry(deliverTo.country || "GB");
        setState({ loading: false, min: (minOpt.fee_minor ?? toMinor(minOpt.fee)), ccy });
      } else {
        setState({ loading: false, min: null, ccy: null });
      }
    })();
    return () => { cancelled = true; };
  }, [productId, sellerId]);

  const text = state.loading
    ? "Calculating…"
    : state.min === 0
      ? "Free delivery"
      : state.min != null
        ? `Delivery from ${ccySymbol(state.ccy)} ${(state.min/100).toFixed(2)}`
        : "Shipping at checkout";

  return { ...state, text };
}
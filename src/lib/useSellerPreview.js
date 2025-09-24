// src/lib/useSellerPreview.js
'use client';

import React from 'react';
import { api as request } from '@/lib/api';
import { b } from '@/lib/api-path';

/* ---------------- utils ---------------- */
const ensureSlash = (p = '') => (p && !p.endsWith('/') ? `${p}/` : p);
const cleaned = (o = {}) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null));
const expand = (paths) =>
  Array.from(new Set((Array.isArray(paths) ? paths : [paths]).flatMap((p) => [p, ensureSlash(p)])));

async function apiGet(paths, params) {
  let lastErr;
  for (const p of expand(paths)) {
    try {
      return await request(b(p, cleaned(params)));
    } catch (e) {
      const s = (e?.message || String(e)).toLowerCase();
      if (e?.status === 404 || /404|not\s*found/.test(s)) {
        lastErr = e;
        continue;
      }
      throw e;
    }
  }
  throw lastErr || new Error('All GET candidates failed');
}

const EP = {
  zones: ['core/shippingzone', 'shippingzone', 'shipping/zones', 'core/shipping/zones'],
  methods: ['core/shippingmethod', 'shippingmethod', 'shipping/methods', 'core/shipping/methods'],
  sellerZoneConfigs: [
    'core/shipping/seller-zone-configs',
    'shipping/seller-zone-configs',
    'core/shipping/seller-zone-config',
    'shipping/seller-zone-config',
  ],
  deliveryOptions: ['core/shipping/options', 'shipping/options'], // try these FIRST
};

const previewCandidates = ({ productId, shopSlug }) => {
  const out = [];
  if (productId) {
    out.push(`products/${productId}/shipping/preview`, `product/${productId}/shipping/preview`);
  }
  if (shopSlug) {
    out.push(`shops/${shopSlug}/shipping/preview`, `shop/${shopSlug}/shipping/preview`);
  }
  return out.length ? out : EP.deliveryOptions;
};

async function hydrateFromConfigIds(cfgs) {
  const ids = (arr, k) => Array.from(new Set(arr.map((c) => c[k]).filter(Boolean)));
  const zoneIds = ids(cfgs.map((c) => ({ ...c, zone_id: c.zone?.id ?? c.zone_id })), 'zone_id');
  const methodIds = ids(
    cfgs.map((c) => ({ ...c, shipping_method_id: c.shipping_method?.id ?? c.shipping_method_id })),
    'shipping_method_id'
  );
  const fetchOne = (id, bases) => apiGet(bases.map((base) => `${ensureSlash(base)}${id}/`)).catch(() => null);
  const [zs, ms] = await Promise.all([
    Promise.all(zoneIds.map((id) => fetchOne(id, EP.zones))).then((r) => r.filter(Boolean)),
    Promise.all(methodIds.map((id) => fetchOne(id, EP.methods))).then((r) => r.filter(Boolean)),
  ]);
  return {
    zoneById: Object.fromEntries(zs.map((z) => [z.id, z])),
    methodById: Object.fromEntries(ms.map((m) => [m.id, m])),
  };
}

const toMinor = (o) => (Number.isFinite(+o) ? Math.round(+o * 100) : 0);
const zoneCountry = (z) => (z?.country_code || z?.country?.code || '').toUpperCase();
const isAllZone = (z) =>
  /(^|\s|\()all(\)|\s|$)/i.test(String(z?.name || '')) ||
  String(z?.code || '').toUpperCase().endsWith('_ALL') ||
  String(z?.region_code || '').toUpperCase() === 'ALL';

const zoneMatches = (z, { country, city }) => {
  if (zoneCountry(z) !== String(country || '').toUpperCase()) return false;
  if (!city) return true;
  const name = String(z?.name || '').toLowerCase();
  return isAllZone(z) || name.includes(String(city).toLowerCase());
};

const CCY = {
  GH: 'GHS',
  NG: 'NGN',
  KE: 'KES',
  ZA: 'ZAR',
  UG: 'UGX',
  TZ: 'TZS',
  RW: 'RWF',
  GB: 'GBP',
  EU: 'EUR',
  US: 'USD',
  CA: 'CAD',
  AU: 'AUD',
};
const inferCcy = (cc) => CCY[String(cc || '').toUpperCase()] || 'USD';

function synthesizeFromConfigs(cfgs, { country, city }) {
  const active = (cfgs || []).filter((c) => (c?.is_active ?? true) && zoneMatches(c?.zone, { country, city }));

  const pick = (list) => {
    const byMethod = new Map();
    for (const c of list) {
      const key = String(c.shipping_method?.id ?? c.shipping_method_id);
      const cur = byMethod.get(key);
      const thisAll = isAllZone(c.zone);
      if (!cur || (isAllZone(cur.zone) && !thisAll)) byMethod.set(key, c);
    }
    return Array.from(byMethod.values());
  };

  const chosen = city ? pick(active) : active;
  return chosen.map((c) => {
    const cc = zoneCountry(c.zone);
    const etaMin = (c.handling_min_days || 0) + (c.transit_min_days || 0);
    const etaMax =
      ((c.handling_max_days ?? c.handling_min_days) || 0) +
      ((c.transit_max_days ?? c.transit_min_days) || 0);
    return {
      method_code: c.shipping_method?.code || String(c.shipping_method?.id ?? c.shipping_method_id ?? ''),
      method_label: c.shipping_method?.label || c.method_label || 'Shipping',
      fee_minor: Number.isFinite(c.fee_minor) ? c.fee_minor : toMinor(c.fee),
      currency: c.currency || inferCcy(cc),
      eta_min_days: etaMin,
      eta_max_days: etaMax,
      allowed_payment_codes: c.allowed_payment_codes || c.shipping_method?.allowed_payment_codes || [],
      tracking_required: !!c.shipping_method?.tracking_required,
      zone_code: c.zone?.code || '',
      zone_name: c.zone?.name || '',
    };
  });
}

const sortOpts = (opts) =>
  [...(opts || [])].sort(
    (a, b) =>
      (a.eta_max_days ?? 9999) - (b.eta_max_days ?? 9999) ||
      (a.fee_minor ?? toMinor(a.fee)) - (b.fee_minor ?? toMinor(b.fee)) ||
      (a.eta_min_days ?? 9999) - (b.eta_min_days ?? 9999)
  );

const toList = (d) =>
  Array.isArray(d)
    ? d
    : Array.isArray(d?.options)
    ? d.options
    : Array.isArray(d?.results)
    ? d.results
    : Array.isArray(d?.items)
    ? d.items
    : Array.isArray(d?.data)
    ? d.data
    : Array.isArray(d?.objects)
    ? d.objects
    : [];

/* Build param variants for compatibility with older/newer APIs */
function buildParamVariants({ productId, sellerId, deliverCc, city, postcode, includePayments }) {
  const cc = String(deliverCc || 'GH').toUpperCase();
  const base = (extra = {}) =>
    cleaned({
      product_id: productId,
      seller_id: sellerId,
      include_payments: includePayments,
      ...extra,
    });

  const variants = [];
  const ccKeys = [{ country: cc }, { deliver_cc: cc }];
  const cityKeys = [{}, { city }, { deliver_to_city: city }];
  const postKeys = [{}, { postcode }, { deliver_to_postcode: postcode }, { zip: postcode }];

  for (const ck of ccKeys) for (const ck2 of cityKeys) for (const pk of postKeys) variants.push(base({ ...ck, ...ck2, ...pk }));
  for (const ck of ccKeys) variants.push(base({ ...ck, city: '' }));

  return variants;
}

const getSellerId = (c) => c?.seller?.id ?? c?.seller_id ?? (typeof c?.seller === 'number' ? c.seller : null);
const needsHydration = (c) => !(c?.zone && c?.shipping_method);

/* ---------------- hook ---------------- */
export function useSellerPreview({ productId, sellerId, shopSlug, deliverCc, city = '', postcode = '' }) {
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [reason, setReason] = React.useState(null);

  // cache (per tab)
  const cacheKey = React.useMemo(
    () => JSON.stringify({ productId, sellerId, deliverCc, city, postcode }),
    [productId, sellerId, deliverCc, city, postcode]
  );
  const CACHE =
    typeof window !== 'undefined'
      ? (window.__shipPrevCache ||= new Map())
      : new Map();

  React.useEffect(() => {
    let dead = false;

    (async () => {
      setLoading(true);
      setOptions(null);
      setError(null);
      setReason(null);

      const cc = String(deliverCc || 'GH').toUpperCase();
      const paramVariants = buildParamVariants({ productId, sellerId, deliverCc: cc, city, postcode, includePayments: false });

      // --------------- serve from cache ----------------
      const cached = CACHE.get(cacheKey);
      if (cached) {
        if (!dead) {
          setOptions(cached);
          setLoading(false);
        }
        return;
      }

      try {
        // 0) QUICK PATH
        try {
          const quick = await apiGet(EP.deliveryOptions, {
            product_id: productId,
            seller_id: sellerId,
            include_payments: false,
            country: cc,
            city: city || undefined,
          });
          const quickList = toList(quick);
          if (quickList.length) {
            const sorted = sortOpts(quickList);
            CACHE.set(cacheKey, sorted);
            if (!dead) {
              setOptions(sorted);
              setLoading(false);
            }
            return;
          }
        } catch {}

        // 0b) RACE param variants
        const racers = paramVariants.map((p) =>
          apiGet(EP.deliveryOptions, p).then(toList).catch(() => [])
        );
        const firstNonEmpty = await new Promise((resolve) => {
          let resolved = false;
          let pending = racers.length;
          racers.forEach((pr) =>
            pr.then((list) => {
              if (!resolved && list.length) {
                resolved = true;
                resolve(list);
              } else if (--pending === 0 && !resolved) {
                resolve([]);
              }
            })
          );
        });
        if (firstNonEmpty.length) {
          const sorted = sortOpts(firstNonEmpty);
          CACHE.set(cacheKey, sorted);
          if (!dead) {
            setOptions(sorted);
            setLoading(false);
          }
          return;
        }

        // 1) Legacy preview endpoints
        const candidates = previewCandidates({ productId, shopSlug });
        const previews = await Promise.all(
          paramVariants.map((p) => apiGet(candidates, p).then(toList).catch(() => []))
        );
        const list = previews.find((arr) => arr.length) || [];
        if (list.length) {
          const sorted = sortOpts(list);
          CACHE.set(cacheKey, sorted);
          if (!dead) setOptions(sorted);
          return;
        }

        // 2) Fallback: synthesize from seller configs
        const cfgsRaw = await apiGet(EP.sellerZoneConfigs, { seller_id: sellerId });
        const allCfgs =
          Array.isArray(cfgsRaw) ? cfgsRaw :
          Array.isArray(cfgsRaw?.results) ? cfgsRaw.results :
          Array.isArray(cfgsRaw?.items) ? cfgsRaw.items :
          Array.isArray(cfgsRaw?.data) ? cfgsRaw.data : [];

        const cfgsFiltered = sellerId
          ? allCfgs.filter((c) => String(getSellerId(c)) === String(sellerId))
          : allCfgs;

        let hydrated = cfgsFiltered;
        if (cfgsFiltered.length && needsHydration(cfgsFiltered[0])) {
          const { zoneById, methodById } = await hydrateFromConfigIds(cfgsFiltered);
          hydrated = cfgsFiltered.map((c) => ({
            ...c,
            zone: c.zone || zoneById[c.zone_id],
            shipping_method: c.shipping_method || methodById[c.shipping_method_id],
          }));
        }

        const synthesized = sortOpts(synthesizeFromConfigs(hydrated, { country: cc, city }));
        CACHE.set(cacheKey, synthesized);
        setOptions(synthesized);

        if (!synthesized.length) {
          setReason(city ? `No active shipping methods match ${cc} / “${city}”.` : `No active shipping methods match ${cc}.`);
        }
      } catch (e) {
        setOptions([]);
        setError(e?.message || String(e));
      } finally {
        if (!dead) setLoading(false);
      }
    })();

    return () => { dead = true; };
  }, [productId, sellerId, shopSlug, deliverCc, city, postcode, cacheKey]);

  const cheapest = React.useMemo(() => {
    if (!Array.isArray(options) || !options.length) return null;
    return options.reduce(
      (m, x) => ((x.fee_minor ?? toMinor(x.fee)) < (m.fee_minor ?? toMinor(m.fee)) ? x : m),
      options[0]
    );
  }, [options]);

  const fastest = Array.isArray(options) && options[0] ? options[0] : null;
  const deliverable = Array.isArray(options) ? options.length > 0 : null;

  return { loading, options, cheapest, fastest, deliverable, error, reason };
}
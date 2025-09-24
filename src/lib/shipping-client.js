//src/lib/shipping-client.js
// Plain JS helper used by both shipping settings Dashboard + PDP to fetch delivery options.
// Falls back to synthesizing options from seller zone configs.
// no 'use client' so it can be imported from either side.

// no 'use client' so it can be imported from either side.
// no 'use client' so it can be imported anywhere.

import { api as request } from '@/lib/api';
import { b } from '@/lib/api-path';

/* ---------------- helpers ---------------- */
const asList = (maybe) => {
  if (Array.isArray(maybe)) return maybe;
  if (maybe && Array.isArray(maybe.options)) return maybe.options;
  if (maybe && Array.isArray(maybe.results)) return maybe.results;
  if (maybe && Array.isArray(maybe.items)) return maybe.items;
  if (maybe && Array.isArray(maybe.data)) return maybe.data;
  if (maybe && Array.isArray(maybe.objects)) return maybe.objects;
  return [];
};

const ensureSlash = (p = '') => (p && !p.endsWith('/') ? `${p}/` : p);
const expand = (paths) =>
  Array.from(new Set((Array.isArray(paths) ? paths : [paths]).flatMap((p) => [p, ensureSlash(p)])));
const cleaned = (o = {}) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null));
const is404 = (e) => {
  const status = e?.status ?? e?.response?.status;
  const s = (e && (e.message || String(e))) || 'Error';
  return status === 404 || /\b404\b/.test(s) || /not\s*found/i.test(s);
};

async function apiGet(pathOrPaths, params) {
  let lastErr;
  for (const p of expand(pathOrPaths)) {
    try {
      return await request(b(p, cleaned(params)));
    } catch (e) {
      if (!is404(e)) throw e;
      lastErr = e;
    }
  }
  throw lastErr || new Error('All GET candidates failed');
}

/* ---------------- endpoints ---------------- */
const EP = {
  sellerZoneConfigs: [
    'core/shipping/seller-zone-configs',
    'shipping/seller-zone-configs',
    'core/shipping/seller-zone-config',
    'shipping/seller-zone-config',
  ],
  deliveryOptions: ['shipping/options', 'core/shipping/options'],
};

const previewPath = ({ productId, shopSlug }) => {
  if (productId) return `product/${productId}/shipping/preview`;
  if (shopSlug) return `shop/${shopSlug}/shipping/preview`;
  return EP.deliveryOptions[0];
};

/* ---------------- compute helpers ---------------- */
const toMinor = (o) => {
  if (o == null || o === '' || Number.isNaN(Number(o))) return 0;
  return Math.round(Number(o) * 100);
};

const CCY = { GH:'GHS', NG:'NGN', KE:'KES', ZA:'ZAR', UG:'UGX', TZ:'TZS', RW:'RWF', GB:'GBP', EU:'EUR', US:'USD', CA:'CAD', AU:'AUD' };
const inferCcy = (cc) => CCY[String(cc || '').toUpperCase()] || 'USD';

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

function synthesizeFromConfigs(cfgs, { country, city }) {
  const active = (cfgs || []).filter((c) => c?.is_active && zoneMatches(c?.zone, { country, city }));
  const byMethod = new Map(); // prefer specific zone over ALL per method
  for (const c of active) {
    const key = String(c.shipping_method?.id ?? c.shipping_method_id);
    const cur = byMethod.get(key);
    const thisAll = isAllZone(c.zone);
    if (!cur || (isAllZone(cur?.zone) && !thisAll)) byMethod.set(key, c);
  }
  return Array.from(byMethod.values()).map((c) => {
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
    };
  });
}

export function sortOptions(options) {
  return [...(options || [])].sort(
    (a, b) =>
      (a.eta_max_days ?? 9999) - (b.eta_max_days ?? 9999) ||
      (a.fee_minor ?? toMinor(a.fee)) - (b.fee_minor ?? toMinor(b.fee)) ||
      (a.eta_min_days ?? 9999) - (b.eta_min_days ?? 9999)
  );
}

/* ---------------- main: fetch + fallback ---------------- */
export async function fetchSellerDeliveryOptions({
  productId,
  sellerId,
  deliverCc,
  city = '',
  postcode = '',
  shopSlug = null,
}) {
  const base = {
    product_id: productId,
    seller_id: sellerId,
    country: (deliverCc || 'GH').toUpperCase(),
    city: city || '',
    postcode: postcode || '',
    include_payments: true,
  };

  // 1) preview endpoint
  try {
    let data = await apiGet(previewPath({ productId, shopSlug }), base);
    let list = asList(data);

    // 1b) fallback seller if product-only preview expects it
    if (!sellerId && list.length === 0) {
      try {
        const cfgs = asList(await apiGet(EP.sellerZoneConfigs));
        const fallbackSeller = cfgs?.[0]?.seller ?? cfgs?.[0]?.seller_id ?? null;
        if (fallbackSeller) {
          data = await apiGet(previewPath({ productId, shopSlug }), { ...base, seller_id: fallbackSeller });
          list = asList(data);
        }
      } catch {}
    }

    if (Array.isArray(list) && list.length) return list;

    // 2) synthesize from configs
    const cfgs = asList(await apiGet(EP.sellerZoneConfigs));
    return synthesizeFromConfigs(cfgs, { country: base.country, city: base.city });
  } catch {
    // 3) total fallback: synthesize
    try {
      const cfgs = asList(await apiGet(EP.sellerZoneConfigs));
      return synthesizeFromConfigs(cfgs, { country: base.country, city: base.city });
    } catch {
      return [];
    }
  }
}
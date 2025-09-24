// src/app/dev/shipping-test/page.jsx
// How to run
// • Visit: http://localhost:3000/dev/shipping-test?pid=957&sid=1&cc=GH&city=Accra
// • Toggle include_payments, edit city/postcode, and click Run.
// • The page first tries the generic **core/shipping/options** (seller inferred from product_id or provided).
// • If that returns nothing, it tries the legacy product preview endpoints.
// • If both are empty, it synthesizes from the seller’s zone-configs (server-filtered by seller_id).

'use client';

import React from 'react';

/* ------------ tiny utils (no app imports) ------------ */
const cleaned = (o = {}) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null));

const asList = (x) =>
  Array.isArray(x) ? x :
  Array.isArray(x?.options) ? x.options :
  Array.isArray(x?.results) ? x.results :
  Array.isArray(x?.items)   ? x.items   :
  Array.isArray(x?.data)    ? x.data    :
  Array.isArray(x?.objects) ? x.objects : [];

const tz = () => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; }
  catch { return 'UTC'; }
};

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

const CCY = { GH:'GHS', NG:'NGN', KE:'KES', ZA:'ZAR', UG:'UGX', TZ:'TZS', RW:'RWF', GB:'GBP', EU:'EUR', US:'USD', CA:'CAD', AU:'AUD' };
const inferCcy = (cc) => CCY[String(cc || '').toUpperCase()] || 'USD';

function synthesizeFromConfigs(cfgs, { country, city }) {
  const active = (cfgs || []).filter((c) => (c?.is_active ?? true) && zoneMatches(c?.zone, { country, city }));

  const pick = (list) => {
    const byMethod = new Map();
    for (const c of list) {
      const key = String(c.shipping_method?.id ?? c.shipping_method_id);
      const cur = byMethod.get(key);
      const thisAll = isAllZone(c.zone);
      if (!cur || (isAllZone(cur?.zone) && !thisAll)) byMethod.set(key, c);
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

/* Cover both server shapes with minimal variants */
function buildParamVariants({ productId, sellerId, deliverCc, city, postcode, includePayments }) {
  const cc = String(deliverCc || 'GH').toUpperCase();
  const base = (extra = {}) => cleaned({
    product_id: productId,
    seller_id: sellerId,           // ← prefer true seller_id (user/owner)
    include_payments: includePayments,
    tz: tz(),
    ...extra,
  });
  return [
    base({ country: cc,   city,            postcode }),
    base({ deliver_cc: cc, deliver_to_city: city,        deliver_to_postcode: postcode }),
    base({ deliver_cc: cc, deliver_to_city: '' }), // guard against sticky foreign-city
  ];
}

/* bare fetch helper */
async function get(path, params) {
  const q = new URLSearchParams(cleaned(params)).toString();
  const url = `/api/${path}${q ? `?${q}` : ''}`;
  const r = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' });
  let data = {};
  try { data = await r.json(); } catch {}
  return { ok: r.ok, status: r.status, data };
}

/* hydrate zone & method for synth */
async function hydrateFromConfigIds(cfgs) {
  const ids = (arr, k) => Array.from(new Set(arr.map(c => c[k]).filter(Boolean)));
  const zoneIds = ids(cfgs.map(c => ({ ...c, zone_id: c.zone?.id ?? c.zone_id })), 'zone_id');
  const methodIds = ids(cfgs.map(c => ({ ...c, shipping_method_id: c.shipping_method?.id ?? c.shipping_method_id })), 'shipping_method_id');

  const fetchOne = async (id, bases) => {
    for (const base of bases) {
      const { ok, data } = await get(`${base.replace(/\/$/, '')}/${id}/`, {});
      if (ok && data?.id) return data;
    }
    return null;
  };

  const [zs, ms] = await Promise.all([
    Promise.all(zoneIds.map((id) => fetchOne(id, ['core/shippingzone', 'shippingzone', 'shipping/zones', 'core/shipping/zones']))),
    Promise.all(methodIds.map((id) => fetchOne(id, ['core/shippingmethod', 'shippingmethod', 'shipping/methods', 'core/shipping/methods']))),
  ]);

  return {
    zoneById: Object.fromEntries(zs.filter(Boolean).map((z) => [z.id, z])),
    methodById: Object.fromEntries(ms.filter(Boolean).map((m) => [m.id, m])),
  };
}

export default function Page() {
  const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const [productId, setProductId] = React.useState(Number(sp?.get('pid') ?? 957));
  const [sellerId, setSellerId]   = React.useState(Number(sp?.get('sid') ?? 1)); // ← default to real owner in your env
  const [deliverCc, setDeliverCc] = React.useState((sp?.get('cc') || 'GH').toUpperCase());
  const [city, setCity]           = React.useState(sp?.get('city') || 'Accra');
  const [postcode, setPostcode]   = React.useState(sp?.get('pc') || '');
  const [includePayments, setIP]  = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const [optionsTrace, setOptionsTrace] = React.useState([]);  // core/shipping/options calls
  const [previewTrace, setPreviewTrace] = React.useState([]);  // legacy preview calls
  const [bestList, setBestList] = React.useState(null);        // first non-empty list we got (options > preview)
  const [synth, setSynth] = React.useState(null);
  const [error, setError] = React.useState(null);

  const run = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setOptionsTrace([]);
    setPreviewTrace([]);
    setBestList(null);
    setSynth(null);

    try {
      const variants = buildParamVariants({ productId, sellerId, deliverCc, city, postcode, includePayments });

      // 1) Try generic OPTIONS endpoint first (preferred, seller_id honored)
      const optionsCandidates = ['core/shipping/options', 'shipping/options'];
      const optsTrace = [];
      let winner = null;

      for (const path of optionsCandidates) {
        for (const params of variants) {
          const { status, ok, data } = await get(path, params);
          const list = asList(data);
          optsTrace.push({ path, params, status, length: list.length, sample: list[0] });
          if (!winner && ok && list.length) {
            winner = list;
          }
        }
      }
      setOptionsTrace(optsTrace);

      // 2) If options was empty, try legacy product-level preview handlers
      let previewWinner = null;
      const prevTrace = [];
      if (!winner) {
        const previewCandidates = [
          `products/${productId}/shipping/preview`,
          `product/${productId}/shipping/preview`,
        ];
        for (const path of previewCandidates) {
          for (const params of variants) {
            const { status, ok, data } = await get(path, params);
            const list = asList(data);
            prevTrace.push({ path, params, status, length: list.length, sample: list[0] });
            if (!previewWinner && ok && list.length) {
              previewWinner = list;
            }
          }
        }
      }
      setPreviewTrace(prevTrace);

      const firstGood = winner || previewWinner || null;
      if (firstGood) setBestList(sortOpts(firstGood));

      // 3) Fallback: synthesize from THIS seller’s zone-configs (server filtered)
      const cfgRes = await get('core/shipping/seller-zone-configs', { seller_id: sellerId });
      const filtered = asList(cfgRes.data);
      const { zoneById, methodById } = await hydrateFromConfigIds(filtered);
      const hydrated = filtered.map((c) => ({
        ...c,
        zone: c.zone || zoneById[c.zone_id],
        shipping_method: c.shipping_method || methodById[c.shipping_method_id],
      }));
      const synthesized = sortOpts(synthesizeFromConfigs(hydrated, { country: deliverCc, city }));
      setSynth(synthesized);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [productId, sellerId, deliverCc, city, postcode, includePayments]);

  React.useEffect(() => { run(); }, []); // auto-run once

  const cheapest =
    (bestList && bestList.length && bestList.reduce(
      (m, x) => ((x.fee_minor ?? toMinor(x.fee)) < (m.fee_minor ?? toMinor(m.fee)) ? x : m),
      bestList[0]
    )) || null;

  const deliverable = (bestList && bestList.length) || (synth && synth.length) ? true : false;

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui', padding: 16 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Shipping Preview — Minimal Test</h1>

      <form
        onSubmit={(e) => { e.preventDefault(); run(); }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 12 }}
      >
        <label>Product ID
          <input value={productId} onChange={(e) => setProductId(+e.target.value)} className="input" />
        </label>
        <label>Seller ID
          <input value={sellerId} onChange={(e) => setSellerId(+e.target.value)} className="input" />
        </label>
        <label>Deliver CC
          <input value={deliverCc} onChange={(e) => setDeliverCc(e.target.value.toUpperCase())} className="input" />
        </label>
        <label>City
          <input value={city} onChange={(e) => setCity(e.target.value)} className="input" />
        </label>
        <label>Postcode
          <input value={postcode} onChange={(e) => setPostcode(e.target.value)} className="input" />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={includePayments} onChange={(e) => setIP(e.target.checked)} />
          include_payments
        </label>
        <button type="submit" disabled={loading} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 8 }}>
          {loading ? 'Running…' : 'Run'}
        </button>
      </form>

      <div style={{ margin: '8px 0', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <strong>Summary:</strong>{' '}
        {loading ? 'Loading…' : deliverable ? 'Deliverable ✅' : 'Not deliverable ❌'}
        {cheapest ? (
          <> • Cheapest: <code>{cheapest.currency}</code> {(cheapest.fee_minor ?? toMinor(cheapest.fee)) / 100} • {cheapest.method_label || cheapest.method_code}</>
        ) : null}
      </div>

      {error && <pre style={{ color: 'crimson' }}>{error}</pre>}

      <details open style={{ marginTop: 8 }}>
        <summary><strong>Options calls (in order)</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(optionsTrace, null, 2)}</pre>
      </details>

      <details open style={{ marginTop: 8 }}>
        <summary><strong>Preview calls (in order)</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(previewTrace, null, 2)}</pre>
      </details>

      <details open style={{ marginTop: 8 }}>
        <summary><strong>Best list (first non-empty: options → preview)</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(bestList, null, 2)}</pre>
      </details>

      <details open style={{ marginTop: 8 }}>
        <summary><strong>Fallback (synthesized from seller configs)</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(synth, null, 2)}</pre>
      </details>

      <style jsx>{`
        label { font-size: 12px; display: grid; gap: 4px; }
        .input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
        summary { cursor: pointer; }
      `}</style>
    </div>
  );
}
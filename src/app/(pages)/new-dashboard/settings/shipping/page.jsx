//src/app/(pages)/new-dashboard/settings/shipping/page.jsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin, Truck, CreditCard, Clock, Sparkles, Info, Search, X,
  Loader2, Trash2, CheckCircle2, AlertTriangle, Lock
} from "lucide-react";
import { api as request, apiJSON } from "@/lib/api";
import { b } from "@/lib/api-path";
// Reuse site-wide localization + pricing helpers (fallbacks inside if not provided)
import { useLocalization } from "@/contexts/LocalizationProvider";
import { symbolFor } from "@/lib/pricing-mini";

/* ------------------------------
   Helpers (fetch + utils)
--------------------------------*/
function asList(maybe) {
  if (Array.isArray(maybe)) return maybe;
  if (maybe && Array.isArray(maybe.options)) return maybe.options;
  if (maybe && Array.isArray(maybe.results)) return maybe.results;
  if (maybe && Array.isArray(maybe.items)) return maybe.items;
  if (maybe && Array.isArray(maybe.data)) return maybe.data;
  if (maybe && Array.isArray(maybe.objects)) return maybe.objects;
  return [];
}

function cleanErr(e) {
  const s = (e && (e.message || String(e))) || "Error";
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}

function previewPath({ productId, shopSlug }) {
  const paths = [];

  if (productId) {
    paths.push(
      `products/${productId}/shipping/preview`,
      `product/${productId}/shipping/preview`
    );
  }

  if (shopSlug) {
    paths.push(
      `shops/${shopSlug}/shipping/preview`,
      `shop/${shopSlug}/shipping/preview`
    );
  }

  return paths.length > 0 ? paths : [EP.deliveryOptions];
}

function cleanedParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
}
const ensureSlash = (p = "") => (p && !p.endsWith("/") ? `${p}/` : p);
const toErrorString = (e) => (e && (e.message || String(e))) || "Error";
const is404 = (e) => {
  const status = e?.status ?? e?.response?.status;
  const s = toErrorString(e);
  return status === 404 || /\b404\b/.test(s) || /not\s*found/i.test(s);
};
function expandCandidates(paths) {
  const base = Array.isArray(paths) ? paths : [paths];
  const expanded = base.flatMap((p) => [p, ensureSlash(p)]);
  return Array.from(new Set(expanded));
}
async function apiGet(pathOrPaths, params) {
  const candidates = expandCandidates(pathOrPaths);
  let lastErr;
  for (const p of candidates) {
    try { return await request(b(p, cleanedParams(params))); }
    catch (e) { if (!is404(e)) throw e; lastErr = e; }
  }
  throw lastErr || new Error("All GET candidates failed");
}
async function apiPost(pathOrPaths, body) {
  const candidates = expandCandidates(pathOrPaths);
  let lastErr;
  for (const p of candidates) {
    try { return await apiJSON(b(p), body); }
    catch (e) { if (!is404(e)) throw e; lastErr = e; }
  }
  throw lastErr || new Error("All POST candidates failed");
}
async function apiDelete(pathOrPaths, { id } = {}) {
  const candidates = expandCandidates(pathOrPaths);
  let lastErr;
  for (const p of candidates) {
    try {
      const path = id != null ? `${ensureSlash(p)}${String(id)}/` : p;
      await request(b(path), { method: "DELETE" });
      return true;
    } catch (e) { if (!is404(e)) throw e; lastErr = e; }
  }
  throw lastErr || new Error("All DELETE candidates failed");
}

// Prefix padding helper: ≥2 chars needs a bit more room
function padClassForSymbol(sym) {
  return String(sym || "").length >= 2 ? "pl-12" : "pl-8";
}

/* ------------------------------
   Cookies
--------------------------------*/
// helper to set a cookie for 1 year
function setCookie(name, value) {
  try {
    document.cookie = `${name}=${encodeURIComponent(String(value))}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

/* ------------------------------
   Hydration helpers
--------------------------------*/
// --- hydrate zones/methods by id when configs only have *_id fields ---
async function hydrateFromConfigIds(cfgList) {
  const zoneIds = Array.from(new Set(cfgList.map(c => c.zone?.id ?? c.zone_id).filter(Boolean)));
  const methodIds = Array.from(new Set(cfgList.map(c => c.shipping_method?.id ?? c.shipping_method_id).filter(Boolean)));

  const zoneDetailBases = (EP.zones || []).filter(p => /shippingzone\b/i.test(p));
  const methodDetailBases = (EP.methods || []).filter(p => /shippingmethod\b/i.test(p));
  const fetchOne = (id, bases) => apiGet(bases.map(base => `${ensureSlash(base)}${id}/`)).catch(() => null);

  const [zonesRes, methodsRes] = await Promise.all([
    Promise.all(zoneIds.map(id => fetchOne(id, zoneDetailBases))),
    Promise.all(methodIds.map(id => fetchOne(id, methodDetailBases))),
  ]);

  const zones = zonesRes.filter(Boolean);
  const methods = methodsRes.filter(Boolean);

  return {
    zones,
    methods,
    zoneById: Object.fromEntries(zones.map(z => [z.id, z])),
    methodById: Object.fromEntries(methods.map(m => [m.id, m])),
  };
}

/* ------------------------------
   API endpoints (with fallbacks)
--------------------------------*/
const EP = {
  countries: ["countries"],
  zones: ["core/shippingzone", "shippingzone", "shipping/zones", "core/shipping/zones"],
  methods: ["core/shippingmethod", "shippingmethod", "shipping/methods", "core/shipping/methods"],
  sellerZoneConfigs: [
    "core/shipping/seller-zone-configs",
    "shipping/seller-zone-configs",
    "core/shipping/seller-zone-config",
    "shipping/seller-zone-config",
  ],
  deliveryOptions: ["shipping/options", "core/shipping/options"],
};

/* ------------------------------
   Money + dates
--------------------------------*/
const CCY_BY_COUNTRY = { GH: "GHS", NG: "NGN", KE: "KES", ZA: "ZAR", UG: "UGX", TZ: "TZS", RW: "RWF", GB: "GBP", EU: "EUR", US: "USD", CA: "CAD", AU: "AUD" };
const CCY_SYMBOLS = { GHS: "GH₵", NGN: "₦", KES: "KSh", ZAR: "R", UGX: "USh", TZS: "TSh", RWF: "FRw", GBP: "£", EUR: "€", USD: "$", CAD: "C$", AUD: "A$" };
const inferCurrencyFromCountry = (code) => CCY_BY_COUNTRY[String(code || "").toUpperCase()] || "USD";
const ccySymbol = (ccy) => CCY_SYMBOLS[String(ccy || "").toUpperCase()] || String(ccy || "").toUpperCase();

function moneyFromMinor(minor, ccy) {
  const v = Number(minor);
  const p = Number.isFinite(v) ? (v / 100).toFixed(2) : "0.00";
  return `${ccySymbol(ccy)} ${p}`;
}
function toMinor(o) {
  if (o == null || o === "" || Number.isNaN(Number(o))) return 0;
  const n = Number(o);
  return Math.round(n * 100);
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function etaDateRange(minDays, maxDays) {
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: "short" });
  const start = addDays(new Date(), Math.max(0, minDays || 0));
  const end = addDays(new Date(), Math.max(0, (maxDays ?? minDays) || 0));
  const same = start.toDateString() === end.toDateString();
  return same ? fmt.format(start) : `${fmt.format(start)}–${fmt.format(end)}`;
}

//seller-currency helpe
function sellerCurrencyFromCtx(loc) {
  const candidates = [
    loc?.seller?.currency?.code,
    loc?.seller?.currency_code,
    loc?.shop?.currency?.code,
    loc?.shop?.currency_code,
    loc?.currency?.code,
    loc?.currencyCode,
  ].map(x => (x ? String(x).toUpperCase() : "")).filter(Boolean);
  return candidates[0] || null;
}


/* ------------------------------
   Zone matching + synth preview
--------------------------------*/
const countryCodeOf = (z) => (z?.country_code || z?.country?.code || "").toUpperCase();
const isAllZone = (z) => {
  const name = String(z?.name || "").toLowerCase();
  const code = String(z?.code || "").toUpperCase();
  const region = String(z?.region_code || "").toUpperCase();
  return /(^|\s|\()all(\)|\s|$)/i.test(name) || code.endsWith("_ALL") || region === "ALL";
};
const zoneCountry = (z) => (z?.country_code || z?.country?.code || "").toUpperCase();
function zoneMatches(z, { country, city }) {
  if (zoneCountry(z) !== String(country || "").toUpperCase()) return false;
  const name = String(z?.name || "").toLowerCase();
  const isAll = isAllZone(z);
  if (!city) return true;
  return isAll || name.includes(String(city).toLowerCase());
}

/** Build options from configs, prefer most specific zone when duplicates exist */
/** Build options from configs.
 *  - If a city is provided, we keep one option per method (prefer more specific zone over ALL).
 *  - If NO city is provided, we return **all** matching zone configs for that country.
 */
function computeOptionsFromConfigs(cfgs, { country, city }) {
  const active = (cfgs || []).filter(
    (c) => (c?.is_active ?? true) && zoneMatches(c?.zone, { country, city })
  );

  // helper to normalize a config into an option
  const toOption = (c) => {
    const cc = zoneCountry(c.zone);
    const etaMin = (c.handling_min_days || 0) + (c.transit_min_days || 0);
    const etaMax =
      ((c.handling_max_days ?? c.handling_min_days) || 0) +
      ((c.transit_max_days ?? c.transit_min_days) || 0);
    return {
      method_code:
        c.shipping_method?.code ||
        String(c.shipping_method?.id ?? c.shipping_method_id ?? ""),
      method_label: c.shipping_method?.label || c.method_label || "Shipping",
      fee_minor: Number.isFinite(c.fee_minor) ? c.fee_minor : toMinor(c.fee),
      fee: c.fee,
      currency: c.currency || inferCurrencyFromCountry(cc),
      eta_min_days: etaMin,
      eta_max_days: etaMax,
      allowed_payment_codes:
        c.allowed_payment_codes ||
        c.shipping_method?.allowed_payment_codes ||
        [],
      tracking_required: !!c.shipping_method?.tracking_required,
      zone_code: c.zone?.code || "",
      zone_name: c.zone?.name || "",
    };
  };

  if (!city) {
    // No city: return every applicable config (don’t collapse)
    return active.map(toOption);
  }

  // With a city: collapse to one config per method (prefer specific zone > ALL)
  const byMethod = new Map();
  for (const c of active) {
    const key = String(c.shipping_method?.id ?? c.shipping_method_id);
    const current = byMethod.get(key);
    const thisIsAll = isAllZone(c.zone);
    if (!current || (isAllZone(current.zone) && !thisIsAll)) {
      byMethod.set(key, c);
    }
  }

  return Array.from(byMethod.values()).map(toOption);
}



/* ------------------------------
   Tiny toast
--------------------------------*/
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2500); };
  const node = msg ? (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60]" aria-live="polite">
      <div className="flex items-center gap-2 rounded-full bg-neutral-900 text-white px-4 py-2 text-sm shadow-lg">
        <CheckCircle2 className="h-4 w-4" />
        {msg}
      </div>
    </div>
  ) : null;
  return { show, node };
}

/* ------------------------------
   Entitlements / plan gating
--------------------------------*/
function useEntitlements() {
  const [state, setState] = useState({ canBulkApply: true, multiCountry: true });
  useEffect(() => {
    try {
      const raw = localStorage.getItem("upfrica.entitlements");
      if (raw) {
        const v = JSON.parse(raw);
        setState({
          canBulkApply: !!v.canBulkApply,
          multiCountry: !!v.multiCountry,
        });
      }
    } catch {}
  }, []);
  return state;
}




/* =========================================
   Deliver-To chip (seller-first default)
========================================= */
function DeliverToChip() {
  const loc = typeof useLocalization === "function" ? useLocalization() : null;

  // Best-effort extraction of a seller/user country code from the localization context
  const sellerCountryFromCtx = useMemo(() => {
    const candidates = [
      loc?.seller?.country_code,
      loc?.seller?.country?.code,
      loc?.profile?.country_code,
      loc?.profile?.country?.code,
      loc?.country?.code,
      loc?.countryCode,
      loc?.locale?.country?.code,
    ]
      .map((x) => (x ? String(x).toUpperCase() : ""))
      .filter(Boolean);
    return candidates[0] || null;
  }, [loc]);

  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  useEffect(() => {
    apiGet(EP.countries).then(setCountries).catch(() => setCountries([]));
  }, []);

  // Helper to read a cookie (for site_cc fallback)
  const readCookie = (name) => {
    try {
      const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
      return m ? decodeURIComponent(m[1]) : "";
    } catch {
      return "";
    }
  };

  // Initialize from URL/localStorage; then seller country; then cookie; then "GB"
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const uCountry = (url.searchParams.get("country") || "").toUpperCase();
      const uCity = url.searchParams.get("city") || "";
      const uPost = url.searchParams.get("postcode") || url.searchParams.get("zip") || "";
      if (uCountry) setCountry(uCountry);
      if (uCity) setCity(uCity);
      if (uPost) setPostcode(uPost);
    } catch {}

    try {
      const v = JSON.parse(localStorage.getItem("upfrica.deliverTo") || "{}");
      if (!country && v.country) setCountry(String(v.country).toUpperCase());
      if (!city && v.city) setCity(v.city);
      const vPost = v.postcode || v.zip;
      if (!postcode && vPost) setPostcode(vPost);
    } catch {}

    if (!country) {
      const fromCookie = (readCookie("site_cc") || "").toUpperCase();
      setCountry((sellerCountryFromCtx || fromCookie || "GB").toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerCountryFromCtx]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("upfrica.deliverTo", JSON.stringify({ country, city, postcode }));
      try {
        const url = new URL(window.location.href);
        if (country) url.searchParams.set("country", country); else url.searchParams.delete("country");
        if (city) url.searchParams.set("city", city); else url.searchParams.delete("city");
        if (postcode) url.searchParams.set("postcode", postcode); else url.searchParams.delete("postcode");
        window.history.replaceState({}, "", url);
      } catch {}

      const ccLower = String(country || "").toLowerCase();
      if (ccLower) setCookie("site_cc", ccLower);
      if (city) setCookie(`deliver_to_${ccLower}`, city);
      if (postcode) setCookie(`deliver_to_postcode_${ccLower}`, postcode);

      window.dispatchEvent(new CustomEvent("upfrica:deliverTo"));
      try { window.dispatchEvent(new CustomEvent("locale:changed")); } catch {}
    }
  }, [country, city, postcode]);

  const selected = useMemo(() => {
    const c = countries.find((x) => x.code === country);
    const name = c?.name || country;
    const locText = [city, postcode].filter(Boolean).join(" · ");
    return locText ? `${name} — ${locText}` : name;
  }, [countries, country, city, postcode]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      >
        <MapPin className="h-4 w-4" />
        Deliver to
        <span className="ml-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 truncate max-w-[12rem]">
          {selected}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow-xl">
            <div className="p-4 border-b dark:border-neutral-800">
              <div className="text-base font-semibold">Deliver to</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Choose where you want to see availability, ETA and fees.
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm">City / Area</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. London, Accra"
                  className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Postcode (optional)</label>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. SW1A 1AA"
                  className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                />
              </div>
            </div>
            <div className="p-4 border-t dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-4 py-2 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









/* =========================================
   PDP delivery widget (read-only list)
========================================= */
function PDPDeliveryWidget({ productId, sellerId }) {
  const [opts, setOpts] = useState(null);
  const [err, setErr] = useState(null);
  const [reasons, setReasons] = useState(null);
  const [deliverTo, setDeliverTo] = useState({ country: "GB", city: "", postcode: "" });

  // Read + listen to DeliverTo and config changes
  useEffect(() => {
    const read = () => {
      try {
        const v = JSON.parse(localStorage.getItem("upfrica.deliverTo") || "{}");
        setDeliverTo({
          country: (v.country || "GB").toUpperCase(),
          city: v.city || "",
          postcode: v.postcode || v.zip || "",
        });
      } catch {}
    };
    read();
    const onChange = () => read();
    window.addEventListener("storage", onChange);
    window.addEventListener("upfrica:deliverTo", onChange);
    window.addEventListener("upfrica:shippingConfigChanged", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("upfrica:deliverTo", onChange);
      window.removeEventListener("upfrica:shippingConfigChanged", onChange);
    };
  }, []);

  // --- NEW: hydrate configs so zone/method objects exist ---
  async function getHydratedConfigs() {
    const cfgs = asList(await apiGet(EP.sellerZoneConfigs));
    if (!cfgs.length) return [];
    if (cfgs[0]?.zone && cfgs[0]?.shipping_method) return cfgs; // already hydrated
    try {
      const { zoneById, methodById } = await hydrateFromConfigIds(cfgs);
      return cfgs.map((c) => ({
        ...c,
        zone: c.zone || zoneById[c.zone_id],
        shipping_method: c.shipping_method || methodById[c.shipping_method_id],
      }));
    } catch {
      return cfgs; // best-effort
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr(null);
      setReasons(null);
      setOpts(null);

      const base = cleanedParams({
        product_id: productId,
        seller_id: sellerId,
        deliver_cc: String(deliverTo.country || "GB").toUpperCase(),
        deliver_to_city: deliverTo.city?.trim() || "",
        deliver_to_postcode: deliverTo.postcode?.trim() || "",
        include_payments: true,
      });


try {
  // Try backend preview first
  let data = await apiGet(previewPath({ productId, shopSlug: null }), base);
  let list = asList(data);

  // Fallback: try with any seller we can find from hydrated configs
  if (!sellerId && list.length === 0) {
    try {
      const cfgs = await getHydratedConfigs();

      // collect all possible seller IDs from hydrated configs
      const sellerIds = Array.from(
        new Set(
          cfgs
            .map((c) => c.seller?.id || c.seller_id)
            .filter(Boolean)
        )
      );

      for (const sid of sellerIds) {
        try {
          const data = await apiGet(previewPath({ productId, shopSlug: null }), {
            ...base,
            seller_id: sid,
          });
          const candidate = asList(data);
          if (candidate.length > 0) {
            list = candidate;
            break; // stop after the first seller that returns options
          }
        } catch {
          // ignore and try the next seller
        }
      }
    } catch {
      // swallow errors quietly
    }
  }



  // If buyer hasn't set a city, prefer the synthesized list so we show ALL
// zone matches within the selected country (not just one per method).
if (!deliverTo.city) {
  try {
    const cfgsAll = await getHydratedConfigs();
    const synthAll = computeOptionsFromConfigs(cfgsAll, {
      country: deliverTo.country,
      city: "", // explicitly empty to trigger all-zone branch
    });

    if (Array.isArray(synthAll) && synthAll.length > 0) {
      list = synthAll;
    }
  } catch (err) {
    // keep silent in production, but useful during dev
    if (process.env.NODE_ENV !== "production") {
      console.warn("computeOptionsFromConfigs failed (all-zone)", err);
    }
  }
}


  // NEW: if still empty, synthesize from configs so the right side shows something
  if (list.length === 0) {
    const cfgs = await getHydratedConfigs();
    const synthesized = computeOptionsFromConfigs(cfgs, {
      country: deliverTo.country,
      city: deliverTo.city,
    });

    if (synthesized.length > 0) {
      list = synthesized;
    } else {
      // explain why (now that we have hydrated cfgs)
      const anyCountry = cfgs.filter(
        (c) =>
          (c.zone?.country_code || c.zone?.country?.code || "").toUpperCase() ===
          (deliverTo.country || "").toUpperCase()
      );
      if (anyCountry.length === 0) {
        setReasons(`No active configs for ${deliverTo.country}.`);
      } else {
        const anyActive = anyCountry.some((c) => (c.is_active ?? true));
        const anyCity = anyCountry.some((c) =>
          zoneMatches(c.zone, { country: deliverTo.country, city: deliverTo.city })
        );
        if (!anyActive) {
          setReasons(`Shipping is disabled for ${deliverTo.country}. Turn on “Active” for a method.`);
        } else if (!anyCity && deliverTo.city) {
          setReasons(`No zone matching “${deliverTo.city}”. Try removing the city filter.`);
        }
      }
    }
  }

  if (!cancelled) setOpts(list);
} catch (e) {
  // (unchanged) Fallback: synthesize from hydrated configs on request failure
  try {
    const cfgs = await getHydratedConfigs();
    const synthesized = computeOptionsFromConfigs(cfgs, {
      country: deliverTo.country,
      city: deliverTo.city,
    });
    if (!cancelled) {
      if (!synthesized.length)
        setReasons("No active shipping methods match the selected location.");
      setOpts(synthesized);
    }
  } catch {
    if (!cancelled) {
      setErr(cleanErr(e));
      setOpts([]);
    }
  }
}




    })();
    return () => {
      cancelled = true;
    };
  }, [productId, sellerId, deliverTo.country, deliverTo.city, deliverTo.postcode]);

  function compareOptions(a, b) {
    const aEtaMax = a.eta_max_days ?? 9999;
    const bEtaMax = b.eta_max_days ?? 9999;
    if (aEtaMax !== bEtaMax) return aEtaMax - bEtaMax;
    const aFee = a.fee_minor ?? toMinor(a.fee);
    const bFee = b.fee_minor ?? toMinor(b.fee);
    if (aFee !== bFee) return aFee - bFee;
    const aEtaMin = a.eta_min_days ?? 9999;
    const bEtaMin = b.eta_min_days ?? 9999;
    return aEtaMin - bEtaMin;
  }
  const sortedOpts = useMemo(
    () => (Array.isArray(opts) ? [...opts].sort(compareOptions) : opts),
    [opts]
  );

  return (
    <div className="rounded-2xl border dark:border-neutral-800 bg-white dark:bg-neutral-900" aria-live="polite">
      <div className="p-4 border-b dark:border-neutral-800 flex items-center gap-2">
        <Truck className="h-4 w-4" />
        <div className="font-medium">Delivery options</div>
      </div>

      {sortedOpts === null && !err && (
        <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">Loading delivery options…</div>
      )}

      {err && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <span>Shipping options unavailable — {err}</span>
        </div>
      )}

      {Array.isArray(sortedOpts) && sortedOpts.length === 0 && !err && (
        <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
          No delivery options yet.{reasons ? ` ${reasons}` : ""}
        </div>
      )}

      {Array.isArray(sortedOpts) && sortedOpts.length > 0 && (
        <div className="p-4 space-y-3">
          {(() => {
            const cheapest = sortedOpts.reduce(
              (m, x) =>
                (x.fee_minor ?? toMinor(x.fee)) < (m.fee_minor ?? toMinor(m.fee)) ? x : m,
              sortedOpts[0]
            );
            const fastest = sortedOpts[0];

            return sortedOpts.map((o) => {
              const isCheapest = o === cheapest;
              const isFastest = o === fastest;
              const payments = o.allowed_payment_codes || o.allowed_payments || [];
              const feeMinor = o.fee_minor ?? toMinor(o.fee);
              const isFree = feeMinor === 0;
              const etaDays =
                o.eta_min_days === o.eta_max_days
                  ? `${o.eta_min_days} day${o.eta_min_days === 1 ? "" : "s"}`
                  : `${o.eta_min_days}–${o.eta_max_days} days`;
              const etaDates = etaDateRange(o.eta_min_days, o.eta_max_days);

              return (
                <div key={`${o.method_code}-${o.zone_code}`} className="flex items-center justify-between rounded-xl border dark:border-neutral-800 p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><Truck className="h-4 w-4" /></div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-medium">{o.method_label}</div>
                        {o.zone_name && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">Using: {o.zone_name}</span>
                        )}
                        {isFastest && (
                          <span className="inline-flex items-center gap-1 text-xs rounded-lg px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800">
                            <Sparkles className="h-3 w-3" /> Fastest
                          </span>
                        )}
                        {isCheapest && (
                          <span className="inline-flex items-center text-xs rounded-lg px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800">
                            Best value
                          </span>
                        )}
                        {isFree && (
                          <span className="inline-flex items-center text-xs rounded-lg px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800">
                            Free
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 flex flex-wrap items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Arrives {etaDates} <span className="text-neutral-400">({etaDays})</span>
                      </div>
                      {!!payments.length && (
                        <div className="mt-1 flex flex-wrap gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <CreditCard className="h-3 w-3" />
                          <span>Payments:</span>
                          {payments.map((c) => (
                            <span key={c} className="rounded-md border dark:border-neutral-800 px-1.5 py-0.5">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {isFree ? "Free" : moneyFromMinor(feeMinor, o.currency)}
                    </div>
                    {o.tracking_required && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">Tracking required</div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}




/* =========================================
   Seller matrix (configure per-zone fees)
========================================= */
function ShippingSettingsMatrix() {
  const { canBulkApply } = useEntitlements();
  const [zones, setZones] = useState([]);
  const [methods, setMethods] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIdx, setSavingIdx] = useState(null);
  const [deletingIdx, setDeletingIdx] = useState(null);
  const [errors, setErrors] = useState({}); // per-row validation messages
  const [dirtySet, setDirtySet] = useState(new Set()); // indices with unsaved edits
  const autosaveTimers = useRef({}); // index -> timeout
  const { show, node: toast } = useToast();

  // bulk panel
  const [bulkOpen, setBulkOpen] = useState(false);
  const [zoneQuery, setZoneQuery] = useState("");
  const [bulk, setBulk] = useState({ zoneIds: [], methods: {} });

  //localization + seller currency: 
  const loc = typeof useLocalization === "function" ? useLocalization() : null;
  const sellerCcy = useMemo(() => {
  const fromCtx = sellerCurrencyFromCtx(loc);
  if (fromCtx) return fromCtx;
  const sellerCountry =
    loc?.seller?.country_code ||
    loc?.country?.code ||
    loc?.countryCode;
  return inferCurrencyFromCountry(sellerCountry || "US");
}, [loc]);

// Currency for the Bulk panel: prefer selected zone's country, else seller's currency.
const bulkCcy = useMemo(() => {
  const firstSelectedZone = zones.find(z => bulk.zoneIds.includes(z.id));
  const zoneCountry = firstSelectedZone ? countryCodeOf(firstSelectedZone) : null;
  return (zoneCountry && inferCurrencyFromCountry(zoneCountry)) || sellerCcy || "USD";
}, [bulk.zoneIds, zones, sellerCcy]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [z, m, cfgs] = await Promise.allSettled([
          apiGet(EP.zones),
          apiGet(EP.methods),
          apiGet(EP.sellerZoneConfigs),
        ]);

        const cfgList = cfgs.status === "fulfilled" ? asList(cfgs.value) : [];

        let zonesList = z.status === "fulfilled" ? asList(z.value) : [];
        let methodsList = m.status === "fulfilled" ? asList(m.value) : [];

        // Hydrate if needed
        if ((!zonesList.length || !methodsList.length) && cfgList.length) {
          if (!zonesList.length) zonesList = cfgList.map((c) => c.zone).filter(Boolean);
          if (!methodsList.length)
            methodsList = cfgList.map((c) => c.shipping_method).filter(Boolean);
          if (!zonesList.length || !methodsList.length) {
            const hydrated = await hydrateFromConfigIds(cfgList);
            if (!zonesList.length) zonesList = hydrated.zones;
            if (!methodsList.length) methodsList = hydrated.methods;
          }
        }

        // lookups
        const zoneById = Object.fromEntries((zonesList || []).map((z) => [z.id, z]));
        const methodById = Object.fromEntries((methodsList || []).map((m) => [m.id, m]));

        // rows
        setRows(
          cfgList.map((c) => {
            const zObj = c.zone || zoneById[c.zone_id];
            const mObj = c.shipping_method || methodById[c.shipping_method_id];
            const cc = countryCodeOf(zObj);
            const currency = c.currency || sellerCcy || inferCurrencyFromCountry(cc);
            return {
              id: c.id,
              zoneId: zObj?.id ?? c.zone_id,
              zoneName: zObj ? `${zObj.name} (${cc})` : `Zone #${c.zone_id ?? "?"}`,
              zoneCountry: cc,
              methodId: mObj?.id ?? c.shipping_method_id,
              methodLabel:
                mObj?.label ?? c.method_label ?? `Method #${c.shipping_method_id ?? "?"}`,
              fee: String(c.fee ?? "0.00"),
              handling: c.handling_min_days ?? 0,
              transit: c.transit_min_days ?? 0,
              active: !!c.is_active,
              currency,
            };
          })
        );
        setZones(zonesList);
        setMethods(methodsList);
        setDirtySet(new Set());
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // --- filtering + selection (bulk) ---
  const filteredZones = useMemo(() => {
    const q = zoneQuery.trim().toLowerCase();
    const matches = zones.filter((z) => {
      const code = countryCodeOf(z).toLowerCase();
      return (
        String(z.name || "").toLowerCase().includes(q) ||
        String(z.code || "").toLowerCase().includes(q) ||
        code.includes(q)
      );
    });
    return matches.sort((a, b) => {
      const ca = countryCodeOf(a),
        cb = countryCodeOf(b);
      if (ca !== cb) return ca.localeCompare(cb);
      const aAll = isAllZone(a) ? 0 : 1,
        bAll = isAllZone(b) ? 0 : 1;
      if (aAll !== bAll) return aAll - bAll;
      const an = String(a.name || "").toUpperCase(),
        bn = String(b.name || "").toUpperCase();
      return an.localeCompare(bn, undefined, { numeric: true });
    });
  }, [zoneQuery, zones]);

  const allFilteredSelected =
    filteredZones.length > 0 &&
    filteredZones.every((z) => bulk.zoneIds.includes(z.id));
  function toggleSelectAllFiltered() {
    setBulk((b) => ({
      ...b,
      zoneIds: allFilteredSelected
        ? b.zoneIds.filter((id) => !filteredZones.some((fz) => fz.id === id))
        : Array.from(new Set([...b.zoneIds, ...filteredZones.map((fz) => fz.id)])),
    }));
  }
  const clearSelection = () => setBulk((b) => ({ ...b, zoneIds: [] }));
  function toggleMethod(mid) {
    setBulk((b) => {
      const key = String(mid);
      const next = { ...b.methods };
      if (next[key]) delete next[key];
      else next[key] = { fee: "0.00", handling: 0, transit: 0 };
      return { ...b, methods: next };
    });
  }
  const updateMethodField = (mid, field, value) =>
    setBulk((b) => ({
      ...b,
      methods: {
        ...b.methods,
        [String(mid)]: { ...b.methods[String(mid)], [field]: value },
      },
    }));
  function copyFirstToAll() {
    const ids = Object.keys(bulk.methods);
    if (!ids.length) return;
    const first = bulk.methods[ids[0]];
    setBulk((b) => {
      const next = { ...b.methods };
      ids.forEach((id) => (next[id] = { ...first }));
      return { ...b, methods: next };
    });
  }

  // --- validation ---
  function validateRow(r) {
    const errs = {};
    const feeNum = Number(r.fee);
    if (Number.isNaN(feeNum) || feeNum < 0) errs.fee = "Fee must be a number ≥ 0";
    if (r.handling < 0) errs.handling = "Must be ≥ 0";
    if (r.transit < 0) errs.transit = "Must be ≥ 0";
    setErrors((prev) => ({ ...prev, [r.id ?? `tmp-${r.zoneId}-${r.methodId}`]: errs }));
    return Object.keys(errs).length === 0;
  }


  // --- mutators + autosave ---
  const markDirty = (i) => {
    setDirtySet((prev) => new Set(prev).add(i));
  };

  const scheduleAutosave = (i) => {
    clearTimeout(autosaveTimers.current[i]);
    autosaveTimers.current[i] = setTimeout(() => saveRow(i, { silentToast: true }), 600);
  };

  const updateRow = (i, patch) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    markDirty(i);
    scheduleAutosave(i);
  };

  async function saveRow(i, { silentToast = false } = {}) {
    setSavingIdx(i);
    const r = rows[i];
    if (!validateRow(r)) { setSavingIdx(null); return; }

    try {
      const payload = {
        zone_id: r.zoneId,
        shipping_method_id: r.methodId,
        fee: r.fee,
        handling_min_days: Number(r.handling || 0),
        handling_max_days: Number(r.handling || 0),
        transit_min_days: Number(r.transit || 0),
        transit_max_days: Number(r.transit || 0),
        is_active: Boolean(r.active),
      };
      // conflict guard: if another row has same (zone, method), skip creating duplicate
      const dupIdx = rows.findIndex((x, idx) => idx !== i && x.zoneId === r.zoneId && x.methodId === r.methodId);
      if (dupIdx >= 0) {
        // merge into the existing one locally; rely on next reload to reconcile ids
        setRows((prev) => prev.filter((_, idx) => idx !== i));
        setDirtySet((prev) => { const n = new Set(prev); n.delete(i); return n; });
        if (!silentToast) show("Merged duplicate config");
        window.dispatchEvent(new CustomEvent("upfrica:shippingConfigChanged"));
        setSavingIdx(null);
        return;
      }

      const saved = await apiPost(EP.sellerZoneConfigs, payload);
      setRows((prev) => prev.map((r2, idx) => (idx === i ? { ...r2, id: saved.id } : r2)));
      setDirtySet((prev) => { const n = new Set(prev); n.delete(i); return n; });
      if (!silentToast) show("Saved");
      window.dispatchEvent(new CustomEvent("upfrica:shippingConfigChanged"));
    } finally {
      setSavingIdx(null);
    }
  }

  async function deleteRow(i) {
    const r = rows[i];
    const methodText = methods.find((m) => String(m.id) === String(r.methodId))?.label || r.methodLabel;
    const ok = confirm(`Remove shipping config?\n\n${r.zoneName}\n${methodText}`);
    if (!ok) return;

    if (!r.id) {
      setRows((prev) => prev.filter((_, idx) => idx !== i));
      setDirtySet((prev) => { const n = new Set(prev); n.delete(i); return n; });
      return;
    }
    setDeletingIdx(i);
    try {
      await apiDelete(EP.sellerZoneConfigs, { id: r.id });
      setRows((prev) => prev.filter((_, idx) => idx !== i));
      setDirtySet((prev) => { const n = new Set(prev); n.delete(i); return n; });
      show("Removed");
      window.dispatchEvent(new CustomEvent("upfrica:shippingConfigChanged"));
    } finally {
      setDeletingIdx(null);
    }
  }

  async function applyBulk() {
    if (!canBulkApply) return;
    const targets = zones.filter((z) => bulk.zoneIds.includes(z.id));
    const methodEntries = Object.entries(bulk.methods);

    for (const z of targets) {
      for (const [mid, cfg] of methodEntries) {
        // skip duplicates (conflict guard)
        const exists = rows.some(r => r.zoneId === z.id && String(r.methodId) === String(mid));
        if (exists) continue;

        const payload = {
          zone_id: z.id,
          shipping_method_id: Number(mid),
          fee: cfg.fee,
          handling_min_days: Number(cfg.handling || 0),
          handling_max_days: Number(cfg.handling || 0),
          transit_min_days: Number(cfg.transit || 0),
          transit_max_days: Number(cfg.transit || 0),
          is_active: true,
        };
        await apiPost(EP.sellerZoneConfigs, payload);
      }
    }
    setBulkOpen(false);
    const cfgs = asList(await apiGet(EP.sellerZoneConfigs));
    const zoneById = Object.fromEntries(zones.map(z => [z.id, z]));
    const methodById = Object.fromEntries(methods.map(m => [m.id, m]));
    setRows(
      cfgs.map((c) => {
        const zObj = c.zone || zoneById[c.zone_id];
        const mObj = c.shipping_method || methodById[c.shipping_method_id];
        const cc = countryCodeOf(zObj);
        return {
          id: c.id,
          zoneId: zObj?.id ?? c.zone_id,
          zoneName: zObj ? `${zObj.name} (${cc})` : `Zone #${c.zone_id ?? "?"}`,
          zoneCountry: cc,
          methodId: mObj?.id ?? c.shipping_method_id,
          methodLabel: mObj?.label ?? c.method_label ?? `Method #${c.shipping_method_id ?? "?"}`,
          fee: String(c.fee ?? "0.00"),
          handling: c.handling_min_days ?? 0,
          transit: c.transit_min_days ?? 0,
          active: !!c.is_active,
          currency: c.currency || inferCurrencyFromCountry(cc),
        };
      })
    );
    show("Applied");
    window.dispatchEvent(new CustomEvent("upfrica:shippingConfigChanged"));
  }

  const selectedMethodIds = Object.keys(bulk.methods);
  const canApply = canBulkApply && bulk.zoneIds.length > 0 && selectedMethodIds.length > 0;

  const unsavedCount = dirtySet.size;

  return (
    <div className="space-y-4">
      {toast}

      {/* Unsaved badge */}
      {unsavedCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border dark:border-neutral-800 p-2 bg-amber-50 dark:bg-neutral-900/40">
          <div className="text-sm">• Unsaved changes ({unsavedCount})</div>
          <button
            onClick={() => Array.from(dirtySet).forEach((i) => saveRow(i))}
            className="rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1.5 text-sm"
          >
            Save all
          </button>
        </div>
      )}

      {/* Bulk apply + configured count */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setBulkOpen((v) => !v)}
          className={`rounded-xl px-3 py-2 text-sm inline-flex items-center gap-2 ${canBulkApply ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900" : "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 cursor-not-allowed"}`}
          title={canBulkApply ? "Apply to many zones at once" : "Upgrade plan to use Bulk apply"}
        >
          {canBulkApply ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          Bulk apply
        </button>
        {!!rows.length && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {rows.length} configured {rows.length === 1 ? "row" : "rows"}
          </div>
        )}
      </div>

      {/* Bulk panel */}
      {bulkOpen && (
        <div className="rounded-2xl border dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          <div className="text-base font-semibold mb-3">Bulk apply to zones</div>

          <div className="mb-3 grid gap-3 md:grid-cols-[1fr_auto_auto] items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                value={zoneQuery}
                onChange={(e) => setZoneQuery(e.target.value)}
                placeholder="Search zones by name, code or country…"
                className="w-full pl-9 pr-9 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
              />
              {zoneQuery && (
                <button aria-label="Clear" onClick={() => setZoneQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button onClick={toggleSelectAllFiltered} className="rounded-xl border dark:border-neutral-800 px-3 py-2 text-sm">
              {allFilteredSelected ? "Unselect all (filtered)" : "Select all (filtered)"}
            </button>
            <button onClick={clearSelection} className="rounded-xl border dark:border-neutral-800 px-3 py-2 text-sm">
              Clear selection ({bulk.zoneIds.length})
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Zones list */}
            <div>
              <div className="text-sm mb-2">
                Zones <span className="text-neutral-500 dark:text-neutral-400">{filteredZones.length} shown</span>
              </div>
              <div className="border dark:border-neutral-800 rounded-xl max-h-56 overflow-auto p-2 space-y-2">
                {filteredZones.map((z) => (
                  <label key={z.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-current"
                      checked={bulk.zoneIds.includes(z.id)}
                      onChange={(e) =>
                        setBulk((b) => ({
                          ...b,
                          zoneIds: e.target.checked ? [...b.zoneIds, z.id] : b.zoneIds.filter((id) => id !== z.id),
                        }))
                      }
                    />
                    <span className="truncate">{z.name}</span>
                    {isAllZone(z) && <span className="text-xxs rounded-lg px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800">ALL</span>}
                    <span className="text-xxs rounded-lg px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700">
                      {z.country?.code || z.country_code}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Methods + per-method inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm">Methods</label>
                <div className="border dark:border-neutral-800 rounded-xl max-h-56 overflow-auto p-2 space-y-2">
                  {methods.map((m) => {
                    const checked = !!bulk.methods[String(m.id)];
                    return (
                      <label key={m.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="accent-current" checked={checked} onChange={() => toggleMethod(m.id)} />
                        <span className="truncate">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
                {!!selectedMethodIds.length && (
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {selectedMethodIds.length} method{selectedMethodIds.length > 1 ? "s" : ""} selected
                    </div>
                    {selectedMethodIds.length > 1 && (
                      <button onClick={copyFirstToAll} className="text-xs underline text-neutral-600 dark:text-neutral-300">
                        Copy first method’s values to all
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Per-method fields */}
              {selectedMethodIds.map((mid) => {
                const m = methods.find((mm) => String(mm.id) === String(mid));
                const cfg = bulk.methods[mid] || { fee: "0.00", handling: 0, transit: 0 };
                return (
                  <div key={mid} className="rounded-xl border dark:border-neutral-800 p-3 space-y-2">
                    <div className="text-sm font-medium">{m?.label || `Method ${mid}`}</div>
                    <div className="space-y-1">
                      <label className="text-xs">Fee</label>
                      <div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
  {ccySymbol(bulkCcy)}
</span>
<input
  type="number"
  inputMode="decimal"
  step="0.01"
  min={0}
  value={cfg.fee ?? ""}
  onChange={(e) => updateMethodField(mid, "fee", e.target.value)}
  className={`w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 ${padClassForSymbol(
    ccySymbol(bulkCcy)
  )} pr-2 py-2`}
  placeholder="e.g. 3.99"
/>
                      </div>
                      {Number(cfg.fee) === 0 && (
                        <div className="text-xs text-neutral-500">Customers will see <strong>Free shipping</strong>.</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs">Handling (days)</label>
                        <input type="number" min={0} value={cfg.handling} onChange={(e) => updateMethodField(mid, "handling", Number(e.target.value))} className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Transit (days)</label>
                        <input type="number" min={0} value={cfg.transit} onChange={(e) => updateMethodField(mid, "transit", Number(e.target.value))} className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2" />
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={applyBulk}
                disabled={!canApply}
                className={`${!canApply ? "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 cursor-not-allowed" : "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"} rounded-xl px-3 py-2 text-sm`}
                title={canBulkApply ? undefined : "Upgrade plan to use Bulk apply"}
              >
                Apply to selected
              </button>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Tip: selections apply to the zones you’ve checked above (or “Select all filtered”).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="p-4 text-neutral-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-neutral-500">No configs yet. Use <em>Bulk apply</em> to start fast.</div>
        ) : (
          rows.map((r, i) => {
            const saving = savingIdx === i;
            const deleting = deletingIdx === i;
            const rowKey = r.id ?? `tmp-${r.zoneId}-${r.methodId}`;
            const rowErrs = errors[rowKey] || {};
            const isFree = Number(r.fee) === 0 && r.active;
            return (
              <div key={`${r.zoneId}-${r.methodId}-${i}`} className="rounded-2xl border dark:border-neutral-800 p-3">
                <div className="mb-2 text-sm font-medium">
                  <div className="truncate">{r.zoneName}</div>
                  <div className="text-neutral-500">
                    {methods.find((m) => String(m.id) === String(r.methodId))?.label || r.methodLabel}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs">Fee</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{ccySymbol(r.currency)}</span>
                      <input
                        value={r.fee}
                        onChange={(e) => updateRow(i, { fee: e.target.value })}
                        className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 pl-[50px] py-2"
                        min={0}
                        aria-invalid={!!rowErrs.fee}
                      />
                    </div>
                    {rowErrs.fee && <div className="text-xs text-red-600">{rowErrs.fee}</div>}
                    {isFree && <div className="text-xs text-neutral-500">Customers will see <strong>Free shipping</strong>.</div>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Handling (days)</label>
                    <input type="number" min={0} value={r.handling} onChange={(e) => updateRow(i, { handling: Number(e.target.value) })} className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2" aria-invalid={!!rowErrs.handling} />
                    {rowErrs.handling && <div className="text-xs text-red-600">{rowErrs.handling}</div>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Transit (days)</label>
                    <input type="number" min={0} value={r.transit} onChange={(e) => updateRow(i, { transit: Number(e.target.value) })} className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2" aria-invalid={!!rowErrs.transit} />
                    {rowErrs.transit && <div className="text-xs text-red-600">{rowErrs.transit}</div>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Active</label>
                    <div className="h-10 flex items-center">
                      <input type="checkbox" checked={!!r.active} onChange={(e) => updateRow(i, { active: e.target.checked })} />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  {r.id && (
                    <button onClick={() => deleteRow(i)} disabled={deleting} className="rounded-xl border dark:border-neutral-800 px-3 py-1.5 text-sm inline-flex items-center gap-1" title="Remove this config">
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Remove
                    </button>
                  )}
                  <button onClick={() => saveRow(i)} disabled={saving || !dirtySet.has(i)} className="rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1.5 text-sm inline-flex items-center gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="rounded-2xl border dark:border-neutral-800 overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/60 sticky top-0 z-10">
            <tr>
              <th className="text-left p-3 font-medium">Zone</th>
              <th className="text-left p-3 font-medium">Method</th>
              <th className="text-left p-3 font-medium">Fee</th>
              <th className="text-left p-3 font-medium">Handling</th>
              <th className="text-left p-3 font-medium">Transit</th>
              <th className="text-left p-3 font-medium">Active</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-neutral-500 dark:text-neutral-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-neutral-500 dark:text-neutral-400">No configs yet. Use <em>Bulk apply</em> to start fast.</td></tr>
            ) : (
              rows.map((r, i) => {
                const saving = savingIdx === i;
                const deleting = deletingIdx === i;
                const rowKey = r.id ?? `tmp-${r.zoneId}-${r.methodId}`;
                const rowErrs = errors[rowKey] || {};
                const isFree = Number(r.fee) === 0 && r.active;
                return (
                  <tr key={`${r.zoneId}-${r.methodId}-${i}`} className="border-t dark:border-neutral-800">
                    <td className="p-3 font-medium">{r.zoneName}</td>
                    <td className="p-3">{methods.find((m) => String(m.id) === String(r.methodId))?.label || r.methodLabel}</td>
                    <td className="p-3">
                      <div className="relative w-32">
<span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500">
  {ccySymbol(r.currency)}
</span>
<input
  type="number"
  inputMode="decimal"
  step="0.01"
  min={0}
  value={r.fee ?? ""}
  onChange={(e) => updateRow(i, { fee: e.target.value })}
  className={`w-32 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 ${padClassForSymbol(
    ccySymbol(r.currency)
  )} pr-2 py-1.5`}
  aria-invalid={!!rowErrs.fee}
/>
                      </div>
                      {rowErrs.fee && <div className="text-xs text-red-600 mt-1">{rowErrs.fee}</div>}
                      {isFree && <div className="text-xs text-neutral-500 mt-1">Free shipping</div>}
                    </td>
                    <td className="p-3">
                      <input type="number" min={0} value={r.handling} onChange={(e) => updateRow(i, { handling: Number(e.target.value) })} className="w-24 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-2 py-1.5" aria-invalid={!!rowErrs.handling} />
                      {rowErrs.handling && <div className="text-xs text-red-600 mt-1">{rowErrs.handling}</div>}
                    </td>
                    <td className="p-3">
                      <input type="number" min={0} value={r.transit} onChange={(e) => updateRow(i, { transit: Number(e.target.value) })} className="w-24 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-2 py-1.5" aria-invalid={!!rowErrs.transit} />
                      {rowErrs.transit && <div className="text-xs text-red-600 mt-1">{rowErrs.transit}</div>}
                    </td>
                    <td className="p-3">
                      <input type="checkbox" checked={!!r.active} onChange={(e) => updateRow(i, { active: e.target.checked })} />
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {r.id && (
                        <button onClick={() => deleteRow(i)} disabled={deleting} className="rounded-xl border dark:border-neutral-800 px-3 py-1.5" title="Remove this config">
                          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 inline" />} Remove
                        </button>
                      )}
                      <button
                        onClick={() => saveRow(i)}
                        disabled={saving || !dirtySet.has(i)}
                        className="rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1.5"
                        title={!dirtySet.has(i) ? "No changes" : "Save changes"}
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Seller guide */}
      <div className="rounded-2xl border dark:border-neutral-800 p-4 flex gap-2 items-start bg-white dark:bg-neutral-900">
        <Info className="h-4 w-4 mt-0.5" />
        <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
          <div className="font-medium">How shipping works (for sellers)</div>
          <ol className="list-decimal ml-5 space-y-1">
            <li><strong>Pick zones</strong> you serve. A zone is an area inside one country.</li>
            <li><strong>Choose methods</strong> (Standard, Express, etc.).</li>
            <li><strong>Set fee + ETA</strong>. Handling = prep; Transit = carrier.</li>
            <li><strong>Preview</strong> updates with the “Deliver to” chip.</li>
          </ol>
          <details>
            <summary className="cursor-pointer mt-2">Troubleshooting</summary>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>No options? Add at least one active config for the buyer’s zone.</li>
              <li>Still no zones/methods? Ask support to expose <code>/api/core/shippingzone/</code> and <code>/api/core/shippingmethod/</code>.</li>
            </ul>
          </details>
          <div className="text-xs">Tip: use <strong>Bulk apply</strong> to set base fees/ETAs across many zones, then fine-tune rows below.</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   Page
========================================= */
export default function ShippingSettingsPage() {
  return (
    <div className="container mx-auto max-w-6xl py-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight dark:text-gray-200">Shipping</h1>
        <div className="shrink-0">
          <DeliverToChip />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ShippingSettingsMatrix />
        <div className="space-y-4 md:sticky md:top-4 self-start">
          {/* productId provided for preview; sellerId optional */}
          <PDPDeliveryWidget productId={123} />
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Truck,
  CreditCard,
  Clock,
  Sparkles,
  Info,
  Search,
  X,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getCleanToken } from "@/lib/getCleanToken";
import { BASE_API_URL } from "@/app/constants";

/* ------------------------------
   Helpers (auth + fetch)
--------------------------------*/
function authHeaders() {
  const t = getCleanToken?.();
  return t ? { Authorization: `Token ${t}` } : {};
}

function asList(maybe) {
  if (Array.isArray(maybe)) return maybe;
  if (maybe && Array.isArray(maybe.results)) return maybe.results;
  return [];
}

function cleanedParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );
}

async function apiGet(url, params) {
  const p = cleanedParams(params);
  const q = Object.keys(p).length ? "?" + new URLSearchParams(p).toString() : "";
  const res = await fetch(`${BASE_API_URL}${url}${q}`, {
    credentials: "include",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); }
    catch { try { detail = await res.text(); } catch {} }
    throw new Error(`GET ${url} → ${res.status} ${detail}`);
  }
  return res.json();
}

async function apiPost(url, body) {
  const res = await fetch(`${BASE_API_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); }
    catch { try { detail = await res.text(); } catch {} }
    throw new Error(`POST ${url} → ${res.status} ${detail}`);
  }
  return res.json();
}

async function apiDelete(url) {
  const res = await fetch(`${BASE_API_URL}${url}`, {
    method: "DELETE",
    credentials: "include",
    headers: { ...authHeaders() },
  });
  if (res.status === 204) return true;
  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); }
    catch { try { detail = await res.text(); } catch {} }
    throw new Error(`DELETE ${url} → ${res.status} ${detail}`);
  }
  return true;
}

/* ------------------------------
   API endpoints
--------------------------------*/
const EP = {
  countries: "/api/countries/",
  zones: "/api/core/shipping/zones/",
  methods: "/api/core/shipping/methods/",
  sellerZoneConfigs: "/api/core/shipping/seller-zone-configs/",
  deliveryOptions: "/api/core/shipping/options/",
};

/* ------------------------------
   Small utilities
--------------------------------*/
const cx = (...a) => a.filter(Boolean).join(" ");

function money(val, ccy) {
  if (val == null) return `${ccy} 0.00`;
  if (
    (typeof val === "string" && val.includes(".")) ||
    (typeof val === "number" && !Number.isInteger(val))
  ) {
    const n = Number(val);
    return `${ccy} ${Number.isFinite(n) ? n.toFixed(2) : String(val)}`;
  }
  const n = Number(val);
  return `${ccy} ${Number.isFinite(n) ? (n / 100).toFixed(2) : String(val)}`;
}

function toMinor(o) {
  // helper for fee comparisons
  if (o == null) return 0;
  const n = Number(o);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function countryCodeOf(z) {
  return (z.country_code || z.country?.code || "").toUpperCase();
}
function isAllZone(z) {
  const name = String(z.name || "").toLowerCase();
  const code = String(z.code || "").toUpperCase();
  const region = String(z.region_code || "").toUpperCase();
  return /(^|\s|\()all(\)|\s|$)/i.test(name) || code.endsWith("_ALL") || region === "ALL";
}

/* ------------------------------
   Tiny toast
--------------------------------*/
function useToast() {
  const [msg, setMsg] = useState(null);
  function show(m) {
    setMsg(m);
    setTimeout(() => setMsg(null), 2500);
  }
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

/* =========================================
   Deliver-To chip (stores preference) + URL sync
========================================= */
function DeliverToChip({ defaultCountry = "GB" }) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(defaultCountry);
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  useEffect(() => {
    apiGet(EP.countries)
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  // Read from URL first, then localStorage
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
      if (v.country && !country) setCountry(v.country);
      if (v.city && !city) setCity(v.city);
      if ((v.postcode || v.zip) && !postcode) setPostcode(v.postcode || v.zip);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to LS + broadcast + reflect in URL (no navigation)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "upfrica.deliverTo",
        JSON.stringify({ country, city, postcode })
      );
      // Update URL query params
      try {
        const url = new URL(window.location.href);
        if (country) url.searchParams.set("country", country);
        else url.searchParams.delete("country");
        if (city) url.searchParams.set("city", city);
        else url.searchParams.delete("city");
        if (postcode) url.searchParams.set("postcode", postcode);
        else url.searchParams.delete("postcode");
        window.history.replaceState({}, "", url);
      } catch {}
      window.dispatchEvent(new CustomEvent("upfrica:deliverTo"));
    }
  }, [country, city, postcode]);

  const selected = useMemo(() => {
    const c = countries.find((x) => x.code === country);
    const name = c?.name || country;
    const loc = [city, postcode].filter(Boolean).join(" · ");
    return loc ? `${name} — ${loc}` : name;
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
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
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
   - sorted + free badge
========================================= */
function PDPDeliveryWidget({ productId, sellerId }) {
  const [opts, setOpts] = useState(null);
  const [err, setErr] = useState(null);
  const [deliverTo, setDeliverTo] = useState({
    country: "GB",
    city: "",
    postcode: "",
  });

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
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("upfrica:deliverTo", onChange);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr(null);
      setOpts(null);

      const base = cleanedParams({
        product_id: productId,
        seller_id: sellerId,
        country: deliverTo.country || "GB",
        city: deliverTo.city || "",
        postcode: deliverTo.postcode || "",
        include_payments: true,
      });

      try {
        let data = await apiGet(EP.deliveryOptions, base);
        let list = asList(data);

        if (!sellerId && list.length === 0) {
          try {
            const cfgs = asList(await apiGet(EP.sellerZoneConfigs));
            const fallbackSeller = cfgs?.[0]?.seller ?? cfgs?.[0]?.seller_id ?? null;
            if (fallbackSeller) {
              data = await apiGet(EP.deliveryOptions, { ...base, seller_id: fallbackSeller });
              list = asList(data);
            }
          } catch {}
        }

        if (!cancelled) setOpts(list);
      } catch (e) {
        if (!cancelled) {
          setErr(String(e));
          setOpts([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, sellerId, deliverTo.country, deliverTo.city, deliverTo.postcode]);

  // comparator: fastest (eta_max) → cheaper → tighter (eta_min)
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
    <div className="rounded-2xl border dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="p-4 border-b dark:border-neutral-800 flex items-center gap-2">
        <Truck className="h-4 w-4" />
        <div className="font-medium">Delivery options</div>
      </div>

      {sortedOpts === null && !err && (
        <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400" aria-live="polite">
          Loading delivery options…
        </div>
      )}

      {err && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <span>Shipping options unavailable — {err}</span>
        </div>
      )}

      {Array.isArray(sortedOpts) && sortedOpts.length === 0 && !err && (
        <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
          No delivery options yet.
        </div>
      )}

      {Array.isArray(sortedOpts) && sortedOpts.length > 0 && (
        <div className="p-4 space-y-3">
          {(() => {
            const cheapest = sortedOpts.reduce(
              (m, x) =>
                (x.fee_minor ?? toMinor(x.fee)) <
                (m.fee_minor ?? toMinor(m.fee))
                  ? x
                  : m,
              sortedOpts[0]
            );
            const fastest = sortedOpts[0]; // after sorting, first is fastest by rule

            return sortedOpts.map((o) => {
              const isCheapest = o === cheapest;
              const isFastest = o === fastest;
              const cutoff =
                o.cutoff || (o.order_cutoff_time ? String(o.order_cutoff_time).slice(0, 5) : null);
              const payments = o.allowed_payment_codes || o.allowed_payments || [];
              const feeMinor = o.fee_minor ?? toMinor(o.fee);
              const isFree = feeMinor === 0;

              return (
                <div
                  key={`${o.method_code}-${o.zone_code}`}
                  className="flex items-center justify-between rounded-xl border dark:border-neutral-800 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-medium">{o.method_label}</div>
                        {isFastest && (
                          <span className="inline-flex items-center gap-1 text-xs rounded-lg px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800">
                            <Sparkles className="h-3 w-3" />
                            Fastest
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
                        Arrives in{" "}
                        {o.eta_min_days === o.eta_max_days
                          ? `${o.eta_min_days} day${o.eta_min_days === 1 ? "" : "s"}`
                          : `${o.eta_min_days}–${o.eta_max_days} days`}
                        {cutoff ? ` • order by ${cutoff}` : ""}
                      </div>
                      {!!payments.length && (
                        <div className="mt-1 flex flex-wrap gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <CreditCard className="h-3 w-3" />
                          <span>Payments:</span>
                          {payments.map((c) => (
                            <span
                              key={c}
                              className="rounded-md border dark:border-neutral-800 px-1.5 py-0.5"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {isFree ? "Free" : money(feeMinor ?? o.fee, o.currency)}
                    </div>
                    {o.tracking_required && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Tracking required
                      </div>
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
  const [zones, setZones] = useState([]);
  const [methods, setMethods] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIdx, setSavingIdx] = useState(null);
  const [deletingIdx, setDeletingIdx] = useState(null);
  const { show, node: toast } = useToast();

  // bulk panel
  const [bulkOpen, setBulkOpen] = useState(false);
  const [zoneQuery, setZoneQuery] = useState("");
  const [bulk, setBulk] = useState({
    zoneIds: [],
    methods: {}, // { [methodId]: { fee, handling, transit } }
  });

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [zRaw, mRaw, cfgRaw] = await Promise.all([
          apiGet(EP.zones),
          apiGet(EP.methods),
          apiGet(EP.sellerZoneConfigs),
        ]);
        const z = asList(zRaw);
        const m = asList(mRaw);
        const cfgs = asList(cfgRaw);

        setZones(z);
        setMethods(m);
        setRows(
          cfgs.map((c) => ({
            id: c.id,
            zoneId: c.zone.id,
            zoneName: `${c.zone.name} (${c.zone.country_code || c.zone.country?.code})`,
            methodId: c.shipping_method.id,
            methodLabel: c.shipping_method.label,
            fee: String(c.fee ?? "0.00"),
            handling: c.handling_min_days ?? 0,
            transit: c.transit_min_days ?? 0,
            active: !!c.is_active,
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

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
      const ca = countryCodeOf(a);
      const cb = countryCodeOf(b);
      if (ca !== cb) return ca.localeCompare(cb);
      const aAll = isAllZone(a) ? 0 : 1;
      const bAll = isAllZone(b) ? 0 : 1;
      if (aAll !== bAll) return aAll - bAll;
      const an = String(a.name || "").toUpperCase();
      const bn = String(b.name || "").toUpperCase();
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

  function clearSelection() {
    setBulk((b) => ({ ...b, zoneIds: [] }));
  }

  function toggleMethod(mid) {
    setBulk((b) => {
      const key = String(mid);
      const next = { ...b.methods };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = { fee: "0.00", handling: 0, transit: 0 };
      }
      return { ...b, methods: next };
    });
  }

  function updateMethodField(mid, field, value) {
    setBulk((b) => ({
      ...b,
      methods: {
        ...b.methods,
        [String(mid)]: { ...b.methods[String(mid)], [field]: value },
      },
    }));
  }

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

  function updateRow(i, patch) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function saveRow(i) {
    setSavingIdx(i);
    const r = rows[i];
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
      const saved = await apiPost(EP.sellerZoneConfigs, payload);
      updateRow(i, { id: saved.id });
      show("Saved");
    } finally {
      setSavingIdx(null);
    }
  }

  async function deleteRow(i) {
    const r = rows[i];
    if (!r.id) {
      setRows((prev) => prev.filter((_, idx) => idx !== i));
      return;
    }
    if (!confirm("Remove this shipping config? Existing orders are unaffected.")) return;
    setDeletingIdx(i);
    try {
      await apiDelete(`${EP.sellerZoneConfigs}${r.id}/`);
      setRows((prev) => prev.filter((_, idx) => idx !== i));
      show("Removed");
    } finally {
      setDeletingIdx(null);
    }
  }

  async function applyBulk() {
    const targets = zones.filter((z) => bulk.zoneIds.includes(z.id));
    const methodEntries = Object.entries(bulk.methods);

    for (const z of targets) {
      for (const [mid, cfg] of methodEntries) {
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
    setRows(
      cfgs.map((c) => ({
        id: c.id,
        zoneId: c.zone.id,
        zoneName: `${c.zone.name} (${c.zone.country_code || c.zone.country?.code})`,
        methodId: c.shipping_method.id,
        methodLabel: c.shipping_method.label,
        fee: String(c.fee ?? "0.00"),
        handling: c.handling_min_days ?? 0,
        transit: c.transit_min_days ?? 0,
        active: !!c.is_active,
      }))
    );
    show("Applied");
  }

  const selectedMethodIds = Object.keys(bulk.methods);
  const canApply = bulk.zoneIds.length > 0 && selectedMethodIds.length > 0;

  return (
    <div className="space-y-4">
      {toast}

      {/* Bulk apply + configured count */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setBulkOpen((v) => !v)}
          className="rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-2 text-sm inline-flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
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
                <button
                  aria-label="Clear"
                  onClick={() => setZoneQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={toggleSelectAllFiltered}
              className="rounded-xl border dark:border-neutral-800 px-3 py-2 text-sm"
            >
              {allFilteredSelected ? "Unselect all (filtered)" : "Select all (filtered)"}
            </button>
            <button
              onClick={clearSelection}
              className="rounded-xl border dark:border-neutral-800 px-3 py-2 text-sm"
            >
              Clear selection ({bulk.zoneIds.length})
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Zones list */}
            <div>
              <div className="text-sm mb-2">
                Zones{" "}
                <span className="text-neutral-500 dark:text-neutral-400">
                  {filteredZones.length} shown
                </span>
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
                          zoneIds: e.target.checked
                            ? [...b.zoneIds, z.id]
                            : b.zoneIds.filter((id) => id !== z.id),
                        }))
                      }
                    />
                    <span className="truncate">{z.name}</span>
                    {isAllZone(z) && (
                      <span className="text-xxs rounded-lg px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800">
                        ALL
                      </span>
                    )}
                    <span
                      className={cx(
                        "text-xxs rounded-lg px-2 py-0.5",
                        z.is_remote
                          ? "bg-neutral-200 dark:bg-neutral-800"
                          : "bg-neutral-100 dark:bg-neutral-700"
                      )}
                    >
                      {z.country?.code}
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
                        <input
                          type="checkbox"
                          className="accent-current"
                          checked={checked}
                          onChange={() => toggleMethod(m.id)}
                        />
                        <span className="truncate">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
                {!!selectedMethodIds.length && (
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {selectedMethodIds.length} method
                      {selectedMethodIds.length > 1 ? "s" : ""} selected
                    </div>
                    {selectedMethodIds.length > 1 && (
                      <button
                        onClick={copyFirstToAll}
                        className="text-xs underline text-neutral-600 dark:text-neutral-300"
                      >
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
                      <input
                        value={cfg.fee}
                        onChange={(e) => updateMethodField(mid, "fee", e.target.value)}
                        className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                        placeholder="e.g. 3.99"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs">Handling (days)</label>
                        <input
                          type="number"
                          min={0}
                          value={cfg.handling}
                          onChange={(e) =>
                            updateMethodField(mid, "handling", Number(e.target.value))
                          }
                          className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Transit (days)</label>
                        <input
                          type="number"
                          min={0}
                          value={cfg.transit}
                          onChange={(e) =>
                            updateMethodField(mid, "transit", Number(e.target.value))
                          }
                          className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={applyBulk}
                disabled={!canApply}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm",
                  !canApply
                    ? "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 cursor-not-allowed"
                    : "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                )}
              >
                Apply to selected
              </button>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Tip: selections apply to the zones you’ve checked above (or “Select all
                filtered”).
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
          <div className="p-4 text-neutral-500">
            No configs yet. Use <em>Bulk apply</em> to start fast.
          </div>
        ) : (
          rows.map((r, i) => {
            const saving = savingIdx === i;
            const deleting = deletingIdx === i;
            return (
              <div key={`${r.zoneId}-${r.methodId}-${i}`} className="rounded-2xl border dark:border-neutral-800 p-3">
                <div className="mb-2 text-sm font-medium">
                  <div className="truncate">{r.zoneName}</div>
                  <div className="text-neutral-500">
                    {methods.find((m) => m.id === r.methodId)?.label}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs">Fee</label>
                    <input
                      value={r.fee}
                      onChange={(e) => updateRow(i, { fee: e.target.value })}
                      className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Handling (days)</label>
                    <input
                      type="number"
                      min={0}
                      value={r.handling}
                      onChange={(e) => updateRow(i, { handling: Number(e.target.value) })}
                      className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Transit (days)</label>
                    <input
                      type="number"
                      min={0}
                      value={r.transit}
                      onChange={(e) => updateRow(i, { transit: Number(e.target.value) })}
                      className="w-full rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs">Active</label>
                    <div className="h-10 flex items-center">
                      <input
                        type="checkbox"
                        checked={!!r.active}
                        onChange={(e) => updateRow(i, { active: e.target.checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  {r.id && (
                    <button
                      onClick={() => deleteRow(i)}
                      disabled={deleting}
                      className="rounded-xl border dark:border-neutral-800 px-3 py-1.5 text-sm inline-flex items-center gap-1"
                      title="Remove this config"
                    >
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Remove
                    </button>
                  )}
                  <button
                    onClick={() => saveRow(i)}
                    disabled={saving}
                    className="rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1.5 text-sm inline-flex items-center gap-2"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save
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
              <tr>
                <td colSpan={7} className="p-4 text-neutral-500 dark:text-neutral-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-neutral-500 dark:text-neutral-400">
                  No configs yet. Use <em>Bulk apply</em> to start fast.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => {
                const saving = savingIdx === i;
                const deleting = deletingIdx === i;
                return (
                  <tr key={`${r.zoneId}-${r.methodId}-${i}`} className="border-t dark:border-neutral-800">
                    <td className="p-3 font-medium">{r.zoneName}</td>
                    <td className="p-3">{methods.find((m) => m.id === r.methodId)?.label}</td>
                    <td className="p-3">
                      <input
                        value={r.fee}
                        onChange={(e) => updateRow(i, { fee: e.target.value })}
                        className="w-28 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-2 py-1.5"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        value={r.handling}
                        onChange={(e) => updateRow(i, { handling: Number(e.target.value) })}
                        className="w-24 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-2 py-1.5"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        value={r.transit}
                        onChange={(e) => updateRow(i, { transit: Number(e.target.value) })}
                        className="w-24 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 px-2 py-1.5"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={!!r.active}
                        onChange={(e) => updateRow(i, { active: e.target.checked })}
                      />
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {r.id && (
                        <button
                          onClick={() => deleteRow(i)}
                          disabled={deleting}
                          className="rounded-xl border dark:border-neutral-800 px-3 py-1.5"
                          title="Remove this config"
                        >
                          {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 inline" />
                          )}{" "}
                          Remove
                        </button>
                      )}
                      <button
                        onClick={() => saveRow(i)}
                        disabled={saving}
                        className="rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1.5"
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
            <li>
              <strong>Pick zones</strong> you serve. A zone is an area inside one
              country (e.g. “United Kingdom — London” or “Ghana — All regions”).
            </li>
            <li>
              <strong>Choose one or more methods</strong> (Standard, Express, etc.).
              Methods control payment options and whether tracking is required.
            </li>
            <li>
              <strong>Set fee + ETA per method</strong>. Handling = prep time; Transit = carrier
              time. Buyers see the total.
            </li>
            <li>
              <strong>Preview</strong> on the right: buyer country + city/postcode →
              we match zone by <em>postcode</em>, then <em>city</em>, then country default.
            </li>
          </ol>
          <details>
            <summary className="cursor-pointer mt-2">Troubleshooting</summary>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>No options? Add at least one active config for the buyer’s zone.</li>
              <li>Wrong country? Ensure the zone’s country matches the buyer.</li>
              <li>Missing payments? The method might restrict payment methods in that country.</li>
            </ul>
          </details>
          <div className="text-xs">
            Tip: use <strong>Bulk apply</strong> to set base fees/ETAs across many zones,
            then fine-tune rows below. You can select multiple methods and set different
            values for each before applying.
          </div>
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
          <PDPDeliveryWidget productId={123} />
        </div>
      </div>
    </div>
  );
}
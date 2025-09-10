// src/components/search/SearchFacets.jsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";

// small util to update URL params
function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const setParams = (patch) => {
    const next = new URLSearchParams(sp.toString());

    Object.entries(patch).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        next.delete(k);
        v.forEach((x) => x && next.append(k, x));
      } else if (v === null || v === undefined || v === "") {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });

    // reset pagination when filters change
    next.delete("page");

    router.push(`${pathname}?${next.toString()}`, { scroll: true });
  };

  return setParams;
}

export default function SearchFacets({ cc, facets }) {
  const sp = useSearchParams();
  const setParams = useQueryUpdater();

  // current selections from URL
  const brandSel  = sp.getAll("brand");
  const speedSel  = sp.getAll("delivery_speed");
  const deliverTo = sp.get("deliver_to") || "";

  const priceMin  = sp.get("price_min") || "";
  const priceMax  = sp.get("price_max") || "";

  // Availability toggles:
  // - deliverableOnly: default TRUE when absent
  // - includeGlobal: default FALSE when absent
  const deliverableOnly = (sp.get("deliverable") ?? "1") !== "0";
  const includeGlobal   = sp.get("include_global") === "1";

  // UI local state for price inputs
  const [min, setMin] = useState(priceMin);
  const [max, setMax] = useState(priceMax);

  // facet helpers with safe fallbacks
  const brands = useMemo(() => facets?.brand?.options || [], [facets]);
  const speeds = useMemo(() => facets?.delivery_speed?.options || [], [facets]);

  // availability bucket counts from backend (optional)
  const availability = useMemo(() => {
    const b = facets?.availability?.buckets || {};
    const ships  = Number(b.ships  || 0);
    const likely = Number(b.likely || 0);
    const noShip = Number(b.no     || 0);
    return {
      ships,
      likely,
      noShip,
      deliverableTotal: ships + likely,
      globalTotal: noShip,
    };
  }, [facets]);

  const toggle = (key, val, current) => {
    const next = new Set(current);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setParams({ [key]: [...next] });
  };

  const applyPrice = () =>
    setParams({ price_min: min || null, price_max: max || null });

  const clearAll = () =>
    setParams({
      q: sp.get("q") || "", // preserve q
      brand: [],
      delivery_speed: [],
      price_min: null,
      price_max: null,
      deliver_to: null,
      deliverable: null,
      include_global: null,
      page: null,
    });

  const onToggleDeliverable = (checked) => {
    // deliverableOnly is meaningful when includeGlobal is OFF
    setParams({ deliverable: checked ? "1" : "0" });
  };

  const onToggleGlobal = (checked) => {
    setParams({ include_global: checked ? "1" : null });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <button className="text-xs underline" onClick={clearAll}>Reset</button>
      </div>

      {/* Availability */}
      <div className="rounded-xl border border-[var(--line)] p-3">
        <div className="text-sm font-medium mb-1">Availability</div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={deliverableOnly}
            onChange={(e) => onToggleDeliverable(e.target.checked)}
            disabled={includeGlobal}
          />
          <span className="flex-1">
            Deliverable to {String(deliverTo || cc || "gh").toUpperCase()}
          </span>
          {availability.deliverableTotal > 0 && (
            <span className="text-[11px] text-[var(--ink-2)]">
              {availability.deliverableTotal}
            </span>
          )}
        </label>

        <label className="mt-1 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeGlobal}
            onChange={(e) => onToggleGlobal(e.target.checked)}
          />
          <span className="flex-1">Include global (ships elsewhere)</span>
          {availability.globalTotal > 0 && (
            <span className="text-[11px] text-[var(--ink-2)]">
              {availability.globalTotal}
            </span>
          )}
        </label>

        {includeGlobal && (
          <p className="mt-1 text-[11px] text-[var(--ink-2)]">
            Showing all results, including items that may not ship to your location.
          </p>
        )}
      </div>

      {/* Deliver to */}
      <div className="rounded-xl border border-[var(--line)] p-3">
        <div className="text-sm font-medium">Deliver to</div>
        <input
          type="text"
          placeholder={(cc || "gh").toUpperCase()}
          value={deliverTo}
          onChange={(e) => setParams({ deliver_to: e.target.value })}
          className="mt-2 w-full h-9 rounded-lg border border-[var(--line)] px-2 text-sm"
        />
        <p className="text-[11px] text-[var(--ink-2)] mt-1">
          Improves ETA & shipping options.
        </p>
      </div>

      {/* Price */}
      <div className="rounded-xl border border-[var(--line)] p-3">
        <div className="text-sm font-medium">Price</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            inputMode="numeric"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="h-9 rounded-lg border border-[var(--line)] px-2 text-sm"
          />
          <input
            inputMode="numeric"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="h-9 rounded-lg border border-[var(--line)] px-2 text-sm"
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-2 w-full h-9 rounded-lg bg-[var(--brand-600)] text-white text-sm"
        >
          Apply
        </button>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="rounded-xl border border-[var(--line)] p-3">
          <div className="text-sm font-medium mb-1">Brand</div>
          <div className="space-y-1 max-h-48 overflow-auto pr-1">
            {brands.map((b) => {
              const selected = brandSel.includes(b.slug);
              return (
                <label key={b.slug} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggle("brand", b.slug, brandSel)}
                  />
                  <span className="flex-1">{b.name}</span>
                  <span className="text-[11px] text-[var(--ink-2)]">
                    {b.count ?? ""}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery speed */}
      {speeds.length > 0 && (
        <div className="rounded-xl border border-[var(--line)] p-3">
          <div className="text-sm font-medium mb-1">Delivery speed</div>
          <div className="space-y-1">
            {speeds.map((s) => {
              const val = s.code || s.value;
              const selected = speedSel.includes(val);
              return (
                <label key={val} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggle("delivery_speed", val, speedSel)}
                  />
                  <span className="flex-1">{s.label || val}</span>
                  <span className="text-[11px] text-[var(--ink-2)]">
                    {s.count ?? ""}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
// components/products/ProductWizard/steps/StepAttrVariants.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

/** Minimal scaffold: choose attributes → generate variant grid.
 *  Robust to different API payload shapes.
 */
export default function StepAttrVariants({ productId, onSave }) {
  const [categoryId, setCategoryId] = useState(null);
  const [attrs, setAttrs] = useState([]);     // normalized array of attributes
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [chosen, setChosen] = useState([]);   // attribute ids chosen as variant axes

  // helper: normalize many API shapes into an array
  function asList(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
      // common keys we might see
      const keys = ["results", "items", "attributes", "data", "rows", "list"];
      for (const k of keys) {
        const v = payload[k];
        if (Array.isArray(v)) return v;
        if (v && typeof v === "object" && Array.isArray(v.results)) return v.results;
      }
    }
    return [];
  }

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!productId) return;
      setLoading(true);
      setErr("");
      try {
        // 1) Load product to get category id (robustly)
        const pRes = await fetch(`/api/products/${productId}/`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!pRes.ok) throw new Error(`Product load failed (${pRes.status})`);
        const p = await pRes.json();
        const cid = Number(
          p?.category?.id ?? p?.category_id ?? p?.categoryId ?? p?.category ?? 0
        );
        if (!alive) return;
        if (!Number.isFinite(cid) || cid <= 0) {
          setCategoryId(null);
          setAttrs([]);
          setLoading(false);
          return;
        }
        setCategoryId(cid);

        // 2) Load category attributes
        const aRes = await fetch(`/api/categories/${cid}/attributes/`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!aRes.ok) throw new Error(`Attributes load failed (${aRes.status})`);
        const aPayload = await aRes.json().catch(() => ({}));
        const list = asList(aPayload)
          .map((a) => ({
            id: a?.id,
            label: a?.label || a?.name || "",
            values: Array.isArray(a?.values) ? a.values : asList(a?.options || a?.choices),
            is_variant: a?.is_variant, // may be undefined → treat as true
          }))
          .filter((x) => x && (Number.isFinite(Number(x.id)) || typeof x.id === "string"));

        if (alive) setAttrs(list);
      } catch (e) {
        if (alive) {
          setErr(e?.message || "Failed to load attributes");
          setAttrs([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [productId]);

  const variantCandidates = useMemo(() => {
    const arr = Array.isArray(attrs) ? attrs : [];
    // Default to variant-capable unless explicitly disabled
    return arr.filter((a) => a && a.is_variant !== false);
  }, [attrs]);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Attributes &amp; Variants</h2>

      {loading && <div className="text-sm text-gray-500">Loading…</div>}

      {!loading && !categoryId && (
        <div className="text-sm text-amber-600">
          Pick a category in <strong>Basics</strong> first.
        </div>
      )}

      {!loading && err && (
        <div className="text-sm text-red-600">{err}</div>
      )}

      {!loading && categoryId && (
        <>
          <div className="space-y-2">
            <div className="text-sm font-medium">Choose options to vary</div>

            {variantCandidates.length === 0 ? (
              <div className="text-sm text-gray-500">
                No variant-capable attributes found for this category yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {variantCandidates.map((a) => (
                  <label
                    key={a.id}
                    className="inline-flex items-center gap-2 border rounded-full px-3 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={chosen.includes(a.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? Array.from(new Set([...chosen, a.id]))
                          : chosen.filter((x) => x !== a.id);
                        setChosen(next);
                        if (typeof onSave === "function") {
                          onSave({ variant_attribute_ids: next });
                        }
                      }}
                    />
                    {a.label || `Attribute #${a.id}`}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Placeholder: your SKU matrix editor can render once attributes are chosen */}
          <div className="text-sm text-gray-500">
            Once you pick options (e.g., Color, Size), we’ll generate the variant matrix so you can set
            per-option price/stock overrides.
          </div>
        </>
      )}
    </div>
  );
}
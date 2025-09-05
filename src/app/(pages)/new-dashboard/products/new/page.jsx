"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";
import PhotosSection from "@/components/PhotosSection";

function authHeaders() {
  const t = getCleanToken?.();
  return t ? { Authorization: `Token ${t}` } : {};
}

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [priceMajor, setPriceMajor] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [quantity, setQuantity] = useState(1);

  const [conditions, setConditions] = useState([]); // ← plain JS
  const [condition, setCondition] = useState("");   // id as string; cast when sending
  const [draftId, setDraftId] = useState(null);     // number | null, but untyped

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");

  // lock to prevent duplicate draft creation (e.g., multiple uploads race)
  const ensureDraftPromiseRef = useRef(null);

  // Load conditions
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/conditions/`, {
          headers: { "Content-Type": "application/json", ...authHeaders() },
        });
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setConditions(items);
        if (items.length) setCondition(String(items[0].id));
      } catch (e) {
        console.error("Failed to fetch conditions", e);
      }
    })();
  }, []);

  // Create or update draft (returns product or null)
async function createOrUpdate(auto = false) {
  if (!title) return null; // skip empty autosaves
  setSaving(true);
  setError("");
  try {
    const form = new FormData();
    form.append("title", title);
    form.append("price_major", String(priceMajor || ""));
    form.append("price_currency", currency);
    form.append("condition", String(condition || ""));
    form.append("product_quantity", String(quantity || 1));

    const isUpdate = Boolean(draftId);

    async function doFetch(url, method) {
      const res = await fetch(url, {
        method,
        headers: { ...authHeaders() }, // let browser set multipart boundary
        credentials: "include",
        body: form,
      });
      return res;
    }

    let res, product;

    if (!isUpdate) {
      // CREATE
      res = await doFetch(`${BASE_API_URL}/api/seller/products/`, "POST");
      if (!res.ok) throw new Error(`create failed ${res.status}`);
      product = await res.json();
    } else {
      // UPDATE via seller detail
      res = await doFetch(`${BASE_API_URL}/api/seller/products/${draftId}/`, "PATCH");

      if (res.status === 404) {
        // fallback to owner-safe public detail endpoint
        const alt = await doFetch(`${BASE_API_URL}/api/products/${draftId}/`, "PATCH");
        if (alt.ok) {
          res = alt;
        } else if (alt.status === 404) {
          // if somehow lost, recreate as new draft (prevents “Save failed” loop)
          const re = await doFetch(`${BASE_API_URL}/api/seller/products/`, "POST");
          if (!re.ok) throw new Error(`recreate failed ${re.status}`);
          res = re;
        } else {
          throw new Error(`patch fallback failed ${alt.status}`);
        }
      }

      if (!res.ok) throw new Error(`update failed ${res.status}`);
      product = await res.json();
    }

    if (!draftId) setDraftId(product.id);
    if (!auto) router.push(`/new-dashboard/products/editor?id=${product.id}`);

    setLastSaved(new Date());
    return product;
  } catch (err) {
    console.error(err);
    setError("Save failed");
    return null;
  } finally {
    setSaving(false);
  }
}

  // Used by uploader to ensure a valid id exists (with a simple lock)
  async function ensureDraftId() {
    if (draftId) return draftId;

    if (ensureDraftPromiseRef.current) {
      return await ensureDraftPromiseRef.current;
    }

    ensureDraftPromiseRef.current = (async () => {
      const created = await createOrUpdate(true);
      if (created && created.id != null) {
        const idNum = Number(created.id);
        setDraftId(idNum);
        return idNum;
      }
      throw new Error("Could not create draft");
    })();

    try {
      return await ensureDraftPromiseRef.current;
    } finally {
      ensureDraftPromiseRef.current = null;
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Autosave badge */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold dark:text-gray-200">Add Product</h1>
        <span className="text-xs rounded-full px-3 py-1 border bg-white/70 dark:bg-gray-900/60 dark:text-gray-300">
          {saving
            ? "Autosave • Saving…"
            : lastSaved
            ? `Autosave • Saved ${lastSaved.toLocaleTimeString()}`
            : "Autosave • On"}
        </span>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="space-y-6 pb-24">
        {/* Title */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => createOrUpdate(true)}
            placeholder="Dining Table"
          />
          <p className="mt-1 text-xs text-gray-500">
            Short, clear, searchable. You can fine-tune SEO later.
          </p>
        </div>

        {/* Photos */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Photos</label>
            <span className="text-xs text-gray-500">
              Primary appears first — autosave is on.
            </span>
          </div>
          <PhotosSection
            productId={draftId ?? undefined}
            ensureProductId={ensureDraftId}
          />
          <p className="mt-2 text-xs text-gray-500">
            Tip: long-press and drag to reorder; tap star to set as primary.
          </p>
        </div>

        {/* Price / Quantity / Condition */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              className="w-full rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
              value={priceMajor}
              onChange={(e) => setPriceMajor(e.target.value)}
              onBlur={() => createOrUpdate(true)}
              inputMode="decimal"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              className="w-full rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value || 0))}
              onBlur={() => createOrUpdate(true)}
              inputMode="numeric"
              placeholder="1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              className="w-full rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              onBlur={() => createOrUpdate(true)}
            >
              {conditions.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between">
        {lastSaved && (
          <span className="text-xs text-gray-500">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => createOrUpdate(true)}
            disabled={saving}
            className="px-4 py-2 rounded-md border"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={() => createOrUpdate(false)}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-blue-600 text-white"
          >
            Publish
          </button>
        </div>
      </div>
    </main>
  );
}
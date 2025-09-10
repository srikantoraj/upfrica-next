// src/app/(pages)/new-dashboard/products/new/page.jsx
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

// localStorage keys so a browser refresh resumes the SAME draft
const DRAFT_META_KEY = "upfrica:newProductDraftMeta";
const DRAFT_FORM_KEY = "upfrica:newProductDraftForm";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [priceMajor, setPriceMajor] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [quantity, setQuantity] = useState(1);

  const [conditions, setConditions] = useState([]);
  const [condition, setCondition] = useState("");
  const [draftId, setDraftId] = useState(null); // numeric id only
  const [uPid, setUPid] = useState(null);       // optional, never used in URL

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");

  // lock to prevent duplicate draft creation (e.g., uploads racing)
  const ensureDraftPromiseRef = useRef(null);

  // ---------- bootstrap from localStorage (refresh-safe) ----------
  useEffect(() => {
    try {
      const meta = JSON.parse(localStorage.getItem(DRAFT_META_KEY) || "null");
      if (meta?.id) setDraftId(Number(meta.id));
      if (meta?.uPid) setUPid(String(meta.uPid));

      const form = JSON.parse(localStorage.getItem(DRAFT_FORM_KEY) || "null");
      if (form) {
        if (typeof form.title === "string") setTitle(form.title);
        if ("priceMajor" in form) setPriceMajor(form.priceMajor ?? "");
        if ("quantity" in form) setQuantity(Number(form.quantity ?? 1));
        if (typeof form.condition !== "undefined") setCondition(String(form.condition ?? ""));
        if (typeof form.currency === "string") setCurrency(form.currency || "GHS");
        if (form.lastSaved) setLastSaved(new Date(form.lastSaved));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // persist meta + form to localStorage so refresh restores UI/state
  useEffect(() => {
    if (draftId) {
      localStorage.setItem(
        DRAFT_META_KEY,
        JSON.stringify({ id: draftId, uPid })
      );
    }
  }, [draftId, uPid]);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_FORM_KEY,
      JSON.stringify({
        title,
        priceMajor,
        quantity,
        condition,
        currency,
        lastSaved,
      })
    );
  }, [title, priceMajor, quantity, condition, currency, lastSaved]);

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
        if (!condition && items.length) setCondition(String(items[0].id));
      } catch (e) {
        console.error("Failed to fetch conditions", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- helpers ----------------
  function buildFormData(auto = false) {
    const fd = new FormData();
    // if autosaving without a title, create a placeholder so uploads can start first
    const titleToUse = (title || "").trim() || (auto ? "Draft" : "");
    if (!titleToUse) throw new Error("Title required");
    fd.append("title", titleToUse);
    fd.append("price_major", String(priceMajor ?? ""));
    fd.append("price_currency", currency);
    fd.append(
      "condition",
      String(condition || (Array.isArray(conditions) && conditions[0]?.id) || "")
    );
    fd.append("product_quantity", String(quantity || 1));
    return fd;
  }

  async function createDraft(auto = false) {
    const res = await fetch(`${BASE_API_URL}/api/seller/products/`, {
      method: "POST",
      headers: { ...authHeaders() }, // allow browser to set multipart boundary
      credentials: "include",
      body: buildFormData(auto),
    });
    if (!res.ok) throw new Error(`create failed ${res.status}`);
    const product = await res.json();
    if (product?.id != null) setDraftId(Number(product.id));
    if (product?.u_pid) setUPid(String(product.u_pid));
    return product;
  }

  async function patchDraft(auto = false) {
    if (!draftId) throw new Error("no draft id");
    const url = `${BASE_API_URL}/api/seller/products/${draftId}/`; // numeric id only
    const res = await fetch(url, {
      method: "PATCH",
      headers: { ...authHeaders() }, // multipart
      credentials: "include",
      body: buildFormData(auto),
    });
    if (!res.ok) throw new Error(`update failed ${res.status}`);
    return await res.json();
  }

  function clearPersisted() {
    localStorage.removeItem(DRAFT_META_KEY);
    localStorage.removeItem(DRAFT_FORM_KEY);
  }

  // ---------------- main save path ----------------
  async function createOrUpdate(auto = false) {
    setSaving(true);
    setError("");
    try {
      let product;
      if (!draftId) {
        product = await createDraft(auto);
      } else {
        try {
          product = await patchDraft(auto);
        } catch (err) {
          // if somehow the draft disappeared, re-create once
          if (String(err?.message || "").includes("update failed 404")) {
            product = await createDraft(auto);
          } else {
            throw err;
          }
        }
      }

      setLastSaved(new Date());

      // Keep user on /new for autosaves & "Save Draft"
      if (!auto) {
        router.push(`/new-dashboard/products/editor?id=${product.id}`);
        clearPersisted(); // leave clean state when moving to full editor
      }
      return product;
    } catch (err) {
      console.error(err);
      if (!auto) setError("Save failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  // Used by the uploader to ensure a valid product id exists (with a lock)
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
        if (created.u_pid) setUPid(String(created.u_pid));
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

  // ---------------- UI ----------------
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
              min={0}
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
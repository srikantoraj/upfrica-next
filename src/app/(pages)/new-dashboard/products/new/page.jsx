"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PhotosSection from "@/components/PhotosSection";
import CategoryField from "@/components/category/CategoryField";
import BrandField from "@/components/brand/BrandField";
import { useAuthSheet } from "@/components/auth/AuthSheetProvider";
import OverlayPageFrame from "@/components/ui/OverlaySheet";

// ✅ bring in deliver-to currency + symbol
import { useLocalization } from "@/contexts/LocalizationProvider";
import { symbolFor } from "@/lib/pricing-mini";

const DRAFT_META_KEY = "upfrica:newProductDraftMeta";
const DRAFT_FORM_KEY = "upfrica:newProductDraftForm";

const asInt = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

export default function NewProductPage() {
  const router = useRouter();
  const authSheet = (() => { try { return useAuthSheet?.(); } catch { return null; } })();

  // ---------- localization (display only; no FX here) ----------
  const { currency: uiCurrency, resolvedLanguage } = useLocalization() || {};
  const priceSymbol = useMemo(
    () => symbolFor(uiCurrency || "USD", resolvedLanguage || "en") || "₵",
    [uiCurrency, resolvedLanguage]
  );

  // ---------- basic form ----------
  const [title, setTitle] = useState("");
  const [priceMajor, setPriceMajor] = useState("");
  const [currency, setCurrency] = useState("GHS"); // will sync to uiCurrency
  const [quantity, setQuantity] = useState(1);

  // ---------- condition ----------
  const [conditions, setConditions] = useState([]);
  const [condError, setCondError] = useState("");
  const [condition, setCondition] = useState("");

  // ---------- category (required) ----------
  const [categoryId, setCategoryId] = useState("");

  // ---------- brand (optional; typeahead) ----------
  const [brandInput, setBrandInput] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [brandResolved, setBrandResolved] = useState(null);
  const [brandErr, setBrandErr] = useState("");
  const chosenBrand = useMemo(() => {
    const hit = brandOptions.find(
      (b) =>
        b?.name?.toLowerCase?.() === brandInput.trim().toLowerCase() ||
        b?.slug?.toLowerCase?.() === brandInput.trim().toLowerCase()
    );
    return hit || null;
  }, [brandInput, brandOptions]);

  // ---------- images (for publish gating) ----------
  const [uploaderCount, setUploaderCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);

  // ---------- draft bookkeeping ----------
  const [draftId, setDraftId] = useState(null);
  const [uPid, setUPid] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");
  const ensureDraftPromiseRef = useRef(null);

  // ---------- bootstrap ----------
  useEffect(() => {
    try {
      const meta = JSON.parse(localStorage.getItem(DRAFT_META_KEY) || "null");
      if (meta?.id) setDraftId(Number(meta.id));
      if (meta?.uPid) setUPid(String(meta.uPid));

      const form = JSON.parse(localStorage.getItem(DRAFT_FORM_KEY) || "null");
      if (form) {
        if (typeof form.title === "string") setTitle(form.title);
        if ("priceMajor" in form) setPriceMajor(form.priceMajor ?? "");
        if ("quantity" in form) setQuantity(asInt(form.quantity, 1));
        if (typeof form.condition !== "undefined") setCondition(String(form.condition ?? ""));
        if (typeof form.currency === "string") setCurrency(form.currency || "GHS");
        if (typeof form.categoryId !== "undefined") setCategoryId(String(form.categoryId ?? ""));
        if (typeof form.brandInput === "string") setBrandInput(form.brandInput);
        if (typeof form.imageCount !== "undefined") setImageCount(asInt(form.imageCount, 0));
        if (form.lastSaved) setLastSaved(new Date(form.lastSaved));
      }
    } catch {}
  }, []);

  // ✅ always keep the listing currency in sync with the user’s local UI currency
  useEffect(() => {
    if (uiCurrency && uiCurrency !== currency) setCurrency(uiCurrency);
  }, [uiCurrency]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- persist ----------
  useEffect(() => {
    if (draftId) {
      localStorage.setItem(DRAFT_META_KEY, JSON.stringify({ id: draftId, uPid }));
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
        currency,       // persists the *local* currency code we submit
        categoryId,
        brandInput,
        imageCount,
        lastSaved,
      })
    );
  }, [title, priceMajor, quantity, condition, currency, categoryId, brandInput, imageCount, lastSaved]);

  // ---------- load Conditions ----------
  useEffect(() => {
    (async () => {
      setCondError("");
      let res = await fetch(`/api/conditions/`, { headers: { Accept: "application/json" }, credentials: "omit" });

      if (!res.ok && (res.status === 404 || res.status === 301 || res.status === 302)) {
        res = await fetch(`/api/product-conditions/`, { headers: { Accept: "application/json" }, credentials: "omit" });
      }
      if (!res.ok && (res.status === 401 || res.status === 403)) {
        res = await fetch(`/api/conditions/`, { headers: { Accept: "application/json" }, credentials: "omit" });
      }
      if (!res.ok) {
        setCondError(res.status === 403 ? "Not allowed to load conditions" : `Failed (${res.status})`);
        return;
      }
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results || [];
      setConditions(items);
      if (!condition && items.length) setCondition(String(items[0].id));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- brand search (typeahead) ----------
  useEffect(() => {
    const q = brandInput.trim();
    if (q.length < 2) { setBrandOptions([]); setBrandErr(""); return; }

    const ctrl = new AbortController();
    (async () => {
      try {
        setBrandErr("");
        const r = await fetch(`/api/brands/search/?q=${encodeURIComponent(q)}`, {
          headers: { Accept: "application/json" },
          credentials: "omit",
          signal: ctrl.signal,
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json().catch(() => ({}));
        const list = Array.isArray(data) ? data : data.results || [];
        setBrandOptions(
          list.map((b) => ({ id: b?.id, name: b?.name || b?.label || "", slug: b?.slug || "" }))
              .filter((b) => b.name || b.slug)
              .slice(0, 20)
        );
      } catch (e) {
        if (e.name !== "AbortError") setBrandErr(e?.message || "Brand search failed");
      }
    })();
    return () => ctrl.abort();
  }, [brandInput]);

  // ---------- helpers ----------
  function openLogin(reason = "Please sign in to create a listing") {
    try {
      if (authSheet && typeof authSheet.open === "function") authSheet.open({ mode: "login", reason });
      else if (authSheet && typeof authSheet.openLogin === "function") authSheet.openLogin({ reason });
    } catch {}
  }

  function buildFormData(auto = false) {
    const fd = new FormData();

    const titleToUse = (title || "").trim() || (auto ? "Draft" : "");
    if (!titleToUse) throw new Error("Title required");
    fd.append("title", titleToUse);

    const qty = asInt(quantity, 1);
    fd.append("product_quantity", String(qty));

    if (priceMajor !== "" && priceMajor != null) {
      fd.append("price_major", String(priceMajor));
      fd.append("price_currency", currency || uiCurrency || "GHS"); // ✅ submit local currency
    }

    const condId = String(condition || "");
    if (condId) fd.append("condition", condId);

    if (categoryId) fd.append("category", String(categoryId));

    const inputName = (brandInput || "").trim();
    const brandId = Number(brandResolved?.id);
    if (Number.isFinite(brandId) && brandId > 0) {
      fd.append("brand", String(brandId));
    } else {
      if (inputName) fd.append("brand_name", inputName);
      const slug = (brandResolved?.slug || "").trim();
      if (slug) fd.append("brand_slug", slug);
    }

    return fd;
  }

  function getMissingBasics() {
    const m = [];
    if (!title.trim()) m.push("Title");
    if (priceMajor === "" || isNaN(Number(priceMajor)) || Number(priceMajor) <= 0) m.push("Price");
    if (!categoryId) m.push("Category");
    if (!condition) m.push("Condition");
    if (asInt(quantity, 0) <= 0) m.push("Quantity");
    return m;
  }
  function getMissingFull() {
    const m = getMissingBasics();
    const photos = Math.max(uploaderCount, imageCount);
    if (photos < 2) m.push("At least 2 photos");
    return m;
  }

  async function createDraft(auto = false) {
    const res = await fetch(`/api/products/`, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
      body: buildFormData(auto),
    });

    if (res.status === 401 || res.status === 403) {
      openLogin();
      const txt = await res.text().catch(() => "");
      throw new Error(`auth required ${res.status} ${txt}`);
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`create failed ${res.status} ${txt}`);
    }

    const product = await res.json();
    if (product?.id != null) setDraftId(Number(product.id));
    if (product?.u_pid) setUPid(String(product.u_pid));
    try { router.prefetch(`/new-dashboard/products/editor?id=${product.id}&step=media`); } catch {}
    return product;
  }

  async function patchDraft(auto = false) {
    if (!draftId) throw new Error("no draft id");
    const res = await fetch(`/api/products/${draftId}/`, {
      method: "PATCH",
      headers: { Accept: "application/json" },
      credentials: "include",
      body: buildFormData(auto),
    });

    if (res.status === 401 || res.status === 403) {
      openLogin();
      const txt = await res.text().catch(() => "");
      throw new Error(`auth required ${res.status} ${txt}`);
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`update failed ${res.status} ${txt}`);
    }
    const product = await res.json();
    try { router.prefetch(`/new-dashboard/products/editor?id=${product.id || draftId}&step=media`); } catch {}
    return product;
  }

  function clearPersisted() {
    localStorage.removeItem(DRAFT_META_KEY);
    localStorage.removeItem(DRAFT_FORM_KEY);
  }

  async function createOrUpdate(auto = false) {
    setSaving(true);
    setError("");

    try {
      if (!auto) {
        const probs = getMissingBasics();
        if (probs.length) throw new Error(probs.join("\n"));
      }

      let product;
      if (!draftId) product = await createDraft(auto);
      else {
        try { product = await patchDraft(auto); }
        catch (err) {
          if (String(err?.message || "").includes("update failed 404")) product = await createDraft(auto);
          else throw err;
        }
      }

      setLastSaved(new Date());

      if (!auto) {
        const id = Number(product?.id ?? draftId);
        if (Number.isFinite(id) && id > 0) {
          setTimeout(() => router.push(`/new-dashboard/products/editor?id=${id}&step=media`), 0);
          clearPersisted();
        } else {
          console.warn("Save succeeded but no product id found; staying on page.", product);
        }
      }

      return product;
    } catch (err) {
      console.error(err);
      if (!auto) {
        const msg = /auth required/.test(String(err?.message || "")) ? "Please sign in to create or edit a listing." : err?.message || "Save failed";
        setError(msg);
      }
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function ensureDraftId() {
    if (draftId) return draftId;
    if (ensureDraftPromiseRef.current) return await ensureDraftPromiseRef.current;

    ensureDraftPromiseRef.current = (async () => {
      const created = await createOrUpdate(true);
      if (created && created.id != null) {
        const idNum = Number(created.id);
        setDraftId(idNum);
        if (created.u_pid) setUPid(String(created.u_pid));
        return idNum;
      }
      throw new Error("Could not create draft (check auth and required fields)");
    })();

    try { return await ensureDraftPromiseRef.current; }
    finally { ensureDraftPromiseRef.current = null; }
  }

  async function refreshImageCount(id = draftId) {
    if (!id) return;
    try {
      const r = await fetch(`/api/product-images/?product=${id}&page_size=1`, {
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (!r.ok) return;
      const data = await r.json().catch(() => ({}));
      const count =
        typeof data?.count === "number" ? data.count :
        Array.isArray(data) ? data.length :
        (data?.results || []).length;
      setImageCount(Number(count) || 0);
    } catch {}
  }

  useEffect(() => {
    if (draftId) {
      refreshImageCount(draftId);
      try { router.prefetch(`/new-dashboard/products/editor?id=${draftId}&step=media`); } catch {}
    }
  }, [draftId, router]);

  useEffect(() => {
    const onVis = () => { if (document.visibilityState === "visible") refreshImageCount(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const missingBasics = getMissingBasics();
  const canContinue = missingBasics.length === 0 && !saving;

  // Header right pill
  const headerRight = (
    <span className="text-[11px] rounded-full px-2 py-1 border bg-white/70 dark:bg-gray-900/60 dark:text-gray-300">
      {saving ? "Autosave • Saving…" : lastSaved ? `Autosave • Saved ${lastSaved.toLocaleTimeString()}` : "Autosave • On"}
    </span>
  );

  // Footer (sheet’s sticky)
  const footer = (
    <div className="flex items-center justify-between gap-3">
      {lastSaved && <span className="text-xs text-gray-500">Saved {lastSaved.toLocaleTimeString()}</span>}
      {!canContinue && (
        <span className="hidden sm:block text-xs text-amber-500">
          Finish: {missingBasics.join(" · ")}
        </span>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => createOrUpdate(true)}
          disabled={saving}
          className="px-4 py-2 rounded-md border bg-white dark:bg-gray-900"
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={() => createOrUpdate(false)}
          disabled={!canContinue}
          aria-disabled={!canContinue}
          className={`px-4 py-2 rounded-md text-white ${canContinue ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
          title={!canContinue ? `Finish first: ${missingBasics.join(", ")}` : "Open the full editor"}
        >
          Continue to editor
        </button>
      </div>
    </div>
  );

  return (
    <OverlayPageFrame
      title="Add Product"
      right={headerRight}
      footer={footer}
      onClose={() => router.push("/new-dashboard/products")}
      maxWidth="max-w-3xl"
    >
      {error && <p className="mb-4 whitespace-pre-wrap text-red-500">{error}</p>}

      <div className="space-y-6">
        {/* Title */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-4">
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full min-w-0 rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => createOrUpdate(true)}
            placeholder="Dining Table"
          />
          <p className="mt-1 text-xs text-gray-500">Short, clear, searchable. You can fine-tune SEO later.</p>
        </div>

        {/* Photos */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Photos</label>
            <span className="text-xs text-gray-500">Primary appears first — autosave is on.</span>
          </div>
          <PhotosSection
            productId={draftId ?? undefined}
            ensureProductId={ensureDraftId}
            onCountChange={(n) => {
              const c = asInt(n, 0);
              setUploaderCount(c);
              setImageCount((prev) => (c > prev ? c : prev));
            }}
            onUploaded={() => {
              setUploaderCount((c) => c + 1);
              setImageCount((c) => c + 1);
              setTimeout(() => refreshImageCount(), 800);
            }}
            onRemoved={() => {
              setUploaderCount((c) => Math.max(0, c - 1));
              setImageCount((c) => Math.max(0, c - 1));
              setTimeout(() => refreshImageCount(), 400);
            }}
          />
          <p className="mt-2 text-xs text-gray-500">
            Tip: long-press and drag to reorder; tap star to set as primary. You’ll need at least <strong>2 photos</strong> to publish.
          </p>
        </div>

        {/* Details */}
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-4 grid gap-4 md:grid-cols-2">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {/* left symbol adornment */}
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-hidden
              >
                {priceSymbol}
              </span>
              <input
                className="w-full min-w-0 rounded-md border pl-8 pr-3 py-3 bg-white dark:bg-gray-800"
                value={priceMajor}
                onChange={(e) => setPriceMajor(e.target.value)}
                onBlur={() => createOrUpdate(true)}
                inputMode="decimal"
                placeholder="0.00"
                aria-label="Price"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              All amounts are in your local currency ({uiCurrency || currency}). No conversion will be applied.
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full min-w-0 rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
              value={quantity}
              onChange={(e) => setQuantity(asInt(e.target.value || 0))}
              onBlur={() => createOrUpdate(true)}
              inputMode="numeric"
              placeholder="1"
              min={0}
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2 min-w-0">
            <CategoryField
              label="Category"
              required
              valueId={categoryId ? Number(categoryId) : undefined}
              titleHint={title}
              onChange={(cat) => setCategoryId(String(cat.id))}
              autosave={() => createOrUpdate(true)}
            />
          </div>

          {/* Condition */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Condition <span className="text-red-500">*</span>
            </label>
            {!conditions.length ? (
              <select className="w-full rounded-md border px-3 py-3 bg-white dark:bg-gray-800" disabled>
                <option>{condError ? `Unavailable: ${condError}` : "Loading…"}</option>
              </select>
            ) : (
              <select
                className="w-full min-w-0 rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
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
            )}
          </div>

          {/* Brand (optional) */}
          <BrandField
            label="Brand (optional)"
            value={brandInput}
            onChange={setBrandInput}
            onResolved={(b) => setBrandResolved(b)}
            autosave={() => createOrUpdate(true)}
          />

          {!canContinue && (
            <div className="md:col-span-2 md:hidden">
              <div className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-900/20 dark:border-amber-800 rounded-md px-3 py-2">
                <span className="font-medium">Finish:</span> {missingBasics.join(" · ")}
              </div>
            </div>
          )}
        </div>
      </div>
    </OverlayPageFrame>
  );
}
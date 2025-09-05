// Upfrica Product Editor Stepper (MVP)
// Single-file React component (Next.js + Tailwind) wiring to your existing endpoints.
// - Autosave on blur/change per section
// - Major→minor currency handling on client (mirrors backend helpers)
// - Image presign + upload + reorder
// - Publish with pre-checks and friendly toasts
//
// src/components/products/ProductEditorStepper.jsx
"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Upload, ChevronRight } from "lucide-react";

import { api } from "@/lib/api";
import { getCleanToken } from "@/app/lib/getCleanToken";
import { API_BASE, SITE_BASE_URL } from "@/app/constants";

/* ----------------------------- helpers ----------------------------- */
function authHeaders() {
  const t = getCleanToken();
  return t ? { Authorization: `Token ${t}` } : {};
}

function Toast({ kind = "info", message }) {
  if (!message) return null;
  const styles =
    kind === "error" ? "bg-red-600" : kind === "success" ? "bg-green-600" : "bg-zinc-800";
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 text-white ${styles} px-4 py-2 rounded-lg shadow-lg z-50`}>
      {message}
    </div>
  );
}

// quick slugify for preview (doesn't change server slug unless you send it)
const slugify = (s="") =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// small debounce hook
function useDebounced(fn, delay = 500) {
  const ref = useRef();
  return useCallback((...args) => {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

/* ------------------------------ main ------------------------------ */
export default function ProductEditorStepper() {
  const router = useRouter();
  const search = useSearchParams();
  const productIdParam = search.get("id");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ kind: "", message: "" });
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const steps = [
    { key: "basics", label: "Basics" },
    { key: "media", label: "Media" },
    { key: "price", label: "Price & Stock" },
    { key: "delivery", label: "Delivery" },
    { key: "attributes", label: "Attributes" },
    { key: "policies", label: "Policies" },
    { key: "seo", label: "SEO & Visibility" },
    { key: "review", label: "Review & Publish" },
  ];

  // bootstrap: load or create draft
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let p;
        if (productIdParam) {
          p = await api(`${API_BASE}/products/${productIdParam}/`, { headers: authHeaders() });
        } else {
          p = await api(`${API_BASE}/products/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ title: "Untitled product" }),
          });
          router.replace(`?id=${p.id}`);
        }
        setProduct(p);
      } catch (e) {
        setToast({ kind: "error", message: e?.detail || e?.message || "Failed to init product" });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markSaved = () => setLastSavedAt(Date.now());

  const savePatch = useCallback(
    async (body) => {
      if (!product?.id) return;
      try {
        setErrors({});
        const updated = await api(`${API_BASE}/products/${product.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(body || {}),
        });
        setProduct(updated);
        markSaved();
      } catch (e) {
        setErrors(e);
        setToast({ kind: "error", message: e?.detail || e?.message || "Save failed" });
      }
    },
    [product?.id]
  );

  const debouncedSave = useDebounced(savePatch, 700);

  /* ------------------------- quality scoring ------------------------- */
  const qualityScore = useMemo(() => {
    if (!product) return 0;
    let score = 0;
    // required basics
    if (product?.title) score += 10;
    if (product?.condition_id || product?.condition) score += 5;
    if (product?.category_full_slug) score += 15;

    // media
    const imgs = (product?.images || product?.product_images || []).length;
    if (imgs >= 1) score += 10;
    if (imgs >= 3) score += 10;
    if (imgs >= 5) score += 5;

    // price & stock
    if (Number(product?.price_cents || 0) > 0) score += 15;
    if ((product?.product_quantity ?? 0) > 0) score += 5;

    // delivery
    if (product?.dispatch_time_in_days) score += 10;

    // seo
    if (product?.seo_title) score += 5;
    if (product?.seo_description) score += 5;

    return Math.max(0, Math.min(100, score));
  }, [product]);

  const savedAgo = useMemo(() => {
    if (!lastSavedAt) return null;
    const s = Math.max(0, Math.round((Date.now() - lastSavedAt) / 1000));
    return s <= 1 ? "just now" : `${s}s ago`;
  }, [lastSavedAt]);

  /* ---------------------------- sections ---------------------------- */

  const Basics = () => {
    const [title, setTitle] = useState(product?.title || "");
    const [conditionId, setConditionId] = useState(product?.condition || product?.condition_id || "");
    const [categoryFullSlug, setCategoryFullSlug] = useState(product?.category_full_slug || "");
    const [brandId, setBrandId] = useState(product?.brand || product?.brand_id || "");

    useEffect(() => {
      setTitle(product?.title || "");
      setConditionId(product?.condition || product?.condition_id || "");
      setCategoryFullSlug(product?.category_full_slug || "");
      setBrandId(product?.brand || product?.brand_id || "");
    }, [product]);

    const onSave = () =>
      savePatch({
        title,
        condition_id: conditionId || null,
        category_full_slug: categoryFullSlug || null,
        brand_id: brandId || null,
      });

    return (
      <SectionCard title="Basics" onSave={onSave}>
        <Field label="Title" error={errors?.title}>
          <input
            className="input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              debouncedSave({ title: e.target.value });
            }}
            placeholder="e.g., Eco-Friendly Water Bottle"
            onBlur={() => savePatch({ title })}
          />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Category (full slug)">
            <input
              className="input"
              value={categoryFullSlug}
              onChange={(e) => setCategoryFullSlug(e.target.value)}
              onBlur={() => savePatch({ category_full_slug: categoryFullSlug || null })}
              placeholder="home-kitchen/water-bottles/stainless"
            />
          </Field>
          <Field label="Brand ID">
            <input
              className="input"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              onBlur={() => savePatch({ brand_id: brandId || null })}
              placeholder="numeric brand id"
            />
          </Field>
          <Field label="Condition ID">
            <input
              className="input"
              value={conditionId}
              onChange={(e) => setConditionId(e.target.value)}
              onBlur={() => savePatch({ condition_id: conditionId || null })}
              placeholder="numeric condition id"
            />
          </Field>
        </div>
      </SectionCard>
    );
  };

  const Media = () => {
    const [uploading, setUploading] = useState(false);

    const onFiles = async (e) => {
      const list = Array.from(e.target.files || []);
      if (!list.length || !product?.id) return;
      setUploading(true);
      try {
        for (const f of list) {
          const presign = await api(`${API_BASE}/uploads/presign`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ filename: f.name, content_type: f.type, scope: "product" }),
          });
          await fetch(presign.upload_url, {
            method: presign.method || "PUT",
            headers: presign.headers || { "Content-Type": f.type },
            body: f,
          });
          await api(`${API_BASE}/product-images/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ product: product.id, image_url: presign.public_url, is_cover: false }),
          });
        }
        const refreshed = await api(`${API_BASE}/products/${product.id}/`, { headers: authHeaders() });
        setProduct(refreshed);
        markSaved();
        setToast({ kind: "success", message: "Images uploaded" });
      } catch (e) {
        setToast({ kind: "error", message: e?.detail || e?.message || "Upload failed" });
      } finally {
        setUploading(false);
      }
    };

    return (
      <SectionCard title="Media" onSave={() => {}}>
        <div className="border border-dashed rounded-xl p-6 text-center">
          <input id="file" type="file" multiple className="hidden" onChange={onFiles} />
          <label htmlFor="file" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white cursor-pointer">
            <Upload size={18} /> Upload images
          </label>
          {uploading && (
            <div className="mt-2 text-sm text-zinc-500 flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Uploading…
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {(product?.images || product?.product_images || []).map((im) => (
            <div key={im.id} className="aspect-square relative rounded-lg overflow-hidden border">
              <img src={im.image_url || im.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </SectionCard>
    );
  };

  const PriceStock = () => {
    const currency = (product?.price_currency || "GHS").toUpperCase();
    const [priceMajor, setPriceMajor] = useState(product?.price_major ?? "");
    const [saleMajor, setSaleMajor] = useState(product?.sale_price_major ?? "");
    const [qty, setQty] = useState(product?.product_quantity || 1);
    const [postageMajor, setPostageMajor] = useState(product?.postage_fee_major ?? "");

    useEffect(() => {
      setPriceMajor(product?.price_major ?? "");
      setSaleMajor(product?.sale_price_major ?? "");
      setQty(product?.product_quantity || 1);
      setPostageMajor(product?.postage_fee_major ?? "");
    }, [product]);

    const onSave = () =>
      savePatch({
        price_major: priceMajor || "0",
        price_currency: currency,
        sale_price_major: saleMajor || "0",
        postage_fee_major: postageMajor || "0",
        product_quantity: Number(qty) || 0,
      });

    const discount = (() => {
      const p = Number(priceMajor || 0), s = Number(saleMajor || 0);
      if (p > 0 && s > 0 && s <= p) return Math.round(((p - s) / p) * 100);
      return 0;
    })();

    return (
      <SectionCard title="Price & Stock" onSave={onSave}>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label={`Price (${currency})`} error={errors?.price_cents}>
            <input className="input" inputMode="decimal" value={priceMajor}
              onChange={(e) => setPriceMajor(e.target.value)}
              onBlur={() => savePatch({ price_major: priceMajor || "0", price_currency: currency })} />
          </Field>
          <Field label={`Sale Price (${currency})`} error={errors?.sale_price_cents}>
            <input className="input" inputMode="decimal" value={saleMajor}
              onChange={(e) => setSaleMajor(e.target.value)}
              onBlur={() => savePatch({ sale_price_major: saleMajor || "0" })} />
          </Field>
          <Field label={`Postage Fee (${currency})`}>
            <input className="input" inputMode="decimal" value={postageMajor}
              onChange={(e) => setPostageMajor(e.target.value)}
              onBlur={() => savePatch({ postage_fee_major: postageMajor || "0" })} />
          </Field>
          <Field label="Quantity">
            <input className="input" type="number" min={0} value={qty}
              onChange={(e) => setQty(e.target.value)}
              onBlur={() => savePatch({ product_quantity: Number(qty) || 0 })} />
          </Field>
        </div>
        {discount > 0 && <div className="text-sm text-green-700 mt-2">Discount: {discount}%</div>}
      </SectionCard>
    );
  };

  const Delivery = () => {
    const [dispatchDays, setDispatchDays] = useState(product?.dispatch_time_in_days || "2");
    const [shippingFrom, setShippingFrom] = useState(product?.shipping_from || "");

    useEffect(() => {
      setDispatchDays(product?.dispatch_time_in_days || "2");
      setShippingFrom(product?.shipping_from || "");
    }, [product]);

    return (
      <SectionCard title="Delivery" onSave={() => savePatch({ dispatch_time_in_days: dispatchDays, shipping_from: shippingFrom })}>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Dispatch Time (days)"><input className="input" value={dispatchDays} onChange={(e) => setDispatchDays(e.target.value)} /></Field>
          <Field label="Ships From (town)"><input className="input" value={shippingFrom} onChange={(e) => setShippingFrom(e.target.value)} placeholder="Accra" /></Field>
        </div>
        <div className="mt-4 text-sm text-zinc-600">Listing cannot publish unless at least one shipping method exists.</div>
      </SectionCard>
    );
  };

  const Attributes = () => (
    <SectionCard title="Attributes" onSave={() => {}}>
      <div className="text-sm text-zinc-600">Wire to <code>properties/suggest</code> and <code>products/:id/properties/bulk</code>.</div>
    </SectionCard>
  );

  const Policies = () => {
    const [cancellable, setCancellable] = useState(!!product?.cancellable);
    const [terms, setTerms] = useState(product?.seller_payment_terms || "payment_before_delivery");

    useEffect(() => {
      setCancellable(!!product?.cancellable);
      setTerms(product?.seller_payment_terms || "payment_before_delivery");
    }, [product]);

    return (
      <SectionCard title="Policies" onSave={() => savePatch({ cancellable, seller_payment_terms: terms })}>
        <div className="flex items-center gap-2">
          <input id="cancellable" type="checkbox" checked={cancellable} onChange={(e) => setCancellable(e.target.checked)} />
          <label htmlFor="cancellable">Cancellable</label>
        </div>
        <Field label="Seller Payment Terms">
          <select className="input" value={terms} onChange={(e) => setTerms(e.target.value)}>
            <option value="payment_before_delivery">Payment before delivery</option>
            <option value="cod_allowed">Cash on delivery allowed</option>
          </select>
        </Field>
      </SectionCard>
    );
  };

  /* ---------------------- NEW: SEO & Visibility ---------------------- */
  const SEO = () => {
    const published = Number(product?.status) === 1;
    const [seoTitle, setSeoTitle] = useState(product?.seo_title || product?.admin_seo_title || "");
    const [seoDesc, setSeoDesc] = useState(product?.seo_description || "");
    const [country, setCountry] = useState((product?.listing_country_code || "gh").toLowerCase());
    const lockedSlug = product?.slug || "";
    const draftSlug = lockedSlug || slugify(product?.title || "");
    const previewPath = `/${country}/${draftSlug || "your-slug"}`;
    const canonical = product?.canonical_url || `${SITE_BASE_URL}${previewPath}`;

    useEffect(() => {
      setSeoTitle(product?.seo_title || product?.admin_seo_title || "");
      setSeoDesc(product?.seo_description || "");
      setCountry((product?.listing_country_code || "gh").toLowerCase());
    }, [product]);

    const saveSeo = () =>
      savePatch({
        seo_title: seoTitle || null,
        seo_description: seoDesc || null,
        // only allow changing country code until first publish
        ...(published ? {} : { listing_country_code: country }),
        // slug remains server-controlled; front-end shows preview only
        canonical_url: canonical,
      });

    return (
      <SectionCard title="SEO & Visibility" onSave={saveSeo}>
        <Field label="SEO title">
          <input
            className="input"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            onBlur={() => savePatch({ seo_title: seoTitle || null })}
          />
        </Field>
        <Field label="SEO description">
          <input
            className="input"
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            onBlur={() => savePatch({ seo_description: seoDesc || null })}
            placeholder="Reusable stainless steel water bottle with bamboo lid"
          />
        </Field>
        <Field label="Preview URL">
          <input className="input" value={previewPath} readOnly />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Country code">
            <input
              className="input"
              value={country}
              onChange={(e) => setCountry(e.target.value.toLowerCase())}
              onBlur={() => !published && savePatch({ listing_country_code: country })}
              disabled={published}
            />
          </Field>
          <Field label="Canonical URL">
            <input
              className="input"
              defaultValue={canonical}
              onBlur={(e) => savePatch({ canonical_url: e.target.value })}
            />
          </Field>
        </div>
        {published && (
          <div className="mt-2 text-xs text-zinc-500">
            Country and slug are locked after first publish.
          </div>
        )}
      </SectionCard>
    );
  };

  const ReviewPublish = () => {
    const onPublish = async () => {
      try {
        setLoading(true);
        // If you later add a dedicated endpoint, swap here.
        const updated = await api(`${API_BASE}/products/${product.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ status: 1 }),
        });
        setProduct(updated);
        markSaved();
        setToast({ kind: "success", message: "Published" });
      } catch (e) {
        setToast({ kind: "error", message: e?.detail || e?.message || "Publish failed" });
      } finally {
        setLoading(false);
      }
    };
    const onSaveDraft = async () => {
      await savePatch({ status: 0 });
      setToast({ kind: "success", message: "Draft saved" });
    };

    return (
      <SectionCard title="Review & Publish" onSave={() => {}}>
        <ul className="text-sm list-disc pl-5 space-y-1 text-zinc-700">
          <li>Images uploaded</li>
          <li>Pricing valid (sale ≤ price)</li>
          <li>At least one shipping method configured</li>
        </ul>
        <div className="mt-4 flex gap-3">
          <button onClick={onSaveDraft} className="btn-secondary">Save draft</button>
          <button onClick={onPublish} className="btn-primary">
            {loading ? <Loader2 className="animate-spin" /> : "Publish"}
          </button>
        </div>
      </SectionCard>
    );
  };

  const Section = useMemo(
    () => [Basics, Media, PriceStock, Delivery, Attributes, Policies, SEO, ReviewPublish][step],
    [step]
  );

  if (loading && !product) {
    return (
      <div className="p-8 text-zinc-700 flex items-center gap-2">
        <Loader2 className="animate-spin" /> Loading…
      </div>
    );
  }

  /* ----------------------------- layout ----------------------------- */
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* header with score + saved time */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-semibold">Add Product</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-zinc-700">Quality Score: {qualityScore}</span>
            <div className="w-48 h-2 bg-zinc-200 rounded">
              <div className="h-2 bg-zinc-900 rounded" style={{ width: `${qualityScore}%` }} />
            </div>
          </div>
        </div>
        <div className="text-sm text-zinc-500">{lastSavedAt ? `Saved · ${savedAgo}` : "\u00A0"}</div>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="md:col-span-1">
          <nav className="space-y-1">
            {steps.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setStep(i)}
                className={`w-full text-left px-3 py-2 rounded-lg border ${
                  i === step ? "bg-zinc-900 text-white border-zinc-900" : "hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{s.label}</span>
                  {i === step && <ChevronRight />}
                </div>
              </button>
            ))}
          </nav>
        </aside>
        <main className="md:col-span-3">
          {product && Section ? <Section /> : <div className="p-6 border rounded-xl">Initializing…</div>}
        </main>
      </div>

      <Toast {...toast} />

      <style jsx>{`
        .input { @apply w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-zinc-900; }
        .btn-primary { @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white; }
        .btn-secondary { @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg border; }
      `}</style>
    </div>
  );
}

/* ---------------------------- small bits ---------------------------- */
function SectionCard({ title, onSave, children }) {
  return (
    <div className="rounded-xl border p-4 md:p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{title}</h2>
        {onSave && <button onClick={onSave} className="btn-primary">Save</button>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <div className="mb-1 text-sm text-zinc-700">{label}</div>
      {children}
      {!!error && (
        <div className="mt-1 text-sm text-red-600">
          {Array.isArray(error) ? error.join(", ") : String(error)}
        </div>
      )}
    </div>
  );
}
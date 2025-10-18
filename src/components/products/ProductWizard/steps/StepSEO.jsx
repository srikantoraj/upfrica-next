"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** debounce helper */
function useDebouncedCallback(fn, delay) {
  const t = useRef(null);
  return (...args) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), delay);
  };
}

/** shallow-ish equal for SEO payload */
function sameSeo(a, b) {
  return (a?.title || "") === (b?.title || "") && (a?.description || "") === (b?.description || "");
}

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

export default function StepSEO({ productId, onSave }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // loaded product snapshot
  const [product, setProduct] = useState(null);

  // local SEO state
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  // local visibility
  const [status, setStatus] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [unpublishAt, setUnpublishAt] = useState("");

  // keep the last loaded SEO to avoid echo-patching the same values
  const loadedSeoRef = useRef({ title: "", description: "" });
  const hydratedRef = useRef(false); // skip first autosave

  // fetch product once
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!productId) return;
      setLoading(true); setErr("");
      try {
        const res = await fetch(`/api/products/${productId}/`, {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Load failed (${res.status})`);
        const data = await res.json();
        if (!alive) return;

        setProduct(data);

        const sd = data?.secondary_data || {};
        const sseo = sd.seo || {};
        const nextSeo = {
          title: (sseo.title || data?.title || "").trim(),
          description: (sseo.description || "").trim(),
        };
        loadedSeoRef.current = nextSeo;
        setSeoTitle(nextSeo.title);
        setSeoDesc(nextSeo.description);

        setStatus(Number(data?.status) || 0);
        setIsPaused(Boolean(data?.is_paused));

        const toLocal = (iso) => {
          if (!iso) return "";
          const d = new Date(iso);
          const p = (n) => `${n}`.padStart(2, "0");
          return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
        };
        setPublishAt(toLocal(data?.publish_at));
        setUnpublishAt(toLocal(data?.unpublish_at));
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load product");
      } finally {
        if (alive) {
          setLoading(false);
          hydratedRef.current = true; // from now, we may autosave on changes
        }
      }
    })();
    return () => { alive = false; };
  }, [productId]);

  // preview path
  const previewPath = useMemo(() => {
    const f = product?.frontend_url || "";
    if (f) return f;
    const c = product?.canonical_url || "";
    if (c) {
      try { return new URL(c).pathname || c; } catch { return c; }
    }
    return product?.slug ? `/${(product?.listing_country_code || "gh").toLowerCase()}/${product.slug}` : "";
  }, [product]);

  // debounced senders
  const debouncedSaveSEO = useDebouncedCallback((title, description) => {
    onSave?.({ secondary_data: { seo: { title, description } } });
  }, 600);

  const debouncedSaveVisibility = useDebouncedCallback((patch) => {
    onSave?.(patch);
  }, 300);

  // autosave SEO changes, but:
  //  - skip first run after hydration
  //  - only send if changed vs loaded snapshot
  useEffect(() => {
    if (!hydratedRef.current) return;
    const nextSeo = { title: seoTitle, description: seoDesc };
    if (!sameSeo(nextSeo, loadedSeoRef.current)) {
      debouncedSaveSEO(nextSeo.title, nextSeo.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seoTitle, seoDesc]);

  // handlers (visibility)
  function onStatusChange(e) {
    const v = Number(e.target.value);
    setStatus(v);
    debouncedSaveVisibility({ status: v });
  }
  function onPauseToggle(e) {
    const v = e.target.checked;
    setIsPaused(v);
    debouncedSaveVisibility({ is_paused: v });
  }
  function onPublishAtChange(e) {
    const v = e.target.value;
    setPublishAt(v);
    debouncedSaveVisibility({ publish_at: v ? new Date(v).toISOString() : null });
  }
  function onUnpublishAtChange(e) {
    const v = e.target.value;
    setUnpublishAt(v);
    debouncedSaveVisibility({ unpublish_at: v ? new Date(v).toISOString() : null });
  }

  const titleCount = seoTitle.length;
  const descCount = seoDesc.length;
  const serpTitle = seoTitle || "(Untitled product)";
  const serpDesc = seoDesc || "Add a concise, benefit-forward description.";
  const serpUrl = (typeof window !== "undefined" ? window.location.origin : "https://www.upfrica.com") + (previewPath || "");

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">SEO &amp; Visibility</h2>
      {err && <div className="text-sm text-red-600">{err}</div>}

      {/* SEO */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium">SEO</h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            SEO title
            <span className={`ml-2 text-xs ${titleCount > TITLE_LIMIT ? "text-amber-600" : "text-gray-500"}`}>
              {titleCount}/{TITLE_LIMIT}
            </span>
          </label>
          <input
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="e.g., Samsung Galaxy A15 — 8GB/128GB (Brand New)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            SEO description
            <span className={`ml-2 text-xs ${descCount > DESC_LIMIT ? "text-amber-600" : "text-gray-500"}`}>
              {descCount}/{DESC_LIMIT}
            </span>
          </label>
          <textarea
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
            rows={3}
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            placeholder="Crisp, compelling summary with key benefits (150–160 chars)."
          />
        </div>

        <div className="rounded border p-3">
          <div className="text-xs text-gray-500">Preview URL:</div>
          <div className="text-sm font-mono mt-0.5 break-all">{previewPath || "—"}</div>

          <div className="mt-3 space-y-1">
            <div className="text-[#1a0dab] dark:text-blue-400 text-base leading-snug">{serpTitle}</div>
            <div className="text-[#006621] text-xs">{serpUrl}</div>
            <div className="text-[#545454] dark:text-gray-300 text-sm">{serpDesc}</div>
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="space-y-4 border-t pt-6">
        <h3 className="text-sm font-medium">Visibility</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
              value={status}
              onChange={onStatusChange}
            >
              <option value={0}>Draft</option>
              <option value={1}>Published</option>
              <option value={2}>Under Review</option>
              <option value={3}>Rejected</option>
              <option value={4}>Archived</option>
              <option value={5}>Deleted</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Set to <strong>Published</strong> to make it visible (subject to pause/schedule).
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <input type="checkbox" checked={isPaused} onChange={onPauseToggle} />
              Pause listing
            </label>
            <p className="text-xs text-gray-500">
              Pause temporarily hides a published item without changing its status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Publish at</label>
            <input
              type="datetime-local"
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
              value={publishAt}
              onChange={onPublishAtChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unpublish at</label>
            <input
              type="datetime-local"
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
              value={unpublishAt}
              onChange={onUnpublishAtChange}
            />
          </div>
        </div>

        <VisibilitySummary
          status={status}
          isPaused={isPaused}
          publishAt={publishAt}
          unpublishAt={unpublishAt}
        />
      </section>
    </div>
  );
}

function VisibilitySummary({ status, isPaused, publishAt, unpublishAt }) {
  const now = new Date();
  const toDate = (s) => (s ? new Date(s) : null);
  const pAt = toDate(publishAt);
  const uAt = toDate(unpublishAt);
  const isPublished = Number(status) === 1;
  const beforePublish = pAt && now < pAt;
  const afterUnpublish = uAt && now >= uAt;

  let label = "Hidden";
  if (isPublished) {
    if (isPaused) label = "Paused";
    else if (beforePublish) label = "Scheduled";
    else if (afterUnpublish) label = "Expired (Unpublished)";
    else label = "Published";
  }

  return (
    <div className="text-xs mt-2 text-gray-600 dark:text-gray-300">
      <span className="font-medium">Current visibility:</span> {label}
    </div>
  );
}

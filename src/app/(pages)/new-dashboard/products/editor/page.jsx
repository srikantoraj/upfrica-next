"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";
import useAutosave from "@/components/useAutosave";
import ImageUploader from "@/components/ImageUploader";

function authHeaders() {
  const t = getCleanToken?.();
  return t ? { Authorization: `Token ${t}` } : {};
}

const SECTIONS = [
  "Basics",
  "Media",
  "Price & Stock",
  "Delivery",
  "Attributes",
  "Policies",
  "SEO & Visibility",
  "Review",
];

function scoreProduct(p) {
  // super simple placeholder
  let s = 0;
  if (p?.title) s += 20;
  if (p?.image_objects?.length) s += 20;
  if (p?.price_cents > 0 || p?.price_major) s += 20;
  if (p?.seo_title || p?.seo_description) s += 10;
  // room to grow…
  return Math.min(100, s);
}

export default function ProductEditorPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const id = useMemo(() => sp.get("id"), [sp]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [section, setSection] = useState("Basics");

  // form state (Basics + SEO to start)
  const [title, setTitle] = useState("");
  const [priceMajor, setPriceMajor] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  // autosave hook points to product endpoint
  const { save, saving, lastSavedAt, error: autosaveError } = useAutosave({
    url: id ? `/api/products/${id}/` : "",
    method: "PATCH",
    delay: 600,
  });

  // LOAD once
  useEffect(() => {
    if (!id) { setError("Missing product id."); setLoading(false); return; }
    let alive = true;
    (async () => {
      setLoading(true); setError("");
      try {
        const res = await fetch(`${BASE_API_URL}/api/products/${id}/`, {
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) {
          let detail = ""; try { detail = JSON.stringify(await res.json()); }
          catch { try { detail = await res.text(); } catch {} }
          throw new Error(`GET failed: ${res.status} ${detail}`);
        }
        const data = await res.json();
        if (!alive) return;
        setProduct(data);
        setTitle(data?.title ?? "");
        setPriceMajor(data?.price_major ?? "0.00");
        setCurrency((data?.price_currency || "GHS").toUpperCase());
        setSeoTitle(data?.seo_title ?? "");
        setSeoDesc(data?.seo_description ?? "");
      } catch (e) {
        if (alive) setError(e.message || "Load failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // autosave on change (Basics)
  useEffect(() => {
    if (!id) return;
    save({ title, price_major: priceMajor, price_currency: currency });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, priceMajor, currency, id]);

  // autosave on change (SEO)
  useEffect(() => {
    if (!id) return;
    save({ seo_title: seoTitle, seo_description: seoDesc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seoTitle, seoDesc, id]);

  async function publish() {
    if (!id) return;
    try {
      const res = await fetch(`${BASE_API_URL}/api/products/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({ status: 1 }), // publish
      });
      if (!res.ok) throw new Error(`Publish failed ${res.status}`);
      const updated = await res.json();
      setProduct(updated);
    } catch (e) {
      alert(e.message || "Publish failed");
    }
  }

  function savedLabel() {
    if (saving) return "Saving…";
    if (autosaveError) return "Save error";
    if (!lastSavedAt) return "—";
    const secs = Math.max(1, Math.round((Date.now() - lastSavedAt) / 1000));
    return `Saved · ${secs}s ago`;
    }

  if (!id) return <main className="p-8">Missing ?id</main>;
  if (loading) return <main className="p-8">Loading…</main>;

  const score = scoreProduct(product || { title, price_major: priceMajor, seo_title: seoTitle, seo_description: seoDesc });

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="text-sm underline">← Back</button>
        <div className="text-sm text-gray-500 dark:text-gray-400">{savedLabel()}</div>
      </div>

      <div className="flex gap-6">
        {/* Stepper */}
        <aside className="w-56 shrink-0">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Quality Score</div>
            <div className="mt-1 h-2 rounded bg-gray-200 dark:bg-gray-800">
              <div className="h-2 rounded bg-blue-500" style={{ width: `${score}%` }} />
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">{score}/100</div>
          </div>
          <ul className="space-y-1">
            {SECTIONS.map((s) => (
              <li key={s}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${section === s ? "bg-gray-200 dark:bg-gray-800 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  onClick={() => setSection(s)}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <button
              onClick={publish}
              className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
            >
              {product?.status === 1 ? "Republish" : "Publish"}
            </button>
          </div>
        </aside>

        {/* Panel */}
        <section className="flex-1">
          {section === "Basics" && (
            <div className="space-y-5">
              <h1 className="text-2xl font-semibold">Basics</h1>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Eco-Friendly Water Bottle"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Price (major)</label>
                  <input
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                    value={priceMajor}
                    onChange={(e) => setPriceMajor(e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <input
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    maxLength={3}
                    placeholder="GHS"
                  />
                </div>
              </div>
            </div>
          )}

          {section === "Media" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Media</h2>
              <ImageUploader
                productId={Number(id)}
                onUploaded={(url) => {
                  // optimistic append
                  setProduct((p) => ({
                    ...(p || {}),
                    image_objects: [{ image_url: url }, ...((p?.image_objects) || [])],
                  }));
                }}
              />
              <div className="flex flex-wrap gap-3">
                {(product?.image_objects || []).map((img, i) => (
                  <img
                    key={`${img.image_url || img.url}-${i}`}
                    src={img.image_url || img.url}
                    alt={`image-${i}`}
                    className="h-24 w-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          {section === "SEO & Visibility" && (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold">SEO & Visibility</h2>
              <div>
                <label className="block text-sm font-medium mb-1">SEO title</label>
                <input
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SEO description</label>
                <textarea
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                />
              </div>
              {product?.slug && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Preview URL: <code>/{(product.listing_country_code || "gh")}/{product.slug}</code>
                </div>
              )}
            </div>
          )}

          {/* Stubs for remaining sections */}
          {section !== "Basics" && section !== "Media" && section !== "SEO & Visibility" && (
            <div className="text-gray-500 dark:text-gray-400">
              This section UI is coming next.
            </div>
          )}

          {error && <p className="mt-6 text-red-600 whitespace-pre-wrap">{error}</p>}
        </section>
      </div>
    </main>
  );
}
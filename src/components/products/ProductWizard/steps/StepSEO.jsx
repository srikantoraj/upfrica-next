//components/products/ProductWizard/steps/StepSEO.jsx
"use client";
import { useEffect, useState } from "react";

export default function StepSEO({ productId, onSave }) {
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await fetch(`/api/products/${productId}/`, {
        credentials: "include", headers: { Accept: "application/json" }, cache: "no-store",
      });
      const d = await r.json();
      if (!alive) return;
      setSeoTitle(d?.seo_title ?? "");
      setSeoDesc(d?.seo_description ?? "");
      setSlug(d?.slug || "");
    })();
    return () => { alive = false; };
  }, [productId]);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">SEO & Visibility</h2>

      <div>
        <label className="block text-sm font-medium mb-1">SEO title</label>
        <input
          className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
          value={seoTitle}
          onChange={(e) => { setSeoTitle(e.target.value); onSave?.({ seo_title: e.target.value }); }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">SEO description</label>
        <textarea
          rows={3}
          className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
          value={seoDesc}
          onChange={(e) => { setSeoDesc(e.target.value); onSave?.({ seo_description: e.target.value }); }}
        />
      </div>

      {slug && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Preview URL: <code>/{slug}</code>
        </div>
      )}
    </div>
  );
}
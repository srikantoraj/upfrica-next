//components/products/ProductWizard/steps/StepReview.jsx
"use client";
import { useEffect, useState } from "react";

export default function StepReview({ productId }) {
  const [p, setP] = useState(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/products/${productId}/`, { credentials: "include" });
      setP(await r.json());
    })();
  }, [productId]);

  const photos = (p?.image_objects || []).length;
  const ready =
    !!p?.title &&
    (p?.price_cents > 0 || Number(p?.price_major) > 0) &&
    photos >= 2 &&
    !!p?.category;

  async function publish() {
    setPublishing(true);
    try {
      const res = await fetch(`/api/products/${productId}/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ status: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // optional: window.__canPublish = true;
      alert("Published!");
    } catch (e) {
      alert(e.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Review & Publish</h2>

      <ul className="text-sm space-y-1">
        <li>{p?.title ? "✅" : "❌"} Title</li>
        <li>{(p?.price_cents > 0 || Number(p?.price_major) > 0) ? "✅" : "❌"} Price</li>
        <li>{photos >= 2 ? "✅" : "❌"} 2+ photos</li>
        <li>{p?.category ? "✅" : "❌"} Category</li>
      </ul>

      <button
        onClick={publish}
        disabled={!ready || publishing}
        className={`px-4 py-2 rounded text-white ${ready ? "bg-violet-600 hover:bg-violet-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        {publishing ? "Publishing…" : "Publish"}
      </button>
    </div>
  );
}

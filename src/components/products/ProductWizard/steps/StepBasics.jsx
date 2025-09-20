//components/products/ProductWizard/steps/StepBasics.jsx
"use client";
import { useEffect, useState } from "react";

export default function StepBasics({ productId, onSave }) {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [priceMajor, setPriceMajor] = useState("");
  const [currency, setCurrency] = useState("GHS");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}/`, {
          credentials: "include", headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const data = await res.json();
        if (!alive) return;
        setTitle(data?.title ?? "");
        setPriceMajor(data?.price_major ?? "");
        setCurrency((data?.price_currency || "GHS").toUpperCase());
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [productId]);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Basics</h1>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onSave?.({ title: e.target.value });
          }}
          placeholder="Dining Table"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Price (major)</label>
          <input
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
            value={priceMajor}
            onChange={(e) => {
              setPriceMajor(e.target.value);
              onSave?.({ price_major: e.target.value });
            }}
            inputMode="decimal"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <input
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
            value={currency}
            onChange={(e) => {
              const v = e.target.value.toUpperCase().slice(0,3);
              setCurrency(v);
              onSave?.({ price_currency: v });
            }}
            maxLength={3}
            placeholder="GHS"
          />
        </div>
      </div>
    </div>
  );
}
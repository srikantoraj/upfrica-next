// components/products/ProductWizard/steps/StepPriceStock.jsx
"use client";
import { useEffect, useState } from "react";

export default function StepPriceStock({ productId, onSave }) {
    const [loading, setLoading] = useState(true);

    // price & sale
    const [priceMajor, setPriceMajor] = useState("");
    const [currency, setCurrency] = useState("GHS");
    const [salePriceMajor, setSalePriceMajor] = useState("");
    const [saleStart, setSaleStart] = useState(""); // ISO local input
    const [saleEnd, setSaleEnd] = useState("");

    // stock & units
    const [quantity, setQuantity] = useState(0);
    const [moq, setMoq] = useState(1);
    const [unitMeasure, setUnitMeasure] = useState("pcs");
    const [unitMeasureValue, setUnitMeasureValue] = useState(1);

    // wholesale (optional)
    const [wholesaleActive, setWholesaleActive] = useState(false);
    const [wholesaleMajor, setWholesaleMajor] = useState("");
    const [wholesaleCurrency, setWholesaleCurrency] = useState("GHS");

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products/${productId}/`, {
                    credentials: "include",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                });
                const data = await res.json();
                if (!alive) return;

                // price & sale
                setPriceMajor(data?.price_major ?? "");
                setCurrency((data?.price_currency || "GHS").toUpperCase());
                setSalePriceMajor(data?.sale_price_major ?? "");
                setSaleStart(data?.sale_start_date ? toLocalInputValue(data.sale_start_date) : "");
                setSaleEnd(data?.sale_end_date ? toLocalInputValue(data.sale_end_date) : "");

                // stock & units
                setQuantity(Number(data?.product_quantity ?? 0));
                setMoq(Number(data?.minimum_order_quantity ?? 1));
                setUnitMeasure(data?.unit_measure ?? "pcs");
                setUnitMeasureValue(Number(data?.unit_measure_value ?? 1));

                // wholesale
                setWholesaleActive(Boolean(data?.active_wholesale));
                setWholesaleMajor(data?.wholesale_price_major ?? "");
                setWholesaleCurrency((data?.wholesale_price_currency || data?.price_currency || "GHS").toUpperCase());
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [productId]);

    if (loading) return <div>Loading…</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Price & Stock</h1>

            {/* Base price */}
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
                            const v = e.target.value.toUpperCase().slice(0, 3);
                            setCurrency(v);
                            onSave?.({ price_currency: v });
                        }}
                        maxLength={3}
                        placeholder="GHS"
                    />
                </div>
            </div>

            {/* Sale section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Sale Price (major)</label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={salePriceMajor}
                        onChange={(e) => {
                            setSalePriceMajor(e.target.value);
                            onSave?.({ sale_price_major: e.target.value });
                        }}
                        inputMode="decimal"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Sale Start</label>
                    <input
                        type="datetime-local"
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={saleStart}
                        onChange={(e) => {
                            setSaleStart(e.target.value);
                            onSave?.({ sale_start_date: fromLocalInputValue(e.target.value) });
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Sale End</label>
                    <input
                        type="datetime-local"
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={saleEnd}
                        onChange={(e) => {
                            setSaleEnd(e.target.value);
                            onSave?.({ sale_end_date: fromLocalInputValue(e.target.value) });
                        }}
                    />
                </div>
            </div>

            {/* Stock & units */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                        type="number"
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={quantity}
                        onChange={(e) => {
                            const v = clampInt(e.target.value, 0);
                            setQuantity(v);
                            onSave?.({ product_quantity: v });
                        }}
                        min={0}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Minimum Order Qty</label>
                    <input
                        type="number"
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={moq}
                        onChange={(e) => {
                            const v = clampInt(e.target.value, 1);
                            setMoq(v);
                            onSave?.({ minimum_order_quantity: v });
                        }}
                        min={1}
                        placeholder="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={unitMeasure}
                        onChange={(e) => {
                            const v = e.target.value || "pcs";
                            setUnitMeasure(v);
                            onSave?.({ unit_measure: v });
                        }}
                        placeholder="pcs / kg / box"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Unit Value</label>
                    <input
                        type="number"
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={unitMeasureValue}
                        onChange={(e) => {
                            const v = clampInt(e.target.value, 1);
                            setUnitMeasureValue(v);
                            onSave?.({ unit_measure_value: v });
                        }}
                        min={1}
                        placeholder="1"
                    />
                </div>
            </div>

            {/* Wholesale */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-1">
                    <label className="inline-flex items-center gap-2 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={wholesaleActive}
                            onChange={(e) => {
                                setWholesaleActive(e.target.checked);
                                onSave?.({ active_wholesale: e.target.checked });
                            }}
                        />
                        Wholesale Active
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Wholesale Price (major)</label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={wholesaleMajor}
                        onChange={(e) => {
                            setWholesaleMajor(e.target.value);
                            onSave?.({ wholesale_price_major: e.target.value });
                        }}
                        inputMode="decimal"
                        placeholder="0.00"
                        disabled={!wholesaleActive}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Wholesale Currency</label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={wholesaleCurrency}
                        onChange={(e) => {
                            const v = e.target.value.toUpperCase().slice(0, 3);
                            setWholesaleCurrency(v);
                            onSave?.({ wholesale_price_currency: v });
                        }}
                        maxLength={3}
                        placeholder="GHS"
                        disabled={!wholesaleActive}
                    />
                </div>
            </div>
        </div>
    );
}

/* helpers */
function clampInt(val, min) {
    const n = parseInt(val, 10);
    if (Number.isNaN(n)) return min;
    return Math.max(min, n);
}

// Convert ISO string from API → <input type="datetime-local"> value (local, no Z)
function toLocalInputValue(iso) {
    try {
        const d = new Date(iso);
        // yyyy-MM-ddThh:mm
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
        return "";
    }
}

// Convert local input back to ISO (Z). Keep it simple and UTC-normalized.
function fromLocalInputValue(localValue) {
    if (!localValue) return null;
    try {
        const d = new Date(localValue);
        return d.toISOString();
    } catch {
        return null;
    }
}

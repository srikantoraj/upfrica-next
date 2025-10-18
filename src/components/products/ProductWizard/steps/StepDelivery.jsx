// components/products/ProductWizard/steps/StepDelivery.jsx
"use client";
import { useEffect, useState } from "react";

const SPEED_OPTIONS = [
    { value: "", label: "— Select speed —" },
    { value: "same_day", label: "Same day" },
    { value: "next_day", label: "Next day" },
    { value: "2_5", label: "2–5 days" },
    { value: "6_10", label: "6–10 days" },
    { value: "10_plus", label: "10+ days" },
];

export default function StepDelivery({ productId, onSave }) {
    const [loading, setLoading] = useState(true);

    // origins / handling
    const [shippingFrom, setShippingFrom] = useState("");
    const [dispatchDays, setDispatchDays] = useState("");

    // speed & pickup
    const [speed, setSpeed] = useState("");
    const [pickup, setPickup] = useState(false);

    // destinations
    const [shipsToCodesStr, setShipsToCodesStr] = useState("");        // comma input
    const [eligibleZonesStr, setEligibleZonesStr] = useState("");      // comma input

    // fees (major)
    const [postageMajor, setPostageMajor] = useState("");
    const [postageCur, setPostageCur] = useState("GHS");
    const [secondaryPostageMajor, setSecondaryPostageMajor] = useState("");
    const [secondaryPostageCur, setSecondaryPostageCur] = useState("GHS");

    // payment methods
    const [payCOD, setPayCOD] = useState(false);
    const [payCard, setPayCard] = useState(false);
    const [payMomo, setPayMomo] = useState(false);
    const [payBank, setPayBank] = useState(false);

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

                // origins / handling
                setShippingFrom(data?.shipping_from ?? "");
                setDispatchDays(data?.dispatch_time_in_days ?? "");

                // speed & pickup
                setSpeed(data?.delivery_speed_bucket ?? "");
                setPickup(Boolean(data?.pickup_available));

                // destinations
                setShipsToCodesStr((data?.ships_to_codes || []).join(", "));
                setEligibleZonesStr((data?.eligible_zones || []).join(", "));

                // fees (MoneyInMajorMixin exposes *_major)
                setPostageMajor(data?.postage_fee_major ?? "");
                setPostageCur((data?.postage_fee_currency || data?.price_currency || "GHS").toUpperCase());
                setSecondaryPostageMajor(data?.secondary_postage_fee_major ?? "");
                setSecondaryPostageCur(
                    (data?.secondary_postage_fee_currency || data?.price_currency || "GHS").toUpperCase()
                );

                // payment methods
                setPayCOD(Boolean(data?.pay_on_delivery));
                setPayCard(Boolean(data?.pay_card));
                setPayMomo(Boolean(data?.pay_momo));
                setPayBank(Boolean(data?.pay_bank_transfer));
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [productId]);

    if (loading) return <div>Loading…</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Delivery</h1>

            {/* Shipping origin & handling time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Ships from</label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={shippingFrom}
                        onChange={(e) => {
                            setShippingFrom(e.target.value);
                            onSave?.({ shipping_from: e.target.value });
                        }}
                        placeholder="Accra, GH"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Dispatch time (days)</label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={dispatchDays}
                        onChange={(e) => {
                            setDispatchDays(e.target.value);
                            onSave?.({ dispatch_time_in_days: e.target.value });
                        }}
                        placeholder="2"
                    />
                </div>
            </div>

            {/* Speed & pickup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1">Delivery speed</label>
                    <select
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={speed}
                        onChange={(e) => {
                            setSpeed(e.target.value);
                            onSave?.({ delivery_speed_bucket: e.target.value });
                        }}
                    >
                        {SPEED_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <label className="inline-flex items-center gap-2 mt-6">
                    <input
                        type="checkbox"
                        checked={pickup}
                        onChange={(e) => {
                            setPickup(e.target.checked);
                            onSave?.({ pickup_available: e.target.checked });
                        }}
                    />
                    <span className="text-sm font-medium">Pickup available</span>
                </label>
            </div>

            {/* Destinations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Ships to (ISO2 codes, comma-separated)
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={shipsToCodesStr}
                        onChange={(e) => {
                            const v = e.target.value;
                            setShipsToCodesStr(v);
                            onSave?.({ ships_to_codes: parseCsv(v).map(s => s.toUpperCase().slice(0, 2)) });
                        }}
                        placeholder="GH, NG, UK"
                    />
                    <p className="text-xs text-gray-500 mt-1">Example: GH, NG, UK</p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Eligible zones (comma-separated)
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        value={eligibleZonesStr}
                        onChange={(e) => {
                            const v = e.target.value;
                            setEligibleZonesStr(v);
                            onSave?.({ eligible_zones: parseCsv(v) });
                        }}
                        placeholder="GH-ACCRA, GH-KUMASI"
                    />
                </div>
            </div>

            {/* Fees */}
            <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Postage fee (major)</label>
                        <input
                            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                            value={postageMajor}
                            onChange={(e) => {
                                setPostageMajor(e.target.value);
                                onSave?.({ postage_fee_major: e.target.value });
                            }}
                            inputMode="decimal"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Currency</label>
                        <input
                            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                            value={postageCur}
                            onChange={(e) => {
                                const v = e.target.value.toUpperCase().slice(0, 3);
                                setPostageCur(v);
                                onSave?.({ postage_fee_currency: v });
                            }}
                            maxLength={3}
                            placeholder="GHS"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Secondary postage fee (major)</label>
                        <input
                            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                            value={secondaryPostageMajor}
                            onChange={(e) => {
                                setSecondaryPostageMajor(e.target.value);
                                onSave?.({ secondary_postage_fee_major: e.target.value });
                            }}
                            inputMode="decimal"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Currency</label>
                        <input
                            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                            value={secondaryPostageCur}
                            onChange={(e) => {
                                const v = e.target.value.toUpperCase().slice(0, 3);
                                setSecondaryPostageCur(v);
                                onSave?.({ secondary_postage_fee_currency: v });
                            }}
                            maxLength={3}
                            placeholder="GHS"
                        />
                    </div>
                </div>
            </div>

            {/* Payment methods */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={payCOD}
                        onChange={(e) => {
                            setPayCOD(e.target.checked);
                            onSave?.({ pay_on_delivery: e.target.checked });
                        }}
                    />
                    <span className="text-sm">Pay on delivery</span>
                </label>
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={payCard}
                        onChange={(e) => {
                            setPayCard(e.target.checked);
                            onSave?.({ pay_card: e.target.checked });
                        }}
                    />
                    <span className="text-sm">Card</span>
                </label>
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={payMomo}
                        onChange={(e) => {
                            setPayMomo(e.target.checked);
                            onSave?.({ pay_momo: e.target.checked });
                        }}
                    />
                    <span className="text-sm">MoMo</span>
                </label>
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={payBank}
                        onChange={(e) => {
                            setPayBank(e.target.checked);
                            onSave?.({ pay_bank_transfer: e.target.checked });
                        }}
                    />
                    <span className="text-sm">Bank transfer</span>
                </label>
            </div>
        </div>
    );
}

/* helpers */
function parseCsv(s) {
    return (s || "")
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);
}

"use client";

import { useEffect, useRef, useState } from "react";

function useDebouncedCallback(fn, delay) {
    const t = useRef(null);
    return (...args) => {
        if (t.current) clearTimeout(t.current);
        t.current = setTimeout(() => fn(...args), delay);
    };
}

export default function StepPolicies({ productId, onSave }) {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // server snapshot to compare
    const snapshot = useRef(null);
    const hydratedRef = useRef(false);

    // local state
    const [returnsFree, setReturnsFree] = useState(false);
    const [returnDays, setReturnDays] = useState(0);
    const [warrantyMonths, setWarrantyMonths] = useState(0);
    const [cancellable, setCancellable] = useState(false);
    const [paymentTerms, setPaymentTerms] = useState("payment_before_delivery");
    const [policyNotes, setPolicyNotes] = useState("");

    // load once
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

                snapshot.current = {
                    returns_free: !!data?.returns_free,
                    return_days: Number(data?.return_days || 0),
                    warranty_months: Number(data?.warranty_months || 0),
                    cancellable: !!data?.cancellable,
                    seller_payment_terms: data?.seller_payment_terms || "payment_before_delivery",
                    notes: (data?.secondary_data?.policies?.notes || "").toString(),
                };

                setReturnsFree(snapshot.current.returns_free);
                setReturnDays(snapshot.current.return_days);
                setWarrantyMonths(snapshot.current.warranty_months);
                setCancellable(snapshot.current.cancellable);
                setPaymentTerms(snapshot.current.seller_payment_terms);
                setPolicyNotes(snapshot.current.notes);
            } catch (e) {
                if (alive) setErr(e?.message || "Failed to load product");
            } finally {
                if (alive) {
                    setLoading(false);
                    hydratedRef.current = true;
                }
            }
        })();
        return () => { alive = false; };
    }, [productId]);

    const debouncedSave = useDebouncedCallback((patch) => onSave?.(patch), 400);

    // autosave primitive fields (only when changed & after hydration)
    useEffect(() => {
        if (!hydratedRef.current) return;
        const s = snapshot.current || {};
        const patch = {};
        if (returnsFree !== s.returns_free) patch.returns_free = returnsFree;
        if (Number(returnDays) !== Number(s.return_days)) patch.return_days = Number(returnDays || 0);
        if (Number(warrantyMonths) !== Number(s.warranty_months)) patch.warranty_months = Number(warrantyMonths || 0);
        if (cancellable !== s.cancellable) patch.cancellable = cancellable;
        if (paymentTerms !== s.seller_payment_terms) patch.seller_payment_terms = paymentTerms;

        if (Object.keys(patch).length) debouncedSave(patch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [returnsFree, returnDays, warrantyMonths, cancellable, paymentTerms]);

    // autosave notes in secondary_data
    useEffect(() => {
        if (!hydratedRef.current) return;
        const s = snapshot.current || {};
        if ((policyNotes || "") !== (s.notes || "")) {
            debouncedSave({ secondary_data: { policies: { notes: policyNotes || "" } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyNotes]);

    if (loading) return <div>Loading…</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Policies</h2>
            {err && <div className="text-sm text-red-600">{err}</div>}

            <section className="space-y-4">
                <h3 className="text-sm font-medium">Returns</h3>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={returnsFree} onChange={(e) => setReturnsFree(e.target.checked)} />
                    <span className="text-sm">Free returns</span>
                </label>

                <div>
                    <label className="block text-sm font-medium mb-1">Return window (days)</label>
                    <input
                        className="w-32 rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        inputMode="numeric"
                        value={returnDays}
                        onChange={(e) => setReturnDays(e.target.value.replace(/[^\d]/g, ""))}
                        placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">0 = no returns accepted.</p>
                </div>
            </section>

            <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-medium">Warranty</h3>
                <div>
                    <label className="block text-sm font-medium mb-1">Warranty (months)</label>
                    <input
                        className="w-32 rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        inputMode="numeric"
                        value={warrantyMonths}
                        onChange={(e) => setWarrantyMonths(e.target.value.replace(/[^\d]/g, ""))}
                        placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">0 = no warranty.</p>
                </div>
            </section>

            <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-medium">Order cancellation</h3>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={cancellable} onChange={(e) => setCancellable(e.target.checked)} />
                    <span className="text-sm">Allow buyer to cancel before dispatch</span>
                </label>
            </section>

            <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-medium">Payment terms</h3>
                <select
                    className="w-full md:w-80 rounded border px-3 py-2 bg-white dark:bg-gray-900"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                >
                    <option value="payment_before_delivery">Payment before delivery</option>
                    <option value="pay_on_delivery">Pay on delivery</option>
                    <option value="card_or_momo">Card or Mobile Money</option>
                    <option value="bank_transfer">Bank transfer</option>
                </select>
            </section>

            <section className="space-y-2 border-t pt-6">
                <h3 className="text-sm font-medium">Policy notes (public)</h3>
                <textarea
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
                    rows={3}
                    value={policyNotes}
                    onChange={(e) => setPolicyNotes(e.target.value)}
                    placeholder="Any additional return/exchange conditions you want to display."
                />
                <p className="text-xs text-gray-500">Saved to <code>secondary_data.policies.notes</code>.</p>
            </section>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { API_BASE } from "@/app/constants";
import { getCleanToken } from "@/app/lib/getCleanToken";

function authHeaders() {
  const t = getCleanToken();
  return t ? { Authorization: `Token ${t}` } : {};
}

export default function QuickListDrawer({ open, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [pid, setPid] = useState(null);

  // minimal fields
  const [title, setTitle] = useState("");
  const [priceMajor, setPriceMajor] = useState("");
  const [qty, setQty] = useState(1);
  const [conditionId, setConditionId] = useState(""); // numeric
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!open) return;
    // reset
    setStep(0);
    setBusy(false);
    setToast("");
    setPid(null);
    setTitle("");
    setPriceMajor("");
    setQty(1);
    setConditionId("");
    setFiles([]);
  }, [open]);

  const ensureDraft = async () => {
    if (pid) return pid;
    const p = await api(`${API_BASE}/products/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ title: title || "Untitled product" }),
    });
    setPid(p.id);
    return p.id;
  };

  const handleUpload = async (productId) => {
    if (!files.length) return;
    for (const f of files) {
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
        body: JSON.stringify({ product: productId, image_url: presign.public_url }),
      });
    }
  };

  const saveDraft = async () => {
    try {
      setBusy(true);
      const productId = await ensureDraft();
      // Patch core fields
      await api(`${API_BASE}/products/${productId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          title,
          price_major: priceMajor || "0",
          product_quantity: Number(qty) || 0,
          ...(conditionId ? { condition_id: Number(conditionId) } : {}),
          status: 0, // explicit draft
        }),
      });
      await handleUpload(productId);
      setToast("Draft saved");
      onDone?.(productId); // parent can redirect to full editor
    } catch (e) {
      setToast(e?.detail || e?.message || "Save failed");
    } finally {
      setBusy(false);
      setTimeout(() => setToast(""), 1500);
    }
  };

  const publishNow = async () => {
    try {
      setBusy(true);
      const productId = await ensureDraft();
      await api(`${API_BASE}/products/${productId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          title,
          price_major: priceMajor || "0",
          product_quantity: Number(qty) || 0,
          ...(conditionId ? { condition_id: Number(conditionId) } : {}),
          status: 1, // publish
        }),
      });
      await handleUpload(productId);
      setToast("Published");
      onDone?.(productId);
    } catch (e) {
      setToast(e?.detail || e?.message || "Publish failed");
    } finally {
      setBusy(false);
      setTimeout(() => setToast(""), 1500);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-xl p-5 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Quick List</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-zinc-100">
            <X />
          </button>
        </div>

        <ol className="flex items-center gap-2 text-sm mb-4">
          {["Details", "Photos", "Price", "Confirm"].map((label, i) => (
            <li key={label} className={`px-2 py-1 rounded ${i === step ? "bg-zinc-900 text-white" : "bg-zinc-100"}`}>{label}</li>
          ))}
        </ol>

        {step === 0 && (
          <div className="space-y-3">
            <Field label="Title">
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Eco-Friendly Water Bottle" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Condition ID">
                <input className="input" value={conditionId} onChange={(e) => setConditionId(e.target.value)} placeholder="e.g. 1" />
              </Field>
              <Field label="Quantity">
                <input className="input" type="number" min={0} value={qty} onChange={(e) => setQty(e.target.value)} />
              </Field>
            </div>
            <div className="flex justify-end">
              <button className="btn-primary" onClick={() => setStep(1)}>Next</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="border border-dashed rounded-xl p-6 text-center">
              <input id="ql-files" type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
              <label htmlFor="ql-files" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white cursor-pointer">
                <Upload size={18} /> Upload images
              </label>
              {!!files.length && <div className="mt-2 text-sm text-zinc-600">{files.length} file(s) selected</div>}
            </div>
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setStep(0)}>Back</button>
              <button className="btn-primary" onClick={() => setStep(2)}>Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Field label="Price (major)">
              <input className="input" inputMode="decimal" value={priceMajor} onChange={(e) => setPriceMajor(e.target.value)} placeholder="e.g. 25.00" />
            </Field>
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-zinc-50 p-3 text-sm">
              <div><strong>Title:</strong> {title || "—"}</div>
              <div><strong>Price:</strong> {priceMajor || "—"}</div>
              <div><strong>Qty:</strong> {qty}</div>
              <div><strong>Condition ID:</strong> {conditionId || "—"}</div>
              <div><strong>Photos:</strong> {files.length}</div>
            </div>
            <div className="flex items-center gap-3">
              <button disabled={busy} className="btn-secondary" onClick={saveDraft}>
                {busy ? <Loader2 className="animate-spin" /> : "Publish Draft"}
              </button>
              <button disabled={busy} className="btn-primary" onClick={publishNow}>
                {busy ? <Loader2 className="animate-spin" /> : "Publish now"}
              </button>
            </div>
          </div>
        )}

        {!!toast && <div className="mt-4 text-sm text-zinc-700">{toast}</div>}

        <style jsx>{`
          .input { @apply w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-zinc-900; }
          .btn-primary { @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white; }
          .btn-secondary { @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg border; }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-zinc-700">{label}</div>
      {children}
    </label>
  );
}
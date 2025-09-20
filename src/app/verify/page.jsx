//src/app/verify/page.jsx
"use client";

import { useRef, useState } from "react";

export default function VerifyIdPage() {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setResult(null);

    const fd = new FormData();
    fd.append("card_image", file);

    try {
      const res = await fetch("/api/verify-id/", { method: "POST", body: fd });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: err?.message || "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Verify your ID</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Upload a clear photo of your Ghana Card to enable BNPL and other features.
      </p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border p-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full rounded-lg border p-2"
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!file || submitting}
            className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-white disabled:opacity-40"
          >
            {submitting ? "Verifying…" : "Verify"}
          </button>
          <button type="button" onClick={reset} className="rounded-xl border px-4 py-2">
            Reset
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 rounded-2xl border p-4">
          {result.verified ? (
            <div className="space-y-1">
              <p className="text-green-600 font-medium">✅ ID verified</p>
              <p className="text-sm">
                {result.firstName} {result.middleName} {result.surname}
              </p>
              <p className="text-sm">ID: {result.idNumber}</p>
              <p className="text-sm">DOB: {result.dob}</p>
              {result.message && <p className="text-sm text-neutral-500">{result.message}</p>}
            </div>
          ) : (
            <p className="text-red-600">❌ {result.error || result.detail || "Verification failed"}</p>
          )}
        </div>
      )}
    </div>
  );
}
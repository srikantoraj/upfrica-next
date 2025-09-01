"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

const normalize = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((f) => ({
      id: f.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      question: String(f?.question ?? "").trim(),
      answer: String(f?.answer ?? "").trim(),
    }))
    .filter((f) => f.question && f.answer);

export default function FAQsEditor({ slug: slugProp }) {
  const [slug, setSlug] = useState(slugProp || "");
  const [faqs, setFaqs] = useState([{ id: "tmp-1", question: "", answer: "" }]);
  const [baseline, setBaseline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const [locked, setLocked] = useState(false);

  // derive dirty flag
  const dirty = useMemo(
    () => JSON.stringify(normalize(faqs)) !== JSON.stringify(normalize(baseline)),
    [faqs, baseline]
  );

  // resolve slug if not provided
  useEffect(() => {
    if (slugProp) return;
    const token = getCleanToken();
    if (!token) return;
    (async () => {
      try {
        const r = await fetch(`${BASE_API_URL}/api/shops/me/`, {
          headers: { Authorization: `Token ${token}` },
          cache: "no-store",
        });
        if (r.ok) {
          const data = await r.json();
          setSlug(data.slug);
        }
      } catch {}
    })();
  }, [slugProp]);

  const fetchFaqs = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `${BASE_API_URL}/api/shops/${encodeURIComponent(slug)}/faqs/?_=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!r.ok) throw new Error(`Failed to load (HTTP ${r.status})`);
      const data = await r.json();
      const clean = normalize(data.faqs);
      setFaqs(clean.length ? clean : [{ id: "tmp-1", question: "", answer: "" }]);
      setBaseline(clean);
    } catch (e) {
      setError(e.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const addFaq = () =>
    setFaqs((list) => [...list, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), question: "", answer: "" }]);

  const removeFaq = (id) =>
    setFaqs((list) => (list.length > 1 ? list.filter((f) => f.id !== id) : list));

  const updateFaq = (id, patch) =>
    setFaqs((list) => list.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const handleSave = async () => {
    if (!slug || saving) return;
    setSaving(true);
    setError(null);
    setLocked(false);
    const token = getCleanToken();
    try {
      const r = await fetch(`${BASE_API_URL}/api/shops/${encodeURIComponent(slug)}/faqs/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify({ faqs: normalize(faqs) }),
      });

      if (r.status === 401) throw new Error("Please sign in again.");
      if (r.status === 403) {
        setLocked(true);
        throw new Error("Your plan doesn’t include FAQ editing.");
      }
      if (!r.ok) throw new Error(`Save failed (HTTP ${r.status})`);

      // 1) optimistic: set from response
      const data = await r.json();
      const clean = normalize(data.faqs);
      setFaqs(clean.length ? clean : [{ id: "tmp-1", question: "", answer: "" }]);
      setBaseline(clean);
      setSavedAt(new Date());

      // 2) confirm by refetch (ensures we’re showing what backend will render)
      await fetchFaqs();
    } catch (e) {
      setError(e.message || "Failed to save FAQs");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-1">FAQs</h2>
      <p className="text-sm text-gray-500 mb-4">
        Add question–answer pairs that help customers and improve your shop SEO.
      </p>

      {locked && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          FAQ editing is locked for your plan. Upgrade to enable it.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-6">
        {loading ? (
          <div className="text-gray-500">Loading FAQs…</div>
        ) : (
          faqs.map((f) => (
            <div key={f.id} className="space-y-2">
              <label className="block text-sm font-medium">Question</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={f.question}
                onChange={(e) => updateFaq(f.id, { question: e.target.value })}
                placeholder="e.g., Do you give any discounts?"
              />
              <label className="block text-sm font-medium mt-2">Answer</label>
              <textarea
                className="w-full rounded-md border px-3 py-2 min-h-[110px]"
                value={f.answer}
                onChange={(e) => updateFaq(f.id, { answer: e.target.value })}
                placeholder="Your short, helpful answer…"
              />
              <button
                type="button"
                onClick={() => removeFaq(f.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
              <hr className="my-4" />
            </div>
          ))
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={addFaq}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add FAQ
          </button>

          <div className="flex items-center gap-3">
            {savedAt && !dirty && (
              <span className="text-sm text-green-600">Saved {savedAt.toLocaleTimeString()}</span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty || locked}
              className={`px-4 py-2 rounded-md text-white ${
                saving || !dirty || locked ? "bg-violet-400" : "bg-violet-700 hover:bg-violet-800"
              }`}
            >
              {saving ? "Saving…" : "Save FAQs"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
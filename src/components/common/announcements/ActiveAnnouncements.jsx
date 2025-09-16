//src/components/common/announcements/ActiveAnnouncements.jsx
"use client";
import { useEffect, useState } from "react";

export default function ActiveAnnouncements() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/announcements/active/", { credentials: "include" });
        if (!res.ok) return;
        const list = await res.json();
        if (!alive) return;
        // client dedupe by localStorage “dismissed:dedupe_key”
        const filtered = (Array.isArray(list) ? list : []).filter(a => {
          const k = `ann.dismissed.${a.dedupe_key || a.id}`;
          return !localStorage.getItem(k);
        });
        setItems(filtered);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  if (!items.length) return null;

  return (
    <div className="space-y-2 mb-3">
      {items.map(a => (
        <Banner key={a.id} a={a} />
      ))}
    </div>
  );
}

function Banner({ a }) {
  const k = `ann.dismissed.${a.dedupe_key || a.id}`;
  const dismiss = async () => {
    try {
      await fetch("/api/announcements/ack/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, action: "dismiss" }),
      });
    } catch {}
    localStorage.setItem(k, "1");
    document.dispatchEvent(new CustomEvent("announcements:update")); // optional
  };

  // Only implement “banner” quickly; you can extend to toast/modal later.
  if (!(a.channels || []).includes("banner")) return null;

  return (
    <div className="rounded-lg border px-3 py-2 bg-gradient-to-r from-amber-50 to-sky-50 dark:from-neutral-800 dark:to-neutral-800 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium">{a.title}</div>
          {!!a.body_text && <div className="opacity-80">{a.body_text}</div>}
        </div>
        <button onClick={dismiss} className="text-xs px-2 py-1 rounded border hover:bg-white/60 dark:hover:bg-neutral-700">Dismiss</button>
      </div>
      {!!a.ctas?.length && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {a.ctas.map(c => (
            <a key={c.id} href={c.url} className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:opacity-90">{c.label}</a>
          ))}
        </div>
      )}
    </div>
  );
}
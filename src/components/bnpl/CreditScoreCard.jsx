// src/components/bnpl/CreditScoreCard.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function Ring({ value = 0, size = 84, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  const off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} className="shrink-0" aria-label={`Credit score ${pct}`}>
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-gray-200 dark:stroke-gray-700" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        className="fill-none stroke-purple-600 dark:stroke-purple-400 transition-all duration-500"
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CreditScoreCard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      const tryUrls = ["/api/credit/score/", "/api/credit/score/current/"];
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { cache: "no-store", credentials: "omit" });
          if (res.ok) {
            const json = await res.json();
            if (!cancelled) setData(json);
            break;
          } else {
            // capture detail if present; continue to next url
            let d = null;
            try { d = await res.json(); } catch {}
            setErr(d?.detail || res.statusText);
          }
        } catch (e) {
          setErr(e?.message || "Network error");
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const bandColor = useMemo(() => {
    const lvl = (data?.level || "").toLowerCase();
    if (["excellent", "very good", "great"].includes(lvl)) return "text-emerald-600 dark:text-emerald-400";
    if (["good", "fair"].includes(lvl)) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  }, [data?.level]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-sm transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">BNPL Credit</h3>
        <Link href="/bnpl/orders" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          View BNPL →
        </Link>
      </div>

      {loading && <div className="text-sm text-gray-500 dark:text-gray-400">Checking your score…</div>}

      {!loading && err && !data && (
        <div className="text-sm text-rose-600 dark:text-rose-400">
          Couldn’t load score{err ? `: ${err}` : ""}.
        </div>
      )}

      {data && (
        <div className="flex items-center gap-4">
          <Ring value={Number(data.score || 0)} />
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{data.score ?? 0}</div>
            <div className={`text-sm font-medium ${bandColor}`}>{data.level || "—"}</div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {data.has_verified_id ? "ID verified" : "ID not verified"}
              {data.updated_at && (
                <span className="ml-2 opacity-80">• Updated {new Date(data.updated_at).toLocaleDateString()}</span>
              )}
            </div>

            {!data.has_verified_id && (
              <Link
                href="/verify"
                className="mt-3 inline-flex items-center rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
              >
                Verify your ID
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Improve your score by keeping payments on time and verifying your ID.
      </div>
    </div>
  );
}
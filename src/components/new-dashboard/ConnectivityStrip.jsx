// src/components/new-dashboard/ConnectivityStrip.jsx
"use client";

import React, { useEffect, useState } from "react";
import { dashboardHealth } from "@/lib/dashbord/health";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

const Pill = ({ level, label, ms, hint }) => {
  const base = "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm border transition";
  const theme =
    level === "ok"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800"
      : level === "warn"
      ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800"
      : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-800";

  return (
    <div className={[base, theme].join(" ")} title={hint}>
      {level === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      <span className="font-medium">{label}</span>
      <span className="opacity-70">• {ms}ms</span>
    </div>
  );
};

const deriveLevel = (v) => {
  if (v?.level) return v.level;
  if (v?.ok) return "ok";
  if (v?.status === 401 || v?.status === 403) return "warn";
  return "err";
};

export default function ConnectivityStrip() {
  // Show only in dev or when ?debug=1 is present
  const isDev =
    typeof window !== "undefined" &&
    (process.env.NODE_ENV !== "production" ||
      new URLSearchParams(window.location.search).has("debug"));

  const [state, setState] = useState({ loading: true, data: null });

  useEffect(() => {
    if (!isDev) return;
    let cancelled = false;

    const run = async () => {
      setState((s) => ({ ...s, loading: true }));
      try {
        const r = await dashboardHealth(); // cookie-based auth; no token needed
        if (!cancelled) setState({ loading: false, data: r });
      } catch (e) {
        if (!cancelled) {
          setState({
            loading: false,
            data: {
              result: {
                tasks:   { level: "err", ms: 0, error: String(e) },
                finance: { level: "err", ms: 0, error: String(e) },
              },
            },
          });
        }
      }
    };

    // small delay so other requests can mint session cookies
    const id = setTimeout(run, 150);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [isDev]);

  if (!isDev) return null;

  return (
    <div className="mb-4">
      <div className="rounded-xl p-3 border bg-white/70 dark:bg-[#0b1220]/70 backdrop-blur border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Dashboard connectivity
          </div>
          {state.loading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" /> Checking…
            </div>
          )}
        </div>

        {!state.loading && state.data && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(state.data.result).map(([k, v]) => {
              const level = deriveLevel(v);
              const hintParts = [];
              if (v.status != null) hintParts.push(`HTTP ${v.status}`);
              if (v.proxySource) hintParts.push(`via ${v.proxySource}`);
              if (v.error) hintParts.push(v.error);
              const hint = hintParts.join(" · ") || "OK";
              return <Pill key={k} level={level} label={k} ms={v.ms ?? 0} hint={hint} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
//src/components/new-dashboard/DashboardTasks.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardTasks() {
  const { hydrated, token } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!hydrated) return; // wait for auth context to be ready

    (async () => {
      try {
        const headers = new Headers({ Accept: "application/json" });
        if (token) headers.set("Authorization", `Token ${token}`);

        const res = await fetch("/api/dashboard/tasks/", {
          credentials: "include",
          headers,
          cache: "no-store",
        });

        // helpful while debugging
        const dbg = {
          status: res.status,
          proxyAuth: res.headers.get("x-up-proxy-auth"),
          proxySource: res.headers.get("x-up-proxy-auth-source"),
          target: res.headers.get("x-up-proxy-target"),
        };

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`Tasks ${dbg.status} (${dbg.proxySource}) ${msg || ""}`);
        }

        const json = await res.json();
        if (!cancelled) setTasks(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load tasks");
      }
    })();

    return () => { cancelled = true; };
  }, [hydrated, token]);

  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!tasks) return <p className="text-sm text-neutral-500">Loading tasks…</p>;

  return (
    <div className="rounded-2xl border p-4">
      <h2 className="mb-3 text-lg font-semibold">Getting started</h2>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.label} className="flex items-center justify-between">
            <a href={t.href} className="flex items-center gap-2 hover:underline">
              <span className={`inline-block h-5 w-5 rounded-full ${t.completed ? "bg-green-600" : "bg-neutral-300"}`} />
              <span>{t.label}</span>
            </a>
            <span className={`text-xs ${t.completed ? "text-green-700" : "text-neutral-500"}`}>
              {t.completed ? "Done" : "Start"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
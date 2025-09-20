// src/components/DashboardTasks.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { waitForAuthReady } from "@/lib/auth/waitForAuthReady";

export default function DashboardTasks() {
  const { hydrated, token } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setError(null);

      // wait for auth cookie so the proxy can mint Authorization
      if (!(await waitForAuthReady())) {
        // still try, but expect a 401/403 on first paint if user not logged in
      }

      const doFetch = async () => {
        const res = await fetch("/api/dashboard/tasks/", { credentials: "include", cache: "no-store" });
        if (res.status === 401 || res.status === 403) return { authFail: true };
        const json = await res.json();
        return { json };
      };

      let { authFail, json } = await doFetch();

      // single retry if auth raced the first call
      if (authFail) {
        const ok = await waitForAuthReady({ timeout: 1200, interval: 100 });
        if (ok) ({ authFail, json } = await doFetch());
      }

      if (cancelled) return;

      if (authFail) {
        setError("Login required");
        setTasks([]);
      } else {
        setTasks(json);
      }
    };

    if (hydrated) run();
    return () => { cancelled = true; };
  }, [hydrated, token]); // re-run once token arrives

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
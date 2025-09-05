// src/lib/api.js
import { getCleanToken } from "@/lib/getCleanToken";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

// Low-level request
export async function api(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const token = getCleanToken();

  // Let caller pass either JSON or FormData.
  // If body is FormData, DO NOT set content-type – the browser will.
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;

  const headers = {
    ...(opts.headers || {}),
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };

  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    let msg = `API ${res.status} ${url}`;
    try {
      const err = await res.json();
      if (err?.detail) msg = err.detail;
    } catch {}
    throw new Error(msg);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// Convenience helpers
export async function apiJSON(path, data, opts = {}) {
  return api(path, { ...opts, method: opts.method || "POST", body: JSON.stringify(data) });
}

export async function apiForm(path, formData, opts = {}) {
  return api(path, { ...opts, method: opts.method || "POST", body: formData });
}
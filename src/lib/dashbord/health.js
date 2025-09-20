// src/lib/dashbord/health.js
// src/lib/dashbord/health.js
const JSON_OK = (res) =>
  res.ok && (res.headers.get("content-type") || "").includes("application/json");

const withSlash = (p) => (p.endsWith("/") ? p : `${p}/`);

async function fetchJson(path, headers) {
  const t0 = performance.now();
  const res = await fetch(withSlash(path), {
    method: "GET",
    cache: "no-store",
    credentials: "include",        // ← include cookies
    headers,                        // ← optional Authorization
  });
  const t1 = performance.now();

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return {
    ok: JSON_OK(res),
    status: res.status,
    ms: Math.round(t1 - t0),
    data,
    error: !res.ok ? data?.detail || res.statusText : null,
  };
}

function hasAny(obj, keys) {
  if (!obj || typeof obj !== "object") return false;
  return keys.some((k) => Object.prototype.hasOwnProperty.call(obj, k));
}

export async function dashboardHealth(token) {
  const authHeaders = token ? { Authorization: `Token ${token}` } : undefined;

  const checks = {
    tasks:   { path: "/api/dashboard/tasks/",   expect: (d) => Array.isArray(d) },
    finance: {
      path: "/api/dashboard/finance/",
      expect: (d) =>
        hasAny(d, ["wallet", "wallet_balance", "balance"]) ||
        hasAny(d, ["credit", "credit_score", "score"]) ||
        hasAny(d, ["bnpl", "bnpl_summary", "upcoming_payments", "outstanding"]) ||
        hasAny(d, ["payout_validated", "kyc_verified"]),
    },
  };

  const entries = await Promise.all(
    Object.entries(checks).map(async ([key, cfg]) => {
      const r = await fetchJson(cfg.path, authHeaders);
      const valid = r.ok && (cfg.expect ? cfg.expect(r.data) : true);
      return [key, { ...r, valid }];
    })
  );

  const result = Object.fromEntries(entries);
  const ok = Object.values(result).every((v) => v.valid);
  return { ok, result };
}
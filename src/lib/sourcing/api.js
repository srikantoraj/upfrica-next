// src/lib/sourcing/api.js
import axios from "@/lib/axiosInstance";

const BASE = "/api/sourcing";

const ok = (s) => s >= 200 && s < 300;
const authErr = (s) => s === 401 || s === 403;
const emptyPage = () => ({ count: 0, next: null, previous: null, results: [] });

export class AuthRequiredError extends Error {
  constructor(status, detail = "Login required") {
    super(detail);
    this.name = "AuthRequiredError";
    this.code = "AUTH_REQUIRED";
    this.status = status;
  }
}
export const isAuthRequired = (e) =>
  e?.code === "AUTH_REQUIRED" ||
  e instanceof AuthRequiredError ||
  authErr(e?.status) ||
  authErr(e?.response?.status);

function normalizeCc(cc) {
  return cc == null ? "" : String(cc).trim().toLowerCase();
}
function withCountry(params = {}) {
  const { country, deliver_to_country, ...rest } = params || {};
  const cc = normalizeCc(country ?? deliver_to_country);
  return cc ? { ...rest, deliver_to_country: cc } : rest;
}

/* ---------------- guest-safe GET helpers ---------------- */
async function safeGetPaginated(url, config) {
  const res = await axios.get(url, {
    withCredentials: true,
    validateStatus: () => true,
    ...config,
  });
  if (ok(res.status)) return res.data;
  if (authErr(res.status)) return emptyPage();
  if (res.status === 404) return emptyPage(); // ← treat “not found” as end of list
  throw new Error(res?.data?.detail || res.statusText || "Request failed");
}
async function safeGetOne(url, config) {
  const res = await axios.get(url, {
    withCredentials: true,
    validateStatus: () => true,
    ...config,
  });
  if (ok(res.status)) return res.data;
  if (authErr(res.status)) return null;
  if (res.status === 404) return null;
  throw new Error(res?.data?.detail || res.statusText || "Request failed");
}

/* ----------------------------- Requests ----------------------------- */
export async function createRequest(payload) {
  const res = await axios.post(`${BASE}/requests/`, payload, {
    withCredentials: true,
    validateStatus: () => true,
  });
  if (ok(res.status)) return res.data;
  if (authErr(res.status)) throw new AuthRequiredError(res.status, res?.data?.detail);
  throw new Error(res?.data?.detail || "Could not create request");
}

export async function listRequests(params = {}) {
  const { page = 1, pageSize = 50, ordering = "-created_at", ...rest } = params;
  return safeGetPaginated(`${BASE}/requests/`, {
    params: { page, page_size: pageSize, ordering, ...withCountry(rest) },
  });
}

export async function listOpenRequests(params = {}) {
  const {
    page = 1,
    page_size = 12,
    pageSize,
    ordering = "-created_at",
    ...rest
  } = params;
  return safeGetPaginated(`${BASE}/requests/`, {
    params: {
      status: "open",
      page,
      page_size: pageSize ?? page_size ?? 12,
      ordering,
      ...withCountry(rest),
    },
  });
}

/**
 * Public, guest-safe list of open requests (no auth cookies).
 * Uses the unified /api proxy and forces ?public=1.
 */
export async function listPublicOpenRequests(params = {}) {
  const {
    page = 1,
    page_size = 12,
    pageSize,
    ordering = "-created_at",
    ...rest
  } = params;

  const normalized = { ...withCountry(rest) };

  const search = new URLSearchParams({
    status: "open",
    public: "1",
    page: String(page),
    page_size: String(pageSize ?? page_size ?? 12),
    ordering,
    ...normalized,
  });

  const url = `${BASE}/requests/?${search.toString()}`;
  const res = await fetch(url, {
    cache: "no-store",
    credentials: "omit",
    headers: { Accept: "application/json" },
  });

  if (res.status === 401 || res.status === 403) return emptyPage();
  if (res.status === 404) return emptyPage(); // ← stop error banner / loops
  if (!res.ok) throw new Error(`public requests failed: ${res.status}`);
  return res.json();
}

export async function myRequests(params = {}) {
  return listRequests(params);
}

export async function getRequest(id) {
  return safeGetOne(`${BASE}/requests/${encodeURIComponent(id)}/`);
}



/* ------------------------------ Offers ------------------------------ */
export async function createOffer(payload) {
  const res = await axios.post(`${BASE}/offers/`, payload, {
    withCredentials: true,
    validateStatus: () => true,
  });
  if (ok(res.status)) return res.data;
  if (authErr(res.status)) throw new AuthRequiredError(res.status, res?.data?.detail);
  throw new Error(res?.data?.detail || "Could not create offer");
}

export async function listOffers(params = {}) {
  const { page = 1, pageSize = 50, ordering = "-created_at", ...rest } = params;
  return safeGetPaginated(`${BASE}/offers/`, {
    params: { page, page_size: pageSize, ordering, ...rest },
  });
}

/** 🔹 Fetch a single offer (guest-safe: returns null on 401/403) */
export async function getOffer(offerId) {
  return safeGetOne(`${BASE}/offers/${encodeURIComponent(offerId)}/`);
}

/** 🔹 PATCH update (partial) an existing offer */
export async function updateOffer(offerId, payload) {
  const res = await axios.patch(
    `${BASE}/offers/${encodeURIComponent(offerId)}/`,
    payload,
    { withCredentials: true, validateStatus: () => true }
  );
  if (ok(res.status)) return res.data;
  if (authErr(res.status)) throw new AuthRequiredError(res.status, res?.data?.detail);
  throw new Error(res?.data?.detail || "Could not update offer");
}

/** (Optional) PUT replace if you ever want full updates */
export async function replaceOffer(offerId, payload) {
  const res = await axios.put(
    `${BASE}/offers/${encodeURIComponent(offerId)}/`,
    payload,
    { withCredentials: true, validateStatus: () => true }
  );
  if (ok(res.status)) return res.data;
  if (authErr(res.status)) throw new AuthRequiredError(res.status, res?.data?.detail);
  throw new Error(res?.data?.detail || "Could not replace offer");
}

export async function acceptOffer(offerId) {
  const res = await axios.post(
    `${BASE}/offers/${encodeURIComponent(offerId)}/accept/`,
    null,
    { withCredentials: true, validateStatus: () => true }
  );

  if (ok(res.status)) return res.data;
  if (authErr(res.status)) throw new AuthRequiredError(res.status, res?.data?.detail);

  if (res.status === 404 || res.status === 405) {
    const legacy = await axios.post(
      `${BASE}/orders/`,
      { offer: offerId },
      { withCredentials: true }
    );
    return legacy.data;
  }
  throw new Error(res?.data?.detail || "Could not accept offer");
}

export async function withdrawOffer(offerId) {
  const res = await axios.post(
    `${BASE}/offers/${encodeURIComponent(offerId)}/withdraw/`,
    null,
    { withCredentials: true, validateStatus: () => true }
  );
  if (ok(res.status)) return res.data;
  if (authErr(res.status)) throw new AuthRequiredError(res.status, res?.data?.detail);
  throw new Error(res?.data?.detail || "Could not withdraw offer");
}

/* ------------------------------- Orders ------------------------------ */
export async function listMySourcingOrders(params = {}) {
  const { page = 1, pageSize = 50, ordering = "-created_at", ...rest } = params;
  return safeGetPaginated(`${BASE}/orders/`, {
    params: { page, page_size: pageSize, ordering, ...rest },
  });
}

/* ------------------------------- Config ------------------------------ */
export async function getConfig() {
  try {
    const { data } = await axios.get(`${BASE}/config/`, { withCredentials: true });
    return data;
  } catch {
    return null;
  }
}
// src/app/api/products.js
import axiosInstance from "@/lib/axiosInstance";

// small helper to unwrap axios responses
const unwrap = (p) => p.then((r) => r.data);

/* -------- helpers: read cookies -> headers -------- */
function readCookie(name) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`)
  );
  return m ? decodeURIComponent(m[1]) : "";
}

function uiHeaders() {
  // set by LocalizationProvider.jsx
  const ccy = readCookie("upfrica_currency"); // e.g., "GHS"
  const cc  = readCookie("deliver_cc");       // e.g., "gh"
  const headers = {};
  if (ccy) headers["X-UI-Currency"] = ccy.toUpperCase();
  if (cc)  headers["X-Deliver-CC"]  = cc.toLowerCase();
  return headers;
}

function withUi(config = {}) {
  const add = uiHeaders();
  return { ...config, headers: { ...(config.headers || {}), ...add } };
}

/* ---------------- Products (CRUD/list) ---------------- */
export const listMyProducts = (params = {}) =>
  unwrap(axiosInstance.get("/api/products/mine/", withUi({ params })));

export const createProduct = (payload) =>
  unwrap(axiosInstance.post("/api/products/", payload, withUi()));

/** Prefer PATCH for partial updates. Use replaceProduct() for full PUT. */
export const updateProduct = (id, payload) =>
  unwrap(axiosInstance.patch(`/api/products/${id}/`, payload, withUi()));

export const replaceProduct = (id, payload) =>
  unwrap(axiosInstance.put(`/api/products/${id}/`, payload, withUi()));

export const getProductBySlug = (country, slug) =>
  // backend accepts without trailing slash; proxy will normalize
  unwrap(axiosInstance.get(`/api/${country}/${slug}`, withUi()));

/* ---------------- Product images ---------------- */
export const uploadProductImages = (productId, files /* File | File[] */) => {
  const form = new FormData();
  (Array.isArray(files) ? files : [files]).forEach((f) => form.append("image", f)); // DRF: multiple "image" fields
  form.append("product", String(productId));
  return unwrap(axiosInstance.post("/api/product-images/", form, withUi()));
};

/* ---------------- Properties ---------------- */
export const bulkSetProperties = (productId, items /* [{label,value}] */) =>
  unwrap(
    axiosInstance.post(`/api/products/${productId}/properties/bulk/`, items, withUi())
  );

/* helpful for autosuggest UI */
export const suggestProperties = (q) =>
  unwrap(
    axiosInstance.get("/api/properties/suggest/", withUi({ params: { search: q } }))
  );

/* ---------------- Variants (if used) ---------------- */
export const listCreateVariants = (params = {}) =>
  unwrap(axiosInstance.get("/api/variants/", withUi({ params })));

export const listCreateVariantValues = (params = {}) =>
  unwrap(axiosInstance.get("/api/variant-values/", withUi({ params })));

/* ---------------- Reviews & related ---------------- */
export const productReviewsById = (productId) =>
  unwrap(axiosInstance.get(`/api/products/${productId}/reviews/`, withUi()));

export const productReviewsBySlug = (country, slug) =>
  unwrap(axiosInstance.get(`/api/${country}/${slug}/reviews/`, withUi()));

export const relatedProducts = (country, slug) =>
  unwrap(axiosInstance.get(`/api/${country}/${slug}/related/`, withUi()));

/* ---------------- Events (contact click etc.) ---------------- */
export const productEvent = (slug, data) =>
  unwrap(axiosInstance.post(`/api/products/${slug}/event/`, data, withUi()));
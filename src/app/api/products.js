// src/app/api/products.js
import axiosInstance from "@/lib/axiosInstance";

// small helper to unwrap axios responses
const unwrap = (p) => p.then((r) => r.data);

// --- Products (CRUD/list) ---
export const listMyProducts = (params = {}) =>
  unwrap(axiosInstance.get("/api/products/mine/", { params }));

export const createProduct = (payload) =>
  unwrap(axiosInstance.post("/api/products/", payload));

/** Prefer PATCH for partial updates. Use replaceProduct() for full PUT. */
export const updateProduct = (id, payload) =>
  unwrap(axiosInstance.patch(`/api/products/${id}/`, payload));

export const replaceProduct = (id, payload) =>
  unwrap(axiosInstance.put(`/api/products/${id}/`, payload));

export const getProductBySlug = (country, slug) =>
  unwrap(axiosInstance.get(`/api/${country}/${slug}`)); // backend accepts without trailing slash

// --- Product images ---
export const uploadProductImages = (productId, files /* File | File[] */) => {
  const form = new FormData();
  (Array.isArray(files) ? files : [files]).forEach((f) =>
    form.append("image", f) // DRF: multiple "image" fields
  );
  form.append("product", String(productId));
  return unwrap(axiosInstance.post("/api/product-images/", form));
};

// --- Properties ---
export const bulkSetProperties = (productId, items /* [{label,value}] */) =>
  unwrap(
    axiosInstance.post(`/api/products/${productId}/properties/bulk/`, items)
  );

// helpful for autosuggest UI
export const suggestProperties = (q) =>
  unwrap(
    axiosInstance.get("/api/properties/suggest/", {
      params: { search: q },
    })
  );

// --- Variants (if used) ---
export const listCreateVariants = (params = {}) =>
  unwrap(axiosInstance.get("/api/variants/", { params }));

export const listCreateVariantValues = (params = {}) =>
  unwrap(axiosInstance.get("/api/variant-values/", { params }));

// --- Reviews & related ---
export const productReviewsById = (productId) =>
  unwrap(axiosInstance.get(`/api/products/${productId}/reviews/`));

export const productReviewsBySlug = (country, slug) =>
  unwrap(axiosInstance.get(`/api/${country}/${slug}/reviews/`));

export const relatedProducts = (country, slug) =>
  unwrap(axiosInstance.get(`/api/${country}/${slug}/related/`));

// --- Events (contact click etc.) ---
export const productEvent = (slug, data) =>
  unwrap(axiosInstance.post(`/api/products/${slug}/event/`, data));
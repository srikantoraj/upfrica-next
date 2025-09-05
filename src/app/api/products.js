// src/app/api/products.js
import { API_BASE } from "@/app/constants";
import { api, apiJSON, apiForm } from "@/lib/api";

// --- Products (CRUD/list) ---
export const listMyProducts = (qs = "") =>
  api(`${API_BASE}/products/mine/${qs}`);

export const createProduct = (payload) =>
  apiJSON(`${API_BASE}/products/`, payload, { method: "POST" });

export const updateProduct = (id, payload) =>
  apiJSON(`${API_BASE}/products/${id}/`, payload, { method: "PUT" });

export const getProductBySlug = (country, slug) =>
  api(`${API_BASE}/${country}/${slug}`);

// --- Product images ---
export const uploadProductImages = (productId, files /* File | File[] */) => {
  const form = new FormData();
  const arr = Array.isArray(files) ? files : [files];
  arr.forEach((f) => form.append("image", f)); // DRF parses multiple "image"
  form.append("product", String(productId));
  return apiForm(`${API_BASE}/product-images/`, form);
};

// --- Properties ---
export const bulkSetProperties = (productId, items /* [{label,value}] */) =>
  apiJSON(`${API_BASE}/products/${productId}/properties/bulk/`, items, { method: "POST" });

export const suggestProperties = (q) =>
  api(`${API_BASE}/properties/suggest/?search=${encodeURIComponent(q)}`);

// --- Variants (if you use them from UI) ---
export const listCreateVariants = () =>
  api(`${API_BASE}/variants/`);

export const listCreateVariantValues = () =>
  api(`${API_BASE}/variant-values/`);

// --- Reviews & related ---
export const productReviewsById = (productId) =>
  api(`${API_BASE}/products/${productId}/reviews/`);

export const productReviewsBySlug = (country, slug) =>
  api(`${API_BASE}/${country}/${slug}/reviews/`);

export const relatedProducts = (country, slug) =>
  api(`${API_BASE}/${country}/${slug}/related/`);

// --- Events (contact click etc.) ---
export const productEvent = (slug, data) =>
  apiJSON(`${API_BASE}/products/${slug}/event/`, data, { method: "POST" });
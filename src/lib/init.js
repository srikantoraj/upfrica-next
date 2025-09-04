// src/lib/i18n.js
import { api } from "./api";

/**
 * Fetch bootstrap/i18n init payload from the backend.
 * Public endpoint – no auth required.
 */
export async function fetchI18nInit(country) {
  const qs = country ? `?country=${encodeURIComponent(country)}` : "";
  // IMPORTANT: keep the trailing slash to avoid 404s behind Django
  return api(`/api/i18n/init/${qs}`, {
    // cache ~15 minutes; vary by selected country
    next: { revalidate: 900, tags: ["i18n-init", country || "auto"] },
  }).catch(() => null);
}
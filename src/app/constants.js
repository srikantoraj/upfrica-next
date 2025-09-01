// app/constants.js
import { fixImageUrl } from '@/lib/image';

export const SITE_BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const BASE_API_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export const API_BASE = `${BASE_API_URL}/api`;

// e.g. /uk on frontend pulls /api/home/gb/ from backend
export const COUNTRY_ALIAS = { uk: 'gb' };

/* ------------------------- Image URL helpers ------------------------- */
export function getCardImage(product) {
  const u =
    product?.thumbnail ||
    product?.product_image_url ||
    product?.image_objects?.[0]?.url ||
    product?.product_images?.[0]?.url ||
    null;

  return fixImageUrl(u);
}

export function getDetailImage(product) {
  const u =
    product?.image_url ||
    product?.product_image_url ||
    product?.image_objects?.[0]?.url ||
    product?.product_images?.[0]?.url ||
    null;

  return fixImageUrl(u);
}
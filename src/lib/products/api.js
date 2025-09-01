// src/lib/products/api.js

// src/lib/products/api.js

import { BASE_API_URL } from "@/app/constants";

// 🔹 Get product details by region and slug
export async function getProductBySlug(region, slug) {
  const res = await fetch(`${BASE_API_URL}/api/${region}/${slug}/`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status}`);
  }

  return res.json();
}

// 🔹 Get product reviews by product ID (when you have product.id)
export async function getProductReviewsFromProduct(productId) {
  const res = await fetch(`${BASE_API_URL}/api/products/${productId}/reviews/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch reviews by product ID: ${res.status}`);
  }

  return res.json();
}

// 🔹 Get product reviews by region and slug (when you have /[country]/[slug])
export async function getProductReviews(region, slug) {
  const res = await fetch(`${BASE_API_URL}/api/${region}/${slug}/reviews/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: ${res.status}`);
  }

  const data = await res.json();

  // ✅ Normalize the shape
  if (Array.isArray(data)) {
    return {
      reviews: data,
      average_rating: null,
      review_count: data.length,
      rating_percent: null,
    };
  }

  // Handle structured response with results and stats
  return {
    reviews: data.results || data.reviews || [],
    average_rating: data.average_rating ?? null,
    review_count: data.review_count ?? (data.results?.length || 0),
    rating_percent: data.rating_percent ?? null,
  };
}
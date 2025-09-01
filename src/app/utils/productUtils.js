// src/app/utils/productUtils.js

export function getProductUrl(product) {
  if (!product) return "#";
  return (
    product.frontend_url ||
    (product.slug && product.seller_country
      ? `/${product.seller_country.toLowerCase()}/${product.slug}`
      : "#")
  );
}

export function getProductFrontendUrl(product) {
  return getProductUrl(product); // reuse
}

export function getProductCanonicalUrl(product) {
  return product?.canonical_url || "";
}

export function getProductApiUrl(product) {
  return product?.product_url || "";
}

export function getProductImage(product) {
  if (!product) return "/placeholder.png";

  return (
    product?.product_images?.[0]?.url ||
    product?.image_objects?.[0]?.image_url ||
    product?.thumbnail ||
    "/placeholder.png"
  );
}

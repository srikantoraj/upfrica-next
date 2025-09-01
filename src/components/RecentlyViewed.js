"use client";

import { useEffect } from "react";

const RECENTLY_VIEWED_KEY = "upfricaRecentlyViewed";

const RecentlyViewed = ({ product }) => {
  // console.log("new recently vew product", product);
  useEffect(() => {
    if (!product?.id || typeof window === "undefined") return;

    console.log("new recently viewed product", product);

    const safeProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      seo_slug: product.seo_slug,
      category: product.category ? { slug: product.category.slug } : null,
      product_images: product.product_images,
      price_cents: product.price_cents,
      price_currency: product.price_currency,
      sale_price_cents: product.sale_price_cents,
      sale_end_date: product.sale_end_date,
      seller_country: product.seller_country,
      seller_town: product.seller_town,
      on_sales: product.on_sales,
    };

    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let viewedItems = stored ? JSON.parse(stored) : [];

      viewedItems = viewedItems.filter((item) => item.id !== safeProduct.id);
      viewedItems.unshift(safeProduct);

      if (viewedItems.length > 10) {
        viewedItems = viewedItems.slice(0, 10);
      }

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewedItems));
    } catch (e) {
      console.warn("Failed to update recently viewed:", e);
    }
  }, [product?.id]); // Only trigger when product ID changes

  return null;
};

export default RecentlyViewed;


// 'use client'
// import { useEffect } from 'react';

// const RECENTLY_VIEWED_KEY = 'upfricaRecentlyViewed';

// const RecentlyViewed = ({ product }) => {
//   useEffect(() => {
//       console.log("new recently vew product", product);
//         if (typeof window !== 'undefined' && product) {
//             // Retrieve the existing list from localStorage
//             const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
//             let viewedItems = stored ? JSON.parse(stored) : [];

//             // Remove any duplicate of the current product
//             viewedItems = viewedItems.filter(item => item.id !== product.id);

//             // Add current product at the beginning
//             viewedItems.unshift(product);

//             // Limit the list to 10 items (or any preferred number)
//             if (viewedItems.length > 10) {
//                 viewedItems = viewedItems.slice(0, 10);
//             }

//             // Save the updated list back to localStorage
//             localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewedItems));
//         }
//     }, [product]);

//     return null;
// };

// export default RecentlyViewed;

"use client";
import { useEffect } from "react";

const RECENTLY_VIEWED_KEY = "upfricaRecentlyViewed";

const RecentlyViewed = ({ product }) => {
  console.log("new recently vew product", product);

  useEffect(() => {
    if (typeof window !== "undefined" && product) {
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

      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let viewedItems = stored ? JSON.parse(stored) : [];

      console.log("safeProduct",safeProduct);
      

      viewedItems = viewedItems.filter((item) => item.id !== safeProduct.id);
      viewedItems.unshift(safeProduct);

      if (viewedItems.length > 10) {
        viewedItems = viewedItems.slice(0, 10);
      }

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewedItems));
    }
  }, [product]);

  return null;
};

export default RecentlyViewed;


// components/WomenFashion.jsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance"; // ✅ Injects auth token
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";

// Only the price widget runs on the client
const Price = dynamic(() => import("./Price"), { ssr: false });

export default function WomenFashion({ title }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  console.log("🔍 Token from localStorage:", token);

  if (!token) return;

  axios
    .get("/api/product-list/women/")
    .then((res) => setProducts(res.data.results))
    .catch((err) => {
      console.error("❌ Failed to load women products:", err.response?.data || err);
      setError(err);
    });
}, []);

  if (error) return <div className="p-4 text-red-600">Failed to load products</div>;

  return (
    <div className="container mx-auto bg-white shadow-md py-10 mb-2 p-5 rounded-lg">
      {/* Header */}
      <div className="text-xl md:text-3xl font-extrabold tracking-wide pb-4">
        <h1>{title}</h1>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4">
          {products.map((product) => {
            const {
              id,
              title: prodTitle,
              product_images,
              seller_country,
              seo_slug,
              slug,
              price_cents,
              sale_price_cents,
              price_currency,
              sale_end_date,
              on_sales,
            } = product;

            const countryCode = (seller_country || "gh").toLowerCase();
            const pathSlug = seo_slug || slug;

            return (
              <div
                key={id}
                className="border shadow-lg rounded-lg overflow-hidden flex flex-col min-w-[200px] h-[220px]"
              >
                <div className="flex-grow overflow-hidden">
                  <Link href={`/${countryCode}/${pathSlug}/`}>
                    <Image
                      src={product_images?.[0] || "/placeholder.png"}
                      alt={prodTitle}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover transform transition-all duration-1000 ease-in-out hover:scale-110 hover:-translate-y-2"
                    />
                  </Link>
                </div>

                <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
                  <Price
                    priceCents={price_cents}
                    salePriceCents={sale_price_cents}
                    priceCurrency={price_currency}
                    saleEndDate={sale_end_date}
                    onSales={on_sales}
                  />
                  <button className="p-1 border-2 border-black rounded">
                    <FaShoppingCart className="text-purple-500" size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// components/EarlyDeals.jsx"use client";
"use client"; // ✅ Must be the very first line

import React, { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance"; // ✅ ensures token is included
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowRoundForward } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt } from "react-icons/fa";

const Price = dynamic(() => import("./Price"), { ssr: false });

export default function EarlyDeals() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/product-list/2025/")
      .then((res) => setProducts(res.data.results))
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        setError(err);
      });
  }, []);

  if (error) return <div className="p-4 text-red-600">Failed to load products</div>;

  return (
    <div className="container bg-white py-5 mb-2 px-5">
      {/* Header */}
      <div className="flex gap-4 pb-4 items-center justify-between md:justify-start">
        <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">2025 Deals</h1>
        <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
      </div>

      {/* Products Carousel */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {products.map((product) => {
          const {
            id,
            product_images,
            title,
            sale_end_date,
            sale_price_cents,
            on_sales,
            seller_country,
            seo_slug,
            slug,
            price_cents,
            price_currency,
          } = product;

          const isOnSaleActive =
            sale_end_date &&
            new Date(sale_end_date) > new Date() &&
            (sale_price_cents > 0 || on_sales);

          const countryCode = (seller_country || "gh").toLowerCase();
          const slugPath = seo_slug || slug;

          return (
            <div
              key={id}
              className="border shadow-lg rounded-lg overflow-hidden h-56 flex flex-col min-w-[200px]"
            >
              <div className="relative flex-grow overflow-hidden">
                {isOnSaleActive && (
                  <div className="absolute top-4 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                    <FaBolt className="w-3 h-3" />
                    Sale
                  </div>
                )}
                <Link href={`/${countryCode}/${slugPath}/`}>
                  <Image
                    src={product_images?.[0] || "/placeholder.png"}
                    alt={title || "Product image"}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
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
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-200">
                  <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
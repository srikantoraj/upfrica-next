"use client";

import { Eye, CheckCircle, Trash2, Pencil, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";

export default function ProductListCards() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/products/mine/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.results || []);
      } catch (err) {
        console.error("❌ Product fetch error:", err);
        setError("Failed to load products.");
      }
    };

    fetchProducts();
  }, [token]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col"
        >
          <div className="p-4 flex items-start gap-4">
            <Link
              href={p.frontend_url || `/product/${p.slug}`}
              className="w-20 h-20 relative flex-shrink-0 rounded overflow-hidden block"
            >
              <Image
                src={
                  p.thumbnail ||
                  p.image_objects?.[0]?.image_url ||
                  p.image_objects?.[0]?.url ||
                  "/placeholder.png"
                }
                alt={p.title}
                fill
                className="object-cover"
              />
            </Link>

            <div className="flex-1 space-y-1 overflow-hidden">
              <Link href={p.frontend_url || `/product/${p.slug}`}>
                <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-3 hover:underline">
                  {p.title}
                </h3>
              </Link>

              <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {p.status || "Approved"}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {p.visibility || "Published"}
              </div>

              <div className="text-sm text-emerald-700 dark:text-emerald-400">
                In Stock ({p.stock_quantity ?? 1})
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 pb-4 mt-auto">
            <div>
              <div className="text-black dark:text-white font-bold text-lg">
                ${parseFloat(p.price || 0).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {p.views ?? 0}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="p-1.5 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded-md border hover:bg-red-100 dark:hover:bg-red-800"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
              <button
                className="p-1.5 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-700"
                title="More"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

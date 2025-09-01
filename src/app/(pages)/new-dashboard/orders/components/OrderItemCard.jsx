"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function OrderItemCard({ item }) {
  const product = item.product;
  const price = (item.price_cents || 0) / 100;

  const imageSrc =
    product?.product_images?.[0]?.url ||
    product?.image_objects?.[0]?.image_url ||
    product?.thumbnail ||
    "/placeholder.png";

  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <Image
        src={imageSrc}
        alt={product.title}
        width={70}
        height={70}
        className="rounded-md object-cover border border-gray-300 dark:border-gray-600"
      />

      <div className="flex-1">
        <p className="font-medium text-gray-800 dark:text-gray-100">
          {product.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Qty: {item.quantity} • GHS {price.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Returns accepted until {item.return_deadline || "N/A"}
        </p>

        <div className="mt-2">
          <Link
            href={`/products/${product.slug}`}
            className="upfrica-btn-primary-outline-sm text-purple-600 dark:text-purple-400"
          >
            Buy again
          </Link>
        </div>
      </div>
    </div>
  );
}

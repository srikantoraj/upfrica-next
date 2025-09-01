"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OrderCard = ({
  order,
  items = [],
  reviewedItemIds = [],
  reviewedReviews = [], // ✅ accept reviewed reviews as prop
}) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const status = order?.status_label || "Processing";
  const date =
    order?.created_at_formatted ||
    new Date(order?.created_at).toLocaleDateString();
  const itemTotalCents = items.reduce(
    (sum, item) => sum + (item?.price_cents || 0),
    0
  );
  const totalCents = order?.total_price_cents ?? itemTotalCents;
  const total = `GHS ${(totalCents / 100).toFixed(2)}`;
  const orderNumber =
    order?.order_number || order?.id?.toString().padStart(7, "0");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-upfrica mb-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 gap-4 md:gap-0">
        <div className="flex-1 min-w-0">
          <div className="text-green-600 font-bold flex items-center mb-2">
            ✅ {status}
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-black dark:text-white">
            <div>
              <span className="block font-bold text-green-600">Order #</span>
              {orderNumber}
            </div>
            <div>
              <span className="block font-bold text-green-600">Order date</span>
              {date}
            </div>
            <div>
              <span className="block font-bold text-green-600">Total</span>
              {total}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            className="h-9 text-white upfrica-btn-primary-sm"
            onClick={() => router.push(`/new-dashboard/orders/${order?.id}`)}
          >
            View details
          </button>
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              className="h-9 upfrica-btn-primary-outline-sm w-full sm:w-auto"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              More actions ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 w-48">
                {[
                  "Contact seller",
                  "Return this item",
                  "I didn’t receive it",
                  "Sell this item",
                  "Invoice",
                  "Add note",
                  "Hide Order",
                  "Help & report",
                ].map((label, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-5 space-y-4">
        {items.map((item, index) => {
          const product = item?.product || {};
          const productUrl =
            product?.frontend_url ||
            (product?.slug && product?.seller_country
              ? `/${product?.seller_country.toLowerCase()}/${product?.slug}`
              : "#");

          const imageSrc =
            product?.product_images?.[0]?.url ||
            product?.image_objects?.[0]?.image_url ||
            product?.thumbnail ||
            "/placeholder.png";

          const productTitle = product?.title || "Untitled Product";
          const sellerUsername =
            product?.seller_username ||
            product?.seller_info?.username ||
            product?.shop?.name ||
            "Seller";

          const price = `GHS ${(item?.price_cents || 0) / 100}`;

          const review = reviewedReviews.find(
            (r) => r.order_item_id === item.id
          );
          const reviewed = !!review;

          return (
            <div key={index} className="flex gap-4">
              <Link
                href={productUrl}
                className="w-20 h-20 relative flex-shrink-0 rounded-md overflow-hidden"
              >
                <Image
                  src={imageSrc}
                  alt={productTitle}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={productUrl}>
                  <div className="font-semibold text-black dark:text-white hover:underline">
                    {productTitle}
                  </div>
                </Link>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sold by:{" "}
                  <Link
                    href={`/shop/${sellerUsername}`}
                    className="underline text-black dark:text-white"
                  >
                    {sellerUsername} ›
                  </Link>
                </p>

                <div className="text-sm text-black dark:text-white">{price}</div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Returns accepted until 12 May
                </div>

                <div className="mt-1">
                  <Link
                    href={productUrl}
                    className="inline-block mt-1 text-sm font-medium text-purple-600 hover:underline"
                  >
                    🛒 Buy again
                  </Link>
                </div>

                {/* ✅ Review CTA */}
                <div className="mt-1">
                  {reviewed ? (
                    review.status === 1 ? (
                      <div className="text-xs text-green-500 mt-1">
                        ✅ Reviewed {review.rating ? `• ${review.rating}★` : ""}
                        {review.can_edit && (
                          <Link
                            href={`/edit-review/${review.id}`}
                            className="ml-2 text-blue-500 hover:underline"
                          >
                            ✏️ Edit
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-yellow-600 mt-1">
                        🕓 Review pending approval
                      </div>
                    )
                  ) : (
                    <Link
                      href={`/${order.order_country_code || "gh"}/${
                        product.slug
                      }/write-review?order_item_id=${item.id}&product_id=${
                        product.id
                      }&utm_source=orders_page&utm_medium=review_cta`}
                      className="text-xs text-purple-500 hover:underline mt-1 block"
                    >
                      ✍️ Write a review & earn points
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;
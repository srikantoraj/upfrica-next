"use client";

import React from "react";
import Image from "next/image";

/* ---------- tiny, file-local helpers (JS, no types) ---------- */
function fixImageUrl(u) {
  if (!u) return "";
  let s = String(u).trim();

  // repair "cloudfront.netdirect_uploads/..." → "cloudfront.net/direct_uploads/..."
  s = s.replace(/(cloudfront\.net)(?=[^/])/i, "$1/");

  // turn "/media/..." into absolute using NEXT_PUBLIC_API_URL
  if (/^\/?media\//i.test(s)) {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    return base ? `${base}/${s.replace(/^\//, "")}` : s;
  }

  return s;
}

function pickProductImage(item) {
  return fixImageUrl(
    item?.product_image_url ||
      item?.product_image ||
      item?.thumbnail ||
      item?.image_url ||
      item?.image ||
      item?.photos?.[0]?.url ||
      item?.image_objects?.[0]?.image_url ||
      item?.image_objects?.[0]?.url ||
      ""
  );
}

/* safe image with runtime fallback (works with next/image) */
function SafeImage({ src, alt, fallback, ...props }) {
  const [imgSrc, setImgSrc] = React.useState(src || fallback);
  React.useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);
  return (
    <Image
      src={imgSrc || fallback}
      alt={alt || "Image"}
      onError={() => setImgSrc(fallback)}
      {...props}
    />
  );
}

/* ---------- component ---------- */
export default function SellerOrderCard({ order }) {
  const {
    id,
    buyer_name,
    buyer_email,
    status,
    order_date,
    total,
    payment_status,
    payment_completed_at,
    order_items = [],
  } = order;

  // single trusted fallback (CloudFront) – make sure this host is whitelisted in next.config.js
  const fallbackImage =
    "https://d3q0odwafjkyv1.cloudfront.net/50g59dwfx74fq23f6c2p5noqotgo";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-upfrica mb-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 gap-4 md:gap-0">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="text-green-600 font-bold text-sm">✅ {status}</div>
          <div className="text-sm text-black dark:text-white">
            <span className="font-bold text-green-600">Order #</span> {id}
          </div>
          <div className="text-sm text-black dark:text-white">
            <span className="font-bold text-green-600">Date</span> {order_date}
          </div>
          <div className="text-sm text-black dark:text-white">
            <span className="font-bold text-green-600">Buyer</span>: {buyer_name} (
            {buyer_email?.slice(0, 3)}***)
          </div>
          <div className="text-sm text-black dark:text-white">
            <span className="font-bold text-green-600">Payment</span>:{" "}
            {payment_status === "Paid" ? (
              <span className="text-green-500">✅ Paid</span>
            ) : (
              <span className="text-red-500">❌ Unpaid</span>
            )}
          </div>
          {payment_status === "Paid" && (
            <div className="text-xs text-gray-500">
              Payment completed at: {payment_completed_at}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button className="h-9 text-white upfrica-btn-primary-sm">View Details</button>
          <button className="h-9 upfrica-btn-primary-outline-sm">Mark as Dispatched</button>
        </div>
      </div>

      {/* Items */}
      <div className="mt-5 space-y-4">
        {order_items.map((item) => {
          const src = pickProductImage(item) || fallbackImage;
          return (
            <div key={item.id} className="flex gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                <SafeImage
                  src={src}
                  alt={item.product_title || "Product Image"}
                  fallback={fallbackImage}
                  width={80}
                  height={80}
                  className="rounded-md border border-gray-300 dark:border-gray-600 object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-black dark:text-white break-words">
                  {item.product_title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity} · GHS {item.price}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm font-medium text-black dark:text-white border-t pt-4 border-gray-200 dark:border-gray-700">
        Total: GHS {total}
      </div>
    </div>
  );
}
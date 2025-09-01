"use client";

import { useState } from "react";
import Link from "next/link";
import OrderItemCard from "./OrderItemCard";
import MarkAsReceivedBottomSheet from "./MarkAsReceivedBottomSheet";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function SellerOrderBlock({
  sellerName,
  items,
  estimatedDelivery,
  trackingNumber,
  onConfirm, // ✅ when "Mark as Received" is confirmed
  onUndo,    // ✅ notify parent when "Undo" happens
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + ((item.price_cents || 0) * item.quantity) / 100,
    0
  );

  const [received, setReceived] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);

  const handleUndo = () => setShowUndoConfirm(true);

  const confirmUndo = () => {
    setReceived(false);
    setShowUndoConfirm(false);
    onUndo?.();
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Seller Name */}
      <h4 className="text-purple-700 dark:text-purple-400 font-semibold mb-2">
        Sold by: {sellerName || "Unknown Seller"}
      </h4>

      {/* Status + Estimated */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white dark:bg-green-500">
          🟢 Status: {received ? "Delivered" : "Dispatched"}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
          ⏱ Estimated: {estimatedDelivery || "N/A"}
        </span>
      </div>

      {/* Products */}
      {items.map((item) => (
        <div key={item.id} className="mb-4">
          <OrderItemCard item={item} received={received} />

          {/* Review status or CTA */}
{item.reviewed ? (
  item.review?.status === 1 ? (
    <div className="text-xs text-green-500 mt-1">
      ✅ Reviewed
      {item.review.rating && (
        <span> • {item.review.rating}★</span>
      )}
      {item.review.can_edit && (
        <Link
          href={`/edit-review/${item.review.id}`}
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
) : received ? (
  <div className="mt-1">
    <Link
      href={`/write-review/${item.product?.slug || item.product_id}`}
      className="text-sm text-purple-500 hover:underline"
    >
      ✍️ Write a review & earn points
    </Link>
  </div>
) : null}
        </div>
      ))}

      {/* Tracking Info */}
      <div className="text-sm mt-3 text-gray-700 dark:text-gray-300">
        🚚 Estimated Delivery: <strong>{estimatedDelivery || "N/A"}</strong>
        <br />
        🔍 Tracking #: <strong>{trackingNumber || "N/A"}</strong>
      </div>

      {/* Subtotal */}
      <div className="text-right font-semibold mt-2 text-sm text-gray-800 dark:text-gray-200">
        Subtotal: GHS {subtotal.toFixed(2)}
      </div>

      {/* Mark as Received or Undo */}
      <div className="mt-4 text-right">
        {received ? (
          <div className="flex items-center justify-end gap-2 text-green-700 dark:text-green-400">
            ✅ <span>Item Received</span>
            <button
              onClick={handleUndo}
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              Undo
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSheet(true)}
            className="h-8 upfrica-btn-primary-outline-sm text-green-700 dark:text-green-400"
          >
            Mark as Received
          </button>
        )}
      </div>

      {/* Bottom Sheet Confirmation */}
      <MarkAsReceivedBottomSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        productId={items[0]?.product?.id}
        productSlug={items[0]?.product?.slug}
        countryCode={items[0]?.country_code || "gh"}
        orderItemId={items[0]?.id}
        pointsEarned={10}
        onConfirm={() => {
          setReceived(true);
          onConfirm?.();
        }}
      />

      {/* Undo Confirmation Modal */}
      <ConfirmModal
        isOpen={showUndoConfirm}
        title="Undo Item Received?"
        message="Are you sure you want to undo delivery confirmation?"
        onConfirm={confirmUndo}
        onClose={() => setShowUndoConfirm(false)}
      />
    </div>
  );
}

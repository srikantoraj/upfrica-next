"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

export default function MarkAsReceivedBottomSheet({
  isOpen,
  onClose,
  productId,
  productSlug,
  countryCode = "gh", // ✅ fallback
  orderItemId,
  pointsEarned = 10,
  onConfirm,
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setConfirmed(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm?.();
  };

const handleReviewClick = () => {
  const reviewUrl = `/${countryCode}/${productSlug}/write-review?order_item_id=${orderItemId}&product_id=${productId}`;
  window.location.href = reviewUrl;
};

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-t-2xl p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                ✅ Item Received
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            {/* Message */}
            <div className="text-center text-gray-800 dark:text-gray-200 mb-4">
              <p>Thanks for confirming delivery!</p>
              <p className="mt-1 font-semibold text-green-600 dark:text-green-400">
                🎉 You’ve earned {pointsEarned} points
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-6">
              {!confirmed ? (
                <button
                  onClick={handleConfirm}
                  className="h-10 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold"
                >
                  ✅ Confirm Delivery
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                  ✔️ Delivery Confirmed
                </div>
              )}

              <button
                disabled={!confirmed}
                onClick={handleReviewClick}
                className={`h-10 rounded-lg font-semibold ${
                  confirmed
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                ✍️ Write a Review
              </button>

              <button
                onClick={onClose}
                className="h-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
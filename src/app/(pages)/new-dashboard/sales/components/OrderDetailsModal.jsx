"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!order) return null;

  const {
    id,
    order_code,
    order_date,
    order_items = [],
    shipping_address,
    shipping_name,
    buyer_phone,
    buyer_note,
    payment_status,
    payment_completed_at,
    total,
    buyer_name,
    buyer_email,
    order_status, // optional: "Processing", "Dispatched"
    shipping_fee = 0,
    platform_fee = 0,
    seller_payout = total - platform_fee,
  } = order;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const fullAddress = [
    shipping_address?.line1,
    shipping_address?.line2,
    shipping_address?.city,
    shipping_address?.region,
    shipping_address?.country,
    shipping_address?.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-50 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <Dialog.Panel className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-t-2xl p-6 mx-auto w-full max-w-2xl shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{id || "—"}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black dark:hover:text-white text-xl"
              >
                <AiOutlineClose />
              </button>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2 mb-4">
              {order_status && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  {order_status}
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  payment_status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {payment_status === "Paid" ? "✅ Paid" : "❌ Unpaid"}
              </span>
            </div>

            {/* Order Info */}
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <p>
                <span className="font-semibold">Order Date:</span>{" "}
                {formatDate(order_date)}
              </p>

<p>
  <span className="font-semibold">Shipping:</span>{" "}
  {shipping_name} — {fullAddress}
  <div className="flex items-center gap-2 mt-2">

        <button
      onClick={() => {
        navigator.clipboard
          .writeText(fullAddress)
          .then(() => alert("📋 Address copied!"))
          .catch(() => alert("❌ Failed to copy address"));
      }}
      className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700 transition "
    >
      Copy
    </button>
    
    <a
      href={mapLink}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      View on Map
    </a>

  </div>
</p>
              {buyer_note && (
                <p>
                  <span className="font-semibold">Buyer Note:</span>{" "}
                  {buyer_note}
                </p>
              )}
              {payment_completed_at && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Paid on {formatDate(payment_completed_at)}
                </p>
              )}
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              {Array.isArray(order_items) && order_items.length > 0 ? (
                order_items.map((item) => {
                  const imageUrl =
                    item.product_image ||
                    item.product?.thumbnail ||
                    "/fallback-image.jpg";
                  const title =
                    item.product_title ||
                    item.product?.title ||
                    "Product";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex gap-3 items-center">
                        <Image
                          src={imageUrl}
                          width={48}
                          height={48}
                          alt={title}
                          className="rounded border border-gray-300 dark:border-gray-600 object-cover"
                          unoptimized
                        />
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          <p className="font-medium">{title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × GHS{" "}
                            {item.unit_price?.toFixed(2)}
                          </p>
                          {item.shipping_fee > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Shipping: GHS {item.shipping_fee.toFixed(2)}
                            </p>
                          )}
                          {item.dispatch_info?.carrier && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Dispatched via {item.dispatch_info.carrier}
                              {item.dispatch_info.trackingNumber &&
                                ` — Tracking #: ${item.dispatch_info.trackingNumber}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 whitespace-nowrap">
                        GHS {item.total_price?.toFixed(2)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm italic text-gray-400 dark:text-gray-500">
                  No items found in this order.
                </p>
              )}
            </div>

{/* Totals */}
<div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-800 dark:text-gray-200">
  <div className="flex justify-between">
    <span>Items Subtotal:</span>
    <span className="font-medium">GHS {total?.toFixed(2)}</span>
  </div>

  {shipping_fee > 0 && (
    <div className="flex justify-between">
      <span>Postage & Packing:</span>
      <span className="font-medium">GHS {shipping_fee.toFixed(2)}</span>
    </div>
  )}

  {platform_fee > 0 && (
    <div className="flex justify-between text-red-600 dark:text-red-400">
      <span>Platform Fee:</span>
      <span>-GHS {platform_fee.toFixed(2)}</span>
    </div>
  )}

  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
    <span>Grand Total:</span>
    <span>GHS {(total + shipping_fee)?.toFixed(2)}</span>
  </div>

  <div className="flex justify-between font-semibold text-gray-900 dark:text-white border-t border-gray-300 pt-2 mt-2">
    <span>Seller Payout:</span>
    <span>GHS {seller_payout?.toFixed(2)}</span>
  </div>
</div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
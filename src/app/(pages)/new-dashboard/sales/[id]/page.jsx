// app/(pages)/new-dashboard/sales/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function SalesOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace this with actual API call
  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-sm text-gray-800 dark:text-gray-200">
      <Link href="/new-dashboard/sales" className="flex items-center gap-2 mb-4 text-blue-500">
        <AiOutlineArrowLeft /> Back to Sales
      </Link>

      <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
      <p className="mb-4 text-gray-500">
        Placed on {formatDate(order.created_at)} | Payment:{" "}
        {order.payment_status === "Paid" ? (
          <span className="text-green-500 font-medium">✅ Paid</span>
        ) : (
          <span className="text-red-500 font-medium">❌ Unpaid</span>
        )}
      </p>

      {/* Buyer & Shipping */}
      <div className="mb-6 space-y-2 border p-4 rounded-md dark:border-gray-700">
        <p><strong>Buyer:</strong> {order.buyer_name} ({order.buyer_email})</p>
        <p>
          <strong>Shipping:</strong> {order.shipping_name} — {order.shipping_address?.line1}, {order.shipping_address?.city}, {order.shipping_address?.country}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${order.shipping_address?.line1}, ${order.shipping_address?.city}, ${order.shipping_address?.country}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-xs"
        >
          View on Map →
        </a>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Image
                src={item.product_image}
                width={48}
                height={48}
                alt={item.product_title}
                className="rounded border object-cover"
              />
              <div>
                <p className="font-medium text-sm">{item.product_title}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-sm whitespace-nowrap">GHS {item.price}</p>
          </div>
        ))}
      </div>

      {/* Dispatch info */}
      <div className="mt-6 border-t pt-4">
        {order.dispatch_info ? (
          <div className="text-sm space-y-2">
            <p><strong>Carrier:</strong> {order.dispatch_info.carrier}</p>
            <p><strong>Tracking Number:</strong> {order.dispatch_info.trackingNumber}</p>
            {order.dispatch_info.trackingLink && (
              <a
                href={order.dispatch_info.trackingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Track Package →
              </a>
            )}
            <p><strong>Dispatched on:</strong> {formatDate(order.dispatch_info.dispatchDate)}</p>
          </div>
        ) : (
          <p className="text-yellow-600">Not yet dispatched.</p>
        )}
      </div>

      {/* Total */}
      <div className="mt-6 flex justify-between text-base font-semibold border-t pt-4">
        <span>Total:</span>
        <span>GHS {order.total}</span>
      </div>
    </div>
  );
}
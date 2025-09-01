
//src/app(pages)/new-dashboard/payment-success



"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { CheckCircle, Truck, ArrowRight } from "lucide-react";

export default function PaymentSuccess({ searchParams }) {
  const orderId = searchParams.order_id;
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function loadOrder() {
      try {
        const res = await fetch(
          `https://media.upfrica.com/api/buyer/orders/${orderId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, token]);

  useEffect(() => {
    if (!loading && order && !error) {
      setShowDrawer(true);
    }
  }, [loading, order, error]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg text-gray-600">Loading your order…</p>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">
          No order ID provided
        </h1>
        <p className="mt-4 text-gray-700">
          Please check your payment confirmation link.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">
          Something went wrong
        </h1>
        <p className="mt-4 text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      {showDrawer && <OrderSuccessUI order={order} onClose={() => router.push("/")} />}
    </>
  );
}

function OrderSuccessUI({ order, onClose }) {
  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 md:px-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 text-green-600 mb-4">
        <CheckCircle className="w-6 h-6" />
        <h1 className="text-xl font-semibold">Order confirmed, thank you!</h1>
      </div>

      <p className="text-gray-700 text-sm mb-4">
        A confirmation email has been sent to <span className="font-medium">{order.buyer_email || order.buyer}</span>.
      </p>

      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-800">
          <Truck className="w-5 h-5 text-blue-500" />
          <p className="text-sm font-medium">
            Estimated Delivery: <span className="text-black">{order.estimated_delivery || "—"}</span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h2>
        <div className="border rounded-lg p-4 text-sm text-gray-800">
          <div className="mb-2">
            <p className="font-medium">Order ID: #{order.id}</p>
            <p className="text-gray-500">Buyer ID: {order.buyer}</p>
          </div>
          <div className="flex justify-between mt-2 border-t pt-2">
            <span>Total Paid:</span>
            <span className="font-semibold text-black">
              £{(order.total_fee_cents / 100).toFixed(2)} {order.total_fee_currency?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700">Shipping Address:</h2>
        <p className="text-gray-900 text-sm">{order.shipping_address || order.address}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700">Items Purchased:</h2>
        <div className="space-y-4 mt-2">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={item.product.product_images[0]}
                alt={item.product.title}
                className="w-16 h-16 object-cover rounded border"
              />
              <div>
                <p className="font-medium text-gray-900">{item.product.title}</p>
                <p className="text-gray-700">Qty: {item.quantity}</p>
                <p className="text-gray-700">
                  £{(item.price_cents / 100).toFixed(2)} {item.product.price_currency?.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => window.location.href = `/dashboard/all-orders/${order.id}`}
          className="bg-[#A435F0] text-white py-3 px-4 rounded-md text-center font-medium hover:bg-purple-700"
        >
          📦 Track Your Order
        </button>

        <button
          onClick={onClose}
          className="text-sm text-blue-600 hover:underline text-center flex items-center justify-center gap-1"
        >
          Continue shopping <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
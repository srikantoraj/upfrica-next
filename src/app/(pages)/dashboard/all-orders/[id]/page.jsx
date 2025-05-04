'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import DeliveryTracker from "../components/DeliveryTracker";
import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';

// Skeleton loader
const OrderDetailsSkeleton = () => (
  <div className="bg-white p-4 max-w-3xl mx-auto mt-6 rounded-xl shadow animate-pulse space-y-6">
    <div className="h-6 bg-gray-200 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-3 bg-gray-200 rounded w-full" />
    <div className="h-24 bg-gray-100 rounded" />
    <div className="h-20 bg-gray-100 rounded" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-gray-100 rounded" />
      <div className="h-24 bg-gray-100 rounded" />
    </div>
  </div>
);

export default function OrderDetailsPage() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullInfo, setShowFullInfo] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://media.upfrica.com/api/buyer/orders/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrder(data);
        console.log("✅ Order loaded:", data);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading) return <OrderDetailsSkeleton />;
  if (!order) return <div className="text-center text-red-600 p-6">Order not found.</div>;

  const item = order.order_items?.[0];
  const product = item?.product;

  return (
    <div className="bg-white shadow rounded-xl p-4 max-w-3xl mx-auto mt-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 bg-gray-50 p-4 rounded-md">
        <div>
          <p className="text-green-700 font-bold text-lg">
            ✅ {item.receive_status === 1 ? "Delivered" : "Processing"}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <strong>Order #</strong> {String(order.id).padStart(6, "0")}<br />
            <strong>Order date</strong> {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-green-700 mb-1">GET POINTS</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="h-8 upfrica-btn-primary-outline-sm text-green-700">Mark as received</button>
            <button className="h-8 upfrica-btn-primary-outline-sm text-green-700">Write a review</button>
          </div>
        </div>
      </div>

      {/* TRACKER */}
      <DeliveryTracker
        stage={item.receive_status === 1 ? 2 : 1}
        steps={[
          { label: "Ordered", date: new Date(order.created_at).toLocaleDateString() },
          {
            label: "Dispatched",
            date: item.dispatched_at
              ? new Date(item.dispatched_at).toLocaleDateString()
              : new Date(order.updated_at || order.created_at).toLocaleDateString(),
          },
          {
            label: "Delivered",
            note: item.receive_status === 1 ? "Delivered" : "Not confirmed",
          },
        ]}
      />

      {/* TRACKING */}
      <div className="mt-4 text-sm">
        <p><strong>Tracking number:</strong> {order.tracking_number || "N/A"}</p>
      </div>

      {/* PRODUCT INFO */}
      <div className="mt-6 border-b-2 mb-4">
        <h3 className="text-lg font-bold text-[#0f1111] mb-1">Item info</h3>
        <div className="flex items-start gap-4">
          <img
            src={product?.product_images?.[0] || "/placeholder.png"}
            alt={product?.title}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div className="mb-4">
            <p className="font-medium">{product.title}</p>
            <p className="text-sm">
              Sold by:{" "}
              {item.shop?.slug ? (
                <a
                  href={`/shops/${item.shop.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-black"
                >
                  {item.shop.name || item.shop?.user?.username || `Seller ${product.user}`} ›
                </a>
              ) : (
                <span className="font-semibold">
                  {item.shop?.user?.username || `Seller ${product.user}`}
                </span>
              )}
            </p>
            <p className="text-sm">Item number: {product.id}</p>
            <p className="text-sm">GHS {(item.price_cents / 100).toFixed(2)}</p>
            <p className="text-xs text-gray-500">Returns accepted until 12 May</p>
          </div>
        </div>
      </div>

      {/* DELIVERY & PAYMENT */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="text-lg font-bold mb-1">Delivery info</h4>
          <div className="flex items-center gap-2 text-gray-700">
            <AiOutlineHome />
            <span>
              {showFullInfo
                ? order.address.address_data.address_line_1
                : `${order.address.address_data.town}, ${order.address.address_data.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-700">
            <AiOutlineUser />
            <span>
              {showFullInfo
                ? `${order.buyer.first_name} ${order.buyer.last_name}`
                : `${order.buyer.first_name} ${order.buyer.last_name[0]}.`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-700">
            <AiOutlinePhone />
            <span>{showFullInfo ? order.address.address_data.phone_number : "+233 *** ****"}</span>
          </div>
          <button
            onClick={() => setShowFullInfo(!showFullInfo)}
            className="text-purple-600 underline mt-2 text-sm"
          >
            {showFullInfo ? "Hide full address" : "View full address"}
          </button>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-1">Payment method</h4>
          <p>{order.payment_method || "N/A"}</p>
          <p>1 item &nbsp;&nbsp; +{(item.price_cents / 100).toFixed(2)}</p>
          <p>Discount &nbsp;&nbsp; -0.00</p>
          <p>Postage &nbsp;&nbsp; 0.00</p>
          <p className="font-semibold">
            Total &nbsp;&nbsp; GHS {(item.price_cents * item.quantity / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
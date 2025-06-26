'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { BASE_API_URL } from '@/app/constants';
import DeliveryTracker from "../components/DeliveryTracker";
import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullInfo, setShowFullInfo] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_API_URL}/api/buyer/orders/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading) return <div className="text-center p-6 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!order) return <div className="text-center text-red-600 p-6">Order not found.</div>;

  const item = order.order_items?.[0];
  const product = item?.product;

  const totalAmount = (item.price_cents * item.quantity) / 100;
  const pricePerItem = (item.price_cents / 100).toFixed(2);

  const createdDate = new Date(order.created_at);
  const deliveryNote = item.receive_status === 1 ? "Delivered" : "Pending confirmation";

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-3xl mx-auto mt-8 transition-all duration-300">

      {/* Status Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md">
        <div>
          <p className="text-green-600 font-bold text-lg">
            ✅ {item.receive_status === 1 ? "Delivered" : "Processing"}
          </p>
          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <p><strong>Order #</strong> {String(order.id).padStart(6, "0")}</p>
            <p><strong>Date</strong> {createdDate.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end">
          <p className="text-xs font-semibold text-green-600 mb-1">GET POINTS</p>
          <div className="flex gap-2 flex-wrap">
            <button className="h-8 upfrica-btn-primary-outline-sm text-green-700 dark:text-green-400">
              Mark as received
            </button>
            <button className="h-8 upfrica-btn-primary-outline-sm text-green-700 dark:text-green-400">
              Write a review
            </button>
          </div>
        </div>
      </div>

      {/* Tracker */}
      <DeliveryTracker
        stage={item.receive_status === 1 ? 2 : 1}
        steps={[
          { label: "Ordered", date: createdDate.toLocaleDateString() },
          { label: "Dispatched", date: order.dispatched_at ? new Date(order.dispatched_at).toLocaleDateString() : "Soon" },
          { label: "Delivered", note: deliveryNote },
        ]}
      />

      {/* Tracking */}
      <div className="mt-4 text-sm text-gray-800 dark:text-gray-300">
        <p><strong>Tracking</strong>: {order.tracking_number || "N/A"}</p>
      </div>

      {/* Product */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Item info</h3>
        <div className="flex gap-4 items-start">
          <img
            src={product?.product_images?.[0] || "/placeholder.png"}
            alt={product?.title}
            className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
          />
          <div>
            <p className="font-medium">{product?.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Item ID: {product?.id}</p>
            <p className="text-sm">Price: GHS {pricePerItem}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Returns accepted until {order.return_deadline || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="mt-6 grid sm:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-1">Delivery info</h4>
          <div className="flex items-center gap-2">
            <AiOutlineHome />
            <span>
              {showFullInfo
                ? order.address?.address_data?.address_line_1
                : `${order.address?.address_data?.town}, ${order.address?.address_data?.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <AiOutlineUser />
            <span>
              {showFullInfo
                ? `${order.buyer?.first_name} ${order.buyer?.last_name}`
                : `${order.buyer?.first_name} ${order.buyer?.last_name?.[0]}.`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <AiOutlinePhone />
            <span>
              {showFullInfo
                ? order.address?.address_data?.phone_number
                : "+233 *** ****"}
            </span>
          </div>
          <button
            onClick={() => setShowFullInfo(!showFullInfo)}
            className="text-purple-600 dark:text-purple-400 mt-2 underline text-sm"
          >
            {showFullInfo ? "Hide full address" : "View full address"}
          </button>
        </div>

        <div>
          <h4 className="font-semibold mb-1">Payment</h4>
          <p>Method: {order.payment_method || "N/A"}</p>
          <p>{item.quantity} item(s): +GHS {pricePerItem}</p>
          {order.discount_cents && (
            <p>Discount: -GHS {(order.discount_cents / 100).toFixed(2)}</p>
          )}
          <p>Postage: GHS {(order.shipping_fee_cents || 0) / 100}</p>
          <p className="font-semibold">
            Total: GHS {totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
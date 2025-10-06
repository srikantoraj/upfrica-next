"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import DeliveryTracker from "../components/DeliveryTracker";
import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";

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
        const res = await fetch(
          `https://api.upfrica.com/api/buyer/orders/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
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

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!order)
    return <div className="text-center text-red-600 p-6">Order not found.</div>;

  const item = order.order_items[0];
  const product = item.product;

  return (
    <div className="bg-white shadow rounded-xl p-4 max-w-3xl mx-auto mt-6">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 bg-gray-50 p-4 rounded-md">
        {/* Left: Order Info */}
        <div>
          <p className="text-green-700 font-bold text-lg">
            ✅ {item.receive_status === 1 ? "Delivered" : "Processing"}
          </p>
          <div className="text-sm mt-1 text-gray-700">
            <p>
              <strong>Order #</strong> {String(order.id).padStart(6, "0")}
            </p>
            <p>
              <strong>Order date</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex flex-col sm:items-end sm:text-right">
          <p className="text-xs font-semibold text-green-700 mb-1">
            GET POINTS
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
            <button className="w-full sm:w-auto h-8 upfrica-btn-primary-outline-sm text-green-700">
              Mark as received
            </button>
            <button className="w-full sm:w-auto h-8 upfrica-btn-primary-outline-sm text-green-700">
              Write a review
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Tracker */}
      <DeliveryTracker
        stage={item.receive_status === 1 ? 2 : 1}
        steps={[
          {
            label: "Ordered",
            date: new Date(order.created_at).toLocaleDateString(),
          },
          { label: "Dispatched", date: "Soon" },
          {
            label: "Delivered",
            note: item.receive_status === 1 ? "Delivered" : "Not confirmed",
          },
        ]}
      />

      {/* Tracking */}
      <div className="mt-4 text-sm">
        <p>
          <strong>Tracking details</strong> &nbsp;{" "}
          {order.tracking_number || "N/A"}
        </p>
      </div>

      {/* Product Info */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Item info</h3>
        <div className="flex items-start gap-4">
          <img
            src={product?.product_images?.[0] || "/placeholder.png"}
            alt={product?.title}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <p className="font-medium">{product.title}</p>
            <p className="text-sm">Seller item no.: {product.id}</p>
            <p className="text-sm">GHS {(item.price_cents / 100).toFixed(2)}</p>
            <p className="text-xs text-gray-500">
              Returns accepted until 12 May
            </p>
          </div>
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-1">Delivery info</h4>
          <div className="flex items-center gap-2 text-gray-700">
            <AiOutlineHome />
            <span>
              {showFullInfo
                ? order.address.address_data.address_line_1
                : `${order.address.address_data.town}, ${order.address.address_data.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mt-1">
            <AiOutlineUser />
            <span>
              {showFullInfo
                ? `${order.buyer.first_name} ${order.buyer.last_name}`
                : `${order.buyer.first_name} ${order.buyer.last_name[0]}.`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mt-1">
            <AiOutlinePhone />
            <span>
              {showFullInfo
                ? order.address.address_data.phone_number
                : "+233 *** ****"}
            </span>
          </div>
          <button
            onClick={() => setShowFullInfo(!showFullInfo)}
            className="text-purple-600 underline mt-2 text-sm"
          >
            {showFullInfo ? "Hide full address" : "View full address"}
          </button>
        </div>

        <div>
          <h4 className="font-semibold mb-1">Payment method</h4>
          <p>{order.payment_method || "N/A"}</p>
          <p>
            1 item &nbsp;&nbsp;&nbsp;&nbsp; +
            {(item.price_cents / 100).toFixed(2)}
          </p>
          <p>Discount &nbsp;&nbsp;&nbsp;&nbsp; -0.00</p>
          <p>Postage &nbsp;&nbsp;&nbsp;&nbsp; 0.00</p>
          <p className="font-semibold">
            Total &nbsp;&nbsp;&nbsp;&nbsp; GHS{" "}
            {((item.price_cents * item.quantity) / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

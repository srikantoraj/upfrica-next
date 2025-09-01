"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "@/app/constants";
import DeliveryTracker from "../components/DeliveryTracker";
import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [showFullInfo, setShowFullInfo] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      setLoadingOrder(true);
      try {
        const res = await fetch(`${BASE_API_URL}/api/buyer/orders/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
        const data = await res.json();
        setOrder(data);
        setItems(
          data.order_items.map((it) => ({
            ...it,
            loading: false,
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [id, token]);

  const handleMarkReceived = async (itemId) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, loading: true } : it)),
    );
    try {
      const res = await fetch(
        `${BASE_API_URL}/api/buyer/order-item/${itemId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receive_status: 1 }),
        },
      );
      if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, receive_status: 1, loading: false } : it,
        ),
      );
    } catch (err) {
      console.error(err);
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, loading: false } : it)),
      );
    }
  };

  const orderTotal = items.reduce(
    (sum, it) => sum + (it.price_cents * it.quantity) / 100,
    0,
  );

  if (loadingOrder) return <div className="text-center p-6">Loading...</div>;
  if (!order)
    return <div className="text-center text-red-600 p-6">Order not found.</div>;

  return (
    <div className="bg-white shadow rounded-xl p-4 max-w-3xl mx-auto mt-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 bg-gray-50 p-4 rounded-md">
        <div>
          <p className="font-bold text-lg">
            Order #{String(order.id).padStart(6, "0")}
          </p>
          <p className="text-sm text-gray-700">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="text-sm text-gray-700">
          <p>{items.length} item(s)</p>
          <p className="font-semibold">Total: GHS {orderTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Order Items */}
      {items.map((item) => {
        const product = item.product;
        const received = item.receive_status === 1;

        return (
          <div key={item.id} className="mt-6 border rounded-md p-4">
            {/* Status & Item ID */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <p
                  className={`font-bold ${
                    received ? "text-green-700" : "text-orange-500"
                  }`}
                >
                  {received ? "✅ Received" : "🕒 Processing"}
                </p>
                <p className="text-xs text-gray-500">Item ID: {item.id}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to mark this item as received?",
                      )
                    ) {
                      handleMarkReceived(item.id);
                    }
                  }}
                  disabled={received || item.loading}
                  className="upfrica-btn-primary-outline-sm text-green-700 h-8 flex justify-center items-center"
                >
                  {item.loading ? (
                    <div className="flex space-x-2 justify-center items-center h-6">
                      <div className="h-2 w-2 bg-violet-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 bg-violet-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 bg-violet-700 rounded-full animate-bounce" />
                    </div>
                  ) : (
                    "Mark as received"
                  )}
                </button>

                <button
                  onClick={() => console.log("Review item", item.id)}
                  className="upfrica-btn-primary-outline-sm text-green-700 h-8"
                >
                  Write a review
                </button>
              </div>
            </div>

            {/* Delivery Tracker */}
            <DeliveryTracker
              stage={received ? 2 : 1}
              steps={[
                {
                  label: "Ordered",
                  date: new Date(order.created_at).toLocaleDateString(),
                },
                { label: "Dispatched", date: "Soon" },
                {
                  label: "Delivered",
                  note: received ? "Delivered" : "Not confirmed",
                },
              ]}
            />

            {/* Tracking */}
            <div className="mt-2 text-sm">
              <strong>Tracking:</strong> {order.tracking_number || "N/A"}
            </div>

            {/* Product Info */}
            <div className="mt-4 flex items-start gap-4">
              <img
                src={product.product_images?.[0] || "/placeholder.png"}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{product.title}</p>
                <p className="text-sm">Seller Item No.: {product.id}</p>
                <p className="text-sm">
                  GHS {(item.price_cents / 100).toFixed(2)} × {item.quantity}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Delivery & Payment Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* Delivery Info */}
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
            onClick={() => setShowFullInfo((f) => !f)}
            className="text-purple-600 underline mt-2 text-sm"
          >
            {showFullInfo ? "Hide full address" : "View full address"}
          </button>
        </div>

        {/* Payment Summary */}
        <div>
          <h4 className="font-semibold mb-1">Payment method</h4>
          <p>{order.payment_method || "N/A"}</p>
          <p>
            Items ({items.length}) &nbsp;&nbsp;&nbsp;&nbsp; GHS{" "}
            {orderTotal.toFixed(2)}
          </p>
          <p>Discount &nbsp;&nbsp;&nbsp;&nbsp; -GHS 0.00</p>
          <p>Postage &nbsp;&nbsp;&nbsp;&nbsp; GHS 0.00</p>
          <p className="font-semibold">
            Total &nbsp;&nbsp;&nbsp;&nbsp; GHS {orderTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

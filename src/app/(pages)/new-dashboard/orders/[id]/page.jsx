"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "@/app/constants";
import OrderDeliveryTracker from "../components/DeliveryTracker";
import SellerOrderBlock from "../components/SellerOrderBlock";
import BuyerInfoBlock from "../components/BuyerInfoBlock";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [receivedStatus, setReceivedStatus] = useState([]);



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

        const grouped = groupItems(data.order_items || []);
        setReceivedStatus(grouped.map(() => false));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading)
    return (
      <div className="text-center p-6 text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
if (!order)
  return <div className="text-center text-red-600 p-6">Order not found.</div>;

const createdDate = new Date(order.created_at);
const groupedItems = groupItems(order.order_items || []);
const totalAmount = order.order_items?.reduce(
  (sum, item) => sum + ((item.price_cents || 0) * item.quantity) / 100,
  0,
);

const myReviews = order.reviews || []; // ✅ FIXED: moved here

  const handleConfirmAt = (index) => {
    setReceivedStatus((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const handleUndoAt = (index) => {
    setReceivedStatus((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const allConfirmed = receivedStatus.every((r) => r === true);
  const anyDispatched = receivedStatus.some((r) => r === true);
  const orderStage = allConfirmed ? 2 : anyDispatched ? 1 : 0;

  const steps = [
    { label: "Ordered", date: createdDate.toLocaleDateString() },
    { label: "Dispatched", note: "Soon" },
    {
      label: "Delivered",
      note: allConfirmed ? "Confirmed" : "Pending confirmation",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-0">
      {/* Order Summary Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-green-600 font-bold text-lg">✅ Processing</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Order #</strong> {order.order_number || id}
            <br />
            <strong>Date</strong> {createdDate.toLocaleString()}
          </p>
        </div>

        <div className="text-right flex flex-col items-end">
          {!allConfirmed && (
            <button className="upfrica-btn-outline-sm text-green-600">
              Mark as received
            </button>
          )}
          <button
            className={`mt-2 upfrica-btn-outline-sm ${
              allConfirmed
                ? "text-purple-600"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={!allConfirmed}
          >
            Write a review
          </button>
        </div>
      </div>

      {/* Delivery Tracker */}
      <OrderDeliveryTracker stage={orderStage} steps={steps} />

      {/* Tracking Summary */}
      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        <strong>Tracking:</strong>{" "}
        {groupedItems.length > 1
          ? "Multiple tracking numbers — see below"
          : "N/A"}
      </p>

      {/* Buyer Info */}
      <div className="mt-6">
        <BuyerInfoBlock
          order={order}
          showFullInfo={showFullInfo}
          setShowFullInfo={setShowFullInfo}
        />
      </div>

{/* Seller Order Blocks */}
<div className="mt-6">
  {groupedItems.map(([sellerName, items], index) => (
    <SellerOrderBlock
      key={index}
      sellerName={sellerName}
      items={items}
      estimatedDelivery={items[0]?.estimated_delivery || "N/A"}
      trackingNumber={items[0]?.tracking_number || "N/A"}
      onConfirm={() => handleConfirmAt(index)}
      onUndo={() => handleUndoAt(index)}
      myReviews={myReviews} // ✅ FIXED: pass down reviews
    />
  ))}
</div>

      {/* Total */}
      <div className="text-right mt-8 font-semibold text-lg text-gray-800 dark:text-gray-100">
        Total: GHS {totalAmount.toFixed(2)}
      </div>
    </div>
  );
}

// Utility to group items by seller
function groupItems(items) {
  const grouped = items.reduce((acc, item) => {
    const sellerName =
      item.product?.seller_info?.username ||
      item.product?.user?.username ||
      "Unknown Seller";
    if (!acc[sellerName]) acc[sellerName] = [];
    acc[sellerName].push(item);
    return acc;
  }, {});
  return Object.entries(grouped);
}

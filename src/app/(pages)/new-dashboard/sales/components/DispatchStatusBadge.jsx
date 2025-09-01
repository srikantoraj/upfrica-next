// components/DispatchStatusBadge.jsx
import React from "react";

const DispatchStatusBadge = ({ order }) => {
  if (!order || !order.items || order.items.length === 0) return null;

  const dispatchedCount = order.items.filter((i) => i.dispatched).length;
  const totalItems = order.items.length;
  const isPaid = order.payment_status?.toLowerCase() === "paid";

  const paidAt = order.payment_completed_at
    ? new Date(order.payment_completed_at)
    : null;
  const now = new Date();
  const daysSincePaid = paidAt ? (now - paidAt) / (1000 * 60 * 60 * 24) : 0;

  const isOverdue = isPaid && dispatchedCount === 0 && daysSincePaid > 3;

  if (!isPaid) {
    return (
      <span className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium">
        ❌ Unpaid
      </span>
    );
  }

  if (dispatchedCount === totalItems && totalItems > 0) {
    return (
      <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
        ✅ All Items Dispatched
      </span>
    );
  }

  if (isOverdue) {
    return (
      <span
        className="text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold animate-pulseRed border border-red-300 bg-red-100"
        title={`Paid ${Math.floor(daysSincePaid)} days ago, no items dispatched`}
      >
        ⚠️ Dispatch Overdue
      </span>
    );
  }

  if (dispatchedCount > 0) {
    return (
      <span className="bg-orange-400 text-white px-4 py-1.5 rounded-full text-sm font-medium">
        🟡 {dispatchedCount}/{totalItems} Dispatched
      </span>
    );
  }

  return (
    <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-sm font-medium">
      🚚 Pending Dispatch
    </span>
  );
};

export default DispatchStatusBadge;
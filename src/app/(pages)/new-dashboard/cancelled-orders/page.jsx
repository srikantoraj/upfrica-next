// app/cancelled-orders/page.tsx or pages/cancelled-orders.tsx

import React from "react";
import { MdRemoveShoppingCart } from "react-icons/md";

function CancelledOrders() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <MdRemoveShoppingCart className="text-7xl text-gray-500 mb-6" />
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        No Cancelled Orders !
      </h1>
      <p className="text-gray-600 mt-3 max-w-md">
        You currently have no cancelled orders from buyers. When a buyer cancels
        an order, it will appear here for your review and further action if
        needed.
      </p>
    </div>
  );
}

export default CancelledOrders;

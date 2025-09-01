"use client";

import React, { useState, Fragment } from "react";

import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import OrderDetailsModal from "./OrderDetailsModal";

const fallbackImage =
  "https://d3q0odwafjkyv1.cloudfront.net/50g59dwfx74fq23f6c2p5noqotgo";

const initialOrders = [
  {
    id: "0000507",
    buyer_name: "massfold uk",
    buyer_email: "masfolduk@gmail.com",
      shipping_name: "Charles K Wiredu",
  shipping_address: {
    line1: "12 Cocoa Avenue",
    city: "Accra",
    country: "Ghana"
  },
    status: "Processing",
    order_date: "23/05/2024",
    total: "120.00",
    payment_status: "Paid",
    payment_completed_at: "Jan 22, 2024 11:17 AM",
    dispatched: false,
    dispatch_info: {},
    order_items: [
      {
        id: 1,
        product_title: "Blender Portable Mini Blender 380ml for shakes and smoothies",
        product_image: fallbackImage,
        quantity: 1,
        price: 60,
      },
      {
        id: 2,
        product_title: "Natural Shea Butter – 200g",
        product_image: fallbackImage,
        quantity: 2,
        price: 30,
      },
    ],
  },
  {
    id: "0000508",
    buyer_name: "Akosua Adepa",
    buyer_email: "akosua@gmail.com",
      shipping_name: "Akosua Adepa", // ✅ add this
  shipping_address: {            // ✅ and this
    line1: "14 Spintex Road",
    city: "Tema",
    country: "Ghana",
  },
    status: "Pending",
    order_date: "20/05/2024",
    total: "85.00",
    payment_status: "Unpaid",
    payment_completed_at: null,
    dispatched: true,
    dispatch_info: {
      dispatchDate: "2024-05-22T11:00",
      carrier: "Ghana Post",
      trackingNumber: "GH123456789",
      trackingLink: "https://example.com/track",
      notes: "Delivered to front desk",
    },
    order_items: [
      {
        id: 3,
        product_title: "Natural Shea Butter – 200g",
        product_image: fallbackImage,
        quantity: 2,
        price: 85,
      },
    ],
  },
];

export default function SalesPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingSheetOpen, setIsTrackingSheetOpen] = useState(false);
  const [showAddressMap, setShowAddressMap] = useState({});
  const [dispatchForm, setDispatchForm] = useState({
    dispatchDate: "",
    carrier: "",
    trackingNumber: "",
    trackingLink: "",
    notes: "",
  });


const formatDate = (ts) => {
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const openTrackingSheet = (order, item) => {
  setSelectedOrder(order);
  setSelectedItem(item); // ✅ now valid
  setDispatchForm({
    dispatchDate: "",
    carrier: "",
    trackingNumber: "",
    trackingLink: "",
    notes: "",
  });
  setIsTrackingSheetOpen(true);
};

  const [selectedItem, setSelectedItem] = useState(null); // 👈 for per-item tracking
  const [isSubmitting, setIsSubmitting] = useState(false);


const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
const [activeOrder, setActiveOrder] = useState(null);

const handleViewDetails = (order) => {
  setActiveOrder(order);
  setOrderDetailsOpen(true);
};

const handleDispatchSubmit = () => {
  const { dispatchDate, carrier, trackingNumber } = dispatchForm;
  if (!dispatchDate || !carrier || !trackingNumber) {
    toast.error("Please fill in dispatch date, carrier, and tracking number.");
    return;
  }

  setIsSubmitting(true); // Start loading

  // Simulate API delay (or wrap your actual API call here)
  setTimeout(() => {
    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const updatedItems = order.order_items.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                dispatched: true,
                dispatch_info: { ...dispatchForm },
              }
            : item
        );

        const isFullyDispatched = updatedItems.every((item) => item.dispatched);

        return {
          ...order,
          order_items: updatedItems,
          dispatched: isFullyDispatched,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setIsTrackingSheetOpen(false);
    setIsSubmitting(false); // Stop loading
    toast.success("Item marked as dispatched.");
  }, 1000); // Simulate 1 second delay
};


const getDispatchStatusBadge = (order) => {
  const dispatchedCount = order.order_items.filter((i) => i.dispatched).length;
  const totalItems = order.order_items.length;
  const isPaid = order.payment_status === "Paid";

  // Parse payment completed date
  const paidAt = order.payment_completed_at
    ? new Date(order.payment_completed_at)
    : null;

  const now = new Date();
  const daysSincePaid = paidAt ? (now - paidAt) / (1000 * 60 * 60 * 24) : 0;

  const isOverdue = isPaid && dispatchedCount === 0 && daysSincePaid > 3;

  if (!isPaid) {
    return (
      <span className="bg-gray-300 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium">
        ❌ Unpaid
      </span>
    );
  }

  if (dispatchedCount === totalItems) {
    return (
      <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
        ✅ All Items Dispatched
      </span>
    );
  }

  if (isOverdue) {
    return (
<span className="text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold animate-pulseRed border border-red-300 bg-red-100">
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

  const renderPaymentStatus = (status, date) => (
    <>
      <p className="font-semibold text-sm">
        Payment:{" "}
        <span
          title={status === "Paid" && date ? `Payment completed at: ${date}` : ""}
          className={status === "Paid" ? "text-green-500" : "text-red-500"}
        >
          {status === "Paid" ? "✅ Paid" : "❌ Unpaid"}
        </span>
      </p>
      {status === "Paid" && date && (
        <p className="text-xs text-gray-600 dark:text-gray-400">Payment completed at: {date}</p>
      )}
    </>
  );

  const toggleAddress = (orderId) => {
  setShowAddressMap((prev) => ({
    ...prev,
    [orderId]: !prev[orderId],
  }));
};

const filteredOrders = orders.filter(
  (o) =>
    o.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.includes(searchQuery)
);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-6 text-black dark:text-white">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-2/3">
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sales by buyer name or order #..."
            className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-2 text-sm"
          />
          {searchQuery && (
            <AiOutlineClose
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        <select className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm">
          <option>All Time</option>
          <option>Last 30 Days</option>
          <option>Past 3 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        My Sales ({filteredOrders.length})
      </h1>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No sales found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5 shadow-sm"
            >




<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
  {/* Left: Order Status */}
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
        ✅ Processing
      </span>
    </div>
<p className="font-semibold mt-2">Order # {order.id}</p>
<p className="text-sm text-gray-600">Date: {order.order_date}</p>
  </div>

  {/* Right: Dispatch & Payment */}
  <div className="text-right">
    <p><span className="font-semibold">Dispatch To:</span> {order.shipping_name}</p>

    {/* Hidden address with reveal */}
{showAddressMap[order.id] ? (
  <Transition
    show={showAddressMap[order.id]}
    enter="transition-opacity duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition-opacity duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <p className="text-sm text-gray-600 mt-1">
      {order.shipping_address?.line1}, {order.shipping_address?.city},{" "}
      {order.shipping_address?.country}
      <br />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shipping_address?.line1 + ', ' + order.shipping_address?.city + ', ' + order.shipping_address?.country)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View on Map →
      </a>
    </p>
  </Transition>
) : (
  <button
    onClick={() => toggleAddress(order.id)}
    className="text-sm text-blue-600 underline hover:text-blue-800"
  >
    Show Delivery Address →
  </button>
)}

    <p className="mt-2">
      <strong>Payment:</strong>{" "}
      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
        ✅ Paid
      </span>
    </p>
<p className="text-xs text-gray-500">Completed at: {formatDate(order.payment_completed_at)}</p>
  </div>
</div>


              
<div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
  {order.order_items.map((item) => (
<div
  key={item.id}
  className="flex items-center justify-between gap-4 text-sm rounded-md border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm"
>
      <div className="flex items-center gap-4">
        <Image
          src={item.product_image}
          alt={item.product_title}
          width={48}
          height={48}
          className="rounded-md border object-cover"
        />
        <div>
          <p className="font-medium line-clamp-1">{item.product_title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>

{!item.dispatched ? (
  order.payment_status === "Paid" ? (
    <button
      onClick={() => openTrackingSheet(order, item)}
      className="bg-yellow-400 text-black px-3 py-1 rounded text-xs mt-1"
    >
      Mark as Dispatched
    </button>
  ) : (
    <p className="text-xs text-red-500 italic mt-1">Cannot dispatch unpaid order</p>
  )
) : (
  <div className="text-green-600 text-xs font-semibold mt-1 block space-y-0.5">
    ✅ Dispatched
{item.dispatch_info && (
  <div className="text-[11px] text-gray-500 dark:text-gray-300 font-normal space-y-0.5">
    {item.dispatch_info.carrier && item.dispatch_info.dispatchDate && (
      <p>
        <span className="font-semibold">{item.dispatch_info.carrier}</span> –{" "}
        {new Date(item.dispatch_info.dispatchDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    )}

    {item.dispatch_info.trackingNumber && (
      <p>Tracking #: {item.dispatch_info.trackingNumber}</p>
    )}

    {item.dispatch_info.trackingLink && (
      <a
        href={item.dispatch_info.trackingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline hover:text-blue-700"
      >
        Track Package →
      </a>
    )}

    {item.dispatch_info.notes && (
      <p className="italic text-gray-400">“{item.dispatch_info.notes}”</p>
    )}
  </div>
)}
  </div>
)}
        </div>
      </div>
      <div className="font-semibold text-sm text-right whitespace-nowrap">
        GHS {item.price}
      </div>
    </div>
  ))}
</div>

              <div className="flex flex-col sm:flex-row sm:justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-right sm:text-left font-semibold text-lg">
                  <span className="text-gray-400 dark:text-gray-300 text-sm mr-1">Total:</span>
                  <span className="text-gray-800 dark:text-white">GHS {order.total}</span>
                </div>
<div className="flex gap-2 mt-2 sm:mt-0">
<button
  onClick={() => handleViewDetails(order)}
  className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium"
>
  View Details
</button>





<div className="transition duration-300 ease-in-out">
  {getDispatchStatusBadge(order)}
</div>


</div>
              </div>
            </div>
          ))}
        </div>
      )}



<OrderDetailsModal
  isOpen={orderDetailsOpen}
  onClose={() => setOrderDetailsOpen(false)}
  order={activeOrder}
/>





      {/* Dispatch Bottom Sheet */}
      
      <Transition show={isTrackingSheetOpen} as={Fragment}>
 <Dialog as="div" className="relative z-50" onClose={() => setIsTrackingSheetOpen(false)}>
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

  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="translate-y-full"
    enterTo="translate-y-0"
    leave="ease-in duration-200"
    leaveFrom="translate-y-0"
    leaveTo="translate-y-full"
  >
    <Dialog.Panel className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-t-2xl p-6 flex justify-center shadow-lg">
      <div className="w-full max-w-md">
        {/* content starts here */}
        <div className="flex justify-between items-center mb-4">
          <Dialog.Title className="text-lg font-semibold">Mark as Dispatched</Dialog.Title>
          <button
            onClick={() => setIsTrackingSheetOpen(false)}
            className="text-gray-400 hover:text-black dark:hover:text-white text-xl"
            aria-label="Close"
          >
            <AiOutlineClose />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="datetime-local"
            value={dispatchForm.dispatchDate}
            onChange={(e) =>
              setDispatchForm({ ...dispatchForm, dispatchDate: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-md"
          />
          <select
            className="w-full border px-3 py-2 rounded-md"
            value={dispatchForm.carrier}
            onChange={(e) =>
              setDispatchForm({ ...dispatchForm, carrier: e.target.value })
            }
          >
            <option value="">Select Carrier</option>
            <option>Ghana Post</option>
            <option>DHL</option>
            <option>FedEx</option>
          </select>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Tracking Number"
            value={dispatchForm.trackingNumber}
            onChange={(e) =>
              setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Tracking Link (optional)"
            value={dispatchForm.trackingLink}
            onChange={(e) =>
              setDispatchForm({ ...dispatchForm, trackingLink: e.target.value })
            }
          />
          <textarea
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Additional Notes (optional)"
            value={dispatchForm.notes}
            onChange={(e) =>
              setDispatchForm({ ...dispatchForm, notes: e.target.value })
            }
          />
        </div>
<button
  onClick={handleDispatchSubmit}
  disabled={isSubmitting}
  className={`mt-6 w-full py-2 rounded-md ${
    isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
  } text-white`}
>
  {isSubmitting ? "Saving..." : "Save & Mark as Dispatched"}
</button>
      </div>
    </Dialog.Panel>
  </Transition.Child>
</Dialog>
      </Transition>

    </div>
  );
}
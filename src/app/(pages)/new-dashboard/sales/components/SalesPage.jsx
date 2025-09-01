///Part 1: Setup & Imports
"use client";

import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import OrderDetailsModal from "./OrderDetailsModal";
import DispatchInfo from "./DispatchInfo";
import { BASE_API_URL, SITE_BASE_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

const fallbackImage =
  "https://d3q0odwafjkyv1.cloudfront.net/50g59dwfx74fq23f6c2p5noqotgo";

/* ---------- image helpers ---------- */
function fixImageUrl(u) {
  if (!u) return "";

  let s = String(u).trim();

  // 1) Repair glued CloudFront host (…cloudfront.netdirect_uploads/… → …cloudfront.net/direct_uploads/…)
  s = s.replace(/([a-z0-9.-]*cloudfront\.net)(?=[^/])/i, "$1/");

  // 2) Already absolute (http/https/data:) → return (after the CloudFront fix above)
  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:")) return s;

  // 3) Relative media paths → make absolute using API base
  const api = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (!api) return s; // last resort

  // “/media/…”
  if (/^\/?media\//i.test(s)) return `${api}/${s.replace(/^\//, "")}`;

  // Common ActiveStorage-style keys → point to /media/<key>
  if (/^(direct_uploads|uploads|active_storage|attachments)\//i.test(s)) {
    return `${api}/media/${s}`;
  }

  return s; // unknown case: return as-is
}

function pickProductImage(item) {
  // Try common fields from your payload
  const candidate =
    item?.product?.image_objects?.[0]?.image_url ||
    item?.product?.product_image_url ||
    item?.product?.thumbnail ||
    item?.product?.image_url ||
    item?.product_image || // your grouped field
    "";

  return fixImageUrl(candidate) || fallbackImage;
}

/* A next/image wrapper that falls back on error */
function SafeImage({ src, alt, fallback = fallbackImage, ...props }) {
  const [imgSrc, setImgSrc] = React.useState(fixImageUrl(src) || fallback);
  useEffect(() => {
    setImgSrc(fixImageUrl(src) || fallback);
  }, [src, fallback]);
  return (
    <Image
      src={imgSrc}
      alt={alt || "Image"}
      onError={() => setImgSrc(fallback)}
      {...props}
    />
  );
}

////Part 2: Component State and Utilities
export default function SalesPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTrackingSheetOpen, setIsTrackingSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showAddressMap, setShowAddressMap] = useState({});
  const [bulkMode, setBulkMode] = useState(false);
  const [orderToDispatchAll, setOrderToDispatchAll] = useState(null);

  const [dispatchForm, setDispatchForm] = useState({
    dispatchDate: "",
    dispatchTime: "",
    carrier: "",
    trackingNumber: "",
    trackingLink: "",
    notes: "",
  });

  const cleanToken = getCleanToken();

  const formatDate = (ts) => {
    const date = new Date(ts);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Part 3. Fetching Real API Data & Grouping by OrderGroup
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/order-items/`, {
        headers: {
          Authorization: `Token ${cleanToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const orderItems = Array.isArray(data) ? data : data.results || [];

      const grouped = {};

      for (const item of orderItems) {
        const group = item.order_group || {};
        const orderId = group.id || item.order?.id || `unknown-${item.id}`;

        const orderCode =
          group.order_code ||
          item.order?.order_code ||
          item.order?.id ||
          `unknown-${item.id}`;

        const orderDate =
          group.created_at || item.order?.created_at || item.created_at || null;

        if (!grouped[orderId]) {
          grouped[orderId] = {
            id: orderId,
            order_code: orderCode,
            order_date: orderDate,
            buyer_phone: group.buyer_phone || item.order?.buyer_phone || "",
            buyer_note: group.buyer_note || item.order?.buyer_note || "",
            payment_status:
              group.payment_status_display ||
              (group.payment_method === "manual" ? "Unpaid" : "Paid"),
            payment_completed_at:
              group.payment_completed_at || item.order?.payment_completed_at || null,
            shipping_name:
              group.shipping_name || item.shipping_address?.full_name || "Unknown",
            shipping_address:
              item.shipping_address || {
                line1: "—",
                city: "",
                region: "",
                postcode: "",
                country: "Ghana",
              },
            total: 0,
            order_items: [],
          };
        }

        // ✅ Sum frozen totals
        grouped[orderId].total += item.total_price || 0;

        grouped[orderId].order_items.push({
          id: item.id,
          product_title: item.product?.title || "Untitled Product",
          product_image: pickProductImage(item), // 👈 fixed URL chosen here
          product_url: item.product?.frontend_url_full || "#",
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          shipping_fee: item.shipping_fee || 0,
          total_price: item.total_price || 0,
          dispatched: item.dispatch_status === 1,
          dispatch_info: item.tracking_data || {},
          shipping_address: item.shipping_address || {},
        });
      }

      setOrders(Object.values(grouped));
    } catch (error) {
      toast.error("❌ Failed to load orders.");
      console.error("Fetch error:", error);
    }
  };

  // Run once cleanToken is available
  useEffect(() => {
    if (!cleanToken) return;
    fetchOrders();
  }, [cleanToken]);

  useEffect(() => {
    orders.forEach((o) => {
      console.log("🧾 Order:", o.order_code);
      console.log("➡️ Shipping Name:", o.shipping_name);
      console.log("➡️ Shipping Address Name:", o.shipping_address?.full_name);
    });
  }, [orders]);

  const formatAddress = (address) => {
    if (!address) return "—";
    return [address.full_name, address.line1, address.city, address.region, address.country]
      .filter(Boolean)
      .join(", ");
  };

  // Part 4: Dispatch Submission Logic & Modals
  const openTrackingSheet = (order, item) => {
    setBulkMode(false);
    setSelectedOrder(order);
    setSelectedItem(item);
    setDispatchForm({
      dispatchDate: "",
      dispatchTime: "",
      carrier: "",
      trackingNumber: "",
      trackingLink: "",
      notes: "",
    });
    setIsTrackingSheetOpen(true);
  };

  const openBulkTrackingSheet = (order) => {
    setBulkMode(true);
    setOrderToDispatchAll(order);
    setDispatchForm({
      dispatchDate: "",
      dispatchTime: "",
      carrier: "",
      trackingNumber: "",
      trackingLink: "",
      notes: "",
    });
    setIsTrackingSheetOpen(true);
  };

  const undoDispatch = async (order, item) => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/orders/${order.id}/dispatch/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${cleanToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: item.id, undo: true }),
      });

      if (!res.ok) throw new Error("Failed to undo dispatch");
      const result = await res.json();
      updateOrdersWithDispatchedItems(order.id, result.updated_items || []);
      toast.success(`✅ Dispatch undone for "${item.product_title}".`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateOrdersWithDispatchedItems = (orderId, updatedItems) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              order_items: order.order_items.map((item) => {
                const updatedItem = updatedItems.find((ui) => ui.id === item.id);
                return updatedItem
                  ? {
                      ...item,
                      dispatched: updatedItem.dispatch_status === 1,
                      dispatch_status: updatedItem.dispatch_status,
                      dispatch_info: updatedItem.tracking_data || {},
                    }
                  : item;
              }),
            }
          : order
      )
    );
  };

  const handleDispatchSubmit = async () => {
    const { dispatchDate, dispatchTime, carrier, trackingNumber, trackingLink, notes } =
      dispatchForm;

    const fullDateTime = dispatchDate ? `${dispatchDate}T${dispatchTime || "09:00"}` : "";

    if (!fullDateTime || !carrier.trim()) {
      toast.error("Please fill in dispatch date and carrier.");
      return;
    }

    const payload = {
      dispatchDate: fullDateTime,
      carrier: carrier.trim(),
      trackingNumber: (trackingNumber || "").trim(),
      trackingLink: (trackingLink || "").trim(),
      notes: (notes || "").trim(),
    };

    setIsSubmitting(true);
    try {
      const orderId = bulkMode ? orderToDispatchAll.id : selectedOrder.id;

      const res = await fetch(`${BASE_API_URL}/api/orders/${orderId}/dispatch/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${cleanToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bulkMode ? payload : { ...payload, item_id: selectedItem.id }),
      });

      if (!res.ok) throw new Error(`Failed to dispatch`);

      const result = await res.json();
      updateOrdersWithDispatchedItems(orderId, result.updated_items || []);
      fetchOrders(); // extra sync

      toast.success(
        bulkMode
          ? `✅ All ${orderToDispatchAll.order_items.length} items marked as dispatched.`
          : `✅ Item "${selectedItem.product_title}" marked as dispatched.`
      );

      setIsTrackingSheetOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (order) => {
    setActiveOrder(order);
    setOrderDetailsOpen(true);
  };

  const toggleAddress = (orderId) => {
    setShowAddressMap((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // 🧩 Part 5: Badges
  const getPaymentStatusBadge = (status) =>
    status === "Paid" ? (
      <span className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm">
        ✅ Paid
      </span>
    ) : (
      <span className="bg-red-100 text-red-600 font-semibold px-3 py-1 rounded-full text-sm">
        ❌ Unpaid
      </span>
    );

  const getDispatchStatusBadge = (order) => {
    const dispatchedCount = order.order_items.filter((i) => i.dispatched).length;
    const totalItems = order.order_items.length;
    const isPaid = order.payment_status === "Paid";
    const paidAt = order.payment_completed_at ? new Date(order.payment_completed_at) : null;
    const daysSincePaid = paidAt ? (new Date() - paidAt) / (1000 * 60 * 60 * 24) : 0;
    const isOverdue = isPaid && dispatchedCount === 0 && daysSincePaid > 3;

    if (!isPaid) return null;
    if (dispatchedCount === totalItems) {
      return (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border border-green-500 text-green-600 hover:bg-green-50 transition-colors">
          ✅ All Dispatched
        </span>
      );
    }
    if (isOverdue) {
      return (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border border-red-500 text-red-600 hover:bg-red-50 transition-colors animate-pulse">
          ⚠️ Dispatch Overdue
        </span>
      );
    }
    if (dispatchedCount > 0) {
      return (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors">
          🟦 {dispatchedCount}/{totalItems} Dispatched
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border border-amber-500 text-amber-600 hover:bg-amber-50 transition-colors">
        🚚 Pending Dispatch
      </span>
    );
  };

  // Part 6: Filter
  const filteredOrders = orders.filter((o) => {
    if (!o || !Array.isArray(o.order_items) || o.order_items.length === 0) return false;

    const name = o.buyer_name || o.shipping_name || "";
    const id = o.id || o.order_code || "";
    const phone = o.buyer_phone || "";

    const address = o.order_items[0]?.shipping_address || {};
    const addressString = [address.line1, address.line2, address.city, address.region, address.postcode, address.country]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const query = searchQuery.toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      id.toString().includes(query) ||
      phone.toLowerCase().includes(query) ||
      addressString.includes(query)
    );
  });

  // Part 7: JSX
  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-12 py-6 text-black dark:text-white">
      <Toaster position="top-right" />

      {/* Search & Filter */}
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

      {/* Orders */}
      <h1 className="text-2xl font-bold mb-6 dark:text-white">My Sales ({filteredOrders.length})</h1>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No sales found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders
            .filter((order) => Array.isArray(order.order_items) && order.order_items.length > 0)
            .map((order) => (
              <div key={order.id} className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5 shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    {getPaymentStatusBadge(order.payment_status)}
                    <p className="font-semibold mt-2">Order #{order.id || "—"}</p>
                    <p className="text-sm text-gray-600">Order placed: {order.order_date ? formatDate(order.order_date) : "—"}</p>
                  </div>
                  <DispatchInfo order={order} onDispatchAll={openBulkTrackingSheet} />
                </div>

                {/* Items */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 mt-4">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 text-sm rounded-md border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm"
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-4">
                        <a href={item.product_url} target="_blank" rel="noopener noreferrer">
                          <SafeImage
                            src={item.product_image}
                            alt={item.product_title}
                            width={68}
                            height={68}
                            className="rounded-md border object-cover"
                            unoptimized
                          />
                        </a>
                        <div>
                          <p className="font-medium line-clamp-1">{item.product_title}</p>

                          {!item.dispatched ? (
                            order.payment_status === "Paid" ? (
                              <button
                                onClick={() => openTrackingSheet(order, item)}
                                className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1 rounded text-xs mt-1"
                              >
                                Mark as Dispatched
                              </button>
                            ) : (
                              <p className="text-xs text-red-500 italic mt-1">Cannot dispatch unpaid order</p>
                            )
                          ) : (
                            <div className="text-green-600 text-xs font-semibold mt-1 block space-y-0.5">
                              ✅ Dispatched
                              <button
                                onClick={() => undoDispatch(order, item)}
                                className="ml-2 text-red-500 underline text-[11px] hover:text-red-700"
                              >
                                Undo
                              </button>

                              {item.dispatch_info && (
                                <div className="text-[11px] text-gray-500 dark:text-gray-300 font-normal space-y-0.5">
                                  {item.dispatch_info.carrier && item.dispatch_info.dispatchDate && (
                                    <p>
                                      <span className="font-semibold">{item.dispatch_info.carrier}</span>{" "}
                                      – {new Date(item.dispatch_info.dispatchDate).toLocaleDateString()}
                                    </p>
                                  )}

                                  {item.dispatch_info.trackingNumber ? (
                                    <p>Tracking #: {item.dispatch_info.trackingNumber}</p>
                                  ) : (
                                    <span className="inline-block bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded text-[10px] font-medium">
                                      Not Tracked
                                    </span>
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

                                  {item.dispatch_info.notes && <p className="italic text-gray-400">“{item.dispatch_info.notes}”</p>}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="text-right whitespace-nowrap">
                        <div className="font-semibold">GHS {item.total_price?.toFixed(2) || "0.00"}</div>
                        <div className="text-xs text-gray-500">
                          {item.quantity} × GHS {item.unit_price?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-right sm:text-left font-semibold text-lg">
                    <span className="text-gray-400 dark:text-gray-300 text-sm mr-1">Total:</span>
                    <span className="text-gray-800 dark:text-white">GHS {order.total}</span>
                  </div>

                  <div className="flex gap-2 mt-2 sm:mt-0 items-center">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      View Details
                    </button>

                    <div className="transition duration-300 ease-in-out inline-flex items-center">
                      {getDispatchStatusBadge(order)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <OrderDetailsModal isOpen={orderDetailsOpen} onClose={() => setOrderDetailsOpen(false)} order={activeOrder} />

      {/* 📦 Dispatch Modal */}
      <Transition show={isTrackingSheetOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsTrackingSheetOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-50 backdrop-blur-md transition-opacity" />
          </Transition.Child>

          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="ease-in duration-200" leaveFrom="translate-y-0" leaveTo="translate-y-full">
            <Dialog.Panel className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-t-2xl p-6 flex justify-center shadow-lg">
              <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-semibold dark:text-gray-300">
                    {bulkMode ? "Dispatch All Items" : "Mark as Dispatched"}
                  </Dialog.Title>
                  <button onClick={() => setIsTrackingSheetOpen(false)} className="text-gray-400 hover:text-black dark:hover:text-white text-xl" aria-label="Close">
                    <AiOutlineClose />
                  </button>
                </div>

                {bulkMode && orderToDispatchAll && (
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-2">
                      You are dispatching{" "}
                      <strong>{orderToDispatchAll.order_items.filter((i) => !i.dispatched).length}</strong> items:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {orderToDispatchAll.order_items
                        .filter((i) => !i.dispatched)
                        .map((i) => (
                          <li key={i.id} className="whitespace-normal break-words leading-snug">
                            {i.product_title}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dispatchForm.dispatchDate}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, dispatchDate: e.target.value })}
                      className="w-1/2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded-md"
                    />
                    <input
                      type="time"
                      step="60"
                      value={dispatchForm.dispatchTime || ""}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, dispatchTime: e.target.value })}
                      className="w-1/2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded-md"
                    />
                  </div>

                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded-md"
                    value={dispatchForm.carrier}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, carrier: e.target.value })}
                  >
                    <option value="">Select Carrier</option>
                    <option>Ghana Post</option>
                    <option>DHL</option>
                    <option>FedEx</option>
                  </select>

                  <input
                    type="text"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-300 px-3 py-2 rounded-md"
                    placeholder="Tracking Number"
                    value={dispatchForm.trackingNumber}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })}
                  />

                  <input
                    type="text"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-300 px-3 py-2 rounded-md"
                    placeholder="Tracking Link (optional)"
                    value={dispatchForm.trackingLink}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, trackingLink: e.target.value })}
                  />

                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-300 px-3 py-2 rounded-md"
                    placeholder="Additional Notes (optional)"
                    value={dispatchForm.notes}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, notes: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleDispatchSubmit}
                  disabled={isSubmitting}
                  className={`mt-6 w-full py-2 rounded-md ${
                    isSubmitting ? "bg-purple-400 dark:bg-purple-500" : "bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500"
                  } text-white`}
                >
                  {isSubmitting ? "Saving..." : bulkMode ? "Save & Dispatch All" : "Save & Mark as Dispatched"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
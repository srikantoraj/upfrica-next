"use client";

import React, { useEffect, useMemo, useState, Fragment } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectToken } from "@/app/store/slices/userSlice";

/* -------------------------------------------------------
   Config
--------------------------------------------------------*/
const API_BASE =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_URL &&
    process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")) ||
  "https://api.upfrica.com";

const SITE_BASE =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")) ||
  "https://www.upfrica.com";

const fallbackImage =
  "https://d3q0odwafjkyv1.cloudfront.net/50g59dwfx74fq23f6c2p5noqotgo";

/* -------------------------------------------------------
   Auth helper (no dependency on your app utilities)
--------------------------------------------------------*/
function getAuthToken() {
  if (typeof window === "undefined") return "";
  return "aSJ36UapeFH5YARFamDTYhnJ"
}

/* -------------------------------------------------------
   Image helpers
--------------------------------------------------------*/
function fixImageUrl(u) {
  if (!u) return "";

  let s = String(u).trim();

  // Repair missing slash after host (e.g. https://cdn.upfrica.comdirect_uploads/…)
  s = s.replace(/^(https?:\/\/[^/]+)(?=[^/])/i, "$1/");

  // Already absolute / data URLs
  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:")) return s;

  // Relative media-ish paths → prefix with API base
  const api = API_BASE.replace(/\/$/, "");
  if (/^\/?media\//i.test(s)) return `${api}/${s.replace(/^\//, "")}`;
  if (/^(direct_uploads|uploads|active_storage|attachments)\//i.test(s)) {
    return `${api}/media/${s}`;
  }

  return s;
}

function pickProductImage(item) {
  // API gives: product.product_images: string[]
  const arr = item?.product?.product_images;
  const first = Array.isArray(arr) && arr.length > 0 ? arr[0] : "";
  return fixImageUrl(first) || fallbackImage;
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

/* -------------------------------------------------------
   Money & date helpers (no assumptions about "cents")
--------------------------------------------------------*/
function formatMoneyRaw(amount, currency) {
  const code = (currency || "").toUpperCase() || "GHS";
  const safeNum = typeof amount === "number" ? amount : Number(amount || 0);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      // Many values look already like "major units" in your payload, so don't divide.
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(safeNum);
  } catch {
    return `${code} ${safeNum.toLocaleString()}`;
  }
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/* -------------------------------------------------------
   Tiny UI bits
--------------------------------------------------------*/
function Pill({ children, color = "gray" }) {
  const map = {
    gray: "bg-gray-100 text-gray-700 border-gray-300",
    green: "bg-green-100 text-green-700 border-green-300",
    red: "bg-red-100 text-red-600 border-red-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    amber: "bg-amber-100 text-amber-800 border-amber-300",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${map[color] || map.gray}`}>
      {children}
    </span>
  );
}

/* -------------------------------------------------------
   Order Details Modal (inline self-contained)
--------------------------------------------------------*/
function OrderDetailsModal({ isOpen, onClose, order }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold mb-3">
                  Order #{order?.id ?? "—"}
                </Dialog.Title>

                {order ? (
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-gray-500">Order date</div>
                        <div className="font-medium">{formatDate(order.order_date)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Buyer</div>
                        <div className="font-medium">
                          {order.buyer?.first_name || order.buyer?.username || "—"}{" "}
                          {order.buyer?.last_name || ""}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-gray-500">Ship to</div>
                        <div className="font-medium">{order.address?.display_address || "—"}</div>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="font-semibold mb-2">Items</div>
                      <div className="space-y-2">
                        {order.order_items.map((it) => (
                          <div key={it.id} className="flex justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-medium">{it.product_title}</div>
                              <div className="text-xs text-gray-500">
                                Qty {it.quantity} • {formatMoneyRaw(it.unit_price, it.currency)}
                              </div>
                            </div>
                            <div className="text-right font-semibold">
                              {formatMoneyRaw(it.total_price, it.currency)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No data.</p>
                )}

                <div className="mt-6 text-right">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* -------------------------------------------------------
   Main Page
--------------------------------------------------------*/
export default function SalesPage() {
  const token = useSelector(selectToken);
  console.log("Auth token from Redux:", token);
  console.log("API Base URL:", API_BASE);
  const [groups, setGroups] = useState([]); // grouped by order_id
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Dispatch modal state
  const [isTrackingSheetOpen, setIsTrackingSheetOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [orderToDispatchAll, setOrderToDispatchAll] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    dispatchDate: "",
    dispatchTime: "",
    carrier: "",
    trackingNumber: "",
    trackingLink: "",
    notes: "",
  });
  

  // const token = getAuthToken();

  /* -------------------- fetch & normalize -------------------- */
  async function fetchPage(url, { append = false } = {}) {
    setLoading(true);
    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Token ${token}` } : {},
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      // Group by order_id
      const groupedMap = new Map();
      // If appending, seed with current groups
      if (append) {
        for (const g of groups) groupedMap.set(g.id, { ...g });
      }

      for (const item of items) {
        const orderId = item.order_id ?? `unknown-${item.id}`;
        const existing = groupedMap.get(orderId) || {
          id: orderId,
          order_date: item.order_date || null,
          buyer: item.buyer || null,
          address: item.address || null,
          order_items: [],
        };

        existing.order_items.push({
          id: item.id,
          quantity: item.quantity ?? 1,
          unit_price: item.price_cents ?? 0,
          total_price: (item.price_cents ?? 0) * (item.quantity ?? 1),
          currency: (item.price_currency || "GHS").toUpperCase(),
          dispatched: item.dispatch_status === 1,
          date_dispatched: item.date_dispatched || null,
          shipping_carrier: item.shipping_carrier || "",
          product_title: item.product?.title || "Untitled Product",
          product_image: pickProductImage(item),
          product_url:
            item.product?.canonical_url_db ||
            (item.product?.frontend_url_db
              ? `${SITE_BASE}${item.product.frontend_url_db}`
              : "#"),
        });

        // Keep latest order_date (max)
        if (!existing.order_date && item.order_date) existing.order_date = item.order_date;
        else if (existing.order_date && item.order_date) {
          if (new Date(item.order_date) > new Date(existing.order_date)) {
            existing.order_date = item.order_date;
          }
        }

        groupedMap.set(orderId, existing);
      }

      const next = data.next || null;
      const prev = data.previous || null;

      const newGroups = Array.from(groupedMap.values()).sort(
        (a, b) => new Date(b.order_date || 0) - new Date(a.order_date || 0)
      );

      setGroups(newGroups);
      setNextUrl(next);
      setPrevUrl(prev);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    if (!token) {
      toast.error("No auth token found (cookie 'up_auth' or env NEXT_PUBLIC_API_TOKEN).");
      return;
    }
    fetchPage(`${API_BASE}/api/seller/order-items/`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* -------------------- derived: filtered list -------------------- */
  const filteredGroups = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return groups;
    return groups.filter((g) => {
      const ID = String(g.id || "");
      const dateStr = formatDate(g.order_date);
      const addr = g.address?.display_address || [
        g.address?.full_name,
        g.address?.address_line_1,
        g.address?.address_line_2,
        g.address?.town,
        g.address?.state_or_region,
        g.address?.postcode,
        g.address?.country,
      ]
        .filter(Boolean)
        .join(", ");
      const buyer =
        [g.buyer?.first_name, g.buyer?.last_name, g.buyer?.username, g.buyer?.email]
          .filter(Boolean)
          .join(" ") || "";

      const products = g.order_items.map((i) => i.product_title).join(" ");

      return (
        ID.toLowerCase().includes(q) ||
        dateStr.toLowerCase().includes(q) ||
        addr.toLowerCase().includes(q) ||
        buyer.toLowerCase().includes(q) ||
        products.toLowerCase().includes(q)
      );
    });
  }, [groups, searchQuery]);

  /* -------------------- dispatch helpers -------------------- */
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

  function updateOrderItems(orderId, updater) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === orderId
          ? { ...g, order_items: g.order_items.map((it) => updater(it)) }
          : g
      )
    );
  }

  const undoDispatch = async (order, item) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${order.id}/dispatch/`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Token ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: item.id, undo: true }),
      });
      if (!res.ok) throw new Error("Failed to undo dispatch");
      // optimistic update
      updateOrderItems(order.id, (it) =>
        it.id === item.id
          ? { ...it, dispatched: false, date_dispatched: null, shipping_carrier: "" }
          : it
      );
      toast.success(`Dispatch undone for "${item.product_title}".`);
    } catch (err) {
      toast.error(err.message || "Failed to undo dispatch");
    }
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
      const body = bulkMode ? payload : { ...payload, item_id: selectedItem.id };

      const res = await fetch(`${API_BASE}/api/orders/${orderId}/dispatch/`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Token ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to dispatch");

      // Optimistic: mark items as dispatched locally
      if (bulkMode) {
        updateOrderItems(orderId, (it) =>
          it.dispatched
            ? it
            : {
              ...it,
              dispatched: true,
              date_dispatched: fullDateTime,
              shipping_carrier: carrier.trim(),
            }
        );
      } else {
        updateOrderItems(orderId, (it) =>
          it.id === selectedItem.id
            ? {
              ...it,
              dispatched: true,
              date_dispatched: fullDateTime,
              shipping_carrier: carrier.trim(),
            }
            : it
        );
      }

      toast.success(
        bulkMode
          ? `All ${orderToDispatchAll.order_items.filter((i) => !i.dispatched).length} items marked as dispatched.`
          : `Item "${selectedItem.product_title}" marked as dispatched.`
      );
      setIsTrackingSheetOpen(false);
    } catch (err) {
      toast.error(err.message || "Dispatch failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- UI helpers -------------------- */
  function getDispatchStatusBadge(order) {
    const dispatchedCount = order.order_items.filter((i) => i.dispatched).length;
    const total = order.order_items.length;

    if (total === 0) return null;
    if (dispatchedCount === total) return <Pill color="green">✅ All Dispatched</Pill>;
    if (dispatchedCount > 0)
      return <Pill color="blue">🟦 {dispatchedCount}/{total} Dispatched</Pill>;
    return <Pill color="amber">🚚 Pending Dispatch</Pill>;
  }

  function orderTotalsByCurrency(order) {
    const map = new Map();
    for (const it of order.order_items) {
      const key = it.currency || "GHS";
      const curr = map.get(key) || 0;
      map.set(key, curr + (it.total_price || 0));
    }
    return Array.from(map.entries()); // [ [ 'GHS', 12345 ], ... ]
  }

  const openDetails = (group) => {
    setActiveOrder(group);
    setOrderDetailsOpen(true);
  };

  /* -------------------- render -------------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-6 text-black dark:text-white">
      <Toaster position="top-right" />

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-2/3">
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, buyer, address, product…"
            className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-2 text-sm"
          />
          {searchQuery && (
            <AiOutlineClose
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        <div className="text-sm text-gray-500">
          {loading ? "Loading…" : `${filteredGroups.length} order${filteredGroups.length === 1 ? "" : "s"}`}
        </div>
      </div>

      {/* Orders */}
      {filteredGroups.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {loading ? "Loading…" : "No sales found."}
        </p>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    Order placed: {formatDate(order.order_date)}
                  </p>
                  {order.address?.display_address && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ship to: {order.address.display_address}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openBulkTrackingSheet(order)}
                    className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    Dispatch All
                  </button>
                  {getDispatchStatusBadge(order)}
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 mt-4">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 text-sm rounded-md border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-4 min-w-0">
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
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-2">{item.product_title}</p>

                        {!item.dispatched ? (
                          <button
                            onClick={() => openTrackingSheet(order, item)}
                            className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1 rounded text-xs mt-1"
                          >
                            Mark as Dispatched
                          </button>
                        ) : (
                          <div className="text-green-600 text-xs font-semibold mt-1 space-x-2">
                            <span>✅ Dispatched</span>
                            <button
                              onClick={() => undoDispatch(order, item)}
                              className="text-red-500 underline text-[11px] hover:text-red-700"
                            >
                              Undo
                            </button>
                          </div>
                        )}

                        {/* tiny meta */}
                        {item.dispatched && (
                          <div className="text-[11px] text-gray-500 dark:text-gray-300 mt-1 space-y-0.5">
                            {item.shipping_carrier && (
                              <p>
                                Carrier: <span className="font-medium">{item.shipping_carrier}</span>
                              </p>
                            )}
                            {item.date_dispatched && (
                              <p>Dispatched: {formatDate(item.date_dispatched)}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right whitespace-nowrap">
                      <div className="font-semibold">
                        {formatMoneyRaw(item.total_price, item.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} × {formatMoneyRaw(item.unit_price, item.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-right sm:text-left font-semibold text-lg space-x-2">
                  <span className="text-gray-400 dark:text-gray-300 text-sm">Total:</span>
                  {orderTotalsByCurrency(order).map(([cur, sum]) => (
                    <span key={cur} className="text-gray-800 dark:text-white">
                      {formatMoneyRaw(sum, cur)}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0 items-center">
                  <button
                    onClick={() => openDetails(order)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-8">
        <button
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
          disabled={!prevUrl || loading}
          onClick={() => fetchPage(prevUrl)}
        >
          ← Previous
        </button>

        <button
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
          disabled={!nextUrl || loading}
          onClick={() => fetchPage(nextUrl)}
        >
          Next →
        </button>
      </div>

      {/* Details modal */}
      <OrderDetailsModal
        isOpen={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
        order={
          activeOrder
            ? {
              ...activeOrder,
              // for the modal, compute a simple buyer object
              buyer: activeOrder.buyer,
            }
            : null
        }
      />

      {/* Dispatch sheet */}
      <Transition show={isTrackingSheetOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsTrackingSheetOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="translate-y-full" enterTo="translate-y-0"
            leave="ease-in duration-150" leaveFrom="translate-y-0" leaveTo="translate-y-full"
          >
            <Dialog.Panel className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-t-2xl p-6 flex justify-center shadow-lg">
              <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-semibold dark:text-gray-300">
                    {bulkMode ? "Dispatch All Items" : "Mark as Dispatched"}
                  </Dialog.Title>
                  <button
                    onClick={() => setIsTrackingSheetOpen(false)}
                    className="text-gray-400 hover:text-black dark:hover:text-white text-xl"
                    aria-label="Close"
                  >
                    <AiOutlineClose />
                  </button>
                </div>

                {bulkMode && orderToDispatchAll && (
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-2">
                      You are dispatching{" "}
                      <strong>
                        {orderToDispatchAll.order_items.filter((i) => !i.dispatched).length}
                      </strong>{" "}
                      items:
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
                      onChange={(e) =>
                        setDispatchForm({ ...dispatchForm, dispatchDate: e.target.value })
                      }
                      className="w-1/2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded-md"
                    />
                    <input
                      type="time"
                      step="60"
                      value={dispatchForm.dispatchTime || ""}
                      onChange={(e) =>
                        setDispatchForm({ ...dispatchForm, dispatchTime: e.target.value })
                      }
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
                    onChange={(e) =>
                      setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-300 px-3 py-2 rounded-md"
                    placeholder="Tracking Link (optional)"
                    value={dispatchForm.trackingLink}
                    onChange={(e) =>
                      setDispatchForm({ ...dispatchForm, trackingLink: e.target.value })
                    }
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
                  className={`mt-6 w-full py-2 rounded-md ${isSubmitting
                      ? "bg-purple-400 dark:bg-purple-500"
                      : "bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500"
                    } text-white`}
                >
                  {isSubmitting
                    ? "Saving..."
                    : bulkMode
                      ? "Save & Dispatch All"
                      : "Save & Mark as Dispatched"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}

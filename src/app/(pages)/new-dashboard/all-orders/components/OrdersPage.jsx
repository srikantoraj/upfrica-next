



"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import OrderCard from "./OrderCard";
import Pagination from "@/components/Pagination";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const PAGE_SIZE = 20;

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // will hold the flat list of order-items
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  // Fetch the flat list of order-items
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch(
      `https://media.upfrica.com/api/seller/order-items/?page=${pageParam}`,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setItems(data.results);
        setCount(data.count);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, pageParam]);

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/dashboard/all-orders?page=${newPage}`);
    }
  };

  // Debounced client‐side search over the flat items array
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const filtered = items
        .filter(
          (item) =>
            item.product.title.toLowerCase().includes(q) ||
            String(item.order_id).includes(q)
        )
        // inject an `order` object so <OrderCard> API stays the same
        .map((item) => ({
          ...item,
          order: { id: item.order_id, created_at: item.order_date },
        }));
      setSearchResults(filtered);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, items]);

  // determine which list to render
  const displayItems = searchQuery
    ? searchResults
    : // for non-search case, also inject `order`
    items.map((item) => ({
      ...item,
      order: { id: item.order_id, created_at: item.order_date },
    }));

  return (
    <div className="p-0 bg-gray-100 min-h-screen text-black font-sans">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-6">
        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-700" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders by product name or order #..."
          className="w-full rounded-full border border-gray-300 px-10 py-2 focus:outline-none"
        />
        {searchQuery && (
          <AiOutlineClose
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
            onClick={() => setSearchQuery("")}
          />
        )}
      </div>

      {/* Tabs (unchanged) */}
      {/* <div className="flex gap-6 mb-4 font-semibold overflow-x-auto whitespace-nowrap px-2 scrollbar-hide">
        <div className="border-b-2 border-black pb-1">All Purchases</div>
        <div>Processing</div>
        <div>Unpaid</div>
        <div>Returns &amp; Cancelled</div>
      </div> */}

      {/* <h1 className="text-2xl font-bold mb-6">My Orders</h1> */}

      {loading ? (
        <div className="text-center text-gray-600">
          Loading your orders...
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">
          Error loading orders: {error}
        </p>
      ) : (
        <div className="space-y-6">
          {displayItems.length === 0 ? (
            <p className="text-center text-gray-500">
              {searchQuery
                ? searchLoading
                  ? "Searching..."
                  : "No matching orders found."
                : "No orders yet."}
            </p>
          ) : (
            displayItems.map((item, idx) => (
              <OrderCard
                key={`${item.order.id}-${item.id}-${idx}`}
                order={item.order}
                product={item.product}
                status={
                  item.dispatch_status === 1 ? "Dispatched" : "Processing"
                }
                date={new Date(
                  item.order.created_at
                ).toLocaleDateString()}
                total={`GHS ${(
                  (item.price_cents * item.quantity) /
                  100
                ).toFixed(2)}`}
                orderNumber={String(item.order.id).padStart(8, "0")}
                productTitle={item.product.title}
                seller={
                  item.product.user_display_name ||
                  `Seller ${item.product.user}`
                }
                price={`GHS ${(item.price_cents / 100).toFixed(2)}`}
                returnDate="12 May"
                imageUrl={
                  item.product.product_images?.[0] || "/placeholder.png"
                }
              />
            ))
          )}
        </div>
      )}

      {!searchQuery && totalPages > 1 && (
        <Pagination
          currentPage={pageParam}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}

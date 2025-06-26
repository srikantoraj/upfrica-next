"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { BASE_API_URL } from '@/app/constants';
import OrderCard from "./OrderCard";
import Pagination from "@/components/Pagination";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const PAGE_SIZE = 20;

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch(`${BASE_API_URL}/api/buyer/orders/?page=${pageParam}`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data.results);
        setCount(data.count);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, pageParam]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = orders.flatMap(order =>
        order.order_items.filter(item =>
          item.product.title.toLowerCase().includes(lowerQuery) ||
          String(order.id).includes(lowerQuery)
        ).map(item => ({ ...item, order }))
      );
      setSearchResults(filtered);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, orders]);

  const displayItems = searchQuery
    ? searchResults
    : orders.flatMap(order =>
        order.order_items.map(item => ({ ...item, order }))
      );

  const totalOrders = displayItems.length;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/dashboard/all-orders?page=${newPage}`);
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-6 flex-1 overflow-y-auto
      dark:bg-[#0a0f0f] text-black dark:text-white  transition-colors duration-300">

      {/* Search */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-600 dark:text-gray-300" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders by product name or order #..."
          className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        {searchQuery && (
          <AiOutlineClose
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-gray-300 cursor-pointer"
            onClick={() => setSearchQuery("")}
          />
        )}
      </div>

      {/* Filters */}
      <div className="w-full overflow-x-auto scrollbar-hide px-2 mb-4">
        <div className="inline-flex gap-6 font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
          <div className="border-b-2 border-purple-600 dark:border-purple-400 pb-1">All Purchases</div>
          <div className="hover:underline cursor-pointer">Processing</div>
          <div className="hover:underline cursor-pointer">Unpaid</div>
          <div className="hover:underline cursor-pointer">Returns & Cancelled</div>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">My Orders ({totalOrders})</h1>

      {/* Order Content */}
      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">Loading your orders...</div>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400 text-center">Error loading orders: {error}</p>
      ) : (
        <div className="space-y-6">
          {displayItems.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No matching orders found.</p>
          ) : (
            displayItems.map((item, index) => (
              <div className="hover:ring-1 hover:ring-purple-500 rounded-xl transition-all">
                <OrderCard
                  key={`${item.order.id}-${item.id}-${index}`}
                  order={item.order}
                  product={item.product}
                  status={item.receive_status === 1 ? "Received" : "Processing"}
                  date={new Date(item.order.created_at).toLocaleDateString()}
                  total={`GHS ${(item.price_cents * item.quantity / 100).toFixed(2)}`}
                  orderNumber={String(item.order.id).padStart(8, "0")}
                  productTitle={item.product.title}
                  seller={item.product.user_display_name || `Seller ${item.product.user}`}
                  price={`GHS ${(item.price_cents / 100).toFixed(2)}`}
                  returnDate="12 May"
                  imageUrl={item.product.product_images?.[0] || "/placeholder.png"}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
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
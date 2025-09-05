"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "@/app/constants";
import OrderCard from "./OrderCard";
import Pagination from "@/components/Pagination";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const PAGE_SIZE = 50;

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

const DATE_OPTIONS = [
  { label: "All Time", value: "" },
  { label: "Last 30 Days", value: getDateDaysAgo(30) },
  { label: "Past 3 Months", value: getDateDaysAgo(90) },
  { label: "This Year", value: `${new Date().getFullYear()}-01-01` },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const [reviewedReviews, setReviewedReviews] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [reviewedItemIds, setReviewedItemIds] = useState([]);
  const [orders, setOrders] = useState([]);

  const debounceRef = useRef(null);
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  // Fetch reviewed items
  useEffect(() => {
    if (!token) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/reviews/my-reviews/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviewedReviews(data.results || []);
        setReviewedItemIds(data.results.map((review) => review.order_item_id));
      } catch (err) {
        console.error("❌ Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const fetchOrderSummary = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/buyer/order-summary/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch order summary");
        const data = await res.json();
        setOrderCount(data.order_count || 0);
        setItemCount(data.item_count || 0);
      } catch (err) {
        console.error("❌ Error fetching order summary:", err);
      }
    };
    fetchOrderSummary();
  }, [token]);

  const fetchOrders = (query = "", page = 1, createdAfter = "") => {
    setLoading(true);
    let url = `${BASE_API_URL}/api/buyer/orders/?page=${page}&page_size=${PAGE_SIZE}`;
    if (query.trim()) url += `&query=${encodeURIComponent(query)}`;
    if (createdAfter) url += `&created_after=${createdAfter}`;

    fetch(url, {
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
        setOrders(data.results || []);
        setCount(data.count || 25);
      })
      .catch((err) => setError(err.message))
      .finally(() => setTimeout(() => setLoading(false), 200));
  };

  useEffect(() => {
    if (!token) return;
    fetchOrders(searchQuery, pageParam, dateFilter);
  }, [token, pageParam, dateFilter]);

  useEffect(() => {
    if (!token) return;
    if (!searchQuery.trim()) {
      fetchOrders("", 1, dateFilter);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOrders(searchQuery, 1, dateFilter);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const groupedSortedOrders = useMemo(() => {
    const flattenedItems = orders
      .map((order) => ({
        ...order,
        __numeric_order_number: parseInt((order.order_number || order.id || "0").replace(/^0+/, ""), 10),
      }))
      .sort((a, b) => b.__numeric_order_number - a.__numeric_order_number)
      .flatMap((order) => order.order_items.map((item) => ({ ...item, order })));

    return Object.values(
      flattenedItems.reduce((acc, item) => {
        const orderId = item.order.id;
        if (!acc[orderId]) acc[orderId] = { order: item.order, items: [] };
        acc[orderId].items.push(item);
        return acc;
      }, {})
    ).sort((a, b) => {
      const numA = parseInt((a.order.order_number || a.order.id || "0").replace(/^0+/, ""), 10);
      const numB = parseInt((b.order.order_number || b.order.id || "0").replace(/^0+/, ""), 10);
      return numB - numA;
    });
  }, [orders]);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/dashboard/all-orders?page=${newPage}`);
    }
  };

  const itemCountLive = groupedSortedOrders.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-6 flex-1 overflow-y-auto dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-2/3">
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

        <div className="w-full md:w-auto">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {DATE_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
      </div>

      <h1 className="text-2xl font-semibold mb-1 text-gray-800 dark:text-white">
        My Orders ({orderCount})
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {itemCountLive} item{itemCountLive !== 1 ? "s" : ""} across {orderCount} order{orderCount !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading your orders...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400 text-center">Error loading orders: {error}</p>
      ) : groupedSortedOrders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {groupedSortedOrders.map((group) => (
            <div key={group.order.id} className="hover:ring-1 hover:ring-purple-500 rounded-xl transition-all">
              <OrderCard
                order={group.order}
                items={group.items}
                reviewedItemIds={reviewedItemIds}
                reviewedReviews={reviewedReviews}
              />
            </div>
          ))}
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
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

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

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

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/dashboard/all-orders?page=${newPage}`);
    }
  };

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

  const displayItems = searchQuery ? searchResults : orders.flatMap(order =>
    order.order_items.map(item => ({ ...item, order }))
  );

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

      <div className="flex gap-6 mb-4 font-semibold overflow-x-auto whitespace-nowrap px-2 scrollbar-hide">
        <div className="border-b-2 border-black pb-1">All Purchases</div>
        <div>Processing</div>
        <div>Unpaid</div>
        <div>Returns & Cancelled</div>
      </div>

      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading your orders...</div>
      ) : error ? (
        <p className="text-red-600 text-center">Error loading orders: {error}</p>
      ) : (
        <div className="space-y-6">
          {displayItems.length === 0 ? (
            <p className="text-center text-gray-500">No matching orders found.</p>
          ) : (
            displayItems.map((item, index) => (
              <OrderCard
                key={`${item.order.id}-${item.id}-${index}`}
                order={item.order} // ✅ Add this
                product={item.product} // ✅ Pass product as well if needed
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

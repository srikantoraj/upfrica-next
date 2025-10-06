"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import {
  MdRemoveRedEye,
  MdDelete,
  MdCheckCircle,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 20;

export default function PendingOrders() {
  const { token, user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [orderItems, setOrderItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchOrderItems = async () => {
      setLoading(true);
      try {
        // build query params
        const params = new URLSearchParams();
        params.append("page", currentPage);
        // if there’s a search term, hit the search endpoint
        const isSearch = Boolean(searchTerm.trim());
        if (isSearch) {
          params.append("q", searchTerm.trim());
        }

        const url = isSearch
          ? `https://api.upfrica.com/api/seller/orders/search/?${params.toString()}`
          : `https://api.upfrica.com/api/seller/pending-order-items/?${params.toString()}`;

        const res = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setOrderItems(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [token, currentPage, searchTerm]);

  const handleView = (slug) => {
    router.push(`/${user?.country?.toLocaleDateString() || "gh"}/${slug}`);
  };
  const handleEdit = (id) => router.push(`/new-dashboard/all-orders/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(
        `https://api.upfrica.com/api/seller/order-items/${id}/`,
        { method: "DELETE", headers: { Authorization: `Token ${token}` } },
      );
      if (!res.ok) throw new Error("Delete failed");
      setOrderItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending Orders</h1>

      {/* Search + Pagination */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/2">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search orders with product or order ID ..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none font-medium"
          />
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-50 p-4 rounded-lg h-24"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {orderItems.map((item) => {
            const { product } = item;
            const statusText =
              item.dispatch_status === 0 ? "Pending" : "Dispatched";
            const statusColor = item.dispatch_status === 0 ? "yellow" : "green";

            return (
              <div key={item.id} className="space-y-0 ">
                <div
                  className="
                  flex items-center justify-between 
                  bg-gray-50 p-4 
                  rounded-t-lg 
                  shadow-[0_-4px_6px_rgba(0,0,0,0.1)]
                "
                >
                  <div className="flex space-x-6 text-sm text-gray-700 ">
                    <div>
                      <span className="font-medium">
                        Order #{item.order_id}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Date</span>{" "}
                      {new Date(item.order_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Total</span> GHS{" "}
                      {(item.price_cents / 100).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MdCheckCircle
                      className={`w-6 h-6 text-${statusColor}-500`}
                    />
                    <span className={`text-${statusColor}-800 font-semibold`}>
                      {statusText}
                    </span>
                  </div>
                </div>

                {/* Product Detail — bottom corners rounded, bottom‐only shadow */}
                <div
                  className="
    bg-white px-4 py-3 
    rounded-b-lg 
    shadow-[0_4px_6px_rgba(0,0,0,0.1)]
  "
                >
                  <div className="flex items-start">
                    {product.product_images[0] ? (
                      <img
                        src={product.product_images[0]}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4" />
                    )}
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">{product.title}</h2>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-800">
                            Status:
                          </span>{" "}
                          {statusText}
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">
                            Item ID:
                          </span>{" "}
                          {item.id}
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">
                            Price:
                          </span>{" "}
                          GHS {(item.price_cents / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="py-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-2 bg-gray-100 hover:bg-blue-200 rounded-full text-gray-700 hover:text-blue-700"
                        aria-label="Edit"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className={`
          p-2 rounded-full font-bold
          ${deletingId === item.id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 hover:bg-red-200 hover:text-red-700"
                          }
        `}
                        aria-label="Delete"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

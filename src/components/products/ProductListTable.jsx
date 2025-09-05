"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  CheckCircle,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
} from "lucide-react";

export default function ProductListTable() {
  const router = useRouter();
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const authHeaders = token
    ? { Authorization: `Token ${String(token).replace(/^Token\s+/i, "")}` }
    : {};

  const fetchProducts = async (pageNum = 1) => {
    if (!token || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_API_URL}/api/products/mine/?page=${pageNum}`,
        { headers: { "Content-Type": "application/json", ...authHeaders } }
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts((prev) => [...prev, ...(data.results || [])]);
      setHasMore(Boolean(data.next));
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]); // reset when token flips
    setPage(1);
    setHasMore(true);
    if (token) fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // ★ Create Draft + go to editor
  const handleAddProduct = async () => {
    if (!token) {
      setError("You must be signed in to add a product.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ title: "Untitled product" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.detail || `Create failed (${res.status})`);
      }
      const draft = await res.json();
      // Navigate to your editor; update path if different:
      router.push(`/new-dashboard/products/editor?id=${draft.id}`);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to create product.");
    } finally {
      setCreating(false);
    }
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          My Product Listings
        </h2>
        <button
          onClick={handleAddProduct}
          disabled={creating}
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-70"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {creating ? "Creating…" : "+ Add Product"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Visibility</th>
              <th className="p-3">Availability</th>
              <th className="p-3">Price</th>
              <th className="p-3">Views</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const img =
                p.thumbnail ||
                p.product_image_url ||
                p.image_objects?.[0]?.url ||
                "/placeholder.png";

              const price =
                // Prefer server-provided major if present (MoneyInMajorMixin adds it)
                p.price_major ??
                (typeof p.price_cents === "number"
                  ? (p.price_cents / 100).toFixed(2)
                  : "0.00");

              const currency = (p.price_currency || "").toUpperCase() || "GHS";

              return (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">
                      <Link href={p.frontend_url || `/product/${p.slug}`} className="block w-fit">
                        <Image
                          src={img}
                          alt={p.title || "Product"}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </Link>
                    </td>
                    <td className="p-3 font-medium text-gray-800 dark:text-white">
                      <Link href={p.frontend_url || `/product/${p.slug}`}>
                        <span className="hover:underline">{p.title}</span>
                      </Link>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        {p.status === 1 ? "Published" : p.status === 0 ? "Draft" : p.status ?? "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 text-green-600">
                        <Eye className="w-4 h-4" />
                        {p.frontend_url ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="p-3 text-green-600 font-semibold whitespace-nowrap">
                      In Stock ({p.product_quantity ?? 0})
                    </td>
                    <td className="p-3 font-bold text-black dark:text-white whitespace-nowrap">
                      {currency} {price}
                    </td>
                    <td className="p-3 text-center">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {p.review_count ?? 0}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/products/editor?id=${p.id}`)}
                          className="p-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded border hover:bg-red-100 dark:hover:bg-red-800"
                          title="Delete"
                          // TODO: hook delete endpoint
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                        <button onClick={() => toggleRow(p.id)} title="Toggle Details">
                          {expandedRows.includes(p.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.includes(p.id) && (
                    <tr className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
                      <td colSpan="8" className="p-3 space-x-6">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Slug:</span>{" "}
                        {p.slug || "—"}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Product ID:</span>{" "}
                        #{p.id}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="text-center mt-4 text-gray-400 dark:text-gray-500">
          Loading more products...
        </p>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
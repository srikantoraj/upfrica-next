// src/components/new-dashboard/products/ProductListTable.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  AlertTriangle,
  CheckCircle,
  EyeOff,
  PackageSearch,
  DollarSign,
  Star,
} from "lucide-react";
import classNames from "classnames";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";

export default function ProductSummaryPills({ onSelect, activeKey }) {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [monthlyViews, setMonthlyViews] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${BASE_API_URL}/api/products/mine/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to load products:", err);
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, [token]);

  const summary = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const productList = products?.results || [];

    const approved = productList.filter((p) => p.status === "active");
    const drafts = productList.filter((p) => !p.is_published);
    const outOfStock = productList.filter((p) => p.quantity === 0);
    const lowStock = productList.filter(
      (p) => p.quantity > 0 && p.quantity < 5,
    );

    const needsAttention = productList.filter(
      (p) =>
        p.status !== "active" ||
        !p.is_published ||
        p.quantity === 0 ||
        !p.image_objects?.length ||
        !p.price ||
        !p.category ||
        p.category.slug === "uncategorized",
    );

    const viewsThisMonth = productList.reduce((sum, p) => {
      const updatedAt = new Date(p.updated_at);
      return updatedAt >= startOfMonth ? sum + (p.views || 0) : sum;
    }, 0);

    const avgPrice = productList.length
      ? (
          productList.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) /
          productList.length
        ).toFixed(2)
      : "0.00";

    setMonthlyViews(viewsThisMonth);

    return {
      total: productList.length,
      approved: approved.length,
      draft: drafts.length,
      out_of_stock: outOfStock.length,
      low_stock: lowStock.length,
      needs_attention: needsAttention.length,
      average_price: avgPrice,
    };
  }, [products]);

  const items = [
    {
      label: "Total Products",
      key: null,
      value: summary.total,
      icon: PackageSearch,
    },
    {
      label: "Approved",
      key: "approved",
      value: summary.approved,
      icon: CheckCircle,
    },
    { label: "Drafts", key: "draft", value: summary.draft, icon: EyeOff },
    {
      label: "Out of Stock",
      key: "out_of_stock",
      value: summary.out_of_stock,
      icon: AlertTriangle,
    },
    {
      label: "Low Stock",
      key: "low_stock",
      value: summary.low_stock,
      icon: Star,
    },
    { label: "Views This Month", key: null, value: monthlyViews, icon: Eye },
    {
      label: "Needs Attention",
      key: "needs_attention",
      value: summary.needs_attention,
      icon: AlertTriangle,
    },
    {
      label: "Avg Price",
      key: null,
      value: `$${summary.average_price}`,
      icon: DollarSign,
    },
  ];

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  return (
    <div className="flex overflow-x-auto gap-3 py-4 scrollbar-hide">
      {items.map((item) => {
        const isActive = item.key && item.key === activeKey;
        const isClickable = !!item.key;

        return (
          <button
            key={item.label}
            onClick={() => isClickable && onSelect?.(item.key)}
            className={classNames(
              "flex flex-col justify-center items-center min-w-[120px] px-4 py-2 rounded-3xl border text-sm shadow-sm",
              {
                "bg-purple-100 text-purple-800 border-purple-300": isActive,
                "bg-white dark:bg-gray-900 text-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800":
                  !isActive && isClickable,
                "cursor-default text-gray-400": !isClickable,
              },
            )}
          >
            <item.icon className="w-4 h-4 mb-1" />
            <span className="text-[13px] font-medium text-center leading-snug">
              {item.label}
            </span>
            <span className="text-lg font-bold mt-0.5">{item.value}</span>
          </button>
        );
      })}
    </div>
  );
}

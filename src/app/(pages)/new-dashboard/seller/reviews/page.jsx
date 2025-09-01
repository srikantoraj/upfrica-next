// src/app/(pages)/new-dashboard/seller/reviews/page.jsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProductReviewList from "@/components/new-dashboard/ProductReviewList";
import SellerReviewList from "@/components/new-dashboard/SellerReviewList";

export default function SellerReviewsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("product");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-4 dark:text-white text-gray-800">
        Buyer Feedback

      </h1>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-6 border-b">
        {["product", "seller"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {tab === "product" ? "Product Reviews" : "Seller Reviews"}
          </button>
        ))}
      </div>

      {/* Render Tab Content */}
      {activeTab === "product" ? (
        <ProductReviewList token={token} />
      ) : (
        <SellerReviewList token={token} />
      )}
    </div>
  );
}
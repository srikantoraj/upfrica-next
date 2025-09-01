"use client";
import React from "react";
import Link from "next/link";
import { BadgeCheck, Clock, XCircle } from "lucide-react";

const dummyProducts = [
  {
    id: 1,
    title: "iPhone 13 Pro Max - 256GB",
    price_cents: 679900,
    status: 1,
    image: "/dummy/iphone.jpg",
  },
  {
    id: 2,
    title: 'Samsung Smart TV 55"',
    price_cents: 299999,
    status: 0,
    image: "/dummy/tv.jpg",
  },
  {
    id: 3,
    title: "Office Chair Ergonomic Mesh",
    price_cents: 14999,
    status: 2,
    image: "/dummy/chair.jpg",
  },
];

export default function ProductDashboard() {
  return (
    <div className="max-w-7xl mx-auto text-gray-800 dark:text-white">
      <h2 className="text-xl font-semibold mb-4">My Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 hover:shadow-lg dark:hover:shadow-[0_6px_30px_rgba(0,0,0,0.5)] transition duration-300"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              ₵{(product.price_cents / 100).toLocaleString()}
            </p>
            <StatusBadge status={product.status} />

            <Link
              href={`/new-dashboard/edit-product/${product.id}`}
              className="inline-block mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Edit Product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    0: {
      label: "Draft",
      color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
      icon: <Clock className="w-4 h-4 mr-1" />,
    },
    1: {
      label: "Published",
      color:
        "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
      icon: <BadgeCheck className="w-4 h-4 mr-1" />,
    },
    2: {
      label: "Rejected",
      color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
      icon: <XCircle className="w-4 h-4 mr-1" />,
    },
  };

  const { label, color, icon } = config[status] || config[0];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${color}`}
    >
      {icon}
      {label}
    </span>
  );
}

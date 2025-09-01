"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const statusIcons = {
  success: (
    <FaCheckCircle
      className="text-green-500 text-lg mx-auto"
      title="In Stock"
    />
  ),
  warning: (
    <FaClock
      className="text-yellow-500 text-lg mx-auto"
      title="Limited Stock"
    />
  ),
  danger: (
    <FaTimesCircle
      className="text-red-500 text-lg mx-auto"
      title="Out of Stock"
    />
  ),
};

const sampleProducts = [
  {
    id: 1,
    name: "Apple Series 4 GPS A38 MM Space",
    description: "Apple Watch SE Smartwatch",
    category: "Electronics, Laptop",
    price: 14.59,
    qty: 70,
    status: "success",
    image:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-1.jpg",
    brand:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-brand-1.png",
  },
  {
    id: 2,
    name: "Boat On-Ear Wireless",
    description: "Mic(Bluetooth 4.2, Rockerz 450R)",
    category: "Electronics, Headphones",
    price: 81.99,
    qty: 45,
    status: "warning",
    image:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-2.jpg",
    brand:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-brand-1.png",
  },
  {
    id: 3,
    name: "Fitbit MX30 Smart Watch",
    description: "(MX30- waterproof) watch",
    category: "Fashion, Watch",
    price: 49.9,
    qty: 21,
    status: "danger",
    image:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-3.jpg",
    brand:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-brand-1.png",
  },
  {
    id: 4,
    name: "Asus Zenbook Pro",
    description: "High performance ultrabook",
    category: "Electronics, Laptop",
    price: 899.99,
    qty: 12,
    status: "warning",
    image:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-4.jpg",
    brand:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-brand-1.png",
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    description: "Noise Cancelling Headphones",
    category: "Electronics, Headphones",
    price: 299.99,
    qty: 25,
    status: "success",
    image:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-5.jpg",
    brand:
      "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-brand-1.png",
  },
];

const ProductTablePage = () => {
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const filteredProducts = sampleProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="">
      <div className="min-h-screen">
        <div className="">
          {/* Add Button */}
          <div className="flex justify-end mb-6">
            <a
              href="/application/ecom_product-add.html"
              className="bg-[#04A9F5] text-white px-3 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
            >
              <span className="text-xl">＋</span> Add Product
            </a>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Show</label>
              <select
                name="per-page"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400"
              >
                {[5, 10, 15, 20, 25].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            <div>
              <input
                type="search"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 lg:py-3 w-full md:w-64 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto bg-white rounded-md  border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="text-right p-3 w-[5%]">#</th>
                  <th className="text-left p-3 w-[35%]">Product Detail</th>
                  <th className="text-left p-3 w-[20%]">Categories</th>
                  <th className="text-right p-3 w-[7%]">Price</th>
                  <th className="text-right p-3 w-[6%]">Qty</th>
                  <th className="text-center p-3 w-[8%]">Brand</th>
                  <th className="text-center p-3 w-[9%]">Status</th>
                  <th className="text-center p-3 w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.slice(0, perPage).map((product) => (
                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="text-right p-3 font-medium">{product.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover border"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {product.name}
                          </p>
                          <p className="text-gray-500 text-xs truncate">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className="text-right p-3">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="text-right p-3">{product.qty}</td>

                    {/* Brand */}
                    <td className="text-center p-3">
                      <img
                        src={product.brand}
                        alt="Brand"
                        className="w-10 h-10 object-contain mx-auto"
                      />
                    </td>

                    {/* Status */}
                    <td className="text-center p-3">
                      {statusIcons[product.status]}
                    </td>

                    {/* Actions */}
                    <td className="text-center p-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="text-gray-600 hover:text-blue-600"
                          title="View"
                          onClick={() =>
                            alert(`Viewing product: ${product.name}`)
                          }
                        >
                          <FaEye />
                        </button>
                        <a
                          href="/application/ecom_product-add.html"
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </a>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() =>
                            alert(`Deleting product ID: ${product.id}`)
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 text-sm bg-gray-50 border-t flex-wrap gap-2">
              <span>
                Showing 1 to {Math.min(perPage, filteredProducts.length)} of{" "}
                {filteredProducts.length} entries
              </span>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
                  ‹
                </button>
                <button className="px-3 py-1 border rounded bg-blue-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                  3
                </button>
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTablePage;

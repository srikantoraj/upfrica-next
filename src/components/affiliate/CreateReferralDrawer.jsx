// components/affiliate/CreateReferralDrawer.jsx
"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";
import { Loader2, Link2 } from "lucide-react";

export default function CreateReferralDrawer({ open, onClose }) {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token || !open) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_API_URL}/affiliate/products/recent/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setProducts(data.results || []);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, open]);

  const handleCreateLink = async (productId) => {
    if (!token) return;
    setCreating(true);
    try {
      const res = await fetch(`${BASE_API_URL}/affiliate/create-link/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await res.json();
      if (data.link) {
        setLinkGenerated(data.link);
      }
    } catch (err) {
      console.error("Failed to create link:", err);
    } finally {
      setCreating(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex min-h-full items-end justify-center p-4 sm:p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl transform overflow-hidden">
                <div className="pt-3 px-4 max-h-[80vh] overflow-y-auto">
                  {/* Drag Indicator */}
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-2" />

                  <Dialog.Title className="text-lg font-semibold mb-3 text-center">
                    Create Referral Link
                  </Dialog.Title>

                  {loading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                    </div>
                  ) : linkGenerated ? (
                    <div className="bg-green-100 text-green-800 p-4 rounded text-sm text-left">
                      ✅ Link created:
                      <br />
                      <a
                        href={linkGenerated}
                        className="text-blue-600 underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {linkGenerated}
                      </a>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
                      <img
                        src="https://www.svgrepo.com/show/506800/box.svg"
                        alt="No products"
                        className="w-24 h-24 mb-4 opacity-70"
                      />
                      <p className="text-sm">
                        No products available to refer yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-3 py-2 mb-3 text-sm border rounded-md focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                      />

                      <ul className="space-y-3">
                        {filteredProducts.map((product) => (
                          <li
                            key={product.id}
                            className="border border-gray-200 dark:border-gray-700 rounded p-3 flex items-center justify-between"
                          >
                            <span className="text-sm font-medium line-clamp-1">
                              {product.title}
                            </span>
                            <button
                              onClick={() => handleCreateLink(product.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                              disabled={creating}
                            >
                              <Link2 className="w-4 h-4" /> Create Link
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Bottom Close Button */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <button
                    onClick={onClose}
                    className="w-full text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

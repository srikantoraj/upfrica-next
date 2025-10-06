"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLocationPin } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useSelector } from "react-redux";

export default function DraftProductsPage() {
  const { token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    open: false,
    type: null, // "status" or "delete"
    product: null,
    newStatus: null, // 0 or 1
  });

  // Fetch draft products
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(
          "https://api.upfrica.com/api/products/draft/",
          { headers: { Authorization: `Token ${token}` } },
        );
        const json = await res.json();
        setProducts(json.results || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Update status (0 = Draft, 1 = Published)
  async function updateStatus(product, statusValue) {
    try {
      const res = await fetch(
        `https://api.upfrica.com/api/products/draft/${product.id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: statusValue }),
        },
      );
      if (!res.ok) throw new Error(res.statusText);

      // If publishing, remove from draft list
      if (statusValue === 1) {
        setProducts((list) => list.filter((p) => p.id !== product.id));
      } else {
        // Otherwise update status in place
        setProducts((list) =>
          list.map((p) =>
            p.id === product.id ? { ...p, status: statusValue } : p,
          ),
        );
      }
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setModal({ open: false, type: null, product: null, newStatus: null });
    }
  }

  // Delete product
  async function deleteProduct(product) {
    try {
      const res = await fetch(
        `https://api.upfrica.com/api/products/${product.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (!res.ok) throw new Error(res.statusText);
      setProducts((list) => list.filter((p) => p.id !== product.id));
    } catch (err) {
      alert("Error deleting product: " + err.message);
    } finally {
      setModal({ open: false, type: null, product: null, newStatus: null });
    }
  }

  // if (loading) return <p className="p-4">Loading drafts…</p>;
  // ── Skeleton component ──
  const SkeletonDraftCard = () => (
    <div className="flex items-center p-4 animate-pulse">
      <div className="w-24 h-24 bg-gray-300 rounded" />
      <div className="flex-1 px-4 space-y-2">
        <div className="h-6 bg-gray-300 rounded w-1/3" />
        <div className="h-5 bg-gray-300 rounded w-1/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-6 bg-gray-300 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 rounded" />
        <div className="w-6 h-6 bg-gray-300 rounded" />
      </div>
    </div>
  );

  return (
    // <div className="p-6 bg-gray-50 min-h-screen">
    //     <h1 className="text-2xl font-bold mb-6">Draft Products</h1>
    //     <div className="bg-white rounded-lg shadow divide-y">
    //         {products.map((p, idx) => (
    //             <div key={p.id} className="flex items-center p-4">
    //                 {/* Image */}
    //                 <img
    //                     src={p.product_images[0]}
    //                     alt={p.title}
    //                     className="w-24 h-24 object-cover rounded"
    //                 />

    //                 {/* Details */}
    //                 <div className="flex-1 px-4">
    //                     <h2 className="text-lg font-semibold">{p.title}</h2>
    //                     <p className="text-gray-700 mt-1">
    //                         {(p.price_cents / 100).toFixed(2)} {p.price_currency}
    //                     </p>
    //                     <p className="text-gray-500 text-sm mt-2 flex items-center">
    //                         <FaLocationPin className="mr-1" />
    //                         {p.user?.town || "—"}, {p.user?.country || "—"}
    //                     </p>
    //                 </div>

    //                 {/* Actions */}
    //                 <div className="flex items-center space-x-4">
    //                     <button
    //                         onClick={() =>
    //                             setModal({
    //                                 open: true,
    //                                 type: "status",
    //                                 product: p,
    //                                 newStatus: p.status === 0 ? 1 : 0,
    //                             })
    //                         }
    //                         className={`px-3 py-1 rounded-full text-sm font-medium ${p.status === 0
    //                             ? "bg-yellow-100 text-yellow-800"
    //                             : "bg-green-100 text-green-800"
    //                             }`}
    //                     >
    //                         {p.status === 0 ? "Draft" : "Published"}
    //                     </button>

    //                     <Link href={`/products/edit/${p.slug}`}>
    //                         <CiEdit className="h-6 w-6 text-blue-600 hover:text-blue-800" />
    //                     </Link>

    //                     <MdDelete
    //                         onClick={() =>
    //                             setModal({ open: true, type: "delete", product: p })
    //                         }
    //                         className="h-6 w-6 text-red-600 hover:text-red-800 cursor-pointer"
    //                     />
    //                 </div>
    //             </div>
    //         ))}
    //     </div>

    //     {/* Confirm Modal */}
    //     {modal.open && modal.product && (
    //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    //             <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
    //                 {modal.type === "status" && (
    //                     <>
    //                         <h3 className="text-xl font-semibold mb-4">
    //                             Change Status?
    //                         </h3>
    //                         <p className="mb-6">
    //                             Mark <strong>{modal.product.title}</strong> as{" "}
    //                             <strong>
    //                                 {modal.newStatus === 1 ? "Published" : "Draft"}
    //                             </strong>
    //                             ?
    //                         </p>
    //                         <div className="flex justify-end space-x-4">
    //                             <button
    //                                 onClick={() =>
    //                                     setModal({ open: false, type: null, product: null })
    //                                 }
    //                                 className="px-4 py-2 rounded border"
    //                             >
    //                                 Cancel
    //                             </button>
    //                             <button
    //                                 onClick={() =>
    //                                     updateStatus(modal.product, modal.newStatus)
    //                                 }
    //                                 className="px-4 py-2 rounded bg-blue-600 text-white"
    //                             >
    //                                 Confirm
    //                             </button>
    //                         </div>
    //                     </>
    //                 )}
    //                 {modal.type === "delete" && (
    //                     <>
    //                         <h3 className="text-xl font-semibold mb-4">
    //                             Delete Product?
    //                         </h3>
    //                         <p className="mb-6">
    //                             This will permanently remove{" "}
    //                             <strong>{modal.product.title}</strong>.
    //                         </p>
    //                         <div className="flex justify-end space-x-4">
    //                             <button
    //                                 onClick={() =>
    //                                     setModal({ open: false, type: null, product: null })
    //                                 }
    //                                 className="px-4 py-2 rounded border"
    //                             >
    //                                 Cancel
    //                             </button>
    //                             <button
    //                                 onClick={() => deleteProduct(modal.product)}
    //                                 className="px-4 py-2 rounded bg-red-600 text-white"
    //                             >
    //                                 Delete
    //                             </button>
    //                         </div>
    //                     </>
    //                 )}
    //             </div>
    //         </div>
    //     )}
    // </div>
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Draft Products</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {loading
          ? // show 5 skeleton rows while loading
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonDraftCard key={i} />
          ))
          : // once loaded, show real products
          products.map((p) => (
            <div key={p.id} className="flex items-center p-4">
              {/* Image */}
              <img
                src={p.product_images[0]}
                alt={p.title}
                className="w-24 h-24 object-cover rounded"
              />

              {/* Details */}
              <div className="flex-1 px-4">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="text-gray-700 mt-1">
                  {(p.price_cents / 100).toFixed(2)} {p.price_currency}
                </p>
                <p className="text-gray-500 text-sm mt-2 flex items-center">
                  <FaLocationPin className="mr-1" />
                  {p.user?.town || "—"}, {p.user?.country || "—"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    setModal({
                      open: true,
                      type: "status",
                      product: p,
                      newStatus: p.status === 0 ? 1 : 0,
                    })
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium ${p.status === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                    }`}
                >
                  {p.status === 0 ? "Draft" : "Published"}
                </button>

                <Link href={`/products/edit/${p.slug}`}>
                  <CiEdit className="h-6 w-6 text-blue-600 hover:text-blue-800" />
                </Link>

                <MdDelete
                  onClick={() =>
                    setModal({ open: true, type: "delete", product: p })
                  }
                  className="h-6 w-6 text-red-600 hover:text-red-800 cursor-pointer"
                />
              </div>
            </div>
          ))}
      </div>

      {/* Confirm Modal */}
      {modal.open && modal.product && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            {modal.type === "status" && (
              <>
                <h3 className="text-xl font-semibold mb-4">Change Status?</h3>
                <p className="mb-6">
                  Mark <strong>{modal.product.title}</strong> as{" "}
                  <strong>
                    {modal.newStatus === 1 ? "Published" : "Draft"}
                  </strong>
                  ?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() =>
                      setModal({ open: false, type: null, product: null })
                    }
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateStatus(modal.product, modal.newStatus)}
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
            {modal.type === "delete" && (
              <>
                <h3 className="text-xl font-semibold mb-4">Delete Product?</h3>
                <p className="mb-6">
                  This will permanently remove{" "}
                  <strong>{modal.product.title}</strong>.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() =>
                      setModal({ open: false, type: null, product: null })
                    }
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteProduct(modal.product)}
                    className="px-4 py-2 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

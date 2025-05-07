'use client';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaEye,
    FaEdit,
    FaTrash
} from "react-icons/fa";
import { useSelector } from "react-redux";



const ProductList = () => {
    const router = useRouter();
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const filteredProducts = search
        ? products.filter((product) =>
            product.title?.toLowerCase().includes(search.toLowerCase()) ||
            product.u_pid?.toLowerCase().includes(search.toLowerCase()) ||
            product.slug?.toLowerCase().includes(search.toLowerCase())
        )
        : products;


    // get all products data 
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("https://media.upfrica.com/api/seller/products", {
                    method: 'GET',
                    headers: { Authorization: `Token ${token}` },
                });
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();
                console.log("Fetched products:", data.results); // ✅ Log to console
                setProducts(data.results); // Save to state if needed later
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    // edit product 
    const handleEdit = (slug) => {
        router.push(`/products/edit/${slug}`);
    };

    // DELETE handler with loading button text and alert
    const handleDelete = async (id) => {
        console.log("product id", id);

        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(
                `https://media.upfrica.com/api/seller/products/${id}/`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Token ${token}` },
                }
            );
            if (!res.ok) throw new Error('Failed to delete product');

            setProducts((prev) => prev.filter((p) => p.id !== id));
            setAlert({ type: 'success', message: 'Product deleted successfully.' });
        } catch (err) {
            console.error(err);
            setAlert({ type: 'error', message: 'Could not delete product. Please try again.' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        // <div className="">
        //     <div className="min-h-screen">
        //         <div className="">
        //             {/* Add Button */}
        //             <div className="flex justify-end mb-6">
        //                 <a
        //                     href="/application/ecom_product-add.html"
        //                     className="bg-[#04A9F5] text-white px-3 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
        //                 >
        //                     <span className="text-xl">＋</span> Add Product
        //                 </a>
        //             </div>

        //             {/* Controls */}
        //             <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        //                 <div className="flex items-center gap-2">
        //                     <label className="text-sm text-gray-700">Show</label>
        //                     <select
        //                         name="per-page"
        //                         value={perPage}
        //                         onChange={e => setPerPage(Number(e.target.value))}
        //                         className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400"
        //                     >
        //                         {[5, 10, 15, 20, 25].map(n => (
        //                             <option key={n} value={n}>{n}</option>
        //                         ))}
        //                     </select>
        //                     <span className="text-sm text-gray-700">entries</span>
        //                 </div>

        //                 <div>
        //                     <input
        //                         type="search"
        //                         placeholder="Search product..."
        //                         value={search}
        //                         onChange={e => setSearch(e.target.value)}
        //                         className="border border-gray-300 rounded px-4 py-2 lg:py-3 w-full md:w-64 text-sm focus:ring-2 focus:ring-blue-400"
        //                     />
        //                 </div>
        //             </div>

        //             {/* Table */}
        //             <div className="overflow-auto bg-white rounded-md  border border-gray-200">
        //                 <table className="min-w-full text-sm">
        //                     <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
        //                         <tr>
        //                             {/* <th className="text-right p-3 w-[5%]">#</th> */}
        //                             <th className="text-left p-3 w-[15%]">Product Info</th>
        //                             <th className="text-left p-3 w-[7%]">Date Added</th>
        //                             <th className="text-right p-3 w-[7%]">Price</th>
        //                             <th className="text-right p-3 w-[6%]">Status</th>
        //                             <th className="text-center p-3 w-[8%]">Viewed</th>
        //                             <th className="text-center p-3 w-[9%]">Sold</th>
        //                             <th className="text-center p-3 w-[10%]">Actions</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         {filteredProducts.slice(0, perPage).map((product, index) => {
        //                             const price =
        //                                 ((product.sale_price_cents ?? product.price_cents) / 100).toFixed(2);
        //                             const currency = product.sale_price_currency || product.price_currency;
        //                             const createdDate = new Date(product.created_at).toLocaleDateString();

        //                             return (
        //                                 <tr key={product.id} className="border-t hover:bg-gray-50 transition">
        //                                     {/* Product Info */}
        //                                     <td className="p-3 max-w-[200px]">
        //                                         <div className="flex items-center gap-3">
        //                                             <img
        //                                                 src={product.product_images?.[0] || "/placeholder.jpg"}
        //                                                 alt={product.title}
        //                                                 className="w-12 h-12 rounded object-cover border"
        //                                             />
        //                                             <div className="min-w-0">
        //                                                 <p className="font-semibold truncate">{product.title}</p>
        //                                                 <p className="text-gray-500 text-xs truncate">SKU: {product.u_pid}</p>
        //                                             </div>
        //                                         </div>
        //                                     </td>

        //                                     {/* Date Added */}
        //                                     <td className="text-center p-3">{createdDate}</td>

        //                                     {/* Price */}
        //                                     <td className="text-right p-3">
        //                                         {price} {currency}
        //                                     </td>

        //                                     {/* Status */}
        //                                     <td className="text-center p-3">
        //                                         {product.product_quantity > 0 ? (
        //                                             <span className="text-green-600 font-medium">In Stock</span>
        //                                         ) : (
        //                                             <span className="text-red-500 font-medium">Out of Stock</span>
        //                                         )}
        //                                     </td>

        //                                     {/* Viewed */}
        //                                     <td className="text-center p-3">{product.impressions_count ?? 0}</td>

        //                                     {/* Sold */}
        //                                     <td className="text-center p-3">{product.likes ?? 0}</td>

        //                                     {/* Action Buttons */}
        //                                     <td className="text-center p-3">
        //                                         <div className="flex items-center justify-center gap-3">
        //                                             {/* <button
        //                                                 className="text-gray-500 hover:text-blue-600"
        //                                                 title="View"
        //                                                 onClick={() => handleEdit(product.slug)}
        //                                             >
        //                                                 <FaEye className="h-5 w-5" />
        //                                             </button> */}
        //                                             <button
        //                                                 onClick={() => handleEdit(product.slug)}
        //                                                 className="text-gray-500"
        //                                                 title="Edit"
        //                                             >
        //                                                 <FaEdit className="h-5 w-5" />
        //                                             </button>
        //                                             <button
        //                                                 className="text-red-500 hover:text-red-600"
        //                                                 title="Delete"
        //                                                 onClick={() => handleDelete(product.id)}
        //                                             >
        //                                                 <FaTrash className="h-5 w-5" />
        //                                             </button>
        //                                         </div>
        //                                     </td>
        //                                 </tr>
        //                             );
        //                         })}
        //                     </tbody>

        //                 </table>

        //                 {/* Pagination */}
        //                 {/* <div className="flex justify-between items-center p-4 text-sm bg-gray-50 border-t flex-wrap gap-2">
        //                     <span>
        //                         Showing 1 to {Math.min(perPage, filteredProducts.length)} of {filteredProducts.length} entries
        //                     </span>
        //                     <div className="flex space-x-1">
        //                         <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">‹</button>
        //                         <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
        //                         <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
        //                         <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
        //                         <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">›</button>
        //                     </div>
        //                 </div> */}

        //                 {/* BOTTOM PAGINATION */}
        //                 {/* {totalPages > 1 && (
        //                     <div className="flex items-center justify-center mt-4">
        //                         <Pagination
        //                             currentPage={currentPage}
        //                             totalPages={totalPages}
        //                             onPageChange={setCurrentPage}
        //                         />
        //                     </div>
        //                 )} */}
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className="min-h-screen px-4 py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <h1 className="text-xl font-semibold text-gray-700">Products</h1>
                    <a
                        href="/application/ecom_product-add.html"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                        ＋ Add Product
                    </a>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Show</label>
                        <select
                            value={perPage}
                            onChange={e => setPerPage(Number(e.target.value))}
                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                        >
                            {[5, 10, 15, 20, 25].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-700">entries</span>
                    </div>

                    <input
                        type="search"
                        placeholder="Search by title, SKU, or slug..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full md:w-64 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0">
                            <tr>
                                <th className="text-left p-3">Product Info</th>
                                <th className="text-center p-3">Date Added</th>
                                <th className="text-right p-3">Price</th>
                                <th className="text-center p-3">Status</th>
                                <th className="text-center p-3">Viewed</th>
                                <th className="text-center p-3">Sold</th>
                                <th className="text-center p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-6 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.slice(0, perPage).map((product) => {
                                    const price = ((product.sale_price_cents ?? product.price_cents) / 100).toFixed(2);
                                    const currency = product.sale_price_currency || product.price_currency;
                                    const createdDate = new Date(product.created_at).toLocaleDateString();

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 transition">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.product_images?.[0] || "/placeholder.jpg"}
                                                        alt={product.title}
                                                        className="w-12 h-12 rounded object-cover border"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{product.title}</p>
                                                        <p className="text-xs text-gray-500">SKU: {product.u_pid}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center p-3">{createdDate}</td>
                                            <td className="text-right p-3">{price} {currency}</td>
                                            <td className="text-center p-3">
                                                {product.product_quantity > 0 ? (
                                                    <span className="text-green-600 font-medium">In Stock</span>
                                                ) : (
                                                    <span className="text-red-500 font-medium">Out of Stock</span>
                                                )}
                                            </td>
                                            <td className="text-center p-3">{product.impressions_count ?? 0}</td>
                                            <td className="text-center p-3">{product.likes ?? 0}</td>
                                            <td className="text-center p-3">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(product.slug)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={deletingId === product.id}
                                                        className={`${deletingId === product.id ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:text-red-800'
                                                            }`}
                                                        title="Delete"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default ProductList;
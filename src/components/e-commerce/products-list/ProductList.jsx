'use client';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { FiSearch } from "react-icons/fi";
import Pagination from "@/components/Pagination";



const PAGE_SIZE = 20;
const SKELETON_ROWS = 10;
const DEBOUNCE_DELAY = 500;

const ProductList = () => {
    const { user, token } = useSelector((state) => state.auth);
    const router = useRouter();
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);


    // SEARCH
    const [searchInput, setSearchInput] = useState('');  // immediate input
    const [searchQuery, setSearchQuery] = useState('');  // debounced


    // const filteredProducts = search
    //     ? products.filter((product) =>
    //         product.title?.toLowerCase().includes(search.toLowerCase()) ||
    //         product.u_pid?.toLowerCase().includes(search.toLowerCase()) ||
    //         product.slug?.toLowerCase().includes(search.toLowerCase())
    //     )
    //     : products;


    // get all products data 
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const res = await fetch("https://media.upfrica.com/api/seller/products", {
    //                 method: 'GET',
    //                 headers: { Authorization: `Token ${token}` },
    //             });
    //             if (!res.ok) throw new Error("Network response was not ok");
    //             const data = await res.json();
    //             console.log("Fetched products:", data.results); // ✅ Log to console
    //             setProducts(data.results); // Save to state if needed later
    //         } catch (error) {
    //             console.error("Failed to fetch products:", error);
    //         }
    //     };

    //     fetchProducts();
    // }, []);


    // get all produt list 

    useEffect(() => {
        if (!token) return;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const base = 'https://media.upfrica.com/api/seller/products';
                const url = searchQuery
                    ? `${base}/search/?q=${encodeURIComponent(searchQuery)}&page=${currentPage}`
                    : `${base}/?page=${currentPage}`;

                const res = await fetch(url, {
                    method: 'GET',
                    headers: { Authorization: `Token ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();

                setProducts(data.results || []);
                setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
            } catch (err) {
                console.error(err);
                setAlert({ type: 'error', message: 'Could not load products.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token, currentPage, searchQuery]);


    // Debounce the searchInput into searchQuery
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(searchInput.trim());
            setCurrentPage(1);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [searchInput]);

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
            <div className=" bg-white shadow-md rounded-lg p-6">

                {/* Header Actions */}
                {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <h1 className="text-xl font-semibold text-gray-700">Products</h1>
                    <a
                        href="/application/ecom_product-add.html"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                        ＋ Add Product
                    </a>
                </div> */}

                {/* HEADER + SEARCH */}
                <header className="flex items-center space-x-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold">Hi {user?.username}</h1>
                        <p className="text-gray-600">Welcome to seller dashboard</p>
                    </div>
                    <div className="relative flex-1 max-w-full">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products…"
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                </header>

                {/* ALERT BANNER */}
                {alert.message && (
                    <div
                        className={`mb-4 px-4 py-3 border rounded ${alert.type === 'success'
                            ? 'bg-green-100 border-green-400 text-green-700'
                            : 'bg-red-100 border-red-400 text-red-700'
                            }`}
                    >
                        <span>{alert.message}</span>
                        <button
                            onClick={() => setAlert({ type: '', message: '' })}
                            className="float-right font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* PRODUCTS TABLE */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">All Products</h2>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>

                    <table className="w-full table-fixed text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="w-[35%] pb-2">Product Info</th>
                                <th className="w-[10%] pb-2">Date Added</th>
                                <th className="w-[10%] pb-2">Price</th>
                                <th className="w-[10%] pb-2">Status</th>
                                <th className="w-[10%] pb-2">Viewed</th>
                                <th className="w-[10%] pb-2">Sold</th>
                                <th className="w-[15%] pb-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                                    <tr key={idx} className="even:bg-gray-50 animate-pulse">
                                        <td className="py-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded" />
                                                <div className="flex-1 max-w-[40%]">
                                                    <div className="h-4 bg-gray-200 mb-2 rounded w-3/4" />
                                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                                        </td>
                                        <td className="py-3">
                                            <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
                                        </td>
                                        <td className="py-3">
                                            <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                                        </td>
                                        <td className="py-3">
                                            <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
                                        </td>
                                        <td className="py-3">
                                            <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
                                        </td>
                                        <td className="py-3">
                                            <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((p) => (
                                    <tr key={p.id} className="even:bg-gray-50">
                                        <td className="py-3">
                                            <div className="flex items-center space-x-3">
                                                {p.product_images[0] && (
                                                    <img
                                                        src={p.product_images[0]}
                                                        alt={p.title}
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <div>{p.title}</div>
                                                    <div className="text-gray-500 text-sm">SKU: {p.u_pid}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3">
                                            {(p.price_cents / 100).toFixed(2)} {p.price_currency}
                                        </td>
                                        <td className="py-3">
                                            <span className={p.status === 1 ? 'text-green-600' : 'text-red-600'}>
                                                {p.status === 1 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="py-3">{p.impressions_count ?? 0}</td>
                                        <td className="py-3">{p.likes ?? 0}</td>
                                        {/* <td className="py-3 space-x-4">
                                            <button
                                                onClick={() => handleEdit(p.slug)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                disabled={deletingId === p.id}
                                                className={`${deletingId === p.id
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:underline'
                                                    }`}
                                            >
                                                {deletingId === p.id ? 'Deleting…' : 'Delete'}
                                            </button>
                                        </td> */}
                                        <td className="py-3 space-x-4">
                                            <button
                                                onClick={() => handleView(p.slug)}
                                                title="View"
                                                className="transition duration-300"
                                            >
                                                <FaEye className="text-[#2B3F6C] h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(p.slug)}
                                                title="Edit"
                                                className="transition duration-300"
                                            >
                                                <FaEdit className="text-[#2B3F6C] h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                disabled={deletingId === p.id}
                                                title="Delete"
                                                className={`transition duration-300 ${deletingId === p.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <FaTrash className="text-[#2B3F6C] h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-4 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                
            </div>
        </div>

    );
};

export default ProductList;
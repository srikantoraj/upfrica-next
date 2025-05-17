'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { MdRemoveRedEye, MdDelete } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 20;

export default function RecentOrdersPage() {
    const { token, user } = useSelector((state) => state.auth);
    const router = useRouter();

    const [orderItems, setOrderItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!token) return;
        const fetchOrderItems = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://media.upfrica.com/api/seller/order-items/?page=${currentPage}`,
                    { method: 'GET', headers: { Authorization: `Token ${token}` } }
                );
                if (!res.ok) throw new Error('Failed to fetch');
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
    }, [token, currentPage]);

    const handleView = (slug) => router.push(`/${user?.country?.toLocaleDateString() || 'gh'}/${slug}`);
    const handleEdit = (id) => router.push(`/new-dashboard/all-orders/${id}`);
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(
                `https://media.upfrica.com/api/seller/order-items/${id}/`,
                { method: 'DELETE', headers: { Authorization: `Token ${token}` } }
            );
            if (!res.ok) throw new Error('Delete failed');
            setOrderItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredItems = orderItems.filter((item) => {
        const title = item.product.title.toLowerCase();
        const sku = item.product.u_pid.toLowerCase();
        return title.includes(searchTerm.toLowerCase()) || sku.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="w-full  mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Recent Orders</h1>

            {/* Search + Pagination */}
            <div className="flex items-center justify-between mb-4">
                <div className="relative w-1/2">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        placeholder="Search orders..."
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

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-2 w-[35%]">Product Info</th>
                            <th className="pb-2">Date Added</th>
                            <th className="pb-2">Price</th>
                            <th className="pb-2">Status</th>
                            <th className="pb-2">Viewed</th>
                            <th className="pb-2">Sold</th>
                            <th className="pb-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse even:bg-gray-50">
                                    <td colSpan="7" className="py-4">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : orderItems.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 text-center text-gray-500">
                                    No matching orders.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => {
                                const { product } = item;
                                const isPending = item.dispatch_status === 0;
                                return (
                                    <tr key={item.id} className="even:bg-gray-50">
                                        <td className="py-3">
                                            <div className="flex items-center space-x-3">
                                                {product.product_images[0] && (
                                                    <img
                                                        src={product.product_images[0]}
                                                        alt={product.title}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">{product.title}</div>
                                                    <div className="text-gray-500 text-sm">
                                                        SKU: {product.u_pid}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{new Date(item.order_date).toLocaleDateString()}</td>
                                        <td>
                                            {(item.price_cents / 100).toFixed(2)}{' '}
                                            {item.price_currency.toUpperCase()}
                                        </td>
                                        <td>
                                            <span
                                                className={isPending ? 'text-yellow-600 font-semibold' : 'text-green-600 font-semibold'}
                                            >
                                                {isPending ? 'Pending' : 'Dispatched'}
                                            </span>
                                        </td>
                                        <td>{product.impressions_count ?? 0}</td>
                                        <td>{item.quantity}</td>
                                        <td className="py-3 flex space-x-2">
                                            <button
                                                onClick={() => handleView( item.seo_slug)}
                                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full font-bold text-gray-700"
                                                aria-label="View"
                                            >
                                                <MdRemoveRedEye size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item.id)}
                                                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full font-bold text-blue-700"
                                                aria-label="Edit"
                                            >
                                                <FaEdit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className={`p-2 rounded-full font-bold ${deletingId === item.id
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-red-100 hover:bg-red-200 text-red-700'
                                                    }`}
                                                aria-label="Delete"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

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

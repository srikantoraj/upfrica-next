'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const PAGE_SIZE = 20;

export default function DashboardPage() {
    const { user, token } = useSelector((state) => state.auth);
    const router = useRouter();

    // ORDER ITEMS & PAGINATION
    const [orderItems, setOrderItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // DELETE STATE
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!token) return;

        const fetchOrderItems = async () => {
            setLoading(true);
            try {
              
                const url = `https://media.upfrica.com/api/seller/order-items/?page=${currentPage}`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Token ${token}`,
                        
                    },
                    
                });
                if (!res.ok) throw new Error('Failed to fetch order items');
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

    const handleEdit = (id) => {
        router.push(`/new-dashboard/order-edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(
                `https://media.upfrica.com/api/seller/order-items/${id}/`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Token ${token}` }
                }
            );
            if (!res.ok) throw new Error('Delete failed');
            setOrderItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    // Example stats — replace with real data if you have it
    const stats = {
        newOrders: 23,
        shipped: 14,
        complaints: 2,
        newChats: 19
    };

    const statsCards = [
        { title: 'New Order', value: stats.newOrders, change: '+21% from last month', type: 'green' },
        { title: 'Shipped', value: stats.shipped, change: '+56% from last month', type: 'green' },
        { title: 'Complain', value: stats.complaints, change: '-40% from last month', type: 'red' },
        { title: 'New Chat', value: stats.newChats, change: '+37% from last month', type: 'green' }
    ];

    // Example selling chart data — replace with your own
    const sellingData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            data: [1000, 1200, 1500, 1300, 2700, 2200, 1800, 1450, 2784, 2330, 1600, 2000],
            tension: 0.4,
            borderColor: '#7C3AED',
            fill: false
        }]
    };

    return (
        <>
            {/* HEADER + SEARCH */}
            <header className="flex items-center mb-6 space-x-6">
                <div>
                    <h1 className="text-3xl font-semibold">Hi {user?.username}</h1>
                    <p className="text-gray-600">Welcome to seller dashboard</p>
                </div>
                <div className="relative flex-1 max-w-full">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search something here ..."
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                </div>
            </header>

            {/* STATS CARDS */}
            <div className="grid grid-cols-4 gap-6 mb-4">
                {statsCards.map((c, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-600">{c.title}</p>
                        <p className="text-2xl font-bold">{c.value}</p>
                        <p className={`text-sm ${c.type === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                            {c.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* SELLING CHART */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-40 py-2 mb-10">
                <h2 className="text-xl font-semibold mb-4">Your Selling</h2>
                <div className="h-36">
                    <Line
                        data={sellingData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true } }
                        }}
                    />
                </div>
            </div>

            {/* RECENT ORDERS TABLE */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-2 w-[40%]">Product Info</th>
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
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : orderItems.length > 0 ? (
                            orderItems.map((item) => {
                                const { product } = item;
                                const statusText = item.dispatch_status === 0 ? 'Pending' : 'Dispatched';
                                const statusColor = item.dispatch_status === 0 ? 'text-yellow-600' : 'text-green-600';

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
                                                    <div>{product.title}</div>
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
                                            <span className={statusColor}>{statusText}</span>
                                        </td>
                                        <td>{product.impressions_count ?? 0}</td>
                                        <td>{item.quantity}</td>
                                        <td className="py-3 space-x-4">
                                            <button
                                                onClick={() => handleEdit(item.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className={`${deletingId === item.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-red-600 hover:underline'
                                                    }`}
                                            >
                                                {deletingId === item.id ? 'Deleting…' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-4 text-center text-gray-500">
                                    No recent orders found!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

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
        </>
    );
}


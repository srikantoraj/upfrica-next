'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
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

export default function DashboardPage() {
    const { user, token } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!token) return;
        fetch('https://media.upfrica.com/api/seller/orders/', {
            method: 'GET',
            headers: { Authorization: `Token ${token}` }
        })
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    }, [token]);

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
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-2">Product Info</th>
                            <th className="pb-2">Date Added</th>
                            <th className="pb-2">Price</th>
                            <th className="pb-2">Status</th>
                            <th className="pb-2">Viewed</th>
                            <th className="pb-2">Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.slice(0, 5).map(p => (
                            <tr key={p.id} className="even:bg-gray-50">
                                <td className="py-3">
                                    <div className="flex items-center space-x-3">
                                        {p.product_images[0] && (
                                            <img
                                                src={p.product_images[0]}
                                                alt={p.title}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <div>{p.title}</div>
                                            <div className="text-gray-500 text-sm">SKU: {p.u_pid}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                <td>{(p.price_cents / 100).toFixed(2)} {p.price_currency}</td>
                                <td>
                                    <span className={p.status === 1 ? 'text-green-600' : 'text-red-600'}>
                                        {p.status === 1 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>{p.impressions_count ?? 0}</td>
                                <td>{p.likes ?? 0}</td>
                            </tr>
                        ))}
                        {
                            products.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No recent orders found!
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}


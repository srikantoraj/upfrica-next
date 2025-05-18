
// import RecentOrders from '@/components/overview/RecentOrders';
// import SalesCardGroup from '@/components/overview/SalesCardGroup';
// import SellerOrdersData from '@/components/overview/SellerOrdersData';
// import React from 'react';

// const page = () => {
//     return (
//         <div className='my-4 space-y-4'>
//             <SalesCardGroup />
//             <SellerOrdersData />
//             <RecentOrders />

//         </div>
//     );
// };

// export default page;


// app/page.jsx  (or pages/dashboard.js if you’re using the Pages Router)
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SalesCardGroup from "@/components/overview/SalesCardGroup";
import SellerOrdersData from "@/components/overview/SellerOrdersData";
import RecentOrders from "@/components/overview/RecentOrders";

const DashboardPage = () => {

    const {token} = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(
                    "https://media.upfrica.com/api/seller/dashboard-summary/",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const json = await res.json();
                setStats(json.stats);
            } catch (err) {
                console.error("Failed to load dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="my-4 space-y-4">
            <SalesCardGroup stats={stats?.sales} loading={loading} />
            <SellerOrdersData orders={stats?.orders} loading={loading} />
            <RecentOrders /> {/* leave as-is or wire up similarly */}
        </div>
    );
};

export default DashboardPage;

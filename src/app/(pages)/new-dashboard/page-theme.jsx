"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SalesCardGroup from "@/components/overview/SalesCardGroup";
import SellerOrdersData from "@/components/overview/SellerOrdersData";
import RecentOrders from "@/components/overview/RecentOrders";
import { BASE_API_URL } from '@/app/constants';

const DashboardPage = () => {

    const { token } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(
                    `${BASE_API_URL}/api/seller/dashboard-summary/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token?.replace(/^"|"$/g, '')}`,
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
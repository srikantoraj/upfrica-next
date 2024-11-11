"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileCard from "@/components/order/ProfileCard";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import OrderBord from "@/components/order/OrderBord";
import { OrderContext } from "@/contexts/OrderContext"; // Import the context

const OrderPageLayout = ({ children }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setError("No user token found");
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.token) {
        try {
          const response = await fetch(
            "https://upfrica-staging.herokuapp.com/api/v1/orders",
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok)
            throw new Error(`Server responded with status ${response.status}`);
          const result = await response.json();
          setData(result?.orders || []);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  if (loading)
    return (
      <div className="text-center">
        <LoadingSpinner />
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <OrderContext.Provider value={{ data, error, loading, user, setData }}>
      <div className="bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 py-5 gap-10">
          <div className="col-span-1">
            <ProfileCard data={data} />
          </div>
          <div className="col-span-3">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-center mb-6">My Orders</h2>
              <OrderBord />
              {/* Render children components */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </OrderContext.Provider>
  );
};

export default OrderPageLayout;

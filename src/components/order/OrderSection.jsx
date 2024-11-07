"use client";
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FaLocationPin } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import OrderBord from './OrderBord';
import OrderCart from './OrderCart';

const OrderSection = () => {
    const [data, setData] = useState([]); // Initialize data as an empty array
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUser = () => {
            if (typeof window !== "undefined") {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setError('No user token found');
                }
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && user.token) {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${user.token}`);
                myHeaders.append("Content-Type", "application/json");

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow"
                };

                try {
                    const response = await fetch("https://upfrica-staging.herokuapp.com/api/v1/orders", requestOptions);
                    if (!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`);
                    }
                    const result = await response.json();
                    console.log("Fetched Orders:", result);
                    setData(result?.orders || []); // Ensure data is an array
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false); // Stop loading when finished
                }
            }
        };

        fetchOrders();
    }, [user]);

    const handleDelete = async (itemId) => {
        console.log(itemId)
        if (user && user.token) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${user.token}`);
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow"
            };

            try {
                const response = await fetch(`https://upfrica-staging.herokuapp.com/api/v1/orders/${itemId}`, requestOptions);
                if (!response.ok) {
                    throw new Error(`Failed to delete item: ${response.status}`);
                }

                const filteredData = data.filter(product => product.id !== itemId);
                console.log(filteredData)

                setData(filteredData)

            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) {
        return <div className="text-center"><LoadingSpinner /></div>; // Skeleton loader
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>; // Display error message
    }

    return (
        <div className=" p-6">
            <h2 className="text-3xl font-bold text-center mb-6">My Orders</h2>
            <OrderBord />
            <OrderCart data={data} handleDelete={handleDelete} />
        </div>
    );
};

export default OrderSection;

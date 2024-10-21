"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FaLocationPin } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

const OrderPage = () => {
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

    
                
                const filteredData = data.filter(product => product.id !== itemId );
                console.log(filteredData)

                setData(filteredData)
             
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>; // Skeleton loader
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>; // Display error message
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-6">Your Cart</h2>
            <div className="space-y-4">
                {data?.map((product) => (
                    <div key={product.id} className="border border-gray-300 p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                        {product?.cart_items?.map(item => (
                            <div key={item.id} className="border border-gray-200 p-4 rounded-lg mb-2 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex gap-4">
                                    <img src={item.product.product_images[0]} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <p className="text-lg font-medium text-gray-700">{item.product.title}</p>
                                        <p className="flex gap-4 items-center">
                                            <span className="text-sm text-gray-600">Price: ${item.product.price.cents / 100}</span>
                                            <span className="text-sm text-green-600">Delivery: Free</span>
                                        </p>
                                        <p className="flex items-center space-x-2 text-sm text-gray-500">
                                            <FaLocationPin className="text-gray-400" />
                                            <span>{item.product.user.town}, {item.product.user.country}</span>
                                            <span className="font-semibold">{item.product.user.first_name}</span>
                                            |
                                            <span className="hover:text-red-500 cursor-pointer">{item.product.user.username}</span>
                                            |
                                            <span className="hover:text-red-500 cursor-pointer">WhatsApp</span>
                                            |
                                            <span className="hover:text-red-500 cursor-pointer">{item.product.user.email}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">Added: 3 days ago</p>
                                        <p className="mt-2 text-gray-700">Product ID: {product.id}</p> {/* Added Cart Item ID */}
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">Quantity: {item.quantity}</p>
                                <p className="text-gray-700">Status: {product.delivery_status}</p>

                                {/* Edit and Delete buttons */}
                                <div className="flex justify-end space-x-2 mt-4">
                                    <Link href={`/products/new?id=${item.id}`} className="text-[#AF35F0] font-semibold flex items-center gap-1">
                                        <CiEdit className="h-5 w-5" /> Edit
                                    </Link>
                                    <span
                                        className="flex items-center space-x-1 text-red-500 cursor-pointer hover:text-red-700"
                                        onClick={() => handleDelete(product.id)} // Call delete function
                                    >
                                        <MdDelete className="h-6 w-6" /> <span className="font-semibold">Delete</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;

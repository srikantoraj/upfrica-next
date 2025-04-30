"use client";
import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// LoadingDots component for indicating loading status
const LoadingDots = ({ color = "white" }) => (
    <div className="flex space-x-1 justify-center items-center h-5">
        <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
        <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
        <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce`}></div>
    </div>
);

const DirectBuyPopup = ({ product, isVisible, onClose, quantity }) => {
    const router = useRouter();
    const { token } = useSelector((state) => state.auth) || {};

    const [addresses, setAddresses] = useState([]);
    const [isAddressLoading, setIsAddressLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("paystack");
    const [acceptedPolicy, setAcceptedPolicy] = useState(true);

    const [directBuyQuantity, setDirectBuyQuantity] = useState(quantity);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [error, setError] = useState("");

    const pricePerItem = product?.price_cents ? product.price_cents / 100 : 0;
    const postageFee = product?.postage_fee_cents ? product.postage_fee_cents / 100 : 0;
    const totalCharges = (pricePerItem * directBuyQuantity + postageFee).toFixed(2);

    let estimatedDelivery = "N/A";
    if (product && product.dispatch_time_in_days) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + parseInt(product.dispatch_time_in_days, 10));
        estimatedDelivery = deliveryDate.toLocaleDateString();
    }

    useEffect(() => {
        if (!token) {
            router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
            return;
        }

        const fetchAddresses = async () => {
            try {
                const response = await fetch("https://media.upfrica.com/api/addresses/", {
                    method: "GET",
                    headers: { "Authorization": `Token ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Error fetching addresses");
                }

                const data = await response.json();
                const options = data.map((addr) => ({
                    id: addr.id,
                    value: `${addr.address_data.address_line_1}, ${addr.address_data.town}, ${addr.address_data.country}`,
                }));
                setAddresses(options);
                if (options.length > 0) {
                    setSelectedAddressId(options[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
                const dummy = [{ id: "dummy1", value: "123 Main Street, Dummy Town, Dummy Country" }];
                setAddresses(dummy);
                setSelectedAddressId(dummy[0].id);
            } finally {
                setIsAddressLoading(false);
            }
        };

        fetchAddresses();
    }, [token, router]);

    const decrementQuantity = () => setDirectBuyQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    const incrementQuantity = () => setDirectBuyQuantity((prev) => prev + 1);

    const handleConfirmPurchase = async () => {
        setError("");
        if (!acceptedPolicy) {
            setError("You must agree to the rules, guidelines, and policies to continue.");
            return;
        }
        setIsConfirmLoading(true);

        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Token ${token}`);
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                product: product.id,
                quantity: directBuyQuantity,
                address: selectedAddressId,
                payment_method_id: paymentMethod,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            const response = await fetch("https://media.upfrica.com/api/cart/direct-buy/", requestOptions);
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Error: ${errText}`);
            }
            const result = await response.json();
            if (result.payment_url) {
                router.push(result.payment_url);
            } else {
                throw new Error("Payment URL not received.");
            }
        } catch (err) {
            console.error("Direct buy error:", err);
            setError("There was an issue processing your purchase. Please try again later.");
            setIsConfirmLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold">Buy Now</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <HiXMark className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="mt-4 space-y-4">
                    {/* Product Summary with Quantity Selector */}
                    <div className="flex items-center gap-4 p-3 border rounded">
                        <img
                            src={product?.product_images?.[0] || "https://via.placeholder.com/80"}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                            <p
                                className="text-sm md:text-base font-medium text-gray-800 line-clamp-2"
                                title={product.title}
                            >
                                {product.title}
                            </p>
                            <p className="text-sm text-gray-600">
                                {product.price_currency} {pricePerItem.toFixed(2)} x {directBuyQuantity}
                            </p>
                            <div className="flex items-center mt-2">
                                <button onClick={decrementQuantity} className="px-2 py-1 border rounded-l text-gray-700">
                                    –
                                </button>
                                <div className="px-4 py-1 border-t border-b text-gray-800 font-medium">
                                    {directBuyQuantity}
                                </div>
                                <button onClick={incrementQuantity} className="px-2 py-1 border rounded-r text-gray-700">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-1">
                        <p className="text-sm text-gray-700">
                            Estimated Delivery: <span className="font-medium">{estimatedDelivery}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            Delivery Charges: <span className="font-medium">
                                {postageFee === 0 ? "Free" : `${product.price_currency} ${postageFee.toFixed(2)}`}
                            </span>
                        </p>
                    </div>

                    {/* Return Policy Card */}
                    <div>
                        {product.cancellable ? (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                                <p className="text-sm">
                                    Return Policy: Can be returned within {product.secondary_data?.return_in_days || "N/A"} (Cost by: {product.secondary_data?.returns_cost_by || "N/A"}).
                                </p>
                            </div>
                        ) : (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                                <p className="text-sm">Return Policy: This product is not returnable.</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
                        <div className="flex gap-6">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="stripe"
                                    checked={paymentMethod === "stripe"}
                                    onChange={() => setPaymentMethod("stripe")}
                                    className="mr-2"
                                />
                                Stripe
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paystack"
                                    checked={paymentMethod === "paystack"}
                                    onChange={() => setPaymentMethod("paystack")}
                                    className="mr-2"
                                />
                                Paystack
                            </label>
                        </div>
                    </div>

                    {/* Total Charges */}
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Total Charges: {product.price_currency} {totalCharges}
                        </p>
                    </div>

                    {/* Policy Agreement */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={acceptedPolicy}
                            onChange={() => setAcceptedPolicy(!acceptedPolicy)}
                            className="mr-2"
                        />
                        <p className="text-sm text-gray-700">I agree to the rules, guidelines, and policies.</p>
                    </div>

                    {/* Address Dropdown or Skeleton Loader */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                        {isAddressLoading ? (
                            <div className="animate-pulse">
                                <div className="h-10 bg-gray-300 rounded w-full"></div>
                            </div>
                        ) : (
                            <select
                                value={selectedAddressId}
                                onChange={(e) => setSelectedAddressId(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 text-sm"
                            >
                                {addresses.map((addr) => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.value}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                {/* Footer with Confirm Button */}
                <div className="mt-6">
                    <button
                        onClick={handleConfirmPurchase}
                        disabled={isConfirmLoading}
                        className="w-full bg-[#8710D8] text-white py-2 rounded hover:bg-purple-700 font-bold flex items-center justify-center"
                    >
                        {isConfirmLoading ? <LoadingDots color="white" /> : "Confirm Purchase"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectBuyPopup;
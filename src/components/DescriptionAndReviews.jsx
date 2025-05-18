"use client";

import React, { useState, useEffect } from "react";
import { MdOutlinePhone } from "react-icons/md";
import { FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";

import CustomerReviewsSection from "./CustomerReviewsSection";
import CreateReview from "./CreateReview";

export default function DescriptionAndReviews({
    details,
    condition,
    user,      // <-- seller
    shop,
    product,
}) {
    const [showPhone, setShowPhone] = useState(false);
    const [openTab, setOpenTab] = useState("specifics");
    const { user: currentUser, token } = useSelector((s) => s.auth);

    // follow state
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [products, setProducts] = useState(0);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const condition_value = condition?.name || "N/A";
    const phoneText = showPhone ? user?.phone_number : "Click to view number";
    const properties = product?.properties || [];

    const canEditSpecifics =
        properties.length >= 1
            ? currentUser?.admin === true
            : currentUser?.username === user?.username;

    const API_BASE = "https://media.upfrica.com/api";

    // Fetch initial follow status/count
    useEffect(() => {
        if (!user?.id) return;
        const headers = {};
        if (token) headers["Authorization"] = `Token ${token}`;
        fetch(`${API_BASE}/users/${user.id}/follow/status/`, {
            method: "GET",
            headers,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch follow status");
                return res.json();
            })
            .then((data) => {
                setIsFollowing(data.is_following);
                setFollowersCount(data.followers_count);
                setProducts(data.products_count);
            })
            .catch((err) => console.error(err));
    }, [user?.id, token]);

    // Follow/unfollow handler
    const handleToggleFollow = async () => {
        if (!token) {
            alert("Please log in to follow sellers.");
            return;
        }
        setLoadingFollow(true);
        try {
            const res = await fetch(
                `${API_BASE}/users/${user.id}/follow/`,
                {
                    method: isFollowing ? "DELETE" : "POST",
                    headers: { "Authorization": `Token ${token}` },
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (res.status === 400 && data.detail === "Can't follow yourself.") {
                    alert("cant follow yourself");
                } else {
                    throw new Error(data.detail || "Follow action failed");
                }
            } else {
                setIsFollowing((f) => !f);
                setFollowersCount((n) => n + (isFollowing ? -1 : 1));
            }
        } catch (err) {
            console.error(err);
            if (err.message !== "Can't follow yourself.") {
                alert("Could not update follow status.");
            }
        } finally {
            setLoadingFollow(false);
        }
    };

    return (
        <main className="mx-auto max-w-screen-xl py-8 text-gray-800">
            {/* ITEM DETAILS */}
            <header className="pb-4 border-b border-gray-300">
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
                    Item Details
                </h2>
            </header>

            <section className="mt-6 space-y-4">
                {/* specifics */}
                <div className="border rounded-xl">
                    <button
                        onClick={() =>
                            setOpenTab(openTab === "specifics" ? "" : "specifics")
                        }
                        className="w-full flex justify-between items-center p-4 font-medium text-left"
                    >
                        Product specifics
                        <span>{openTab === "specifics" ? "−" : "+"}</span>
                    </button>
                    {openTab === "specifics" && (
                        <div className="p-4 border-t text-sm text-gray-700 space-y-2">
                            {canEditSpecifics && (
                                <Link
                                    href={`/products/edit/specifics/${product?.id}`}
                                    className="flex items-center gap-2 mb-2 text-violet-700"
                                >
                                    <FaEdit className="h-4 w-4" />
                                    <span className="hover:underline">Edit Specifics</span>
                                </Link>
                            )}
                            <p>
                                <b>Seller location:</b> {user?.town} – {user?.country}
                            </p>
                            <p>
                                <b>Condition:</b> {condition_value}
                            </p>
                            {properties.map((item) => (
                                <p key={item.id}>
                                    <b>{item.property.label}:</b> {item.value}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* description */}
                <div className="border rounded-xl">
                    <button
                        onClick={() =>
                            setOpenTab(openTab === "description" ? "" : "description")
                        }
                        className="w-full flex justify-between items-center p-4 font-medium text-left"
                    >
                        Item description from seller
                        <span>{openTab === "description" ? "−" : "+"}</span>
                    </button>
                    {openTab === "description" && (
                        <div
                            className="p-4 border-t text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: details }}
                        />
                    )}
                </div>
            </section>

            {/* SELLER INFO */}
            <section className="mt-8 max-w-xl">
                <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                        {shop?.shop_logo ? (
                            <img
                                src={shop.shop_logo}
                                alt={shop?.name}
                                className="w-16 h-16 rounded-full shadow"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                N/A
                            </div>
                        )}
                        <div>
                            <h6 className="text-base font-medium mb-1">
                                {user?.username}
                            </h6>
                            <ul className="flex items-center gap-4 text-sm text-gray-600">
                                <li>
                                    {followersCount} follower
                                    {followersCount === 1 ? "" : "s"}
                                </li>
                                <li className="text-green-600">
                                    {products?? "—"} Items
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleToggleFollow}
                            disabled={loadingFollow}
                            className={`
                flex-1 flex justify-center items-center gap-2
                border rounded-full px-4 py-2 text-sm font-semibold
                ${isFollowing ? "border-violet-700" : "border-gray-300"}
                ${loadingFollow ? "bg-violet-700" : "bg-white"}
                disabled:opacity-50
              `}
                        >
                            {loadingFollow ? (
                                <div className="flex space-x-2 justify-center items-center h-6">
                                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
                                </div>
                            ) : (
                                <>
                                    {React.createElement(
                                        isFollowing ? FaHeart : FaRegHeart,
                                        {
                                            className: `h-5 w-5 ${isFollowing ? "text-violet-700" : "text-gray-600"
                                                }`,
                                        }
                                    )}
                                    <span
                                        className={`ml-2 ${isFollowing ? "text-violet-700" : "text-gray-600"
                                            }`}
                                    >
                                        {isFollowing ? "Followed" : "Not Followed"}
                                    </span>
                                </>
                            )}
                        </button>

                        <Link
                            href={`/shops/${shop?.slug}`}
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold text-center"
                        >
                            Shop all items
                        </Link>
                    </div>

                    <button
                        onClick={() => setShowPhone(!showPhone)}
                        className="w-full flex items-center justify-center gap-2 border border-purple-500 text-purple-500 rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        <MdOutlinePhone />
                        {phoneText}
                    </button>
                </div>
            </section>

            {/* CUSTOMER REVIEWS */}
            <section className="mt-12">
                <CustomerReviewsSection slug={product?.slug} />
            </section>

            {/* CREATE REVIEW */}
            <CreateReview slug={product?.slug} />

            {/* DISCLAIMER */}
            <section className="mt-12 bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-2">
                <p>
                    <strong>Legal Disclaimer:</strong> The Seller takes full
                    responsibility for this listing.
                </p>
                <p>
                    Product info may change. Always read the label and packaging
                    before use. If in doubt, contact the manufacturer.
                </p>
                <p>
                    Content is not intended as medical advice. Contact a health
                    professional if needed.
                </p>
                <p>
                    Upfrica is not liable for product errors or third-party
                    misinformation. Your statutory rights are unaffected.
                </p>
            </section>
        </main>
    );
}

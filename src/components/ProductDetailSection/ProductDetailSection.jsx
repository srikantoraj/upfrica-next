"use client";
import React, { useEffect, useState } from "react";
import MultiBuySection from "../MultiBuySection";
import { MdArrowRightAlt } from "react-icons/md";
import { FaHeart, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import BasketModal from "../BasketModal";
import { ImInfo } from "react-icons/im";
import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
import DescriptionAndReviews from "../DescriptionAndReviews";
import { convertPrice } from "@/app/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
import RecentlyViewed from "../RecentlyViewed";

export default function ProductDetailSection({ product }) {
    const dispatch = useDispatch();
    const basket = useSelector((state) => state.basket.items) || [];
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    // Use mediaIndex to track which media is being shown (video or image)
    const [mediaIndex, setMediaIndex] = useState(0);

    const {
        id,
        title,
        description,
        price_cents,
        price_currency,
        postage_fee,
        sale_end_date,
        sale_start_date,
        product_video,
        product_images,
        seller_town,
        condition, // condition is an object, e.g. condition.name
        category,
    } = product || {};

    const exchangeRates = useSelector((state) => state.exchangeRates.rates);
    const convertedPrice = convertPrice(price_cents / 100, price_currency, "GHS", exchangeRates);

    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const saleStart = new Date(sale_start_date);
        const saleEnd = new Date(sale_end_date);
        const currentDate = new Date();
        const remaining = saleEnd - currentDate;

        setTimeRemaining({
            days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
            hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((remaining / (1000 * 60)) % 60),
            seconds: Math.floor((remaining / 1000) % 60),
        });
    }, [sale_start_date, sale_end_date]);

    // Build a unified media array: video first (if exists), then images
    const mediaItems = [];
    if (product_video) {
        mediaItems.push({ type: "video", src: product_video });
    }
    if (product_images && product_images.length > 0) {
        product_images.forEach((img) => mediaItems.push({ type: "image", src: img }));
    }

    const handleAddToBasket = () => {
        const productData = { id, title, price_cents, quantity: 1, image: product_images };
        dispatch(addToBasket(productData));
        setIsModalVisible(true);
    };

    const handleCloseModal = () => setIsModalVisible(false);

    const handleQuantityChange = (id, quantity) => {
        dispatch(updateQuantity({ id, quantity }));
    };

    const handleRemoveProduct = (id) => {
        dispatch(removeFromBasket(id));
    };

    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
            {/* Updates localStorage with the current product */}
            <RecentlyViewed product={product} />
            <div data-sticky-container>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* LEFT CONTENT */}
                    <div className="order-1 xl:col-span-7">
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin">
                            <span className="font-medium text-base md:text-sm lg:text-sm text-gray-600">Upfrica UK</span>
                            <span className="text-blue-600">&gt;</span>
                            <a
                                className="inline-block text-base md:text-sm lg:text-sm text-blue-600 hover:underline"
                                href="/categories/home-appliances-furniture"
                            >
                                Fashion
                            </a>
                            <span className="text-blue-600">&gt;</span>
                            <a
                                className="inline-block text-base md:text-sm lg:text-sm text-blue-600 hover:underline"
                                href="/categories/kitchen-appliances"
                            >
                                Footwear
                            </a>
                            <span className="text-blue-600">&gt;</span>
                            <a
                                className="inline-block text-base md:text-sm lg:text-sm text-blue-600 hover:underline"
                                href="/categories/popcorn-makers"
                            >
                                Sneakers
                            </a>
                            <span className="text-blue-600">&gt;</span>
                            <span className="inline-block font-semibold text-base md:text-sm lg:text-sm text-black truncate">
                                Gravity-Defying Performance: The Future of Sneakers
                            </span>
                        </div>

                        {/* Main media gallery (video and images in same container) */}
                        <section className="mt-2 bg-gray-50">
                            <div className="relative">
                                {/* Discount Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <div className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">2% Off</div>
                                </div>
                                <div className="border rounded overflow-hidden bg-white w-full mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                                    {mediaItems.length > 0 &&
                                        (mediaItems[mediaIndex].type === "video" ? (
                                            <video
                                                className="w-[400px] lg:w-[510px] h-[400px] lg:h-[510px] object-cover"
                                                controls
                                                src={mediaItems[mediaIndex].src}
                                            />
                                        ) : (
                                            <img
                                                className="w-[400px] lg:w-[510px] h-[400px] lg:h-[510px] object-cover"
                                                src={mediaItems[mediaIndex].src}
                                                alt={`Media ${mediaIndex}`}
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* Thumbnails: render both video and image thumbnails */}
                            {mediaItems.length > 1 && (
                                <div className="mt-3 flex space-x-3 overflow-x-auto scrollbar-thin">
                                    {mediaItems.map((item, idx) => (
                                        <div key={idx} onClick={() => setMediaIndex(idx)}>
                                            {item.type === "video" ? (
                                                <div className="relative">
                                                    <video
                                                        className={`h-[75px] w-[75px] object-cover rounded-md cursor-pointer border-2 ${mediaIndex === idx ? "border-purple-500" : "border-gray-300"
                                                            }`}
                                                        src={item.src}
                                                        muted
                                                        loop
                                                        playsInline
                                                    />
                                                    {/* Optional play icon overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6 text-white"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M14.752 11.168l-5.197-3.028A1 1 0 008 9.028v5.944a1 1 0 001.555.832l5.197-3.028a1 1 0 000-1.664z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    className={`h-[75px] w-[75px] object-cover rounded-md cursor-pointer border-2 ${mediaIndex === idx ? "border-purple-500" : "border-gray-300"
                                                        }`}
                                                    src={item.src}
                                                    alt={`Thumbnail ${idx}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* MOBILE CTA (hidden on xl) */}
                        <section className="block xl:hidden mt-5">
                            <div className="bg-white lg:p-4 space-y-4">
                                <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-800 product-title">{title}</h1>
                                <div className="text-base md:text-lg lg:text-xl text-gray-600">
                                    <b>4480 sold</b> — Visit the <b className="text-[#8710D8]">Upfrica GH</b> Shop — Accra, GH
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-yellow-500 text-base md:text-lg lg:text-xl">★★★★☆</span>
                                    <span className="underline text-blue-600 text-base md:text-lg lg:text-xl">595 Reviews</span>
                                    <span className="text-base md:text-lg lg:text-xl ml-2">✅ Verified Seller</span>
                                </div>
                                <hr className="border-gray-200" />
                                {/* Price */}
                                <div>
                                    <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">₵285</span>
                                    <span className="ml-1 text-base md:text-lg lg:text-xl text-gray-500">each</span>
                                    <p className="text-base md:text-lg lg:text-xl text-gray-500">
                                        was <del>₵400</del> — You Save: ₵200 (2%)
                                    </p>
                                    <div className="mt-1">
                                        <span className="px-2 py-1 bg-red-700 text-white text-xs rounded">
                                            <i className="fa fa-bolt" /> Sales
                                        </span>
                                        <small className="ml-2 text-red-700 font-medium">ends in <span>32 days 09:58:49</span></small>
                                    </div>
                                </div>
                                <MultiBuySection />
                                {/* Buttons */}
                                <div className="grid gap-2">
                                    <button className="bg-[#8710D8] hover:bg-purple-700 text-white px-4 py-2 text-base md:text-lg font-bold rounded-3xl">
                                        Buy Now
                                    </button>
                                    <button onClick={handleAddToBasket} className="border border-[#f7c32e] px-4 py-2 hover:bg-yellow-50 text-base md:text-lg rounded-3xl">
                                        Add to Basket
                                    </button>
                                    <button className="border border-[#f7c32e] px-4 py-2 hover:bg-yellow-50 text-base md:text-lg rounded-3xl">
                                        Buy Now Pay Later (BNPL)
                                    </button>
                                    <button className="border border-[#f7c32e] px-4 py-2 hover:bg-yellow-50 text-base md:text-lg rounded-3xl">
                                        <i className="fa-regular fa-heart mr-1" />
                                        Add to Watchlist
                                    </button>
                                </div>
                                <PaymentDeliveryReturns />
                            </div>
                        </section>

                        <DescriptionAndReviews details={description} />
                    </div>
                    {/* END LEFT CONTENT */}

                    {/* RIGHT SIDEBAR */}
                    <aside className="order-2 hidden xl:block xl:col-span-5">
                        <div className="sticky top-20 space-y-4">
                            <div className="p-5">
                                <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-2 leading-7 product-title">
                                    {title}
                                </h1>
                                <div className="text-base md:text-lg lg:text-xl text-gray-600">
                                    Seller: {seller_town} – Visit the <b className="text-[#8710D8]">Upfrica GH</b> Shop
                                </div>
                                <div className="flex items-center space-x-2 text-base md:text-lg lg:text-xl text-yellow-300 mt-2">
                                    <li className="flex items-center text-base font-light mr-3 text-black">
                                        <span>
                                            <MdArrowRightAlt className="h-6 w-6 " />
                                        </span>
                                        <span>4.5</span>
                                    </li>
                                    <span>★★★★☆</span>
                                    <span className="underline text-blue-600 ml-2 text-sm md:text-base lg:text-lg">595 Reviews</span>
                                    <span className="ml-3 text-sm md:text-base lg:text-lg text-green-600">✅ Verified Seller</span>
                                </div>
                                <hr className="my-3 border-gray-200" />
                                {/* Price */}
                                <div className="mb-4 space-y-2">
                                    <div>
                                        <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">
                                            ₵{convertedPrice?.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm md:text-base">
                                        <span className="px-2 py-1 bg-red-700 text-white rounded">
                                            <i className="fa fa-bolt" /> Sales
                                        </span>
                                        <span className="ml-2 text-red-700 font-medium">ends in 32 days 09:58:49</span>
                                    </div>
                                </div>
                                {/* Condition */}
                                <div className="flex items-center py-3 space-x-1 text-base lg:text-xl">
                                    <span className="font-light">Condition:</span>
                                    <span className="font-semibold">{condition?.name}</span>
                                    <ImInfo />
                                </div>
                                <MultiBuySection />
                                {/* Desktop Buttons */}
                                <div className="mt-5 space-y-2">
                                    <button className="w-full bg-[#8710D8] text-white py-2 hover:bg-purple-700 text-base md:text-lg rounded-3xl font-bold">
                                        Buy Now
                                    </button>
                                    <button onClick={handleAddToBasket} className="w-full border-[#f7c32e] hover:bg-[#f7c32e] py-2 text-base md:text-lg rounded-3xl font-bold border-[1px]">
                                        Add to Basket
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 border-[#f7c32e] py-2 text-base md:text-lg hover:bg-[#f7c32e] rounded-3xl font-bold border-[1px]">
                                        Buy Now Pay Later(BNPL) <ImInfo className="h-5 w-5" />
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 border-[#f7c32e] py-2 text-base md:text-lg hover:bg-[#f7c32e] rounded-3xl font-bold border-[1px]">
                                        <FaRegHeart />
                                        <span>Add to Watchlist</span>
                                    </button>
                                </div>
                            </div>
                            <PaymentDeliveryReturns />
                        </div>
                    </aside>
                    {/* END RIGHT SIDEBAR */}

                    {/* Basket Modal Section */}
                    <BasketModal
                        isModalVisible={isModalVisible}
                        handleCloseModal={handleCloseModal}
                        basket={basket}
                        handleQuantityChange={(id, qty) => handleQuantityChange(id, qty)}
                        handleRemoveProduct={(id) => handleRemoveProduct(id)}
                    />
                </div>
            </div>
        </section>
    );
}

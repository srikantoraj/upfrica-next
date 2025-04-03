"use client";
import React, { useEffect, useState } from "react";
import MultiBuySection from "../MultiBuySection";
import { MdArrowRightAlt } from "react-icons/md";
import { FaHeart, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import BasketModal from "../BasketModal";
import { ImInfo } from "react-icons/im";
import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
import DescriptionAndReviews from "../DescriptionAndReviews";
// import { useSelector } from "react-redux";
import { convertPrice } from "@/app/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/basketSlice";
import RecentlyViewed from "../recentlyViewed";



export default function ProductDetailSection({ product }) {
    const dispatch = useDispatch();
    const basket = useSelector((state) => state.basket.items) || [];
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [basket, setBasket] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const {
        id,
        title,
        description,
        price_cents,
        price_currency,
        postage_fee,
        sale_end_date,
        sale_start_date,
        product_images,
        seller_town,          // seller's town
        condition,            // nested object – use condition.name
        category,             // nested object – use category.name, etc.
    } = product || {};

    const exchangeRates = useSelector((state) => state.exchangeRates.rates);
    const convertedPrice = convertPrice(price_cents / 100, price_currency, 'GHS', exchangeRates);

    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const saleStartDate = new Date(sale_start_date);
        const saleEndDate = new Date(sale_end_date);
        const currentDate = new Date();
        const remaining = saleEndDate - currentDate;

        setTimeRemaining({
            days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
            hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((remaining / (1000 * 60)) % 60),
            seconds: Math.floor((remaining / 1000) % 60),
        });
    }, [sale_start_date, sale_end_date]);

    // useEffect(() => {
    //     const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
    //     setBasket(storedBasket);
    // }, []);

    const handleAddToBasket = () => {
        const productData = { id, title, price_cents, quantity: 1, image: product_images };
        // const currentBasket = JSON.parse(localStorage.getItem('basket')) || [];
        // const existingProductIndex = currentBasket.findIndex((item) => item.id === productData.id);

        // if (existingProductIndex >= 0) currentBasket[existingProductIndex].quantity += 1;
        // else currentBasket.push(productData);

        // localStorage.setItem('basket', JSON.stringify(currentBasket));
        // setBasket(currentBasket);
        // setIsModalVisible(true);
        dispatch(addToBasket(productData));
        setIsModalVisible(true);
    };

    const handleCloseModal = () => setIsModalVisible(false);

    // const handleQuantityChange = (index, newQuantity) => {
    //     setBasket((prevBasket) =>
    //         prevBasket.map((item, i) =>
    //             i === index ? { ...item, quantity: newQuantity } : item
    //         )
    //     );
    // };

    const handleQuantityChange = (id, quantity) => {
        dispatch(updateQuantity({ id, quantity }));
    };




    // const handleRemoveProduct = (index) => {
    //     const newBasket = basket.filter((_, i) => i !== index);
    //     setBasket(newBasket);
    //     localStorage.setItem("basket", JSON.stringify(newBasket));
    // };

    const handleRemoveProduct = (id) => {
        dispatch(removeFromBasket(id));
    };


    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
            {/* This component will update localStorage with the current product */}
            <RecentlyViewed product={product} />
            <div data-sticky-container>
                {/* Main grid: left col (xl:7) & right col (xl:5) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* LEFT CONTENT */}
                    <div className="order-1 xl:col-span-7 ">
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin">
                            <span className="font-medium text-base md:text-lg lg:text-xl text-gray-600">
                                Upfrica UK
                            </span>
                            <span className="text-blue-600">&gt;</span>
                            <a
                                className="inline-block text-base md:text-lg lg:text-xl text-blue-600 hover:underline"
                                href="/categories/home-appliances-furniture"
                            >
                                Fashion
                            </a>
                            <span className="text-blue-600">&gt;</span>
                            <a
                                className="inline-block text-base md:text-lg lg:text-xl text-blue-600 hover:underline"
                                href="/categories/kitchen-appliances"
                            >
                                Footwear
                            </a>
                            <span className="text-blue-600">&gt;</span>
                            <a
                                className="inline-block text-base md:text-lg lg:text-xl text-blue-600 hover:underline"
                                href="/categories/popcorn-makers"
                            >
                                Sneakers
                            </a>
                            <span className="text-blue-600">&gt;</span>
                            <span className="inline-block font-semibold text-base md:text-lg lg:text-xl text-black truncate">
                                Gravity-Defying Performance: The Future of Sneakers
                            </span>
                        </div>

                        {/* Main image / gallery xl device */}
                        <section className="mt-2 bg-gray-50">
                            <div className="relative">
                                {/* Discount Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <div className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
                                        2% Off
                                    </div>
                                </div>


                                {/* Main image container: limited max width & centered */}
                                {/* <div className="border rounded overflow-hidden bg-white w-full mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                                    <img
                                        className="w-full h-auto object-cover"
                                        src={product_images[0]}
                                        alt="Main Product"
                                    />
                                </div> */}
                                {product_images && product_images.length > 0 && (
                                    <div className="border rounded overflow-hidden bg-white w-full mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                                        <img
                                            className="w-[400px] lg:w-[510px] h-[400px] lg:h-[510px] object-cover"
                                            src={product_images[photoIndex]}
                                            alt={`Product ${photoIndex}`}
                                            onClick={() => setIsOpen(true)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="mt-3 flex space-x-3 overflow-x-auto scrollbar-thin ">
                                {/* {product_images.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleThumbClick(imgUrl)}
                                        className="shrink-0 w-16 h-16 border rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#8710D8] hover:opacity-75"
                                    >
                                        <img
                                            className="w-full h-full object-cover"
                                            src={imgUrl.replace("?h=800", "?h=120")}
                                            alt={`Thumb ${idx + 1}`}
                                        />
                                    </button>
                                ))} */}

                                {product_images && product_images.length > 1 && (
                                    <div className="flex  space-x-4 ">
                                        {product_images.map((img, index) => (
                                            <img
                                                key={index}
                                                className={`h-[75px] w-[75px] object-cover rounded-md cursor-pointer border-2 ${photoIndex === index ? "border-purple-500" : "border-gray-300"
                                                    }`}
                                                src={img}
                                                alt={`Thumbnail ${index}`}
                                                onClick={() => setPhotoIndex(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* MOBILE CTA (hidden on xl) */}
                        <section className="block xl:hidden mt-5">
                            <div className="bg-white   lg:p-4 space-y-4">
                                <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">
                                    Gravity-Defying Performance: The Future of Sneakers
                                </h1>
                                <div className="text-base md:text-lg lg:text-xl text-gray-600">
                                    <b>4480 sold</b> — Visit the{" "}
                                    <b className="text-[#8710D8]">Upfrica GH</b> Shop — Accra, GH
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-yellow-500 text-base md:text-lg lg:text-xl">
                                        ★★★★☆
                                    </span>
                                    <span className="underline text-blue-600 text-base md:text-lg lg:text-xl">
                                        595 Reviews
                                    </span>
                                    <span className="text-base md:text-lg lg:text-xl ml-2">
                                        ✅ Verified Seller
                                    </span>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Price */}
                                <div>
                                    <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">
                                        ₵285
                                    </span>
                                    <span className="ml-1 text-base md:text-lg lg:text-xl text-gray-500">
                                        each
                                    </span>
                                    <p className="text-base md:text-lg lg:text-xl text-gray-500">
                                        was <del>₵400</del> — You Save: ₵200 (2%)
                                    </p>
                                    <div className="mt-1">
                                        <span className="px-2 py-1 bg-red-700 text-white text-xs rounded">
                                            <i className="fa fa-bolt" /> Sales
                                        </span>
                                        <small className="ml-2 text-red-700 font-medium">
                                            ends in <span>32 days 09:58:49</span>
                                        </small>
                                    </div>
                                </div>

                                {/* Multi-buy */}
                                {/* <div className="flex space-x-2 overflow-x-auto mt-2 scrollbar-thin">
                                    <div className="border p-2 text-center min-w-[120px]">
                                        <span className="block text-base md:text-lg lg:text-xl text-gray-700">
                                            Buy 1
                                        </span>
                                        <b className="text-base md:text-lg lg:text-xl">
                                            ₵285 each
                                        </b>
                                    </div>
                                    <div className="border p-2 text-center min-w-[120px]">
                                        <span className="block text-base md:text-lg lg:text-xl text-gray-700">
                                            Buy 2
                                        </span>
                                        <b className="text-base md:text-lg lg:text-xl">
                                            ₵265 each
                                        </b>
                                    </div>
                                    <div className="border p-2 text-center min-w-[120px]">
                                        <span className="block text-base md:text-lg lg:text-xl text-gray-700">
                                            Buy 1
                                        </span>
                                        <b className="text-base md:text-lg lg:text-xl">
                                            ₵285 each
                                        </b>
                                    </div>
                                    <div className="border p-2 text-center min-w-[120px]">
                                        <span className="block text-base md:text-lg lg:text-xl text-gray-700">
                                            Buy 2
                                        </span>
                                        <b className="text-base md:text-lg lg:text-xl">
                                            ₵265 each
                                        </b>
                                    </div>
                                </div> */}
                                <MultiBuySection />

                                {/* Buttons */}
                                <div className="grid gap-2">
                                    <button className="bg-[#8710D8] hover:bg- text-white px-4 py-2   text-base md:text-lg font-bold rounded-3xl">
                                        Buy Now
                                    </button>
                                    <button onClick={handleAddToBasket} className="border border-[#8710D8] px-4 py-2  hover:bg-yellow-50 text-base md:text-lg rounded-3xl">
                                        Add to Basket
                                    </button>
                                    <button className="border border-[#8710D8]  px-4 py-2  hover:bg-yellow-50 text-base md:text-lg rounded-3xl">
                                        Buy Now Pay Later (BNPL)
                                    </button>
                                    <button className="border border-[#8710D8] px-4 py-2  hover:bg-yellow-50 text-base md:text-lg rounded-3xl">
                                        <i className="fa-regular fa-heart mr-1" />
                                        Add to Watchlist
                                    </button>
                                </div>

                                {/* Delivery, Payment, etc. */}
                                {/* <div className="mt-4 space-y-2">
                                    <div className="flex text-base md:text-lg lg:text-xl text-gray-700">
                                        <small className="w-1/4 font-semibold">Pickup:</small>
                                        <div className="w-3/4">
                                            Free pickup in person from Accra, Ghana <br />
                                            <a href="#" className="underline text-blue-600">
                                                See details
                                            </a>{" "}
                                            <i className="bi bi-info-circle"></i>
                                        </div>
                                    </div>
                                    <div className="flex text-base md:text-lg lg:text-xl text-gray-700">
                                        <small className="w-1/4 font-semibold">Delivery:</small>
                                        <div className="w-3/4">
                                            Fast Delivery Available: <b>Tue, 25 Feb</b> - <b>Thu, 27 Feb</b>
                                            <div className="text-sm text-gray-500">
                                                if ordered today
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex text-base md:text-lg lg:text-xl text-gray-700">
                                        <small className="w-1/4 font-semibold">Returns:</small>
                                        <div className="w-3/4">
                                            The seller won't accept returns.
                                            <span className="info-icon ml-1">i</span>
                                        </div>
                                    </div>
                                    <div className="flex text-base md:text-lg lg:text-xl text-gray-700">
                                        <small className="w-1/4 font-semibold">Payments:</small>
                                        <div className="w-3/4 flex space-x-2">
                                            <div className="border p-2 rounded w-12 h-12 flex items-center justify-center">
                                                <img
                                                    className="max-h-6"
                                                    src="https://uploads-eu-west-1.insided.com/mtngroup-en/attachment/96f3ec28-bc42-49ee-be5d-6ed5345e516c_thumb.png"
                                                    alt="MTN MOMO"
                                                />
                                            </div>
                                            <div className="border p-2 rounded w-12 h-12 flex items-center justify-center">
                                                <img
                                                    className="max-h-6"
                                                    src="https://lh3.googleusercontent.com/z4nOBXDSMJ2zwyW9Nd1KHYEJgbhuqnVLvAGUXh0uEUn8f9QHnPYUY_64oYwOxRsDx26SEb5PgZJzLJRU6RwToFL00Wq--pBGmAwe=s0"
                                                    alt="Google Pay"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <PaymentDeliveryReturns />
                            </div>
                        </section>

                        <DescriptionAndReviews details={description} />
                    </div>
                    {/* END LEFT CONTENT */}

                    {/* RIGHT SIDEBAR */}
                    <aside className="order-2 hidden xl:block xl:col-span-5">
                        <div className="sticky top-20 space-y-4">
                            {/* CTA Card */}
                            <div className=" p-5">
                                <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-2 leading-7">
                                    {title}
                                </h1>
                                {/* <div className="text-base md:text-lg lg:text-xl text-gray-600">
                                    <b>4480 sold</b> — Visit the{" "}
                                    <b className="text-[#8710D8]">Upfrica GH</b> Shop, Accra, GH
                                </div> */}
                                <div className="text-base md:text-lg lg:text-xl text-gray-600">
                                    Seller: {seller_town} – Visit the <b className="text-[#8710D8]">Upfrica GH</b> Shop
                                </div>
                                <div className="flex items-center space-x-2 text-base md:text-lg lg:text-xl text-yellow-300 mt-2">
                                    <li className="flex items-center text-base font-light mr-3 text-black">
                                        <span><MdArrowRightAlt className="h-6 w-6 " /></span>
                                        <i className="bi bi-arrow-right mr-2" />
                                        <span>4.5</span>
                                    </li>
                                    <span>★★★★☆</span>
                                    <span className="underline text-blue-600 ml-2 text-sm md:text-base lg:text-lg">
                                        595 Reviews
                                    </span>
                                    <span className="ml-3 text-sm md:text-base lg:text-lg text-green-600">
                                        ✅ Verified Seller
                                    </span>
                                </div>

                                <hr className="my-3 border-gray-200" />

                                {/* price  */}
                                <div className="mb-4 space-y-2">
                                    <div>
                                        <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">
                                            ₵{convertedPrice?.toFixed(2)}
                                        </span>
                                        {/* <span className="ml-1 text-base md:text-lg lg:text-xl text-gray-500">
                                            each
                                        </span> */}
                                    </div>

                                    <div className="mt-1 text-sm md:text-base">
                                        <span className=" px-2 py-1 bg-red-700 text-white rounded">
                                            <i className="fa fa-bolt" /> Sales
                                        </span>
                                        <span className="ml-2 text-red-700 font-medium ">
                                            ends in 32 days 09:58:49
                                        </span>
                                    </div>
                                </div>

                                {/* condition  */}
                                <div className="flex items-center py-3 space-x-1 text-base lg:text-xl">

                                    <span className="font-light">
                                        Condition:
                                    </span>
                                    <span className="font-semibold">
                                        {condition?.name}
                                    </span>

                                    <ImInfo />
                                </div>


                                {/* Multi-buy */}
                                <MultiBuySection />

                                {/* Desktop Buttons */}
                                <div className="mt-5 space-y-2">
                                    <button className="w-full bg-[#8710D8] text-white py-2  hover:bg-purple-700 text-base md:text-lg  rounded-3xl font-bold">
                                        Buy Now
                                    </button>
                                    <button onClick={handleAddToBasket} className="w-full  border-[#8710D8] hover:bg-[#f7c32e] hover:border-[#f7c32e]  py-2  text-base md:text-lg rounded-3xl font-bold border-[2px]">
                                        Add to Basket
                                    </button>
                                    <button className="w-full text-center flex  items-center justify-center gap-2 border-[#8710D8] py-2  text-base md:text-lg hover:bg-[#f7c32e] hover:border-[#f7c32e] rounded-3xl font-bold border-[2px]">
                                        Buy Now Pay Later(BNPL) <ImInfo className="h-5 w-5" />

                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2  border-[#8710D8] py-2  text-base md:text-lg hover:bg-[#f7c32e]  hover:border-[#f7c32e] rounded-3xl font-bold border-[2px]">
                                        <span><FaRegHeart /></span>
                                        <span>Add to Watchlist</span>
                                    </button>
                                </div>
                            </div>

                            <PaymentDeliveryReturns />
                        </div>
                    </aside>
                    {/* END RIGHT CONTENT */}

                    {/* basket  Modal  section */}
                    {/* <BasketModal isModalVisible={isModalVisible} handleCloseModal={handleCloseModal} basket={basket} handleQuantityChange={handleQuantityChange} handleRemoveProduct={handleRemoveProduct} /> */}
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




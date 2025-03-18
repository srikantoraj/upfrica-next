// import React from "react";

// export default function ProductDetailSection() {
//   return (
//     <section className="pt-4">
//       {/* Outer container, approximate of Bootstrap container */}
//       <div className="" data-sticky-container>

//         {/* Main grid: left column (XL: 7) and right column (XL: 5) */}
//         <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-5">

//           {/* LEFT CONTENT - col-xl-7 */}
//           <div className="order-1 xl:col-span-7">
//             {/* Breadcrumb-ish row */}
//             <div className="flex items-center space-x-2 mb-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
//               <span className="font-semibold text-xs text-gray-600">Upfrica UK</span>
//               <span className="text-blue-600">&gt;</span>
//               <a
//                 className="inline-block text-blue-600 text-xs"
//                 href="/categories/home-appliances-furniture"
//               >
//                 Fashion
//               </a>
//               <span className="text-blue-600">&gt;</span>
//               <a
//                 className="inline-block text-blue-600 text-xs"
//                 href="/categories/kitchen-appliances"
//               >
//                 Footwear
//               </a>
//               <span className="text-blue-600">&gt;</span>
//               <a
//                 className="inline-block text-blue-600 text-xs"
//                 href="/categories/popcorn-makers"
//               >
//                 Sneakers
//               </a>
//               <span className="text-blue-600">&gt;</span>
//               <span className="inline-block text-sm font-semibold text-black">
//                 Gravity-Defying Performance: The Future of Sneakers
//               </span>
//             </div>

//             {/* Main image/gallery area */}
//             <section className="mt-2">
//               <div className="relative">
//                 {/* Badge top-left */}
//                 <div className="absolute top-3 left-3 z-10">
//                   <div className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
//                     2% Off
//                   </div>
//                 </div>
//                 {/* Wish count top-right */}
//                 <a href="/login">
//                   <div className="absolute top-3 right-3 z-10">
//                     <div className="bg-white border px-2 py-1 rounded">
//                       <span className="text-sm">
//                         150
//                         <span className="inline-flex items-center justify-center w-8 h-8 ml-2 bg-white border rounded-full">
//                           <i className="fa fa-heart text-xl" />
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </a>

//                 {/* Big image */}
//                 <div className="border rounded overflow-hidden">
//                   <img
//                     className="max-w-full h-auto"
//                     src="https://img.kwcdn.com/product/fancy/099b86b6-e260-4066-b64a-8d9b2fcda725.jpg?imageView2/2/w/800/q/70/format/webp?h=800"
//                     alt="Main Product"
//                   />
//                 </div>
//               </div>

//               {/* Thumbnails: horizontally scrollable */}
//               <div className="mt-2 flex space-x-2 overflow-x-auto scrollbar-thin">
//                 {/* Example thumbnail (repeat as needed) */}
//                 <img
//                   className="w-16 h-16 object-cover border rounded"
//                   src="https://magictoolbox.sirv.com/images/magiczoomplus/colorful-colors-1.jpg?h=120"
//                   alt="Thumb"
//                 />
//                 <img
//                   className="w-16 h-16 object-cover border rounded"
//                   src="https://magictoolbox.sirv.com/images/magiczoomplus/colorful-colors-2.jpg?h=120"
//                   alt="Thumb"
//                 />
//                 <img
//                   className="w-16 h-16 object-cover border rounded"
//                   src="https://magictoolbox.sirv.com/images/magiczoomplus/colorful-colors-3.jpg?h=120"
//                   alt="Thumb"
//                 />
//                 {/* ... more thumbnails ... */}
//               </div>
//             </section>

//             {/* Mobile Price / CTA Section (hidden on xl - shown on smaller) */}
//             <section className="block xl:hidden mt-3">
//               <div className="bg-white shadow rounded p-3 space-y-3">
//                 {/* Title, rating, etc. */}
//                 <h1 className="text-lg font-bold">
//                   Gravity-Defying Performance: The Future of Sneakers
//                 </h1>
//                 <div className="text-sm text-gray-600">
//                   <b>4480 sold</b> &nbsp; Visit the{" "}
//                   <b className="text-blue-600">Upfrica GH</b> Shop — Accra, GH
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <span className="text-yellow-500 text-sm">★★★★☆</span>
//                   <span className="text-xs text-blue-600 underline ml-2">
//                     595 Reviews
//                   </span>
//                   <span className="text-xs ml-4">✅ Verified Seller</span>
//                 </div>

//                 <hr />

//                 {/* Price block */}
//                 <div>
//                   <span className="text-lg font-semibold">₵285</span>
//                   <span className="text-sm ml-1">each</span>
//                   <p className="text-sm">
//                     was <del>₵400</del> — You Save: ₵200 (2%)
//                   </p>
//                   <div className="mt-1">
//                     <span className="px-2 py-1 bg-red-700 text-white text-xs rounded">
//                       <i className="fa fa-bolt" aria-hidden="true"></i> Sales
//                     </span>
//                     <small className="ml-2 text-red-700">
//                       <b>
//                         ends in <span>32 days 09:58:49</span>
//                       </b>
//                     </small>
//                   </div>
//                 </div>

//                 {/* Multi-buy horizontal list (mobile) */}
//                 <div className="flex space-x-2 overflow-x-auto mt-2 scrollbar-thin">
//                   <div className="border p-2 text-center min-w-[120px]">
//                     <span className="block text-sm">Buy 1</span>
//                     <b className="text-lg">₵285 each</b>
//                   </div>
//                   <div className="border p-2 text-center min-w-[120px]">
//                     <span className="block text-sm">Buy 2</span>
//                     <b className="text-lg">₵265 each</b>
//                   </div>
//                   {/* ... etc. */}
//                 </div>

//                 {/* Buttons */}
//                 <div className="grid gap-2">
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded">
//                     Buy Now
//                   </button>
//                   <button className="border border-yellow-500 text-yellow-700 px-4 py-2 rounded">
//                     Add to Basket
//                   </button>
//                   <button className="border border-yellow-500 text-yellow-700 px-4 py-2 rounded">
//                     Buy Now Pay Later (BNPL) <span className="info-icon ml-1">i</span>
//                   </button>
//                   <button className="border border-yellow-500 text-yellow-700 px-4 py-2 rounded">
//                     <i className="fa-regular fa-heart mr-1" />
//                     Add to Watchlist
//                   </button>
//                 </div>

//                 {/* Delivery, Payment, etc. for mobile */}
//                 <div className="mt-4 text-sm space-y-2">
//                   <div className="flex">
//                     <small className="w-1/4 font-semibold">Pickup:</small>
//                     <div className="w-3/4">
//                       Free pickup in person from Accra, Ghana <br />
//                       <a href="#" className="underline">
//                         See details
//                       </a>{" "}
//                       <i className="bi bi-info-circle"></i>
//                     </div>
//                   </div>
//                   <div className="flex">
//                     <small className="w-1/4 font-semibold">Delivery:</small>
//                     <div className="w-3/4">
//                       Fast Delivery Available: <b>Tue, 25 Feb</b> - <b>Thu, 27 Feb</b>
//                       <div className="text-xs text-gray-500">
//                         if ordered today
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex">
//                     <small className="w-1/4 font-semibold">Returns:</small>
//                     <div className="w-3/4">
//                       The seller won't accept returns for this item..
//                       <span className="info-icon ml-1">i</span>
//                     </div>
//                   </div>
//                   <div className="flex">
//                     <small className="w-1/4 font-semibold">Payments:</small>
//                     <div className="w-3/4 flex space-x-2">
//                       {/* Payment icons */}
//                       <div className="border p-2 rounded w-12 h-12 flex items-center justify-center">
//                         <img
//                           className="max-h-6"
//                           src="https://uploads-eu-west-1.insided.com/mtngroup-en/attachment/96f3ec28-bc42-49ee-be5d-6ed5345e516c_thumb.png"
//                           alt="MTN MOMO"
//                         />
//                       </div>
//                       <div className="border p-2 rounded w-12 h-12 flex items-center justify-center">
//                         <img
//                           className="max-h-6"
//                           src="https://lh3.googleusercontent.com/z4nOBXDSMJ2zwyW9Nd1KHYEJgbhuqnVLvAGUXh0uEUn8f9QHnPYUY_64oYwOxRsDx26SEb5PgZJzLJRU6RwToFL00Wq--pBGmAwe=s0"
//                           alt="Google Pay"
//                         />
//                       </div>
//                       {/* ... etc. */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Product Description, Reviews, etc. */}
//             <div className="bg-transparent pt-4">
//               <h5 className="font-light mb-4 border-b pb-2">
//                 Future of Sneakers in Ghana Best Sale Price: Upfrica
//               </h5>
//               <p className="leading-relaxed text-sm mb-2">
//                 Gravity-Defying Performance: The Future of Sneakers... at
//                 everyday low prices. Order online today for fast delivery or
//                 collect from the seller in Accra, GH
//               </p>
//               <p className="text-sm mb-2">
//                 Step into the future of footwear with these high-performance
//                 sneakers, designed for ultimate comfort, style, and durability...
//                 {/* truncated for brevity */}
//               </p>
//               <hr />

//               {/* Seller Info / Save Seller button, phone number, etc. */}
//               <div className="mt-3 bg-white border rounded p-3">
//                 <div className="flex items-center space-x-3 mb-2">
//                   <img
//                     className="w-14 h-14 rounded-full"
//                     src="https://img.kwcdn.com/supplier-public-tag/1f66680860/7a1dec98-d11b-460c-89e2-25cc4703fa53_300x300.jpeg?imageView2/2/w/300/q/70/format/webp"
//                     alt="avatar"
//                   />
//                   <div>
//                     <h6 className="mb-1">Homeappliances</h6>
//                     <ul className="text-xs flex space-x-2 text-gray-600">
//                       <li>1 follower</li>
//                       <li className="text-green-600">55 Items</li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="flex space-x-2 text-sm">
//                   <button className="border px-4 py-1 rounded">
//                     <i className="bi bi-heart mr-2" />
//                     Save seller
//                   </button>
//                   <a
//                     href="/shops/home-appliances-ghana"
//                     className="border px-4 py-1 rounded"
//                   >
//                     Shop all items
//                   </a>
//                 </div>
//                 <div className="mt-3">
//                   <p
//                     id="phone"
//                     className="cursor-pointer bg-blue-50 border text-center py-2 rounded"
//                   >
//                     <i className="bi bi-telephone mr-1" />
//                     Click to view number
//                   </p>
//                 </div>
//               </div>

//               {/* Customer Reviews */}
//               <div className="mt-5">
//                 <h3 className="text-base font-semibold mb-2 border-b pb-1">
//                   Verified Customer Review
//                 </h3>

//                 {/* Example of a single review block */}
//                 <div className="mt-3 bg-gray-50 p-4 rounded">
//                   <div className="flex items-center mb-2">
//                     <img
//                       className="w-10 h-10 rounded-full mr-3"
//                       src="https://d26ukeum83vx3b.cloudfront.net/assets/fallback/unknown-profile-af52c345c697846d002f6b77aa9530f87be0374f4b2b0d9ba54a2cf1d6c585e4.jpg"
//                       alt="Avatar"
//                     />
//                     <div className="text-sm">
//                       <h6 className="font-semibold">Esther</h6>
//                       <p className="text-gray-500">
//                         Reviewed in Ghana on 22:16 Sep 11, 2023
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center text-yellow-500 text-sm">
//                     ★★★★★ <span className="ml-2 font-semibold">Thank You!</span>
//                   </div>
//                   <p className="text-sm mt-2">
//                     Good product and timely product delivery. Good communication.
//                   </p>
//                 </div>

//                 {/* ... More reviews ... */}
//               </div>

//               {/* Write a Review Form */}
//               <div className="mt-5 bg-white p-4 rounded">
//                 <h3 className="text-base font-semibold mb-3">Write a Review</h3>
//                 <form>
//                   <div className="mb-3">
//                     <label className="block mb-1 font-medium text-sm">
//                       Rating
//                     </label>
//                     <select className="w-full border p-2 rounded">
//                       <option value="5">★★★★★ (5/5)</option>
//                       <option value="4">★★★★☆ (4/5)</option>
//                       <option value="3">★★★☆☆ (3/5)</option>
//                       <option value="2">★★☆☆☆ (2/5)</option>
//                       <option value="1">★☆☆☆☆ (1/5)</option>
//                     </select>
//                   </div>
//                   <div className="mb-3">
//                     <label className="block mb-1 font-medium text-sm">
//                       Headline
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border p-2 rounded"
//                       placeholder="Sum it up in a few words"
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="block mb-1 font-medium text-sm">
//                       Comments
//                     </label>
//                     <textarea
//                       rows={4}
//                       className="w-full border p-2 rounded"
//                       placeholder="Write a review and share details of your experience..."
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded"
//                   >
//                     Post review
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* Legal Disclaimer */}
//             <div className="bg-gray-100 p-4 mt-5 text-sm rounded leading-relaxed">
//               <strong>Legal Disclaimer:</strong> The Seller takes full
//               responsibility for this listing... [truncated]
//             </div>
//           </div>
//           {/* END LEFT CONTENT */}

//           {/* RIGHT SIDEBAR - col-xl-5 */}
//           <aside className="order-2 hidden xl:block xl:col-span-5">
//             <div className="sticky top-20 space-y-4">
//               {/* Card: Title + Price + CTA (Desktop) */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h1 className="text-lg font-bold mb-2">
//                   Gravity-Defying Performance: The Future of Sneakers
//                 </h1>
//                 <div className="text-sm text-gray-600">
//                   <b>4480 sold</b> — Visit the{" "}
//                   <b className="text-blue-600">Upfrica GH</b> Shop, Accra, GH
//                 </div>
//                 <div className="flex items-center space-x-1 text-sm mt-2">
//                   <span className="text-yellow-500">★★★★☆</span>
//                   <span className="underline text-blue-600 ml-2">595 Reviews</span>
//                   <span className="ml-3">✅ Verified Seller</span>
//                 </div>
//                 <hr className="my-3" />

//                 <div className="mb-2">
//                   <span className="text-xl font-semibold">₵285</span>
//                   <span className="text-sm ml-1">each</span>
//                   <div className="text-sm">
//                     was <del>₵400</del> — You Save: ₵200 (2%)
//                   </div>
//                   <div className="mt-1">
//                     <span className="text-xs px-2 py-1 bg-red-700 text-white rounded">
//                       <i className="fa fa-bolt" /> Sales
//                     </span>
//                     <small className="ml-2 text-red-700">
//                       <b>ends in 32 days 09:58:49</b>
//                     </small>
//                   </div>
//                 </div>

//                 {/* Multi-buy (desktop) */}
//                 <div className="flex space-x-2 overflow-x-auto mt-2 scrollbar-thin">
//                   <div className="border p-2 text-center min-w-[120px] font-semibold">
//                     <span className="block text-sm font-normal">Buy 1</span>₵285
//                   </div>
//                   <div className="border p-2 text-center min-w-[120px]">
//                     <span className="block text-sm font-normal">Buy 2</span>₵265
//                   </div>
//                   {/* ... etc. */}
//                 </div>

//                 {/* Buttons (desktop) */}
//                 <div className="mt-4 space-y-2">
//                   <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">
//                     Buy Now
//                   </button>
//                   <button className="w-full border border-yellow-500 text-yellow-700 px-4 py-2 rounded">
//                     Add to Basket
//                   </button>
//                   <button className="w-full border border-yellow-500 text-yellow-700 px-4 py-2 rounded">
//                     Buy Now Pay Later(BNPL) <span className="info-icon ml-1">i</span>
//                   </button>
//                   <button className="w-full border border-yellow-500 text-yellow-700 px-4 py-2 rounded">
//                     <i className="fa-regular fa-heart mr-1" />
//                     Add to Watchlist
//                   </button>
//                 </div>
//               </div>

//               {/* Pickup / Delivery / Payments section (Desktop) */}
//               <div className="bg-white p-4 rounded shadow text-sm space-y-3">
//                 <div className="flex">
//                   <span className="w-1/4 font-semibold">Pickup:</span>
//                   <div className="w-3/4">
//                     Free pickup in person from Accra, Ghana
//                     <br />
//                     <a href="#" className="underline">
//                       See details
//                     </a>{" "}
//                     <i className="bi bi-info-circle"></i>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <span className="w-1/4 font-semibold">Delivery:</span>
//                   <div className="w-3/4">
//                     Fast Delivery Available: <b>Tue, 25 Feb</b> - <b>Thu, 27 Feb</b>
//                     <br />
//                     <span className="text-gray-500">if ordered today</span>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <span className="w-1/4 font-semibold">Returns:</span>
//                   <div className="w-3/4">
//                     The seller won't accept returns for this item..
//                     <span className="info-icon ml-1">i</span>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <span className="w-1/4 font-semibold">Payments:</span>
//                   <div className="w-3/4 flex space-x-2">
//                     {/* Payment icons */}
//                     <div className="border p-2 rounded flex items-center justify-center w-12 h-12">
//                       <img
//                         className="max-h-6"
//                         src="https://uploads-eu-west-1.insided.com/mtngroup-en/attachment/96f3ec28-bc42-49ee-be5d-6ed5345e516c_thumb.png"
//                         alt="MTN MOMO"
//                       />
//                     </div>
//                     <div className="border p-2 rounded flex items-center justify-center w-12 h-12">
//                       <img
//                         className="max-h-6"
//                         src="https://lh3.googleusercontent.com/z4nOBXDSMJ2zwyW9Nd1KHYEJgbhuqnVLvAGUXh0uEUn8f9QHnPYUY_64oYwOxRsDx26SEb5PgZJzLJRU6RwToFL00Wq--pBGmAwe=s0"
//                         alt="Google Pay"
//                       />
//                     </div>
//                     {/* ... etc. */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </aside>
//           {/* END RIGHT CONTENT */}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import MultiBuySection from "../MultiBuySection";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdArrowRightAlt } from "react-icons/md";
import { HiMiniXMark, HiXMark } from "react-icons/hi2";
import Link from "next/link";
import { FaHeart, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import BasketModal from "../BasketModal";
import { ImInfo } from "react-icons/im";
import PaymentMethod from "../PaymentMethod";
import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
import DescriptionAndReviews from "../DescriptionAndReviews";

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
    <div className="flex items-center text-lg">
        <button onClick={onDecrease} className="px-2 py-1 font-bold" aria-label="Decrease quantity">
            <FaMinus />
        </button>
        <span className="py-1 px-2">{quantity}</span>
        <button onClick={onIncrease} className="px-2 py-1 font-bold" aria-label="Increase quantity">
            <FaPlus />
        </button>
    </div>
);

export default function ProductDetailSection({ product }) {
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [basket, setBasket] = useState([]);

    console.log("produc", product)



    const handleThumbClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const { id, title, price, postage_fee, sale_end_date, sale_start_date, product_images } = product || {};
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

    useEffect(() => {
        const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
        setBasket(storedBasket);
    }, []);

    const handleAddToBasket = () => {
        const productData = { id, title, price, quantity: 1, image: product_images };
        const currentBasket = JSON.parse(localStorage.getItem('basket')) || [];
        const existingProductIndex = currentBasket.findIndex((item) => item.id === productData.id);

        if (existingProductIndex >= 0) currentBasket[existingProductIndex].quantity += 1;
        else currentBasket.push(productData);

        localStorage.setItem('basket', JSON.stringify(currentBasket));
        setBasket(currentBasket);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => setIsModalVisible(false);

    const handleQuantityChange = (index, change) => {
        const newBasket = [...basket];
        newBasket[index].quantity = Math.max(1, newBasket[index].quantity + change);
        setBasket(newBasket);
        localStorage.setItem('basket', JSON.stringify(newBasket));
    };

    const handleRemoveProduct = (index) => {
        const newBasket = basket.filter((_, i) => i !== index);
        setBasket(newBasket);
        localStorage.setItem("basket", JSON.stringify(newBasket));
      };


    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
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
                                <div className="border rounded overflow-hidden bg-white w-full mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                                    <img
                                        className="w-full h-auto object-cover"
                                        src={product_images[0]}
                                        alt="Main Product"
                                    />
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="mt-3 flex space-x-3 overflow-x-auto scrollbar-thin">
                                {product_images.map((imgUrl, idx) => (
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
                                ))}
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
                                <PaymentDeliveryReturns/>
                            </div>
                        </section>

                       <DescriptionAndReviews/>
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
                                <div className="text-base md:text-lg lg:text-xl text-gray-600">
                                    <b>4480 sold</b> — Visit the{" "}
                                    <b className="text-[#8710D8]">Upfrica GH</b> Shop, Accra, GH
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
                                            ₵{price.cents}
                                        </span>
                                        <span className="ml-1 text-base md:text-lg lg:text-xl text-gray-500">
                                            each
                                        </span>
                                    </div>
                                    <div className="text-sm md:text-base lg:text-lg text-gray-500">
                                        was <del>₵400</del> — You Save: ₵200 (2%)
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
                                    {/* "Condition:" label, styled lightly */}
                                    <span className="font-light">
                                        Condition:
                                    </span>

                                    {/* Bold text for "Brand New" */}
                                    <span className="font-semibold">
                                        Brand New
                                    </span>

                                    {/* Info icon (using a button or span for accessibility) */}
                                    {/* <button
                                        // If you have a modal, you'd do onClick or data attributes here
                                        data-bs-toggle="modal"
                                        data-bs-target="#conditionModal"
                                        className="ml-1 inline-flex items-center justify-center 
                                        w-6 h-6 rounded-full border-[3px] border-gray-800 
                                        text-gray-800 text-xs font-semibold 
                                        hover:bg-gray-100 focus:outline-none"
                                        aria-label="Info"
                                    >
                                        i
                                    </button> */}
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
                    <BasketModal isModalVisible={isModalVisible} handleCloseModal={handleCloseModal} basket={basket} handleQuantityChange={handleQuantityChange} handleRemoveProduct={handleRemoveProduct} />
                </div>
            </div>
        </section>
    );
}




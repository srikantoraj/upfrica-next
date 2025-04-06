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
import InfoPopover from "../InfoPopover";
import ProductSlider from "./ProductSlider";

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center text-base md:text-lg">
    <button onClick={onDecrease} className="px-2 py-1 font-bold" aria-label="Decrease quantity">
      <FaMinus />
    </button>
    <span className="py-1 px-2 font-medium">{quantity}</span>
    <button onClick={onIncrease} className="px-2 py-1 font-bold" aria-label="Increase quantity">
      <FaPlus />
    </button>
  </div>
);

export default function ProductDetailSection({ product }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [basket, setBasket] = useState([]);

  const {
    id,
    title,
    price_cents,
    price_currency,
    postage_fee,
    sale_end_date,
    sale_start_date,
    product_images,
    seller_town,
    condition,
    category,
  } = product || {};

  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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
    const storedBasket = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(storedBasket);
  }, []);

  const handleAddToBasket = () => {
    const productData = { id, title, price_cents, quantity: 1, image: product_images };
    const currentBasket = JSON.parse(localStorage.getItem("basket")) || [];
    const existingProductIndex = currentBasket.findIndex((item) => item.id === productData.id);

    if (existingProductIndex >= 0) currentBasket[existingProductIndex].quantity += 1;
    else currentBasket.push(productData);

    localStorage.setItem("basket", JSON.stringify(currentBasket));
    setBasket(currentBasket);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  const handleQuantityChange = (index, newQuantity) => {
    setBasket((prevBasket) =>
      prevBasket.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveProduct = (index) => {
    const newBasket = basket.filter((_, i) => i !== index);
    setBasket(newBasket);
    localStorage.setItem("basket", JSON.stringify(newBasket));
  };

  return (
    <section className="pt-6 md:pt-8 lg:pt-10">
      <div data-sticky-container>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="order-1 xl:col-span-7">
            <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin text-sm text-gray-500">
              <span>Upfrica UK</span>
              <span className="text-blue-600">&gt;</span>
              <a className="text-blue-600 hover:underline">Fashion</a>
              <span className="text-blue-600">&gt;</span>
              <a className="text-blue-600 hover:underline">Footwear</a>
              <span className="text-blue-600">&gt;</span>
              <a className="text-blue-600 hover:underline">Sneakers</a>
              <span className="text-blue-600">&gt;</span>
              <span className="font-semibold text-gray-700 truncate">{title}</span>
            </div>

            {/* Replaced old slider with ProductSlider */}
            <section className="mt-2">
              <ProductSlider images={product_images} />
            </section>

            <section className="block xl:hidden mt-5">
              <div className="bg-white p-4 space-y-4">
                <h1 className="heading-lg">{title}</h1>
                <div className="text-sm text-gray-500">
                  <b>4480 sold</b> — Visit the <b className="text-[#8710D8]">Upfrica GH</b> Shop — Accra, GH
                </div>
                <div className="flex items-center text-sm space-x-2">
                  <span className="text-yellow-400">★★★★☆</span>
                  <span className="underline text-blue-600">595 Reviews</span>
                  <span className="text-green-600">✅ Verified Seller</span>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <span className="text-2xl font-bold text-green-700 tracking-tight">₵{price_cents}</span>
                  <del className="ml-2 text-sm text-gray-400">₵400</del>
                  <p className="text-sm text-gray-500">You Save: ₵200 (2%)</p>
                </div>

                <MultiBuySection />

                <div className="grid gap-2">
                  <button className="btn-base btn-primary">Buy Now</button>
                  <button onClick={handleAddToBasket} className="btn-base btn-outline">Add to Basket</button>
                  <button className="btn-base btn-outline">Buy Now Pay Later (BNPL)</button>
                  <button className="btn-base btn-outline flex items-center justify-center gap-2">
                    <FaRegHeart /> Add to Watchlist
                  </button>
                </div>

                <PaymentDeliveryReturns />
              </div>
            </section>

            <DescriptionAndReviews />
          </div>

          <aside className="order-2 hidden xl:block xl:col-span-5">
            <div className="sticky top-20 space-y-4 p-5">
              <h1 className="heading-lg">{title}</h1>
              <div className="text-sm text-gray-600">
                Seller: {seller_town} – Visit the <b className="text-[#8710D8]">Upfrica GH</b> Shop
              </div>
              <div className="flex items-center text-sm text-yellow-400 gap-2">
                <MdArrowRightAlt className="h-4 w-4" />
                <span>4.5</span>
                <span>★★★★☆</span>
                <span className="underline text-blue-600">595 Reviews</span>
                <span className="text-green-600">✅ Verified Seller</span>
              </div>
              <hr className="my-3 border-gray-200" />

              <div>
                <span className="text-3xl font-bold text-green-700 tracking-tight">₵{price_cents}</span>
                <p className="text-sm text-red-700 font-medium mt-1">Sales ends in 32 days</p>
              </div>

              <div className="text-sm text-gray-700 flex items-center gap-1">
                Condition: <span className="font-semibold">{condition?.name}</span> <ImInfo />
              </div>

              <MultiBuySection />

              <div className="mt-4 space-y-2">
                <button className="btn-base btn-primary w-full">Buy Now</button>
                <button onClick={handleAddToBasket} className="btn-base btn-outline w-full">Add to Basket</button>
                <button className="btn-base btn-outline w-full flex items-center justify-center gap-2">
                  Buy Now Pay Later (BNPL) <ImInfo className="h-4 w-4" />
                </button>
                <button className="btn-base btn-outline w-full flex items-center justify-center gap-2">
                  <FaRegHeart /> Add to Watchlist
                </button>
              </div>

              <PaymentDeliveryReturns />
            </div>
          </aside>

          <BasketModal
            isModalVisible={isModalVisible}
            handleCloseModal={handleCloseModal}
            basket={basket}
            handleQuantityChange={handleQuantityChange}
            handleRemoveProduct={handleRemoveProduct}
          />
        </div>
      </div>
    </section>
  );
}
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaLocationPin, FaEdit, FaMinus, FaPlus, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { HiXMark } from 'react-icons/hi2';
import SalesEndSection from './SalesEndSection/SalesEndSection';
import DeliveryDate from './DeliveryDate';
import Image from 'next/image';
import Link from 'next/link';
import LaptopDetels from './LaptopDetels';

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center text-base md:text-lg">
    <button onClick={onDecrease} className="px-2 py-1 md:font-extrabold" aria-label="Decrease quantity">
      <FaMinus />
    </button>
    <span className="md:font-bold py-1 px-2">{quantity}</span>
    <button onClick={onIncrease} className="px-2 py-1 font-extrabold" aria-label="Increase quantity">
      <FaPlus />
    </button>
  </div>
);

const TextSection = ({ product }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [basket, setBasket] = useState([]);

  const { id, title, price, postage_fee, sale_end_date, sale_start_date, product_images } = product;
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
    const timeRemaining = saleEndDate - currentDate;

    setTimeRemaining({
      days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeRemaining / (1000 * 60)) % 60),
      seconds: Math.floor((timeRemaining / 1000) % 60),
    });
  }, [sale_start_date, sale_end_date]);

  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
    setBasket(storedBasket);
  }, []);

  const handleAddToBasket = () => {
    const productData = { id, title, price, quantity: 1, image: product_images };
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const existingProductIndex = basket.findIndex((item) => item.id === productData.id);

    if (existingProductIndex >= 0) basket[existingProductIndex].quantity += 1;
    else basket.push(productData);

    localStorage.setItem('basket', JSON.stringify(basket));
    setBasket(basket);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  const handleQuantityChange = (index, change) => {
    const newBasket = [...basket];
    newBasket[index].quantity = Math.max(1, newBasket[index].quantity + change);
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  return (
    <div className="space-y-4 p-4 lg:ml-4 lg:mt-8 text-lg">
      {/* Product Title */}
      <div className="text-xl font-bold">{title}</div>

      {/* Review Button */}
      <button className="border py-1 px-2 md:px-4 hover:bg-purple-500 hover:text-white font-bold tracking-wide text-purple-500 border-purple-500 rounded-lg">
        Write a review
      </button>

      {/* Edit, Delete, Published */}
      <div className="flex gap-4 items-center text-base xl:text-lg flex-col sm:flex-row">
        <div className="flex items-center space-x-2 text-[#a435f0] w-full sm:w-auto">
          <FaEdit className="w-4 h-4" />
          <span>Edit</span>
        </div>
        <div className="border-l h-6 border-gray-300 sm:block hidden"></div>
        <p className="text-[#747579] font-bold w-full sm:w-auto">Last update: 19 Nov, 2024</p>
        <div className="border-l h-6 border-gray-300 sm:block hidden"></div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-1 text-[#a435f0]">
            <FaTrash className="w-4 h-4" />
            <span>Delete</span>
          </div>
          <div className="border-l h-6 border-gray-300 sm:block hidden"></div>
          <span className="text-[#a435f0]">Published</span>
        </div>
      </div>


      {/* Email and WhatsApp Section */}
      <div className="flex gap-4 items-center text-lg">
        <div className="text-gray-500 font-medium">example@gmail.com</div>
        <div className="border-l h-6 border-gray-300"></div>
        <div className="flex items-center text-[#a435f0] space-x-2">
          <FaWhatsapp className="w-6 h-6 text-green-400" />
          <span>WhatsApp</span>
        </div>
      </div>

      {/* Price Information */}
      <p className="text-lg text-[#0CBC87] font-bold">Last Price Update: 19 Nov, 2024 </p>
      <p className="text-lg font-bold">
        Price: <span className="text-xl">${(price?.cents / 100).toFixed(2)}</span> each
      </p>
      <p className="text-gray-600 text-lg">
        RRP <span className="line-through">${(price?.cents / 100).toFixed(2)}</span> You
        Save: $6.39 (3%)
      </p>

      {/* Sale End Timer */}
      <SalesEndSection days={timeRemaining.days} minutes={timeRemaining.minutes} seconds={timeRemaining.seconds} />

      {/* Free Delivery */}
      <p className="text-xl font-extrabold py-1 px-2 bg-[#0A8800] text-white w-2/3 rounded-md">Free Delivery for you within Accra</p>
      <p><b>Collection:</b> Click &amp; Collect - Select option at checkout</p>
      <h1>Delivery: $ {(postage_fee?.cents / 100).toFixed(2)}</h1>

      {/* Delivery Date */}
      <DeliveryDate />
      <p>Get a $1.41 credit for late delivery</p>

      {/* Add to Basket Button */}
      <div className="pb-4">
        <button onClick={handleAddToBasket} className="bg-[#F7C32E] w-full lg:w-3/4 p-2 rounded-3xl text-base font-bold">
          Add to Basket
        </button>
        <hr className="my-4" />
        <LaptopDetels />

        
        {/* Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 px-5 z-50 overflow-y-auto ${isModalVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
            } transition-opacity duration-300`}
          onClick={handleCloseModal}
        >
          <div
            className={`bg-gray-50 rounded-lg shadow-lg  w-full md:w-2/3 lg:w-2/4 xl:w-1/4 p-4 mx-auto mt-10 transform ${isModalVisible ? 'translate-y-0' : '-translate-y-full'
              } transition-transform duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl md:text-2xl font-semibold">
                {basket.length} Items added to basket
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-900"
              >
                <HiXMark className="h-8 w-8" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <ul className="mt-4">
                {basket.length > 0 ? (
                  basket.map((item, index) => (
                    <li
                      key={index}
                      className="md:grid md:grid-cols-5 flex gap-4 md:items-center justify-between border-b py-3 text-base md:text-xl"
                    >
                      {/* Product Image */}
                      <div className="md:col-span-1">
                        <img
                          src={
                            item?.image?.[0] ??
                            'https://via.placeholder.com/150'
                          }
                          alt={item.title}
                          className="h-14 w-14 object-cover rounded mr-3"
                        />
                      </div>

                      <div className="md:col-span-4">
                        {/* Product Title */}
                        <span>{item.title}</span>
                        {/* Product Price */}
                        <div className="md:flex gap-5 items-center mt-2">
                          <p>
                            Price : {item.price.currency_iso}{' '}
                            {(item.price.cents / 100).toFixed(2)}
                          </p>
                          <p className="flex gap-2 text-base md:text-lg font-bold items-center">
                            <span>Qty:</span>
                            <QuantityControl
                              quantity={item.quantity}
                              onDecrease={() =>
                                handleQuantityChange(index, -1)
                              }
                              onIncrease={() =>
                                handleQuantityChange(index, 1)
                              }
                            />
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No items in the basket.
                  </p>
                )}
              </ul>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-center p-4 space-x-2">
              <Link href="/checkout">
                <button className="bg-[#F7C32E] text-white px-4 py-2 rounded-3xl hover:bg-yellow-600">
                  Checkout Item
                </button>
              </Link>
              <Link href="/cart">
                <button className="px-4 py-2 rounded-3xl border bg-white shadow-md">View Basket</button>
              </Link>
            </div>
          </div>
        </div>
        {/* End of Modal */}
      </div>
    </div>

  );
};

export default TextSection;

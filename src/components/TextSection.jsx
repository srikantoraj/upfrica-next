'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaLocationPin } from 'react-icons/fa6';
import SalesEndSection from './SalesEndSection/SalesEndSection';
import DeliveryDate from './DeliveryDate';
import Image from 'next/image';
import Link from 'next/link';
import { HiXMark } from 'react-icons/hi2';
import { FaMinus, FaPlus } from 'react-icons/fa';

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center text-base md:text-lg">
    <button
      onClick={onDecrease}
      className="px-2 py-1 md:font-extrabold"
      aria-label="Decrease quantity"
    >
      <FaMinus />
    </button>
    <span className="md:font-bold py-1 px-2">{quantity}</span>
    <button
      onClick={onIncrease}
      className="px-2 py-1 font-extrabold"
      aria-label="Increase quantity"
    >
      <FaPlus />
    </button>
  </div>
);

const TextSection = ({ product }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [basket, setBasket] = useState([]);
  const router = useRouter();

  const {
    id,
    title,
    price,
    postage_fee,
    sale_end_date,
    sale_start_date,
    product_images,
  } = product;

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

    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    setTimeRemaining({
      days,
      hours,
      minutes,
      seconds,
    });
  }, []);

  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
    setBasket(storedBasket);
  }, []);

  const handleAddToBasket = () => {
    const productData = {
      id: id,
      title: title,
      price: price,
      quantity: 1,
      image: product_images,
    };

    const basket = JSON.parse(localStorage.getItem('basket')) || [];

    const existingProductIndex = basket.findIndex(
      (item) => item.id === productData.id
    );

    if (existingProductIndex >= 0) {
      basket[existingProductIndex].quantity += 1;
    } else {
      basket.push(productData);
    }

    localStorage.setItem('basket', JSON.stringify(basket));

    setBasket(basket);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleQuantityChange = (index, change) => {
    const newBasket = [...basket];
    newBasket[index].quantity = Math.max(
      1,
      newBasket[index].quantity + change
    );
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  return (
    <>
      <div className="lg:ml-4 lg:mt-8 space-y-4 text-base">
        <div className="text-xl md:text-2xl font-bold">{title}</div>
        <button className="border py-1 md:py-2 px-2 md:px-4 hover:bg-purple-500 hover:text-white md:text-xl text-purple-500 border-purple-500 rounded-lg">
          Write a review
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-extrabold">3785 sold by</span>
          <span className="text-purple-500">Esther Mensah</span>
          <div className="flex items-center">
            <FaLocationPin className="mx-1 h-4 w-4 text-gray-400" />
            <span className="text-purple-500 font-bold">Accra, GH</span>
          </div>
        </div>

        <p className="text-base font-bold">
          Price: <span className="text-xl">${price?.cents / 100}</span> each
        </p>
        <p className="text-gray-600">
          RRP <span className="line-through">${price?.cents / 100}</span> You
          Save: $6.39 (3%)
        </p>

        <SalesEndSection
          days={timeRemaining.days}
          minutes={timeRemaining.minutes}
          seconds={timeRemaining.seconds}
        />

        <p>
          <b>Collection:</b> Click &amp; Collect - Select option at checkout
        </p>

        <h1>Delivery: $ {postage_fee?.cents / 100}</h1>

        <DeliveryDate />
        <p>Get a $1.41 credit for late delivery</p>

        {/* Add to Basket Button */}
        <div>
          <button
            type="button"
            onClick={handleAddToBasket}
            className="bg-[#F7C32E] w-full lg:w-3/4 p-2 rounded-3xl text-base font-bold"
          >
            Add to Basket
          </button>

          {/* Modal */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 px-5 z-50 overflow-y-auto ${
              isModalVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
            } transition-opacity duration-300`}
            onClick={handleCloseModal}
          >
            <div
              className={`bg-white rounded-lg shadow-lg  w-full md:w-2/3 lg:w-2/4 xl:w-1/4 p-4 mx-auto mt-10 transform ${
                isModalVisible ? 'translate-y-0' : '-translate-y-full'
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
                            className="h-14 lg:h-20 w-14 lg:w-20 object-cover  mr-3 border rounded-md"
                          />
                        </div>

                        <div className="md:col-span-4">
                          {/* Product Title */}
                          <span>{item.title}</span>
                          {/* Product Price */}
                          <div className="flex gap-5 items-center mt-2">
                            <p>
                              Price : C 
                               {/* {item.price.currency_iso}{' '} */}
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
                  <button className="px-4 py-2 rounded-3xl  shadow-2xl border  hover:border-0">View Basket</button>
                </Link>
              </div>
            </div>
          </div>
          {/* End of Modal */}
        </div>
      </div>
    </>
  );
};

export default TextSection;

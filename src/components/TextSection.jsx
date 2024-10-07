'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaLocationPin } from "react-icons/fa6";
import SalesEndSection from './SalesEndSection/SalesEndSection';
import DeliveryDate from './DeliveryDate';
import Image from 'next/image';

const TextSection = ({ product }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [basket, setBasket] = useState([]);
  const [addToBasket, setAddToBasket] = useState(false);
  const router = useRouter();

  const { id,
    title,
    price,
    postage_fee,
    sale_end_date,
    sale_start_date,
    product_images
  } = product;
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setInterval(() => {
      const saleSatrtDate = new Date(sale_start_date);
      const saleEndDate = new Date(sale_end_date);

      // বর্তমানে কত সময় বাকি আছে, সেটা বের করতে
      const currentDate = new Date();

      // সেল শেষ হবার সময় এবং বর্তমান সময়ের মধ্যে পার্থক্য বের করা
      const timeRemaining = currentDate - saleEndDate;
      // const timeRemaining =    saleEndDate - currentDate;

      const seconds = Math.floor((timeRemaining / 1000) % 60);
      const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

      // console.log(
      //   `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`
      // );

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(storedBasket);
  }, []);

  const handleAddToBasket = () => {
    // Product er details
    const productData = {
      id: id,
      title: title,
      price: price,
      quantity: 1, // Default 1 quantity initially
      image: product_images,
    };

    // Existing basket theke data niye asha
    const basket = JSON.parse(localStorage.getItem("basket")) || [];

    // Check korbo je product already ase kina
    const existingProductIndex = basket.findIndex(
      (item) => item.id === productData.id
    );

    if (existingProductIndex >= 0) {
      // Product already basket e thakle quantity increase korbo
      basket[existingProductIndex].quantity += 1;
    } else {
      // Product basket e na thakle, basket e push korbo
      basket.push(productData);
    }

    // localStorage e update korbo
    localStorage.setItem("basket", JSON.stringify(basket));

    // Popup dekhano
    setBasket(basket); // basket update kora
    setIsPopupVisible(true); // popup dekhabo
    setAddToBasket(true);

    // ৩ সেকেন্ড পরে popup বন্ধ হবে
    setTimeout(() => {
      setIsPopupVisible(false);
      ; // Cart page e redirect korbo
    }, 30000); // ৩ সেকেন্ড পরে cart e redirect korbo
  };

  // Basket update kora when component loads
  useEffect(() => {
    const basket = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(basket);
  }, []);
  return (
    <>
      <div className="lg: ml-4 lg:mt-8 space-y-4 text-base">
        <div className="text-xl md:text-2xl font-bold">{title}</div>
        <button className="border py-1 md:py-2 px-2 md:px-4 hover:bg-purple-500 hover:text-white md:text-xl text-purple-500 border-purple-500 rounded-lg">
          {'Write a review'}
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-extrabold">3785 sold by</span>
          <span className="text-purple-500">Esther Mensah</span>
          <div className="flex items-center">
            <FaLocationPin className="mx-1 h-4 w-4 text-gray-400" />
            <span className="text-purple-500 font-bold">Accra, GH</span>
          </div>
        </div>

        <p className="text-base font-bold">Price: <span className="text-xl">${price.cents}</span> each</p>
        <p className="text-gray-600">RRP <span className="line-through">${price.cents}</span> You Save: $6.39 (3%)</p>

        <SalesEndSection
          days={timeRemaining.days}
          // hours={timeRemaining.hours}
          minutes={timeRemaining.minutes}
          seconds={timeRemaining.seconds}
        />

        <p>
          <b>Collection:</b> Click & Collect - Select option at checkout
        </p>

        <h1>Delivery: $ {postage_fee.cents / 100} </h1>

        <DeliveryDate />
        <p>Get a $1.41 credit for late delivery</p>

        <div>
          {/* Add to Basket Button */}
          {!addToBasket && (
            <button
              onClick={handleAddToBasket}
              className="bg-[#F7C32E] w-3/4 p-2 rounded-3xl text-base font-bold"
            >
              Add to basket
            </button>
          )}

          {/* Popup */}
          {isPopupVisible && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-6 rounded-lg w-80 z-50">
              {/* Arrow for the popup */}
              <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>

              {/* Title */}
              <h3 className="font-bold text-lg mb-4 text-center">Basket Items</h3>

              {/* Message */}
              <p className="text-green-500 font-semibold mb-4 text-center">New product added!</p>

              {/* List of items */}
              <ul className="text-sm">
                {basket.map((item, index) => (
                  <li key={index} className="flex items-center justify-between border-b py-3">
                    {/* Product Image */}
                    <Image src={item?.image} alt={item?.title} className="h-12 w-12 object-cover rounded mr-3" />

                    {/* Product Details */}
                    {/* <div className="flex-1">
                      <span className="font-semibold text-gray-800">{item?.title}</span>
                      <p className="text-sm text-gray-500">{item?.price} USD</p>
                    </div> */}
                  </li>
                ))}
              </ul>
            </div>
          )}




        </div>

        {/* {addToBusket && <button
          onClick={() => router.push('/cart')}
          className="bg-[#F7C32E] w-3/4 p-2 rounded-3xl text-base font-bold "
        >
          Visit basket
        </button>} */}
      </div>
    </>
  )
}

export default TextSection
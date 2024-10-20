'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaLocationPin } from "react-icons/fa6";
import SalesEndSection from './SalesEndSection/SalesEndSection';
import DeliveryDate from './DeliveryDate';
import Image from 'next/image';
import Link from 'next/link';

const TextSection = ({ product }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [basket, setBasket] = useState([]);
  // const [addToBasket, setAddToBasket] = useState(false);
  const router = useRouter();
  console.log("basket", basket)

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
    setIsModalVisible(true); // Show the modal when clicked
    // setAddToBasket(true);

    // ৩ সেকেন্ড পরে popup বন্ধ হবে

  };

  // Basket update kora when component loads
  useEffect(() => {
    const basket = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(basket);
  }, []);


  // Handle Close Modal
  const handleCloseModal = () => {
    setIsModalVisible(false); // Hide the modal when clicked on Close
  };


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

        {/* add to product and show the modal  */}
        <div>
          {/* Add to Basket Button */}
          <button
            type="button"
            onClick={handleAddToBasket}
            className="bg-[#F7C32E] w-full lg:w-3/4 p-2 rounded-3xl text-base font-bold">
            Add to Basket
          </button>

          {/* Modal */}
          {isModalVisible && (
            <div className="fixed left-0 top-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-start pt-10">
              <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-xl font-semibold">Basket Items</h3>
                  <button onClick={handleCloseModal} className="text-gray-600 hover:text-gray-900">
                    &times;
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4">
                  <p className="text-green-500 font-semibold text-center">New product added!</p>
                  <ul className="mt-4">
                    {basket.length > 0 ? (
                      basket.map((item, index) => (
                        <li key={index} className="flex items-center justify-between border-b py-3">
                          {/* Product Image */}
                          <img src={item?.image[0]} alt={item.title} className="h-12 w-12 object-cover rounded mr-3" />
                          {/* Product Title */}
                          <span>{item.title}</span>
                          {/* Product Price */}
                          <span className="text-gray-600">
                            {item.price.currency_iso} {(item.price.cents / 100).toFixed(2)}
                          </span>
                          {/* Product Quantity */}
                          <span>Qty: {item.quantity}</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No items in the basket.</p>
                    )}
                  </ul>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-4 border-t space-x-2">
                  <Link href='/checkout'>
                    <button

                      className="bg-[#F7C32E] text-white px-4 py-2 rounded-3xl hover:bg-yellow-600-600"
                    >
                      Checkout Item
                    </button>
                  </Link>
                  <Link href='/cart'>
                    <button

                      className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"
                    >
                      View Basket
                    </button>
                  </Link>


                </div>

              </div>
            </div>
          )}

        </div>


      </div >
    </>
  )
}

export default TextSection
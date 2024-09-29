'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaLocationPin } from "react-icons/fa6";
import SalesEndSection from './SalesEndSection/SalesEndSection';
import DeliveryDate from './DeliveryDate';


const TextSection = ({ product }) => {
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
      const timeRemaining =   currentDate - saleEndDate;
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
    
    
    const handleAddToBasket = () => {
    // Product er details
    const productData = {
      id: id,
      title: title,
      price: price,
      quantity: 1, // Default 1 quantity initially
      image: product_images,
      // delivery:postage_fee
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

    // toast.success(`${title} has been added to your basket!`, {
    //   position: "top-center",
    //   autoClose: 5000,
    //   theme: "dark",
    // });
   
      router.push("/cart");
  };
  return (
      <>
          <div className="space-y-4 text-base">
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

          <button
            onClick={handleAddToBasket}
            className="bg-[#F7C32E] w-3/4 p-2 rounded-3xl text-base font-bold "
          >
            Add to basket
          </button>

          {/* <LaptopDetails laptopDetails={laptopDetails} />

          <ConfidenceSection />  */}
        </div>
      </>
  )
}

export default TextSection
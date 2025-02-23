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
        {/* <LaptopDetels /> */}

        
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


// 'use client'
// import React, { useEffect } from 'react';

// const ProductDetails = () => {
//   // Countdown timer effect
//   useEffect(() => {
//     function countdown() {
//       const now = new Date();
//       const eventDate = new Date("2024-12-31T12:00:00Z");
//       const currentTime = now.getTime();
//       const eventTime = eventDate.getTime();
//       const remTime = eventTime - currentTime;

//       let s = Math.floor(remTime / 1000);
//       let m = Math.floor(s / 60);
//       let h = Math.floor(m / 60);
//       let d = Math.floor(h / 24);

//       h %= 24;
//       m %= 60;
//       s %= 60;

//       h = h < 10 ? "0" + h : h;
//       m = m < 10 ? "0" + m : m;
//       s = s < 10 ? "0" + s : s;

//       const daysEl = document.getElementById("days");
//       const hoursEl = document.getElementById("hours");
//       const minutesEl = document.getElementById("minutes");
//       const secondsEl = document.getElementById("seconds");

//       if (daysEl) daysEl.textContent = d;
//       if (hoursEl) hoursEl.textContent = h;
//       if (minutesEl) minutesEl.textContent = m;
//       if (secondsEl) secondsEl.textContent = s;

//       setTimeout(countdown, 1000);
//     }
//     if (
//       document.getElementById("days") &&
//       document.getElementById("hours") &&
//       document.getElementById("minutes") &&
//       document.getElementById("seconds")
//     ) {
//       countdown();
//     }
//   }, []);

//   return (
//     <div className="col-sm-6 col-lg-6 mb-0">
//       <div className="card card-body pt-2" style={{ borderRadius: "0px", padding: "0px" }}>
//         {/* Place Schema */}
//         <div itemScope itemType="http://schema.org/Place">
//           <h1 className="up-product-title up-title-h1 text-capitalize">
//             Microwave Oven &amp; Grill. Ailyons Smart Life, Your Choice
//             <br />
//             <a href="#customer-reviews">
//               <button
//                 type="button"
//                 className="btn btn-outline-primary"
//                 style={{ height: "30px", lineHeight: "0px" }}
//               >
//                 Write a Review
//               </button>
//             </a>
//           </h1>
//           <div>
//             <a
//               itemProp="name"
//               content="Online Shopping Accra Shop"
//               className="pple"
//               href="/shops/online-shopping-accra"
//             >
//               <span className="fw-normal">
//                 <b className="blk-no-size">5533 sold &nbsp;</b> Visit the
//               </span>{" "}
//               <b style={{ fontWeight: 800 }} className="blu-no-size">
//                 Online Shopping Accra
//               </b>{" "}
//               <span className="fw-normal">Shop</span>
//             </a>
//             <b>
//               &nbsp;
//               <i className="fa fa-map-marker m-0 p-0 me-1"></i>
//               <a className="pple-no-size" href="/products?utf8=✓&town=Osu">
//                 Osu
//               </a>
//               ,{" "}
//               <a className="pple-no-size" href="/products?utf8=✓&country=GH">
//                 GH
//               </a>
//             </b>
//           </div>
//         </div>

//         {/* Offers Section */}
//         <div itemScope itemType="https://schema.org/Offer">
//           <link itemProp="availability" href="https://schema.org/InStock" />
//           <div className="pro-group border-product">
//             {/* Price */}
//             <div className="p-0 mb-0">
//               <span
//                 id="main-price-section"
//                 className="mt-1 mb-1"
//                 style={{ textAlign: "left" }}
//               >
//                 <span className="price">
//                   <span
//                     itemProp="priceCurrency"
//                     className="up-price_color_blk mb-0 me-1 up-f-fam up-no-break"
//                     content="GHS"
//                     title="GHS"
//                   >
//                     <span className="blk-no-size" style={{ fontSize: "14px" }}>
//                       Price
//                     </span>
//                     <span itemProp="price" content="1300.00">
//                       $83.78
//                     </span>
//                     <span className="h4" style={{ fontSize: "14px" }}>
//                       each
//                     </span>
//                   </span>
//                 </span>
//               </span>
//             </div>

//             {/* Countdown Timer */}
//             <div id="dueDate-counter">
//               <div>
//                 <span id="days"></span>days{" "}
//                 <span id="hours" style={{ display: "none" }}></span>
//                 <span id="minutes"></span>:<span id="seconds"></span>
//               </div>
//             </div>

//             <span id="wholesale-price-section"></span>
//             <br />
//             <div
//               className="mb-1 blk-no-size d-lg-none"
//               style={{ wordBreak: "break-word", fontSize: ".9rem" }}
//             >
//               <b>Click &amp; Collect:</b> Select option at checkout
//             </div>
//             <h5 className="mb-1">
//               <span style={{ fontSize: "14px", color: "#858181" }}>Delivery:</span>{" "}
//               <span className="up-headline-sm" style={{ color: "#858181" }}>
//                 $3.22
//               </span>
//             </h5>

//             <div className="delivery-detail d-lg-none">
//               <div
//                 className="delivery-lable text-center"
//                 style={{ width: "100%", padding: "0px", backgroundColor: "#fff" }}
//               >
//                 <div
//                   className="a8fu5iSY _1LRLSYJr"
//                   style={{
//                     fontSize: "14px",
//                     margin: "5px 0",
//                     fontWeight: 600,
//                     lineHeight: "24px",
//                     color: "#333",
//                     padding: "5px",
//                     backgroundColor: "#eff7fb87",
//                     borderRadius: "0.25rem",
//                     border: "1px solid #005dab94",
//                   }}
//                 >
//                   <svg
//                     viewBox="0 0 1024 1024"
//                     version="1.1"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="1em"
//                     height="1em"
//                     className="_12v8Urt-"
//                     style={{ fill: "#0A8800" }}
//                     aria-hidden="true"
//                   >
//                     <path d="M686.1 148.5c59.4 0 107.5 48.1 107.5 107.5l-0.1 20.4 147.9 58.5c43.7 17.3 72.4 59.5 72.4 106.5l0 214.4c0 49.7-33.7 91.5-79.5 103.8 0.9 2.6 1.3 5.5 1.3 8.4 0 63.7-51.2 115.5-114.5 115.5-63.3 0-114.5-51.8-114.5-115.5 0-1.7 0.1-3.5 0.4-5.1l-295.9 0c0.3 1.7 0.4 3.4 0.4 5.1 0 63.7-51.2 115.5-114.5 115.5-63.3 0-114.5-51.8-114.5-115.5 0-2 0.2-3.9 0.5-5.8-53.9-5.6-96-51.3-96-106.8l0-52.6c0-17 13.8-30.7 30.8-30.8 17 0 30.7 13.8 30.7 30.8l0 52.6c0 25.4 20.6 46.1 46.1 46l537.5 0 0.1-445.4c0-23.5-17.6-42.9-40.3-45.7l-5.8-0.4-491.5 0c-25.4 0-46.1 20.6-46.1 46.1l-0.1 56.2 180.8 0.1c15.3 0 27.9 11.1 30.3 25.7l0.4 5c0 17-13.8 30.7-30.7 30.7l-211.4 0c-17 0-30.7-13.8-30.8-30.7l0-87c0-59.4 48.1-107.5 107.6-107.5l491.5 0z m-335.6 614.4l-107 0c0.3 1.7 0.4 3.4 0.4 5.1 0 29.9 23.8 54.1 53.1 54.1 29.2 0 53.1-24.1 53.1-54.1 0-1.7 0.1-3.4 0.4-5.1z m524 0.3l-106.9 0 0.4 4.8c0 29.9 23.8 54.1 53.1 54.1 29.2 0 53.1-24.1 53-54.1l0.4-4.8z m-81-420.7l0 359.3 112.7 0c23.5 0 42.9-17.6 45.8-40.3l0.3-5.7 0-214.4c0-21.8-13.3-41.3-33.5-49.4l-125.3-49.5z m-614.3 102.9c17 0 30.7 13.8 30.7 30.8 0 17-13.8 30.7-30.7 30.7l-143.4 0c-17 0-30.7-13.8-30.7-30.7 0-17 13.8-30.7 30.7-30.8l143.4 0z"></path>
//                   </svg>
//                   Delivery date:
//                   <span style={{ fontSize: "14px", color: "#5624D0" }}>
//                     &nbsp;26 Feb - 01 Mar
//                   </span>
//                   &nbsp;if ordered today
//                 </div>
//               </div>
//             </div>

//             {/* Price (repeated as needed) */}
//             <span id="main-price-section" className="mt-1 mb-1" style={{ textAlign: "left" }}>
//               <span className="price">
//                 <span
//                   itemProp="priceCurrency"
//                   className="up-price_color_blk mb-0 me-1 up-f-fam up-no-break"
//                   content="GHS"
//                   title="GHS"
//                 >
//                   <span className="blk-no-size" style={{ fontSize: "14px" }}>
//                     Price
//                   </span>
//                   <span itemProp="price" content="1300.00">$83.78</span>
//                   <span className="h4" style={{ fontSize: "14px" }}>
//                     each
//                   </span>
//                 </span>
//               </span>
//             </span>

//             {/* Collection Badge */}
//             <div className="up-no-break badge bg-info bg-opacity-10 text-info" style={{ fontWeight: 900 }}>
//               <b className="blk-no-size">Collection:</b>{" "}
//               <span style={{ color: "#858181" }}>Select option at checkout</span>
//             </div>
//             <br />
//             <span>Get a $2.51 credit for late delivery</span>
//           </div>
//           <hr />

//           {/* Product Summary */}
//           <div className="mb-0 mt-0" style={{ textAlign: "left" }}>
//             <link itemProp="itemCondition" href="http://schema.org/BrandNewCondition" />
//             <meta itemProp="itemCategory" content="Microwave Ovens" />
//             <div>
//               <span
//                 className="text-end"
//                 style={{ marginRight: "10px", fontSize: "13px", lineHeight: "20px", fontWeight: 700, color: "#0F1111", width: "120px", float: "left" }}
//               >
//                 Condition{" "}
//               </span>
//               <span style={{ float: "left" }}>Brand New</span>
//               <br />
//             </div>
//             <div>
//               <span
//                 className="text-end"
//                 style={{ marginRight: "10px", fontSize: "13px", lineHeight: "20px", fontWeight: 700, color: "#0F1111", width: "120px", float: "left" }}
//               >
//                 Brand{" "}
//               </span>
//               <span style={{ float: "left" }}>
//                 <a title="Others" href="/brands/others">
//                   Others
//                 </a>
//               </span>
//               <br />
//             </div>
//             <div>
//               <span
//                 className="text-end"
//                 style={{ marginRight: "10px", fontSize: "13px", lineHeight: "20px", fontWeight: 700, color: "#0F1111", width: "120px", float: "left" }}
//               >
//                 Type
//               </span>
//               <span style={{ float: "left" }}>
//                 <a title="Microwave Ovens" href="/categories/microwave-ovens">
//                   Microwave Ovens
//                 </a>
//               </span>
//               <br />
//             </div>
//             <div>
//               <span
//                 className="text-end"
//                 style={{ marginRight: "10px", fontSize: "13px", lineHeight: "20px", fontWeight: 700, color: "#0F1111", width: "120px", float: "left" }}
//               >
//                 Upfrica Item ID{" "}
//               </span>
//               <span
//                 style={{
//                   float: "left",
//                   padding: "0px",
//                   wordBreak: "break-word",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   color: "#000",
//                 }}
//               >
//                 5LJUN4ZR
//               </span>
//               <br />
//               <span
//                 className="text-end"
//                 style={{ marginRight: "10px", fontSize: "13px", lineHeight: "20px", fontWeight: 700, color: "#0F1111", width: "120px", float: "left" }}
//               >
//                 Item number{" "}
//               </span>
//               <span
//                 style={{
//                   float: "left",
//                   padding: "0px",
//                   wordBreak: "break-word",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   color: "#000",
//                 }}
//               >
//                 0000005235
//               </span>
//             </div>
//             <br />
//           </div>
//           <hr />

//           {/* Shop With Confidence */}
//           <div className="pro-group border-product mb-2 mt-3" style={{ textAlign: "left" }}>
//             <div className="GrDxAlg8">
//               <h2
//                 style={{ fontSize: "18px", color: "#000", fontWeight: 700, textTransform: "none" }}
//                 className="_1PDCR6OS"
//                 role="link"
//                 tabIndex="0"
//                 aria-label="Shop with confidence"
//               >
//                 Shop with confidence
//               </h2>
//               <div>
//                 <h3 className="_3BfVlIFV _2FmzylNf" style={{ color: "#0A8800" }}>
//                   <svg
//                     viewBox="0 0 1024 1024"
//                     version="1.1"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="1em"
//                     height="1em"
//                     className="_3m2HREl1"
//                     role="img"
//                     aria-hidden="true"
//                     style={{ fill: "#0a8800" }}
//                   >
//                     <path d="M467.6 31.8c29.8-11.8 63-12.1 93.1-0.6l0 0 349.8 133.8c36.8 14.1 60.5 50.1 58.8 89.5l0 0-8.4 195.6c-6.9 159.5-87.6 306.6-218.4 398.2l0 0-111.9 78.3c-68.6 48-159.9 48-228.6 0l0 0-110.5-77.3c-130.7-91.4-210.3-239.2-214.9-398.6l0 0-5.5-196.7c-1.1-38.5 22-73.5 57.8-87.7l0 0z m66.1 69.9c-12.3-4.7-26-4.6-38.2 0.3l0 0-338.7 134.4c-6.3 2.5-10.4 8.7-10.2 15.5l0 0 5.5 196.7c3.8 135.5 71.5 261.2 182.6 338.9l0 0 110.5 77.3c42.7 29.8 99.4 29.8 142.1 0l0 0 112-78.3c111.5-78 180.4-203.6 186.2-339.6l0 0 8.4-195.6c0.3-7-3.9-13.3-10.3-15.8l0 0z m187.8 261.9c13.1 13.4 14.3 34.1 3.5 48.7l-4 4.7-206.3 202.6c-12.8 12.6-32.5 14.2-47.1 4.6l-4.6-3.5-118.6-107.1c-15.5-14-16.7-37.8-2.7-53.3 12.6-13.9 33.1-16.3 48.4-6.5l4.8 3.8 92.2 83.2 181.1-177.7c14.9-14.6 38.8-14.4 53.3 0.5z"></path>
//                   </svg>
//                   Shopping security
//                   <svg
//                     viewBox="0 0 1024 1024"
//                     version="1.1"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="1em"
//                     height="1em"
//                     className="_1xVrRUrC _3HTvY1jn jC27HxVM"
//                     aria-hidden="true"
//                   >
//                     <path d="M846.6 329.7c19.9-17.2 49.9-15 67.1 4.9 15.4 17.9 15.2 44 0.5 61.6l-5.4 5.5-365.3 315.5c-15.9 13.7-38.5 15.2-55.8 4.6l-6.3-4.6-366.1-315.5c-19.9-17.1-22.1-47.2-5-67 15.4-17.9 41.3-21.5 60.8-9.6l6.2 4.6 335.1 288.7 334.2-288.7z"></path>
//                   </svg>
//                 </h3>
//                 <div className="_1UrUWx5k">
//                   <div className="_3l6xUpz1">
//                     <div className="_1TEcSp-g" tabIndex="0" role="button" aria-label="Safe payments">
//                       <i className="fa fa-check"></i> Safe payments
//                     </div>
//                     <div className="_1TEcSp-g" tabIndex="0" role="button" aria-label="Secure privacy">
//                       <i className="fa fa-check"></i> Good quality products
//                     </div>
//                   </div>
//                   <div>
//                     <div className="_1TEcSp-g" tabIndex="0" role="button" aria-label="Secure logistics">
//                       <i className="fa fa-check"></i> Delivery or collection
//                     </div>
//                     <div className="_1TEcSp-g" tabIndex="0" role="button" aria-label="Purchase protection">
//                       <i className="fa fa-check"></i> Secure privacy
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Shop With Confidence Ends */}
//           </div>
//           {/* Offers Section Ends */}
//           <hr />
//           {/* Product Summary */}
//           <div className="mb-0 mt-0" style={{ textAlign: "left" }}>
//             <link itemProp="itemCondition" href="http://schema.org/BrandNewCondition" />
//             <meta itemProp="itemCategory" content="Microwave Ovens" />
//             <div>
//               <span
//                 className="text-end"
//                 style={{
//                   marginRight: "10px",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   fontWeight: 700,
//                   color: "#0F1111",
//                   width: "120px",
//                   float: "left",
//                 }}
//               >
//                 Condition
//               </span>
//               <span style={{ float: "left" }}>Brand New</span>
//               <br />
//             </div>
//             <div>
//               <span
//                 className="text-end"
//                 style={{
//                   marginRight: "10px",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   fontWeight: 700,
//                   color: "#0F1111",
//                   width: "120px",
//                   float: "left",
//                 }}
//               >
//                 Brand
//               </span>
//               <span style={{ float: "left" }}>
//                 <a title="Others" href="/brands/others">
//                   Others
//                 </a>
//               </span>
//               <br />
//             </div>
//             <div>
//               <span
//                 className="text-end"
//                 style={{
//                   marginRight: "10px",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   fontWeight: 700,
//                   color: "#0F1111",
//                   width: "120px",
//                   float: "left",
//                 }}
//               >
//                 Type
//               </span>
//               <span style={{ float: "left" }}>
//                 <a title="Microwave Ovens" href="/categories/microwave-ovens">
//                   Microwave Ovens
//                 </a>
//               </span>
//               <br />
//             </div>
//             <div>
//               <span
//                 className="text-end"
//                 style={{
//                   marginRight: "10px",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   fontWeight: 700,
//                   color: "#0F1111",
//                   width: "120px",
//                   float: "left",
//                 }}
//               >
//                 Upfrica Item ID{" "}
//               </span>
//               <span
//                 style={{
//                   float: "left",
//                   padding: "0px",
//                   wordBreak: "break-word",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   color: "#000",
//                 }}
//               >
//                 5LJUN4ZR
//               </span>
//               <br />
//               <span
//                 className="text-end"
//                 style={{
//                   marginRight: "10px",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   fontWeight: 700,
//                   color: "#0F1111",
//                   width: "120px",
//                   float: "left",
//                 }}
//               >
//                 Item number{" "}
//               </span>
//               <span
//                 style={{
//                   float: "left",
//                   padding: "0px",
//                   wordBreak: "break-word",
//                   fontSize: "13px",
//                   lineHeight: "20px",
//                   color: "#000",
//                 }}
//               >
//                 0000005235
//               </span>
//             </div>
//             <br />
//           </div>
//           <hr />
//         </div>
//         {/* End Offers Section and Product Summary */}
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;


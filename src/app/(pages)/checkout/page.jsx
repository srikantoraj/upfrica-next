"use client";
import React, { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Addresses from "@/components/Addresses";
import useAuth from "@/components/useAuth";
import { Formik, useFormik } from "formik";

const Checkout = () => {
  const userInfo = useAuth();
  //  console.log(userInfo)
  const [country, setCountry] = useState("Bangladesh");
  const [isOpen, setIsOpen] = useState(false);
  const [basket, setBasket] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const [addresses, setAddresses] = useState([]); // To store fetched addresses
  const [dropdownOptions, setDropdownOptions] = useState([]); // Dropdown options
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Selected address ID
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isLoading, setIsLoading] = useState(false); // লোডিং স্টেট
  const router = useRouter();


  console.log(selectedPayment)

  // Fetch addresses from the API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (!user?.token) router.push("/signin");

    const fetchAddresses = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${user?.token}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "https://upfrica-staging.herokuapp.com/api/v1/addresses",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setAddresses(data.addresses);

        // Map addresses to dropdown options
        const options = data.addresses.map((address) => ({
          id: address.id,
          value: `${address.address_data.address_line_1}, ${address.address_data.town}, ${address.address_data.country}`,
        }));
        setDropdownOptions(options);
        setSelectedAddressId(options?.[0]?.id);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    setTimeout(() => {
      fetchAddresses();
    }, 0);

    // Load basket from localStorage
    const storedBasket = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(storedBasket);
  }, []);

  const handleSelect = (id) => {
    setSelectedAddressId(id);
    // You can perform additional actions here, such as fetching more data based on the selected id
    console.log("Selected address ID:", id);
  };

  // Retrieve basket from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBasket = JSON.parse(localStorage.getItem("basket")) || [];
      setBasket(storedBasket);
    }
  }, []);

  // Function to handle checkbox state change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const placeOrder = async (paymentMethod) => {
    setIsLoading(true); // ফেচিং শুরু হলে লোডিং স্টেট অন
    setSelectedPayment(() => paymentMethod);
    // setIsLoading(true);
    // setIsLoading(false);
    const busket = JSON.parse(localStorage.getItem("basket")) || [];
    const user = JSON.parse(localStorage.getItem("user")) || {};

    if (!busket.length) return;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    };

    let itemList = [];
    for (let item of busket) {
      console.log({ product_id: item?.id, quantity: item?.quantity });
      let obj = { product_id: item?.id, quantity: item?.quantity };
      itemList.push(obj);
    }

    if (!selectedAddressId) {
      return;
    }
    // const deepLink = getDeepLink("callback");

    var data = {
      checkout: {
        address_id: selectedAddressId,
        products: [
          {
            id: itemList[0].product_id,
            quantity: itemList[0]?.quantity,
          },
        ],
        redirect_uri: "upfrica-delta.vercel.app",
        payment_method: paymentMethod,
      },
    };

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      redirect: "follow",
    };

    // _addLinkingListener();

    fetch(
      "https://upfrica-staging.herokuapp.com/api/v1/orders/checkout",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false); // সার্ভার রেসপন্স পেলে লোডিং বন্ধ
        console.log(result);

        if (paymentMethod == 'paystack') {
          router.push(result.paystack.data.authorization_url);
        }
        // অন্যথায় stripe URL এ রিডাইরেক্ট করবে
        else {
          router.push(result.stripe_url);
        }

      })
      .catch((error) => {
        console.log("error", error);
        setIsLoading(false);
      });
  };



  const formik = useFormik({
    initialValues: {
      setAsDefault: false,
      full_name: "",
      phone_number: "",
      country: "",
      address_line_1: "",
      addressLine2: "",
      postcode: "",
      local_area: "",
      town: "",
      additionalInstructions: "",
      weekends: {
        saturdays: 0,
        sundays: 0,
      },
    },
    onSubmit: (values) => {
      // console.log(values)
      // const myHeaders = new Headers();
      // myHeaders.append("Authorization", `Bearer ${userInfo?.token}`);
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user.token}`);
      myHeaders.append("Content-Type", "application/json");

      values["owner_id"] = userInfo?.user?.id;

      const raw = JSON.stringify({ address: values });
      console.log(raw);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://upfrica-staging.herokuapp.com/api/v1/addresses",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-black text-white text-center text-xl lg:text-2xl font-bold py-2">
        <h1>Secure Checkout</h1>
      </div>

      {/* Billing Country Section */}
      <div className="shadow-md bg-white py-4 px-2 mx-auto">
        <div className="border md:w-2/3 lg:w-3/5 space-y-2 mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold tracking-wide">
            *Billing Country
          </h2>
          <div>
            <CountryDropdown
              className="border border-purple-500 focus:outline-none focus:ring focus:border-blue-500 px-2 py-2 rounded-md w-full"
              value={country}
              onChange={(val) => setCountry(val)}
            />
          </div>
        </div>
      </div>

      {/* Delivery Section */}
      <div className="bg-gray-100 py-8 px-2 mx-auto">
        <div className="border lg:w-3/5 space-y-2 mx-auto bg-white shadow-md p-4 lg:p-8 rounded-md">
          <h2 className="text-xl text-center lg:text-2xl font-bold tracking-wide">
            Deliver To
          </h2>
          <div className="space-y-3">
            <p className="text-base font-bold tracking-wide text-[#3c4858]">
              Your item will be delivered to this default location. Please make
              sure the details are correct.
            </p>

            {dropdownOptions?.length > 0 && (
              <Addresses
                options={dropdownOptions}
                onSelect={handleSelect}
                placeholder={dropdownOptions[0].value}
              />
            )}
            <div>
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                <p className="text-xl text-[#3c4858]">
                  Add a new address <br />
                </p>
                <span className="ml-2 text-base text-gray-500">
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  {/* Icon changes on open/close */}
                </span>
              </div>
              <span className="text-blue-500">Edit</span>

              {/* Dropdown form */}
              {isOpen && (
                <div className="mt-4 text-xl">
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                      <div className="space-y-3">
                        <p className="flex gap-2 items-center">
                          <span>Set as default</span>
                          <span>
                            <input
                              type="checkbox"
                              name="setAsDefault"
                              checked={formik.values.setAsDefault}
                              onChange={formik.handleChange}
                            />
                          </span>
                        </p>
                        <p>*The field can't be blank</p>
                      </div>
                    </div>

                    {/* Full Name Field */}
                    <div className="space-y-1">
                      <label className="block font-medium">
                        *Full name (First and Last name)
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full name (First and Last name)"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-1">
                      <label className="block font-medium">
                        *Phone number to contact you if required
                      </label>
                      <input
                        type="text"
                        name="phone_number"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number to contact you if required"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Country Dropdown */}
                    <div className="space-y-1">
                      <label className="block font-medium">*Country</label>
                      <CountryDropdown
                        name="country"
                        className="border focus:outline-none focus:ring focus:border-blue-500 px-2 py-2 rounded-md w-full"
                        value={formik.values.country}
                        onChange={(val) => formik.setFieldValue("country", val)} // Correctly setting the country value
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div className="space-y-1">
                      <label className="block font-medium">
                        *Address line 1 (or Company name)
                      </label>
                      <input
                        type="text"
                        name="address_line_1"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address line 1 (or Company name)"
                        value={formik.values.address_line_1}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div className="space-y-1">
                      <label className="block font-medium">
                        Address line 2 (optional)
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address line 2 (optional)"
                        value={formik.values.addressLine2}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Postcode */}
                    <div className="space-y-1">
                      <label className="block font-medium">
                        Postcode / GP GPS (optional)
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Postcode / GP GPS (optional)"
                        value={formik.values.postcode}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Local Area */}
                    <div className="space-y-1">
                      <label className="block font-medium">Local area</label>
                      <input
                        type="text"
                        name="local_area"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Local area"
                        value={formik.values.local_area}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Town/City */}
                    <div className="space-y-1">
                      <label className="block font-medium">*Town/City</label>
                      <input
                        type="text"
                        name="town"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="*Town/City"
                        value={formik.values.townCity}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Additional Instructions */}
                    <div className="space-y-1">
                      <label className="block font-medium">
                        Do we need additional instructions to find this address?
                      </label>
                      <textarea
                        name="additionalInstructions"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formik.values.additionalInstructions}
                        onChange={formik.handleChange}
                      />
                    </div>

                    {/* Weekend Delivery */}
                    <div>
                      <p>Weekend delivery: I can receive packages on:</p>
                      <div className="flex justify-between py-2">
                        <p>
                          <input
                            type="checkbox"
                            name="weekends.saturdays"
                            checked={formik.values.weekends.saturdays}
                            onChange={formik.handleChange}
                          />{" "}
                          <span className="text-xl font-bold">Saturdays</span>
                        </p>
                        <p>
                          <input
                            type="checkbox"
                            name="weekends.sundays"
                            checked={formik.values.weekends.sundays}
                            onChange={formik.handleChange}
                          />{" "}
                          <span className="text-xl font-bold">Sundays</span>
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Cart Section */}
        <div className="border lg:w-3/5 space-y-2 bg-white shadow-md p-4 lg:p-8 rounded-md mt-4 mx-auto">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{basket.length} Items</h2>
          </div>
          {basket.length > 0 ? (
            basket.map((product, index) => (
              <div key={index}>
                <div className="md:flex py-8 md:py-10 lg:py-8 border-t border-gray-50">
                  <div className="md:w-4/12 2xl:w-1/4 w-full">
                    <img
                      src={product?.image[0]}
                      alt={product?.title}
                      className="h-full object-center md:block hidden object-cover"
                    />
                    <img
                      src={product.image[0]}
                      alt={product.title}
                      className="md:hidden w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-xl font-black leading-none text-gray-800">
                        {product.title}
                      </p>
                    </div>
                    <p className="text-base leading-3 text-gray-600 pt-2">
                      Height: 10 inches
                    </p>
                    <p className="text-base leading-3 text-gray-600 py-4">
                      Color: Black
                    </p>

                    <div className="flex items-center justify-between pt-5">
                      <div className="flex items-center">
                        <p className="text-base leading-3 underline text-gray-800 cursor-pointer">
                          Add to favorites
                        </p>
                        <p className="text-base leading-3 underline text-red-500 pl-5 cursor-pointer">
                          Remove
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 hover:bg-green-50 p-4 rounded-md">
                  <label className="flex gap-5 text-base font-bold">
                    <input
                      type="radio"
                      name={`paymentOption-${index}`}
                      className="radio checked:bg-blue-500"
                      defaultChecked
                    />
                    <div>
                      <p>Pay before delivery</p>
                      <p>
                        Estimated delivery:{" "}
                        <span className="text-purple-500">01 Oct - 04 Oct</span>
                      </p>
                    </div>
                  </label>
                  <label className="flex gap-5 text-base font-bold">
                    <input
                      type="radio"
                      name={`paymentOption-${index}`}
                      className="radio checked:bg-blue-500"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <div className="space-y-2">
                      <p>Pay on collection</p>
                      <p className="text-gray-700">
                        Collection date:{" "}
                        <span className="text-purple-500">01 Oct - 04 Oct</span>
                      </p>
                      <p>
                        The item will be reserved until{" "}
                        <span className="text-purple-500">06 Oct 24</span>
                      </p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-xl flex gap-2 items-center">
                          <span>
                            <IoHome />
                          </span>{" "}
                          Upfrica Collection Point
                        </p>
                        <p>
                          Shop 1, Manna Plaza <br /> Community 18 junction{" "}
                          <br /> Opposite Allied Filling Station <br />
                          Spintex Road, Accra
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Your basket is empty.</p>
          )}
        </div>

        {/* Bottom Section */}
        <div className="py-6 space-y-4 border rounded-lg shadow-lg bg-white lg:w-3/5 mx-auto">
          <p className="text-center text-lg font-medium text-gray-700">
            You'll pick up one or more items in shop or at a collection point.
          </p>
          <div className="mt-4 space-y-5 text-center">
            <button
              onClick={() => placeOrder('paystack')}
              className="text-lg font-semibold text-white bg-[#f7c32e] px-6 py-3 rounded-full hover:bg-[#d6a91d] transition duration-300 ease-in-out shadow-lg focus:outline-none mr-4"
              disabled={isLoading}
            >
              {isLoading && selectedPayment === 'paystack' ? 'Lodding...' : 'Pay with Paystack'}
            </button>
            <button
              onClick={() => placeOrder('stripe')}
              className="text-lg font-semibold text-white bg-[#f7c32e] px-6 py-3 rounded-full hover:bg-[#d6a91d] transition duration-300 ease-in-out shadow-lg focus:outline-none"
              disabled={isLoading}
            >
              {isLoading && selectedPayment === 'stripe' ? 'Lodding...' : 'Pay with Stripe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
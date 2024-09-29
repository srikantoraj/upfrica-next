// app/checkout/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoHome } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Addresses from '@/components/Addresses';
import useAuth from '@/components/useAuth';

const Checkout = () => {

    const userInfo = useAuth()
    console.log(userInfo)
  const [country, setCountry] = useState('Bangladesh');
  const [isOpen, setIsOpen] = useState(false);
  const [basket, setBasket] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

    
const [addresses, setAddresses] = useState([]); // To store fetched addresses
  const [dropdownOptions, setDropdownOptions] = useState([]); // Dropdown options
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Selected address ID
  const router = useRouter();
  
  // Fetch addresses from the API
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        console.log(user)
        const fetchAddresses = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${user?.token}`);

            const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            };

            const response = await fetch(
            'https://upfrica-staging.herokuapp.com/api/v1/addresses',
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
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
        };

        setTimeout(() => {
      fetchAddresses();  
    },0)
    

    // Load basket from localStorage
    const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
    setBasket(storedBasket);
  }, []);


  const handleSelect = (id) => {
    setSelectedAddressId(id);
    // You can perform additional actions here, such as fetching more data based on the selected id
    console.log('Selected address ID:', id);
  };


  // Retrieve basket from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
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

  const handleCheckout = () => {
    // Retrieve user information from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      // If user exists, navigate to the Checkout page
      // Note: Next.js does not support passing state directly via router.push
      // The Checkout page should retrieve basket data from localStorage or use a global state management solution
      router.push('/checkout');
    } else {
      // If user does not exist, navigate to the Sign-In page
      router.push('/signin');
    }
  };

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
            {/* <CountryDropdown
              className="border border-purple-500 focus:outline-none focus:ring focus:border-blue-500 px-2 py-2 rounded-md w-full"
              value={country}
              onChange={(val) => setCountry(val)}
            /> */}
                      { dropdownOptions?.length > 0 && <Addresses
                          options={dropdownOptions}
                          onSelect={handleSelect}
                          placeholder={dropdownOptions[0].value}
                      />}
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
                  <form className="space-y-4">
                    <div>
                      <div className="space-y-3">
                        <p className="flex gap-2 items-center">
                          <span>Set as default</span>
                          <span>
                            <input
                              type="checkbox"
                              name="setAsDefault"
                              id="setAsDefault"
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                            />
                          </span>
                        </p>
                        <p>*The field can't be blank</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">
                        *Full name (First and Last name)
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full name (First and Last name)"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">
                        *Phone number to contact you if required
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number to contact you if required"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">*Country</label>
                      <div>
                        <CountryDropdown
                          className="border focus:outline-none focus:ring focus:border-blue-500 px-2 py-2 rounded-md w-full"
                          value={country}
                          onChange={(val) => setCountry(val)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">
                        *Address line 1 (or Company name)
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address line 1 (or Company name)"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">
                        Address line 2 (optional)
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address line 2 (optional)"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">
                        Postcode / GP GPS (optional)
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Postcode / GP GPS (optional)"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">Local area</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Local area"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">*Town/City</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="*Town/City"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">
                        Do we need additional instructions to find this address?
                      </label>
                      <textarea
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                      />
                    </div>
                    <div>
                      <p>Weekend delivery: I can receive packages on:</p>
                      <div className="flex justify-between py-2">
                        <p>
                          <span>
                            <input type="checkbox" name="saturdays" id="saturdays" />
                          </span>{' '}
                          <span className="text-xl font-bold">Saturdays</span>
                        </p>
                        <p>
                          <span>
                            <input type="checkbox" name="sundays" id="sundays" />
                          </span>{' '}
                          <span className="text-xl font-bold">Sunday</span>
                        </p>
                      </div>
                    </div>

                    {/* Add more fields as needed */}
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
                      src={product.image[0]}
                      alt={product.title}
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
                        Estimated delivery:{' '}
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
                        Collection date:{' '}
                        <span className="text-purple-500">01 Oct - 04 Oct</span>
                      </p>
                      <p>
                        The item will be reserved until{' '}
                        <span className="text-purple-500">06 Oct 24</span>
                      </p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-xl flex gap-2 items-center">
                          <span>
                            <IoHome />
                          </span>{' '}
                          Upfrica Collection Point
                        </p>
                        <p>
                          Shop 1, Manna Plaza <br /> Community 18 junction <br />{' '}
                          Opposite Allied Filling Station <br />
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
        <div className="py-4 space-y-2 border">
          <p className="text-center">
            You'll pick up one or more items in shop or at a collection point.
          </p>
          <div className="flex justify-center items-center">
            <button
              onClick={handleCheckout}
              className="text-xl font-bold bg-[#f7c32e] w-full md:w-1/3 py-2 md:rounded-3xl fixed bottom-0 sm:relative"
              disabled={basket.length === 0}
            >
              Continue
            </button>
          </div>
        </div> 
          </div>
      </div>
    );
  };

export default Checkout;

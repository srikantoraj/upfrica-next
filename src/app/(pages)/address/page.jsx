"use client";
import React, { useState, useEffect } from "react";
import { FaDotCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";

// Custom hook for fetching addresses
const useFetchAddresses = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(data)

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 7pTf7h9BZgf9JFy3ssZbs2DQ");

        const response = await fetch("https://upfrica-staging.herokuapp.com/api/v1/addresses", {
          method: "GET",
          headers: myHeaders,
        });
        const result = await response.json();

        if (response.ok && result.addresses) {
          setData(result.addresses);
        } else {
          setError("No addresses found.");
        }
      } catch (err) {
        setError("Failed to fetch addresses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return { data, error, loading };
};

// AddressCard component
const AddressCard = ({ item, isEditing, toggleEdit }) => {
  const [formData, setFormData] = useState({
    fullName: item.full_name,
    addressLine: item.address_data.address_line_1,
    town: item.address_data.town,
    postcode: item.address_data.postcode,
    country: item.address_data.country,
    phoneNumber: item.address_data.phone_number,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here, you can handle the update of the address
    console.log("Updated Address:", formData);

    // Prepare the data for submission
  const updatedAddress = {
    full_name: formData.fullName,
      address_line_1: formData.addressLine,
      town: formData.town,
      postcode: formData.postcode,
      country: formData.country,
      phone_number: formData.phoneNumber,
   
  };

  try {
    console.log(item?.id)
    const response = await fetch(`https://upfrica-staging.herokuapp.com/api/v1/addresses/${item.id}`, {
      method: "PATCH", // or "PATCH" depending on your API
      headers: {
        "Authorization": "Bearer 7pTf7h9BZgf9JFy3ssZbs2DQ",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({address:updatedAddress}),
    });

    if (!response.ok) {
      throw new Error("Failed to update address.");
    }

    const result = await response.json();
    console.log("Updated Address:", result); // Log the updated address returned from the API

    // Optionally, you might want to update your local state here if necessary
    // For example, you can call a function to fetch the updated list of addresses again.
  } catch (error) {
    console.error("Error updating address:", error.message);
  }

    toggleEdit(); // Close the edit form after submission
  };

  return (
    <div className={`address-card bg-white p-5 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out ${isEditing ? "h-auto" : "h-60"}`}>
      <h3 className="font-bold text-xl text-gray-800 mb-2">{item.id} {item.full_name}</h3>
      <p className="text-gray-600 mb-1">{item.address_data.address_line_1}</p>
      <p className="text-gray-600 mb-1">
        {item.address_data.town}, {item.address_data.postcode}
      </p>
      <p className="text-gray-600 mb-1">{item.address_data.country}</p>
      <p className="text-gray-600 mb-1">Phone: {item.address_data.phone_number}</p>

      {/* Buttons section */}
      <div className="mt-4 flex justify-between">
        <button onClick={toggleEdit} className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300">
          Edit
        </button>
        <button className="bg-gray-200 text-red-400 py-2 px-4 rounded hover:bg-gray-300 transition duration-300">
          Delete
        </button>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300">
          Set as Default
        </button>
      </div>

      {/* Dropdown Form for Editing */}
      {isEditing && (
        <form className="mt-4 p-4 border border-gray-300 rounded-lg" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1" htmlFor="addressLine">Address Line</label>
            <input
              type="text"
              name="addressLine"
              id="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1" htmlFor="town">Town</label>
            <input
              type="text"
              name="town"
              id="town"
              value={formData.town}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1" htmlFor="postcode">Postcode</label>
            <input
              type="text"
              name="postcode"
              id="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1" htmlFor="country">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1" htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

const AddressPage = () => {
  const { data, error, loading } = useFetchAddresses();
  const [activeCardId, setActiveCardId] = useState(null);

  const toggleEdit = (id) => {
    setActiveCardId((prevId) => (prevId === id ? null : id)); // Toggle active card
  };

  if (loading) return <p>Loading addresses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="address-page-container container mx-auto my-20 px-2">
      <div className="address-info flex items-center gap-4 text-purple-500">
        <p className="flex items-center">
          <GoDotFill className="mr-2" /> Home
        </p>
        <p className="flex items-center">
          <IoIosArrowForward className="mr-1" />
          <IoIosArrowForward className="mr-1" />
          Your delivery locations
        </p>
      </div>
      <div className="address-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-20">
        {data.length > 0 ? (
          data.map((item) => (
            <AddressCard
              key={item.id}
              item={item}
              isEditing={activeCardId === item.id}
              toggleEdit={() => toggleEdit(item.id)}
            />
          ))
        ) : (
          <p>No addresses available.</p>
        )}
      </div>
    </div>
  );
};

export default AddressPage;

"use client";
import React, { useState, useEffect } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Link from "next/link";
import { useSelector } from "react-redux";

const DrafPage = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [statuses, setStatuses] = useState({});

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Token ${token}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "https://media.upfrica.com/api/products/draft/",
          requestOptions,
        );
        const result = await response.json();
        console.log(result);
        setProducts(result?.results || []);

        // Initialize statuses from fetched products (default to "Draft" if none exists)
        const initialStatuses = {};
        (result?.results || []).forEach((product) => {
          initialStatuses[product.id] = product.status || "Draft";
        });
        setStatuses(initialStatuses);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Function to update product status via API and show confirmation/error popup.
  // If a product is published successfully, it is removed from the draft list.
  const updateProductStatus = async (productId, newStatus) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      myHeaders.append("Content-Type", "application/json");

      // Convert the status string to the value expected by the API:
      // Published -> 1, Draft -> 0
      const statusValue = newStatus === "Published" ? 1 : 0;
      const raw = JSON.stringify({ status: statusValue });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const url = `https://media.upfrica.com/api/products/draft/${productId}/`;
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      // Check response based on expected structure.
      if (newStatus === "Published" && result?.new_status === 1) {
        window.alert(`Product  with id ${result?.id} published successfully!`);
        // Remove the published product from state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId),
        );
        setStatuses((prevStatuses) => {
          const updated = { ...prevStatuses };
          delete updated[productId];
          return updated;
        });
      } else if (newStatus === "Draft" && result?.new_status === 0) {
        window.alert(
          `Product set to draft successfully! ${JSON.stringify(result)}`,
        );
      } else {
        throw new Error("Invalid response received from the server.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      window.alert(`Error updating product status: ${error.message}`);
    }
  };

  // Toggle dropdown for a specific product
  const handleDropdownToggle = (productId) => {
    setOpenDropdownId((prev) => (prev === productId ? null : productId));
  };

  // Handle status selection and trigger API call
  const handleStatusSelect = (productId, newStatus) => {
    // Update local UI state immediately
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      [productId]: newStatus,
    }));
    setOpenDropdownId(null);
    // Trigger API update call
    updateProductStatus(productId, newStatus);
  };

  // Render animated skeleton loader rows while products are being fetched
  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <tr key={index} className="text-base tracking-wide animate-pulse">
        <td className="border border-gray-300 px-6 py-2 md:py-8 bg-gray-300">
          &nbsp;
        </td>
        <td className="border border-gray-300 px-4 bg-gray-300">
          <div className="md:flex justify-between items-center space-x-2">
            <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </td>
        <td className="border border-gray-300 px-6 py-4 bg-gray-300">
          <div className="space-y-2">
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200 text-xl font-bold">
          <tr>
            <th className="border border-gray-300 px-6 py-3 lg:w-1/12 text-left text-gray-700">
              ID
            </th>
            <th className="border border-gray-300 px-6 py-3 lg:w-2/12 text-left text-gray-700">
              Product
            </th>
            <th className="border border-gray-300 px-6 py-3 lg:w-9/12 text-left text-gray-700">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? renderSkeletonRows()
            : products?.map((product) => (
                <tr
                  key={product.id}
                  className="text-base tracking-wide cursor-pointer"
                >
                  <td className="border border-gray-300 px-6 py-2 md:py-8">
                    {product.id}
                  </td>
                  <td className="border border-gray-300 px-4">
                    <div className="md:flex justify-between items-center space-x-2">
                      {/* Status Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => handleDropdownToggle(product.id)}
                          className="bg-[#F3E8FF] text-[#8710D8] font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-[#E0C9FF] transition-all duration-300 ease-in-out cursor-pointer"
                        >
                          {statuses[product.id]}
                        </button>
                        {openDropdownId === product.id && (
                          <div className="absolute left-0 mb-10 w-32 bg-white border border-gray-300 rounded-lg shadow-xl z-10">
                            <ul className="py-1">
                              <li
                                className="px-8 py-2 text-gray-700 hover:bg-[#F3E8FF] hover:text-[#8710D8] transition-all duration-300 ease-in-out cursor-pointer"
                                onClick={() =>
                                  handleStatusSelect(product.id, "Draft")
                                }
                              >
                                Draft
                              </li>
                              <li
                                className="px-8 py-2 text-gray-700 hover:bg-[#F3E8FF] hover:text-[#8710D8] transition-all duration-300 ease-in-out cursor-pointer"
                                onClick={() =>
                                  handleStatusSelect(product.id, "Published")
                                }
                              >
                                Published
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Edit Button */}
                      <Link
                        href={`/products/new/${product.id}`}
                        className="text-[#AF35F0] font-semibold cursor-pointer hover:underline flex items-center gap-2"
                      >
                        <span>
                          <CiEdit className="h-5 w-5" />
                        </span>
                        Edit
                      </Link>

                      {/* Delete Button */}
                      <span className="flex items-center space-x-1 text-blue-500 cursor-pointer hover:text-blue-700">
                        <MdDelete className="h-6 w-6" />
                        <span className="font-semibold">Delete</span>
                      </span>
                    </div>
                  </td>

                  <td className="border border-gray-300 px-6 py-4 text-base flex gap-5">
                    <div className="space-y-2">
                      <p>{product?.title}</p>
                      <p className="flex gap-4 items-center">
                        <span>Price: ${product?.price?.cents}</span>
                        <span>Delivery: Free</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span>
                          <FaLocationPin className="text-gray-400" />
                        </span>
                        <span>
                          {product?.user?.town}, {product?.user?.country}
                        </span>
                        <span>{product?.user?.first_name}</span> |{" "}
                        <span className="hover:text-red-500">
                          {product?.user?.username}
                        </span>{" "}
                        | <span className="hover:text-red-500"> Whatsap </span>{" "}
                        |{" "}
                        <span className="hover:text-red-500">
                          {product?.user?.email}
                        </span>
                      </p>
                      <p>3 days ago</p>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrafPage;

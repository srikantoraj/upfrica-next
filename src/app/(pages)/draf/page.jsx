"use client"

import React, { useState, useEffect } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Link from "next/link";




const DrafPage = () => {

  const [products, setProducts] = useState([]); // products state
  const [status, setStatus] = useState("Draft"); // status state
  const [isOpen, setIsOpen] = useState(false); // dropdown state

 
  
  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 8p2rgKcPohFu8p2MMpSDrieL");

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch("https://upfrica-staging.herokuapp.com/api/v1/products/drafts", requestOptions);
        const result = await response.json();
        setProducts(result.products); // Set products in state
      } catch (error) {
        console.error("Error fetching products:", error); // Handle errors
      }
    };

    fetchProducts(); // Call the function
  }, []);

  // Edit button click handler
  const handleEditClick = (id) => {
    console.log(id);
    
   
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200 text-xl font-bold">
          <tr>
            <th className="border border-gray-300 px-6 py-3 lg:w-1/12 text-left text-gray-700">ID</th>
            <th className="border border-gray-300 px-6 py-3 lg:w-2/12 text-left text-gray-700">Product</th>
            <th className="border border-gray-300 px-6 py-3 lg:w-9/12 text-left text-gray-700">Details</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="text-base tracking-wide cursor-pointer">
              <td className="border border-gray-300 px-6 py-2 md:py-8">{product.id}</td>
              <td className="border border-gray-300 px-4">
                <div className="md:flex justify-between items-center space-x-2">
                  {/* Dropdown for Draft/Published */}
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="bg-[#F3E8FF] text-[#8710D8] font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-[#E0C9FF] transition-all duration-300 ease-in-out cursor-pointer"
                    >
                      {status}
                    </button>
                    {isOpen && (
                      <div className="absolute left-0 mb-10 w-32 bg-white border border-gray-300 rounded-lg shadow-xl z-10">
                        <ul className="py-1">
                          <li
                            className="px-8 py-2 text-gray-700 hover:bg-[#F3E8FF] hover:text-[#8710D8] transition-all duration-300 ease-in-out cursor-pointer"
                            onClick={() => {
                              setStatus("Draft");
                              setIsOpen(false);
                            }}
                          >
                            Draft
                          </li>
                          <li
                            className="px-8 py-2 text-gray-700 hover:bg-[#F3E8FF] hover:text-[#8710D8] transition-all duration-300 ease-in-out cursor-pointer"
                            onClick={() => {
                              setStatus("Published");
                              setIsOpen(false);
                            }}
                          >
                            Published
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Edit Button */}
                  
                  <Link
                   href={`/products/new?id=${product.id}`}
                    // onClick={()=>handleEditClick(product.id)}
                    className="text-[#AF35F0] font-semibold cursor-pointer hover:underline flex items-center gap-2"
                     // Edit button click handler
                  >
                    <span ><CiEdit className="h-5 w-5" /></span> Edit
                  </Link>
                  

                  {/* Delete Button */}
                  <span className="flex items-center space-x-1 text-blue-500 cursor-pointer hover:text-blue-700">
                    <MdDelete className="h-6 w-6" />
                    <span className="font-semibold">Delete</span>
                  </span>
                </div>
              </td>

              <td className="border border-gray-300 px-6 py-4 text-base flex gap-5 ">
                <div className="space-y-2">
                  <p>{product?.title}</p>
                  <p className="flex gap-4 items-center">
                    <span>Price: ${product?.price?.cents}</span>
                    <span>Delivery: Free</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span><FaLocationPin className="text-gray-400" /></span>
                    <span>{product?.user?.town}, {product?.user?.country}</span>
                    <span>{product?.user?.first_name}</span> | <span className="hover:text-red-500">{product?.user?.username} </span> |
                    <span className="hover:text-red-500"> Whatsap </span> | <span className="hover:text-red-500">{product?.user?.email} </span>
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

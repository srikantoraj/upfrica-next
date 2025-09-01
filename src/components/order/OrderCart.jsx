"use client";
import React from "react";
import { FaLocationPin } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import { useOrder } from "@/contexts/OrderContext";

const OrderCart = () => {
  const { data, error, loading, user, setData } = useOrder(); // Context থেকে `setData` পেতে হবে

  const handleDelete = async (itemId) => {
    if (user && user.token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user.token}`);
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          `https://upfrica-staging.herokuapp.com/api/v1/orders/${itemId}`,
          requestOptions,
        );
        if (!response.ok) {
          throw new Error(`Failed to delete item: ${response.status}`);
        }

        // ডেটা ফিল্টার করে শুধুমাত্র যেসব অর্ডার ডিলিট করা হয়নি সেগুলো রাখুন
        const filteredData = data.filter((product) => product.id !== itemId);
        setData(filteredData); // ফিল্টার করা ডেটা কনটেক্সটের মাধ্যমে আপডেট করুন
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading....</div>; // Skeleton loader
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>; // Display error message
  }

  return (
    <div>
      <div className="space-y-4 text-base">
        {data?.map(
          (product, index) =>
            product?.cart_items?.length > 0 && (
              <div
                key={product.id}
                className="border border-gray-300 p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-base">
                  <p className="text-xl font-bold">Order #{index + 1}</p>
                  <p className="text-gray-600">
                    Order Date: {product.created_at || "N/A"}
                  </p>
                  <p className="text-gray-700 font-bold">
                    Pick up one or more items in shop or at a collection point.
                  </p>
                </div>

                <hr className="my-4" />

                <div className="grid md:grid-cols-2 py-5">
                  <div className="col-span-1 flex items-center">
                    <img
                      src={
                        product.cart_items[0].product?.product_images?.[0] ||
                        "/default-image.jpg"
                      }
                      alt={product.cart_items[0]?.product?.title || "No Title"}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 text-base font-bold">
                      <p className="text-gray-700">
                        {product.cart_items[0]?.product?.title || "No Title"}
                      </p>
                      <p className="text-gray-600">
                        Quantity: {product.cart_items[0].quantity || 0}
                      </p>
                      <p className="text-gray-600">
                        {product.is_paid ? "Paid" : "Unpaid"}
                      </p>
                      <p className="text-gray-600">
                        Dispatch time: {product.dispatch_time || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Price: $
                        {product.cart_items[0].product?.price?.cents
                          ? (
                              product.cart_items[0].product.price.cents / 100
                            ).toFixed(2)
                          : "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Postage & Packing: {product.postage_packing || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Total: $
                        {product.total_amount?.cents
                          ? (product.total_amount.cents / 100).toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-center items-center">
                    <div className="grid grid-cols-4 gap-2">
                      <button className="text-black px-4 py-1 border rounded hover:border-red-400">
                        Checkout
                      </button>
                      <button
                        className="text-black px-4 py-1 border rounded bg-pink-50 hover:border-red-400"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete Order
                      </button>
                      <button className="text-black px-4 py-2 rounded bg-purple-100 hover:bg-purple-700 font-bold">
                        Leave Feedback
                      </button>
                      <button className="bg-green-100 text-black px-4 py-2 rounded font-bold hover:bg-green-600 flex items-center">
                        <FaCartPlus className="h-6 w-6" />
                        Buy Again
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="p-4 bg-white rounded">
                  <h2 className="text-xl font-bold mb-2">Delivery Location</h2>
                  <p className="text-gray-700">{product?.buyer?.first_name}</p>
                  <p className="text-gray-700">
                    {product?.buyer?.town}, {product?.buyer?.country}
                  </p>
                  <p className="text-gray-700">Bouvet Island</p>
                  <p className="text-gray-700">
                    {product?.buyer?.phone_number}
                  </p>
                  <button className="font-bold hover:text-red-500 cursor-pointer hover:underline">
                    WhatsApp
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default OrderCart;

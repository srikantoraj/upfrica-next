import React from 'react';
import { FaLocationPin } from 'react-icons/fa6'; // Location pin icon
import Link from 'next/link'; // Next.js এর Link কম্পোনেন্ট
import { CiEdit } from 'react-icons/ci'; // Edit icon
import { MdDelete } from 'react-icons/md'; // Delete icon
import { FaCartPlus } from 'react-icons/fa';

const OrderCart = ({ data, handleDelete }) => {
    console.log(data)
    return (
        <div>
            <div className="space-y-4 text-base">
                {data?.map((product, index) => (
                    // চেক করুন প্রোডাক্টে কার্ট আইটেম আছে কিনা
                    product?.cart_items?.length > 0 && (
                        <div
                            key={product.id}
                            className="border border-gray-300 p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* অর্ডার সিরিয়াল নাম্বার, তারিখ এবং টেক্সট */}
                            <div className='text-base'>
                                <p className="text-xl font-bold">
                                    Order #{index + 1}
                                </p>
                                <p className=" text-gray-600">
                                    Order Date: {product.created_at || 'N/A'}
                                </p>
                                <p className=" text-gray-700 font-bold">
                                    Pick up one or more items in shop or at a collection point.
                                </p>
                            </div>

                            {/* হরিজন্টাল লাইন */}
                            <hr className="my-4" />

                            {/* প্রোডাক্ট ডিটেইলস এবং বাটনস */}
                            <div className="grid  md:grid-cols-2 py-5">
                                {/* প্রথম কলাম */}
                                <div className="col-span-1 flex items-center">
                                    <img
                                        src={
                                            product.cart_items[0].product
                                                ?.product_images?.[0] ||
                                            '/default-image.jpg'
                                        }
                                        alt={
                                            product.cart_items[0]?.product?.title ||
                                            'No Title'
                                        }
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="ml-4 text-base font-bold">
                                        <p className=" text-gray-700">
                                            {product.cart_items[0]?.product?.title || 'No Title'}
                                        </p>
                                        <p className=" text-gray-600">
                                            Quantity: {product.cart_items[0].quantity || 0}
                                        </p>
                                        <p className=" text-gray-600">
                                            {product.is_paid ? 'Paid' : 'Unpaid'}
                                        </p>
                                        <p className=" text-gray-600">
                                            Dispatch time: {product.dispatch_time || 'N/A'}
                                        </p>
                                        <p className=" text-gray-600">
                                            Price: ${product.cart_items[0].product?.price?.cents ? (product.cart_items[0].product.price.cents / 100).toFixed(2) : 'N/A'}
                                        </p>
                                        <p className=" text-gray-600">
                                            Postage & Packing: {product.postage_packing || 'N/A'}
                                        </p>
                                        <p className=" text-gray-600">
                                            Total: ${product.total_amount?.cents ? (product.total_amount.cents / 100).toFixed(2) : 'N/A'}
                                        </p>
                                    </div>
                                </div>


                                {/* দ্বিতীয় কলাম */}
                                <div className='col-span-1 flex   justify-center items-center'>
                                    <div className="grid grid-cols-4 gap-2">
                                        <button className=" text-black px-4 py-1 border rounded hover:border-red-400">
                                            Checkout
                                        </button>
                                        <button
                                            className="text-black px-4 py-1 border rounded bg-pink-50 hover:border-red-400"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete Order
                                        </button>
                                        <button className=" text-black px-4 py-2 rounded bg-purple-100 hover:bg-purple-700 font-bold">
                                            Leave Feedback
                                        </button>
                                        <button className="bg-green-100 text-black px-4 py-2 rounded font-bold hover:bg-green-600 flex items-center">
                                            <span><FaCartPlus className='h-6 w-6' /></span>
                                            Buy Again
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* হরিজন্টাল লাইন */}
                            <hr className="my-4" />

                            {/* user detels  */}
                            <div className="p-4 bg-white rounded ">
                                <h2 className="text-xl font-bold mb-2">Delivery Location</h2>
                                <p className="text-gray-700">{product?.buyer?.first_name}</p>
                                <p className="text-gray-700">{product?.buyer?.local_area
                                },{product?.buyer?.town}, {product?.buyer?.country
                                    }</p>
                                <p className="text-gray-700">{product?.buyer?.country
                                    }</p>
                                <p className="text-gray-700">Bouvet Island</p>
                                <p className="text-gray-700">{product?.buyer?.phone_number
                                }</p>
                                <button className="font-bold hover:text-red-500 cursor-pointer hover:underline">WhatsApp</button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default OrderCart;

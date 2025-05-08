"use client"
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import ProductFeatures from "./ProductFeatures";
import RelatedProducts from "./RelatedProducts";

const product = {
    title: "Apple Watch SE Smartwatch (GPS, 40mm)",
    description: [
        "Care Instructions: Hand Wash Only",
        "Fit Type: Regular",
        "Dark Blue Regular Women Jeans",
        "Fabric: 100% Cotton",
    ],
    price: 299,
    oldPrice: 399,
    rating: 4.0,
    colors: ["#000", "#f00", "#0f0", "#00f", "#aaa"],
    sizes: ["Small", "Medium", "Large"],
    images: [
        "https://images.unsplash.com/photo-1611254383609-0e7d4bd5a87d?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1585386954356-1a6c7309f0d9?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1585386958629-1fc26617362b?auto=format&fit=crop&w=400&q=80",
    ],
};

export default function ProductDetail() {
    const [mainImage, setMainImage] = useState(product.images[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("features");

    return (
        <div className="mt-5 bg-gray-50 text-gray-700 space-y-4 ">
            {/* Top section */}
            <div className="flex bg-white shadow-md flex-col lg:flex-row gap-8 p-4">
                {/* Image section */}
                <div className="flex-1">
                    <img
                        src={mainImage}
                        alt="Main"
                        className="w-full h-[600px] object-cover rounded border"
                    />
                    <div className="flex gap-2 mt-4">
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt=""
                                onClick={() => setMainImage(img)}
                                className={`w-16 h-16 rounded border cursor-pointer ${img === mainImage ? "ring-2 ring-blue-500" : ""
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Info section */}
                <div className="flex-1 space-y-4">
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                        In stock
                    </span>
                    <h2 className="text-xl font-semibold">{product.title}</h2>

                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                        <FaStar />
                        <span>{product.rating}</span>/5
                    </div>

                    {/* Offers */}
                    <div>
                        <p className="font-semibold mb-2">Offer</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <label className="border p-3 rounded cursor-pointer">
                                <input type="radio" name="offer" defaultChecked />
                                <p className="font-bold">No Cost EMI</p>
                                <p>Upto ₹2,252 EMI interest savings...</p>
                            </label>
                            <label className="border p-3 rounded cursor-pointer">
                                <input type="radio" name="offer" />
                                <p className="font-bold">Bank Offer</p>
                                <p>Upto ₹1,250.00 discount on select...</p>
                            </label>
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <p className="font-semibold mb-2">About this item</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {product.description.map((desc, i) => (
                                <li key={i}>{desc}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Color */}
                    <div>
                        <p className="font-semibold text-sm">Colors</p>
                        <div className="flex gap-2 mt-1">
                            {product.colors.map((color, i) => (
                                <div
                                    key={i}
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: color }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <p className="font-semibold text-sm">Size</p>
                        <div className="flex gap-2 mt-1">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className="border px-3 py-1 rounded text-sm hover:border-blue-500"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity + Price */}
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border rounded px-2">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                            <span className="px-4">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                            <p className="text-sm line-through text-gray-400">${product.oldPrice}</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-3">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                            Buy Now
                        </button>
                        <button className="border px-6 py-2 rounded">Add to Cart</button>
                    </div>
                </div>
            </div>

            <ProductFeatures />
            <RelatedProducts />
        </div>
    );
}

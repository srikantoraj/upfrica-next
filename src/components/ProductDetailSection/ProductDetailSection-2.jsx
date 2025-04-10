// ✅ Full working hardcoded example with Variations, Specifics, MultiBuy, Description

"use client";

import React, { useEffect, useState } from "react";
import MultiBuySection from "../MultiBuySection";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
import ProductSlider from "./ProductSlider";
import BasketModal from "../BasketModal";
import InfoPopover from "../InfoPopover";

const variations = {
  Color: ["Oak", "Walnut", "White"],
  Size: ["4-Seater", "6-Seater"]
};

const productSpecifics = {
  Material: "Solid Wood",
  Dimensions: "120cm x 80cm x 75cm",
  Brand: "Upfrica Living",
  Finish: "Matte Lacquer",
  Assembly: "Required"
};

export default function ProductDetailSection({ product }) {
  const [selectedColor, setSelectedColor] = useState("Oak");
  const [selectedSize, setSelectedSize] = useState("4-Seater");
  const [quantity, setQuantity] = useState(1);

  const handleAddToBasket = () => {
    alert("Added to basket with " + selectedColor + ", " + selectedSize);
  };

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductSlider images={product?.product_images || []} />

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title || "4-Seater Dining Table Set"}</h1>
          <p className="text-lg text-green-700 font-semibold mb-4">₵{product.price_cents || 1500}</p>

          {/* 🔄 Variations */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Color</label>
              <div className="flex gap-2">
                {variations.Color.map((color) => (
                  <button
                    key={color}
                    className={`px-3 py-1 rounded border ${selectedColor === color ? "bg-gray-800 text-white" : "bg-white"}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Size</label>
              <div className="flex gap-2">
                {variations.Size.map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1 rounded border ${selectedSize === size ? "bg-gray-800 text-white" : "bg-white"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🛍️ Quantity + Cart */}
          <div className="flex items-center mb-6 gap-4">
            <div className="flex items-center border rounded">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1">
                <FaMinus />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1">
                <FaPlus />
              </button>
            </div>
          </div>

          {/* ✅ Buttons Section */}
          <div className="grid gap-2 mb-6">
            <button className="btn-base btn-primary w-full">Buy Now</button>
            <button onClick={handleAddToBasket} className="btn-base btn-outline w-full">Add to Basket</button>
            <button className="btn-base btn-outline w-full">Buy Now Pay Later (BNPL)</button>
            <button className="btn-base btn-outline w-full flex items-center justify-center gap-2">
              <FaRegHeart /> Add to Wishlist
            </button>
          </div>

          {/* 🤑 Multi-buy */}
          <div className="bg-green-50 p-4 rounded text-sm text-green-800 border border-green-200 mb-6">
            📦 Multi-Buy Offer: Buy 2+ for ₵1450 each, 5+ for ₵1400
          </div>

          <PaymentDeliveryReturns />

          {/* 📋 Product Specifics */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Product Details</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              {Object.entries(productSpecifics).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>

          {/* 📝 Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-700">
              This 4-seater dining set brings warmth and elegance to any home. Crafted from solid wood with a matte lacquer finish. Easy to assemble.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
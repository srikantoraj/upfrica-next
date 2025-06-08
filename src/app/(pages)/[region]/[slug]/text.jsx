"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MessageCircle, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ProductPage() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [showBasketBadge, setShowBasketBadge] = useState(true);
  const [showStickyBuy, setShowStickyBuy] = useState(false);
  const actionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBasketBadge(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBuy(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (actionRef.current) observer.observe(actionRef.current);
    return () => observer.disconnect();
  }, []);

  const product = {
    name: "Bluetooth Speaker",
    price: 35.0,
    rating: 4.2,
    reviews: 1830,
    discount: "15% OFF",
    seller: "TechZone",
    purchasedCount: 1123,
    inBaskets: 3,
    recentSales: 12,
    brand: "BoomAudio",
    sku: "BT-SPK-001",
    condition: "New",
    availability: "In Stock – Ships within 24hrs",
    location: "Accra, Ghana",
    warranty: "1-year warranty",
    returnPolicy: "7-day return accepted",
    deliveryEstimate: "Delivery within 1–3 days in major cities",
    description:
      "High-quality portable Bluetooth speaker with powerful sound, durable design, and 10-hour battery life. Includes USB-C cable and warranty card.",
    images: [
      "https://d3q0odwafjkyv1.cloudfront.net/44a4795d9ee84761b06d3ed5a1f0b1c3_OIP.jpeg",
      "https://d3q0odwafjkyv1.cloudfront.net/db5688e235f04db1b8776e5c8df79911_th%20(1).jpeg",
      "https://d3q0odwafjkyv1.cloudfront.net/6771370f123d4294b8ca0cf023122466_th.jpeg",
    ],
  };

  return (
    <>
      <div className="container mx-auto px-4 md:flex md:gap-6 md:mt-10">
        {/* Left side images */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={product.images[currentImage]}
              alt={product.name}
              fill
              className="object-cover w-full h-full transition-all duration-300"
            />
            <button
              onClick={() => router.back()}
              className="absolute top-3 left-3 bg-white p-1 rounded-full shadow z-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75L8.25 12l7.5 5.25" />
              </svg>
            </button>
            {product.inBaskets > 0 && showBasketBadge && (
              <span className="absolute top-11 left-3 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                IN {product.inBaskets} BASKETS
              </span>
            )}
            <span className="absolute top-3 right-3 bg-white text-xs font-semibold text-gray-800 px-2 py-1 rounded shadow-sm">
              {product.discount}
            </span>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentImage ? "bg-black" : "bg-gray-300"}`}
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              {currentImage + 1} / {product.images.length}
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div className="w-full md:w-1/2 space-y-6 p-4">
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">{product.name}</h1>
          <div className="text-xl font-bold text-gray-900 leading-snug">${product.price.toFixed(2)}</div>
          <div className="flex items-center gap-[2px] text-yellow-500 text-sm leading-tight">
            {[...Array(Math.floor(product.rating))].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
            ))}
            {[...Array(5 - Math.floor(product.rating))].map((_, i) => (
              <Star key={i} size={14} className="text-gray-300" strokeWidth={0} />
            ))}
            <span className="ml-2 text-gray-600">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border space-y-1">
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Condition:</strong> {product.condition}</p>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Availability:</strong> {product.availability}</p>
            <p><strong>Location:</strong> {product.location}</p>
          </div>

          <div ref={actionRef} className="space-y-3">
            <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-full shadow">
              Buy Now
            </button>
            <button className="w-full border border-yellow-400 text-gray-900 font-medium py-2.5 rounded-full">
              Add to Basket
            </button>
            <button className="w-full border border-yellow-400 text-gray-900 font-medium py-2.5 rounded-full flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-purple-600 fill-current" />
              Remove from Watchlist
            </button>
          </div>

          <div className="text-sm mt-2">
            <p className="text-gray-700">✓ {product.warranty}</p>
            <p className="text-gray-700">✓ Free shipping</p>
            <p className="text-gray-700">Sold by <strong>{product.seller}</strong> <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">✔ Verified Seller</span></p>
          </div>
        </div>
      </div>

      {/* Sticky Buy Now for Mobile */}
      {showStickyBuy && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t p-3 z-50 md:hidden">
          <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-none">
            Buy Now
          </button>
        </div>
      )}
    </>
  );
}

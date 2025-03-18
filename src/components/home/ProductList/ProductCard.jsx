'use client';
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt, FaHeart } from "react-icons/fa";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { product_images, title, price_cents, slug } = product;
  if (!product_images) return null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between h-[370px] font-sans">
      {/* Image Section */}
      <div className="relative w-full h-[230px]">
        {product_images.length > 0 && (
          <Link href={`/gh/others/${slug}/`}>
            {/* Wrapping with an anchor tag for accessibility */}
            <span className="block relative w-full h-full">
              <Image
                src={product_images[0]}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </span>
          </Link>
        )}

        {/* Favorite Icon */}
        <div className="absolute top-2 right-2 bg-gray-100 border p-2 rounded-full">
          <FaHeart className="w-6 h-6 text-gray-600" />
        </div>

        {/* Sales Badge */}
        <div className="absolute bottom-2 left-2">
          <button className="bg-red-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
            <FaBolt className="w-4 h-4" />
            Sales
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900 truncate w-full overflow-hidden">
          {title}
        </h2>
        <p className="text-sm text-gray-500">1083+ sold recently</p>
      </div>

      {/* Price & Cart Section */}
      <div className="border-t">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">
              ${parseInt(price_cents, 10) / 100}
            </p>
            <p className="text-sm text-gray-500 line-through">
              ${"0.00"}
            </p>
          </div>
          <Link href={`/gh/others/${slug}/`}>
           
              <div className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
              </div>
          
          </Link>
        </div>
      </div>
    </div>
  );
}

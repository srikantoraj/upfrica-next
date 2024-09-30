'use client'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import Link from "next/link"; 



export default function ProductCard({ product }) {
  const { product_images, id, title, price } = product;
  if (!product_images) return null;

  return (
    <div className="border rounded-lg shadow-lg relative flex flex-col justify-between">
      {/* Card Image Section */}
      <div >
        <div className="relative" >
          {product_images.length > 0 && (
            <Link href={`/details/${id}`} >
              <img
                src={product_images[0]} 
                alt="Product"
                className="w-full h-72 object-cover rounded-lg"
              />
            </Link>
          )}

          {/* Heart Icon at the top-right */}
          <div className="absolute top-2 right-2 border p-2 rounded-full bg-slate-100">
            <FaHeart className="h-6 w-6" />
          </div>

          {/* Sales Button at the bottom-left */}
          <div className="absolute bottom-2 left-2">
            <button className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm">
              Sales
            </button>
          </div>
        </div>

        <div className="px-4">
          {/* Title Section */}
          <div className="mt-4">
            <h2 className="text-base font-bold text-gray-800">
              {title.length > 30 ? `${title.substring(0, 15)}...` : title}
            </h2>
          </div>
        </div>
      </div>
      <div>
        <hr className="my-2 mx-4" />
        <div className="flex justify-between items-center p-4">
          <p className="text-lg font-semibold text-gray-700">${price.cents}</p>
          <span className="border-2 rounded">
            <AiOutlineShoppingCart className="h-6 w-6 text-purple-500 bg-slate-200 m-1" />
          </span>
        </div>
      </div>
    </div>
  );
}

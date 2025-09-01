// components/ProductCard.jsx
import { FaStar, FaRegHeart, FaRegEye } from "react-icons/fa";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 hover:shadow-md transition duration-200 overflow-hidden">
      {/* Image + wishlist icon */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[240px] object-contain p-4"
        />
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
          <FaRegHeart />
        </button>
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Title + Price + Rating */}
      <div className="px-4 py-2">
        <h3 className="text-sm text-gray-700 mb-1">{product.title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-800">
            ${product.price.toFixed(2)}
          </span>
          <span className="line-through text-sm text-gray-400">
            ${product.oldPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center text-sm text-yellow-500 mt-1">
          <FaStar className="mr-1" /> {product.rating} / 5
        </div>
      </div>

      {/* Footer buttons */}
      <div className="px-4 pb-4 pt-2 flex items-center justify-between">
        <button className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded hover:bg-gray-100 transition">
          <FaRegEye />
        </button>
        <button className="flex-1 ml-3 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition">
          Add to cart
        </button>
      </div>
    </div>
  );
}

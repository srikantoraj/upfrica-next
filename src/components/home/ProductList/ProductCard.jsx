
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt, FaHeart } from "react-icons/fa";
import Link from "next/link";



export default function ProductCard({ product }) {
  // console.log(product)
  const { product_images, id, title, price, secondary_postage_fee
  } = product;
  if (!product_images) return null;

  return (
    <div className="shadow-md bg-white rounded-lg  relative flex flex-col justify-between w-full h-[500px]">
      {/* Card Image Section */}
      <div >
        <div className="relative overflow-hidden">
          {product_images.length > 0 && (
            <Link href={`/details/${id}`}>
              <img
                src={product_images[0]}
                alt="Product"
                className="h-[350px] w-full object-cover rounded-lg transform transition-all duration-1000 ease-in-out hover:scale-110 hover:translate-y-[-2px]"
              />
            </Link>
          )}

          {/* Heart Icon at the top-right */}
          <div className="absolute top-2 right-2 border p-2 rounded-full bg-slate-100">
            <FaHeart className="h-6 w-6" />
          </div>

          {/* Sales Button at the bottom-left */}
          <div className="absolute bottom-2 left-2">
            <button className="bg-[#d6293e] text-white px-3 py-1 rounded-full text-base flex gap-1 items-center">
              <span><FaBolt /></span>
              Sales
            </button>
          </div>
        </div>





        <div className="px-4">
          {/* Title Section */}
          <div className="mt-4 text-base lg:text-lg ">
            <h2 className=" text-gray-800">
              {title.length > 30 ? `${title.substring(0, 20)}...` : title}
            </h2>
            <p className="text-purple-500">1083 + sold recently</p>
          </div>
        </div>
      </div>
      <div>
        <hr className="" />
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-1 items-center">

            <p className="text-lg font-bold text-gray-700">${price.cents}</p>
            <p className="text-lg  text-gray-700 line-through">${secondary_postage_fee
              .cents}</p>

          </div>
          <span className="border-2 rounded">
            <AiOutlineShoppingCart className="h-6 w-6 text-purple-500 bg-slate-200 m-1" />
          </span>
        </div>
      </div>
    </div>
  );
}

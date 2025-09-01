"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchName = () => {
  const params = useParams();
  const { name } = params;
  console.log(name);

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      const fetchCategoryData = async () => {
        try {
          const response = await fetch(
            `https://upfrica-staging.herokuapp.com/api/v1/products?q=${name}`,
          );
          const data = await response.json();
          setCategoryData(data.products);
        } catch (error) {
          console.error("Error fetching category data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryData();
    }
  }, [name]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!categoryData || categoryData.length === 0) {
    return <p className="h-screen text-center">No data found for "{name}"</p>;
  }

  console.log(categoryData);

  return (
    <div
      className={`grid lg:grid-cols-4 gap-10 container mx-auto py-5 ${categoryData.length <= 2 ? "h-screen" : "h-auto"}`}
    >
      <div className="col-span-1 hidden lg:flex bg-white shadow-xl p-10 rounded h-[200px]">
        <div>
          <h1 className="text-xl font-bold mb-4">Price Filter</h1>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                name="min-price"
                id="min-price"
                placeholder="Max"
                className="border border-gray-300 px-3 py-2 rounded-md w-14 lg:w-24"
              />
              <input
                type="text"
                name="max-price"
                id="max-price"
                placeholder="Min"
                className="border border-gray-300 px-3 py-2 rounded-md w-24"
              />
              <button className="px-4 py-2 border rounded-xl">Go</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3">
        <h1 className="text-2xl font-bold tracking-wide pb-4">
          Speakers & Accessories in Ghana for sale
        </h1>
        {/* catagore detels card  */}
        <div className="grid grid-cols-1 gap-6 px-2">
          {categoryData.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 p-4 flex items-center space-x-6"
            >
              <div className="w-full sm:w-1/4">
                <Link href={`/details/${product.id}`}>
                  <img
                    src={
                      product.product_images &&
                      product.product_images.length > 0
                        ? product.product_images[0]
                        : "fallback-image-url.jpg"
                    }
                    alt={product.title}
                    className="w-full h-52 lg:h-72 object-center rounded-md"
                  />
                </Link>
              </div>
              <div className="w-full sm:w-3/4 space-y-2">
                <h2 className="text-xl font-bold">{product.title}</h2>
                <p
                  className={`text-base ${product.brandNew ? "text-green-500" : "text-red-500"}`}
                >
                  {product.brandNew ? "Brand New" : "Used"}
                </p>
                <p className="text-xl md:text-2xl font-bold ">
                  ${product.price.cents}
                </p>
                {product.oldPrice && (
                  <p className="text-base text-gray-500 line-through">
                    {product.oldPrice}
                  </p>
                )}
                <p className="text-base font-bold">Buy it now</p>
                <p className="text-base">Delivery: {product?.deliveryPrice}</p>
                <p className="text-sm">
                  Estimated Delivery: {product?.deliveryDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchName;

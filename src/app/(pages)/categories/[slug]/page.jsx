"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Loader = () => <div className="text-center py-5">Loading...</div>;

const PriceFilter = () => (
  <div className="col-span-1 hidden lg:flex bg-white shadow-xl p-6 rounded h-[200px]">
    <div>
      <h1 className="text-xl font-bold mb-4">Price Filter</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            name="min-price"
            id="min-price"
            placeholder="Min"
            className="border border-gray-300 px-3 py-2 rounded-md w-20"
          />
          <input
            type="text"
            name="max-price"
            id="max-price"
            placeholder="Max"
            className="border border-gray-300 px-3 py-2 rounded-md w-20"
          />
          <button className="px-4 py-2 border rounded-xl bg-blue-500 text-white">
            Go
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const fallbackImage = "fallback-image-url.jpg";

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 p-4 flex items-center space-x-6">
      {/* Image Section */}
      <div className="w-1/4">
        <Link href={`/details/${product.id}`}>
          <img
            src={product.product_images?.[0] || fallbackImage}
            alt={product.title}
            className="w-full h-52 lg:h-72 object-cover rounded-md"
          />
        </Link>
      </div>
      {/* Text Section */}
      <div className="w-3/4 space-y-2">
        <h2 className="text-xl font-bold">{product.title}</h2>
        <p className={`text-base ${product.brandNew ? "text-green-500" : "text-red-500"}`}>
          {product.brandNew ? "Brand New" : "Used"}
        </p>
        <p className="text-xl md:text-2xl font-bold">${product.price.cents / 100}</p>
        {product.oldPrice && (
          <p className="text-base text-gray-500 line-through">${product.oldPrice}</p>
        )}
        <p className="text-base font-semibold">Buy it now</p>
        <p className="text-base">Delivery: ${product.deliveryPrice}</p>
        <p className="text-sm">Estimated Delivery: {product.deliveryDate}</p>
      </div>
    </div>
  );
};

const DetelsCategories = () => {
  const { slug } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchCategoryData = async () => {
        try {
          const response = await fetch(`https://upfrica-staging.herokuapp.com/api/v1/categories/${slug}/products`);
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
  }, [slug]);

  if (loading) return <Loader />;
  if (!categoryData) return <p>No data found for {slug}</p>;

  return (
    <div className={`container mx-auto py-5 ${categoryData.length <= 2 ? 'h-screen' : 'h-auto'}`}>
      <div className="grid lg:grid-cols-4 gap-10">
        <PriceFilter />
        <div className="col-span-3">
          <h1 className="text-2xl font-bold tracking-wide pb-4">
            Speakers & Accessories in Ghana for sale
          </h1>
          <div className="grid grid-cols-1 gap-6 px-2">
            {categoryData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetelsCategories;

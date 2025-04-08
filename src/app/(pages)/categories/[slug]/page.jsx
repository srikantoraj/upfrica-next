

"use client"
import AmazonLeftFilter from '@/components/priceFiter/AmazonLeftFilter';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SkeletonLoader = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg overflow-hidden border p-4 flex items-center space-x-6">
    <div className="w-1/4 h-52 bg-gray-300 rounded-md"></div>
    <div className="w-3/4 space-y-2">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);



const ProductCard = ({ product }) => {
  const fallbackImage = "fallback-image-url.jpg";

  return (
    <div className="
      bg-white 
      overflow-hidden  
      flex 
      flex-col md:flex-row  /* Stacks on mobile, row on md+ screens */
      items-start md:items-center
      gap-4  /* Replace space-x / space-y with a single gap for better responsiveness */
    ">
      {/* Image Section */}
      <div className="w-full lg:w-[300px]">
        <Link href={`/details/${product.id}`}>
          <img
            src={product.product_images?.[0] || fallbackImage}
            alt={product.title}
            className=" object-cove w-full h-[250px]"
          />
        </Link>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-2/4 space-y-2">
        <h2 className="
  text-xl 
  font-bold 
  truncate
  overflow-hidden 
  whitespace-nowrap
  w-full 
  max-w-4xl
"
        >
          {product.title}
        </h2>

        <p
          className={`text-base ${product.brandNew ? "text-green-500" : "text-red-500"
            }`}
        >
          {product.brandNew ? "Brand New" : "Used"}
        </p>
        <p className="text-xl md:text-2xl font-bold">
          ${product.price.cents / 100}
        </p>
        {product.oldPrice && (
          <p className="text-base text-gray-500 line-through">
            ${product.oldPrice}
          </p>
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
          const response = await fetch(`https://upfrica.com/api/v1/categories/${slug}/products`);
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

  return (
    <div className={` ${loading ? 'h-screen' : 'h-auto'}`}>
      <div className="grid lg:grid-cols-7 gap-10">
        {/* <PriceFilter /> */}
        <div className='col-span-2  hidden lg:block'>
          <AmazonLeftFilter />
        </div>
        <div className="col-span-5 p-4">
          <h1 className="text-2xl font-semibold tracking-wide pb-4">
            Speakers & Accessories in Ghana for sale
          </h1>
          <div className="grid grid-cols-1 space-y-8 ">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <SkeletonLoader key={index} />)
              : categoryData.map((product) => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetelsCategories;


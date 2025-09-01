"use client";
import AmazonLeftFilter from "@/components/priceFiter/LeftFilter";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/home/ProductList/ProductCard";

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

const DetelsCategories = () => {
  const { slug } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchCategoryData = async () => {
        try {
          const response = await fetch(
            `https://media.upfrica.com/api/categories/${slug}/products/`,
          );
          const data = await response.json();
          setCategoryData(data.results || []);
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
    <div className={` ${loading ? "h-screen" : "h-auto"}`}>
      <div className="grid lg:grid-cols-7 gap-10">
        {/* <PriceFilter /> */}
        <div className="col-span-2  hidden lg:block">
          <AmazonLeftFilter />
        </div>
        <div className="col-span-5 p-4">
          <h1 className="text-2xl font-semibold tracking-wide pb-4">
            Speakers & Accessories in Ghana for sale
          </h1>
          <div className="grid grid-cols-1 space-y-8 ">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonLoader key={index} />
                ))
              : categoryData.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetelsCategories;

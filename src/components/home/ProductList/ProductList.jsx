// src/components/home/Products.tsx
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductCard from "./ProductCard"; // Ensure correct casing based on your file system
import React from "react";



export default async function ProductList() {
    const res = await fetch("https://upfrica-staging.herokuapp.com/api/v1/products", {
      next: { revalidate: 120 }, // Revalidate every 2 minutes
    });

     const products = await res.json();
 

  return (
    <div className="container  mx-auto px-4 py-10 bg-white ">
      <div className="flex gap-10 items-center ">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
          Lightening Deals
        </h1>
        <IoIosArrowRoundForward className="h-14 w-14 pt-4 text-gray-700" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-2">
        {products?.products && products.products.length > 0 && products.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}


// Fetch product data at build time
export async function getStaticProps() {
  const res = await fetch("https://upfrica-staging.herokuapp.com/api/v1/products");
  const products = await res.json();

  return {
    props: {
      products: products.products || [], // Pass products to the component
    },
    revalidate: 120, // Revalidate the page every 2 minutes
  };
}
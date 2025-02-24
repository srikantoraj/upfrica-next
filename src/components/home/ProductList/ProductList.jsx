'use client'
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductCard from "./ProductCard"; // Ensure correct casing based on your file system

export default async function ProductList({ title }) {
  const res = await fetch("https://upfrica-staging.herokuapp.com/api/v1/products", {
    next: { revalidate: 120 }, // Revalidate every 2 minutes
  });

  if (!res.ok) {
    console.error("HTTP error:", res.status);
    const errorText = await res.text();
    console.error("Error details:", errorText);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold text-red-600">Error fetching products</h1>
        <p className="text-base">Status Code: {res.status}</p>
        <pre className="text-sm bg-gray-100 p-2">{errorText}</pre>
      </div>
    );
  }

  const text = await res.text();

  let productsData;
  try {
    productsData = JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold text-red-600">Error parsing product data</h1>
        <p className="text-base">{error.message}</p>
      </div>
    );
  }

  return (
    <div className=" mx-auto bg-white p-5 md:py-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 pb-4">
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 tracking-wide">
            Trending in <br className="hidden lg:inline" /> Machines Today
          </h1>
          <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
        </div>
        <p className="text-xl font-normal text-gray-500">All with Free Delivery</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2">
        {productsData?.products && productsData.products.length > 0 ? (
          productsData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}

'use client'
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductCard from "./ProductCard"; // Ensure correct casing based on your file system


export default async function ProductList() {
 
    const res = await fetch("https://upfrica-staging.herokuapp.com/api/v1/products", {
      next: { revalidate: 120 }, // Revalidate every 2 minutes
    });

    // HTTP স্ট্যাটাস কোড চেক করুন
    if (!res.ok) {
      console.error("HTTP error:", res.status);
      const errorText = await res.text();
      console.error("Error details:", errorText);
      return (
        <div>
          <h1>Error fetching products</h1>
          <p>Status Code: {res.status}</p>
          <pre>{errorText}</pre>
        </div>
      );
    }

    // রেসপন্স টেক্সট হিসেবে পড়ুন
    const text = await res.text();
    // console.log("Response Text:", text);

    let productsData;
    try {
      productsData = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return (
        <div>
          <h1>Error parsing product data</h1>
          <p>{error.message}</p>
        </div>
      );
    }

    // console.log(data)

  return (
    <div className="container mx-auto md:py-10 bg-white p-5">
      <div className='text-base md:text-3xl font-extrabold tracking-wide'>
                <span className="flex gap-10 items-center pb-4">
                    <h1 className="">Trending in <br className="hidden lg:inline" /> Machines Today</h1>
                    <IoIosArrowRoundForward className="h-10 w-10  text-gray-700" />
                </span>
                <p className=" text-gray-400 text-xl font-normal">All with Free Delivery</p>
            </div>

      {/* ফেচ করা ডেটা UI তে প্রদর্শন */}
      {/* <pre>{JSON.stringify(productsData, null, 2)}</pre> */}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-5 py-0 md:py-10  space-y-2">
        {productsData?.products &&
          productsData.products.length > 0 &&
          productsData.products.map((product) => (
            
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

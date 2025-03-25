// import React from 'react';
// import ProductCard from './home/ProductList/ProductCard';

// const SellectedItem = async () => {
//   try {
//     const res = await fetch("https://media.upfrica.com/api/product-list/trending-machines/", {
//       next: { revalidate: 120 }, // Revalidate every 2 minutes
//     });

//     // Handle HTTP errors
//     if (!res.ok) {
//       console.error("HTTP error:", res.status);
//       const errorText = await res.text();
//       console.error("Error details:", errorText);
//       return (
//         <div className="container mx-auto px-6 py-12 text-center">
//           <h1 className="text-2xl font-bold text-red-600">Error fetching products</h1>
//           <p className="text-gray-700">Status Code: {res.status}</p>
//           <pre className="bg-gray-100 p-4 rounded-md text-gray-600">{errorText}</pre>
//         </div>
//       );
//     }

//     // Parse JSON response
//     const text = await res.text();
//     console.log("text product",text);

//     let productsData;
//     try {
//       productsData = JSON.parse(text);
//     } catch (error) {
//       console.error("Error parsing JSON:", error);
//       return (
//         <div className="container mx-auto px-6 py-12 text-center">
//           <h1 className="text-2xl font-bold text-red-600">Error parsing product data</h1>
//           <p className="text-gray-700">{error.message}</p>
//         </div>
//       );
//     }

//     // Handle case where there are no products
//     // if (!productsData?.products || productsData.products.length === 0) {
//     //   return (
//     //     <div className="container mx-auto px-6 py-12 text-center">
//     //       <h1 className="text-2xl font-bold text-gray-900">Selected for you</h1>
//     //       <p className="text-gray-600">No products available at the moment.</p>
//     //     </div>
//     //   );
//     // }

//     return (
//       <div className="container mx-auto px-6 py-12 bg-white rounded-lg">
//         {/* Section Title */}
//         <div className="mb-6">
//           <h1 className="text-xl md:text-3xl font-extrabold tracking-wide text-gray-900">
//             Selected for You
//           </h1>
//         </div>

//         {/* Product Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
//           {productsData.products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return (
//       <div className="container mx-auto px-6 py-12 text-center">
//         <h1 className="text-2xl font-bold text-red-600">Unexpected Error</h1>
//         <p className="text-gray-700">{error.message}</p>
//       </div>
//     );
//   }
// };

// export default SellectedItem;


import React from 'react';
import ProductCard from './home/ProductList/ProductCard';
import { IoIosArrowRoundForward } from 'react-icons/io';

const SellectedItem = async () => {
  try {
    const res = await fetch("https://media.upfrica.com/api/product-list/trending-machines/", {
      next: { revalidate: 120 }, // Revalidate every 2 minutes
    });

    // Handle HTTP errors
    if (!res.ok) {
      console.error("HTTP error:", res.status);
      const errorText = await res.text();
      console.error("Error details:", errorText);
      return (
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error fetching products</h1>
          <p className="text-gray-700">Status Code: {res.status}</p>
          <pre className="bg-gray-100 p-4 rounded-md text-gray-600">{errorText}</pre>
        </div>
      );
    }

    // Parse JSON response
    const text = await res.text();
    // console.log("text product", text);

    let productsData;
    try {
      productsData = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return (
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error parsing product data</h1>
          <p className="text-gray-700">{error.message}</p>
        </div>
      );
    }

    // Handle case where there are no products in results
    if (!productsData?.results || productsData.results.length === 0) {
      return (
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Selected for You</h1>
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-6 py-12 bg-white rounded-lg">
        {/* Section Title */}
        {/* <div className="mb-6">
          <h1 className="text-xl md:text-3xl font-extrabold tracking-wide text-gray-900">
            Selected for You
          </h1>
        </div> */}

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

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {productsData.results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Unexpected Error</h1>
        <p className="text-gray-700">{error.message}</p>
      </div>
    );
  }
};

export default SellectedItem;


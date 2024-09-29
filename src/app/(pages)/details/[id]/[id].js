// import { useRouter } from "next/router";
// import React from "react";

// export default function ProductDetails({ product }) {
//   const router = useRouter();

//   // Handle fallback pages
//   if (router.isFallback) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-10 bg-white">
//       <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
//         {product.name}
//       </h1>
//       <img src={product.image} alt={product.name} className="w-full h-auto" />
//       <p>{product.description}</p>
//       <p className="text-lg font-semibold">Price: {product.price} USD</p>
//     </div>
//   );
// }

// // Pre-generate paths based on product IDs
// export async function getStaticPaths() {
//   // Fetch the list of products to generate static paths
//   const res = await fetch("https://upfrica-staging.herokuapp.com/api/v1/products");
//   const products = await res.json();

//   // Create paths for each product based on the ID
//   const paths = products.products.map((product) => ({
//     params: { id: product.id.toString() }, // Convert id to string
//   }));

//   return {
//     paths,
//     fallback: true, // Enable fallback for pages not generated at build time
//   };
// }

// // Fetch individual product data at build time
// export async function getStaticProps({ params }) {
//   const { id } = params;

//   // Fetch the specific product by ID
//   const res = await fetch(
//     `https://upfrica-staging.herokuapp.com/api/v1/products/${id}`
//   );
//   const product = await res.json();

//   // If the product is not found, return a 404 status
//   if (!product) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       product, // Pass product data to the component
//     },
//     revalidate: 120, // Revalidate the product page every 2 minutes
//   };
// }

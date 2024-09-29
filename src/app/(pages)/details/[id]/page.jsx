// app/details/[id]/page.jsx

import React from 'react';

// Fetch product data based on ID
async function getProductData(id) {
  const res = await fetch(`https://upfrica-staging.herokuapp.com/api/v1/products/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch product data');
  }

  const product = await res.json();
  return product;
}

// Pre-render paths for specific products at build time
export async function generateStaticParams() {
  const res = await fetch('https://upfrica-staging.herokuapp.com/api/v1/products');
  const products = await res.json();

  return products.products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductDetails({ params }) {
  // Get the product ID from the params
  const { id } = params;

  // Fetch product data using the ID
  const product = await getProductData(id);

  return (
    <div className="container mx-auto px-4 py-10 bg-white">
      <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
        {product.title}
      </h1>
      {/* <img src={product.image} alt={product.name} className="w-full h-auto" /> */}
      {/* <p>{product.description}</p> */}
      {/* <p className="text-lg font-semibold">Price: {product.price} USD</p> */}
    </div>
  );
}

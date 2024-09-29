
import React from 'react';
import Head from "next/head";

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
  const { id } = params;
  const product = await getProductData(id);

    return (
      <>
        <Head>
        <title>{product.title} - Product Details</title>
        <meta name="description" content={product.description} />
        </Head>
            
    <div className="container mx-auto px-4 py-10 bg-white">
      <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
                    {product.title}
                    {product?.description?.body}
      </h1>

    </div>
      </>
   
  );
}

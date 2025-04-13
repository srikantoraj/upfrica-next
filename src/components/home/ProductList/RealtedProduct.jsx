"use client";
import React, { useState, useEffect } from "react";
import RelatedProductCard from "./RelatedProductCard";
import RelatedProductCardSkeleton from "./RelatedProductCardSkeleton"; // Import the skeleton component

const FetchProductData = ({ productSlug }) => {
  const [products, setProducts] = useState([]); // renamed for clarity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `https://media.upfrica.com/api/products/${productSlug}/related/`;
    console.log(url);

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result?.results);
        setProducts(result?.results || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        setError(error);
        setLoading(false);
      });
  }, [productSlug]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 py-10 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <RelatedProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p>Error fetching product details: {error.message}</p>;
  }

  if (!products.length) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 py-10 gap-4">
      {products.map((product) => (
        <RelatedProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default FetchProductData;

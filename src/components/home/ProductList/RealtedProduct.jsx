"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const FetchProductData = ({productId}) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `https://upfrica-staging.herokuapp.com/api/v1/products/${productId}?currency=usd,gbp`;

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
        console.log(result)
        setProduct(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  console.log(product)

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>Error fetching product details: {error.message}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  // Render specific product details
  return (
    <div className="grid md:grid-cols-4 py-10">
      <ProductCard product={product}/>
      {/* <h1>realated data</h1> */}
    </div>
  );
};

export default FetchProductData;

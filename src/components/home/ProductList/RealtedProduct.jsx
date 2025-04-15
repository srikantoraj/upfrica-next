"use client";
import React, { useState, useEffect } from "react";
import RelatedProductCard from "./RelatedProductCard";
import RelatedProductCardSkeleton from "./RelatedProductCardSkeleton";
import ProductCard from "./ProductCard";

const FetchProductData = ({ productSlug, productTitle, location = "Ghana" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Truncate product title for SEO heading
  const truncateTitle = (str, max = 50) => {
    if (!str || typeof str !== "string") return "";
    if (str.length <= max) return str;
    const truncated = str.slice(0, max);
    return truncated.slice(0, truncated.lastIndexOf(" ")) + "…";
  };

  const seoTitle = truncateTitle(productTitle);

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
      <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 py-10 gap-4">
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
    return <p>No related items found.</p>;
  }

  return (
    <div className="py-10">
      <h3 className="text-lg md:text-lg lg:text-xl font-medium border-b pb-2 mb-4">
        Items related to this {seoTitle} and their Price in {location} –{" "}
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          See more
        </a>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6  gap-3 lg:gap-5">
        {products.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
          // <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FetchProductData;
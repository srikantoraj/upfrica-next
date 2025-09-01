"use client";
import { useState } from "react";

import Product from "./Product";
import ProductFilterBar from "./ProductFilterBar";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("high");

  return (
    <div className="pt-5">
      <ProductFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Optional: You can pass filtered/sorted products to grid */}
      <Product />
    </div>
  );
}

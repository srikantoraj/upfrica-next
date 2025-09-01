"use client";
import React, { useState } from "react";
import VariantGroup from "./VariantGroup";

const ProductVariantForm = () => {
  const [variants, setVariants] = useState([
    {
      label: "Package",
      active: true,
      useImageVariant: false,
      options: [
        {
          value: "With Battery",
          additionalPrice: "0.00",
          active: true,
          images: [],
        },
        {
          value: "With Battery & Solar Panels",
          additionalPrice: "599.00",
          active: true,
          images: [],
        },
      ],
    },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        label: "",
        active: true,
        useImageVariant: false,
        options: [],
      },
    ]);
  };

  const updateVariant = (index, data) => {
    const updated = [...variants];
    updated[index] = data;
    setVariants(updated);
  };

  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting...", variants);
    // Do your POST logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Product Variants</h2>

      {variants.map((variant, idx) => (
        <VariantGroup
          key={idx}
          index={idx}
          data={variant}
          onChange={(data) => updateVariant(idx, data)}
          onRemove={() => removeVariant(idx)}
        />
      ))}

      <button
        type="button"
        onClick={addVariant}
        className="mt-4 text-sm bg-gray-100 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200"
      >
        ➕ Add Variant
      </button>

      <div className="mt-8 pt-4 border-t flex justify-between">
        <button
          type="submit"
          className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
        <a href="/products" className="text-gray-600 hover:underline">
          Back
        </a>
      </div>
    </form>
  );
};

export default ProductVariantForm;

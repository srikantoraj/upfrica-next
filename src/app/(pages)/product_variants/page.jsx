"use client";
import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

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

  const handleVariantChange = (index, updatedVariant) => {
    const newVariants = [...variants];
    newVariants[index] = updatedVariant;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

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

  const addOption = (variantIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push({
      value: "",
      additionalPrice: "0.00",
      active: true,
      images: [],
    });
    setVariants(newVariants);
  };

  const handleOptionChange = (variantIndex, optionIndex, updatedOption) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options[optionIndex] = updatedOption;
    setVariants(newVariants);
  };

  const handleRemoveOption = (variantIndex, optionIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setVariants(newVariants);
  };

  const handleSubmit = () => {
    console.log("Submitted Variants:", variants);
  };

  return (
    <div className="container mx-auto px-4 pb-24 relative">
      {/* Product Info */}
      <div className="my-8">
        <div>
          <strong className="text-lg text-gray-800 block">
            Sliding Gate Opener Electric/Battery and Solar | Sliding Gate Opener
            Kit 12v DC 1200kg Heavy Duty Security Gate Operator set
          </strong>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="text-base font-semibold text-gray-700">
            Current price:
          </span>
          <span className="font-bold text-green-700 text-lg">$7,900.00</span>
          <span className="line-through text-gray-500">$8,600.00</span>
          <span className="text-sm font-semibold text-red-500">8% off</span>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-gray-800 mb-4">Product Variants</h3>

      {variants.map((variant, i) => (
        <div
          key={i}
          className="border border-gray-300 rounded-lg mb-8 shadow-sm bg-white"
        >
          <div className="bg-gray-100 px-4 py-3 flex flex-wrap md:flex-nowrap md:items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Attribute Name (e.g. Colour, Size)
              </label>
              <input
                type="text"
                value={variant.label}
                onChange={(e) =>
                  handleVariantChange(i, {
                    ...variant,
                    label: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. Color"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={variant.active}
                onChange={(e) =>
                  handleVariantChange(i, {
                    ...variant,
                    active: e.target.checked,
                  })
                }
              />
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={variant.useImageVariant}
                onChange={(e) =>
                  handleVariantChange(i, {
                    ...variant,
                    useImageVariant: e.target.checked,
                  })
                }
              />
              <span className="text-sm">Use image variant</span>
            </div>
            <button
              onClick={() => handleRemoveVariant(i)}
              className="text-red-600 hover:text-red-800 ml-auto text-sm flex items-center gap-1"
            >
              <FaTrashAlt /> Delete
            </button>
          </div>

          {/* Variant Options */}
          <div className="p-4">
            {variant.options.map((opt, j) => (
              <div
                key={j}
                className="mb-4 border border-gray-200 rounded-md p-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-3">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option Value
                    </label>
                    <input
                      type="text"
                      value={opt.value}
                      onChange={(e) =>
                        handleOptionChange(i, j, {
                          ...opt,
                          value: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="e.g. Red"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Price (£)
                    </label>
                    <input
                      type="text"
                      value={opt.additionalPrice}
                      onChange={(e) =>
                        handleOptionChange(i, j, {
                          ...opt,
                          additionalPrice: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={opt.active}
                      onChange={(e) =>
                        handleOptionChange(i, j, {
                          ...opt,
                          active: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <button
                      onClick={() => handleRemoveOption(i, j)}
                      className="text-red-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <FaTrashAlt /> Remove Option
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      handleOptionChange(i, j, {
                        ...opt,
                        images: Array.from(e.target.files),
                      })
                    }
                    className="w-full text-sm text-gray-600"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addOption(i)}
              className="text-blue-600 text-sm hover:underline mt-2"
            >
              + Add Option
            </button>
          </div>
        </div>
      ))}

      {/* Add Variant Button */}
      <button
        onClick={addVariant}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
      >
        + Add Variant
      </button>

      {/* Sticky Footer with Submit / Back */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-3 border-t flex justify-center gap-4 z-50">
        <button
          name="button"
          type="submit"
          onClick={handleSubmit}
          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ProductVariantForm;

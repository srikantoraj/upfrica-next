// pages/ItemSpecificsForm.jsx
'use client'
import React, { useState } from "react";
import ItemAttributeField from "./ItemAttributeField";


const ItemSpecificsForm = () => {
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("Apple Watch Series 8");
  const [caseSize, setCaseSize] = useState("41 mm");
  const [os, setOs] = useState("iOS - Apple");
  const [bandMaterial, setBandMaterial] = useState("Fluoroelastomer");

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Item Specifics</h2>

      {/* Required Fields */}
      <fieldset className="border border-gray-200 rounded p-4 mb-8">
        <legend className="text-lg font-semibold text-gray-700 px-2">Required</legend>
        <p className="text-sm text-gray-500 mb-4">Buyers need these details to find your item.</p>

        <ItemAttributeField
          label="Brand"
          tooltip="Name of the brand, designer or artist that produces the product."
          options={["Apple", "Samsung", "Fitbit", "Garmin", "Amazfit", "Unbranded"]}
          selected={brand}
          onChange={setBrand}
        />

        <ItemAttributeField
          label="Model"
          tooltip="Brand or manufacturer’s specific name used for the product."
          options={["Apple Watch Series 8", "Apple Watch Series 7", "Apple Watch SE", "Apple Watch Series 9"]}
          selected={model}
          onChange={setModel}
        />

        <ItemAttributeField
          label="Case Size"
          tooltip="Measured diagonally from 2 o’clock to 8 o’clock in millimetres (mm)."
          options={["38 mm", "40 mm", "41 mm", "42 mm", "44 mm", "45 mm"]}
          selected={caseSize}
          onChange={setCaseSize}
        />

        <ItemAttributeField
          label="Compatible Operating System"
          tooltip="Operating system software compatible with device."
          options={["iOS - Apple", "Android", "Windows", "Tizen", "Fire OS"]}
          selected={os}
          onChange={setOs}
        />

        <ItemAttributeField
          label="Band Material"
          tooltip="Main material of the band on the product."
          options={["Fluoroelastomer", "Silicone", "Leather", "Nylon", "Stainless Steel"]}
          selected={bandMaterial}
          onChange={setBandMaterial}
        />
      </fieldset>

      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </div>
  );
};

export default ItemSpecificsForm;

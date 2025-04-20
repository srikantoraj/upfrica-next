import React from "react";

const PriceSection = ({ formik }) => {
  return (
    <div id="price" className="bg-white shadow rounded-lg mb-6">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h5 className="text-lg font-semibold">*Pricing</h5>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Item Price */}
          <div className="relative border-b ">
            <label className="block text-sm font-semibold mb-1 pb-2 focus:ring-0">*Item Price</label>
            {/* USD prefix styled like original */}
            <span
              className="absolute left-4 top-[46px] text-blue-600 font-semibold cursor-pointer underline"
              onClick={() => console.log("Open currency modal")} // Replace with modal trigger if needed
            >
              USD
            </span>
            <input
              type="text"
              name="price_cents"
              placeholder="Price"
              required
              className="w-full border-none  py-2 pr-3 pl-14 mt-1 text-base placeholder-gray-400 focus:outline-none focus:ring-0"
              value={formik.values.price_cents}
              onChange={formik.handleChange}
            />
          </div>

          {/* Unit Value */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit Value</label>
            <input
              type="number"
              name="unit_value"
              step="1"
              placeholder="Enter a value"
              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={formik.values.unit_value || ""}
              onChange={formik.handleChange}
            />
          </div>

          {/* Unit of Measure */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit of Measure</label>
            <select
              name="unit_measure"
              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={formik.values.unit_measure || "each"}
              onChange={formik.handleChange}
            >
              {[
                "each", "cbm", "cm", "ct", "ft", "g", "gal", "inch", "kg",
                "km", "m", "pcs", "oz", "pack", "set", "sqft", "sqm", "yard"
              ].map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;

import React from "react";

const currencies = ["GHS", "USD", "EUR", "EUR", "GBP", "BDT", "NGN", "PKR"];

const PriceSection = ({ formik }) => {
  return (
    <div id="price" className="bg-white shadow rounded-lg mb-6">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h5 className="text-lg font-semibold">*Pricing</h5>
      </div>

      {/* Body */}
      <div className="p-4 space-y-6">
        {/* Row 1: Currency & Price */}
        <div className="grid grid-cols-2 gap-6">
          {/* Currency */}
          <div className="border-b">
            <label className="block text-sm font-semibold mb-1 pb-2">
              *Currency
            </label>
            <select
              name="price_currency"
              value={formik.values.price_currency}
              onChange={formik.handleChange}
              className="w-full  bg-white  underline cursor-pointer py-2 focus:outline-none rounded-md focus:ring focus:ring-blue-200"
            >
              {currencies.map((curr, idx) => (
                <option key={`${curr}-${idx}`} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* Item Price */}
          <div className="border-b relative">
            <label className="block text-sm font-semibold mb-1 pb-2">
              *Item Price(cent)
            </label>
            <input
              type="text"
              name="price_cents"
              placeholder="Price"
              required
              className="w-full border-none py-2 px-3 mt-1 text-base placeholder-gray-400 focus:outline-none focus:ring-0"
              value={formik.values.price_cents}
              onChange={formik.handleChange}
            />
          </div>
        </div>

        {/* Row 2: Unit Value & Unit of Measure */}
        <div className="grid grid-cols-2 gap-6">
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
            <label className="block text-sm font-medium mb-1">
              Unit of Measure
            </label>
            <select
              name="unit_measure"
              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring focus:ring-violet-700"
              value={formik.values.unit_measure || "each"}
              onChange={formik.handleChange}
            >
              {[
                "each",
                "cbm",
                "cm",
                "ct",
                "ft",
                "g",
                "gal",
                "inch",
                "kg",
                "km",
                "m",
                "pcs",
                "oz",
                "pack",
                "set",
                "sqft",
                "sqm",
                "yard",
              ].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;

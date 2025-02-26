import React, { useState } from "react";

/**
 * This component replicates the Price Refinements section,
 * including a pair of sliders for minimum/maximum price
 * and a "Go" button that would submit a form.
 */
const PriceRefinements = () => {
  // For demonstration, store the lower/upper in local state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(8900);

  // Example range for the slider in steps
  const minSliderVal = 0;
  const maxSliderVal = 170; // Based on the snippet, 170 steps => $8900

  // Convert our local "step" scale to actual dollar amounts
  const stepToPrice = (step) => {
    // For example, 170 steps -> 8900 => ratio is ~52.35
    return Math.round(step * (8900 / maxSliderVal));
  };

  // Helpers to handle slider changes
  const onChangeMin = (e) => {
    const stepValue = parseInt(e.target.value);
    setMinPrice(stepToPrice(stepValue));
  };

  const onChangeMax = (e) => {
    const stepValue = parseInt(e.target.value);
    setMaxPrice(stepToPrice(stepValue));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you might navigate or do something
    // with minPrice and maxPrice. For now, just log them.
    console.log("Submitting price range:", { minPrice, maxPrice });
  };

  return (
    <div className="mb-6 bg-white " role="group">
      {/* Price title */}
      <h2 className="font-semibold text-base lg:text-lg text-gray-700" id="p_36-title">
        Price
      </h2>

      {/* The range form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden fields (optional, if you want to mimic the snippet) */}
        <input type="hidden" name="k" value="gaming keyboard" />
        <input type="hidden" name="_encoding" value="UTF8" />
        <input type="hidden" name="content-id" value="amzn1.sym..." />
        {/* ... etc. ... */}

        {/* Display the min and max labels */}
        <div className="flex items-center justify-between text-base lg:text-lg font-bold">
          <label aria-label="Minimum" htmlFor="price-min">
            ${minPrice}
          </label>
          <span>–</span>
          <label aria-label="Maximum" htmlFor="price-max">
            ${maxPrice}+
          </label>
        </div>

        {/* Range sliders */}
        <div className="flex flex-col space-y-2">
          {/* Lower bound slider */}
          <input
            id="price-min"
            type="range"
            min={minSliderVal}
            max={maxSliderVal}
            value={Math.round((minPrice / 8900) * maxSliderVal)}
            onChange={onChangeMin}
            className="w-full cursor-pointer"
          />

          {/* Upper bound slider */}
          <input
            id="price-max"
            type="range"
            min={minSliderVal}
            max={maxSliderVal}
            value={Math.round((maxPrice / 8900) * maxSliderVal)}
            onChange={onChangeMax}
            className="w-full cursor-pointer"
          />
        </div>

        {/* "Go" button */}
        <button
          type="submit"
          aria-label="Go - Submit price range"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded"
        >
          Go
        </button>
      </form>
    </div>
  );
};

export default PriceRefinements;

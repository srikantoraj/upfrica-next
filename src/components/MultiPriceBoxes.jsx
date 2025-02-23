import React from 'react';

const MultiPriceBoxes = () => {
  // Sample pricing data – you can update these values as needed
  const pricingOptions = [
    { label: 'Option 1', price: '$10.00' },
    { label: 'Option 2', price: '$20.00' },
    { label: 'Option 3', price: '$30.00' },
    { label: 'Option 4', price: '$40.00' },
  ];

  return (
    <div className="">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-4">Multi Buy</h2>
      
      {/* Grid of 4 boxes */}
      <div className="grid grid-cols-4 gap-4 ">
        {pricingOptions.map((option, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-base lg:text-lg font-medium">{option.label}</div>
            <div className="mt-2 text-xl font-medium ">{option.price} each</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiPriceBoxes;

import React from "react";

const DeliveryDate = () => {
  const today = new Date(); // Ajker tarikh
  const futureDate = new Date(today); // Future tarikh er jonno notun date object
  futureDate.setDate(today.getDate() + 2); // Ajker date er shathe 2 din jog

    // Date ke readable format e convert korchi (dd mmm yyyy)
    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
      };

  return (
    <div className="p-2 border border-blue-400 w-1/2 rounded-md font-bold">
      <h1>
      Delivery date: 
      <span className="text-blue-600"> {formatDate(today)} - {formatDate(futureDate)} </span> 
      if ordered today
    </h1>
    </div>
  );
};

export default DeliveryDate;

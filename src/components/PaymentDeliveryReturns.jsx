// components/PaymentDeliveryReturns.js
import React from 'react';

const PaymentDeliveryReturns = ({ secondaryData, dispatchTime }) => {
  const { cancellable, cancellation_policy } = secondaryData || {};



  const dispatchDays = parseInt(dispatchTime) || 0;

  // Compute delivery date = today + dispatchDays
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + dispatchDays);

  // Format as "Tue, 25 Feb"
  const deliveryDateString = deliveryDate.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  // 1. Define your payment methods in an array of objects
  const paymentMethods = [
    {
      name: 'MTN MOMO',
      logoUrl: 'https://uploads-eu-west-1.insided.com/mtngroup-en/attachment/96f3ec28-bc42-49ee-be5d-6ed5345e516c_thumb.png',
    },
    {
      name: 'Google Pay',
      logoUrl: 'https://lh3.googleusercontent.com/z4nOBXDSMJ2zwyW9Nd1KHYEJgbhuqnVLvAGUXh0uEUn8f9QHnPYUY_64oYwOxRsDx26SEb5PgZJzLJRU6RwToFL00Wq--pBGmAwe=s0',
    },
    {
      name: 'VISA',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
    },
    {
      name: 'MasterCard',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg',
    },
  ];

  return (
    <div className="mt-6 w-full max-w-3xl mx-auto py-2  border-gray-200 rounded-lg">
      {/* Title */}
      <h2 className="text-xl lg:text-2xl font-bold mb-6">
        Payment, Delivery and Returns
      </h2>

      {/* Seller's Payment Terms (full-width block) */}
      <div className="mb-8">
        <p className="text-base lg:text-lg font-semibold mb-1">
          Seller's Payment Terms:
        </p>
        <ul className="space-y-1 text-base lg:text-lg">
          <li>✅ Pay Online (Available at checkout)</li>
          <li>❌ Pay on Delivery (Not available)</li>
          <li>✅ Pay &amp; Collect (Available at checkout)</li>
        </ul>
        <div className="mt-2">
          <a href="#" className="text-blue-600 underline text-sm lg:text-base">
            See details
          </a>
          <i className="bi bi-info-circle ml-1 align-middle" />
        </div>
      </div>

      {/* Container for Delivery, Returns, and Payments */}
      <div className="space-y-6">
        {/* Delivery */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-y-2 lg:gap-y-0 lg:gap-x-6">
          <p className="text-base lg:text-lg font-semibold">Delivery:</p>
          <div>
            <p className="text-base lg:text-lg">
              Fast Delivery Available:&nbsp;
              <span className="font-bold">{deliveryDateString}</span>
            </p>
            <p className="text-sm lg:text-base text-gray-500">
              if ordered today
            </p>
          </div>
        </div>

        {/* Returns */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-y-2 lg:gap-y-0 lg:gap-x-6">
          <p className="text-base lg:text-lg font-semibold">Returns:</p>
          <div>
            {!cancellable && <p className="text-base lg:text-lg">
              The seller won't accept returns for this item.
             
             
            </p>}
            {
              cancellable && (
                <p className="text-base lg:text-lg">
                  You can return this item within
                  <span className="font-bold"> 7 days</span> of receiving it.

                </p>
              )
            }
          </div>
        </div>

        {/* Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-y-2 lg:gap-y-0 lg:gap-x-6">
          <p className="text-base lg:text-lg font-semibold">Payments:</p>
          <div className="flex items-center space-x-4 mt-2 lg:mt-0">
            {/* 2. Map over your paymentMethods array to render each payment method */}
            {paymentMethods.map((method, index) => (
                    <div key={index} className="border-[2px] lg:border-[3px] border-black p-2 rounded flex items-center justify-center w-20 h-12">
                        <img className="max-h-6" src={method.logoUrl} alt={method.name} />
                    </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDeliveryReturns;

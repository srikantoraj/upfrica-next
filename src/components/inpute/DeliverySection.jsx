import React from "react";

const DeliverySection = ({ formik }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-6">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h5 className="text-lg font-semibold">*Delivery</h5>
      </div>

      {/* Body */}
      <div className="p-4 space-y-6">

        {/* Delivery Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="postage_fee_cents" className="block text-sm font-medium mb-1">
              Delivery Fee
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g: 35"
              name="postage_fee_cents"
              id="postage_fee_cents"
              className="w-full border rounded-md px-3 py-2"
              value={formik.values.postage_fee_cents}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <label htmlFor="secondary_postage_fee_cents" className="block text-sm font-medium mb-1">
              2nd Delivery Fee
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g: 20"
              name="secondary_postage_fee_cents"
              id="secondary_postage_fee_cents"
              className="w-full border rounded-md px-3 py-2"
              value={formik.values.secondary_postage_fee_cents}
              onChange={formik.handleChange}
            />
          </div>
        </div>

        {/* Quantity & Dispatch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="product_quantity" className="block text-sm font-medium mb-1">
              *Quantity Available
            </label>
            <input
              type="number"
              name="product_quantity"
              id="product_quantity"
              placeholder="e.g: 25"
              className="w-full border rounded-md px-3 py-2"
              value={formik.values.product_quantity}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <label htmlFor="dispatch_time_in_days" className="block text-sm font-medium mb-1">
              *Days to Dispatch
            </label>
            <input
              type="number"
              name="dispatch_time_in_days"
              id="dispatch_time_in_days"
              placeholder="e.g: 2"
              min="0"
              className="w-full border rounded-md px-3 py-2"
              value={formik.values.dispatch_time_in_days || ""}
              onChange={formik.handleChange}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeliverySection;

import React from "react";

const CancellationReturnsSection = ({ formik }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-6">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h5 className="text-lg font-semibold mb-0">*Cancellation & Returns</h5>
      </div>

      {/* Body */}
      <div className="p-4 space-y-6">

        {/* Order Cancellation Section */}
        <div className="border-b pb-4 mt-4">
          <h5 className="text-md font-semibold mb-2">
            *Is order cancellation allowed on this item?
          </h5>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="cancellable"
                id="product_cancellable_true"
                value="true"
                checked={formik.values.cancellable === "true"}
                onChange={formik.handleChange}
                className="form-radio text-blue-600"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="cancellable"
                id="product_cancellable_false"
                value="false"
                checked={formik.values.cancellable === "false"}
                onChange={formik.handleChange}
                className="form-radio text-blue-600"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Returns Section */}
        <div className="bg-gray-100 p-4 border rounded-md mt-4 space-y-4">
          <h5 className="text-md font-semibold">*Returns</h5>

          {/* Return Yes */}
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="domestic_returns_accepted"
              id="product_domestic_returns_accepted_yes"
              value="yes"
              checked={formik.values.domestic_returns_accepted === "yes"}
              onChange={formik.handleChange}
              className="form-radio text-blue-600"
            />
            <label htmlFor="product_domestic_returns_accepted_yes" className="text-sm">
              Yes. Domestic return allowed
            </label>
          </div>

          {formik.values.domestic_returns_accepted === "yes" && (
            <div className="grid grid-cols-1  gap-4 mt-2">
              <div>
                <label className="block text-sm mb-1">
                  After receiving the item, your buyer should return within:
                </label>
                <select
                  name="return_in_days"
                  id="product_return_in_days"
                  value={formik.values.return_in_days}
                  onChange={formik.handleChange}
                  className="w-full lg:w-1/2 border rounded-md px-3 py-2"
                >
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Returns delivery fee will be paid by:
                </label>
                <select
                  name="returns_cost_by"
                  id="product_returns_cost_by"
                  value={formik.values.returns_cost_by}
                  onChange={formik.handleChange}
                  className="w-full lg:w-1/2 border rounded-md px-3 py-2"
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Seller(free returns)">Seller (free returns)</option>
                </select>
              </div>
            </div>
          )}

          {/* Return No */}
          <div className="flex items-start space-x-2 mt-3">
            <input
              type="radio"
              name="domestic_returns_accepted"
              id="product_domestic_returns_accepted_no"
              value="no"
              checked={formik.values.domestic_returns_accepted === "no"}
              onChange={formik.handleChange}
              className="form-radio text-blue-600 mt-1"
            />
            <label htmlFor="product_domestic_returns_accepted_no" className="text-sm">
              No. Domestic return not allowed. Unless item is damaged, defective or does not match the listing description
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationReturnsSection;


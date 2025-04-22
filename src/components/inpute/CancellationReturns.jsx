import React from "react";

const CancellationPolicyForm = ({ formik }) => {
  return (
  
    <div className="bg-white shadow rounded-lg mb-6 ">
      
      <div className="border-b p-4">
        <h5 className="text-lg font-semibold mb-0">
          Define Cancellation Policy
        </h5>
      </div>

      {/* 1. Toggle: Allow cancellation? */}
      <div className="space-x-6 p-6 ">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="cancellable"
            // unchecked by default
            checked={formik.values.cancellable === false}
            onChange={() => formik.setFieldValue("cancellable", false)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2">No, cancellations not allowed</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="cancellable"
            checked={formik.values.cancellable === true}
            onChange={() => formik.setFieldValue("cancellable", true)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2">Yes, allow cancellations</span>
        </label>
      </div>

      {/* 2. When allowed → show policy inputs */}
      {formik.values.cancellable && (
        <div className="border-l-4 border-blue-300 pl-4 mt-4 space-y-4 pb-4">
          {/* 2.1 Cancellation window */}
          <div className="">
            <label htmlFor="cancellationWindowHours" className="block text-sm font-medium mb-1">
              Cancellation window (hours)
            </label>
            <input
              type="number"
              id="cancellationWindowHours"
              name="cancellationWindowHours"
              min={1}
              max={48}
              value={formik.values.cancellationWindowHours}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-24 border rounded-md px-2 py-1"
            />
            {formik.touched.cancellationWindowHours && formik.errors.cancellationWindowHours && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.cancellationWindowHours}</p>
            )}
            <p className="text-xs text-gray-500">(e.g. 1–2 hours before shipment)</p>
          </div>

          {/* 2.2 Seller SLA */}
          <div>
            <label htmlFor="sellerResponseSLA" className="block text-sm font-medium mb-1">
              Seller response SLA
            </label>
            <select
              id="sellerResponseSLA"
              name="sellerResponseSLA"
              value={formik.values.sellerResponseSLA}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-32 border rounded-md px-3 py-2"
            >
              <option value="24h">24 hours</option>
              <option value="48h">48 hours</option>
            </select>
            {formik.touched.sellerResponseSLA && formik.errors.sellerResponseSLA && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.sellerResponseSLA}</p>
            )}
          </div>

          {/* 2.3 Deny if shipped/custom */}
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="denyIfShippedOrCustom"
                checked={formik.values.denyIfShippedOrCustom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2">Deny if already shipped or customized</span>
            </label>
          </div>

          {/* 2.4 Auto‑cancel unpaid orders */}
          <div>
            <label htmlFor="autoCancelUnpaidHours" className="block text-sm font-medium mb-1">
              Auto-cancel unpaid orders after (hours)
            </label>
            <input
              type="number"
              id="autoCancelUnpaidHours"
              name="autoCancelUnpaidHours"
              min={1}
              max={168}
              value={formik.values.autoCancelUnpaidHours}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-24 border rounded-md px-2 py-1"
            />
            {formik.touched.autoCancelUnpaidHours && formik.errors.autoCancelUnpaidHours && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.autoCancelUnpaidHours}</p>
            )}
            <p className="text-xs text-gray-500">(e.g. 48 hours = 2 days)</p>
          </div>

          {/* 2.5 Flag abuse threshold */}
          <div>
            <label htmlFor="abuseFlagThreshold" className="block text-sm font-medium mb-1">
              Flag user/seller after X cancellations in 30 days
            </label>
            <input
              type="number"
              id="abuseFlagThreshold"
              name="abuseFlagThreshold"
              min={1}
              value={formik.values.abuseFlagThreshold}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-20 border rounded-md px-2 py-1"
            />
            {formik.touched.abuseFlagThreshold && formik.errors.abuseFlagThreshold && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.abuseFlagThreshold}</p>
            )}
          </div>
        </div>
      )}

 </div>

  );
};

export default CancellationPolicyForm;

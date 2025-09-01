export default function PricingSection({ formik }) {
  const values = formik.values.pricing;

  return (
    <div className="space-y-6 rounded-lg bg-white w-full lg:w-4/5">
      {/* Format Selection */}
      <div className="grid grid-cols-1 space-y-3">
        <div>
          <label className="block font-medium text-sm mb-1">Format</label>
          <select
            name="pricing.format"
            value={values.format}
            onChange={formik.handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Auction">Auction</option>
            <option value="BuyItNow">Buy it now</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium text-sm mb-1">
            Auction duration
          </label>
          <select
            name="pricing.duration"
            value={values.duration}
            onChange={formik.handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="3 days">3 days</option>
            <option value="5 days">5 days</option>
            <option value="7 days">7 days</option>
            <option value="10 days">10 days</option>
          </select>
        </div>
      </div>

      {/* Starting Bid + Buy it Now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-sm mb-1">Starting bid</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">£</span>
            <input
              type="text"
              name="pricing.startingBid"
              value={values.startingBid}
              onChange={formik.handleChange}
              className="w-full pl-7 border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">
            Buy it now <span className="text-gray-500">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">£</span>
            <input
              type="text"
              name="pricing.buyItNow"
              value={values.buyItNow}
              onChange={formik.handleChange}
              className="w-full pl-7 border px-3 py-2 rounded"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum: £66.78</p>
        </div>
      </div>

      {/* Immediate Payment */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="pricing.immediatePay"
          checked={values.immediatePay}
          onChange={formik.handleChange}
          className="mt-1"
        />
        <label htmlFor="pricing.immediatePay" className="text-sm text-gray-700">
          Require immediate payment when buyer uses Buy it now
        </label>
      </div>

      {/* Reserve Price */}
      <div>
        <label className="block font-medium text-sm mb-1">
          Reserve price{" "}
          <span className="text-gray-500">(optional — fees apply)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">£</span>
          <input
            type="text"
            name="pricing.reservePrice"
            value={values.reservePrice}
            onChange={formik.handleChange}
            className="w-full pl-7 border px-3 py-2 rounded"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This is the lowest price you're willing to sell for. Fees apply even
          if the item doesn’t sell.
        </p>
      </div>

      {/* Quantity */}
      <div>
        <label className="block font-medium text-sm mb-1">Quantity</label>
        <input
          type="text"
          value={values.quantity}
          disabled
          className="w-20 px-3 py-2 border rounded bg-gray-100 text-gray-600"
        />
      </div>
    </div>
  );
}

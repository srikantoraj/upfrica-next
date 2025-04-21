import React from "react";

export default function ListingFee() {
  return (
    <div className="space-y-4 text-center  ">
      {/* Listing Fee Header */}
      <div>
        <h2 className="text-base font-semibold text-gray-800">Listing fee</h2>
        <p className="text-xl font-bold text-gray-900 mt-1">£0.00</p>
      </div>

      {/* Legal Info */}
      <div className="text-sm text-gray-600 space-y-3">
        <p>
          No{" "}
          <a
            href="http://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4822"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            transaction fees
          </a>{" "}
          will be applied. You accept that the duration of your listing may vary due to delayed appearance in search.{" "}
          <a
            href="https://www.ebay.co.uk/help/selling/listings/listings-overview?id=4072"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Learn more
          </a>
        </p>

        <p>
          By selecting <span className="font-semibold">List it for free</span>, you agree to pay the above fees, accept the{" "}
          <a
            href="https://www.ebay.co.uk/help/policies/member-behaviour-policies/user-agreement?id=4259"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            eBay User Agreement
          </a>
          ,{" "}
          <a
            href="https://pages.ebay.co.uk/payment/2.0/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Payments Terms of Use
          </a>
          , and{" "}
          <a
            href="https://pages.ebay.co.uk/promote-your-listings/terms/B2C/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Marketing Program Terms
          </a>
          , acknowledge reading the{" "}
          <a
            href="https://www.ebay.co.uk/help/policies/member-behaviour-policies/user-privacy-notice-privacy-policy?id=4260"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            User Privacy Notice
          </a>
          , agree to offer products and services that comply with all applicable laws, and assume full responsibility for the item offered and the content of your listing.
        </p>
      </div>
    </div>
  );
}

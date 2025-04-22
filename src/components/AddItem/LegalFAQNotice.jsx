import React from "react";

export default function LegalFAQNotice() {
  return (
    <div className="text-sm text-gray-700 space-y-3 leading-relaxed mt-4">
      <p>
        To improve your chances of selling, we may send you offers from buyers that you can choose to accept or decline.
      </p>

      <p>
        Auctions will be automatically relisted up to 8 times for free and do not count towards your monthly listings
        balance. Auctions with a 1- or 3-day duration will be relisted with a 7-day duration.
      </p>

      <p>
        Funds from your sales may be unavailable and show as pending for a period of time.{" "}
        <a
          href="http://www.ebay.co.uk/help/selling/selling-getting-paid/pending-payments?id=4155"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Learn more
        </a>
      </p>
    </div>
  );
}

import { useState } from "react";

const DispatchInfo = ({ order, onDispatchAll }) => {
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleAddress = () => setShowAddress(!showAddress);

  const shipping = order?.shipping_address || {};
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [shipping.line1, shipping.city, shipping.region, shipping.postcode, shipping.country]
      .filter(Boolean)
      .join(", ")
  )}`;

  const fullAddress = [shipping.line1, shipping.city, shipping.region, shipping.postcode, shipping.country]
    .filter(Boolean)
    .join(", ");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const canDispatchAll =
    order.payment_status === "Paid" &&
    order.order_items?.every((item) => !item.dispatched);

  return (
    <div className="text-right text-gray-800 dark:text-gray-100 flex flex-col sm:flex-row sm:items-center sm:gap-4 sm:justify-end">
      <div>
        <p>
          <strong>Dispatch To:</strong> {shipping.full_name || "Unknown"}
          <button
            onClick={toggleAddress}
            className="text-sm text-blue-600 underline ml-2 hover:text-blue-800 dark:hover:text-blue-400"
          >
            {showAddress ? "Hide Address" : "Show Address"}
          </button>
        </p>

        {showAddress && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-5">
            <p>{fullAddress}</p>

            {order.buyer_phone && (
              <p className="mt-1">📞 {order.buyer_phone}</p>
            )}

            {order.buyer_note && (
              <p className="italic mt-1">📝 {order.buyer_note}</p>
            )}

            <div className="flex gap-3 mt-1 items-center flex-wrap">
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                📍 View on Map
              </a>
              <button
                onClick={copyToClipboard}
                className="text-blue-500 underline hover:text-blue-700"
              >
                📋 {copied ? "Copied!" : "Copy Address"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dispatch All Items Button */}
{canDispatchAll && (
<button
  onClick={() => onDispatchAll(order)}
  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 shadow-sm transition-colors"
>
  🚚 Dispatch All Items
</button>
)}
    </div>
  );
};

export default DispatchInfo;
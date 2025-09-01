import React from "react";

const DutiesCollection = () => {
  return (
    <section className="bg-white py-12 px-6 max-w-5xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">
        📦 Optimize Duties Collection
      </h2>

      <p className="mb-6">
        Navigating international tariffs and import taxes is a crucial part of
        cross-border selling. Shopify provides tools to simplify the process and
        enhance customer trust through transparency and seamless checkout
        experiences.
      </p>

      <div className="space-y-8">
        {/* Managing Duties and Taxes */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            🧾 Managing Duties and Taxes
          </h3>
          <p className="mb-2">You can either:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Absorb the cost:</strong> Improves customer experience but
              reduces profit margins.
            </li>
            <li>
              <strong>Pass it to customers:</strong> Preserves profit but
              requires clear communication.
            </li>
          </ul>
          <p className="italic">
            ✅ Tip: Always be transparent at checkout to build trust.
          </p>
        </div>

        {/* Steps to Enable Duties Collection */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            ⚙️ Steps to Enable Duties Collection
          </h3>
          <ol className="list-decimal pl-6 space-y-2 mb-2">
            <li>
              Go to <strong>Settings &gt; Taxes and duties</strong> in your
              Shopify admin.
            </li>
            <li>
              Add the <strong>Country of Origin</strong> to each product.
            </li>
            <li>
              Assign <strong>HS Codes</strong> to avoid border delays and apply
              correct rates.
            </li>
          </ol>
          <p className="text-sm text-gray-600">
            📝 You can bulk upload via CSV or edit each product manually.
          </p>
        </div>

        {/* Delivered Duty Paid (DDP) */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            📬 Use Delivered Duty Paid (DDP) Labels
          </h3>
          <p className="mb-2">
            Prevent double-charging customers by using{" "}
            <strong>DDP shipping labels</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Available via{" "}
              <a
                href="https://apps.shopify.com/categories/orders-and-shipping"
                className="text-blue-600 underline"
              >
                third-party apps
              </a>
              .
            </li>
            <li>
              Soon available via Shopify Shipping (DHL eCommerce, DHL Express).
            </li>
          </ul>
          <p className="mt-4 font-medium">Tips for pre-paid duties:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mention that duties are included on product pages.</li>
            <li>
              Update your{" "}
              <a
                href="https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos"
                className="text-blue-600 underline"
              >
                shipping policy
              </a>{" "}
              accordingly.
            </li>
          </ul>
        </div>

        {/* Delivered Duty Unpaid (DDU) */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            📦 Delivered Duty Unpaid (DDU) Option
          </h3>
          <p>With DDU, the customer pays duties on delivery.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use Shopify Shipping (U.S. and Canada).</li>
            <li>
              Clearly state customer is responsible for fees in policy &
              confirmation emails.
            </li>
          </ul>
        </div>

        {/* Managed Markets */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">
            🚀 Advanced: Managed Markets
          </h3>
          <p className="mb-2">
            For eligible U.S. merchants, Shopify’s Managed Markets handles:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accurate duty & tax collection.</li>
            <li>DDP label access via admin or 3PL.</li>
            <li>Product screening & fraud protection.</li>
          </ul>
          <a
            href="https://www.shopify.com/international/managed"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-white bg-black px-5 py-2 rounded hover:bg-gray-800"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default DutiesCollection;

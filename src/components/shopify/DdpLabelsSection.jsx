// DdpLabelsSection.jsx (বা .tsx)
import Link from "next/link";

export default function DdpLabelsSection() {
  return (
    <section className="my-12 rounded-md border-l-4 border-green-600 bg-green-50 p-6 text-gray-800">
      {/* শিরোনাম */}
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Purchase Delivered Duty Paid&nbsp;(DDP) labels
      </h3>

      {/* প্রধান বর্ণনা */}
      <p className="mb-4">
        If you calculate and collect duties and import taxes, you need to
        purchase and use <strong>Delivered Duty Paid&nbsp;(DDP)</strong>{" "}
        shipping labels instead of standard international labels. This prevents
        your customers from being double‑charged for duties and taxes.
      </p>

      <p className="mb-4">
        Currently you can buy DDP labels from{" "}
        <Link
          href="https://apps.shopify.com/categories/orders-and-shipping"
          className="font-medium text-green-700 underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          third‑party apps
        </Link>
        — and very soon directly through&nbsp;
        <Link
          href="https://www.shopify.com/shipping"
          className="font-medium text-green-700 underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shopify Shipping
        </Link>{" "}
        from carriers like&nbsp;DHL eCommerce and DHL Express.
      </p>

      {/* টিপস */}
      <h4 className="mb-2 font-medium text-gray-900">
        Tips for a pre‑paid duties experience
      </h4>
      <ul className="mb-4 list-disc space-y-2 pl-6">
        <li>
          If you include duties and taxes in the product price, clearly mention
          this on the product page to improve add‑to‑cart conversion.
        </li>
        <li>
          Update your{" "}
          <Link
            href="/policies/shipping-policy"
            className="font-medium text-green-700 underline hover:no-underline"
          >
            shipping policy
          </Link>{" "}
          so customers know they won’t face extra charges on delivery.
        </li>
      </ul>

      {/* রেফারেন্স */}
      <p className="text-sm text-gray-600">
        Source:&nbsp;
        <Link
          href="https://www.shopify.com/blog/international-import-shipping"
          className="underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shopify Blog – International Import Shipping
        </Link>
      </p>
    </section>
  );
}

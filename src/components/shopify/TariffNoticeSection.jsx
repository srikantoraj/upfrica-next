import React from "react";

const TradeUpdateSection = () => {
  return (
    <div className="col-span-4 xs:col-span-12 md:col-span-8 lg:col-span-6 col-start-1">
      <div className="text-base text-gray-600 md:pt-10 lg:pt-16">

        {/* Highlighted Update Box */}
        <div className="my-12 border-l-2 border-green-500 pl-4 bg-gray-50 p-4 rounded">
          <p className="font-semibold text-black mb-4">Update on tariffs and international trade</p>
          <p className="mb-4">New and evolving trade regulations may impact your business:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>On April 2, the U.S. announced a baseline 10% tariff on imports, as well as additional tariffs on certain goods from multiple countries.</li>
            <li>The U.S. also announced the elimination of de minimis treatment, which allows for duty-free entry for shipments under $800 in value, for imports from China.</li>
            <li>In response, other countries have placed additional tariffs on a range of U.S. imports.</li>
          </ul>
          <p>
            Check with your local trade authority for the latest information on current tariffs—and{" "}
            <a href="/news/open-doors-open-trade" className="text-black font-medium underline hover:no-underline">
              learn more about Shopify’s position
            </a>{" "}
            on these changes.
          </p>
        </div>

        {/* Paragraph */}
        <p className="mb-6">
          Sourcing and selling products internationally is a key way to expand your business's reach, product offering,
          market share, and customer base. However, you must stay on top of evolving tariffs, customs requirements, and duties.
        </p>
        <p className="mb-6">
          Shopify has tools to{" "}
          <a href="/international" className="text-black font-medium underline hover:no-underline">
            sell cross-border
          </a>{" "}
          and keep pace with rapidly evolving trade policies.
        </p>

        {/* Table of Contents */}
        <div className="my-12 border-l-2 border-green-500 pl-4 bg-gray-50 p-4 rounded">
          <p className="font-semibold text-black mb-4">Table of contents</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><a href="#1" className="text-black underline hover:no-underline">Optimize duties collection</a></li>
            <li><a href="#2" className="text-black underline hover:no-underline">Diversify suppliers</a></li>
            <li><a href="#3" className="text-black underline hover:no-underline">Use local third-party logistics (3PL) providers</a></li>
          </ul>
        </div>

        {/* Section 1 */}
        <h2 id="1" className="text-2xl font-medium text-black mt-12 mb-6">Optimize duties collection</h2>
        <p className="mb-6">
          Navigating tariffs, which impose{" "}
          <a href="https://help.shopify.com/en/manual/international/duties-and-import-taxes"
             className="text-black underline hover:no-underline">
            duties and import taxes
          </a>, means making strategic decisions that affect your business. You may choose to absorb these costs, which could
          impact profit, or pass them to customers.
        </p>
        <p className="mb-6">
          Whichever approach you choose, being transparent with customers is critical to build trust and maintain a
          positive customer experience.
        </p>

        {/* Subsection */}
        <h3 className="text-xl font-medium text-black mt-8 mb-4">Managing duties and taxes in international markets</h3>
        <p className="mb-6">
          Shopify merchants can use the{" "}
          <a href="https://admin.shopify.com/settings/taxes#duties"
             className="text-black underline hover:no-underline">
            duties calculator in the admin
          </a>{" "}
          to estimate duties and import taxes. You can build those duties into your prices to cover expected costs or
          transparently display them to customers at checkout.
        </p>
        <p className="mb-6">
          By communicating that no additional fees will apply at delivery, your customers will feel more confident in
          completing their purchase.
        </p>
        <p className="mb-2 font-semibold">Here’s how:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Go to <strong>Settings &gt; Taxes and duties</strong></li>
          {/* Add more steps if available */}
        </ol>
      </div>
    </div>
  );
};

export default TradeUpdateSection;

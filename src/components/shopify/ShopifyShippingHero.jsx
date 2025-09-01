import React from "react";

const ShopifyShippingHero = () => {
  return (
    <section className="relative container bg-white">
      {/* Main text container */}
      <div className="py-10 text-left lg:text-center md:pt-16 md:pb-16 px-4">
        <div className="">
          {/* Breadcrumb */}
          <div className="uppercase text-xs tracking-wide font-semibold text-gray-500 pb-2">
            <a href="/blog" className="hover:underline">
              blog
            </a>
            <span className="mx-2">|</span>
            <a href="/blog/topics/backoffice" className="hover:underline">
              Backoffice
            </a>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-medium tracking-tight text-gray-900 mb-4">
            Navigating Tariffs: Your Guide to International Shipping on Shopify
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Shopify has tools you need to keep pace with rapidly evolving trade
            policies.
          </p>

          {/* Author Info */}
          <div className="md:hidden mt-6 flex flex-col  text-gray-600 text-sm">
            <span className="font-semibold">
              by{" "}
              <a href="/blog/authors/joe-hitchcock" className="hover:underline">
                Joe Hitchcock
              </a>
            </span>
            <span>
              Updated on <time>Apr 11, 2025</time>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="">
        <img
          src="https://cdn.shopify.com/s/files/1/0070/7032/articles/international_20shipping_8addcba4-b852-47f5-933e-10b77d3cf2a0.webp?v=1744388094"
          alt="A globe surrounded by shipping packages"
          className="w-full   shadow-md"
          loading="eager"
        />
      </div>
    </section>
  );
};

export default ShopifyShippingHero;

import React from 'react';

const CtaFooterBanner = () => {
  return (
    <section className="relative overflow-hidden bg-green-400 py-14 md:py-24 text-center">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-snug mb-6 text-gray-900">
          Sell anywhere with Shopify
        </h2>

        {/* Paragraph */}
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Learn on the go. Try Shopify for free, and explore all the tools you need to start, run, and grow your business.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <a
            href="https://accounts.shopify.com/store-create?locale=en&language=en&signup_page=https%3A%2F%2Fwww.shopify.com%2Fblog%2Finternational-import-shipping&signup_types%5B%5D=paid_trial_experience"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white font-semibold py-3 px-6 rounded-full text-base md:text-lg hover:bg-gray-800 transition duration-200"
          >
            Start free trial
          </a>
        </div>

        {/* Subtext */}
        <p className="text-sm text-white mt-4">
          Try Shopify for free, no credit card required.
        </p>
      </div>
    </section>
  );
};

export default CtaFooterBanner;

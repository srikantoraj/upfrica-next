import React from 'react';

const SidebarNewsletterCTA = () => {
  return (
    <aside className="w-full bg-white p-6 ">
      {/* Author + Date */}
      <div className="mb-6">
        <p className="text-gray-800 font-bold text-lg">
          by <a href="/blog/authors/joe-hitchcock" className="hover:underline text-black">Joe Hitchcock</a>
        </p>
        <p className="text-sm text-gray-500">Updated on <time>Apr 11, 2025</time></p>
      </div>

      {/* Email Signup CTA */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-xl font-semibold mb-2">The newsletter for entrepreneurs</h3>
        <p className="text-sm text-gray-700 mb-4">
          Join millions of self-starters in getting business resources, tips, and inspiring stories in your inbox.
        </p>

        <form action="/blog/api/subscribe" method="POST" className="space-y-3">
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full h-12 px-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input type="hidden" name="subscriptionId" value="DE84EF61-2A02-4778-8807-F01B108DE974" />
            <input type="hidden" name="signup_page" value="/blog/international-import-shipping" />
            <input type="hidden" name="locale" value="en-US" />
            <input type="hidden" name="blogHandle" value="blog" />
            <input type="hidden" name="form_type" value="subscribe" />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-full hover:bg-gray-800 transition"
          >
            Subscribe
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-3">
          Unsubscribe anytime. By entering your email, you agree to receive marketing emails from Shopify. By proceeding, you agree to the{' '}
          <a href="/legal/terms" target="_blank" className="underline hover:text-black">Terms</a> and{' '}
          <a href="/legal/privacy" target="_blank" className="underline hover:text-black">Privacy Policy</a>.
        </p>
      </div>

      {/* Promo Block */}
      <div className="bg-lime-600 text-white mt-12 p-6 rounded-lg">
        <h4 className="text-2xl font-bold leading-snug">
          Get the only point of sale that gives you <span className="text-lime-200">more</span>
        </h4>
        <img
          src="https://cdn.shopify.com/b/shopify-brochure2-assets/e2a124c9e2e7ae76119a66cfc515535b.png"
          alt="get in touch"
          className="my-5 w-full object-contain"
        />
        <a
          href="#contact-sales"
          className="inline-flex items-center text-white underline hover:no-underline font-medium group"
        >
          Get in touch
          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </a>
      </div>
    </aside>
  );
};

export default SidebarNewsletterCTA;

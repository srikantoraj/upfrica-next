// import React from 'react';

// const NewsletterBanner = () => {
//   return (
//     <section className="grid md:grid-cols-2 w-full bg-black text-white">
//       {/* Image Side */}
//       <div className="relative overflow-hidden h-[400px] md:h-auto">
//         <img
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           src="https://cdn.shopify.com/b/shopify-brochure2-assets/c46f986d892538f4b0a15f25692330f7.png?originalWidth=1420&originalHeight=1040"
//           alt="subscription banner"
//           loading="lazy"
//         />
//       </div>

//       {/* Text + Form Side */}
//       <div className="flex items-center px-6 md:px-10 py-16 md:py-28">
//         <div className="max-w-xl">
//           {/* Heading */}
//           <h2 className="text-3xl md:text-4xl font-medium mb-4">
//             The newsletter for entrepreneurs
//           </h2>
//           <p className="text-lg leading-relaxed mb-6">
//             Join millions of self-starters in getting business resources, tips, and inspiring stories in your inbox.
//           </p>

//           {/* Form */}
//           <form
//             action="/blog/api/subscribe"
//             method="POST"
//             className="flex flex-col space-y-4 sm:w-[406px]"
//           >
//             <div className="flex items-center bg-white rounded-full overflow-hidden border border-gray-500">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email here"
//                 required
//                 className="w-full h-14 px-6 text-black placeholder-gray-500 bg-transparent outline-none"
//               />
//               <button
//                 type="submit"
//                 className="bg-[#7BE986] text-black font-semibold px-6 py-2 rounded-full hover:bg-green-400 transition"
//               >
//                 Subscribe
//               </button>
//             </div>

//             {/* Hidden inputs */}
//             <input type="hidden" name="subscriptionId" value="DE84EF61-2A02-4778-8807-F01B108DE974" />
//             <input type="hidden" name="signup_page" value="/blog/international-import-shipping" />
//             <input type="hidden" name="locale" value="en-US" />
//             <input type="hidden" name="blogHandle" value="blog" />
//             <input type="hidden" name="form_type" value="subscribe" />
//           </form>

//           {/* Disclaimer */}
//           <p className="text-xs text-white opacity-80 pt-4 max-w-md">
//             Unsubscribe anytime. By entering your email, you agree to receive marketing emails from Shopify.
//             By proceeding, you agree to the{' '}
//             <a href="/legal/terms" target="_blank" className="underline hover:text-green-400">
//               Terms and Conditions
//             </a>{' '}
//             and{' '}
//             <a href="/legal/privacy" target="_blank" className="underline hover:text-green-400">
//               Privacy Policy
//             </a>.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsletterBanner;

// import React from 'react';

// const NewsletterBanner = () => {
//   return (
//     <section className="grid md:grid-cols-2 w-full bg-black text-white">
//       {/* Image Side */}
//       <div className="relative h-[300px] md:h-auto overflow-hidden">
//         <img
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           src="https://cdn.shopify.com/b/shopify-brochure2-assets/c46f986d892538f4b0a15f25692330f7.png?originalWidth=1420&originalHeight=1040"
//           alt="Newsletter Banner"
//           loading="lazy"
//         />
//       </div>

//       {/* Content Side */}
//       <div className="flex items-center px-6 md:px-12 lg:px-20 py-14 md:py-24 bg-black">
//         <div className="max-w-xl w-full">
//           {/* Heading */}
//           <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
//             The newsletter for entrepreneurs
//           </h2>
//           <p className="text-lg md:text-xl text-white mb-8">
//             Join millions of self-starters in getting business resources, tips, and inspiring stories in your inbox.
//           </p>

//           {/* Form */}
//           <form
//             action="/blog/api/subscribe"
//             method="POST"
//             className="w-full space-y-3"
//           >
//             <div className="flex flex-col sm:flex-row sm:items-center bg-white rounded-full overflow-hidden border border-gray-500 shadow-lg">
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 placeholder="Enter your email"
//                 className="text-black w-full h-14 px-6 text-sm outline-none"
//               />
//               <button
//                 type="submit"
//                 className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 py-3 sm:py-0 sm:h-14 transition-all duration-200"
//               >
//                 Subscribe
//               </button>
//             </div>

//             {/* Hidden fields */}
//             <input type="hidden" name="subscriptionId" value="DE84EF61-2A02-4778-8807-F01B108DE974" />
//             <input type="hidden" name="signup_page" value="/blog/international-import-shipping" />
//             <input type="hidden" name="locale" value="en-US" />
//             <input type="hidden" name="blogHandle" value="blog" />
//             <input type="hidden" name="form_type" value="subscribe" />
//           </form>

//           {/* Disclaimer */}
//           <p className="text-xs text-gray-400 mt-4">
//             Unsubscribe anytime. By entering your email, you agree to receive marketing emails from Shopify.
//             By proceeding, you agree to the{' '}
//             <a href="/legal/terms" target="_blank" className="underline hover:text-white">
//               Terms and Conditions
//             </a>{' '}
//             and{' '}
//             <a href="/legal/privacy" target="_blank" className="underline hover:text-white">
//               Privacy Policy
//             </a>.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsletterBanner;

import React from "react";

const NewsletterBanner = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 w-full bg-black text-white">
      {/* Image Side */}
      <div className="relative h-[250px] sm:h-[300px] md:h-auto overflow-hidden hidden lg:block">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://cdn.shopify.com/b/shopify-brochure2-assets/c46f986d892538f4b0a15f25692330f7.png?originalWidth=1420&originalHeight=1040"
          alt="Newsletter Banner"
          loading="lazy"
        />
      </div>

      {/* Content Side */}
      <div className="flex items-center px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-14 md:py-24 bg-black">
        <div className="max-w-xl w-full">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
            The newsletter for entrepreneurs
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8">
            Join millions of self-starters in getting business resources, tips,
            and inspiring stories in your inbox.
          </p>

          {/* Form */}
          <form
            action="/blog/api/subscribe"
            method="POST"
            className="w-full space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center md:bg-white md:rounded-full overflow-hidden md:border border-gray-500 shadow-lg">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="text-black w-full h-12 sm:h-14 px-4 sm:px-6 text-sm outline-none rounded-full md:rounded-none"
              />
              <button
                type="submit"
                className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 py-3 sm:py-0 sm:h-14 transition-all rounded-full md:rounded-none duration-200"
              >
                Subscribe
              </button>
            </div>

            {/* Hidden fields */}
            <input
              type="hidden"
              name="subscriptionId"
              value="DE84EF61-2A02-4778-8807-F01B108DE974"
            />
            <input
              type="hidden"
              name="signup_page"
              value="/blog/international-import-shipping"
            />
            <input type="hidden" name="locale" value="en-US" />
            <input type="hidden" name="blogHandle" value="blog" />
            <input type="hidden" name="form_type" value="subscribe" />
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 mt-4">
            Unsubscribe anytime. By entering your email, you agree to receive
            marketing emails from Shopify. By proceeding, you agree to the{" "}
            <a
              href="/legal/terms"
              target="_blank"
              className="underline hover:text-white"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="/legal/privacy"
              target="_blank"
              className="underline hover:text-white"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;

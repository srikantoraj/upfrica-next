// 'use client';

// import React from 'react';
// import Link from 'next/link';

// const ShopifyBanner = () => {
//   return (
//     <div className="relative overflow-hidden bg-[url('/images/marketing-bg.jpg')] bg-cover bg-center py-16 px-4 text-center">
//       <div className="container relative flex flex-col items-center">
//         {/* Heading */}
//         <p className="uppercase font-medium text-2xl tablet:text-3xl max-w-xl mb-2">
//           Start selling with Shopify today
//         </p>

//         {/* Subheading */}
//         <p className="max-w-xl text-sm mb-4">
//           Start your free trial with Shopify today—then use these resources to guide you through every step of the process.
//         </p>

//         {/* Buttons */}
//         <div className="z-20 relative flex flex-wrap gap-4 justify-center">
//           <a
//             href="https://accounts.shopify.com/store-create?locale=en&language=en"
//             className="px-5 py-2 border-2 border-green-600 text-green-700 bg-white rounded hover:bg-green-50 transition font-semibold"
//           >
//             Start free trial
//           </a>
//           <Link
//             href="/"
//             className="px-5 py-2 border-2 border-gray-400 text-gray-700 bg-white rounded hover:bg-gray-50 transition font-semibold"
//           >
//             Learn more
//           </Link>
//         </div>

//         {/* Decorative Images */}
//         <img
//           src="https://cdn.shopify.com/b/shopify-brochure2-assets/b57973373cb5af3ba8e59f0b966065e7.webp"
//           alt=""
//           className="absolute left-[-26px] bottom-[-20px] tablet:left-0 tablet:bottom-[-60px] w-[90px] tablet:w-[136px] desktop:w-[175px] rounded-[15px] z-10"
//           loading="lazy"
//         />
//         <div className="absolute right-0 top-[-25px] tablet:right-[-20px] tablet:top-[-30px] desktop:right-[20px] desktop:top-[-40px] w-[90px] h-[85px] tablet:w-[136px] tablet:h-[140px] desktop:w-[175px] desktop:h-[180px] overflow-hidden rounded-[15px] z-10">
//           <img
//             src="https://cdn.shopify.com/b/shopify-brochure2-assets/05383e2e9b6568812f1ccc7bbc28ac3d.webp"
//             alt=""
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//         </div>
//         <img
//           src="https://cdn.shopify.com/b/shopify-brochure2-assets/2baeeeb3c9bab2dfbfac6428fad929e1.webp"
//           alt=""
//           className="absolute bottom-[20px] right-[-50px] tablet:bottom-[-50px] tablet:right-[-70px] desktop:bottom-[-70px] desktop:right-[-100px] w-[90px] tablet:w-[136px] desktop:w-[175px] rounded-[15px] z-10"
//           loading="lazy"
//         />
//       </div>
//     </div>
//   );
// };

// export default ShopifyBanner;

import React from "react";

const BlogHeaderBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 container">
      <div className="relative flex flex-col items-center text-center px-6 pt-16 pb-12 md:pt-12 md:px-20 lg:px-40 ">
        {/* Heading */}
        <h2 className="uppercase font-semibold text-2xl md:text-3xl lg:text-4xl max-w-2xl mb-2 text-gray-900 leading-snug">
          Start selling with Shopify today
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-700 max-w-xl mb-6">
          Start your free trial with Shopify today—then use these resources to
          guide you through every step of the process.
        </p>

        {/* Button Group */}
        <div className="flex flex-wrap justify-center gap-3 z-20 relative">
          <a
            href="https://accounts.shopify.com/store-create?locale=en&language=en&signup_page=https%3A%2F%2Fwww.shopify.com%2Fblog%2Finternational-import-shipping&signup_types%5B%5D=paid_trial_experience"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition"
          >
            Start free trial
          </a>
          <a
            href="/"
            className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-100 transition"
          >
            Learn more
          </a>
        </div>

        {/* Floating Decorative Images */}
        <img
          src="https://cdn.shopify.com/b/shopify-brochure2-assets/b57973373cb5af3ba8e59f0b966065e7.webp"
          alt=""
          className="absolute w-[90px] md:w-[136px] lg:w-[175px] bottom-[-20px] md:bottom-[-60px] left-[-26px] md:left-0 z-10 rounded-xl"
        />
        <div className="absolute w-[90px] md:w-[136px] lg:w-[175px] h-[85px] md:h-[140px] lg:h-[180px] right-0 md:right-[-20px] lg:right-[20px] top-[-25px] md:top-[-30px] lg:top-[-40px] overflow-hidden rounded-xl z-10">
          <img
            src="https://cdn.shopify.com/b/shopify-brochure2-assets/05383e2e9b6568812f1ccc7bbc28ac3d.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <img
          src="https://cdn.shopify.com/b/shopify-brochure2-assets/2baeeeb3c9bab2dfbfac6428fad929e1.webp"
          alt=""
          className="absolute w-[90px] md:w-[136px] lg:w-[175px] bottom-[20px] md:bottom-[-50px] lg:bottom-[-70px] right-[-50px] md:right-[-70px] lg:right-[-100px] z-10 rounded-xl"
        />
      </div>
    </section>
  );
};

export default BlogHeaderBanner;

// import React from "react";

// const tocLinks = [
//   { href: "#h2_what_is_ai__", label: "What is AI?" },
//   {
//     href: "#h2_how_fashion_brands_are_using_ai_to_sell_more_online",
//     label: "How fashion brands are using AI to sell more online",
//   },
//   { href: "#h2_harnessing_the_power_of_ai_on_bigcommerce", label: "Harnessing the power of AI on BigCommerce" },
//   { href: "#h2_the_final_word", label: "The final word" },
// ];

// const TableOfContents = () => {
//   return (
//     <div className="sticky top-[150px] h-max min-h-[200px]">
//       <div className="grid gap-2">
//         <h6 className="text-xs text-gray-500 uppercase mb-5">Table of Contents</h6>
//         <ul className="space-y-5">
//           {tocLinks.map((link, index) => (
//             <li key={index}>
//               <a
//                 href={link.href}
//                 className="text-base text-gray-600 hover:border-b-2 border-bc-blue font-medium transition-all"
//               >
//                 {link.label}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TableOfContents;

import React from "react";

const TableOfContents = () => {
  return (
    <aside className="w-full md:w-64 sticky top-[150px] h-max min-h-[200px]">
      <div className="space-y-8">
        {/* Table of Contents */}
        <div className="space-y-2">
          <h6 className="uppercase text-xs tracking-wider text-gray-500 mb-5">
            Table of Contents
          </h6>
          <ul className="space-y-5">
            <li>
              <a
                href="#h2_what_is_ai__"
                className="text-base text-gray-600 hover:border-b-2 border-blue-500"
              >
                What is AI?
              </a>
            </li>
            <li>
              <a
                href="#h2_how_fashion_brands_are_using_ai_to_sell_more_online"
                className="text-base text-gray-600 hover:border-b-2 border-blue-500"
              >
                How fashion brands are using AI to sell more online
              </a>
            </li>
            <li>
              <a
                href="#h2_harnessing_the_power_of_ai_on_bigcommerce"
                className="text-base text-gray-600 hover:border-b-2 border-blue-500"
              >
                Harnessing the power of AI on BigCommerce
              </a>
            </li>
            <li>
              <a
                href="#h2_the_final_word"
                className="text-base text-gray-600 hover:border-b-2 border-blue-500"
              >
                The final word
              </a>
            </li>
          </ul>
        </div>

        {/* Share this article */}
        <div>
          <span className="uppercase text-xs font-medium text-gray-900">
            Share this article
          </span>
          <ul className="flex flex-wrap gap-2 mt-3 text-blue-600">
            <li>
              <a
                href="https://twitter.com/intent/tweet?text=AI%20Is%20Reshaping%20How%20Fashion%20Brands%20Do%20Business%20Online%20&url=https%3A%2F%2Fwww.bigcommerce.com%2Fblog%2Fai-reshaping-fashion-industry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Zm5.957-14.217a2.42 2.42 0 0 1-1 1.35 4.31 4.31 0 0 0 1.307-.384 4.81 4.81 0 0 1-1.136 1.264c.004.104.005.21.005.316 0 3.226-2.289 6.946-6.478 6.946a6.139 6.139 0 0 1-3.49-1.097 4.378 4.378 0 0 0 3.371-1.011c-.997-.019-1.838-.726-2.127-1.695.138.029.282.043.428.043.209 0 .41-.029.6-.086-1.042-.223-1.827-1.21-1.827-2.393v-.03a2.17 2.17 0 0 0 1.032.305c-.61-.439-1.013-1.186-1.013-2.032 0-.447.112-.867.308-1.228C7.061 7.529 8.74 8.499 10.631 8.6a2.594 2.594 0 0 1-.058-.556c0-1.348 1.018-2.44 2.276-2.44.655 0 1.247.296 1.662.77a4.375 4.375 0 0 0 1.446-.592Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>

            {/* Repeat other social icons the same way: LinkedIn, Facebook, Email, Reddit, WhatsApp */}

            {/* Example LinkedIn */}
            <li>
              <a
                href="https://www.linkedin.com/shareArticle?url=https%3A%2F%2Fwww.bigcommerce.com%2Fblog%2Fai-reshaping-fashion-industry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10ZM7.623 7.826H5.738v6.569h1.885V7.826ZM6.62 7.004h.014c.708 0 1.15-.504 1.15-1.14-.014-.648-.442-1.139-1.137-1.139-.696 0-1.151.493-1.151 1.141 0 .636.442 1.138 1.124 1.138Zm6.409 7.392h2.137v-3.654c0-2.034-1.053-2.979-2.392-2.979-1.08 0-1.756.643-1.882 1.094v-1.03H8.774c.027.546 0 6.569 0 6.569h2.117V10.77c0-.174-.002-.342.046-.466.146-.396.459-.805 1.021-.805.735 0 1.07.607 1.07 1.497v3.4Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default TableOfContents;


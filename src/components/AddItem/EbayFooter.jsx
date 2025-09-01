import React from "react";

export default function EbayFooter() {
  const footerLinks = [
    { label: "About eBay", href: "https://www.ebayinc.com/our-company/" },
    {
      label: "Announcements",
      href: "https://community.ebay.co.uk/t5/Announcements/bg-p/Announcements",
    },
    { label: "Community", href: "https://community.ebay.co.uk" },
    {
      label: "Safety Centre",
      href: "https://pages.ebay.co.uk/safetycentre/index.html",
    },
    { label: "Seller Centre", href: "https://www.ebay.co.uk/sellercentre" },
    {
      label: "VeRO: Protecting Intellectual Property",
      href: "https://pages.ebay.co.uk/vero/index.html",
    },
    {
      label: "Policies",
      href: "https://www.ebay.co.uk/help/policies/az-index/az-index-policies?id=4649",
    },
    {
      label: "Product Safety Tips",
      href: "http://pages.ebay.co.uk/safetytips",
    },
    { label: "Help & Contact", href: "https://www.ebay.co.uk/help/home" },
    { label: "Site Map", href: "https://pages.ebay.co.uk/sitemap.html" },
  ];

  return (
    <footer className="bg-gray-50 border-t text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top link row */}
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-sm text-gray-700">
          {footerLinks.map((link, idx) => (
            <li key={idx}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Legal disclaimer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>
            © 1995-2025 eBay Inc. All Rights Reserved.{" "}
            <a
              href="https://www.ebay.co.uk/help/policies/member-behaviour-policies/user-agreement?id=4259"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              User Agreement
            </a>
            ,{" "}
            <a
              href="https://www.ebay.co.uk/help/policies/member-behaviour-policies/user-privacy-notice-privacy-policy?id=4260"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
            ,{" "}
            <a
              href="https://pages.ebay.co.uk/payment/2.0/terms.html"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Payments Terms of Use
            </a>
            ,{" "}
            <a
              href="https://www.ebay.co.uk/help/policies/member-behaviour-policies/ebay-cookie-notice?id=4267"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cookies
            </a>{" "}
            and{" "}
            <a
              href="https://www.ebay.co.uk/adchoice"
              className="hover:underline inline-flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              AdChoice
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-1"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0a8 8 0 108 8A8 8 0 008 0zm.93 12.588h-1.8v-1.8h1.8zm1.307-6.323a2.312 2.312 0 00-.516-.89 2.247 2.247 0 00-.822-.528 3.414 3.414 0 00-1.066-.169 3.1 3.1 0 00-1.23.247 2.277 2.277 0 00-.902.703 1.753 1.753 0 00-.325.961h1.86a.881.881 0 01.158-.417.87.87 0 01.32-.276 1.107 1.107 0 01.485-.105 1.148 1.148 0 01.589.14.659.659 0 01.264.564.825.825 0 01-.11.406 2.07 2.07 0 01-.379.46c-.21.198-.395.374-.553.528a2.706 2.706 0 00-.426.53 1.615 1.615 0 00-.222.704v.243h1.8v-.12a1.2 1.2 0 01.13-.487 2.021 2.021 0 01.31-.429c.162-.178.34-.355.532-.528a3.151 3.151 0 00.544-.627 1.622 1.622 0 00.219-.872 2.04 2.04 0 00-.148-.761z" />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

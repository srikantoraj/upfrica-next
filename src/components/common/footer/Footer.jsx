// src/components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { FaCartPlus, FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail, MdSell } from "react-icons/md";

export default function Footer() {
  return (
    <div className="bg-black">
      <footer className="container mx-auto py-10 px-4 2xl:px-0 text-white">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Branding & Contact Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Upfrica - BD</h2>
            <p className="text-sm text-gray-300">
              Online Shopping in Ghana, Nigeria, UK for quality items at discounted prices.
              Sell, deliver, process payments, and grow your business.
              Buy &amp; sell African products, electronics, machines &amp; related products.
            </p>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-gray-300 hover:text-purple-500 cursor-pointer">
                <FaWhatsapp className="w-5 h-5" /> +44 7466800672
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-300 hover:text-purple-500 cursor-pointer">
                <MdOutlineEmail className="w-5 h-5" /> email us
              </p>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Page Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-wide">Page</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-purple-500">
                  <Link href="/deals">Deals</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/listings">Listings</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/about">About Us</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/blog">News &amp; Blog</Link>
                </li>
              </ul>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-wide">Links</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-purple-500">
                  <Link href="/signup">Sign up</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/signin">Sign in</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/terms">Terms</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/support">Support</Link>
                </li>
              </ul>
            </div>

            {/* Countries Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-wide">Countries</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-purple-500">
                  <Link href="/ghana">Ghana</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/united-kingdom">United Kingdom</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/nigeria">Nigeria</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/global">Global</Link>
                </li>
              </ul>
            </div>

            {/* Quick Links Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-wide">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-purple-500">
                  <Link href="/sales" className="flex items-center">
                    <MdSell className="mr-2 w-5 h-5" /> Sales on Upfrica
                  </Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/orders" className="flex items-center">
                    <FaCartPlus className="mr-2 w-5 h-5" /> Orders
                  </Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment & Security Section */}
        <div className="mt-10 border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Ghana HQ</h3>
              <p className="text-sm text-gray-400">
                Upfrica - African Marketplace BD. All rights reserved.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Payment &amp; Security</h3>
              <div className="flex gap-4">
                <Image
                  className="rounded"
                  src="https://d26ukeum83vx3b.cloudfront.net/assets/momo-f05ddc4de74168553b74a880e7f960a1a9854e3110b5696256500f4d8f3ee1fa.jpeg"
                  alt="Mobile Money"
                  width={56}
                  height={40}
                />
                <Image
                  className="rounded"
                  src="https://d26ukeum83vx3b.cloudfront.net/assets/visa-d303de42ebf4fbc0e8fd0e3b7f92f203822cdbbc123bc27214283acdd1fdafa7.svg"
                  alt="Visa"
                  width={56}
                  height={40}
                />
                <Image
                  className="rounded"
                  src="https://d26ukeum83vx3b.cloudfront.net/assets/mastercard-23b4badc9b2f83763ca268da7a89378d3a9732066d23f7683ecf24b5bde0f06f.svg"
                  alt="Mastercard"
                  width={56}
                  height={40}
                />
                <Image
                  className="rounded"
                  src="https://d26ukeum83vx3b.cloudfront.net/assets/expresscard-95d23c429de33f9f60a52390d788eae22f1f625648b4e587e87449c8304bd357.svg"
                  alt="ExpressCard"
                  width={56}
                  height={40}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

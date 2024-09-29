// src/components/Footer.tsx

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export default function Footer() {
  const datas = [
    { title: "Home", id: 1 },
    { title: "Browse", id: 2 },
    { title: "Deals", id: 3 },
    { title: "Shops", id: 4 },
    { title: "Categories", id: 5 },
    { title: "How It Works", id: 6 },
    { title: "UK Site", id: 7 },
  ];

  return (
    <div className="bg-black">
      <footer className="container mx-auto p-10 text-white text-xl tracking-wide">
        <div className="grid sm:grid-cols-1 sm:gap-10 md:grid-cols-1 lg:grid-cols-4 lg:gap-10">
          {/* First Section */}
          <nav className="space-y-4 sm:col-span-1 md:col-span-1 lg:col-span-1 text-base">
            <h6 className="text-2xl font-bold">Upfrica - BD</h6>
            <p>
              Online Shopping in Ghana, Nigeria, UK for quality items at
              discounted prices - Sell, deliver, process payments and grow your
              business - Buy & sell African products, electronics, machines &
              related products.
            </p>
            <p className="flex gap-1 items-center">
              <FaWhatsapp className="h-6 w-6" />
              <span>+44 7466800672</span>
            </p>
            <p className="flex gap-1 items-center">
              <MdOutlineEmail className="h-6 w-6" />
              <span>email us</span>
            </p>
          </nav>

          {/* Remaining Sections */}
          <div className="sm:grid grid-cols-2 sm:gap-4 md:grid-cols-4 lg:grid-cols-4 gap-10 sm:pt-2 text-base py-4">
            {/* Page Section */}
            <nav className="space-y-4">
              <h6 className="text-2xl font-bold tracking-wide">Page</h6>
              <ul className="space-y-2">
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
                  <Link href="/blog">New and Blog</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/deals">Deals</Link>
                </li>
              </ul>
            </nav>

            {/* Link Section */}
            <nav className="space-y-4">
              <h6 className="text-2xl font-bold tracking-wide">Link</h6>
              <ul className="space-y-2">
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
            </nav>

            {/* Countries Section */}
            <nav className="space-y-4">
              <h6 className="text-2xl font-bold tracking-wide">Countries</h6>
              <ul className="space-y-2">
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
            </nav>

            {/* Quick Links Section */}
            <nav className="space-y-4">
              <h6 className="text-2xl font-bold tracking-wide">Quick Links</h6>
              <ul className="space-y-2">
                <li className="hover:text-purple-500">
                  <Link href="/sales">Sales on Upfrica</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/orders">Orders</Link>
                </li>
                <li className="hover:text-purple-500">
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Payment & Security Section */}
          <div className="my-10 md:my-4 lg:col-span-1">
            <p className="py-10 leading-8">
              Upfrica - African Marketplace BD. All rights reserved.
            </p>
            <p className="text-xl font-bold">Payment & Security</p>
            <div className="flex gap-2 mt-2">
              <Image
                className="h-10 w-14 rounded"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/momo-f05ddc4de74168553b74a880e7f960a1a9854e3110b5696256500f4d8f3ee1fa.jpeg"
                alt="Mobile Money"
                width={56} // Adjust based on actual image dimensions
                height={40}
              />
              <Image
                className="h-10 w-14 rounded"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/visa-d303de42ebf4fbc0e8fd0e3b7f92f203822cdbbc123bc27214283acdd1fdafa7.svg"
                alt="Visa"
                width={56}
                height={40}
              />
              <Image
                className="h-10 w-14 rounded"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/mastercard-23b4badc9b2f83763ca268da7a89378d3a9732066d23f7683ecf24b5bde0f06f.svg"
                alt="Mastercard"
                width={56}
                height={40}
              />
              <Image
                className="h-10 w-14 rounded"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/expresscard-95d23c429de33f9f60a52390d788eae22f1f625648b4e587e87449c8304bd357.svg"
                alt="ExpressCard"
                width={56}
                height={40}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

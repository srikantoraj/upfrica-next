// pages/shopping.js
import Footer from "@/components/common/footer/Footer";
import Head from "next/head";
import Link from "next/link";
// Import React icons from Font Awesome (ensure this library is installed)
import {
    FaShoppingCart,
    FaCreditCard,
    FaClipboardList,
    FaList,
    FaMoneyCheckAlt,
    FaBullhorn,
    FaStore,
    FaUser,
} from "react-icons/fa";

export default function Shopping() {
    return (
        <>
            <Head>
                <title>Help Center - Shopping on Upfrica</title>
                <meta
                    name="description"
                    content="Explore help articles and support on shopping and gifting on Upfrica."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* Additional meta tags or favicon links can be added here */}
            </Head>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                {/* Header with background image and dark overlay */}
                <header
                    style={{
                        backgroundImage:
                            'url("https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="relative text-white pt-8 pb-4"
                >
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
                        {/* Skip Link */}
                        <a href="#content" className="sr-only">
                            Skip to content
                        </a>
                        {/* Logo using Upfrica image */}
                        <div className="flex items-center">
                            <Link href="/help" className="flex items-center">
                                <img
                                    src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
                                    alt="Upfrica Logo"
                                    className="h-10"
                                />
                            </Link>
                        </div>
                        {/* Sign-in Button */}
                        <div className="hidden lg:block">
                            <a
                                href="https://www.Upfrica.com/sso-forced/zendesk?return_to=https://help.Upfrica.com/hc/en-us?segment=shopping"
                                className="inline-block"
                            >
                                <button className="border border-white rounded-full px-3 py-1">
                                    Sign in
                                </button>
                            </a>
                        </div>
                    </div>
                    {/* Hero Banner with search */}
                    <section className="relative text-center mt-8 p-2 mb-8">
                        <h1 className="text-4xl font-semibold text-white mb-4">
                            How can we help?
                        </h1>
                        <div className="max-w-lg mx-auto">
                            <form action="/hc/search" method="get" className="relative">
                                <input
                                    type="search"
                                    name="query"
                                    placeholder="Type your question"
                                    className="w-full pl-4 pr-12 py-3 rounded-full border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-700"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full px-4"
                                    aria-label="Search"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm11 4l-4-4"
                                        />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </section>
                </header>



                {/* Navigation Tabs */}
                <nav className="bg-white border-b ">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center space-x-4">
                            <button className="flex items-center px-4 py-2 text-violet-700 font-bold border-b-2 border-violet-700 rounded-t-none border-b">
                                {/* Shopping icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 5.6a1 1 0 00.99 1.4h12.82a1 1 0 00.99-1.4L17 13M7 13l4-8"
                                    />
                                </svg>
                                Shopping on Upfrica
                            </button>
                            <button className="flex items-center px-3 py-1 text-gray-600 hover:text-violet-700 rounded-t-none border-b">
                                Selling with Upfrica
                            </button>
                        </div>
                    </div>
                </nav>

               

                {/* Main Content */}
                
                    {/* Featured Articles Section */}
                    <section className="mb-12 container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Featured articles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Example Article 1 */}
                            <a
                                href="https://help.Upfrica.com/hc/en-us/articles/24858135478039-What-is-Upfrica-Insider?segment=shopping"
                                className="block p-4 bg-white rounded shadow hover:shadow-lg transition"
                            >
                                <p className="text-gray-500 text-xs mb-1">
                                    Shopping &amp; Gifting
                                </p>
                                <h3 className="text-lg font-bold text-gray-900">
                                    What is Upfrica Insider?
                                </h3>
                            </a>
                            {/* Example Article 2 */}
                            <a
                                href="https://help.Upfrica.com/hc/en-us/articles/115015521948-What-s-the-Status-of-My-Order?segment=shopping"
                                className="block p-4 bg-white rounded shadow hover:shadow-lg transition"
                            >
                                <p className="text-gray-500 text-xs mb-1">After You Purchase</p>
                                <h3 className="text-lg font-bold text-gray-900">
                                    What’s the Status of My Order?
                                </h3>
                            </a>
                            {/* Example Article 3 */}
                            <a
                                href="https://help.Upfrica.com/hc/en-us/articles/115013328428-How-to-Contact-a-Shop?segment=shopping"
                                className="block p-4 bg-white rounded shadow hover:shadow-lg transition"
                            >
                                <p className="text-gray-500 text-xs mb-1">
                                    Shopping &amp; Gifting
                                </p>
                                <h3 className="text-lg font-bold text-gray-900">
                                    How to Contact a Shop
                                </h3>
                            </a>
                        </div>
                </section>
                
                {/* Additional Call-to-Actions */}
                <section className="bg-gray-100 py-8">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-semibold mb-4">
                            Didn't find what you needed? Try these.
                        </h2>
                        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                            <a
                                href="https://www.Upfrica.com/your/purchases?ref=enhc"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="bg-violet-700 text-white px-4 py-2 rounded-full">
                                    Help with an order
                                </button>
                            </a>
                            <a
                                id="contact-us-link"
                                href="https://www.Upfrica.com/help/contact?ref=enhc"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="bg-transparent border border-violet-700 text-violet-700 px-4 py-2 rounded-full">
                                    Contact Upfrica Support
                                </button>
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <a
                                    href="https://www.Upfrica.com/legal?ref=enhc"
                                    className="text-violet-600 hover:underline"
                                >
                                    Read our Policies
                                </a>
                                <p className="text-gray-600">
                                    Get the ins and outs of buying and selling on Upfrica
                                </p>
                            </div>
                            <div>
                                <a
                                    href="https://community.Upfrica.com/t5/Upfrica-Forums/ct-p/forums"
                                    className="text-violet-600 hover:underline"
                                >
                                    Ask in the forums
                                </a>
                                <p className="text-gray-600">
                                    Learn from our large and knowledgeable community
                                </p>
                            </div>
                            <div>
                                <a
                                    href="https://www.Upfrica.com/blog?ref=hc_Upfrica_journal"
                                    className="text-violet-600 hover:underline"
                                >
                                    Check out the Upfrica Journal
                                </a>
                                <p className="text-gray-600">
                                    Explore ideas and inspiration for creative living
                                </p>
                            </div>

                        </div>
                    </div>
                </section>



                    {/* Shop on Upfrica Categories */}
                    <section className="mb-12 container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-semibold text-center mb-8">
                            Shop on Upfrica
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Card: Buying on Upfrica */}
                            <div className="flex items-start p-4 bg-white  shadow hover:shadow-lg transition">
                                <FaShoppingCart className="w-12 h-12 mr-4" />
                                <div>
                                    <h3 className="text-lg font-bold mb-2">
                                        <a
                                            href="https://help.Upfrica.com/hc/en-us/sections/360003399734-Buying-on-Upfrica?segment=shopping#360003399734"
                                            className="hover:underline text-gray-900"
                                        >
                                            Buying on Upfrica
                                        </a>
                                    </h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000067287-Shopping-Gifting?segment=shopping#360000067287"
                                                className="hover:underline"
                                            >
                                                Shopping &amp; Gifting
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000067207-Searching-for-Items?segment=shopping#360000067207"
                                                className="hover:underline"
                                            >
                                                Searching for Items
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000066488-Buying-Safely?segment=shopping#360000066488"
                                                className="hover:underline"
                                            >
                                                Buying Safely
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Card: Cart & Payment */}
                            <div className="flex items-start p-4 bg-white  shadow hover:shadow-lg transition">
                                <FaCreditCard className="w-12 h-12 mr-4" />
                                <div>
                                    <h3 className="text-lg font-bold mb-2">
                                        <a
                                            href="https://help.Upfrica.com/hc/en-us/sections/360003399714-Cart-Payment?segment=shopping#360003399714"
                                            className="hover:underline text-gray-900"
                                        >
                                            Cart &amp; Payment
                                        </a>
                                    </h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/13078880245655-Using-Gift-Cards-Coupons?segment=shopping#13078880245655"
                                                className="hover:underline"
                                            >
                                                Using Gift Cards &amp; Coupons
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/13078841132439-Taxes-Customs-Fees?segment=shopping#13078841132439"
                                                className="hover:underline"
                                            >
                                                Taxes &amp; Customs Fees
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000067187-Checkout?segment=shopping#360000067187"
                                                className="hover:underline"
                                            >
                                                Checkout
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000067227-Payment-Options?segment=shopping#360000067227"
                                                className="hover:underline"
                                            >
                                                Payment Options
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Card: Your Orders */}
                            <div className="flex items-start p-4 bg-white shadow hover:shadow-lg transition">
                                <FaClipboardList className="w-12 h-12 mr-4" />
                                <div>
                                    <h3 className="text-lg font-bold mb-2">
                                        <a
                                            href="https://help.Upfrica.com/hc/en-us/sections/360003399694-Your-Orders?segment=shopping#360003399694"
                                            className="hover:underline text-gray-900"
                                        >
                                            Your Orders
                                        </a>
                                    </h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000067247-After-You-Purchase?segment=shopping#360000067247"
                                                className="hover:underline"
                                            >
                                                After You Purchase
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000066548-Order-Issues-Returns?segment=shopping#360000066548"
                                                className="hover:underline"
                                            >
                                                Order Issues &amp; Returns
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Card: Listings */}
                            <div className="flex items-start p-4 bg-white  shadow hover:shadow-lg transition">
                                <FaList className="w-12 h-12 mr-4" />
                                <div>
                                    <h3 className="text-lg font-bold mb-2">
                                        <a
                                            href="https://help.Upfrica.com/hc/en-us/sections/360003451133-Listings?segment=shopping#360003451133"
                                            className="hover:underline text-gray-900"
                                        >
                                            Listings
                                        </a>
                                    </h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000066268-Creating-a-Listing?segment=shopping#360000066268"
                                                className="hover:underline"
                                            >
                                                Creating a Listing
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000066288-Listing-Management?segment=shopping#360000066288"
                                                className="hover:underline"
                                            >
                                                Listing Management
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000066967-Listing-Photos?segment=shopping#360000066967"
                                                className="hover:underline"
                                            >
                                                Listing Photos
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://help.Upfrica.com/hc/en-us/sections/360000066308-Optimizing-Your-Listings-for-Upfrica-Search?segment=shopping#360000066308"
                                                className="hover:underline"
                                            >
                                                Optimizing Your Listings for Search
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </section>
               

                {/* Separate “Help with an order” Section */}
                <section className="  text-center">
                    <div className="bg-violet-700 py-8 lg:py-10 px-6 w-full">
                        <p className="text-white text-sm">
                            Having problems with an order? Reach out to the seller with a help
                            request.
                        </p>
                        <a
                            href="/help"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block w-full"
                        >
                            <button className="bg-white text-violet-700 px-4 py-2 rounded-full">
                                Help with an order
                            </button>
                        </a>
                    </div>
                </section>
               

               <Footer/>
            </div>
        </>
    );
}

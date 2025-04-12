// pages/delivery-information.js
import MainArticle from "@/components/help/MainArticle";
import Sidebar from "@/components/help/Sidebar";
import Head from "next/head";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function DeliveryInformation() {
    return (
        <>
            <Head>
                <title>Help Center – Selling on Etsy</title>
                <meta
                    name="description"
                    content="Learn how to set up delivery information for your listings on Etsy."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="container min-h-screen bg-gray-50 text-gray-900">
                {/* Cookie Consent Banner */}
                <div className="bg-gray-100 border-b border-gray-300">
                    <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm text-gray-700">
                        <span>By browsing Etsy you agree to our use of cookies.</span>
                        <button className="font-bold hover:text-gray-900 transition">
                            Dismiss
                        </button>
                    </div>
                </div>

                {/* Header with Background Image & Gradient Overlay */}
                <header className="relative">
                    <div
                        className="h-64 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                'url("https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
                        }}
                    ></div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
                    <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4">
                        <div className="flex justify-between items-center">
                            {/* Logo & Help Centre */}
                            <Link href="/help" className="flex items-center">
                                <img
                                    src="/hc/theming_assets/etsy-logo.png"
                                    alt="Etsy Logo"
                                    className="h-10"
                                />
                                <span className="ml-2 text-white text-2xl font-semibold">
                                    Help Centre
                                </span>
                            </Link>
                            {/* Sign In Button */}
                            <div className="hidden lg:block">
                                <a
                                    href="https://www.etsy.com/sso-forced/zendesk?return_to=https://help.etsy.com"
                                    className="inline-block"
                                >
                                    <button className="px-4 py-2 border border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition">
                                        Sign in
                                    </button>
                                </a>
                            </div>
                        </div>
                        {/* Search Bar */}
                        <div className="mt-8 flex justify-center">
                            <form
                                action="/hc/search"
                                method="get"
                                className="w-full max-w-lg relative"
                            >
                                <input
                                    type="search"
                                    name="query"
                                    placeholder="Type your question"
                                    className="w-full rounded-full border border-violet-700 py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-700"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full px-4 flex items-center justify-center"
                                    aria-label="Search"
                                >
                                    <FaSearch className="text-gray-600 h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <nav className="bg-white shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center space-x-6 py-3">
                            <Link
                                href="/hc?segment=shopping"
                                className="text-gray-600 hover:text-violet-700 border-b-2 border-transparent hover:border-violet-700 transition"
                            >
                                Shopping on Etsy
                            </Link>
                            <Link
                                href="/hc?segment=selling"
                                className="text-violet-700 font-semibold border-b-2 border-violet-700"
                            >
                                Selling with Etsy
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Breadcrumbs */}
                <div className="bg-gray-100">
                    <div className="container mx-auto px-4 py-3">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li>
                                <Link href="/hc" className="hover:underline">
                                    Help home
                                </Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/hc/sections/listings" className="hover:underline">
                                    Listings
                                </Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link
                                    href="/hc/sections/creating-a-listing"
                                    className="hover:underline"
                                >
                                    Creating a Listing
                                </Link>
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <Sidebar/>

                    {/* Article Content */}
                    <MainArticle/>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-6">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Link
                                href="https://www.etsy.com/?ref=hcfooter"
                                target="_blank"
                                className="flex items-center"
                            >
                                <img
                                    src="/hc/theming_assets/etsy-footer-logo.png"
                                    alt="Etsy Footer Logo"
                                    className="h-10"
                                />
                            </Link>
                            <span className="ml-2 text-sm">Keep Commerce Human</span>
                        </div>
                        <div className="flex space-x-4 text-sm">
                            <Link
                                href="/hc?segment=selling"
                                className="hover:underline"
                            >
                                © 2025 Etsy, Inc.
                            </Link>
                            <Link
                                href="https://www.etsy.com/legal/?ref=enhc"
                                className="hover:underline"
                            >
                                Terms of Use
                            </Link>
                            <Link
                                href="https://www.etsy.com/legal/privacy/?ref=enhc"
                                className="hover:underline"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="https://www.etsy.com/legal/policy/cookies-tracking-technologies/44797645975?ref=enhc"
                                className="hover:underline"
                            >
                                Interest-based ads
                            </Link>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <select className="bg-gray-800 text-gray-300 p-2 rounded text-sm">
                                <option>English (GB)</option>
                                <option>English (US)</option>
                                <option>Deutsch</option>
                                <option>Español</option>
                                <option>Français</option>
                                <option>Italiano</option>
                                <option>日本語</option>
                                <option>Nederlands</option>
                                <option>Polski</option>
                                <option>Português</option>

                            </select>
                        </div>
                    </div>
                </footer>
            </div>

            {/* No additional CSS needed as Tailwind takes care of styling */}
        </>
    );
}

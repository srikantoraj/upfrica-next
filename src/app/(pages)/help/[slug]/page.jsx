// pages/delivery-information.js
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

            <div className="min-h-screen bg-gray-50 text-gray-900">
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
                    <aside className="lg:w-1/4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link
                                        href="/hc/sections/shop-management"
                                        className="text-gray-700 hover:text-violet-700 transition"
                                    >
                                        Shop Management
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/hc/sections/orders-shipping"
                                        className="text-gray-700 hover:text-violet-700 transition"
                                    >
                                        Orders &amp; Shipping
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/hc/sections/listings"
                                        className="font-semibold text-violet-700"
                                    >
                                        Listings
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/hc/sections/finances"
                                        className="text-gray-700 hover:text-violet-700 transition"
                                    >
                                        Finances
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/hc/sections/marketing-promotions"
                                        className="text-gray-700 hover:text-violet-700 transition"
                                    >
                                        Marketing &amp; Promotions
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/hc/sections/start-selling"
                                        className="text-gray-700 hover:text-violet-700 transition"
                                    >
                                        Start Selling on Etsy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/hc/sections/your-etsy-account"
                                        className="text-gray-700 hover:text-violet-700 transition"
                                    >
                                        Your Etsy Account
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Article Content */}
                    <article className="lg:w-3/4">
                        <div className="bg-white shadow-lg rounded-lg p-8">
                            <header>
                                <h1 className="text-2xl font-bold mb-4">
                                    How to Set Up Delivery Information for your Listings
                                </h1>
                            </header>
                            <section className="prose max-w-none">
                                <p>
                                    Etsy offers many delivery tools to help you set postage rates in
                                    your shop.
                                </p>
                                <ul>
                                    <li>
                                        Use delivery profiles if you have multiple listings with the same
                                        delivery settings.
                                    </li>
                                    <li>
                                        Offer discounted postage when buyers purchase multiple items.
                                    </li>
                                    <li>
                                        Offer buyers the option to pay more for faster delivery.
                                    </li>
                                </ul>
                                <div>
                                    <strong>Jump to a section:</strong>
                                    <ul>
                                        <li>
                                            <a href="#postage-charge" className="hover:underline">
                                                How much should I charge for postage?
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#add-postage" className="hover:underline">
                                                How do I add postage rates?
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#delivery-profile" className="hover:underline">
                                                How do I create a delivery profile?
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#free-delivery" className="hover:underline">
                                                How do I offer free delivery?
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#multiple-items" className="hover:underline">
                                                What if someone purchases multiple items from my shop?
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#delivery-upgrade" className="hover:underline">
                                                How do I add delivery upgrade?
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <h2 id="postage-charge">How much should I charge for postage?</h2>
                                <p>
                                    We’ve updated how postage price is factored into Etsy search for US
                                    domestic listings for physical items only. This means that listings
                                    with postage prices lower than $6 will be prioritised in Etsy search,
                                    with some exceptions.
                                </p>
                                <p>
                                    To see which types of listings are exempt from this, and to learn how
                                    to edit your domestic listing postage prices in bulk, view our article
                                    on postage price search visibility.
                                </p>
                                <p>
                                    US sellers can use the Etsy Postage Calculator to determine rates with
                                    USPS or FedEx.
                                </p>
                                <p>
                                    US or Canada sellers can use calculated postage if you dispatch with
                                    USPS or Canada Post. Enter the weight and dimensions of the item and
                                    select the delivery services you want to offer. When a buyer enters
                                    their address and chooses a service, Etsy will calculate the postage
                                    and add it to the cost of the order.
                                </p>
                                <p>
                                    If you live in another country or don’t want to use calculated
                                    postage, you can add your own postage rates to your listings.
                                </p>
                                <p>
                                    You determine your own postage rates, but the Seller Handbook can help
                                    guide you.
                                </p>
                                <p>
                                    Get tips and advice from other sellers in the All About Delivery section
                                    of the Etsy Forums.
                                </p>
                                <h2 id="bulky-items">What if I sell very bulky or heavy items?</h2>
                                <p>
                                    If you sell very heavy items, like furniture, consider mentioning in your
                                    listing descriptions that postage prices vary. Ask buyers to contact you
                                    before checking out for a postage quote. Then, create a custom listing for
                                    your buyer.
                                </p>
                                <p>Learn how to create a custom listing.</p>
                                <h2 id="add-postage">How do I add postage rates?</h2>
                                <p>
                                    If you don't want to use calculated postage, add postage rates when
                                    creating or editing a listing. Be sure to set a rate for each country
                                    where you'd like to deliver items. Many buyers only see Etsy listings that
                                    are delivered to their country.
                                </p>
                                <p>
                                    <strong>To add delivery when creating a listing:</strong>
                                </p>
                                <h2 id="delivery-profile">How do I create a delivery profile?</h2>
                                <p>
                                    To reuse the same delivery settings on multiple items, apply a delivery
                                    profile. If you edit a delivery profile, it will update on every listing
                                    you’ve applied it to.
                                </p>
                                <p>
                                    Save a delivery profile after adding postage rates to a listing, or use the
                                    Delivery profiles page to create and manage your profiles.
                                </p>
                                <p>
                                    <strong>To create a delivery profile:</strong>
                                </p>
                                <p>
                                    <strong>To add a delivery profile to a listing:</strong>
                                </p>
                                <h2 id="free-delivery">How do I offer free delivery?</h2>
                                <p>
                                    Free delivery can be an important tactic to entice buyers to complete a
                                    purchase. Learn more about offering free delivery.
                                </p>
                                <p>
                                    If you use calculated postage, scroll down to the Free delivery section of
                                    a delivery profile. Specify whether you'd like to offer domestic or
                                    international free delivery by checking the appropriate boxes.
                                </p>
                                <p>
                                    For delivery profiles, select Free delivery from the What you’ll charge
                                    dropdown.
                                </p>
                                <h2 id="multiple-items">
                                    What if someone purchases multiple items from my shop?
                                </h2>
                                <p>
                                    When you set fixed postage rates, you can offer discounted postage for
                                    multiple items when you add a rate for One item and an Additional item.
                                </p>
                                <p>
                                    <strong>One item price:</strong> The cost of delivering the item alone.
                                </p>
                                <p>
                                    <strong>Additional item price:</strong> The cost of delivering this item
                                    when added to an additional item in your shop. This could be either a
                                    different listing in your shop or more than one of the same item.
                                </p>
                                <p>
                                    To calculate the postage rate, Etsy takes the listing with the most
                                    expensive One item price and then adds each Additional item price.
                                </p>
                                <table className="table-auto border-collapse border border-gray-300 my-4">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 px-2 py-1">One item</th>
                                            <th className="border border-gray-300 px-2 py-1">Additional item</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-2 py-1">
                                                Item A: 2.00 USD
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">0.50 USD</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-2 py-1">
                                                Item B: 1.00 USD
                                            </td>
                                            <td className="border border-gray-300 px-2 py-1">0.75 USD</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>
                                    If a buyer purchases Item A and Item B, the total postage is 2.75 USD.
                                    We’ll take Item A’s One item price of 2.00 USD, since it’s most expensive,
                                    and Item B’s Additional item price of 0.75 USD.
                                </p>
                                <p>
                                    If three Item A are purchased, the total postage would be 3.00 USD. We’ll
                                    take the One item cost of 2.00 USD and add two Additional item costs of 0.50
                                    USD each.
                                </p>
                                <h2 id="calculated-postage">If you offer calculating postage</h2>
                                <p>
                                    It isn't possible to set discounted rates for listings with calculated
                                    postage. For fixed rate items, the discounted rates are helpful because you
                                    can approximate what it would cost to deliver multiple items. You don’t need
                                    that with calculated postage, because the precise cost of delivering multiple
                                    items is calculated for you.
                                </p>
                                <p>
                                    If some of your listings have fixed rates and others have calculated
                                    postage, we first add the calculated postage on those listings in the order
                                    as normal. For the fixed rate listings, we’ll add your Additional item rates.
                                </p>
                                <h2 id="delivery-upgrade">How do I add delivery upgrade?</h2>
                                <p>
                                    You can offer your buyers delivery upgrade so they can opt for faster
                                    delivery at checkout.
                                </p>
                                <p>
                                    If you’re in the US or Canada and offer calculated postage, delivery upgrades
                                    are available based on which delivery services you’ve chosen to offer in your
                                    calculated postage settings.
                                </p>
                                <p>
                                    Otherwise you can enable delivery upgrades as part of setting fixed rates.
                                </p>
                                <p>
                                    <strong>To enable delivery upgrades from your Shop Manager:</strong>
                                </p>
                                <p>
                                    <strong>To add delivery upgrades to a delivery profile:</strong>
                                </p>
                                <h2 id="charge-upgrade">How are buyers charged for delivery upgrades?</h2>
                                <p>
                                    The upgrade price is added to the initial item cost you set.
                                </p>
                                <p>
                                    When adding delivery upgrades, you can enter either a Domestic upgrade, an
                                    International upgrade, or both.
                                </p>
                                <p>
                                    In an order for multiple items, if a delivery upgrade is available on one
                                    item, it will be available for the buyer to select. The cost will apply to
                                    every item in the order, even for items whose delivery profiles don't offer
                                    the upgrade.
                                </p>
                                <p>
                                    <strong>Did this resolve the issue?</strong>
                                </p>
                            </section>
                        </div>

                        {/* Related Articles Section */}
                        <section className="mt-8">
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Related articles</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                                    <li>
                                        <Link
                                            href="/hc/articles/how-to-set-up-calculated-postage"
                                            className="hover:underline"
                                        >
                                            How to Set Up Calculated Postage
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/hc/articles/how-to-deliver-your-items"
                                            className="hover:underline"
                                        >
                                            How to Deliver Your Items on Etsy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/hc/articles/how-to-offer-free-delivery"
                                            className="hover:underline"
                                        >
                                            How to Offer Free Delivery
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/hc/articles/what-is-a-payment-account-reserve"
                                            className="hover:underline"
                                        >
                                            What is a Payment Account Reserve?
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/hc/articles/customs-information-for-international-delivery"
                                            className="hover:underline"
                                        >
                                            Customs Information for International Delivery
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </article>
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

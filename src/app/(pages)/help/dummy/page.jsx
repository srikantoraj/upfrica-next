

'use client'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { FaSearch } from 'react-icons/fa'
import Footer from '@/components/common/footer/Footer'

// Dummy data object that would normally come from your backend API.
const pageData = {
    header: {
        title: "Help Centre",
        // You may later include a background image URL from the backend:
        backgroundImage: "https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        searchPlaceholder: "Type your question"
    },
    breadcrumbs: [
        { label: "Help home", href: "/help" },
        { label: "Listings", href: "/help/listings" },
        { label: "Creating a Listing", href: "/help/creating-a-listing" }
    ],
    sidebar: {
        helpTopics: [
            { name: "Shop Management", href: "/help/shop-management" },
            { name: "Orders & Shipping", href: "/help/orders-shipping" },
            { name: "Listings", href: "/help/listings" },
            { name: "Finances", href: "/help/finances" },
            { name: "Marketing & Promotions", href: "/help/marketing-promotions" },
            { name: "Start Selling on Etsy", href: "/help/start-selling" },
            { name: "Your Etsy Account", href: "/help/your-account" }
        ],
        // Article navigation for jump links.
        articleNavigation: [
            { title: "How much should I charge for postage?", id: "postage" },
            { title: "What if I sell very bulky or heavy items?", id: "bulky" },
            { title: "How do I add postage rates?", id: "add-postage" },
            { title: "How do I create a delivery profile?", id: "delivery-profile" },
            { title: "How do I offer free delivery?", id: "free-delivery" },
            { title: "Multiple items & discounted rates", id: "multiple-items" },
            { title: "How do I add a delivery upgrade?", id: "delivery-upgrade" },
            { title: "How are buyers charged for delivery upgrades?", id: "upgrade-charge" }
        ]
    },
    article: {
        title: "How to Set Up Delivery Information for your Listings",
        intro: "Etsy offers many delivery tools to help you set postage rates in your shop.",
        bulletPoints: [
            "Use delivery profiles if you have multiple listings with the same delivery settings.",
            "Offer discounted postage when buyers purchase multiple items.",
            "Offer buyers the option to pay more for faster delivery."
        ],
        highlight: {
            text: "Review your delivery options carefully. Accurate postage rates and delivery profiles can significantly improve your listing visibility and customer satisfaction."
        },
        sections: [
            {
                id: "postage",
                title: "How much should I charge for postage?",
                paragraphs: [
                    "Etsy has updated how postage prices are factored into search results for US domestic listings. Listings with postage prices lower than $6 will be prioritised."
                ],
                bulletPoints: [
                    "Postage prices below $6 are prioritised.",
                    "Refer to postage price search visibility guidelines."
                ],
                images: [] // Array of optional image URLs if provided.
            },
            {
                id: "bulky",
                title: "What if I sell very bulky or heavy items?",
                paragraphs: [
                    "For heavy items like furniture, mention that postage prices may vary. Ask buyers to contact you for a quote and then create a custom listing."
                ],
                links: [{ href: "/help/custom-listing", text: "Learn how to create a custom listing." }],
                images: []
            },
            {
                id: "add-postage",
                title: "How do I add postage rates?",
                paragraphs: [
                    "If you prefer not to use calculated postage, add fixed postage rates when creating or editing your listings. Ensure you set a rate for every country you deliver to."
                ],
                tips: "Follow your seller dashboard's instructions to add delivery details.",
                images: []
            },
            {
                id: "delivery-profile",
                title: "How do I create a delivery profile?",
                paragraphs: [
                    "A delivery profile lets you reuse the same delivery settings across multiple listings. Editing the profile will update every listing that uses it.",
                    "Visit the Delivery profiles page to manage your profiles."
                ],
                tips: "Use your shop manager to create and add delivery profiles.",
                images: []
            },
            {
                id: "free-delivery",
                title: "How do I offer free delivery?",
                paragraphs: [
                    "Free delivery is a strong incentive for buyers. If you use calculated postage, enable free delivery options in your delivery profile for domestic or international orders."
                ],
                bulletPoints: [
                    "For fixed-rate profiles, select the 'Free delivery' option."
                ],
                links: [{ href: "/help/free-delivery", text: "Learn more about offering free delivery." }],
                images: []
            },
            {
                id: "multiple-items",
                title: "What if someone purchases multiple items from my shop?",
                paragraphs: [
                    "You can offer discounted postage with two pricing tiers."
                ],
                bulletPoints: [
                    "One item price: Cost to deliver a single item.",
                    "Additional item price: Cost for delivering an extra item."
                ],
                table: {
                    headers: ["Item", "One item", "Additional item"],
                    rows: [
                        ["Item A", "2.00 USD", "0.50 USD"],
                        ["Item B", "1.00 USD", "0.75 USD"]
                    ]
                },
                images: []
            },
            {
                id: "delivery-upgrade",
                title: "How do I add a delivery upgrade?",
                paragraphs: [
                    "Delivery upgrades let buyers opt for faster shipping. Enable them in your seller dashboard."
                ],
                tips: "For calculated postage, upgrades depend on your chosen carriers.",
                images: []
            },
            {
                id: "upgrade-charge",
                title: "How are buyers charged for delivery upgrades?",
                paragraphs: [
                    "The upgrade cost is added to the base price of the item. If one item offers an upgrade, it will apply to every item in the order."
                ],
                images: []
            }
        ]
    },
    relatedArticles: [
        { name: "How to Set Up Calculated Postage", href: "/help/calculated-postage" },
        { name: "How to Deliver Your Items on Etsy", href: "/help/deliver-items" },
        { name: "How to Offer Free Delivery", href: "/help/free-delivery" },
        { name: "What is a Payment Account Reserve?", href: "/help/payment-account-reserve" },
        { name: "Customs Information for International Delivery", href: "/help/customs-information" }
    ]
}

export default function HelpCenterPage({ params }) {
    const { slug } = params
    console.log("Slug:", slug)
    // In production, you might fetch this object from your backend API.
    const data = pageData

    return (
        <div className="min-h-screen bg-gray-100">
            <Header data={data.header} />
            <Breadcrumbs data={data.breadcrumbs} />
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Sidebar data={data.sidebar} />
                <main className="lg:col-span-3 space-y-8">
                    <ArticleContent data={data.article} />
                    <RelatedArticles data={data.relatedArticles} />
                </main>
            </div>
            <VoteSection />
            <Footer />
            <Scripts />
        </div>
    )
}

/* ----------------------------------------------------------------------
   Header Component – A reduced-height hero with three regions:
     Left: Displays "Help"
     Middle: Search bar
     Right: Sign-in button (rounded-full)
------------------------------------------------------------------------ */
const Header = ({ data }) => {
    return (
        <header className="relative h-24">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("${data.backgroundImage}")`
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-between container mx-auto px-4">
                {/* Left */}
                <div className="text-white text-xl font-bold">
                    Help
                </div>
                {/* Middle: Search Bar */}
                <div className="w-full max-w-md">
                    <form action="/hc/search" method="get" className="relative">
                        <input
                            type="search"
                            name="query"
                            placeholder={data.searchPlaceholder}
                            className="w-full rounded-full border border-violet-700 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-700"
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-0 h-full px-3 flex items-center justify-center"
                            aria-label="Search"
                        >
                            <FaSearch className="text-gray-600 h-5 w-5" />
                        </button>
                    </form>
                </div>
                {/* Right: Sign In Button (rounded-full) */}
                <div>
                    <Link href="https://www.etsy.com/sso-forced/zendesk?return_to=https://help.etsy.com">
                        <button className="px-3 py-2 border border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition">
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    )
}

/* ----------------------------------------------------------------------
   Breadcrumbs Component – Renders navigation links based on data.
------------------------------------------------------------------------ */
const Breadcrumbs = ({ data }) => {
    return (
        <nav className="bg-white py-3 shadow-sm">
            <div className="container mx-auto px-4">
                <ol className="flex space-x-2 text-gray-600 items-center">
                    {data.map((crumb, index) => (
                        <React.Fragment key={index}>
                            <li>
                                <Link href={crumb.href} className="hover:text-violet-700">
                                    {crumb.label}
                                </Link>
                            </li>
                            {index < data.length - 1 && <li>/</li>}
                        </React.Fragment>
                    ))}
                </ol>
            </div>
        </nav>
    )
}

/* ----------------------------------------------------------------------
   Sidebar Component – Renders two sections from passed data:
     1. Help Topics
     2. Article Navigation (jump links)
------------------------------------------------------------------------ */
const Sidebar = ({ data }) => {
    return (
        <aside className="space-y-8">
            <Card title="Help Topics">
                <ul className="list-disc pl-4 text-gray-700">
                    {data.helpTopics.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="hover:underline">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card title="Article Navigation">
                <ul className="list-disc pl-4 text-violet-700">
                    {data.articleNavigation.map((section) => (
                        <li key={section.id}>
                            <Link href={`#${section.id}`} className="hover:underline">
                                {section.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>
        </aside>
    )
}

/* ----------------------------------------------------------------------
   ArticleContent Component – Renders the article content from the data object.
------------------------------------------------------------------------ */
const ArticleContent = ({ data }) => {
    return (
        <article className="space-y-8">
            <header>
                <h1 id="page-title" className="text-3xl font-bold text-gray-900 mb-4" title={data.title}>
                    {data.title}
                </h1>
            </header>
            <section>
                <p>{data.intro}</p>
                <ul className="list-disc pl-6">
                    {data.bulletPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </section>
            <section>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                    <p className="font-semibold">Important:</p>
                    <p>{data.highlight.text}</p>
                </div>
            </section>
            {data.sections.map((section) => (
                <section key={section.id} id={section.id}>
                    <h2 className="text-2xl font-bold mt-8 mb-3">{section.title}</h2>
                    {section.paragraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                    {section.bulletPoints && (
                        <ul className="list-disc pl-6">
                            {section.bulletPoints.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                            ))}
                        </ul>
                    )}
                    {section.tips && (
                        <p className="mt-2 italic text-gray-600">Tip: {section.tips}</p>
                    )}
                    {section.links && (
                        <div className="mt-2 space-y-1">
                            {section.links.map((link, i) => (
                                <p key={i}>
                                    <Link href={link.href} className="text-violet-700 hover:underline">
                                        {link.text}
                                    </Link>
                                </p>
                            ))}
                        </div>
                    )}
                    {section.table && (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        {section.table.headers.map((header, i) => (
                                            <th key={i} className="px-4 py-2 border border-gray-300">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.table.rows.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j} className="px-4 py-2 border border-gray-300">{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            ))}
        </article>
    )
}

/* ----------------------------------------------------------------------
   RelatedArticles Component – Renders related articles like an article
   navigation section using the data object.
------------------------------------------------------------------------ */
const RelatedArticles = ({ data }) => {
    return (
        <section className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h3>
            <ul className="list-disc pl-6 text-violet-700">
                {data.map((article, index) => (
                    <li key={index}>
                        <Link href={article.href} className="hover:underline">
                            {article.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

/* ----------------------------------------------------------------------
   Card Component – A reusable card component.
------------------------------------------------------------------------ */
const Card = ({ title, children }) => {
    return (
        <div className="bg-white shadow rounded p-4">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>}
            {children}
        </div>
    )
}

/* ----------------------------------------------------------------------
   VoteSection Component – Provides a simple yes/no vote with feedback.
------------------------------------------------------------------------ */
const VoteSection = () => {
    const [vote, setVote] = useState(null)
    return (
        <div className="my-12 text-center">
            {vote === null ? (
                <>
                    <p className="font-semibold text-gray-700">Did this resolve the issue?</p>
                    <div className="flex justify-center space-x-4 mt-2">
                        <button
                            onClick={() => setVote("yes")}
                            className="p-2 rounded-full bg-green-200 hover:bg-green-300 transition"
                            aria-label="Yes"
                        >
                            👍
                        </button>
                        <button
                            onClick={() => setVote("no")}
                            className="p-2 rounded-full bg-red-200 hover:bg-red-300 transition"
                            aria-label="No"
                        >
                            👎
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-green-700 font-bold mt-4">Thanks for your feedback!</p>
            )}
        </div>
    )
}

/* ----------------------------------------------------------------------
   Scripts Component – Loads external JavaScript files.
------------------------------------------------------------------------ */
const Scripts = () => {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src="https://www.etsy.com/ac/evergreenVendor/js/en-US/zendesk_help_center/header.ffb044d22fc2e825d083.js?z=c07b859e7c81e56b5d68d2a725292397"
            />
            <Script
                strategy="afterInteractive"
                src="https://www.etsy.com/ac/evergreenVendor/js/en-US/zendesk_help_center/article_page.829581db8ed43b2066c6.js?z=c07b859e7c81e56b5d68d2a725292397"
            />
            <Script
                strategy="afterInteractive"
                src="https://www.etsy.com/ac/evergreenVendor/js/en-US/zendesk_help_center/footer.511461acd9437365538c.js?z=c07b859e7c81e56b5d68d2a725292397"
            />
            <Script
                strategy="afterInteractive"
                src="//static.zdassets.com/hc/assets/en-gb.3e9727124d078807077c.js"
            />
        </>
    )
}

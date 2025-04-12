
'use client'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '@/components/common/footer/Footer'
import { FaSearch } from 'react-icons/fa'
import {
    FaShoppingCart,
    FaCreditCard,
    FaClipboardList,
    FaList,
} from 'react-icons/fa'

const CardSkeleton = () => (
    <div className="animate-pulse p-6 bg-white rounded shadow">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
    </div>
)

export default function Shopping() {
    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("https://media.upfrica.com/api/helpblogs/")
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setPosts(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Fetch error:", error)
                setLoading(false)
            })
    }, [])

    return (
        <>
            <Head>
                <title>Help Center - Shopping on Upfrica</title>
                <meta
                    name="description"
                    content="Explore help articles and support on shopping and gifting on Upfrica."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                        <a href="#content" className="sr-only">
                            Skip to content
                        </a>
                        {/* Logo */}
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
                                    className="absolute right-0 top-0 h-full px-4 flex items-center justify-center"
                                    aria-label="Search"
                                >
                                    <FaSearch className="text-gray-600 h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </section>
                </header>

                {/* Navigation Tabs */}
                <nav className="bg-white border-b ">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center space-x-4">
                            <button className="flex items-center px-4 py-2 text-violet-700 font-bold border-b-2 border-violet-700 rounded-t-none">
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

                {/* Featured Articles Section */}
                <section className="mb-12 container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        Featured articles
                    </h2>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts && posts?.length> 0  && posts.map((post) => (
                                <Link key={post.id} href={`/help/${post.slug}/`}>
                                    <div className="block p-4 bg-white rounded shadow hover:shadow-lg transition">
                                        
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-700">
                                            {post.summary.length > 150
                                                ? post.summary.substring(0, 150) + "..."
                                                : post.summary}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
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
                                    Get the ins and outs of buying and selling on Upfrica.
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
                                    Learn from our large and knowledgeable community.
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
                                    Explore ideas and inspiration for creative living.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
            <Scripts />
        </>
    )
}

const Scripts = () => {
    return (
        <>
            
        </>
    )
}

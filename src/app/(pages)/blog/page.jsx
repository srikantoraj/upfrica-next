'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/common/footer/Footer';

// Dummy data for the search results and jobs.
const searchResults = [
    {
        title: 'Automating hallucination detection with chain-of-thought reasoning',
        href: '/blog/automating-hallucination-detection-with-chain-of-thought-reasoning',
        authors: [
            { name: 'Erica Salinas', href: '/author/erica-salinas' },
            { name: 'Shayan Ali Akbar', href: '/author/shayan-ali-akbar' }
        ],
        date: 'April 11, 2025',
        description:
            'Novel three-pronged approach combines claim‐level evaluations, chain‐of‐thought reasoning, and classification of hallucination error types.',
        category: { name: 'Conversational AI', href: '/research-areas/conversational-ai-natural-language-processing' }
    },
    {
        title: 'An AI agent for data science:  Q Developer in SageMaker Canvas',
        href: '/blog/an-ai-agent-for-data-science--q-developer-in-sagemaker-canvas',
        authors: [
            { name: 'Yaroslav Kharkov', href: '/author/yaroslav-kharkov' },
            { name: 'Gerald Friedland', href: '/author/gerald-friedland' }
        ],
        date: 'April 10, 2025',
        description:
            'New tool lets customers build, train, and deploy machine learning models using only natural language.',
        category: { name: 'Machine learning', href: '/research-areas/machine-learning' }
    }
];

const jobs = [
    {
        title: 'Manager, Applied Scientist',
        href: 'https://www..jobs/jobs/2874062/manager-applied-scientist?cmpid=bsp--science',
        location: 'IN, TS, Hyderabad',
        description:
            'Welcome to the Worldwide Returns & ReCommerce team (WWR&R) at . An agile, innovative organization working on exciting challenges.'
    },
    {
        title: 'Applied Scientist, Personalization',
        href: 'https://www..jobs/jobs/2866202/applied-scientist-personalization?cmpid=bsp--science',
        location: 'GB, MLN, Edinburgh',
        description:
            'Join our Personalization team to build, train, and deploy innovative ML models using generative AI techniques.'
    }
];

export default function BlogPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortValue, setSortValue] = useState("0");

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* Header */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                    <Link href="/">
                        <div className="w-[171px] h-[29px] bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-800">
                             Upfrica
                        </div>
                    </Link>
                    <div className="flex items-center space-x-4">
                        {/* Desktop Navigation */}
                        <nav className="hidden lg:block">
                            <ul className="flex space-x-6">
                                <li><Link href="/research-areas" className="hover:text-blue-600 transition">Research areas</Link></li>
                                <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
                                <li><Link href="/publications" className="hover:text-blue-600 transition">Publications</Link></li>
                                <li><Link href="/conferences-and-events" className="hover:text-blue-600 transition">Conferences</Link></li>
                                <li><Link href="/code-and-datasets" className="hover:text-blue-600 transition">Code and datasets</Link></li>
                                <li><Link href="/academic-engagements" className="hover:text-blue-600 transition">Academia</Link></li>
                                <li><Link href="/careers" className="hover:text-blue-600 transition">Careers</Link></li>
                            </ul>
                        </nav>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden text-gray-600 focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            {menuOpen ? (
                                <span className="font-semibold">Close</span>
                            ) : (
                                <span className="font-semibold">Menu</span>
                            )}
                        </button>
                    </div>
                </div>
                {/* Mobile Navigation */}
                {menuOpen && (
                    <nav className="lg:hidden bg-white">
                        <ul className="flex flex-col space-y-2 p-4">
                            <li><Link href="/research-areas" className="block hover:text-blue-600 transition">Research areas</Link></li>
                            <li><Link href="/blog" className="block hover:text-blue-600 transition">Blog</Link></li>
                            <li><Link href="/publications" className="block hover:text-blue-600 transition">Publications</Link></li>
                            <li><Link href="/conferences-and-events" className="block hover:text-blue-600 transition">Conferences</Link></li>
                            <li><Link href="/code-and-datasets" className="block hover:text-blue-600 transition">Code and datasets</Link></li>
                            <li><Link href="/academic-engagements" className="block hover:text-blue-600 transition">Academia</Link></li>
                            <li><Link href="/careers" className="block hover:text-blue-600 transition">Careers</Link></li>
                        </ul>
                    </nav>
                )}
            </header>

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
                        Find a blog?
                    </h1>
                    <div className="max-w-lg mx-auto">
                        <form action="/hc/search" method="get" className="relative">
                            <input
                                type="search"
                                name="query"
                                placeholder="Type your search here..."
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

            {/* Main Container: Filters & Search Results */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white shadow rounded-md p-6">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar: Filter Module */}
                        <aside className="md:w-1/4 border-r pr-4">
                            <h2 className="text-xl font-bold mb-4">Filters</h2>
                            <div className="space-y-6">
                                {/* Research Area Filter */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Research area</h3>
                                        <button type="button" className="text-sm text-blue-500">Toggle</button>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Conversational AI (288)</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Machine learning (146)</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Computer vision (70)</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>

                                {/* Tag Filter */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Tag</h3>
                                        <button type="button" className="text-sm text-blue-500">Toggle</button>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Alexa (147)</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Natural-language understanding (NLU) (86)</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>

                                {/* Conference Filter */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Conference</h3>
                                        <button type="button" className="text-sm text-blue-500">Toggle</button>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>ICASSP 2019 (10)</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>NeurIPS 2022 (9)</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>

                                {/* Journal Filter */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Journal</h3>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Journal of Manufacturing Systems (1)</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>

                                {/* Author Filter */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Author</h3>
                                        <button type="button" className="text-sm text-blue-500">Toggle</button>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Larry Hardesty (96)</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>Staff writer (35)</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>

                                {/* Date Filter */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Date</h3>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>2025 (10)</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>2024 (59)</span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span>2023 (80)</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>

                        {/* Main Search Results */}
                        <section className="md:w-3/4 pl-4 mt-6 md:mt-0">
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-2xl font-bold">551 results found</div>
                                <div>
                                    <label className="flex items-center space-x-2">
                                        <span className="font-medium">Sort:</span>
                                        <select
                                            value={sortValue}
                                            onChange={(e) => setSortValue(e.target.value)}
                                            name="sort"
                                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="0">Relevance</option>
                                            <option value="1">Newest</option>
                                            <option value="2">Oldest</option>
                                            <option value="3">A - Z</option>
                                            <option value="4">Z - A</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            {/* Search Results Grid */}
                            <ul className="grid gap-6">
                                {searchResults.map((result, idx) => (
                                    <li key={idx} className="bg-white shadow rounded-lg overflow-hidden">
                                        <article className="flex">
                                            {/* Left Side: Image Placeholder */}
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-20 h-20 bg-gray-50" />
                                            </div>
                                            {/* Right Side: Content */}
                                            <div className="p-4">
                                                <header>
                                                    <h2 className="text-lg font-bold text-gray-800">
                                                        <Link href={result.href} className="hover:text-blue-600 transition">
                                                            {result.title}
                                                        </Link>
                                                    </h2>
                                                </header>
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <span>
                                                        {result.authors.map((author, aIdx) => (
                                                            <span key={aIdx}>
                                                                <Link href={author.href} className="hover:text-blue-600 transition">
                                                                    {author.name}
                                                                </Link>
                                                                {aIdx < result.authors.length - 1 && ', '}
                                                            </span>
                                                        ))}
                                                    </span>
                                                    <span className="mx-2">|</span>
                                                    <span>{result.date}</span>
                                                </div>
                                                <p className="mt-2 text-gray-700">{result.description}</p>
                                                <div className="mt-4">
                                                    <Link href={result.category.href} className="text-blue-600 font-semibold hover:underline">
                                                        {result.category.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    </li>
                                ))}
                            </ul>


                            {/* Pagination */}
                            <div className="mt-8 flex items-center space-x-3">
                                <Link href="/blog?p=1" className="px-3 py-1 border rounded-md hover:bg-blue-50 transition">1</Link>
                                <Link href="/blog?p=2" className="px-3 py-1 border rounded-md hover:bg-blue-50 transition">2</Link>
                                <Link href="/blog?p=3" className="px-3 py-1 border rounded-md hover:bg-blue-50 transition">3</Link>
                                <span className="px-3">…</span>
                                <Link href="/blog?p=43" className="px-3 py-1 border rounded-md hover:bg-blue-50 transition">43</Link>
                                <Link href="/blog?p=2" aria-label="Next" className="px-3 py-1 border rounded-md hover:bg-blue-50 transition">Next</Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Jobs Carousel */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <header className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Work with us</h2>
                    <Link href="/careers" className="text-blue-600 font-semibold hover:underline">See more jobs</Link>
                </header>
                <div className="flex space-x-6 overflow-x-auto pb-4">
                    {jobs.map((job, idx) => (
                        <div key={idx} className="min-w-[300px] bg-white shadow rounded-lg p-4">
                            <h3 className="text-lg font-bold mb-2">
                                <Link href={job.href} target="_blank" className="hover:text-blue-600 transition">
                                    {job.title}
                                </Link>
                            </h3>
                            <div className="text-sm text-gray-600 mb-2">{job.location}</div>
                            <p className="text-gray-700 mb-2">{job.description}</p>
                            <Link href={job.href} target="_blank" className="text-blue-600 font-semibold hover:underline">
                                Read more
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";

import { FaEdit } from "react-icons/fa";

import { FaSearch, FaBars } from "react-icons/fa";
import Footer from "@/components/common/footer/Footer";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // 👈 import it

// 👉 Step 1: Utility function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

// Dark Mode Toggle Hook
const useDarkMode = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    if (saved) {
      document.documentElement.classList.add("dark");
      setEnabled(true);
    }
  }, []);

  const toggle = () => {
    const isDark = !enabled;
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    setEnabled(isDark);
  };
  return [enabled, toggle];
};

// Dark mode toggle button
const DarkModeToggle = () => {
  const [enabled, toggle] = useDarkMode();
  return (
    <button
      onClick={toggle}
      className="ml-4 px-3 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition"
    >
      {enabled ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

// A card skeleton for search results
const CardSkeleton = () => (
  <div className="animate-pulse p-4 bg-white dark:bg-gray-800 rounded shadow">
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
  </div>
);

// Main Page Component with Search Features
export default function HelpCenterPage({ params }) {
  const { slug } = params;
  const { user, token } = useSelector((state) => state.auth);

  // Article Data States
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static header, breadcrumbs, and sidebar information
  const staticHeader = {
    title: "Help Centre",
    backgroundImage:
      "https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    searchPlaceholder: "Type your question",
  };

  const staticBreadcrumbs = [
    { label: "Help home", href: "/help" },
    { label: "Listings", href: "/help/listings" },
    { label: "Creating a Listing", href: "/help/creating-a-listing" },
  ];

  const staticSidebar = {
    helpTopics: [
      { name: "Shop Management", href: "/help/shop-management" },
      { name: "Orders & Shipping", href: "/help/orders-shipping" },
      { name: "Listings", href: "/help/listings" },
      { name: "Finances", href: "/help/finances" },
      { name: "Marketing & Promotions", href: "/help/marketing-promotions" },
      { name: "Start Selling on Etsy", href: "/help/start-selling" },
      { name: "Your Etsy Account", href: "/help/your-account" },
    ],
    articleNavigation: [
      { title: "Introduction", id: "introduction" },
      { title: "Postage Pricing", id: "postage-pricing" },
      { title: "Delivery Profile Highlight", id: "delivery-profile-highlight" },
      { title: "Sample Pricing Table", id: "sample-pricing-table" },
      { title: "Additional Resources", id: "additional-resources" },
    ],
  };

  // Fetch article data based on slug
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`https://media.upfrica.com/api/helpblogs/${slug}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, [slug]);

  // --- Search States and Debounce Logic ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimeout = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    // Clear results if query is empty
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    // Set debounce delay: 400ms
    debounceTimeout.current = setTimeout(() => {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      fetch(
        `https://media.upfrica.com/api/help-blogs/search/?q=${encodedQuery}`,
      )
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data);
          setSearchLoading(false);
        })
        .catch((error) => {
          console.error("Search fetch error:", error);
          setSearchLoading(false);
        });
    }, 400);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  if (loading) {
    return <SkeletonLoader />;
  }
  if (error) {
    return <div>Error loading data: {error?.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        data={staticHeader}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        searchResults={searchResults}
        searchLoading={searchLoading}
      />
      <div className="absolute top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      <Breadcrumbs data={staticBreadcrumbs} />
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 ">
        <Sidebar data={staticSidebar} />
        <main className="lg:col-span-3 space-y-8 ">
          <ArticleContent data={data} />
        </main>
      </div>
      <VoteSection />
      <Footer />
      <Scripts />
    </div>
  );
}

/* --------------------------------------------------
   SkeletonLoader Component – Mimics the page layout while data loads.
-------------------------------------------------- */
const SkeletonLoader = () => (
  <div className="min-h-screen bg-gray-100 animate-pulse ">
    {/* Header Skeleton */}
    <div className="h-24 bg-gray-300 relative">
      <div className="absolute inset-0 bg-gray-400 opacity-50"></div>
    </div>
    {/* Breadcrumbs Skeleton */}
    <div className="py-3 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
    </div>
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Skeleton */}
      <aside className="space-y-8">
        <div className="bg-white shadow rounded p-4">
          <div className="h-6 w-1/3 bg-gray-300 mb-4"></div>
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="h-4 bg-gray-300 rounded"></li>
            ))}
          </ul>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="h-6 w-1/3 bg-gray-300 mb-4"></div>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="h-4 bg-gray-300 rounded"></li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Main Article Skeleton */}
      <main className="lg:col-span-3 space-y-8  dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-4 border-t pt-4">
            <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </main>
    </div>
    <footer className="bg-gray-800 py-6 mt-12">
      <div className="container mx-auto text-center">
        <div className="h-4 w-1/3 bg-gray-400 rounded mx-auto"></div>
      </div>
    </footer>
  </div>
);

/* --------------------------------------------------
   Header Component – Now includes integrated search functionality.
-------------------------------------------------- */
const Header = ({
  data,
  searchQuery,
  setSearchQuery,
  isFocused,
  setIsFocused,
  searchResults,
  searchLoading,
}) => {
  return (
    <header className="relative h-24">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${data?.backgroundImage}")` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
      <div className="absolute inset-0 flex items-center justify-between container mx-auto px-4">
        <Link href={"/help"} className="text-white text-xl font-bold">
          Help
        </Link>
        <div className="w-full max-w-md relative">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              name="query"
              placeholder={data?.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              className="w-full rounded-full border border-violet-700 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-700 text-gray-500"
            />
          </div>
          {/* Floating Search Results Panel */}
          {isFocused && searchQuery.trim() && (
            <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded shadow-lg p-4 max-h-96 overflow-y-auto">
              {searchLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <>
                  {searchResults?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {searchResults.map((post) => (
                        <Link key={post.id} href={`/help/${post.slug}/`}>
                          <div className="block p-4 bg-white rounded shadow hover:shadow-lg transition">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-700">
                              {post.summary?.length > 150
                                ? post.summary.substring(0, 150) + "..."
                                : post.summary}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 text-center text-gray-400">
                      No results found.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div>
          <Link href="/login">
            <button className="px-3 py-2 border border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

/* --------------------------------------------------
   Breadcrumbs Component – Renders navigation links.
-------------------------------------------------- */
const Breadcrumbs = ({ data }) => (
  <nav className="bg-white py-3 shadow-sm">
    <div className="container mx-auto px-4">
      <ol className="flex space-x-2 text-gray-600 items-center">
        {data?.map((crumb, index) => (
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
);

/* --------------------------------------------------
   Sidebar Component – Renders the help topics and article navigation.
-------------------------------------------------- */
// Sidebar toggle button for mobile
const SidebarToggleButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="block lg:hidden mb-4 px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-zinc-800 dark:text-white"
  >
    <FaBars className="inline-block mr-2" /> Menu
  </button>
);

// Modified Sidebar to include collapsible logic
const Sidebar = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <aside className="space-y-8  dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SidebarToggleButton onClick={() => setIsOpen(!isOpen)} />
      <div className={`${isOpen ? "block" : "hidden"} lg:block space-y-8 `}>
        <Card title="Help Topics">
          <ul className="list-disc pl-4 text-gray-700 dark:text-dark">
            {data?.helpTopics?.map((link) => (
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
            {data?.articleNavigation?.map((section) => (
              <li key={section.id}>
                <Link href={`#${section.id}`} className="hover:underline">
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </aside>
  );
};

/* --------------------------------------------------
   ArticleContent Component – Renders the article content.
-------------------------------------------------- */
const ArticleContent = ({ data }) => (
  <article className="space-y-8 bg-white  dark:bg-zinc-900 dark:text-white rounded p-4 shadow text-[18px] leading-[32px] tracking-[-0.003em] font-normal ">
    <header>
      {/* {user?.id === data?.user && ( */}
      <Link
        href={`/all-blogs/edit/${data?.slug}`}
        className="text-violet-700 hover:underline flex items-center gap-1"
      >
        <FaEdit />
        Edit
      </Link>
      {/* )} */}

      <h1
        id="page-title"
        className="text-3xl font-bold text-gray-900  dark:text-white mb-4"
        title={data?.title}
      >
        {stripHtml(data?.title)}
      </h1>
    </header>
    {data?.summary && <p className="mb-2">{stripHtml(data.summary)}</p>}
    {data?.sections?.map((section, index) => (
      <section
        key={index}
        id={section.sectionTitle?.toLowerCase().replace(/\s/g, "-")}
        className="border-t pt-0  dark:text-white"
      >
        <h2 className="text-2xl font-bold mt-4 mb-2  dark:text-white">
          {stripHtml(section.sectionTitle)}
        </h2>

        {/* {section.sectionType === "paragraph" && (
                    <p>{section.sectionContent}</p>
                )} */}

        {/* 👉 updated: html tag remove and only text */}
        {section.sectionType === "paragraph" && (
          <p>{stripHtml(section.sectionContent)}</p>
        )}

        {section.sectionType === "bullet" && (
          <ul className="prose prose-lg list-disc list-outside pl-6 dark:prose-invert max-w-none">
            {section.bulletItems?.map((item, i) => (
              <li key={i} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        )}

        {section.sectionType === "highlight" && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 dark:bg-yellow-200/30">
            <p className="font-semibold">Important:</p>
            <p>{stripHtml(section.sectionContent)}</p>
          </div>
        )}

        {section.sectionType === "table" &&
          section.tableHeaders &&
          section.tableRows && (
            <div className="overflow-x-auto my-4 space-y-4">
              {Array.isArray(section.tableHeaders[0]) ? (
                section.tableHeaders.map((headers, tableIndex) => (
                  <TableComponent
                    key={tableIndex}
                    headers={headers}
                    rows={section.tableRows[tableIndex]}
                  />
                ))
              ) : (
                <TableComponent
                  headers={section.tableHeaders}
                  rows={section.tableRows}
                />
              )}
            </div>
          )}

        {section.sectionType === "links" && (
          <div className="mt-2 space-y-1">
            {section.links?.map((link, i) => (
              <p key={i}>
                <Link
                  href={link.url}
                  className="text-violet-700 hover:underline"
                >
                  {link.text}
                </Link>
              </p>
            ))}
          </div>
        )}
      </section>
    ))}
  </article>
);

/* --------------------------------------------------
   TableComponent – A reusable component to render tables.
-------------------------------------------------- */
const TableComponent = ({ headers, rows }) => (
  <table className="min-w-full border border-gray-300">
    <thead>
      <tr className="bg-gray-200 dark:bg-zinc-900 dark:text-dark">
        {headers.map((header, i) => (
          <th key={i} className="px-4 py-2 border border-gray-300">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j} className="px-4 py-2 border border-gray-300">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

/* --------------------------------------------------
   RelatedArticles Component – Renders related articles.
-------------------------------------------------- */
const RelatedArticles = ({ data }) => (
  <section className="mt-12">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h3>
    <ul className="list-disc pl-6 text-violet-700">
      {data?.map((article, index) => (
        <li key={index}>
          <Link href={article.href} className="hover:underline">
            {article.name}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

/* --------------------------------------------------
   Card Component – A reusable container for sidebar content.
-------------------------------------------------- */
const Card = ({ title, children }) => (
  <div className="bg-white shadow rounded p-4">
    {title && <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>}
    {children}
  </div>
);

/* --------------------------------------------------
   VoteSection Component – Provides a simple feedback UI.
-------------------------------------------------- */
const VoteSection = () => {
  const [vote, setVote] = useState(null);
  return (
    <div className="my-12 text-center">
      {vote === null ? (
        <>
          <p className="font-semibold text-gray-700">
            Did this resolve the issue?
          </p>
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
        <p className="text-green-700 font-bold mt-4">
          Thanks for your feedback!
        </p>
      )}
    </div>
  );
};

/* --------------------------------------------------
   Scripts Component – Loads external JavaScript files.
-------------------------------------------------- */
const Scripts = () => (
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
);

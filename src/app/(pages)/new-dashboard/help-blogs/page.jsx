"use client";

import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Skeleton for loading state
const CardSkeleton = () => (
  <div className="animate-pulse p-4 bg-white rounded shadow">
    <div className="h-6 bg-gray-300 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-4/6"></div>
  </div>
);

// utility to format “days ago”
const convertToDaysAgo = (isoDate) => {
  const past = new Date(isoDate);
  const now = new Date();
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

// simple spinner
const Loader = () => (
  <svg
    className="animate-spin h-5 w-5 text-gray-700"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export default function HelpBlogs() {
  const token = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const debounceTimeout = useRef(null);
  const router = useRouter();

  // fetch all posts
  useEffect(() => {
    fetch("https://media.upfrica.com/api/helpblogs/")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // search logic with debounce
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    debounceTimeout.current = setTimeout(() => {
      fetch(
        `https://media.upfrica.com/api/helpblogs/search/?q=${encodeURIComponent(
          searchQuery.trim(),
        )}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          setSearchLoading(false);
        })
        .catch(() => setSearchLoading(false));
    }, 400);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  const stripHtml = (html) => html?.replace(/<[^>]*>?/gm, "") || "";

  const editBlog = (slug) => {
    router.push(`/new-dashboard/help-blogs/edit/${slug}`);
  };

  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    setDeleteLoadingId(id);
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/admin/helpblogs/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // add Authorization header if needed:
            Authorization: `Token ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);

      // remove from both main list & search results
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSearchResults((prev) => prev.filter((p) => p.id !== id));

      alert("Blog deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete blog.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Help Blogs</title>
        <meta name="description" content="Search and browse help articles." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50 text-gray-900 p-4">
        {/* Search Box */}
        <div className="max-w-md mx-auto relative mb-8">
          <FaSearch className="absolute left-3 top-1/2 text-gray-400 transform -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
          />

          {isFocused && searchQuery.trim() && (
            <div className="absolute z-10 left-0 right-0 mt-2 bg-white rounded shadow-lg p-4 max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="space-y-4">
                  {searchResults.map((post) => (
                    <li
                      key={post.id}
                      className="flex items-start justify-between"
                    >
                      <Link
                        href={`/new-dashboardhelp-blogs/${post.slug}`}
                        className="flex-1"
                      >
                        <div className="p-3 hover:bg-gray-100 rounded">
                          <h3 className="font-semibold">{post.title}</h3>
                          <p className="text-sm text-gray-600">
                            {stripHtml(post.summary).slice(0, 100)}…
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {convertToDaysAgo(post.created_at)}
                          </p>
                        </div>
                      </Link>
                      <div className="flex flex-row space-x-2 ml-4">
                        <button
                          onClick={() => editBlog(post.slug)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteBlog(post.id)}
                          disabled={deleteLoadingId === post.id}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoadingId === post.id ? (
                            <Loader />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No results found.</p>
              )}
            </div>
          )}
        </div>

        {/* Main List of Blogs */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-4 bg-white rounded shadow hover:shadow-lg"
              >
                <Link
                  href={`/new-dashboard/help-blogs/${post.slug}`}
                  className="flex-1"
                >
                  <h3 className="text-lg font-bold mb-1">{post.title}</h3>
                  <p className="text-gray-700 text-sm">
                    {stripHtml(post.summary).slice(0, 150)}…
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {convertToDaysAgo(post.created_at)}
                  </p>
                </Link>
                <div className="flex flex-row space-x-2 ml-4 items-center self-center">
                  <button
                    onClick={() => editBlog(post.slug)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteBlog(post.id)}
                    disabled={deleteLoadingId === post.id}
                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoadingId === post.id ? <Loader /> : <FaTrash />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

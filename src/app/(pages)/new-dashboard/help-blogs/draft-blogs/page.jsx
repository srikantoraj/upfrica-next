"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { FaSearch, FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

// Skeleton card for loading state
const CardSkeleton = () => (
  <div className="animate-pulse p-4 bg-white rounded shadow w-full">
    <div className="h-6 bg-gray-300 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-4/6"></div>
  </div>
);

// Simple spinner for button loading
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

// Format “days ago”
const convertToDaysAgo = (isoDate) => {
  const past = new Date(isoDate);
  const now = new Date();
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays === 0
    ? "today"
    : `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

// Strip HTML tags for search matching
const stripHtml = (html) => html?.replace(/<[^>]*>?/gm, "") || "";

export default function HelpBlogDrafts() {
  const { token } = useSelector((state) => state.auth);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishLoadingId, setPublishLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrafts, setFilteredDrafts] = useState([]);
  const debounceRef = useRef(null);

  // Fetch drafts on mount
  useEffect(() => {
    fetch("https://media.upfrica.com/api/admin/help-blogs/drafts/", {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDrafts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // Debounced client-side filter
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) {
        setFilteredDrafts(drafts);
      } else {
        setFilteredDrafts(
          drafts.filter(
            (d) =>
              d.title.toLowerCase().includes(q) ||
              stripHtml(d.summary).toLowerCase().includes(q),
          ),
        );
      }
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, drafts]);

  // Publish with confirmation
  const publishDraft = async (id) => {
    if (!confirm("Publish this draft?")) return;
    setPublishLoadingId(id);
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/admin/helpblogs/${id}/publish/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "published" }),
        },
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      alert("Draft published!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish.");
    } finally {
      setPublishLoadingId(null);
    }
  };

  // Delete with confirmation
  const deleteDraft = async (id) => {
    if (!confirm("Delete this draft permanently?")) return;
    setDeleteLoadingId(id);
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/admin/helpblogs/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      alert("Draft deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Help Blog Drafts</title>
        <meta
          name="description"
          content="View and manage your draft help blogs."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen w-full bg-gray-100 text-gray-900 p-4">
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full mb-6">
          <h1 className="text-2xl font-bold">Help Blog Drafts</h1>
          <div className="relative w-full sm:w-1/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search drafts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>

        {/* Draft List */}
        <div className="w-full space-y-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filteredDrafts.length > 0 ? (
            filteredDrafts.map((d) => (
              <div
                key={d.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded shadow hover:shadow-lg transition w-full"
              >
                {/* Info */}
                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-semibold">{d.title}</h2>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: d.summary }}
                  />
                  <div className="text-xs text-gray-500 flex space-x-4">
                    <span>Created: {convertToDaysAgo(d.created_at)}</span>
                    <span>Status: {d.status}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => publishDraft(d.id)}
                    disabled={publishLoadingId === d.id}
                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {publishLoadingId === d.id ? <Loader /> : <FaCheck />}
                  </button>
                  <button
                    onClick={() => deleteDraft(d.id)}
                    disabled={deleteLoadingId === d.id}
                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoadingId === d.id ? <Loader /> : <MdDelete />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">
              No drafts available.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Footer from '@/components/common/footer/Footer';

// Skeleton for loading state
const CardSkeleton = () => (
    <div className="animate-pulse p-4 bg-white rounded shadow">
        <div className="h-6 bg-gray-300 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
    </div>
);

// strip HTML tags for summaries
const stripHtml = (html) => html?.replace(/<[^>]*>?/gm, '') || '';

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

export default function JobListings() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const [deleteLoadingId, setDeleteLoadingId] = useState(null);

    const debounceTimeout = useRef(null);
    const { user, token } = useSelector((state) => state.auth);
    const router = useRouter();

    // Fetch all jobs on mount
    useEffect(() => {
        setLoading(true);
        fetch('https://media.upfrica.com/api/jobs/', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setJobs(data))
            .catch((err) => console.error('Failed to fetch jobs:', err))
            .finally(() => setLoading(false));
    }, []);

    // Debounced search
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
                `https://media.upfrica.com/api/jobs/search/?q=${encodeURIComponent(
                    searchQuery.trim()
                )}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            )
                .then((res) => res.json())
                .then((data) => setSearchResults(data))
                .catch((err) => console.error('Search failed:', err))
                .finally(() => setSearchLoading(false));
        }, 400);

        return () => clearTimeout(debounceTimeout.current);
    }, [searchQuery]);

    const editJob = (id) => {
        router.push(`/new-dashboard/jobs/edit-job/${id}`);
    };

    const deleteJob = async (id) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        setDeleteLoadingId(id);
        try {
            const res = await fetch(
                `https://media.upfrica.com/api/admin/jobs/${id}/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                  
                }
            );
            if (!res.ok) throw new Error(`Status ${res.status}`);
            // remove from both main list & search results
            setJobs((prev) => prev.filter((job) => job.id !== id));
            setSearchResults((prev) => prev.filter((job) => job.id !== id));
            alert('Job deleted successfully!');
        } catch (err) {
            console.error('Delete job error:', err);
            alert('Failed to delete job.');
        } finally {
            setDeleteLoadingId(null);
        }
    };

    return (
        <>
            <Head>
                <title>Job Listings</title>
                <meta name="description" content="Browse and search job openings." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className="min-h-screen bg-gray-50 text-gray-900 p-4">
                {/* Search Box */}
                <div className="max-w-md mx-auto relative mb-8">
                    <FaSearch className="absolute left-3 top-1/2 text-gray-400 transform -translate-y-1/2" />
                    <input
                        type="search"
                        placeholder="Search jobs..."
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
                                    {searchResults.map((job) => (
                                        <li
                                            key={job.id}
                                            className="flex items-start justify-between"
                                        >
                                            <Link
                                                href={`/careers/job/${job.id}`}
                                                className="flex-1 p-3 hover:bg-gray-100 rounded"
                                            >
                                                <h3 className="font-semibold">{job.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {stripHtml(job.description).slice(0, 100)}…
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Deadline: {job.deadline}
                                                </p>
                                            </Link>

                                            <div className="flex space-x-2 ml-4">
                                                {user?.admin && (
                                                    <>
                                                        <button
                                                            onClick={() => editJob(job.id)}
                                                            className="p-2 hover:bg-gray-100 rounded"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteJob(job.id)}
                                                            disabled={deleteLoadingId === job.id}
                                                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {deleteLoadingId === job.id ? (
                                                                <Loader />
                                                            ) : (
                                                                <FaTrash />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
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

                {/* Main List of Jobs */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="flex items-start justify-between p-4 bg-white rounded shadow hover:shadow-lg"
                            >
                                <Link href={`/careers/job/${job.id}`} className="flex-1">
                                    <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                                    <p className="text-gray-700 text-sm">
                                        {stripHtml(job.description).slice(0, 150)}…
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Deadline: {job.deadline}
                                    </p>
                                </Link>

                                {user?.admin && (
                                    <div className="flex space-x-2 ml-4 items-center">
                                        <button
                                            onClick={() => editJob(job.id)}
                                            className="p-2 hover:bg-gray-100 rounded"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteJob(job.id)}
                                            disabled={deleteLoadingId === job.id}
                                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deleteLoadingId === job.id ? (
                                                <Loader />
                                            ) : (
                                                <FaTrash />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

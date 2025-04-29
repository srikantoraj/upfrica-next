"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";


const convertToDaysAgo = (isoDate) => {
    // Parse the ISO date string to a Date object
    const pastDate = new Date(isoDate);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const diffMs = currentDate - pastDate;
    // Convert milliseconds to days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Return "today" if it occurred within the same day, else return days ago.
    if (diffDays === 0) {
        return "today";
    }

    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const HelpBlogDrafts = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the help blog drafts on mount
    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const headers = new Headers();
                headers.append("Authorization", "Token aSJ36UapeFH5YARFamDTYhnJ");

                const requestOptions = {
                    method: "GET",
                    headers,
                    redirect: "follow",
                };

                const response = await fetch(
                    "https://media.upfrica.com/api/admin/helpblogs/drafts/",
                    requestOptions
                );
                const data = await response.json();
                // Assuming the drafts are in data.results; adjust if the API returns a different structure
                setDrafts(data?.results || data);
            } catch (error) {
                console.error("Error fetching drafts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrafts();
    }, []);

    // Publish a draft using a PATCH call
    const publishDraft = async (id) => {
        try {
            const headers = new Headers();
            headers.append("Authorization", "Token aSJ36UapeFH5YARFamDTYhnJ");
            headers.append("Content-Type", "application/json");

            const raw = JSON.stringify({ status: "published" });

            const requestOptions = {
                method: "PATCH",
                headers,
                body: raw,
                redirect: "follow",
            };

            const url = `https://media.upfrica.com/api/admin/helpblogs/${id}/publish/`;
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            window.alert(`Draft with id ${id} published successfully!`);
            setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== id));
        } catch (error) {
            console.error("Error publishing draft:", error);
            window.alert(`Error publishing draft: ${error.message}`);
        }
    };

    // Delete a draft using a DELETE call
    const deleteDraft = async (id) => {
        try {
            const headers = new Headers();
            headers.append("Authorization", "Token aSJ36UapeFH5YARFamDTYhnJ");

            const requestOptions = {
                method: "DELETE",
                headers,
                body: "",
                redirect: "follow",
            };

            const url = `https://media.upfrica.com/api/admin/helpblogs/${id}/`;
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            window.alert(`Draft with id ${id} deleted successfully!`);
            setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== id));
        } catch (error) {
            console.error("Error deleting draft:", error);
            window.alert(`Error deleting draft: ${error.message}`);
        }
    };

    // Render animated skeleton loader rows while drafts are being fetched
    const renderSkeletonRows = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <tr key={index} className="text-base tracking-wide animate-pulse">
                <td className="border border-gray-300 px-6 py-2 md:py-8 bg-gray-300">&nbsp;</td>
                <td className="border border-gray-300 px-4 bg-gray-300">
                    <div className="flex flex-col gap-2">
                        <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
                    </div>
                </td>
                <td className="border border-gray-300 px-6 py-4 bg-gray-300">
                    <div className="space-y-2">
                        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                        <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className="overflow-x-auto container mx-auto p-4 lg:p-10 bg-white shadow-lg rounded-md">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-center">Help Blog Drafts</h1>
                <Link href="/" className="text-blue-500 hover:underline">
                    Back to Home
                </Link>
            </header>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-200 text-xl font-bold">
                    <tr>
                        <th className="border border-gray-300 px-6 py-3 lg:w-1/12 text-left text-gray-700">ID</th>
                        <th className="border border-gray-300 px-6 py-3 lg:w-3/12 text-left text-gray-700">Actions</th>
                        <th className="border border-gray-300 px-6 py-3 lg:w-8/12 text-left text-gray-700">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {loading
                        ? renderSkeletonRows()
                        : drafts.length === 0
                            ? (
                                <tr>
                                    <td colSpan="3" className="border border-gray-300 px-6 py-4 text-center text-base">
                                        No drafts available.
                                    </td>
                                </tr>
                            )
                            : drafts.map((draft) => (
                                <tr key={draft.id} className="text-base tracking-wide">
                                    <td className="border border-gray-300 px-6 py-2 md:py-8">{draft.id}</td>
                                    <td className="border border-gray-300 px-4">
                                        <div className="flex flex-col gap-2">
                                            {/* Publish Button */}
                                            <button
                                                onClick={() => publishDraft(draft.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition-all duration-300"
                                            >
                                                Publish
                                            </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => deleteDraft(draft.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition-all duration-300"
                                            >
                                                Delete
                                            </button>
                                            
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-6 py-4">
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-semibold">{draft.title}</h2>
                                            <p>{draft.summary}</p>
                                            <p className="text-sm text-gray-600">
                                                Status: {draft.status}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Created :{convertToDaysAgo(draft?.created_at)}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                </tbody>
            </table>
        </div>
    );
};

export default HelpBlogDrafts;

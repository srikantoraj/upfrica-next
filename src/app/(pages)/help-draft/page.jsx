"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
                    "https://media.upfrica.com/api/admin/help-blogs/drafts/",
                    requestOptions
                );
                const data = await response.json();
                setDrafts(data);
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
            setDrafts((prevDrafts) =>
                prevDrafts.filter((draft) => draft.id !== id)
            );
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
            setDrafts((prevDrafts) =>
                prevDrafts.filter((draft) => draft.id !== id)
            );
        } catch (error) {
            console.error("Error deleting draft:", error);
            window.alert(`Error deleting draft: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Help Blog Drafts</h1>
                {/* Proper Link usage; no <a> tag nested inside */}
                <Link href="/dashboard" className="text-blue-500 hover:underline">
                    Back to Dashboard
                </Link>
            </header>

            {loading ? (
                <p>Loading drafts...</p>
            ) : drafts.length === 0 ? (
                <p>No drafts available.</p>
            ) : (
                <ul className="space-y-4">
                    {drafts.map((draft) => (
                        <li
                            key={draft.id}
                            className="border p-4 rounded shadow-sm flex flex-col gap-2"
                        >
                            <h2 className="text-xl font-semibold">{draft.title}</h2>
                            <p>{draft.summary}</p>
                            <p className="text-sm text-gray-600">Status: {draft.status}</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => publishDraft(draft.id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300"
                                >
                                    Publish
                                </button>
                                <button
                                    onClick={() => deleteDraft(draft.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300"
                                >
                                    Delete
                                </button>
                                {/* Link to the full update page */}
                                <Link
                                    href={`/admin/helpblog/${draft.id}/edit`}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300"
                                >
                                    Edit
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HelpBlogDrafts;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";

const convertToDaysAgo = (isoDate) => {
  const pastDate = new Date(isoDate);
  const currentDate = new Date();
  const diffMs = currentDate - pastDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return "today";
  }
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const AllBlogs = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  // State variables to track which draft is currently processing an action
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const { token, user } = useSelector((state) => state.auth);
  const router = useRouter();

  // Fetch the help blog drafts on mount
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const headers = new Headers();
        // headers.append("Authorization", "Token ...");

        const requestOptions = {
          method: "GET",
          headers,
          redirect: "follow",
        };

        const response = await fetch(
          "https://media.upfrica.com/api/helpblogs/",
          requestOptions,
        );
        const data = await response.json();
        setDrafts(data?.results || data);
      } catch (error) {
        console.error("Error fetching drafts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  // Loader component to be displayed inside a button during action processing
  const Loader = () => (
    <div className="flex space-x-2 justify-center items-center h-6">
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
    </div>
  );

  // Edit a draft
  const editBlog = async (slug, id) => {
    setEditLoadingId(id);
    // Optionally, you can simulate a delay
    router.push(`/all-blogs/edit/${slug}`);
    // As router.push navigates away, clearing state is usually not necessary.
  };

  // Delete a draft
  const deleteDraft = async (id) => {
    setDeleteLoadingId(id);
    try {
      const headers = new Headers();
      headers.append("Authorization", `Token aSJ36UapeFH5YARFamDTYhnJ`);
      headers.append("Content-Type", "application/json");

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
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Render skeleton loader rows while drafts are being fetched
  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <tr key={index} className="text-base tracking-wide animate-pulse">
        <td className="border border-gray-300 px-6 py-2 md:py-8 bg-gray-300">
          &nbsp;
        </td>
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
    <>
      <Header />
      <div className="overflow-x-auto container mx-auto p-4 lg:p-10 bg-white shadow-lg rounded-md">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center">Published Blogs</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </header>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200 text-xl font-bold">
            <tr>
              <th className="border border-gray-300 px-6 py-3 lg:w-1/12 text-left text-gray-700">
                ID
              </th>
              <th className="border border-gray-300 px-6 py-3 lg:w-3/12 text-left text-gray-700">
                Actions
              </th>
              <th className="border border-gray-300 px-6 py-3 lg:w-8/12 text-left text-gray-700">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeletonRows()
            ) : drafts.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-6 py-4 text-center text-base"
                >
                  No drafts available.
                </td>
              </tr>
            ) : (
              drafts.map((draft) => (
                <tr key={draft.id} className="text-base tracking-wide">
                  <td className="border border-gray-300 px-6 py-2 md:py-8">
                    {draft.id}
                  </td>
                  <td className="border border-gray-300 px-4">
                    <div className="flex flex-col gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => editBlog(draft.slug, draft.id)}
                        className="px-4 py-2 bg-gray-500 text-white rounded shadow-md hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
                      >
                        {editLoadingId === draft.id ? (
                          <Loader />
                        ) : (
                          <>
                            <CiEdit className="mr-2" />
                            Edit
                          </>
                        )}
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
                      >
                        {deleteLoadingId === draft.id ? (
                          <Loader />
                        ) : (
                          <>
                            <MdDelete className="mr-2" />
                            Delete
                          </>
                        )}
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
                        Created: {convertToDaysAgo(draft?.created_at)}
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllBlogs;

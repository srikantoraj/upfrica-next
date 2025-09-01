"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Pagination from "@/components/Pagination";

const DEFAULT_PAGE_SIZE = 20;
const SKELETON_ROWS = 10;
const DEBOUNCE_DELAY = 500;

export default function UserList() {
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();

  // pagination & search
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // data & loading
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // alerts & deleting state
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [deletingId, setDeletingId] = useState(null);

  // debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // fetch users or search
  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const headers = new Headers();
    headers.append("Authorization", `Token ${token}`);
    let url;

    if (searchQuery) {
      url = `https://media.upfrica.com/api/users/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&page_size=${perPage}`;
    } else {
      url = `https://media.upfrica.com/api/user-list/?page=${currentPage}&page_size=${perPage}`;
    }

    fetch(url, {
      method: "GET",
      headers,
      redirect: "follow",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / perPage));
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: "error", message: "Could not load users." });
      })
      .finally(() => setLoading(false));
  }, [token, currentPage, perPage, searchQuery]);

  // navigation
  const handleView = (id) => router.push(`/new-dashboard/all-users/${id}`);
  const handleEdit = (id) => router.push(`/new-dashboard/all-users/edit/${id}`);

  // delete user
  const handleDelete = async (id) => {
    // 1) ask for confirmation
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`https://media.upfrica.com/api/users/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      // 2) remove from state
      setUsers((prev) => prev.filter((u) => u.id !== id));

      // 3) show a browser alert
      window.alert("User deleted successfully.");

      // optional: also show your in-page alert banner
      // setAlert({ type: 'success', message: 'User deleted.' });
    } catch (err) {
      console.error(err);
      window.alert("Could not delete user."); // you can alert on error too
      // setAlert({ type: 'error', message: 'Could not delete user.' });
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header + Search */}
        <header className="flex items-center space-x-6 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Hi {user?.username}</h1>
            <p className="text-gray-600">Welcome to user management</p>
          </div>
          <div className="relative flex-1 max-w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users…"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </header>

        {/* Alert */}
        {alert.message && (
          <div
            className={`mb-4 px-4 py-3 border rounded ${
              alert.type === "success"
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            <span>{alert.message}</span>
            <button
              onClick={() => setAlert({ type: "", message: "" })}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Table + Pagination */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Users</h2>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-[15%] pb-2">Name</th>
                <th className="w-[30%] pb-2">Email</th>
                <th className="w-[15%] pb-2">Username</th>
                <th className="w-[10%] pb-2">Country</th>
                <th className="w-[10%] pb-2">Verified</th>
                <th className="w-[10%] pb-2">Created</th>
                <th className="w-[10%] pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                  <tr key={idx} className="even:bg-gray-50 animate-pulse">
                    {[...Array(7)].map((__, i) => (
                      <td key={i} className="py-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="even:bg-gray-50">
                    <td className="py-3">
                      {u.first_name} {u.last_name}
                    </td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">{u.username}</td>
                    <td className="py-3">{u.country || "—"}</td>
                    <td className="py-3">
                      {u.confirmed_at ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                    <td className="py-3">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 space-x-4 pl-3">
                      <button onClick={() => handleEdit(u.id)} title="Edit">
                        <FaEdit className="h-4 w-4 text-[#2B3F6C]" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={deletingId === u.id}
                        title="Delete"
                        className={`transition duration-300 ${
                          deletingId === u.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <FaTrash className="h-4 w-4 text-[#2B3F6C]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* bottom pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

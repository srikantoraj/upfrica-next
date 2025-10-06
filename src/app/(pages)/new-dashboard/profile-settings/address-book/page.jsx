"use client";

import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Pagination from "@/components/Pagination";

const DEFAULT_PAGE_SIZE = 20;
const SKELETON_ROWS = 8;
const DEBOUNCE_DELAY = 500;

export default function AddressBookPage() {
  const { user, token } = useSelector((state) => state.auth);

  // --- data + loading ---
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- search + pagination ---
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(DEFAULT_PAGE_SIZE);

  // --- edit modal state ---
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // debounce search input
  useEffect(() => {
    const h = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(h);
  }, [searchInput]);

  // fetch addresses
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("https://api.upfrica.com/api/addresses/", {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => setAddresses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // client‐side filter + pagination calc
  const filtered = addresses.filter((addr) => {
    const q = searchQuery.toLowerCase();
    return (
      addr.full_name?.toLowerCase().includes(q) ||
      addr.address_data?.street?.toLowerCase().includes(q) ||
      addr.address_data?.city?.toLowerCase().includes(q)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // open edit modal
  const startEdit = (addr) => {
    const ad = addr.address_data ?? {};
    setEditFormData({
      full_name: addr.full_name ?? "",
      default: addr.default ?? false,
      street: ad.street ?? ad.address_line_1 ?? "",
      city: ad.city ?? ad.town ?? "",
      state: ad.state ?? ad.local_area ?? "",
      country: ad.country ?? "",
      zip_code: ad.zip_code ?? ad.postcode ?? "",
      phone_number: ad.phone_number ?? "",
    });
    setEditError("");
    setEditingId(addr.id);
  };

  // save edits
  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(
        `https://api.upfrica.com/api/addresses/${editingId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: editFormData.full_name,
            default: editFormData.default,
            address_data: {
              street: editFormData.street,
              city: editFormData.city,
              state: editFormData.state,
              country: editFormData.country,
              zip_code: editFormData.zip_code,
              phone_number: editFormData.phone_number,
            },
          }),
        },
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }
      const updated = await res.json();
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? updated : a)),
      );
      setEditingId(null);
      window.alert("Address updated successfully.");
    } catch (err) {
      console.error(err);
      setEditError("Failed to update address.");
    } finally {
      setEditLoading(false);
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(
        `https://api.upfrica.com/api/addresses/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (!res.ok) throw new Error(`Deleted failed (${res.status})`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      window.alert("Address deleted.");
    } catch {
      window.alert("Could not delete address.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header + Search */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold">Address Book</h1>
            {user?.username && (
              <p className="text-gray-600">Hello, {user.username}</p>
            )}
          </div>
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search addresses…"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </header>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-[15%] pb-2">Name</th>
                <th className="w-[25%] pb-2">Street</th>
                <th className="w-[12%] pb-2">City</th>
                <th className="w-[12%] pb-2">State</th>
                <th className="w-[10%] pb-2">Country</th>
                <th className="w-[8%] pb-2">ZIP</th>
                <th className="w-[8%] pb-2">Phone</th>
                <th className="w-[5%] pb-2">Default</th>
                <th className="w-[5%] pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                  <tr key={idx} className="even:bg-gray-50 animate-pulse">
                    {Array.from({ length: 9 }).map((__, i) => (
                      <td key={i} className="py-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length > 0 ? (
                paginated.map((addr) => (
                  <tr
                    key={addr.id}
                    className="even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="py-3">{addr.full_name ?? "—"}</td>
                    <td className="py-3">
                      {addr.address_data?.street ??
                        addr.address_data?.address_line_1 ??
                        "—"}
                    </td>
                    <td className="py-3">
                      {addr.address_data?.city ??
                        addr.address_data?.town ??
                        "—"}
                    </td>
                    <td className="py-3">
                      {addr.address_data?.state ??
                        addr.address_data?.local_area ??
                        "—"}
                    </td>
                    <td className="py-3">
                      {addr.address_data?.country ?? "—"}
                    </td>
                    <td className="py-3">
                      {addr.address_data?.zip_code ??
                        addr.address_data?.postcode ??
                        "—"}
                    </td>
                    <td className="py-3">
                      {addr.address_data?.phone_number ?? "—"}
                    </td>
                    <td className="py-3">
                      {addr.default ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                    <td className="py-3 space-x-4 pl-2">
                      <button onClick={() => startEdit(addr)} title="Edit">
                        <FaEdit className="h-4 w-4 text-[#2B3F6C]" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        title="Delete"
                      >
                        <FaTrash className="h-4 w-4 text-[#2B3F6C]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-4 text-center text-gray-500">
                    No addresses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSave}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg space-y-4"
          >
            <h2 className="text-xl font-semibold">Edit Address</h2>
            {editError && <p className="text-red-600 text-sm">{editError}</p>}

            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-sm font-medium">Full Name</span>
                <input
                  type="text"
                  value={editFormData.full_name}
                  onChange={(e) =>
                    setEditFormData((fd) => ({
                      ...fd,
                      full_name: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded px-3 py-2"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Street</span>
                <input
                  type="text"
                  value={editFormData.street}
                  onChange={(e) =>
                    setEditFormData((fd) => ({
                      ...fd,
                      street: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded px-3 py-2"
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">City</span>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) =>
                      setEditFormData((fd) => ({
                        ...fd,
                        city: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border-gray-300 rounded px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">State</span>
                  <input
                    type="text"
                    value={editFormData.state}
                    onChange={(e) =>
                      setEditFormData((fd) => ({
                        ...fd,
                        state: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border-gray-300 rounded px-3 py-2"
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Country</span>
                  <input
                    type="text"
                    value={editFormData.country}
                    onChange={(e) =>
                      setEditFormData((fd) => ({
                        ...fd,
                        country: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border-gray-300 rounded px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">ZIP</span>
                  <input
                    type="text"
                    value={editFormData.zip_code}
                    onChange={(e) =>
                      setEditFormData((fd) => ({
                        ...fd,
                        zip_code: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border-gray-300 rounded px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Phone</span>
                  <input
                    type="text"
                    value={editFormData.phone_number}
                    onChange={(e) =>
                      setEditFormData((fd) => ({
                        ...fd,
                        phone_number: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border-gray-300 rounded px-3 py-2"
                  />
                </label>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editFormData.default}
                  onChange={(e) =>
                    setEditFormData((fd) => ({
                      ...fd,
                      default: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">Set as default</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

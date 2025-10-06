"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaSave } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

export default function EditUserPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // fetch existing user
  useEffect(() => {
    if (!token) return;
    setLoading(true);

    fetch(`https://api.upfrica.com/api/users/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch user");
        return res.json();
      })
      .then((data) => {
        setUserData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          username: data.username || "",
          country: data.country || "",
          confirmed: !!data.confirmed_at,
        });
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: "error", message: "Failed to load user." });
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!window.confirm('Save changes to this user?')) return;

    setSaving(true);
    try {
      const res = await fetch(`https://api.upfrica.com/api/users/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          username: userData.username,
          country: userData.country,
          confirmed_at: userData.confirmed ? new Date().toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error("Update failed");

      window.alert("User updated successfully.");
      router.back();
      // setAlert({ type: 'success', message: 'User saved.' });
    } catch (err) {
      console.error(err);
      window.alert("Could not save user.");
      setAlert({ type: "error", message: "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        {alert.message && (
          <div
            className={`mb-4 px-4 py-3 border rounded ${alert.type === "success"
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

        <h1 className="text-2xl font-semibold mb-4">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Last Name</label>
            <input
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Username</label>
            <input
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Country</label>
            <input
              name="country"
              value={userData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="confirmed"
              checked={userData.confirmed}
              onChange={handleChange}
              id="confirmed"
            />
            <label htmlFor="confirmed" className="ml-2">
              Verified
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full flex justify-center items-center py-2 rounded-full text-white ${saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700"
              }`}
          >
            <FaSave className="mr-2" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

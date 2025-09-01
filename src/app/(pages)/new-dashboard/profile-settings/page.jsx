"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const { user, token } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(user ?? {});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    phone_number: user?.phone_number ?? "",
    local_area: user?.local_area ?? "",
    town: user?.town ?? "",
    city: user?.city ?? "",
    region: user?.region ?? "",
    country: user?.country ?? "",
    time_zone: user?.time_zone ?? "",
    preferred_language: user?.preferred_language ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openEditor = () => {
    setError("");
    setFormData({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      username: profile.username ?? "",
      email: profile.email ?? "",
      phone_number: profile.phone_number ?? "",
      local_area: profile.local_area ?? "",
      town: profile.town ?? "",
      city: profile.city ?? "",
      region: profile.region ?? "",
      country: profile.country ?? "",
      time_zone: profile.time_zone ?? "",
      preferred_language: profile.preferred_language ?? "",
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // build headers exactly as your snippet
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      myHeaders.append("Content-Type", "application/json");

      // convert only the fields that the API accepts
      const raw = JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        local_area: formData.local_area,
        town: formData.town,
        city: formData.city,
        region: formData.region,
        country: formData.country,
        time_zone: formData.time_zone,
        preferred_language: formData.preferred_language,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "https://media.upfrica.com/api/update-profile/",
        requestOptions,
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Status ${response.status}`);
      }
      const updated = await response.json();
      setProfile(updated);
      setIsEditing(false);
      window.alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <button
            onClick={openEditor}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
          <div>
            <dt className="font-medium">First Name</dt>
            <dd>{profile.first_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Last Name</dt>
            <dd>{profile.last_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Username</dt>
            <dd>{profile.username ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Email</dt>
            <dd>{profile.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Phone</dt>
            <dd>{profile.phone_number ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Local Area</dt>
            <dd>{profile.local_area ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Town</dt>
            <dd>{profile.town ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">City</dt>
            <dd>{profile.city ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Region</dt>
            <dd>{profile.region ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Country</dt>
            <dd>{profile.country ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Time Zone</dt>
            <dd>{profile.time_zone ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium">Preferred Language</dt>
            <dd>{profile.preferred_language ?? "—"}</dd>
          </div>
        </dl>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg space-y-4"
          >
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "first_name", label: "First Name" },
                { name: "last_name", label: "Last Name" },
                { name: "username", label: "Username" },
                { name: "email", label: "Email", type: "email" },
                { name: "phone_number", label: "Phone" },
                { name: "local_area", label: "Local Area" },
                { name: "town", label: "Town" },
                { name: "city", label: "City" },
                { name: "region", label: "Region" },
                { name: "country", label: "Country" },
                { name: "time_zone", label: "Time Zone" },
                { name: "preferred_language", label: "Preferred Language" },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type ?? "text"}
                    value={formData[name] ?? ""}
                    onChange={(e) =>
                      setFormData((fd) => ({
                        ...fd,
                        [name]: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

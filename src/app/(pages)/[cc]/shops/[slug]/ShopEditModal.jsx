// ——————————————————————————————————————————————————————
// You can update any of these fields on PATCH /api/shops/{slug}/update/:
//
// • name                (string)           — your shop’s display name
// • description         (string)           — rich-text body stored via ActionText
// • bg_color            (hex color, eg. #FFEECC)
// • shoptype_id         (integer)          — the ID of one of your ShopType choices
// • shop_logo_upload    (file, image/png…) — new logo image
// • top_banner_upload   (file, image/jpeg…)— new hero banner
// • video_upload        (file, video/mp4…) — new shop video
//
// The server will return your updated Shop object (including fresh URLs).
// ——————————————————————————————————————————————————————
"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE } from "@/app/constants"; // API_BASE already points at /api

export default function ShopEditModal({ isOpen, onClose, shop, onSave }) {
  const token = useSelector((s) => s.auth.token);
const TYPES_URL = `${API_BASE.replace(/\/$/, "")}/shoptypes/`;
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");

  // shop types
  const [shopTypes, setShopTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [typesError, setTypesError] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shop) return;
    setName(shop.name || "");
    setDescription(shop.description || "");
    setBgColor(shop.bg_color || "#ffffff");
    setSelectedType(
      shop?.shoptype?.id
        ? String(shop.shoptype.id)
        : shop?.shoptype_id
        ? String(shop.shoptype_id)
        : ""
    );
    setLogoFile(null);
    setBannerFile(null);
    setVideoFile(null);
  }, [shop, isOpen]);

  // load shop types
useEffect(() => {
  if (!isOpen) return;                 // load when modal opens
  const ctrl = new AbortController();

  (async () => {
    setTypesLoading(true);
    try {
      // Keep it simple: no custom headers → avoid unnecessary preflight/CORS issues
      const r = await fetch(TYPES_URL, { signal: ctrl.signal, cache: "no-store" });
      if (!r.ok) throw new Error(`Status ${r.status}`);
      const data = await r.json();

      // accept either an array or DRF paginated object
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setShopTypes(items);
      setTypesError(items.length ? null : "No shop types available");
    } catch (err) {
      console.error("Shop types fetch failed:", err);
      setShopTypes([]);
      setTypesError("Could not load shop types");
    } finally {
      setTypesLoading(false);
    }
  })();

  return () => ctrl.abort();
}, [isOpen]);  // ← reload each time the modal opens

  if (!isOpen) return null;

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("bg_color", bgColor);

    if (selectedType) {
      formData.append("shoptype_id", String(selectedType)); // DRF typical
      formData.append("shoptype", String(selectedType));     // alt write field
    }

    if (logoFile) formData.append("shop_logo_upload", logoFile);
    if (bannerFile) formData.append("top_banner_upload", bannerFile);
    if (videoFile) formData.append("video_upload", videoFile);

    const resp = await fetch(`${API_BASE}/shops/${shop.slug}/update/`, {
      method: "PATCH",
      headers: { Authorization: `Token ${token}` },
      body: formData,
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Update failed (${resp.status}): ${errText}`);
    }

    const updated = await resp.json();

    // 🔁 Ensure UI shows the chosen type immediately
    const chosenType =
      shopTypes.find(t => String(t.id) === String(selectedType)) || null;

    const hydrated = {
      ...updated,
      // support various API shapes
      shoptype:
        updated.shoptype ??
        (typeof updated.shop_type === "number"
          ? shopTypes.find(t => t.id === updated.shop_type)
          : null) ??
        chosenType,
    };

    onSave?.(hydrated);
    onClose();
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Shop Info</h2>
          <button onClick={onClose} disabled={loading} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Shop Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-16 p-0 border-0"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Shop Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={loading || typesLoading}
              aria-busy={typesLoading}
            >
              <option value="">{typesLoading ? "Loading types…" : "Choose a type"}</option>
              {shopTypes.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.name}
                </option>
              ))}
            </select>
            {typesError && <p className="mt-1 text-xs text-red-600">{typesError}</p>}
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium mb-1">Shop Logo</label>
            <div className="flex items-center gap-4 mb-2">
              {(logoFile && URL.createObjectURL(logoFile)) || shop?.shop_logo ? (
                <img
                  src={logoFile ? URL.createObjectURL(logoFile) : shop.shop_logo}
                  alt="Logo"
                  className="h-16 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  No Logo
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0] || null)}
              disabled={loading}
            />
          </div>

          {/* Banner */}
          <div>
            <label className="block text-sm font-medium mb-1">Hero Banner</label>
            <div className="mb-2">
              {(bannerFile && URL.createObjectURL(bannerFile)) || shop?.top_banner ? (
                <img
                  src={bannerFile ? URL.createObjectURL(bannerFile) : shop.top_banner}
                  alt="Banner"
                  className="h-40 w-full object-cover rounded"
                />
              ) : (
                <div className="h-40 w-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  No Banner
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files[0] || null)}
              disabled={loading}
            />
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium mb-1">Video</label>
            <div className="mb-2">
              {videoFile ? (
                <video src={URL.createObjectURL(videoFile)} controls className="w-full rounded" />
              ) : shop?.video ? (
                <video src={shop.video} controls className="w-full rounded" />
              ) : (
                <div className="h-32 w-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  No Video
                </div>
              )}
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0] || null)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          {!loading && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-violet-700 text-white rounded disabled:opacity-50"
            >
              Update
            </button>
          )}
          {loading && (
            <button type="button" className="text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md" disabled>
              <div className="flex space-x-2 justify-center items-center h-6">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
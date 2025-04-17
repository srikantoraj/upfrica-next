



// ——————————————————————————————————————————————————————
// You can update any of these fields on PATCH /api/shops/{slug}/update/:
// 
// • name                (string)           — your shop’s display name  
// • description         (string)           — rich‑text body stored via ActionText  
// • bg_color            (hex color, eg. #FFEECC)  
// • shoptype_id         (integer)          — the ID of one of your ShopType choices  
// • shop_logo_upload    (file, image/png…) — new logo image  
// • top_banner_upload   (file, image/jpeg…)— new hero banner  
// • video_upload        (file, video/mp4…) — new shop video  
// 
// The server will return your updated Shop object (including fresh URLs).
// ——————————————————————————————————————————————————————


'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ShopEditModal({ isOpen, onClose, shop, setShop, onSave }) {
    const token = useSelector((state) => state.auth.token);

    const [name, setName] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [description, setDescription] = useState('');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [shopTypes, setShopTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Populate form when modal opens
    useEffect(() => {
        if (shop) {
            setName(shop.name || '');
            setDescription(shop.description || '');
            setBgColor(shop.bg_color || '#ffffff');
            setSelectedType(shop.shoptype?.id?.toString() || '');
            setLogoFile(null);
            setBannerFile(null);
            setVideoFile(null);
        }
    }, [shop, isOpen]);

    // Load shop-types for the dropdown
    useEffect(() => {
        fetch('https://media.upfrica.com/api/shoptypes/')
            .then((r) => {
                if (!r.ok) throw new Error(`Status ${r.status}`);
                return r.json();
            })
            .then(setShopTypes)
            .catch((e) => console.error('Failed loading types', e));
    }, []);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('bg_color', bgColor);
            formData.append('shoptype_id', selectedType);

            if (logoFile) formData.append('shop_logo_upload', logoFile);
            if (bannerFile) formData.append('top_banner_upload', bannerFile);
            if (videoFile) formData.append('video_upload', videoFile);

            const resp = await fetch(
                `https://media.upfrica.com/api/shops/${shop.slug}/update/`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Token ${token}`,
                        // no Content-Type header here!
                    },
                    body: formData,
                }
            );

            if (!resp.ok) {
                const errText = await resp.text();
                throw new Error(`Update failed (${resp.status}): ${errText}`);
            }

            const updated = await resp.json();
            onSave(updated);
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Edit Shop Info</h2>
                    <button onClick={onClose} disabled={loading} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {/* Shop Name */}
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

                    {/* Description */}
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

                    {/* Background Color */}
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

                    {/* Shop Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Shop Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            disabled={loading}
                        >
                            <option value="">Choose a type</option>
                            {shopTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Shop Logo */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Shop Logo</label>
                        <div className="flex items-center gap-4 mb-2">
                            {(logoFile && URL.createObjectURL(logoFile)) || shop.shop_logo ? (
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

                    {/* Top Banner */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Hero Banner</label>
                        <div className="mb-2">
                            {(bannerFile && URL.createObjectURL(bannerFile)) || shop.top_banner ? (
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
                            ) : shop.video ? (
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
                    {!loading && (<button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-violet-700 text-white rounded disabled:opacity-50"
                        
                    >
                        Update
                    </button>)}

                   
                    {loading && (<button
                        type="submit"
                        className=" text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={loading}
                    >
                        <div className="flex space-x-2 justify-center items-center h-6">
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
                        </div>
                    </button>)}
                    
                </div>
            </div>
        </div>
    );
}

// components/ShopEditModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ShopEditModal({ isOpen, onClose, shop, onSave }) {
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

    useEffect(() => {
        if (shop) {
            setName(shop.name || '');
            setDescription(shop.description || '');
            setBgColor(shop.bg_color || '#ffffff');
            setSelectedType(shop.shoptype?.id?.toString() || '');
        }
    }, [shop]);

    useEffect(() => {
        async function fetchTypes() {
            try {
                const resp = await fetch('https://media.upfrica.com/api/shoptypes/');
                if (!resp.ok) throw new Error(`Status ${resp.status}`);
                const data = await resp.json();
                setShopTypes(data);
            } catch (err) {
                console.error('Failed to load shop types:', err);
            }
        }
        fetchTypes();
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
            formData.append('shoptype', selectedType);
            if (logoFile) formData.append('shop_logo', logoFile);
            if (bannerFile) formData.append('top_banner', bannerFile);
            if (videoFile) formData.append('video', videoFile);

            const resp = await fetch(
                `https://media.upfrica.com/shops/${shop.slug}/`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: formData,
                }
            );
            if (!resp.ok) throw new Error(`Update failed (${resp.status})`);
            const updatedShop = await resp.json();
            onSave(updatedShop);
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
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={loading}
                    >
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
                        />
                    </div>

                    {/* Shop Logo */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Shop Logo</label>
                        <div className="flex items-center gap-4">
                            {(logoFile && URL.createObjectURL(logoFile)) ||
                                shop.shop_logo ? (
                                <img
                                    src={
                                        logoFile
                                            ? URL.createObjectURL(logoFile)
                                            : shop.shop_logo
                                    }
                                    alt="Logo Preview"
                                    className="h-16 w-16 object-cover rounded"
                                />
                            ) : (
                                <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                    No Logo
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files[0] || null)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Hero Banner */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Hero Banner</label>
                        <div className="mb-2">
                            {(bannerFile && URL.createObjectURL(bannerFile)) ||
                                shop.top_banner ? (
                                <img
                                    src={
                                        bannerFile
                                            ? URL.createObjectURL(bannerFile)
                                            : shop.top_banner
                                    }
                                    alt="Banner Preview"
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
                                <video
                                    src={URL.createObjectURL(videoFile)}
                                    controls
                                    className="w-full rounded"
                                />
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

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
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
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-violet-700 text-white rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Updating…' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
}

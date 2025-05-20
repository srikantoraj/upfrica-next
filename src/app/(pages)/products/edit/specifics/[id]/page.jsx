'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import LoaderButton from '@/components/LoaderButton';

export default function ProductSpecificsPage({ params }) {
    const { id: productId } = params;
    const { token } = useSelector((state) => state.auth);

    const [specifics, setSpecifics] = useState([
        { label: '', value: '', active: true },
    ]);
    const [saving, setSaving] = useState(false);

    const handleSpecificChange = (idx, field, val) => {
        setSpecifics((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], [field]: val };
            return copy;
        });
    };

    const handleRemoveSpecific = (idx) => {
        setSpecifics((prev) => prev.filter((_, i) => i !== idx));
    };

    const addSpecific = () => {
        setSpecifics((prev) => [
            ...prev,
            { label: '', value: '', active: true },
        ]);
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const payload = specifics.map((s) => ({
                label: s.label,
                value: s.value,
            }));

            const res = await fetch(
                `https://media.upfrica.com/api/products/${productId}/properties/bulk/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `Error ${res.status}`);
            }

            alert('Specifics saved successfully.');
            window.history.back();
        } catch (err) {
            console.error(err);
            alert('Failed to save specifics—check console for details.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full"
                >
                    <FaArrowLeft className="mr-2" /> Go Back
                </button>
                <h1 className="text-2xl font-semibold">Product #{productId} Specifics</h1>
            </header>

            {/* Specifics List */}
            <div className="space-y-6">
                {specifics.map((s, i) => (
                    <div
                        key={i}
                        className="border border-gray-300 rounded-lg bg-white shadow p-4 flex flex-wrap items-center gap-4"
                    >
                        {/* Label */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Label
                            </label>
                            <input
                                type="text"
                                value={s.label}
                                onChange={(e) =>
                                    handleSpecificChange(i, 'label', e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm"
                                placeholder="e.g. Color"
                            />
                        </div>

                        {/* Value */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Value
                            </label>
                            <input
                                type="text"
                                value={s.value}
                                onChange={(e) =>
                                    handleSpecificChange(i, 'value', e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm"
                                placeholder="e.g. Red"
                            />
                        </div>

                        {/* Active */}
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={s.active}
                                onChange={(e) =>
                                    handleSpecificChange(i, 'active', e.target.checked)
                                }
                                className="h-4 w-4 text-violet-600 border-gray-300 rounded"
                            />
                            <span className="text-sm">Active</span>
                        </label>

                        {/* Delete */}
                        <button
                            onClick={() => handleRemoveSpecific(i)}
                            className="text-red-600 hover:text-red-800 text-sm rounded-full p-2"
                        >
                            <FaTrashAlt />
                        </button>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={addSpecific}
                    className="px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-full text-sm"
                >
                    + Add Specific
                </button>
                <LoaderButton
                    onClick={handleSubmit}
                    loading={saving}
                    className="px-6 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-full text-sm"
                >
                    {saving ? 'Saving…' : 'Submit'}
                </LoaderButton>
            </div>
        </div>
    );
}

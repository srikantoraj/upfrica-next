// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
// import LoaderButton from '@/components/LoaderButton';

// export default function ProductVariantsPage({ params }) {
//     const { id: productId } = params;
//     const { token } = useSelector((state) => state.auth);

//     const [variants, setVariants] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const [showModal, setShowModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState({
//         id: null,
//         label: '',
//         active: true,
//         options: [{ id: null, value: '', additionalPrice: '', active: true }],
//     });
//     const [saving, setSaving] = useState(false);

//     // Fetch all variants on mount
//     useEffect(() => {
//         if (!token) return;
//         setLoading(true);
//         fetch(`https://media.upfrica.com/api/products/${productId}/variants/`, {
//             headers: { Authorization: `Token ${token}` },
//         })
//             .then((res) => {
//                 if (!res.ok) throw new Error(`Error ${res.status}`);
//                 return res.json();
//             })
//             .then((data) => {
//                 setVariants(data);
//                 setError('');
//             })
//             .catch((err) => setError(err.message))
//             .finally(() => setLoading(false));
//     }, [productId, token]);

//     // Open empty form for new variant
//     const handleAdd = () => {
//         setFormData({
//             id: null,
//             label: '',
//             active: true,
//             options: [{ id: null, value: '', additionalPrice: '', active: true }],
//         });
//         setIsEditing(false);
//         setShowModal(true);
//     };

//     // Open form populated for editing
//     const handleEdit = (v) => {
//         setFormData({
//             id: v.id,
//             label: v.label,
//             active: v.active,
//             options: (v.variant ?? []).map((opt) => ({
//                 id: opt.id,
//                 value: opt.value,
//                 additionalPrice: (opt.additional_price_cents / 100).toFixed(2),
//                 active: opt.active,
//             })),
//         });
//         setIsEditing(true);
//         setShowModal(true);
//     };

//     // Delete variant group
//     const handleDelete = async (variantId) => {
//         if (!confirm('Are you sure you want to delete this variant?')) return;
//         try {
//             const res = await fetch(
//                 `https://media.upfrica.com/api/products/${productId}/variants/${variantId}/`,
//                 {
//                     method: 'DELETE',
//                     headers: { Authorization: `Token ${token}` },
//                 }
//             );
//             if (!res.ok) throw new Error(`Error ${res.status}`);
//             setVariants((prev) => prev.filter((v) => v.id !== variantId));
//         } catch (err) {
//             alert(`Could not delete variant: ${err.message}`);
//         }
//     };

//     // Form field handlers
//     const updateField = (field, val) =>
//         setFormData((fd) => ({ ...fd, [field]: val }));
//     const updateOption = (idx, field, val) =>
//         setFormData((fd) => {
//             const opts = [...fd.options];
//             opts[idx] = { ...opts[idx], [field]: val };
//             return { ...fd, options: opts };
//         });
//     const addOption = () =>
//         setFormData((fd) => ({
//             ...fd,
//             options: [
//                 ...fd.options,
//                 { id: null, value: '', additionalPrice: '', active: true },
//             ],
//         }));
//     const removeOption = (idx) =>
//         setFormData((fd) => {
//             const opts = [...fd.options];
//             opts.splice(idx, 1);
//             return { ...fd, options: opts };
//         });

//     // Create or update variant
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         try {
//             const payload = {
//                 label: formData.label,
//                 active: formData.active,
//                 default_value: formData.options[0]?.value || '',
//                 variant: formData.options.map((opt) => ({
//                     value: opt.value,
//                     additional_price_cents: Math.round(parseFloat(opt.additionalPrice) * 100),
//                     additional_price_currency: 'USD',
//                     active: opt.active,
//                 })),
//             };

//             const urlBase = `https://media.upfrica.com/api/products/${productId}/variants/`;
//             const url = isEditing ? `${urlBase}${formData.id}/` : urlBase;
//             const method = isEditing ? 'PATCH' : 'POST';

//             const res = await fetch(url, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Token ${token}`,
//                 },
//                 body: JSON.stringify(payload),
//             });
//             if (!res.ok) {
//                 const txt = await res.text();
//                 throw new Error(txt || `Error ${res.status}`);
//             }

//             // Replace local variants list with full array returned by server
//             const data = await res.json();
//             setVariants(Array.isArray(data) ? data : []);

//             setShowModal(false);
//         } catch (err) {
//             alert(`Save failed: ${err.message}`);
//         } finally {
//             setSaving(false);
//         }
//     };

//     return (
//         <div className="container mx-auto p-6">
//             <header className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-semibold">Product #{productId} Variants</h1>
//                 <button
//                     onClick={handleAdd}
//                     className="inline-flex items-center px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-full shadow"
//                 >
//                     <FaPlus className="mr-2" /> Add Variant
//                 </button>
//             </header>

//             {error && <p className="mb-4 text-red-600">Error: {error}</p>}

//             <div className="overflow-x-auto bg-white shadow rounded-lg">
//                 <table className="w-full text-left">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-4 py-2">Label</th>
//                             <th className="px-4 py-2">Options</th>
//                             <th className="px-4 py-2">Active</th>
//                             <th className="px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading
//                             ? Array.from({ length: 5 }).map((_, i) => (
//                                 <tr key={i} className="animate-pulse">
//                                     <td className="px-4 py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-3/4" />
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-5/6" />
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-1/2" />
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-1/3" />
//                                     </td>
//                                 </tr>
//                             ))
//                             : variants.map((v) => (
//                                 <tr key={v.id} className="border-t">
//                                     <td className="px-4 py-3">{v.label}</td>
//                                     <td className="px-4 py-3">
//                                         {((v.variant ?? []).map((o) => o.value).join(', ')) || '—'}
//                                     </td>
//                                     <td className="px-4 py-3">{v.active ? 'Yes' : 'No'}</td>
//                                     <td className="px-4 py-3 space-x-3">
//                                         <button
//                                             onClick={() => handleEdit(v)}
//                                             className="inline-flex items-center px-3 py-1 bg-violet-700 hover:bg-violet-800 text-white rounded-full"
//                                         >
//                                             <FaEdit />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(v.id)}
//                                             className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
//                                         >
//                                             <FaTrashAlt />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
//                     <form
//                         onSubmit={handleSubmit}
//                         className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 space-y-6"
//                     >
//                         {/* Close button */}
//                         <button
//                             type="button"
//                             onClick={() => setShowModal(false)}
//                             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
//                         >
//                             &times;
//                         </button>

//                         <h2 className="text-2xl font-semibold">
//                             {isEditing ? 'Edit Variant' : 'New Variant'}
//                         </h2>

//                         {/* Label */}
//                         <label className="block">
//                             <span className="text-sm font-medium">Label</span>
//                             <input
//                                 type="text"
//                                 placeholder="Color, Size, etc."
//                                 value={formData.label}
//                                 onChange={(e) => updateField('label', e.target.value)}
//                                 className="mt-1 block w-full border-gray-300 rounded-full px-4 py-2"
//                                 required
//                             />
//                         </label>

//                         {/* Active */}
//                         <label className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 className="h-4 w-4 text-violet-600 border-gray-300 rounded"
//                                 checked={formData.active}
//                                 onChange={(e) => updateField('active', e.target.checked)}
//                             />
//                             <span className="text-sm">Active</span>
//                         </label>

//                         {/* Options */}
//                         <div>
//                             <p className="text-sm font-medium mb-2">Options</p>
//                             {formData.options.map((opt, i) => (
//                                 <div
//                                     key={i}
//                                     className={`mb-4 border border-gray-200 rounded-full p-4 ${opt.active ? 'bg-gray-100' : 'bg-white'
//                                         }`}
//                                 >
//                                     <div className="flex gap-2 items-center">
//                                         <input
//                                             type="text"
//                                             placeholder="Red, Blue, etc."
//                                             value={opt.value}
//                                             onChange={(e) => updateOption(i, 'value', e.target.value)}
//                                             className="flex-1 border rounded-full px-4 py-2 text-sm"
//                                             required
//                                         />
//                                         <input
//                                             type="number"
//                                             step="1"
//                                             placeholder="Price"
//                                             value={opt.additionalPrice}
//                                             onChange={(e) =>
//                                                 updateOption(i, 'additionalPrice', e.target.value)
//                                             }
//                                             className="w-24 border rounded-full px-4 py-2 text-sm"
//                                             required
//                                         />
//                                         <label className="flex items-center space-x-1">
//                                             <input
//                                                 type="checkbox"
//                                                 className="h-4 w-4 text-violet-600 border-gray-300 rounded"
//                                                 checked={opt.active}
//                                                 onChange={(e) =>
//                                                     updateOption(i, 'active', e.target.checked)
//                                                 }
//                                             />
//                                             <span className="text-sm">Active</span>
//                                         </label>
//                                         <button
//                                             type="button"
//                                             onClick={() => removeOption(i)}
//                                             className="text-red-600 hover:underline text-sm"
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={addOption}
//                                 className="text-violet-700 hover:underline text-sm"
//                             >
//                                 + Add Option
//                             </button>
//                         </div>

//                         {/* Actions */}
//                         <div className="flex justify-end space-x-3 mt-4">
//                             <button
//                                 type="button"
//                                 onClick={() => setShowModal(false)}
//                                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full"
//                                 disabled={saving}
//                             >
//                                 Cancel
//                             </button>
//                             <LoaderButton
//                                 type="submit"
//                                 loading={saving}
//                                 className="px-6 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-full"
//                             >
//                                 {isEditing ? 'Save Changes' : 'Create Variant'}
//                             </LoaderButton>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// }
"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import LoaderButton from "@/components/LoaderButton";

export default function ProductVariantsPage({ params }) {
  const { id: productId } = params;
  const { token } = useSelector((state) => state.auth);

  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    label: "",
    active: true,
    options: [{ id: null, value: "", additionalPrice: "", active: true }],
  });
  const [saving, setSaving] = useState(false);

  // Fetch all variants on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`https://media.upfrica.com/api/products/${productId}/variants/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVariants(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId, token]);

  // Open empty form for new variant
  const handleAdd = () => {
    setFormData({
      id: null,
      label: "",
      active: true,
      options: [{ id: null, value: "", additionalPrice: "", active: true }],
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Open form populated for editing
  const handleEdit = (v) => {
    setFormData({
      id: v.id,
      label: v.label,
      active: v.active,
      options: (v.variant ?? []).map((opt) => ({
        id: opt.id,
        value: opt.value,
        additionalPrice: (opt.additional_price_cents / 100).toFixed(2),
        active: opt.active,
      })),
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete variant group
  const handleDelete = async (variantId) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/products/${productId}/variants/${variantId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (err) {
      alert(`Could not delete variant: ${err.message}`);
    }
  };

  // Form field handlers
  const updateField = (field, val) =>
    setFormData((fd) => ({ ...fd, [field]: val }));
  const updateOption = (idx, field, val) =>
    setFormData((fd) => {
      const opts = [...fd.options];
      opts[idx] = { ...opts[idx], [field]: val };
      return { ...fd, options: opts };
    });
  const addOption = () =>
    setFormData((fd) => ({
      ...fd,
      options: [
        ...fd.options,
        { id: null, value: "", additionalPrice: "", active: true },
      ],
    }));
  const removeOption = (idx) =>
    setFormData((fd) => {
      const opts = [...fd.options];
      opts.splice(idx, 1);
      return { ...fd, options: opts };
    });

  // Create or update variant
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        label: formData.label,
        active: formData.active,
        default_value: formData.options[0]?.value || "",
        variant: formData.options.map((opt) => ({
          value: opt.value,
          additional_price_cents: Math.round(
            parseFloat(opt.additionalPrice) * 100,
          ),
          additional_price_currency: "USD",
          active: opt.active,
        })),
      };

      const urlBase = `https://media.upfrica.com/api/products/${productId}/variants/`;
      const url = isEditing ? `${urlBase}${formData.id}/` : urlBase;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error ${res.status}`);
      }
      // Replace local variants list with full array returned by server
      const data = await res.json();
      setVariants(Array.isArray(data) ? data : []);
      setShowModal(false);
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full"
          >
            <FaArrowLeft className="mr-1" /> Go Back
          </button>
          <h1 className="text-2xl font-semibold">
            Product #{productId} Variants
          </h1>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-full shadow"
        >
          <FaPlus className="mr-2" /> Add Variant
        </button>
      </header>

      {error && <p className="mb-4 text-red-600">Error: {error}</p>}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Options</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </td>
                  </tr>
                ))
              : variants.map((v) => (
                  <tr key={v.id} className="border-t">
                    <td className="px-4 py-3">{v.label}</td>
                    <td className="px-4 py-3">
                      {(v.variant ?? []).map((o) => o.value).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">{v.active ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 space-x-3">
                      <button
                        onClick={() => handleEdit(v)}
                        className="inline-flex items-center px-3 py-1 bg-violet-700 hover:bg-violet-800 text-white rounded-full"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 space-y-6"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold">
              {isEditing ? "Edit Variant" : "New Variant"}
            </h2>

            {/* Label */}
            <label className="block">
              <span className="text-sm font-medium">Label</span>
              <input
                type="text"
                placeholder="Color, Size, etc."
                value={formData.label}
                onChange={(e) => updateField("label", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-full px-4 py-2"
                required
              />
            </label>

            {/* Active */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-violet-600 border-gray-300 rounded"
                checked={formData.active}
                onChange={(e) => updateField("active", e.target.checked)}
              />
              <span className="text-sm">Active</span>
            </label>

            {/* Options */}
            <div>
              <p className="text-sm font-medium mb-2">Options</p>
              {formData.options.map((opt, i) => (
                <div
                  key={i}
                  className={`mb-4 border border-gray-200 rounded-full p-4 ${
                    opt.active ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Red, Blue, etc."
                      value={opt.value}
                      onChange={(e) => updateOption(i, "value", e.target.value)}
                      className="flex-1 border rounded-full px-4 py-2 text-sm"
                      required
                    />
                    <input
                      type="number"
                      step="1"
                      placeholder="Price"
                      value={opt.additionalPrice}
                      onChange={(e) =>
                        updateOption(i, "additionalPrice", e.target.value)
                      }
                      className="w-24 border rounded-full px-4 py-2 text-sm"
                      required
                    />
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-violet-600 border-gray-300 rounded"
                        checked={opt.active}
                        onChange={(e) =>
                          updateOption(i, "active", e.target.checked)
                        }
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-violet-700 hover:underline text-sm"
              >
                + Add Option
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full"
                disabled={saving}
              >
                Cancel
              </button>
              <LoaderButton
                type="submit"
                loading={saving}
                className="px-6 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-full"
              >
                {isEditing ? "Save Changes" : "Create Variant"}
              </LoaderButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

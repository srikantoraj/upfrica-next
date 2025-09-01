"use client";

import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const ProductSpecificsForm = ({ params }) => {
  const { id } = params;

  const [specifics, setSpecifics] = useState([
    {
      label: "",
      value: "",
      active: true,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSpecificChange = (idx, updated) => {
    const copy = [...specifics];
    copy[idx] = updated;
    setSpecifics(copy);
  };

  const handleRemoveSpecific = (idx) => {
    const copy = [...specifics];
    copy.splice(idx, 1);
    setSpecifics(copy);
  };

  const addSpecific = () => {
    setSpecifics([...specifics, { label: "", value: "", active: true }]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare array of { label, value } for bulk endpoint
      const payload = specifics.map((s) => ({
        label: s.label,
        value: s.value,
      }));

      const resp = await fetch(
        `https://media.upfrica.com/api/products/${id}/properties/bulk/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token aSJ36UapeFH5YARFamDTYhnJ",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Error ${resp.status}: ${text}`);
      }

      alert("Specifics created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save specifics—check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-24 relative">
      <div className="my-8">
        <strong className="text-lg text-gray-800 block">
          Product #{id} Specifics
        </strong>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">Specifics</h3>

      {specifics.map((s, i) => (
        <div
          key={i}
          className="border border-gray-300 rounded-lg mb-6 shadow-sm bg-white p-4"
        >
          <div className="flex flex-wrap md:flex-nowrap md:items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Label
              </label>
              <input
                type="text"
                value={s.label}
                onChange={(e) =>
                  handleSpecificChange(i, {
                    ...s,
                    label: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. Color"
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Value
              </label>
              <input
                type="text"
                value={s.value}
                onChange={(e) =>
                  handleSpecificChange(i, {
                    ...s,
                    value: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. Red"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.active}
                onChange={(e) =>
                  handleSpecificChange(i, {
                    ...s,
                    active: e.target.checked,
                  })
                }
              />
              <span className="text-sm">Active</span>
            </div>

            <button
              onClick={() => handleRemoveSpecific(i)}
              className="text-red-600 hover:text-red-800 ml-auto text-sm flex items-center gap-1"
            >
              <FaTrashAlt /> Delete
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          onClick={addSpecific}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          + Add Specific
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {loading ? "Saving…" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ProductSpecificsForm;

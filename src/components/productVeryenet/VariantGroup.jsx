import React from "react";
import VariantOption from "./VariantOption";

const VariantGroup = ({ data, index, onChange, onRemove }) => {
    if (!data) return null; // 👈 Prevents crashing on undefined data
  const handleOptionChange = (i, option) => {
    const updated = { ...data };
    updated.options[i] = option;
    onChange(updated);
  };

  const addOption = () => {
    const updated = { ...data };
    updated.options.push({
      value: "",
      additionalPrice: "0.00",
      active: true,
      images: [],
    });
    onChange(updated);
  };

  const removeOption = (i) => {
    const updated = { ...data };
    updated.options.splice(i, 1);
    onChange(updated);
  };

  return (
    <div className="border rounded p-4 mb-6 bg-gray-50">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Attribute Name (e.g. Color, Package)</label>
          <input
            type="text"
            className="form-input w-full"
            value={data.label}
            onChange={(e) => onChange({ ...data, label: e.target.value })}
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.active}
              onChange={(e) => onChange({ ...data, active: e.target.checked })}
            />
            Active
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.useImageVariant}
              onChange={(e) => onChange({ ...data, useImageVariant: e.target.checked })}
            />
            Use Image Variant
          </label>
        </div>
        <button
          onClick={onRemove}
          type="button"
          className="text-red-600 hover:underline text-sm"
        >
          ❌ Remove
        </button>
      </div>

      {data.options.map((option, i) => (
        <VariantOption
          key={i}
          data={option}
          onChange={(newOpt) => handleOptionChange(i, newOpt)}
          onRemove={() => removeOption(i)}
        />
      ))}

      <button
        onClick={addOption}
        type="button"
        className="text-sm mt-2 text-blue-600 hover:underline"
      >
        ➕ Add Option
      </button>
    </div>
  );
};

export default VariantGroup;

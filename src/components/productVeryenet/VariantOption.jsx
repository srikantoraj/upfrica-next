import React from "react";

const VariantOption = ({ data, onChange, onRemove }) => {
  if (!data) return null; // 👈 Prevents crashing on undefined data
  return (
    <div className="bg-white p-3 border rounded mb-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <input
          type="text"
          className="form-input"
          placeholder="Option name"
          value={data.value}
          onChange={(e) => onChange({ ...data, value: e.target.value })}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Additional Price (e.g. 199.99)"
          value={data.additionalPrice}
          onChange={(e) =>
            onChange({ ...data, additionalPrice: e.target.value })
          }
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.active}
            onChange={(e) => onChange({ ...data, active: e.target.checked })}
          />
          Active
        </label>
        <button
          type="button"
          className="text-red-500 text-sm hover:underline"
          onClick={onRemove}
        >
          🗑️ Remove Option
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Upload Images</label>
        <input
          type="file"
          multiple
          className="form-input"
          onChange={(e) =>
            onChange({ ...data, images: Array.from(e.target.files) })
          }
        />
      </div>
    </div>
  );
};

export default VariantOption;

import React from "react";

const DescriptionEditor = ({ formik }) => {
  return (
    <section className="">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Description</h2>
      </div>

      {/* Toolbar can stay as-is */}

      {/* Textarea bound to formik */}
      <div className="mb-4">
        <textarea
          className="w-full h-40 border border-gray-300 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a detailed description of your item, or let AI draft it for you..."
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
      </div>

      {/* Optional AI Suggestion Button */}
      <div className="text-right">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            const aiText = "This is a suggested AI description...";
            formik.setFieldValue('description', aiText); // Example AI text
          }}
        >
          Use AI description
        </button>
      </div>
    </section>
  );
};


export default DescriptionEditor;

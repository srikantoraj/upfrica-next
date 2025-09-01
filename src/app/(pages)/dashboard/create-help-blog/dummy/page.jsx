"use client";
import React from "react";
import { Formik, FieldArray } from "formik";
import Link from "next/link";
import Script from "next/script";
import Footer from "@/components/common/footer/Footer";

// ----------------------------------------------------------------------
// Dummy initial values to prefill the form (simulate data from the backend)
// ----------------------------------------------------------------------
const initialFormValues = {
  title: "How to Set Up Delivery Information for your Listings",
  summary:
    "Etsy offers many delivery tools to help you set postage rates in your shop.",
  tags: ["delivery", "postage", "Etsy"],
  sections: [
    {
      sectionTitle: "Introduction",
      sectionType: "paragraph",
      sectionContent:
        "Etsy offers many delivery tools to help you set up your listings. Use delivery profiles, offer discounts on postage for multiple items and more.",
      bulletItems: [],
      tableHeaders: [],
      tableRows: [],
      files: [], // File objects will be stored here
      links: [],
    },
    {
      sectionTitle: "Postage Pricing",
      sectionType: "bullet",
      sectionContent: "",
      bulletItems: [
        "Listings with postage under $6 are prioritised.",
        "Check guidelines for postage price search.",
      ],
      tableHeaders: [],
      tableRows: [],
      files: [],
      links: [],
    },
    {
      sectionTitle: "Delivery Profile Highlight",
      sectionType: "highlight",
      sectionContent:
        "A delivery profile allows you to apply consistent settings to multiple listings. Update once to save everywhere.",
      bulletItems: [],
      tableHeaders: [],
      tableRows: [],
      files: [],
      links: [],
    },
    {
      sectionTitle: "Sample Pricing Table",
      sectionType: "table",
      sectionContent: "",
      bulletItems: [],
      tableHeaders: ["Item", "One item price", "Additional item price"],
      tableRows: [
        ["Item A", "2.00 USD", "0.50 USD"],
        ["Item B", "1.00 USD", "0.75 USD"],
      ],
      files: [],
      links: [],
    },
    {
      sectionTitle: "Additional Resources",
      sectionType: "links",
      sectionContent: "",
      bulletItems: [],
      tableHeaders: [],
      tableRows: [],
      files: [],
      links: [
        { text: "Learn about free delivery", url: "/help/free-delivery" },
        { text: "Calculated postage info", url: "/help/calculated-postage" },
      ],
    },
  ],
};

// ----------------------------------------------------------------------
// Basic Formik validation (extend as needed)
// ----------------------------------------------------------------------
const validate = (values) => {
  const errors = {};
  if (!values.title) errors.title = "Title is required.";
  if (!values.summary) errors.summary = "Summary is required.";
  return errors;
};

// ----------------------------------------------------------------------
// PreviewTable Component – Renders a table that shows the current sections
// from the form values.
// ----------------------------------------------------------------------
const PreviewTable = ({ sections }) => {
  return (
    <div className="overflow-x-auto my-8 border-t pt-8">
      <h2 className="text-2xl font-bold text-violet-700 mb-4">
        Preview Sections Data
      </h2>
      <table className="min-w-full border border-gray-400">
        <thead>
          <tr className="bg-violet-700 text-white">
            <th className="px-4 py-2 border">Index</th>
            <th className="px-4 py-2 border">Section Title</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Content Summary</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, i) => (
            <tr key={i}>
              <td className="px-4 py-2 border">{i + 1}</td>
              <td className="px-4 py-2 border">{section.sectionTitle}</td>
              <td className="px-4 py-2 border">
                {section.sectionType || "Not selected"}
              </td>
              <td className="px-4 py-2 border">
                {section.sectionType === "paragraph" ||
                section.sectionType === "highlight" ? (
                  section.sectionContent
                ) : section.sectionType === "bullet" ? (
                  section.bulletItems.join("; ")
                ) : section.sectionType === "table" ? (
                  <>
                    Headers: {section.tableHeaders.join(", ")} <br />
                    Rows:{" "}
                    {section.tableRows
                      .map((row) => row.join(" | "))
                      .join(" ; ")}
                  </>
                ) : section.sectionType === "links" ? (
                  section.links.map((lk) => `${lk.text} (${lk.url})`).join("; ")
                ) : section.sectionType === "image" ? (
                  `${section.files.length} file(s) selected`
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main CreateHelpBlogPage Component
// ----------------------------------------------------------------------
export default function CreateHelpBlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-violet-700 mb-6">
        Create Help Blog Post
      </h1>
      <Formik
        initialValues={initialFormValues}
        validate={validate}
        onSubmit={(values) => {
          // When the form is submitted, log the data
          console.log("Submitted data:", values);
          alert("Help Blog Post submitted. Check the console for data.");
        }}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Title */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter post title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border border-violet-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
                {touched.title && errors.title && (
                  <div className="text-red-600 text-sm">{errors.title}</div>
                )}
              </div>

              {/* Summary */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Summary
                </label>
                <textarea
                  name="summary"
                  placeholder="Enter a short summary"
                  rows="2"
                  value={values.summary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border border-violet-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
                {touched.summary && errors.summary && (
                  <div className="text-red-600 text-sm">{errors.summary}</div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tags
                </label>
                <FieldArray name="tags">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.tags.map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            name={`tags[${idx}]`}
                            placeholder="Enter tag"
                            value={tag}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                          />
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="text-red-500 font-bold"
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push("New Tag")}
                        className="text-violet-700 underline"
                      >
                        + Add Tag
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Sections */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Sections
                </label>
                <FieldArray name="sections">
                  {({ push, remove }) => (
                    <div className="space-y-6">
                      {values.sections.map((section, secIndex) => (
                        <div
                          key={secIndex}
                          className="border border-gray-300 rounded-md p-4 bg-gray-100"
                        >
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                              Section {secIndex + 1}
                            </h2>
                            {values.sections.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(secIndex)}
                                className="text-red-500 font-bold"
                              >
                                Remove Section
                              </button>
                            )}
                          </div>
                          {/* Section Title */}
                          <div className="mt-2">
                            <label className="block text-gray-700 font-bold mb-1">
                              Section Title
                            </label>
                            <input
                              type="text"
                              name={`sections[${secIndex}].sectionTitle`}
                              placeholder="Enter section title"
                              value={section.sectionTitle}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="w-full border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                            />
                          </div>

                          {/* Section Type */}
                          <div className="mt-2">
                            <label className="block text-gray-700 font-bold mb-1">
                              Section Type
                            </label>
                            <select
                              name={`sections[${secIndex}].sectionType`}
                              value={section.sectionType}
                              onChange={handleChange}
                              className="w-full border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                            >
                              <option value="">Select Type</option>
                              <option value="paragraph">Paragraph</option>
                              <option value="bullet">Bullet List</option>
                              <option value="highlight">Highlight</option>
                              <option value="table">Table</option>
                              <option value="image">Image</option>
                              <option value="links">Links</option>
                            </select>
                          </div>

                          {/* Conditional Fields Based on Section Type */}
                          {["paragraph", "highlight"].includes(
                            section.sectionType,
                          ) && (
                            <div className="mt-2">
                              <label className="block text-gray-700 font-bold mb-1">
                                Content
                              </label>
                              <textarea
                                name={`sections[${secIndex}].sectionContent`}
                                placeholder="Enter content"
                                rows="4"
                                value={section.sectionContent}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                              />
                            </div>
                          )}

                          {section.sectionType === "bullet" && (
                            <div className="mt-2">
                              <label className="block text-gray-700 font-bold mb-1">
                                Bullet Items
                              </label>
                              <FieldArray
                                name={`sections[${secIndex}].bulletItems`}
                              >
                                {({ push, remove }) => (
                                  <div className="space-y-2">
                                    {(section.bulletItems || []).map(
                                      (item, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-2"
                                        >
                                          <input
                                            type="text"
                                            name={`sections[${secIndex}].bulletItems[${index}]`}
                                            placeholder="Bullet item"
                                            value={item}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500 font-bold"
                                          >
                                            X
                                          </button>
                                        </div>
                                      ),
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => push("Bullet Item")}
                                      className="text-violet-700 underline"
                                    >
                                      + Add Bullet
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          )}

                          {section.sectionType === "table" && (
                            <div className="mt-2 space-y-4">
                              {/* Table Headers */}
                              <div>
                                <label className="block text-gray-700 font-bold mb-1">
                                  Table Headers
                                </label>
                                <FieldArray
                                  name={`sections[${secIndex}].tableHeaders`}
                                >
                                  {({ push, remove }) => (
                                    <div className="space-y-2">
                                      {(section.tableHeaders || []).map(
                                        (header, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-2"
                                          >
                                            <input
                                              type="text"
                                              name={`sections[${secIndex}].tableHeaders[${index}]`}
                                              placeholder="Header"
                                              value={header}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => remove(index)}
                                              className="text-red-500"
                                            >
                                              X
                                            </button>
                                          </div>
                                        ),
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => push("Header")}
                                        className="text-violet-700 underline"
                                      >
                                        + Add Header
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                              {/* Table Rows */}
                              <div>
                                <label className="block text-gray-700 font-bold mb-1">
                                  Table Rows
                                </label>
                                <FieldArray
                                  name={`sections[${secIndex}].tableRows`}
                                >
                                  {({ push, remove }) => (
                                    <div className="space-y-4">
                                      {(section.tableRows || []).map(
                                        (row, rowIndex) => (
                                          <div
                                            key={rowIndex}
                                            className="space-y-2 border p-2 rounded"
                                          >
                                            <label className="block font-bold text-gray-700">
                                              Row {rowIndex + 1}
                                            </label>
                                            <FieldArray
                                              name={`sections[${secIndex}].tableRows[${rowIndex}]`}
                                            >
                                              {({ push, remove }) => (
                                                <div className="space-y-2">
                                                  {row.map(
                                                    (cell, cellIndex) => (
                                                      <div
                                                        key={cellIndex}
                                                        className="flex items-center gap-2"
                                                      >
                                                        <input
                                                          type="text"
                                                          name={`sections[${secIndex}].tableRows[${rowIndex}][${cellIndex}]`}
                                                          placeholder="Cell"
                                                          value={cell}
                                                          onChange={
                                                            handleChange
                                                          }
                                                          onBlur={handleBlur}
                                                          className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                                        />
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            remove(cellIndex)
                                                          }
                                                          className="text-red-500"
                                                        >
                                                          X
                                                        </button>
                                                      </div>
                                                    ),
                                                  )}
                                                  <button
                                                    type="button"
                                                    onClick={() => push("Cell")}
                                                    className="text-violet-700 underline"
                                                  >
                                                    + Add Cell
                                                  </button>
                                                </div>
                                              )}
                                            </FieldArray>
                                            <button
                                              type="button"
                                              onClick={() => remove(rowIndex)}
                                              className="text-red-500 underline"
                                            >
                                              Remove Row
                                            </button>
                                          </div>
                                        ),
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => push([])}
                                        className="text-violet-700 underline"
                                      >
                                        + Add Row
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            </div>
                          )}

                          {section.sectionType === "image" && (
                            <div className="mt-2">
                              <label className="block text-gray-700 font-bold mb-1">
                                Upload Files
                              </label>
                              <input
                                type="file"
                                name={`sections[${secIndex}].files`}
                                multiple
                                onChange={(e) =>
                                  setFieldValue(
                                    `sections[${secIndex}].files`,
                                    Array.from(e.target.files),
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          )}

                          {section.sectionType === "links" && (
                            <div className="mt-2">
                              <label className="block text-gray-700 font-bold mb-1">
                                Links
                              </label>
                              <FieldArray name={`sections[${secIndex}].links`}>
                                {({ push, remove }) => (
                                  <div className="space-y-2">
                                    {(section.links || []).map(
                                      (link, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-2"
                                        >
                                          <input
                                            type="text"
                                            name={`sections[${secIndex}].links[${index}].text`}
                                            placeholder="Link text"
                                            value={link.text}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                          />
                                          <input
                                            type="text"
                                            name={`sections[${secIndex}].links[${index}].url`}
                                            placeholder="Link URL"
                                            value={link.url}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500"
                                          >
                                            X
                                          </button>
                                        </div>
                                      ),
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        push({
                                          text: "New Link",
                                          url: "https://example.com",
                                        })
                                      }
                                      className="text-violet-700 underline"
                                    >
                                      + Add Link
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            sectionTitle: "New Section",
                            sectionType: "",
                            sectionContent: "",
                            bulletItems: [],
                            tableHeaders: [],
                            tableRows: [],
                            files: [],
                            links: [],
                          })
                        }
                        className="text-violet-700 underline font-bold text-lg"
                      >
                        + Add Section
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-violet-700 hover:bg-violet-800 text-white font-semibold rounded-md transition-colors duration-200"
              >
                Create Help Blog Post
              </button>
            </form>

            {/* Preview Table – shows the current sections from the form */}
            <PreviewTable sections={values.sections} />
          </>
        )}
      </Formik>
      <Footer />
      <Scripts />
    </div>
  );
}

const Scripts = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.etsy.com/ac/evergreenVendor/js/en-US/zendesk_help_center/header.ffb044d22fc2e825d083.js?z=c07b859e7c81e56b5d68d2a725292397"
      />
      <Script
        strategy="afterInteractive"
        src="https://www.etsy.com/ac/evergreenVendor/js/en-US/zendesk_help_center/article_page.829581db8ed43b2066c6.js?z=c07b859e7c81e56b5d68d2a725292397"
      />
      <Script
        strategy="afterInteractive"
        src="https://www.etsy.com/ac/evergreenVendor/js/en-US/zendesk_help_center/footer.511461acd9437365538c.js?z=c07b859e7c81e56b5d68d2a725292397"
      />
      <Script
        strategy="afterInteractive"
        src="//static.zdassets.com/hc/assets/en-gb.3e9727124d078807077c.js"
      />
    </>
  );
};

'use client';
import React from 'react';
import { Formik, FieldArray } from 'formik';
import Link from 'next/link';
import Script from 'next/script';
import Footer from '@/components/common/footer/Footer';

// Initial form values for creating a Help Blog Post.
// In production, you might start with empty values or fetch defaults from your backend.
const initialFormValues = {
  title: "",
  summary: "",
  tags: [], // e.g. ["shipping", "delivery"]
  sections: [
    {
      sectionTitle: "",
      sectionType: "", // Options: "paragraph", "bullet", "highlight", "table", "image", "links"
      // For paragraph or highlight types:
      sectionContent: "",
      // For bullet list type:
      bulletItems: [],
      // For table type:
      tableHeaders: [],
      tableRows: [], // Each row is an array of cell strings.
      // For image type:
      files: [], // File objects uploaded by the user.
      // For links type:
      links: [] // Each link is an object: { text: "", url: "" }
    }
  ]
};

// Simple Formik validation
const validate = (values) => {
  const errors = {};
  if (!values.title) errors.title = "Title is required.";
  if (!values.summary) errors.summary = "Summary is required.";
  // You can extend further validations as needed.
  return errors;
};

export default function CreateHelpBlogPage() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 p-4 container mx-auto p20">
      <h1 className="text-3xl font-bold text-violet-700 mb-6 text-center">
        Create Help Blog Post
      </h1>
      <Formik
        initialValues={initialFormValues}
        validate={validate}
        onSubmit={(values) => {
          // In production, you would send the data to your backend API.
          console.log("Submitted values:", values);
          alert("Help blog post submitted!");
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
                    {values.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          name={`tags[${index}]`}
                          placeholder="Enter tag"
                          value={tag}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="flex-1 border border-violet-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 font-bold"
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
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
                            <option value="">Select Section Type</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="bullet">Bullet List</option>
                            <option value="highlight">Highlight</option>
                            <option value="table">Table</option>
                            <option value="image">Image</option>
                            <option value="links">Links</option>
                          </select>
                        </div>

                        {/* Conditionally render fields based on Section Type */}
                        {["paragraph", "highlight"].includes(section.sectionType) && (
                          <div className="mt-2">
                            <label className="block text-gray-700 font-bold mb-1">
                              Content
                            </label>
                            <textarea
                              name={`sections[${secIndex}].sectionContent`}
                              value={section.sectionContent}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter content"
                              rows="4"
                              className="w-full border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                            />
                          </div>
                        )}

                        {section.sectionType === "bullet" && (
                          <div className="mt-2">
                            <label className="block text-gray-700 font-bold mb-1">
                              Bullet Items
                            </label>
                            <FieldArray name={`sections[${secIndex}].bulletItems`}>
                              {({ push, remove }) => (
                                <div className="space-y-2">
                                  {(section.bulletItems || []).map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        name={`sections[${secIndex}].bulletItems[${index}]`}
                                        value={item}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Bullet item"
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
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => push("")}
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
                              <FieldArray name={`sections[${secIndex}].tableHeaders`}>
                                {({ push, remove }) => (
                                  <div className="space-y-2">
                                    {(section.tableHeaders || []).map((header, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          name={`sections[${secIndex}].tableHeaders[${index}]`}
                                          value={header}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          placeholder="Header"
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
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => push("")}
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
                              <FieldArray name={`sections[${secIndex}].tableRows`}>
                                {({ push, remove }) => (
                                  <div className="space-y-4">
                                    {(section.tableRows || []).map((row, rowIndex) => (
                                      <div key={rowIndex} className="space-y-2 border p-2 rounded">
                                        <label className="block font-bold text-gray-700">
                                          Row {rowIndex + 1}
                                        </label>
                                        <FieldArray name={`sections[${secIndex}].tableRows[${rowIndex}]`}>
                                          {({ push, remove }) => (
                                            <div className="space-y-2">
                                              {row.map((cell, cellIndex) => (
                                                <div key={cellIndex} className="flex items-center gap-2">
                                                  <input
                                                    type="text"
                                                    name={`sections[${secIndex}].tableRows[${rowIndex}][${cellIndex}]`}
                                                    value={cell}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Cell"
                                                    className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => remove(cellIndex)}
                                                    className="text-red-500"
                                                  >
                                                    X
                                                  </button>
                                                </div>
                                              ))}
                                              <button
                                                type="button"
                                                onClick={() => push("")}
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
                                    ))}
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
                              Upload Images
                            </label>
                            <input
                              type="file"
                              name={`sections[${secIndex}].files`}
                              onChange={(e) =>
                                setFieldValue(`sections[${secIndex}].files`, e.target.files)
                              }
                              multiple
                              className="w-full"
                            />
                          </div>
                        )}

                        {section.sectionType === "links" && (
                          <div className="mt-2">
                            <label className="block text-gray-700 font-bold mb-1">Links</label>
                            <FieldArray name={`sections[${secIndex}].links`}>
                              {({ push, remove }) => (
                                <div className="space-y-2">
                                  {(section.links || []).map((link, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        name={`sections[${secIndex}].links[${index}].text`}
                                        value={link.text}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Link text"
                                        className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                      />
                                      <input
                                        type="text"
                                        name={`sections[${secIndex}].links[${index}].url`}
                                        value={link.url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Link URL"
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
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => push({ text: "", url: "" })}
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
                          sectionTitle: "",
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

            {/* Submit Button */}
            <div className='my-10'>
              <button
                type="submit"
                className="w-80 mb-10 self-center mx-auto py-2 bg-violet-700 hover:bg-violet-800 text-white font-semibold rounded-full transition-colors duration-200"
              >
                Create Help Blog Post
              </button>
           </div>
          </form>
        )}
      </Formik>
      
      <Scripts />
    </div>
    <Footer />
    </>
  );
}

const Scripts = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="//static.zdassets.com/hc/assets/en-gb.3e9727124d078807077c.js"
      />
    </>
  );
};

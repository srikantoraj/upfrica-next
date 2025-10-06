"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { Formik, FieldArray } from "formik";
import Link from "next/link";
import Script from "next/script";
import Footer from "@/components/common/footer/Footer";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./LoadingSkeleton";
import { Editor } from "@tinymce/tinymce-react"; // ⬅️ ফাইলের উপর Import দিতে ভুলো না
import { useRef } from "react"; // ⬅️ এটাও দিতে হবে

const UpdateHelpBlogPage = ({ params }) => {
  const { slug } = params;
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  // State for the fetched blog and initial form values.
  const [blogData, setBlogData] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    summary: "",
    tags: [],
    sections: [],
  });
  const [loading, setLoading] = useState(true);

  const summaryEditorRef = useRef(null); // ⬅️ component এর ভিতরে রাখতে হবে

  useEffect(() => {
    async function fetchBlog() {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `https://api.upfrica.com/api/helpblogs/${slug}`,
          requestOptions,
        );
        const data = await response.json();
        setBlogData(data);
        // Set initial form values using the fetched blog data.
        setInitialValues({
          title: data.title || "",
          summary: data.summary || "",
          tags: data.tags || [],
          sections:
            data.sections && data.sections.length > 0
              ? data.sections
              : [
                {
                  sectionType: "",
                  sectionTitle: "",
                  sectionContent: "",
                  bulletItems: [],
                  tableHeaders: [],
                  tableRows: [],
                  files: [],
                  links: [],
                },
              ],
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  const validate = (values) => {
    const errors = {};
    if (!values.title) errors.title = "Title is required.";
    if (!values.summary) errors.summary = "Summary is required.";
    return errors;
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 container mx-auto p-20">
        <h1 className="text-3xl font-bold text-violet-700 mb-6 text-center">
          Update Help Blog Post
        </h1>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validate={validate}
          onSubmit={(values, { setSubmitting }) => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Token aSJ36UapeFH5YARFamDTYhnJ`);
            myHeaders.append("Content-Type", "application/json");

            fetch(`https://api.upfrica.com/api/helpblogs/${slug}/update/`, {
              method: "PUT", // Use PATCH if your API requires it.
              headers: myHeaders,
              body: JSON.stringify(values),
              redirect: "follow",
            })
              .then((response) => response.json())
              .then((result) => {
                // console.log('result',result, )
                alert("Help blog post updated successfully!");
                router.push(`/all-blogs/`);
              })
              .catch((error) => {
                console.error("Error updating blog:", error);
                alert("Failed to update help blog post.");
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
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

              {/* Summary Field */}
              {/* <div>
                                <label className="block text-gray-700 font-bold mb-1">
                                    Summary <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="summary"
                                    placeholder="Enter a short summary"
                                    rows="3"
                                    value={values.summary}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full border border-violet-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
                                />
                                {touched.summary && errors.summary && (
                                    <div className="text-red-600 text-sm">{errors.summary}</div>
                                )}
                            </div> */}

              {/* Summary Field */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Summary <span className="text-red-500">*</span>
                </label>
                <Editor
                  apiKey="cly2l2971z9pgqhfjufgnqbl1h4nomfzmiqbjositk620gut"
                  onInit={(evt, editor) => (summaryEditorRef.current = editor)}
                  value={values.summary || ""}
                  onEditorChange={(content) => {
                    setFieldValue("summary", content);
                  }}
                  init={{
                    height: 250,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table help wordcount",
                    ].join(" "),
                    toolbar:
                      "undo redo | formatselect | bold italic underline forecolor | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
                {touched.summary && errors.summary && (
                  <div className="text-red-600 text-sm">{errors.summary}</div>
                )}
              </div>

              {/* Tags Field */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tags
                </label>
                <FieldArray name="tags">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.tags &&
                        values.tags.map((tag, index) => (
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
                      {values.sections &&
                        values.sections.map((section, secIndex) => (
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

                            {/* Render section content based on section type */}
                            {/* {["paragraph", "highlight"].includes(
                                                            section.sectionType
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
                                                            )} */}

                            {["paragraph", "highlight"].includes(
                              section.sectionType,
                            ) && (
                                <div className="mt-2">
                                  <label className="block text-gray-700 font-bold mb-1">
                                    Content
                                  </label>
                                  <Editor
                                    apiKey="cly2l2971z9pgqhfjufgnqbl1h4nomfzmiqbjositk620gut" // তোমার TinyMCE API Key
                                    value={section.sectionContent || ""}
                                    init={{
                                      height: 250,
                                      menubar: false,
                                      plugins: [
                                        "advlist autolink lists link charmap preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste help wordcount",
                                      ],
                                      toolbar:
                                        "undo redo | formatselect | bold italic underline forecolor | " +
                                        "alignleft aligncenter alignright alignjustify | " +
                                        "bullist numlist outdent indent | removeformat | help",
                                      content_style:
                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                    }}
                                    onEditorChange={(content) => {
                                      setFieldValue(
                                        `sections[${secIndex}].sectionContent`,
                                        content,
                                      );
                                    }}
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
                                      {section.bulletItems &&
                                        section.bulletItems.map(
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
                                  <FieldArray
                                    name={`sections[${secIndex}].tableHeaders`}
                                  >
                                    {({ push, remove }) => (
                                      <div className="space-y-2">
                                        {section.tableHeaders &&
                                          section.tableHeaders.map(
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
                                  <FieldArray
                                    name={`sections[${secIndex}].tableRows`}
                                  >
                                    {({ push, remove }) => (
                                      <div className="space-y-4">
                                        {section.tableRows &&
                                          section.tableRows.map(
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
                                                              onBlur={
                                                                handleBlur
                                                              }
                                                              className="flex-1 border border-violet-700 rounded px-4 py-2 focus:ring-2 focus:ring-violet-700"
                                                            />
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                remove(
                                                                  cellIndex,
                                                                )
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
                                                  onClick={() =>
                                                    remove(rowIndex)
                                                  }
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
                                  Upload Images
                                </label>
                                <input
                                  type="file"
                                  name={`sections[${secIndex}].files`}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `sections[${secIndex}].files`,
                                      e.target.files,
                                    )
                                  }
                                  multiple
                                  className="w-full"
                                />
                              </div>
                            )}

                            {section.sectionType === "links" && (
                              <div className="mt-2">
                                <label className="block text-gray-700 font-bold mb-1">
                                  Links
                                </label>
                                <FieldArray
                                  name={`sections[${secIndex}].links`}
                                >
                                  {({ push, remove }) => (
                                    <div className="space-y-2">
                                      {section.links &&
                                        section.links.map((link, index) => (
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
                                        ))}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          push({ text: "", url: "" })
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
                            sectionType: "",
                            sectionTitle: "",
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
              <div>
                {!isSubmitting ? (
                  <button
                    type="submit"
                    className="text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isSubmitting}
                  >
                    Update Help Blog
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-[200px] text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md font-bold"
                  >
                    <div className="flex space-x-2 justify-center items-center h-6">
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
                    </div>
                  </button>
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
      <Scripts />
      <Footer />
    </>
  );
};

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

export default UpdateHelpBlogPage;

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Formik, FieldArray } from "formik";
// import Link from "next/link";
// import Script from "next/script";
// import Footer from "@/components/common/footer/Footer";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { Editor } from "@tinymce/tinymce-react"; // TinyMCE Import
// import LoadingSkeleton from "./LoadingSkeleton";

// const UpdateHelpBlogPage = ({ params }) => {
//     const { slug } = params;
//     const { token } = useSelector((state) => state.auth);
//     const router = useRouter();
//     const summaryEditorRef = useRef(null);

//     const [initialValues, setInitialValues] = useState({
//         title: "",
//         summary: "",
//         tags: [],
//         sections: []
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchBlog() {
//             try {
//                 const response = await fetch(`https://api.upfrica.com/api/helpblogs/${slug}`, {
//                     method: "GET",
//                     redirect: "follow"
//                 });
//                 const data = await response.json();
//                 setInitialValues({
//                     title: data.title || "",
//                     summary: data.summary || "",
//                     tags: data.tags || [],
//                     sections: data.sections?.length > 0 ? data.sections : [
//                         {
//                             sectionType: "",
//                             sectionTitle: "",
//                             sectionContent: "",
//                             bulletItems: [],
//                             tableHeaders: [],
//                             tableRows: [],
//                             files: [],
//                             links: []
//                         }
//                     ]
//                 });
//             } catch (error) {
//                 console.error("Error fetching blog:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchBlog();
//     }, [slug]);

//     const validate = (values) => {
//         const errors = {};
//         if (!values.title) errors.title = "Title is required.";
//         if (!values.summary) errors.summary = "Summary is required.";
//         return errors;
//     };

//     if (loading) {
//         return <LoadingSkeleton />;
//     }

//     return (
//         <>
//             <div className="min-h-screen bg-gray-50 container mx-auto p-20">
//                 <h1 className="text-3xl font-bold text-violet-700 mb-6 text-center">
//                     Update Help Blog Post
//                 </h1>

//                 <Formik
//                     initialValues={initialValues}
//                     enableReinitialize
//                     validate={validate}
//                     onSubmit={(values, { setSubmitting }) => {
//                         const myHeaders = new Headers();
//                         myHeaders.append("Authorization", `Token ${token}`);
//                         myHeaders.append("Content-Type", "application/json");

//                         fetch(`https://api.upfrica.com/api/helpblogs/${slug}/update/`, {
//                             method: "PUT",
//                             headers: myHeaders,
//                             body: JSON.stringify(values),
//                             redirect: "follow"
//                         })
//                             .then((response) => response.json())
//                             .then((result) => {
//                                 alert("Help blog post updated successfully!");
//                                 router.push(`/all-blogs/`);
//                             })
//                             .catch((error) => {
//                                 console.error("Error updating blog:", error);
//                                 alert("Failed to update help blog post.");
//                             })
//                             .finally(() => {
//                                 setSubmitting(false);
//                             });
//                     }}
//                 >
//                     {({
//                         values,
//                         errors,
//                         touched,
//                         handleChange,
//                         handleBlur,
//                         handleSubmit,
//                         setFieldValue,
//                         isSubmitting
//                     }) => (
//                         <form onSubmit={handleSubmit} className="space-y-6">

//                             {/* Title Field */}
//                             <div>
//                                 <label className="block text-gray-700 font-bold mb-1">
//                                     Title <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={values.title}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     placeholder="Enter post title"
//                                     className="w-full border border-violet-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-700"
//                                 />
//                                 {touched.title && errors.title && (
//                                     <div className="text-red-600 text-sm">{errors.title}</div>
//                                 )}
//                             </div>

//                             {/* Updated Summary Field using TinyMCE */}
//                             <div>
//                                 <label className="block text-gray-700 font-bold mb-1">
//                                     Summary <span className="text-red-500">*</span>
//                                 </label>
//                                 <Editor
//                                     apiKey="cly2l2971z9pgqhfjufgnqbl1h4nomfzmiqbjositk620gut"
//                                     onInit={(evt, editor) => (summaryEditorRef.current = editor)}
//                                     value={values.summary || ''}
//                                     onEditorChange={(content) => {
//                                         setFieldValue('summary', content);
//                                     }}
//                                     init={{
//                                         height: 250,
//                                         menubar: false,
//                                         plugins: [
//                                             'advlist autolink lists link charmap preview anchor',
//                                             'searchreplace visualblocks code fullscreen',
//                                             'insertdatetime media table help wordcount'
//                                         ].join(' '),
//                                         toolbar:
//                                             'undo redo | formatselect | bold italic underline forecolor | ' +
//                                             'alignleft aligncenter alignright alignjustify | ' +
//                                             'bullist numlist outdent indent | removeformat | help',
//                                         content_style:
//                                             'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//                                     }}
//                                 />
//                                 {touched.summary && errors.summary && (
//                                     <div className="text-red-600 text-sm">{errors.summary}</div>
//                                 )}
//                             </div>

//                             {/* Tags */}
//                             <div>
//                                 <label className="block text-gray-700 font-bold mb-1">
//                                     Tags
//                                 </label>
//                                 <FieldArray name="tags">
//                                     {({ push, remove }) => (
//                                         <div className="space-y-2">
//                                             {values.tags.map((tag, index) => (
//                                                 <div key={index} className="flex items-center gap-2">
//                                                     <input
//                                                         type="text"
//                                                         name={`tags[${index}]`}
//                                                         value={tag}
//                                                         onChange={handleChange}
//                                                         onBlur={handleBlur}
//                                                         placeholder="Enter tag"
//                                                         className="flex-1 border border-violet-700 rounded px-4 py-2"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => remove(index)}
//                                                         className="text-red-500 font-bold"
//                                                     >
//                                                         X
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                             <button
//                                                 type="button"
//                                                 onClick={() => push('')}
//                                                 className="text-violet-700 underline"
//                                             >
//                                                 + Add Tag
//                                             </button>
//                                         </div>
//                                     )}
//                                 </FieldArray>
//                             </div>

//                             {/* Sections */}
//                             <div>
//                                 {/* আগের মতোই Section গুলো থাকবে (Paragraph, Bullet, Highlight, Table, Image, Links etc.) */}
//                                 {/* তুমি চাইলে আমি চাইলে এই অংশও এখান থেকে লিখে দিতে পারি, নইলে যেটা আগের মতো কাজ করছিলো সেটাই রাখবে */}
//                             </div>

//                             {/* Submit Button */}
//                             <div>
//                                 <button
//                                     type="submit"
//                                     className="text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     disabled={isSubmitting}
//                                 >
//                                     {isSubmitting ? "Updating..." : "Update Help Blog"}
//                                 </button>
//                             </div>
//                         </form>
//                     )}
//                 </Formik>
//             </div>
//             <Scripts />
//             <Footer />
//         </>
//     );
// };

// const Scripts = () => (
//     <>
//         <Script
//             strategy="afterInteractive"
//             src="//static.zdassets.com/hc/assets/en-gb.3e9727124d078807077c.js"
//         />
//     </>
// );

// export default UpdateHelpBlogPage;

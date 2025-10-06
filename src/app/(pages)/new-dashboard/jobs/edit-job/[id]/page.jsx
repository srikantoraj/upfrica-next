"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Formik, FieldArray } from "formik";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import Footer from "@/components/common/footer/Footer";

const validate = (values) => {
  const errors = {};
  if (!values.title) errors.title = "Title is required";
  if (!values.department) errors.department = "Department is required";
  if (!values.employment_type)
    errors.employment_type = "Employment type is required";
  if (!values.location) errors.location = "Location is required";
  if (!values.description) errors.description = "Description is required";
  return errors;
};

export default function EditJobPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const { token } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const descriptionEditorRef = useRef(null);
  const roleEditorRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://api.upfrica.com/api/jobs/${id}/`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
      })
      .catch((err) => {
        console.error("Fetch job error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col space-y-6 p-8 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto" />
        <div className="h-6 bg-gray-300 rounded w-full" />
        <div className="h-10 bg-gray-300 rounded w-full" />
        <div className="h-10 bg-gray-300 rounded w-full" />
        <div className="h-10 bg-gray-300 rounded w-full" />
        <div className="h-40 bg-gray-300 rounded w-full" />
        <div className="h-40 bg-gray-300 rounded w-full" />
        <div className="h-24 bg-gray-300 rounded w-full" />
        <div className="h-10 bg-gray-300 rounded w-1/3" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Job not found.
      </div>
    );
  }

  const LoadingDots = ({ color = "white" }) => (
    <div className="flex space-x-2 justify-center py-3">
      <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce`} />
      <div
        className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-150`}
      />
      <div
        className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-300`}
      />
      <div
        className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-300`}
      />
      <div
        className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-300`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-8 mb-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Edit Job Post
        </h1>

        <Formik
          initialValues={{
            title: job.title || "",
            department: job.department || "",
            employment_type: job.employment_type || "",
            location: job.location || "",
            deadline: job.deadline || "",
            description: job.description || "",
            role_details: job.role_details || "",
            qualifications: job.qualifications.length
              ? job.qualifications
              : [""],
            contact_email: job.contact_email || "",
            is_active: job.is_active,
          }}
          validate={validate}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitError("");
            try {
              const res = await fetch(
                `https://api.upfrica.com/api/jobs/${id}/`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                  },
                  body: JSON.stringify(values),
                },
              );
              const data = await res.json();
              if (res.ok) {
                alert("Job updated successfully!");
                router.back(); // redirect back to listing
              } else {
                setSubmitError(
                  typeof data === "object" ? JSON.stringify(data) : data,
                );
              }
            } catch (err) {
              setSubmitError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="text-red-600 text-center">{submitError}</div>
              )}

              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Customer Experience Manager"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
                {touched.title && errors.title && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.title}
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Customer Support"
                  value={values.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
                {touched.department && errors.department && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.department}
                  </div>
                )}
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="employment_type"
                  value={values.employment_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-700"
                >
                  <option value="">Select type</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="agent">Agent</option>
                </select>
                {touched.employment_type && errors.employment_type && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.employment_type}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Remote or Multiple Locations"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
                {touched.location && errors.location && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.location}
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Application Deadline
                </label>
                <input
                  type="text"
                  name="deadline"
                  placeholder="e.g. 2025-06-30 or Open Until Filled"
                  value={values.deadline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <Editor
                  apiKey="cly2l2971z9pgqhfjufgnqbl1h4nomfzmiqbjositk620gut"
                  onInit={(evt, editor) =>
                    (descriptionEditorRef.current = editor)
                  }
                  value={values.description}
                  init={{
                    height: 200,
                    menubar: false,
                    placeholder:
                      "Short summary, e.g. Lead our customer support team to excellence",
                    plugins: [
                      "advlist autolink lists link charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table help wordcount",
                    ].join(" "),
                    toolbar:
                      "undo redo | formatselect | bold italic underline | " +
                      "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                  }}
                  onEditorChange={(content) =>
                    setFieldValue("description", content)
                  }
                />
                {touched.description && errors.description && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Role Responsibilities */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Role Responsibilities
                </label>
                <Editor
                  apiKey="cly2l2971z9pgqhfjufgnqbl1h4nomfzmiqbjositk620gut"
                  onInit={(evt, editor) => (roleEditorRef.current = editor)}
                  value={values.role_details}
                  init={{
                    height: 200,
                    menubar: false,
                    placeholder:
                      "Detailed responsibilities, e.g. Resolve escalations and coach teammates",
                    plugins: [
                      "advlist autolink lists link charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table help wordcount",
                    ].join(" "),
                    toolbar:
                      "undo redo | formatselect | bold italic underline | " +
                      "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                  }}
                  onEditorChange={(content) =>
                    setFieldValue("role_details", content)
                  }
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Qualifications
                </label>
                <FieldArray name="qualifications">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.qualifications.map((q, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            type="text"
                            name={`qualifications[${i}]`}
                            placeholder="e.g. 5+ years in customer service"
                            value={q}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-700"
                          />
                          {values.qualifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(i)}
                              className="text-red-500 font-bold"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push("")}
                        className="text-violet-700 hover:underline text-sm"
                      >
                        + Add Qualification
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  placeholder="e.g. careers@upfrica.com"
                  value={values.contact_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-700"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={values.is_active}
                  onChange={(e) => setFieldValue("is_active", e.target.checked)}
                  className="h-4 w-4 text-violet-700 border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700">Active</label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-violet-700 text-white font-semibold rounded-md hover:bg-violet-800 transition"
              >
                {isSubmitting ? <LoadingDots color="white" /> : "Update Job"}
              </button>
            </form>
          )}
        </Formik>
      </div>
      <Footer />
    </div>
  );
}

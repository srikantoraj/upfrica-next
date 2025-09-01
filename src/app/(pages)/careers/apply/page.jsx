"use client";

import React, { useState } from "react";

const initialFormData = {
  name: "",
  email: "",
  dob: "",
  address: "",
  city: "",
  mobile: "",
  alerts: "No",
  inspiration: "",
  declaration: false,
};

export default function CareerWithUs() {
  const [formData, setFormData] = useState(initialFormData);
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleResumeUpload = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please upload your resume.");
      return;
    }
    if (!formData.declaration) {
      alert("Please declare that the information is true and complete.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("resume", resumeFile);

    try {
      const res = await fetch(
        "https://media.upfrica.com/api/jobs/submit-application/",
        {
          method: "POST",
          body: data,
        },
      );

      if (res.ok) {
        alert("Your application has been submitted successfully!");
        setSubmissionStatus("success");
        setFormData(initialFormData);
        setResumeFile(null);
      } else {
        const errText = await res.text();
        alert(`Submission failed: ${errText}`);
        setSubmissionStatus("error");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-purple-500 mb-6 text-center">
          Job Application Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g. you@example.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your address"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="e.g. +1234567890"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
          </div>

          {/* Job Alerts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Would you like to receive job alerts?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="alerts"
                    value={opt}
                    checked={formData.alerts === opt}
                    onChange={handleChange}
                    className="form-radio"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Inspiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What inspires you to work with us?{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="inspiration"
              value={formData.inspiration}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Share your inspiration..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CV / Resume <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-700"
              disabled={isSubmitting}
            />
            {resumeFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {resumeFile.name}
              </p>
            )}
          </div>

          {/* Declaration */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              required
              className="h-4 w-4 text-violet-700 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label className="ml-2 text-gray-700">
              I declare that the information on this form is true and complete.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white font-medium rounded-md transition ${
              isSubmitting
                ? "bg-violet-400 cursor-not-allowed"
                : "bg-violet-700 hover:bg-violet-800"
            }`}
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>

          {submissionStatus === "error" && (
            <p className="text-red-500 text-center">
              There was an error submitting your application. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

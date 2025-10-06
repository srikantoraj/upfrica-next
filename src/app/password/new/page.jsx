"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const ForgotPassword = () => {
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("সঠিক ইমেইল দিন").required("ইমেইল আবশ্যক"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setSubmissionStatus(null);
      setErrorMessage(null);
      try {
        const response = await fetch(
          "https://api.upfrica.com/api/forgot-password/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: values.email }),
          },
        );
        const data = await response.json();
        if (response.ok) {
          setSubmissionStatus("রিসেট টোকেন আপনার ইমেইলে পাঠানো হয়েছে!");
          setTimeout(() => {
            window.location.href = `/reset-password?email=${encodeURIComponent(values.email)}`;
          }, 1500);
        } else {
          setErrorMessage(
            data.message ||
            "রিসেট টোকেন পাঠানো ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
          );
        }
      } catch (error) {
        setErrorMessage("এরর: " + error.message);
      }
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <a href="/">
            <img
              src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark-0200279f4edfa75fc643c477221cbe7ea4d4afdd5ac37ed8f22164659d2b0fb9.png"
              alt="upfrica"
              className="h-[50px] mx-auto mb-4"
              loading="lazy"
            />
          </a>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We’ll send you instructions to reset your password.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                value={formik.values.email}
                className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${formik.errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            {submissionStatus && (
              <p className="text-green-600 text-center text-sm">
                {submissionStatus}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-center text-sm">{errorMessage}</p>
            )}
          </form>

          {/* Navigation Links */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <p>
              Remember your password?{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </p>
            <p>
              Didn’t receive confirmation instructions?{" "}
              <a
                href="/confirmation/new"
                className="text-purple-600 hover:underline"
              >
                Resend
              </a>
            </p>
          </div>
        </div>

        {/* Help button */}
        <div className="text-center">
          <a
            href="https://wa.me/233554248805"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            <i
              className="fab fa-whatsapp text-xl"
              style={{ color: "#4DC247" }}
            ></i>
            Need Help? Chat with us
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-10 space-y-2">
          <div>© 2025 Upfrica Marketplace BD. All rights reserved.</div>
          <div className="space-x-2">
            <a href="/about" className="hover:underline">
              About
            </a>
            |
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            |
            <a href="/terms" className="hover:underline">
              Terms
            </a>
          </div>
          <div className="space-x-3 text-lg">
            <a href="https://www.facebook.com/upfrica" target="_blank">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://www.twitter.com/upfrica" target="_blank">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com/upfrica" target="_blank">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="https://www.pinterest.co.uk/upfrica" target="_blank">
              <i className="fa fa-pinterest"></i>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default ForgotPassword;

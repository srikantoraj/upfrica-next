"use client";

import React from "react";
import Image from "next/image";
import signinImage from "../../image/signin.svg";
import logo from "../../../public/images/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "bappymodok0011@gmail.com",
      token: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      token: Yup.string().required("Required"),
      new_password: Yup.string()
        .min(6, "Must be 6 characters or more")
        .required("Required"),
      confirm_password: Yup.string()
        .min(6, "Must be 6 characters or more")
        .required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("Form submitted:", values);
      // API call can go here
      // resetForm();

      try {
        const response = await fetch(
          "https://api.upfrica.com/api/reset-password/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              token: values.token,
              new_password: values.new_password,
              confirm_password: values.confirm_password,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          // যদি error থাকে
          console.error("❌ Error:", data);
          return;
        }

        console.log("✅ Success:", data);
        // Success হলে form reset
        resetForm();
        router.push("/login");
      } catch (error) {
        console.error("❌ Request failed:", error.message);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-10">
      <div className="bg-white max-w-5xl w-full rounded-2xl shadow-lg grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Side Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-purple-50">
          <Image
            src={signinImage}
            alt="Reset Password Illustration"
            width={500}
            height={500}
            className="object-contain max-h-[400px]"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full p-8 sm:p-10 md:p-12">
          <div className="text-center mb-8">
            <Image
              src={logo}
              alt="Upfrica Logo"
              width={140}
              height={56}
              className="mx-auto h-12"
            />
            <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-gray-800">
              Reset Your Password
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Please enter the token sent to your email and your new password
              below.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 ${formik.errors.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-purple-500"
                  }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Token Field */}
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700"
              >
                Reset Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.token}
                className={`mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 ${formik.errors.token
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-purple-500"
                  }`}
              />
              {formik.touched.token && formik.errors.token && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.token}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.new_password}
                className={`mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 ${formik.errors.new_password
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-purple-500"
                  }`}
              />
              {formik.touched.new_password && formik.errors.new_password && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.new_password}
                </p>
              )}
            </div>

            {/* confram  Password Field */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm_password}
                className={`mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 ${formik.errors.confirm_password
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-purple-500"
                  }`}
              />
              {formik.touched.new_password &&
                formik.errors.confirm_password && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.confirm_password}
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Reset Password
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-10">
            © 2024 Upfrica. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

// src/components/SignUp.tsx

'use client'; // Designate this as a Client Component

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      password_confirmation: "",
      account_type: "Seller (Individual)",
      phone_number: "000000",
      city: "Dhaka",
      country: "BD",
      terms_of_service: true,
    },
    onSubmit: async (values) => {
      setSubmissionStatus(null);
      setErrorMessage(null);
      try {
        const response = await fetch(
          "https://upfrica-staging.herokuapp.com/api/v1/users.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: values }), // Convert form data to JSON string
          }
        );

        const data = await response.json(); // Parse JSON response from server
        console.log(data);
        localStorage.setItem('user', JSON.stringify(data));

        if (response.ok) {
          console.log(data);
          setSubmissionStatus("Signup successful! Redirecting...");
          // Redirect to a different page after successful signup, e.g., login
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          // If request fails, display error message
          setErrorMessage(data.message || 'Signup failed. Please try again.');
        }
      } catch (error) {
        // Handle network or other errors
        setErrorMessage('Error: ' + error.message);
      }
    },
  });

  return (
    <div className="max-w-screen-2xl mx-auto lg:p-10 p-2 flex justify-center items-center">
      <div className="bg-white container grid lg:grid-cols-2 lg:flex-col py-10 lg:px-10 shadow-xl border rounded-md">
        {/* Image Column */}
        <div className="col-span-1 order-2 lg:order-1 p-2 lg:p-2">
          <Image
            className="h-80 sm:h-full"
            src="https://booking.webestica.com/assets/images/element/signin.svg"
            alt="Sign Up Illustration"
            width={500} // Adjust based on actual image dimensions
            height={500}
          />
        </div>

        {/* Text Column */}
        <div className="col-span-1 order-1 lg:order-2 p-2">
          <div className="space-y-2">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                className="h-10 lg:h-14"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark-0200279f4edfa75fc643c477221cbe7ea4d4afdd5ac37ed8f22164659d2b0fb9.png"
                alt="Upfrica Logo"
                width={200} // Adjust based on actual image dimensions
                height={56}
                priority
              />
            </div>

            {/* Heading */}
            <h2 className="text-base md:text-2xl lg:text-3xl font-extrabold text-center">
              Create New Account
            </h2>

            {/* Sign-up text */}
            <p className="text-base text-[#85878A] leading-8 text-center">
              Already a member?
              <Link href="/signin">
                <span className="text-purple-500 cursor-pointer">
                  {" "} Log in to your account
                </span>
              </Link>
              <br />
              Enter your details below
            </p>


            <form onSubmit={formik.handleSubmit} className="space-y-2 px-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-left text-base font-medium text-[#85878A]">
                  Enter Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Name Inputs */}
              <div className="space-y-2">
                <label className="block text-left text-base font-medium text-[#85878A]">
                  Your Name
                </label>
                <div className="flex space-x-2">
                  {/* First Name Input */}
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.first_name}
                    placeholder="First Name"
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  {/* Last Name Input */}
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.last_name}
                    placeholder="Last Name"
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Username/Display Name Input */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-left text-base font-medium text-[#85878A]">
                  Username/Display Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder="This will be visible to the public"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-left text-base font-medium text-[#85878A]">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-base" />
                    ) : (
                      <FaEye className="text-base" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Confirmation Input
              <div className="space-y-2">
                <label htmlFor="password_confirmation" className="block text-left text-base font-medium text-[#85878A]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password_confirmation}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-base" />
                    ) : (
                      <FaEye className="text-base" />
                    )}
                  </button>
                </div>
              </div> */}

              {/* Password Hint */}
              <div>
                <p className="text-left text-base text-[#85878A]">
                  (6 characters minimum)
                </p>
              </div>

              {/* Terms of Service */}
              <div className="flex items-center">
                <input
                  id="terms_of_service"
                  name="terms_of_service"
                  type="checkbox"
                  onChange={formik.handleChange}
                  checked={formik.values.terms_of_service}
                  required
                  className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="terms_of_service" className="ml-2 block text-base lg:text-base text-[#85878A]">
                  I have read and agree to the{" "}
                  <Link href="/terms-of-use">
                    <span className="text-blue-400">Terms of Use</span>
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy">
                    <span className="text-blue-400">Privacy Policy</span>
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-base px-4 py-2 bg-purple-500 text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Sign Up
              </button>

              {/* Help Button */}
              <button
                type="button"
                className="w-full text-base px-4 py-2 bg-gray-100 rounded-md font-bold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => alert("Need help? Contact support.")}
              >
                Help
              </button>
            </form>

            {/* Submission Status */}
            {submissionStatus && (
              <p className="text-green-500 text-center mt-4">{submissionStatus}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}

            {/* Copyright */}
            <p className="text-gray-500 text-base mt-4 text-center">
              © 2024 Upfrica. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      </div>
    );
};

export default SignUp;

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import signUpLogo from "../../image/signin.svg";
import LoaderButton from "@/components/LoaderButton";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      time_zone: "UTC",
      terms_of_service: false,
    },
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMessage(null);

      // strip out the TOS field before sending
      const { terms_of_service, ...payload } = values;

      try {
        const response = await fetch("https://media.upfrica.com/api/signup/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (response.ok) {
          // push to verify page with email in the query string
          router.push(
            `/verify-account?email=${encodeURIComponent(values.email)}`,
          );
        } else {
          setErrorMessage(data.message || "Signup failed. Please try again.");
        }
      } catch (err) {
        setErrorMessage("Error: " + err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white shadow-xl border rounded-md p-6 sm:p-10">
        {/* Illustration */}
        <div className="flex justify-center items-center">
          <Image
            src={signUpLogo}
            alt="Sign Up Illustration"
            width={500}
            height={500}
            className="w-full max-h-[400px] object-contain"
          />
        </div>

        {/* Form */}
        <div className="w-full">
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark-0200279f4edfa75fc643c477221cbe7ea4d4afdd5ac37ed8f22164659d2b0fb9.png"
                alt="Upfrica Logo"
                width={200}
                height={56}
                priority
                className="h-10 lg:h-14"
              />
            </div>

            {/* Headings */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-center">
              Create New Account
            </h2>
            <p className="text-base text-[#85878A] text-center leading-6">
              Already a member?
              <Link href="/login">
                <span className="text-purple-500 font-medium ml-1">Log in</span>
              </Link>
              <br />
            </p>

            {/* Social Buttons */}
            <div className="mt-4 flex space-x-4">
              <a
                href="https://media.upfrica.com/accounts/google/login/"
                className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FcGoogle className="text-2xl" />
                <span className="ml-2 text-gray-700 font-medium">Google</span>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // router.push('https://media.upfrica.com/accounts/facebook/signup/')
                }}
                className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FaFacebookF className="text-2xl text-blue-600" />
                <span className="ml-2 text-gray-700 font-medium">Facebook</span>
              </a>
            </div>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-gray-500 text-sm">
                  or continue with
                </span>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#85878A]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#85878A]">
                  Your Name
                </label>
                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.first_name}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.last_name}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#85878A]"
                >
                  Username / Display Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="This will be public"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#85878A]"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  id="terms_of_service"
                  name="terms_of_service"
                  type="checkbox"
                  required
                  onChange={formik.handleChange}
                  checked={formik.values.terms_of_service}
                  className="h-4 w-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="terms_of_service"
                  className="text-sm text-[#85878A]"
                >
                  I agree to the{" "}
                  <Link href="/terms-of-use">
                    <span className="text-blue-500 underline">
                      Terms of Use
                    </span>
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy">
                    <span className="text-blue-500 underline">
                      Privacy Policy
                    </span>
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <LoaderButton
                type="submit"
                loading={formik.isSubmitting}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Sign Up
              </LoaderButton>

              {/* Help */}
              <button
                type="button"
                onClick={() => alert("Need help? Contact support.")}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Help
              </button>
            </form>

            {/* Error */}
            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}

            <p className="text-center text-sm text-gray-400 mt-6">
              © 2024 Upfrica. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

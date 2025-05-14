// 'use client';
// export const dynamic = "force-dynamic";
// import React, { Suspense, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import logo from '../../../public/images/logo.png';
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch } from 'react-redux';
// import image from '../../image/signin.svg'
// // import { setUser } from "@/app/store/slices/userSlice";
// // import { setToken } from "@/app/store/slices/tokenSlice";




// const VerifyAccountPage = () => {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const redirect = searchParams.get("redirect") || "/";
//     const dispatch = useDispatch();
//     const queryEmail = searchParams.get("email") || "";

//     const [submissionStatus, setSubmissionStatus] = useState(null);
//     const [errorMessage, setErrorMessage] = useState(null);

//     const formik = useFormik({
//         initialValues: {
//             email: queryEmail,
//             token: "",
//         },
//         validationSchema: Yup.object({
//             email: Yup.string().email("Invalid email address").required("Email is required"),
//             token: Yup.string()
//                 .matches(/^\d{4}$/, "Token must be exactly 4 digits")
//                 .required("Verification token is required"),
//         }),
//         onSubmit: async (values) => {
//             console.log(values);
            
//             // setSubmissionStatus(null);
//             // setErrorMessage(null);
//             // try {
//             //     const response = await fetch("https://app.travelbangladesh.org/v1/accounts/verify-email/", {
//             //         method: "POST",
//             //         headers: {
//             //             "Content-Type": "application/json",
//             //         },
//             //         body: JSON.stringify(values),
//             //     });
//             //     const data = await response.json();
//             //     if (response.ok) {
//             //         if (typeof window !== 'undefined') {
//             //             localStorage.setItem("token", data.token);
//             //             localStorage.setItem("user", JSON.stringify(data?.profile));
//             //         }
//             //         dispatch(setUser(data?.profile));
//             //         dispatch(setToken(data?.token));
//             //         router.push(redirect);
//             //     } else {
//             //         // Show a single error if credentials don't match
//             //         setErrorMessage(data.message || "Verification failed. Please try again.");
//             //     }


//             // } catch (error) {
//             //     setErrorMessage("Error: " + error.message);
//             // }
//         },
//     });

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-white md:bg-gradient-to-r border ">
//             <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
//                 {/* Image Section */}
//                 <div className="hidden md:flex md:w-1/2">
//                     <Image
//                         src={image}
//                         alt="Verify Account Illustration"
//                         className="object-cover w-full h-full"
//                         width={800}
//                         height={800}
//                     />
//                 </div>

//                 {/* Form Section */}
//                 <div className="w-full md:w-1/2 p-8">
//                     {/* Logo */}
//                     <div className="flex justify-center mb-6">
//                         <Link href="/">
//                             <span aria-label="Go to homepage">
//                                 <Image src={logo} alt="GoGirls Logo" width={120} height={120} className="cursor-pointer" />
//                             </span>
//                         </Link>
//                     </div>

//                     {/* Heading */}
//                     <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-4">
//                         Verify Your Account
//                     </h2>

//                     {/* Subheading */}
//                     <p className="text-center text-gray-600 mb-8">
//                         Enter the 4‑digit verification token sent to your email.
//                     </p>

//                     {/* Verification Form */}
//                     <form onSubmit={formik.handleSubmit} className="space-y-4">
//                         {/* Email Input */}
//                         <div>
//                             <label htmlFor="email" className="block text-left text-base font-medium text-gray-700">
//                                 Email
//                             </label>
//                             <input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 onChange={formik.handleChange}
//                                 value={formik.values.email}
//                                 placeholder="you@example.com"
//                                 className={`mt-1 block w-full px-4 py-2 border ${formik.errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
//                             />
//                             {formik.errors.email && (
//                                 <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
//                             )}
//                         </div>

//                         {/* Token Input */}
//                         <div>
//                             <label htmlFor="token" className="block text-left text-base font-medium text-gray-700">
//                                 Verification Token
//                             </label>
//                             <input
//                                 id="token"
//                                 name="token"
//                                 type="text"
//                                 onChange={formik.handleChange}
//                                 value={formik.values.token}
//                                 placeholder="Enter 4-digit token"
//                                 className={`mt-1 block w-full px-4 py-2 border ${formik.errors.token ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
//                             />
//                             {formik.errors.token && (
//                                 <p className="text-red-500 text-sm mt-1">{formik.errors.token}</p>
//                             )}
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full text-xl px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
//                             disabled={formik.isSubmitting}
//                         >
//                             {formik.isSubmitting && (<div class='flex space-x-2 justify-center items-center bg-transparent h-6 dark:invert'>
//                                 <span class='sr-only'>Loading...</span>
//                                 <div class='h-2 w-2 bg-pink-50 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
//                                 <div class='h-2 w-2 bg-pink-100 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
//                                 <div class='h-2 w-2 bg-pink-200 rounded-full animate-bounce'></div>
//                                 <div class='h-2 w-2 bg-pink-300 rounded-full animate-bounce'></div>
//                             </div>)}
//                             {!formik.isSubmitting && "Verify Account"}
//                         </button>
//                     </form>

//                     {/* Submission Status */}
//                     {submissionStatus && (
//                         <p className="text-green-500 text-center mt-4">{submissionStatus}</p>
//                     )}
//                     {errorMessage && (
//                         <p className="text-red-500 text-center mt-4">{errorMessage}</p>
//                     )}

//                     {/* Footer */}
//                     <p className="text-center text-gray-500 text-sm mt-8">
//                         © 2024 GoGirls. All rights reserved.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VerifyAccountPage;


// 'use client';
// export const dynamic = "force-dynamic";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import logo from '../../../public/images/logo.png';
// import verifyIllustration from '../../image/signin.svg';

// const VerifyAccountPage = () => {
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       token: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Invalid email address")
//         .required("Email is required"),
//       token: Yup.string()
//         .matches(/^\d{4}$/, "Token must be exactly 4 digits")
//         .required("Verification token is required"),
//     }),
//     onSubmit: async (values) => {
//       setSubmissionStatus(null);
//       setErrorMessage(null);
//       // TODO: call your verify endpoint here
//       console.log("Verifying:", values);
//       setSubmissionStatus("Verification successful!");
//     },
//   });

//   return (
//     <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white shadow-xl border rounded-md p-6 sm:p-10">
//         {/* Illustration */}
//         <div className="flex justify-center items-center">
//           <Image
//             src={verifyIllustration}
//             alt="Verify Account Illustration"
//             width={500}
//             height={500}
//             className="w-full max-h-[400px] object-contain"
//           />
//         </div>

//         {/* Form */}
//         <div className="w-full flex flex-col justify-center">
//           {/* Logo */}
//           <div className="flex justify-center mb-6">
//             <Link href="/">
              
//                 <Image
//                   src={logo}
//                   alt="Upfrica Logo"
//                   width={150}
//                   height={48}
//                 />
           
//             </Link>
//           </div>

//           {/* Heading */}
//           <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800 mb-2">
//             Verify Your Account
//           </h2>
//           <p className="text-base text-[#85878A] text-center mb-8 leading-relaxed">
//             Enter the <strong>4-digit</strong> verification token sent to your email.
//           </p>

//           <form onSubmit={formik.handleSubmit} className="space-y-6">
//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-[#85878A] mb-1"
//               >
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 onChange={formik.handleChange}
//                 value={formik.values.email}
//                 placeholder="you@example.com"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                   formik.errors.email
//                     ? "border-red-500 ring-red-200"
//                     : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
//                 }`}
//               />
//               {formik.errors.email && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {formik.errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Token */}
//             <div>
//               <label
//                 htmlFor="token"
//                 className="block text-sm font-medium text-[#85878A] mb-1"
//               >
//                 Verification Token
//               </label>
//               <input
//                 id="token"
//                 name="token"
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={4}
//                 onChange={formik.handleChange}
//                 value={formik.values.token}
//                 placeholder="1234"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                   formik.errors.token
//                     ? "border-red-500 ring-red-200"
//                     : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
//                 }`}
//               />
//               {formik.errors.token && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {formik.errors.token}
//                 </p>
//               )}
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={formik.isSubmitting}
//               className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
//                 formik.isSubmitting
//                   ? "bg-purple-200 cursor-not-allowed"
//                   : "bg-purple-600 hover:bg-purple-700"
//               }`}
//             >
//               {formik.isSubmitting ? "Verifying…" : "Verify Account"}
//             </button>

//             {/* Status Messages */}
//             {submissionStatus && (
//               <p className="text-green-600 text-center">{submissionStatus}</p>
//             )}
//             {errorMessage && (
//               <p className="text-red-500 text-center">{errorMessage}</p>
//             )}
//           </form>

//           {/* Footer */}
//           <p className="text-center text-sm text-gray-400 mt-8">
//             © {new Date().getFullYear()} Upfrica. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyAccountPage;


'use client';
// export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from '../../../public/images/logo.png';
import verifyIllustration from '../../image/signin.svg';

const VerifyAccountPage = () => {
   const router = useRouter();
  const redirect = useSearchParams.get("redirect") || "/";
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  

  const formik = useFormik({
    initialValues: {
      email: searchParams.get("email") || "",
      token: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      token: Yup.string()
        .matches(/^\d{4}$/, "Token must be exactly 4 digits")
        .required("Verification token is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMessage(null);
      setSubmissionStatus(null);
      try {
        const res = await fetch(
          "https://media.upfrica.com/api/verify-account/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const json = await res.json();

        if (!res.ok) {
          // if your API returns { message: "..."} on errors
          throw new Error(json.message || "Verification failed");
        }

        // success!
        setSubmissionStatus("✅ Account verified!");
        // optionally store token/profile here...
        // redirect after a moment
        setTimeout(() => {
          router.push(redirect);
        }, 1000);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white shadow-xl border rounded-md p-6 sm:p-10">
        {/* Illustration */}
        <div className="flex justify-center items-center">
          <Image
            src={verifyIllustration}
            alt="Verify Account Illustration"
            width={500}
            height={500}
            className="w-full max-h-[400px] object-contain"
          />
        </div>

        {/* Form */}
        <div className="w-full flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" aria-label="Go to homepage" className="inline-block">
              <Image
                src={logo}
                alt="Upfrica Logo"
                width={150}
                height={48}
              />
            </Link>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800 mb-2">
            Verify Your Account
          </h2>
          <p className="text-base text-[#85878A] text-center mb-8 leading-relaxed">
            Enter the <strong>4-digit</strong> verification token sent to your email.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#85878A] mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="you@example.com"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formik.errors.email
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                }`}
              />
              {formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Token */}
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-[#85878A] mb-1"
              >
                Verification Token
              </label>
              <input
                id="token"
                name="token"
                type="text"
                inputMode="numeric"
                maxLength={4}
                onChange={formik.handleChange}
                value={formik.values.token}
                placeholder="1234"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formik.errors.token
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                }`}
              />
              {formik.errors.token && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.token}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formik.isSubmitting
                  ? "bg-purple-200 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {formik.isSubmitting ? "Verifying…" : "Verify Account"}
            </button>

            {/* Status Messages */}
            {submissionStatus && (
              <p className="text-green-600 text-center">{submissionStatus}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            © {new Date().getFullYear()} Upfrica. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;




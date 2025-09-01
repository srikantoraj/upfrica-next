// 'use client';

// import Image from 'next/image';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import profileImg from '../../image/signin.svg';
// import logo from '../../../public/images/logo.png';

// const UpdateProfilePage = () => {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);

//     // Redux থেকে user ও token নিয়ে আসছি
//     const token = useSelector((state) => state.auth.token);
//     const firstName = useSelector((state) => state.auth.user?.first_name) || '';

//     const formik = useFormik({
//         initialValues: {
//             first_name: firstName,
//         },
//         validationSchema: Yup.object({
//             first_name: Yup.string()
//                 .min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে')
//                 .required('নামের ঘর প্রয়োজন'),
//         }),
//         onSubmit: async (values, { resetForm }) => {
//             console.log('📝 updating profile with', values, 'token:', token);
//             setLoading(true);

//             try {
//                 const res = await fetch(
//                     'https://media.upfrica.com/api/update-profile/',
//                     {
//                         method: 'PUT', // অথবা PATCH
//                         headers: {
//                             'Content-Type': 'application/json',
//                             Authorization: `Token ${token}`,
//                         },
//                         body: JSON.stringify(values),
//                     }
//                 );
//                 const data = await res.json();

//                 if (!res.ok) {
//                     // ব্যাকএন্ড থেকে error message আসলে দেখাবে
//                     alert(data.message || 'প্রোফাইল আপডেট সফল হয়নি');
//                 } else {
//                     alert('✅ প্রোফাইল সফলভাবে আপডেট হয়েছে!');
//                     resetForm({ values }); // ফর্মে নতুন ভ্যালু রেখে দিবে
//                     // চাইলে আবার রিডাইরেক্ট দিতে পারেন
//                     router.push('/dashboard');
//                 }
//             } catch (err) {
//                 console.error(err);
//                 alert('কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন');
//             } finally {
//                 setLoading(false);
//             }
//         },
//     });

//     return (
//         <div className='max-w-screen-2xl flex justify-center items-center mx-auto lg:p-10  min-h-screen'>
//             <div className="bg-white container grid lg:grid-cols-2 py-10 lg:px-20 shadow-xl border rounded-md">
//                 {/* বাঁদিকে ইলাস্ট্রেশন (লজিক্যালি */}
//                 <div className="hidden lg:flex  items-center justify-center">
//                     <Image src={profileImg} alt="Profile illustration" width={500} height={400} />
//                 </div>

//                 {/* ডানে ফর্ম */}
//                 <div className="flex flex-1 items-center justify-center p-8">
//                     <div className="w-full  bg-white  rounded-lg  p-6">
//                         <div className="text-center mb-6">
//                             <Image src={logo} alt="Logo" width={120}  className='h-10 lg:h-10 mx-auto' />
//                             <h2 className="mt-4 text-2xl font-semibold text-gray-800">
//                                 Update Your Profile
//                             </h2>
//                             {/* <p className="mt-2 text-gray-600 text-sm">
//                                 আপনার নাম আপডেট করুন
//                             </p> */}
//                         </div>

//                         <form onSubmit={formik.handleSubmit} className="space-y-4">
//                             <div>
//                                 <label
//                                     htmlFor="first_name"
//                                     className="block mb-1 text-gray-700 font-medium"
//                                 >
//                                     First Name
//                                 </label>
//                                 <input
//                                     id="first_name"
//                                     name="first_name"
//                                     type="text"
//                                     value={formik.values.first_name}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
//                                 />
//                                 {formik.touched.first_name && formik.errors.first_name && (
//                                     <p className="mt-1 text-red-500 text-sm">
//                                         {formik.errors.first_name}
//                                     </p>
//                                 )}
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className={`w-full py-2 rounded text-white transition ${loading
//                                         ? 'bg-gray-400 cursor-not-allowed'
//                                         : 'bg-purple-600 hover:bg-purple-700'
//                                     }`}
//                             >
//                                 {loading ? 'Updating...' : 'Update Name'}
//                             </button>
//                         </form>

//                         <p className="mt-6 text-center text-gray-500 text-xs">
//                             © 2024 Upfrica. All rights reserved.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateProfilePage;

"use client";

import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import profileImg from "../../image/signin.svg";
import logo from "../../../public/images/logo.png";

const UpdateProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redux থেকে ডেটা
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user) || {};

  const formik = useFormik({
    initialValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .min(2, "কমপক্ষে ২ অক্ষর")
        .required("First name প্রয়োজন"),
      last_name: Yup.string()
        .min(2, "কমপক্ষে ২ অক্ষর")
        .required("Last name প্রয়োজন"),
      email: Yup.string().email("ভুল ইমেইল ফরম্যাট").required("Email প্রয়োজন"),
      phone: Yup.string()
        .matches(
          /^[0-9()+-\s]*$/,
          "শুধুমাত্র নং, স্পেস, (+) বা (-) ব্যবহার করতে পারবেন",
        )
        .min(7, "কমপক্ষে ৭ ডিজিট")
        .nullable(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log("Submitting profile update:", values, "token:", token);
      setLoading(true);
      try {
        const res = await fetch(
          "https://media.upfrica.com/api/update-profile/",
          {
            method: "PUT", // অথবা PATCH
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(values),
          },
        );
        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "প্রোফাইল আপডেট ব্যর্থ হয়েছে");
        } else {
          alert("✅ প্রোফাইল সফলভাবে আপডেট হয়েছে!");
          // ফ্রন্টে Redux ও LocalStorage আপডেট করার লজিক এখানে যোগ করুন
          resetForm({ values });
          router.push("/dashboard"); // চাইলে অন্যপেজে রিডাইরেক্ট
        }
      } catch (err) {
        console.error(err);
        alert("কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-screen-2xl flex justify-center items-center mx-auto lg:p-10  min-h-screen">
      <div className="bg-white container grid lg:grid-cols-2 py-10 lg:px-20 shadow-xl border rounded-md">
        {/* Illustrative panel */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
          <Image
            src={profileImg}
            alt="Profile illustration"
            width={400}
            height={400}
          />
        </div>

        {/* Form panel */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-lg bg-white  p-6">
            <div className="text-center mb-6">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={40}
                className="mx-auto"
              />
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                Update Your Profile
              </h2>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-1 font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="mt-1 text-red-500 text-sm">
                    {formik.errors.first_name}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="last_name"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="mt-1 text-red-500 text-sm">
                    {formik.errors.last_name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-red-500 text-sm">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="mt-1 text-red-500 text-sm">
                    {formik.errors.phone}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || formik.isSubmitting}
                className={`w-full py-2 rounded text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-xs">
              © 2024 Upfrica. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;

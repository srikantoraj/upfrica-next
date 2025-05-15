// 'use client';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// const UpdatePasswordPage = () => {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);

//     const formik = useFormik({
//         initialValues: {
//             old_password: '',
//             new_password: '',
//             confirm_password: '',
//         },
//         validationSchema: Yup.object({
//             old_password: Yup.string().required('Old password is required'),
//             new_password: Yup.string()
//                 .min(6, 'New password must be at least 6 characters')
//                 .required('New password is required'),
//             confirm_password: Yup.string()
//                 .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
//                 .required('Confirm your new password'),
//         }),
//         onSubmit: async (values, { resetForm }) => {
//             setLoading(true);
//             try {
//                 const response = await fetch('https://media.upfrica.com/api/update-password/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(values),
//                 });

//                 const data = await response.json();

//                 if (!response.ok) {
//                     alert(data.message || 'Password update failed');
//                 } else {
//                     alert('✅ Password updated successfully!');
//                     resetForm();
//                     router.push('/signin');
//                 }
//             } catch (error) {
//                 alert('Something went wrong. Please try again.');
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         },
//     });

//     return (
//         <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded-lg border">
//             <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Update Password</h2>
//             <form onSubmit={formik.handleSubmit} className="space-y-4">
//                 <div>
//                     <label htmlFor="old_password" className="block mb-1 text-gray-700">Old Password</label>
//                     <input
//                         type="password"
//                         id="old_password"
//                         name="old_password"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         value={formik.values.old_password}
//                         className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     {formik.touched.old_password && formik.errors.old_password && (
//                         <p className="text-red-500 text-sm">{formik.errors.old_password}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label htmlFor="new_password" className="block mb-1 text-gray-700">New Password</label>
//                     <input
//                         type="password"
//                         id="new_password"
//                         name="new_password"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         value={formik.values.new_password}
//                         className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     {formik.touched.new_password && formik.errors.new_password && (
//                         <p className="text-red-500 text-sm">{formik.errors.new_password}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label htmlFor="confirm_password" className="block mb-1 text-gray-700">Confirm Password</label>
//                     <input
//                         type="password"
//                         id="confirm_password"
//                         name="confirm_password"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         value={formik.values.confirm_password}
//                         className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     {formik.touched.confirm_password && formik.errors.confirm_password && (
//                         <p className="text-red-500 text-sm">{formik.errors.confirm_password}</p>
//                     )}
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full py-2 px-4 rounded text-white transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
//                         }`}
//                 >
//                     {loading ? 'Updating...' : 'Update Password'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default UpdatePasswordPage;

'use client';

import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import image from '../../image/signin.svg'
import logo from '../../../public/images/logo.png'
import { useSelector } from 'react-redux';

const UpdatePasswordPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    // console.log("token",token);


    const formik = useFormik({
        initialValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        },
        validationSchema: Yup.object({
            old_password: Yup.string().required('Old password is required'),
            new_password: Yup.string()
                .min(6, 'New password must be at least 6 characters')
                .required('New password is required'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
                .required('Please confirm your new password'),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log("value", values);

            setLoading(true);
            try {
                const res = await fetch(
                    'https://media.upfrica.com/api/update-password/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Token ${token}`,
                        },
                        body: JSON.stringify(values),
                    }
                );
                const data = await res.json();
                if (!res.ok) {
                    alert(data.message || 'Update failed');
                } else {
                    alert('✅ Password updated successfully!');
                    resetForm();
                    router.push('/signin');
                }
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-10'>
            <div className="max-w-5xl mx-auto  flex  shadow-md">
                {/* Left illustration */}
                <div className="hidden lg:flex w-1/2 items-center justify-center">
                    <Image
                        src={image}
                        alt="Security illustration"
                        width={500}
                        height={500}
                    />
                </div>

                {/* Right form */}
                <div className="flex flex-1 items-center justify-center p-8">
                    <div className="w-full bg-white shadow rounded-lg border p-6">
                        <div className="text-center mb-6">
                            <Image className="mx-auto h-12" src={logo} alt="Upfrica.com" width={120} height={40} />
                            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                                Update Your Password
                            </h2>
                            <p className="mt-2 text-gray-600 text-sm">
                                Enter your current password and choose a new one below.
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {/* Old Password */}
                            <div>
                                <label
                                    htmlFor="old_password"
                                    className="block mb-1 text-gray-700 font-medium"
                                >
                                    Old Password
                                </label>
                                <input
                                    id="old_password"
                                    name="old_password"
                                    type="password"
                                    value={formik.values.old_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                {formik.touched.old_password && formik.errors.old_password && (
                                    <p className="mt-1 text-red-500 text-sm">
                                        {formik.errors.old_password}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="new_password"
                                    className="block mb-1 text-gray-700 font-medium"
                                >
                                    New Password
                                </label>
                                <input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    value={formik.values.new_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                {formik.touched.new_password && formik.errors.new_password && (
                                    <p className="mt-1 text-red-500 text-sm">
                                        {formik.errors.new_password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirm_password"
                                    className="block mb-1 text-gray-700 font-medium"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                {formik.touched.confirm_password &&
                                    formik.errors.confirm_password && (
                                        <p className="mt-1 text-red-500 text-sm">
                                            {formik.errors.confirm_password}
                                        </p>
                                    )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 rounded text-white transition ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                    }`}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
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

export default UpdatePasswordPage;



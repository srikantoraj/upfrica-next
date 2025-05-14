'use client';
// export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setUser } from '@/app/store/slices/userSlice';
import logo from '../../../public/images/logo.png';
import verifyIllustration from '../../image/signin.svg';
import LoaderButton from '@/components/LoaderButton';

const VerifyAccountPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const redirect = searchParams.get('redirect') || '/';
  const emailFromQuery = searchParams.get('email') || '';

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: emailFromQuery,
      token: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      token: Yup.string()
        .matches(/^\d{6}$/, 'Token must be exactly 6 digits')
        .required('Verification token is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setErrorMessage(null);
      setSubmissionStatus(null);

      try {
        const response = await fetch(
          'https://media.upfrica.com/api/verify-account/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();

        if (response.ok) {
          dispatch(setUser(data));
          setSubmissionStatus('✅ Account verified!');
          setTimeout(() => router.push(redirect), 1000);
        } else {
          setErrors({ email: data.message || 'Verification failed' });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setErrorMessage('An unexpected error occurred. Please try again.');
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
            Enter the <strong>6-digit</strong> verification token sent to your email.
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
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
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
                maxLength={6}
                onChange={formik.handleChange}
                value={formik.values.token}
                placeholder="123456"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formik.touched.token && formik.errors.token
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                }`}
              />
              {formik.touched.token && formik.errors.token && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.token}
                </p>
              )}
            </div>

            {/* Submit */}
            <LoaderButton
              type="submit"
              loading={formik.isSubmitting}
              className="w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-600 hover:bg-purple-700"
            >
              Verify Account
            </LoaderButton>

            {/* API‐level error banner */}
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            {/* Success message */}
            {submissionStatus && (
              <p className="text-green-600 text-center">{submissionStatus}</p>
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

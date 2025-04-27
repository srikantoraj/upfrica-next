'use client';

import React, { useState } from 'react';

const CareerWithUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        address: '',
        city: '',
        mobile: '',
        alerts: 'No', // default to "No" as recommended
        inspiration: '',
        pitch: '',
        declaration: false,
    });

    const [resumeFile, setResumeFile] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleResumeUpload = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resumeFile) {
            alert('Please upload your resume.');
            return;
        }
        if (!formData.declaration) {
            alert('Please declare that the information on this form is true and complete.');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('dob', formData.dob);
        data.append('address', formData.address);
        data.append('city', formData.city);
        data.append('mobile', formData.mobile);
        data.append('alerts', formData.alerts);
        data.append('inspiration', formData.inspiration);
        data.append('pitch', formData.pitch);
        data.append('resume', resumeFile);
        data.append('declaration', formData.declaration);

        try {
            const response = await fetch('/api/submit-application', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                setSubmissionStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    dob: '',
                    address: '',
                    city: '',
                    mobile: '',
                    alerts: 'No',
                    inspiration: '',
                    pitch: '',
                    declaration: false,
                });
                setResumeFile(null);
            } else {
                setSubmissionStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmissionStatus('error');
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter your address"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            placeholder="Enter your city"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            placeholder="Enter your mobile number"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Job Alerts */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {`Would you like to receive job alerts from us? (Please reply 'No' for the quick application of a role)`}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="alerts"
                                    value="Yes"
                                    checked={formData.alerts === 'Yes'}
                                    onChange={handleChange}
                                    className="form-radio"
                                />
                                <span className="ml-2">YES</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="alerts"
                                    value="No"
                                    checked={formData.alerts === 'No'}
                                    onChange={handleChange}
                                    className="form-radio"
                                />
                                <span className="ml-2">NO</span>
                            </label>
                        </div>
                    </div>

                    {/* Inspiration for Travel */}
                    <div>
                        <label htmlFor="inspiration" className="block text-sm font-medium text-gray-700 mb-1">
                            What inspires you to assist women in making their travel experiences enjoyable, safe, and budget-friendly?
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="inspiration"
                            name="inspiration"
                            value={formData.inspiration}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Share your inspiration..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    {/* Professional Pitch */}
                    <div>
                        <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-1">
                            We at Go Girls, are passionate about being the best! Tell us briefly what will make you a great travel business professional.
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="pitch"
                            name="pitch"
                            value={formData.pitch}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Share your thoughts..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    {/* Resume Upload */}
                    <div>
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                            Resume<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {resumeFile && (
                            <p className="mt-2 text-sm text-gray-600">Selected File: {resumeFile.name}</p>
                        )}
                    </div>

                    {/* Declaration Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="declaration"
                            name="declaration"
                            checked={formData.declaration}
                            onChange={handleChange}
                            required
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="declaration" className="ml-2 block text-sm text-gray-700">
                            I declare that the information on this form is true and complete.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-purple-400 text-white font-medium rounded-md hover:bg-pink-600 transition duration-200"
                        >
                            Submit
                        </button>
                    </div>

                    {/* Submission Status */}
                    {submissionStatus === 'success' && (
                        <p className="text-green-500 text-center">
                            Your application has been submitted successfully!
                        </p>
                    )}
                    {submissionStatus === 'error' && (
                        <p className="text-red-500 text-center">
                            There was an error submitting your application. Please try again later.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CareerWithUs;

// 'use client'
// import Link from 'next/link';
// import Footer from '../common/footer/Footer';

// const JobDetails = () => {
//     const jobs = [
//         {
//             id: 1,
//             title: "Customer Success Specialist",
//             deadline: "Open Until Filled",
//             department: "Customer Service",
//             employmentType: "Full Time",
//             location: "Various Locations",
//             description:
//                 "At Upfrica, we believe that the right mindset and passion for making a difference are the keys to success! We are looking for a driven and enthusiastic individual who is eager to learn and grow with us.",
//             roleDetails:
//                 "As a Customer Success Specialist, you will be the primary point of contact for our amazing users. You will build strong relationships, ensure a high level of service, and help improve the overall customer experience. We are excited to welcome someone with energy, creativity, and a growth mindset!",
//             qualifications: [
//                 "Strong passion for customer service and travel",
//                 "Excellent communication and interpersonal skills",
//                 "Ability to learn quickly and adapt to a dynamic environment",
//                 "Positive, proactive, and team-first attitude",
//             ],
//             contact: "Send your resume and a brief introduction to: careers@upfrica.com"
//         },
//         {
//             id: 2,
//             title: "Marketing Intern",
//             deadline: "Open Until Filled",
//             department: "Marketing",
//             employmentType: "Internship",
//             location: "Remote",
//             description:
//                 "Upfrica is seeking a motivated Marketing Intern who is excited to support our mission and grow with a dynamic and fast-paced team. We value creativity, innovation, and a strong willingness to learn!",
//             roleDetails:
//                 "As a Marketing Intern, you will assist in building brand awareness, supporting marketing campaigns, conducting research, developing engaging content, and analyzing marketing performance. You will work closely with experienced mentors to gain practical skills and experience.",
//             qualifications: [
//                 "Pursuing a degree in Marketing, Communications, or related field",
//                 "Strong writing, editing, and communication skills",
//                 "Familiarity with social media management and digital marketing",
//                 "Energetic, organized, and eager to learn",
//             ],
//             contact:
//                 "To apply, please email your CV and a short cover letter to: careers@upfrica.com"
//         }
//     ];

//     return (
//         <>
//             {/* Job Posts Section */}
//             <section className="min-h-screen flex flex-col bg-white">
//                 <div className="container mx-auto px-4 py-12 space-y-16">
//                     {jobs.map((job) => (
//                         <div
//                             key={job.id}
//                             className="bg-gray-50 p-8 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:shadow-lg"
//                         >
//                             <div className="flex flex-col md:flex-row">
//                                 {/* Main Job Content */}
//                                 <div className="flex-1">
//                                     <h2 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h2>
//                                     <p className="text-gray-700 mb-4">{job.description}</p>
//                                     <div className="mb-4">
//                                         <h3 className="text-2xl font-semibold text-gray-800 mb-2">About the Role</h3>
//                                         <p className="text-gray-700 whitespace-pre-line">{job.roleDetails}</p>
//                                     </div>
//                                     <div className="mb-4">
//                                         <h3 className="text-2xl font-semibold text-gray-800 mb-2">Qualifications</h3>
//                                         <ul className="list-disc list-inside space-y-2 text-gray-700">
//                                             {job.qualifications.map((qual, index) => (
//                                                 <li key={index}>{qual}</li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                     <div className="mb-4">
//                                         <h3 className="text-2xl font-semibold text-gray-800 mb-2">How to Apply</h3>
//                                         <p className="text-gray-700">{job.contact}</p>
//                                     </div>
//                                 </div>

//                                 {/* Sidebar with Job Details */}
//                                 <aside className="w-full md:w-72 mt-6 md:mt-0 md:ml-8">
//                                     <div className="bg-white border border-gray-200 p-6 rounded-md">
//                                         <dl className="space-y-3">
//                                             <div>
//                                                 <dt className="font-medium text-gray-600">Application Deadline</dt>
//                                                 <dd className="text-gray-800">{job.deadline}</dd>
//                                             </div>
//                                             <div>
//                                                 <dt className="font-medium text-gray-600">Department</dt>
//                                                 <dd className="text-gray-800">{job.department}</dd>
//                                             </div>
//                                             <div>
//                                                 <dt className="font-medium text-gray-600">Employment Type</dt>
//                                                 <dd className="text-gray-800">{job.employmentType}</dd>
//                                             </div>
//                                             <div>
//                                                 <dt className="font-medium text-gray-600">Location</dt>
//                                                 <dd className="text-gray-800">{job.location}</dd>
//                                             </div>
//                                         </dl>
//                                         <div className="mt-6">
//                                             <Link href="/careers/apply">
//                                                 <span className="block w-full text-center py-3 bg-primary-500 border border-purple-500 font-semibold rounded-md hover:bg-primary-600 transition duration-200">
//                                                     Apply Now
//                                                 </span>
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </aside>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Footer */}
//                 <Footer />
//             </section>
//         </>
//     );
// };

// export default JobDetails;



'use client';
import Link from 'next/link';
import Footer from '../common/footer/Footer';

const JobDetails = () => {
    const jobs = [
        {
            id: 1,
            title: "Customer Experience Manager",
            deadline: "Open Until Filled",
            department: "Customer Support",
            employmentType: "Full Time",
            location: "Multiple Locations",
            description:
                "At Upfrica, we are dedicated to delivering an outstanding shopping experience. We are looking for a passionate Customer Experience Manager to join our growing e-commerce team. Your role will be to ensure customer happiness and long-term loyalty.",
            roleDetails:
                "As a Customer Experience Manager, you will build relationships with our customers, resolve issues efficiently, and collaborate with internal teams to enhance customer journeys. You’ll be at the heart of ensuring satisfaction across all touchpoints.",
            qualifications: [
                "Deep passion for customer care and online shopping",
                "Excellent communication and problem-solving skills",
                "Ability to adapt and work in a fast-paced environment",
                "Positive energy and team-first mindset",
            ],
            contact: "Submit your CV and cover letter to: careers@upfrica.com"
        },
        {
            id: 2,
            title: "Digital Marketing Intern",
            deadline: "Open Until Filled",
            department: "Marketing",
            employmentType: "Internship",
            location: "Remote",
            description:
                "Upfrica is searching for a creative and motivated Digital Marketing Intern. If you're passionate about e-commerce, digital trends, and building brands online — this opportunity is for you!",
            roleDetails:
                "You will support marketing campaigns, manage social media content, run email marketing, assist with SEO, and collaborate with content creators to drive traffic and engagement across digital platforms.",
            qualifications: [
                "Enrolled in or recently graduated in Marketing, Business, or similar field",
                "Strong writing, creative thinking, and digital skills",
                "Understanding of social media platforms and marketing analytics",
                "Eager to learn, highly motivated, and detail-oriented",
            ],
            contact: "Apply by sending your resume to: careers@upfrica.com"
        }
    ];

    return (
        <>
            {/* Job Listings Section */}
            <section className="min-h-screen flex flex-col bg-white">
                <div className="container mx-auto px-4 py-16 space-y-16">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-gray-50 p-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Side: Job Info */}
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{job.title}</h2>
                                    <p className="text-gray-700 mb-6">{job.description}</p>
                                    
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Role Responsibilities</h3>
                                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.roleDetails}</p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Qualifications</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                                            {job.qualifications.map((qual, index) => (
                                                <li key={index}>{qual}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">How to Apply</h3>
                                        <p className="text-gray-700">{job.contact}</p>
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <aside className="w-full md:w-72">
                                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Application Deadline</dt>
                                                <dd className="text-gray-900">{job.deadline}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Department</dt>
                                                <dd className="text-gray-900">{job.department}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Employment Type</dt>
                                                <dd className="text-gray-900">{job.employmentType}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Location</dt>
                                                <dd className="text-gray-900">{job.location}</dd>
                                            </div>
                                        </dl>

                                        <div className="mt-6">
                                            {/* <Link href="/careers/apply">
                                                <span className="block w-full text-center py-3 bg-primary-500 border border-purple-500 font-semibold rounded-md hover:bg-primary-600 transition duration-300">
                                                    Apply Now
                                                </span>
                                            </Link> */}
                                            <a
                                                href="/careers/apply"
                                                className=" self-center inline-block bg-white border border-[#5d2eee] text-[#5d2eee] font-semibold py-2 px-8 rounded-full hover:opacity-90 transition"
                                            >
                                                APPLY NOW
                                            </a>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <Footer />
            </section>
        </>
    );
};

export default JobDetails;


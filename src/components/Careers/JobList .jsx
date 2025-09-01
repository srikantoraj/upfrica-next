"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../common/footer/Footer";
import { MdDateRange, MdBusiness, MdWork, MdLocationOn } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";

let jobsCache = {
  timestamp: 0,
  data: null,
};

function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const now = Date.now();

    async function load() {
      // if we have cached data that's <2min old, reuse it
      if (jobsCache.data && now - jobsCache.timestamp < 120_000) {
        setJobs(jobsCache.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("https://media.upfrica.com/api/jobs/", {
          method: "GET",
          credentials: "include", // send cookies if needed
        });
        const json = await res.json();
        if (!mounted) return;
        jobsCache = { data: json, timestamp: Date.now() };
        setJobs(json);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { jobs, loading };
}

function JobSkeleton() {
  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-lg animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="bg-gray-200 h-8 w-1/3 rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
          <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
          <div className="bg-gray-200 h-6 w-1/2 rounded mt-4"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-6 w-1/3 rounded mt-4"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
        </div>
        <aside className="w-full md:w-72 space-y-4">
          <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
          <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
          <div className="bg-gray-200 h-10 w-full rounded mt-4"></div>
        </aside>
      </div>
    </div>
  );
}

function JobCard({ job, user = {} }) {
  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl">
      {user?.admin == true && (
        <Link
          href={`/dashboard/edit-job/${job?.id}`}
          className="flex items-center gap-2"
        >
          <FaEdit className="h-4 w-4 text-violet-700" />
          <span className="text-violet-700 hover:underline">Edit Job</span>
        </Link>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side */}
        <div className="flex-1">
          <div
            className="text-gray-700 mb-6 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Role Responsibilities
            </h3>
            {/* render HTML from role_details */}
            <div
              className="text-gray-700 whitespace-pre-line leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: job.role_details }}
            />
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Qualifications
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {job.qualifications.map((qual, idx) => (
                <li key={idx}>{qual}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              How to Apply
            </h3>
            <p className="text-gray-700">
              {" "}
              Hit the apply button or send your resume to:{" "}
              {job.contact_email || job.contact}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-72">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <dl className="space-y-4">
              <div className="flex items-center">
                <MdDateRange className="mr-2 text-gray-600" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    Deadline
                  </dt>
                  <dd className="text-gray-900">{job.deadline}</dd>
                </div>
              </div>
              <div className="flex items-center">
                <MdBusiness className="mr-2 text-gray-600" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    Department
                  </dt>
                  <dd className="text-gray-900">{job.department}</dd>
                </div>
              </div>
              <div className="flex items-center">
                <MdWork className="mr-2 text-gray-600" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">Type</dt>
                  <dd className="text-gray-900">
                    {job.employment_type.replace("_", " ")}
                  </dd>
                </div>
              </div>
              <div className="flex items-center">
                <MdLocationOn className="mr-2 text-gray-600" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    Location
                  </dt>
                  <dd className="text-gray-900">{job.location}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6">
              <Link href="/careers/apply">
                <span className="inline-block bg-white border border-[#5d2eee] text-[#5d2eee] font-semibold py-2 px-8 rounded-full hover:opacity-90 transition">
                  APPLY NOW
                </span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading } = useJobs();

  return (
    <>
      {/* Job Listings Section */}
      <section className="min-h-screen flex flex-col bg-white">
        <div className="container mx-auto px-4 py-16 space-y-16">
          {loading
            ? // show two skeletons while loading
              [1, 2].map((n) => <JobSkeleton key={n} />)
            : jobs.map((job) => <JobCard key={job.id} job={job} user={user} />)}
        </div>
        <Footer />
      </section>
    </>
  );
}

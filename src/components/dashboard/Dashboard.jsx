"use client";
import Head from "next/head";
import { useState } from "react";
// import SalesOverTime from "@/app/components/revenue/SalesOverTime";
// import RevenueByDestination from "@/app/components/revenue/RevenueByDestination";
// import TopPerformingTours from "@/app/components/revenue/TopPerformingTours";
// import MonthlyRevenue from "@/app/components/revenue/MonthlyRevenue";
// import BookingsVsCancellations from "@/app/components/revenue/BookingsVsCancellations";
// import BookingsBySource from "@/app/components/revenue/BookingsBySource"; // if implemented
import { FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearToggle } from "@/app/store/slices/toggleSlice";

const Dashboard = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const [period, setPeriod] = useState("year"); // options: "all", "year", "month"
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const toggle = useSelector((state) => state.toggle.toggle);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(clearToggle());
    };

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    return (
        <>
            <Head>
                <title>Dashboard - Online Travel Agency</title>
                <meta
                    name="description"
                    content="Sales and Revenue Dashboard for your Online Travel Agency"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="p-6 bg-gray-100 dark:bg-gray-900 flex-1">

                {/* <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClick}
                                className="lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-md"
                            >
                                <FaChevronRight size={14} />
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Dashboard
                            </h1>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sales and Revenue Insights
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="period-select"
                            className="text-gray-900 dark:text-white"
                        >
                            Period:
                        </label>
                        <select
                            id="period-select"
                            value={period}
                            onChange={handlePeriodChange}
                            className="p-2 border rounded"
                        >
                            <option value="all">All Time</option>
                            <option value="year">Yearly</option>
                            <option value="month">This Month</option>
                        </select>
                        {(period === "year" || period === "month") && (
                            <>
                                <label
                                    htmlFor="year-select"
                                    className="text-gray-900 dark:text-white"
                                >
                                    Year:
                                </label>
                                <select
                                    id="year-select"
                                    value={year}
                                    onChange={handleYearChange}
                                    className="p-2 border rounded"
                                >
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const y = currentYear - i;
                                        return (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        );
                                    })}
                                </select>
                            </>
                        )}
                        {period === "month" && (
                            <>
                                <label
                                    htmlFor="month-select"
                                    className="text-gray-900 dark:text-white"
                                >
                                    Month:
                                </label>
                                <select
                                    id="month-select"
                                    value={month}
                                    onChange={handleMonthChange}
                                    className="p-2 border rounded"
                                >
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const m = i + 1;
                                        return (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        );
                                    })}
                                </select>
                            </>
                        )}
                    </div>
                </div> */}

                {/* header  */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    {/* Left Section */}
                    <div className="w-full md:w-auto">
                        <div className="flex items-center gap-2 mb-1">
                            <button
                                onClick={handleClick}
                                className="xl:hidden bg-blue-600 text-white p-3 rounded-full shadow-md"
                            >
                                <FaChevronRight size={14} />
                            </button>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Dashboard
                            </h1>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sales and Revenue Insights
                        </p>
                    </div>

                    {/* Right Section - Filters */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="period-select"
                                className="text-gray-900 dark:text-white text-sm"
                            >
                                Period:
                            </label>
                            <select
                                id="period-select"
                                value={period}
                                onChange={handlePeriodChange}
                                className="p-2 border rounded text-sm"
                            >
                                <option value="all">All Time</option>
                                <option value="year">Yearly</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>

                        {(period === "year" || period === "month") && (
                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="year-select"
                                    className="text-gray-900 dark:text-white text-sm"
                                >
                                    Year:
                                </label>
                                <select
                                    id="year-select"
                                    value={year}
                                    onChange={handleYearChange}
                                    className="p-2 border rounded text-sm"
                                >
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const y = currentYear - i;
                                        return (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}

                        {period === "month" && (
                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="month-select"
                                    className="text-gray-900 dark:text-white text-sm"
                                >
                                    Month:
                                </label>
                                <select
                                    id="month-select"
                                    value={month}
                                    onChange={handleMonthChange}
                                    className="p-2 border rounded text-sm"
                                >
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const m = i + 1;
                                        return (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}
                    </div>
                </div>


                {/* Grid Layout for first row */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 ">
                    <SalesOverTime period={period} year={year} month={month} />
                    <RevenueByDestination period={period} year={year} month={month} />
                    
                </div> */}

                {/* Second row */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <TopPerformingTours period={period} year={year} month={month} />
                    <MonthlyRevenue period={period} year={year} month={month} />
                </div> */}

                {/* Third row */}
                {/* <div className="mt-6">
                    <BookingsVsCancellations period={period} year={year} month={month} />
                </div> */}
            </main>
        </>
    );
};

export default Dashboard;
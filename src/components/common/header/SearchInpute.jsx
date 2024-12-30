"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';

const SearchInpute = () => {
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
    const [results, setResults] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false); // dropdown visibility state

    // ডিবাউন্সড মান আপডেট করার জন্য useEffect
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 500); // ৫০০ms এর বিলম্ব সময়

        return () => clearTimeout(timerId);
    }, [searchText]);

    // debouncedSearchText এর পরিবর্তনে API কল
    useEffect(() => {
        if (debouncedSearchText) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`https://upfrica-staging.herokuapp.com/api/v1/products?q=${debouncedSearchText}`);
                    const data = await response.json();
                    console.log(data.products);
                    setResults(data.products || []); // ensuring data is an array
                    setDropdownVisible(data.products && data.products.length > 0); // যদি রেসাল্ট পাওয়া যায় তাহলে dropdown দেখাবে
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setDropdownVisible(false); // error হলে dropdown বন্ধ থাকবে
                }
            };

            fetchData();
        } else {
            setResults([]);
            setDropdownVisible(false);
        }
    }, [debouncedSearchText]);

    return (
        <div className="relative xl:w-full flex items-center border rounded-xl  px-2 group bg-gray-100">
            <input
                className="w-full border-none focus:outline-none pl-3 bg-gray-100"
                type="text"
                placeholder="Search Upfrica BD"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setDropdownVisible(!!results.length)}
            />
            <Link href={`/upsearch/${searchText}`}><IoMdSearch className="h-8 w-8 text-purple-500" /></Link>

            {dropdownVisible && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full">
                    {/* Overlay for the dropdown */}
                    <div className="fixed  inset-0 bg-black opacity-50 top-14 z-10" /> {/* Changed from fixed to absolute */}
                    <div className="bg-white border px-4 shadow-lg z-10 relative py-5 ">
                        {results.map((result, index) => (
                            <div key={index} className="p-2  hover:bg-gray-100 cursor-pointer space-y-2 ">
                                <Link  href={`/details/${result.id}`}>{result.title}</Link>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchInpute;

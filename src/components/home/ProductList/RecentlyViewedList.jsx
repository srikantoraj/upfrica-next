// components/RecentlyViewedList.js
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import RecentProductCard from './RecentProductCard';
import { IoIosArrowRoundForward } from 'react-icons/io';

const RECENTLY_VIEWED_KEY = 'upfricaRecentlyViewed';

const RecentlyViewedList = ({ title }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        }
    }, []);

    if (items.length === 0) return null;

    return (
        <div className='container bg-white p-5 md:py-6 font-sans  my-2'>


            {/* Header */}
            <div className="mb-4 lg:mb-8">

                <div className="flex gap-4 pb-4 items-end justify-between md:justify-start">
                    <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">{title}</h1>
                    <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
                </div>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-5">
                {items.map((item) => (
                    // <RecentProductCard key={item.id} product={item} />
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
            {/* Optionally, add a link to view all if the list is long */}
            {/* {items.length > 5 && (
                <Link href="/recently-viewed">
                    <span>View All</span>
                </Link>
            )} */}
        </div>
    );
};

export default RecentlyViewedList;

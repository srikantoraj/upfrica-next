// components/RecentlyViewedList.js
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import RecentProductCard from './RecentProductCard';

const RECENTLY_VIEWED_KEY = 'upfricaRecentlyViewed';

const RecentlyViewedList = () => {
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
        <div className='container bg-white p-5 md:py-6 font-sans rounded-lg my-2'>
            <div className="mb-8">
                <h1 className="text-xl md:text-3xl font-extrabold tracking-wide text-gray-900">
                    {
                        'Recently Viewed Products'
                    }
                </h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                {items.map((item) => (
                    <RecentProductCard key={item.id} product={item} />
                ))}
            </div>
            {/* Optionally, add a link to view all if the list is long */}
            {items.length > 5 && (
                <Link href="/recently-viewed">
                    <span>View All</span>
                </Link>
            )}
        </div>
    );
};

export default RecentlyViewedList;

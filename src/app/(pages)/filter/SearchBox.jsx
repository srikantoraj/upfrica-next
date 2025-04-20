'use client';

import { useState, useEffect } from 'react';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// A simple animated skeleton loader for the dropdown
const SkeletonLoader = () => (
    <div className="space-y-2 p-3">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
            </div>
        ))}
    </div>
);

export default function SearchBox() {
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [results, setResults] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchText(searchText), 400);
        return () => clearTimeout(timer);
    }, [searchText]);

    // toggles loading skeleton
    useEffect(() => {
        if (searchText) {
            setLoading(true);
        } else {
            setLoading(false);
            setDropdownVisible(false);
            setResults([]);
        }
    }, [searchText]);

    // fetch
    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedSearchText) {
                setResults([]);
                setDropdownVisible(false);
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(
                    `https://media.upfrica.com/api/products/search/?q=${encodeURIComponent(debouncedSearchText)}`
                );
                const json = await res.json();
                const items = json.results || [];
                setResults(items);
                setDropdownVisible(items.length > 0);
            } catch (err) {
                console.error(err);
                setResults([]);
                setDropdownVisible(false);
            }
            setLoading(false);
        };
        fetchResults();
    }, [debouncedSearchText]);

    const clearSearch = () => {
        setSearchText('');
        setResults([]);
        setDropdownVisible(false);
        setLoading(false);
    };

    const onKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const q = searchText.trim();
            if (q) router.push(`/filter?q=${encodeURIComponent(q)}`);
        }
    };

    return (
        <div className="relative w-full">
            {/* search icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoMdSearch className="h-6 w-6 text-purple-500" />
            </div>

            <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-base"
                placeholder="Type to search products..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => results.length > 0 && setDropdownVisible(true)}
            />

            {/* clear button */}
            {searchText && (
                <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={clearSearch}
                >
                    <IoMdClose className="h-6 w-6" />
                </button>
            )}

            {/* dropdown */}
            {(loading || dropdownVisible) && (
                <div className="absolute top-full mt-1 w-full z-20">
                    <div className="bg-white border shadow-lg rounded-md max-h-80 overflow-y-auto">
                        {loading
                            ? <SkeletonLoader />
                            : results.map(item => {
                                const country = (item.seller_country || 'gh').toLowerCase();
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/${country}/${item.seo_slug || ''}/`}
                                        className="block p-3 hover:bg-gray-100 flex items-center gap-3"
                                        onClick={() => setDropdownVisible(false)}
                                    >
                                        <img
                                            src={item.product_images?.[0] || '/placeholder.jpg'}
                                            alt={item.title}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">{item.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {(item.price_cents / 100).toFixed(2)} {item.price_currency}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

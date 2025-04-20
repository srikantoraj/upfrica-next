'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import PriceRange from './priceRange';
import './PriceRange.css';

function FilterGroup({ title, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-3">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex justify-between items-center focus:outline-none"
                aria-expanded={open}
            >
                <h2 className="font-semibold text-base lg:text-lg text-gray-700">
                    {title}
                </h2>
                {open
                    ? <IoIosArrowUp className="h-5 w-5 text-gray-600" />
                    : <IoIosArrowDown className="h-5 w-5 text-gray-600" />
                }
            </button>
            {open && <div className="mt-2">{children}</div>}
        </div>
    );
}

export default function FilterPage() {
    // Mobile drawer state
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef();

    const toggle = () => setIsOpen(o => !o);
    const close = () => setIsOpen(false);

    // Dummy filter state
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [sortOption, setSortOption] = useState('');

    // Dummy data
    const categories = [
        { id: 1, name: 'Electronics', slug: 'electronics' },
        { id: 2, name: 'Clothing', slug: 'clothing' },
        { id: 3, name: 'Home & Garden', slug: 'home-garden' },
    ];
    const conditions = [
        { id: 1, name: 'New', slug: 'new' },
        { id: 2, name: 'Used', slug: 'used' },
        { id: 3, name: 'Refurbished', slug: 'refurbished' },
    ];
    const brands = [
        'Bissell', 'Rubbermaid', 'O-Cedar', 'Scrub Daddy',
        'CLOROX', 'OXO', 'Shark', 'Holikme'
    ];
    const departments = [
        'Household Cleaning Tools',
        'Household Mops, Buckets &',
        'Household Squeegees',
        'Fruit & Vegetable Tools'
    ];
    const sellers = ['Amazon.com', 'Triplenet Pricing INC'];

    // Close on outside click
    useEffect(() => {
        const handleClick = e => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile “Filters” button */}
            <div className="md:hidden p-4">
                <button
                    onClick={toggle}
                    className="flex items-center space-x-2 border rounded px-4 py-2"
                >
                    <AiOutlineFilter />
                    <span>Filters</span>
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={close}
                />
            )}

            {/* Sidebar (always full width) */}
            <aside
                ref={sidebarRef}
                className={`
          fixed top-0 left-0 z-50 h-full w-full bg-white p-6
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-full
        `}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between md:hidden mb-4">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button onClick={close} className="p-1 rounded hover:bg-gray-100">
                        <AiOutlineClose size={24} />
                    </button>
                </div>

                {/* 1. Category */}
                <FilterGroup title="Category">
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                    </select>
                </FilterGroup>

                {/* 2. Condition */}
                <FilterGroup title="Condition">
                    <select
                        value={selectedCondition}
                        onChange={e => setSelectedCondition(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    >
                        <option value="">All Conditions</option>
                        {conditions.map(c => (
                            <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                    </select>
                </FilterGroup>

                {/* 3. Sort By */}
                <FilterGroup title="Sort By">
                    <select
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    >
                        <option value="">Sort by</option>
                        <option value="price">Price: Low → High</option>
                        <option value="-price">Price: High → Low</option>
                    </select>
                </FilterGroup>

                {/* 4. Price Range */}
                <FilterGroup title="Price Range">
                    <PriceRange />
                </FilterGroup>

                {/* 5. Ratings */}
                <FilterGroup title="Ratings">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm">4.5/5</span>
                    </div>
                </FilterGroup>

                {/* 6. Customer Reviews */}
                <FilterGroup title="Customer Reviews">
                    <ul className="space-y-2 text-base text-gray-600">
                        {[5, 4, 3, 2, 1].map(n => (
                            <li key={n} className="flex items-center space-x-2 text-yellow-400 text-lg">
                                {[...Array(n)].map((_, i) => <FaStar key={i} />)}
                                <span className="text-gray-800">& Up</span>
                            </li>
                        ))}
                    </ul>
                </FilterGroup>

                {/* 7. Deals & Discounts */}
                <FilterGroup title="Deals & Discounts">
                    <ul className="space-y-1 text-gray-600">
                        <li>
                            <a href="#allDiscounts" className="hover:text-blue-700">
                                All Discounts
                            </a>
                        </li>
                        <li>
                            <a href="#todaysDeals" className="hover:text-blue-700">
                                Today's Deals
                            </a>
                        </li>
                    </ul>
                </FilterGroup>

                {/* 8. Brands */}
                <FilterGroup title="Brands">
                    <ul className="space-y-1 text-gray-600">
                        {brands.map(name => (
                            <li key={name} className="flex items-center space-x-2">
                                <input type="checkbox" id={name} />
                                <label htmlFor={name}>{name}</label>
                            </li>
                        ))}
                    </ul>
                </FilterGroup>

                {/* 9. Department */}
                <FilterGroup title="Department">
                    {departments.map(name => (
                        <div key={name} className="flex items-center space-x-2 text-gray-600">
                            <input type="checkbox" id={name} />
                            <label htmlFor={name}>{name}</label>
                        </div>
                    ))}
                </FilterGroup>

                {/* 10. All Top Brands */}
                <FilterGroup title="All Top Brands">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <input type="checkbox" id="topBrands" />
                        <label htmlFor="topBrands">Top Brands</label>
                    </div>
                </FilterGroup>

                {/* 11. Seller */}
                <FilterGroup title="Seller">
                    {sellers.map(name => (
                        <div key={name} className="flex items-center space-x-2 text-gray-600">
                            <input type="checkbox" id={name} />
                            <label htmlFor={name}>{name}</label>
                        </div>
                    ))}
                </FilterGroup>

                {/* 12. From Our Brands */}
                <FilterGroup title="From Our Brands">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <input type="checkbox" id="ourBrands" />
                        <label htmlFor="ourBrands">Amazon Brands</label>
                    </div>
                </FilterGroup>

                {/* 13. More Sustainable Products */}
                <FilterGroup title="More Sustainable Products">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <input type="checkbox" id="climatePledge" />
                        <label htmlFor="climatePledge">Climate Pledge Friendly</label>
                    </div>
                </FilterGroup>

                {/* 14. HSA / FSA Eligible */}
                <FilterGroup title="HSA / FSA Eligible">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <input type="checkbox" id="hsaFsa" />
                        <label htmlFor="hsaFsa">FSA or HSA Eligible</label>
                    </div>
                </FilterGroup>
            </aside>
        </div>
    );
}

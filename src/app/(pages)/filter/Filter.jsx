"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { AiOutlineFilter, AiOutlineClose } from "react-icons/ai";
// import PriceRange from './priceRange';
// import './PriceRange.css';

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center focus:outline-none"
        aria-expanded={open}
      >
        <h2 className="font-semibold text-base lg:text-lg text-gray-700">
          {title}
        </h2>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();

  // helper to update URL params
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1"); // reset to first page
    router.push(`?${params.toString()}`);
  };

  // API-fetched data
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("https://api.upfrica.com/api/categories/")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setCategories(data.results ?? data))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    fetch("https://api.upfrica.com/api/conditions/")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setConditions(data.results ?? data))
      .catch((err) => console.error("Failed to load conditions:", err));
  }, []);

  useEffect(() => {
    fetch("https://api.upfrica.com/api/brands/")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setBrands(data.results ?? data))
      .catch((err) => console.error("Failed to load brands:", err));
  }, []);

  // close drawer on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile “Filters” button */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsOpen((o) => !o)}
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
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-50 h-full w-full bg-white p-6
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-full
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* 1. Category */}
        <FilterGroup title="Category">
          <select
            value={searchParams.get("category") || ""}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FilterGroup>

        {/* 2. Condition */}
        <FilterGroup title="Condition">
          <select
            value={searchParams.get("condition") || ""}
            onChange={(e) => updateFilter("condition", e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All Conditions</option>
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FilterGroup>

        {/* 3. Brand */}
        <FilterGroup title="Brand">
          <select
            value={searchParams.get("brand") || ""}
            onChange={(e) => updateFilter("brand", e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </FilterGroup>

        {/* 4. Sort By */}
        <FilterGroup title="Sort By">
          <select
            value={searchParams.get("ordering") || ""}
            onChange={(e) => updateFilter("ordering", e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Sort by</option>
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
          </select>
        </FilterGroup>

        {/* 5. Price Range */}
        {/* <FilterGroup title="Price Range">
                    <PriceRange />
                </FilterGroup> */}

        {/* 6. Ratings (static) */}
        <FilterGroup title="Ratings">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))}
            <span className="ml-2 text-sm">4.5/5</span>
          </div>
        </FilterGroup>

        {/* 7. Customer Reviews (static) */}
        <FilterGroup title="Customer Reviews">
          <ul className="space-y-2 text-base text-gray-600">
            {[5, 4, 3, 2, 1].map((n) => (
              <li
                key={n}
                className="flex items-center space-x-2 text-yellow-400 text-lg"
              >
                {[...Array(n)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                <span className="text-gray-800">& Up</span>
              </li>
            ))}
          </ul>
        </FilterGroup>

        {/* 8. Deals & Discounts (static) */}
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

        {/* …add other static groups as needed… */}
      </aside>
    </div>
  );
}

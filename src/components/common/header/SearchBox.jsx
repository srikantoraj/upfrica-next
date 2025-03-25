
'use client';

import { IoMdSearch } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";

const SearchBox = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Debounce logic with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  // API call when debouncedSearchText changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchText) {
        setResults([]);
        setDropdownVisible(false);
        return;
      }

      try {
        const response = await fetch(
          `https://media.upfrica.com/api/products/search/?q=${debouncedSearchText}`
        );
        const data = await response.json();
        const fetchedResults = data?.results || [];
        console.log(fetchResults);
        
        setResults(fetchedResults);
        
        setDropdownVisible(fetchedResults.length > 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setDropdownVisible(false);
      }
    };

    fetchResults();
  }, [debouncedSearchText]);

  return (
    <div className="relative w-full md:w-[40vw] xl:w-[50vw]">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => results.length > 0 && setDropdownVisible(true)}
        placeholder="Search for products or images..."
        className="w-full pl-4 pr-28 py-[7px] mt-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <IoMdSearch className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <FaImage className="h-6 w-6" />
        </button>
      </div>

      {dropdownVisible && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-20">
          <div className="bg-white border shadow-lg rounded-md max-h-[300px] overflow-y-auto">
            {results.map((item) => {
              const country = item.seller_country?.toLowerCase() || 'gh';
              const categorySlug = item.category?.slug || 'category';
              const slug = item.slug || 'product';

              return (
                <Link
                  href={`/${country}/${categorySlug}/${slug}/`}
                  key={item.id}
                  className="block hover:bg-gray-100 p-3"
                  onClick={() => setDropdownVisible(false)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product_images?.[0] || '/placeholder.jpg'}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.price_cents / 100} {item.price_currency}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;



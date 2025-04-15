'use client';

import { IoMdSearch, IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import Link from "next/link";

// A simple animated skeleton loader for the dropdown
const SkeletonLoader = () => {
  return (
    <div className="space-y-2 p-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SearchBox = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce logic with a 400ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Immediately show the skeleton when user types
  useEffect(() => {
    if (searchText) {
      setLoading(true);
    } else {
      setLoading(false);
      setDropdownVisible(false);
      setResults([]);
    }
  }, [searchText]);

  // Fetch results based on the debounced search text
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchText) {
        setResults([]);
        setDropdownVisible(false);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://media.upfrica.com/api/products/search/?q=${debouncedSearchText}`
        );
        const data = await response.json();
        const fetchedResults = data?.results || [];
        setResults(fetchedResults);
        setDropdownVisible(fetchedResults.length > 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setDropdownVisible(false);
      }
      setLoading(false);
    };

    fetchResults();
  }, [debouncedSearchText]);

  // Clear the search field and results
  const clearSearch = () => {
    setSearchText('');
    setResults([]);
    setDropdownVisible(false);
    setLoading(false);
  };

  return (
    <div className="relative w-full  2xl:w-[60vw] flex items-center">
      {/* Left search icon always visible */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none pt-2">
        <IoMdSearch className="h-7 w-7 text-purple-500" />
      </div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => results.length > 0 && setDropdownVisible(true)}
        placeholder="Search for products..."
        className="w-full pl-10 pr-12 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 tracking-wide text-lg"
      />

      {/* Right X button appears when there is text */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 top-2">
        {searchText && (
          <button onClick={clearSearch} className="text-gray-500 hover:text-gray-700 ">
            <IoMdClose className="h-7 w-7" />
          </button>
        )}
      </div>

      {(dropdownVisible || loading) && (
        <div className="absolute top-full mt-1 w-full z-20">
          <div className="bg-white border shadow-lg rounded-md max-h-[450px] overflow-y-auto p-2">
            {loading ? (
              <SkeletonLoader />
            ) : (
              results.map((item) => {
                const country = item.seller_country?.toLowerCase() || 'gh';
                const slug = item.slug || 'product';
                const seo_slug = item.seo_slug || 'product';

                return (
                  <Link
                    // href={`/${country}/${categorySlug}/${slug}/`
                    href={`/${country}/${seo_slug}/`
                    
                    }
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
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;

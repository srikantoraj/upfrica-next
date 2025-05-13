
// 'use client';

// import { useState, useEffect } from 'react';
// import { IoMdSearch, IoMdClose } from 'react-icons/io';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// // A simple animated skeleton loader for the dropdown
// const SkeletonLoader = () => (
//   <div className="space-y-2 p-3">
//     {[1, 2, 3, 4].map((item) => (
//       <div key={item} className="flex items-center space-x-4 animate-pulse">
//         <div className="w-12 h-12 bg-gray-300 rounded" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 bg-gray-300 rounded w-3/4" />
//           <div className="h-3 bg-gray-300 rounded w-1/2" />
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const SearchBox = () => {
//   const [searchText, setSearchText] = useState('');
//   const [debouncedSearchText, setDebouncedSearchText] = useState('');
//   const [results, setResults] = useState([]);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Debounce logic with a 400ms delay
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchText(searchText);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [searchText]);

//   // Immediately show the skeleton when user types
//   useEffect(() => {
//     if (searchText) {
//       setLoading(true);
//     } else {
//       setLoading(false);
//       setDropdownVisible(false);
//       setResults([]);
//     }
//   }, [searchText]);

//   // Fetch results based on the debounced search text
//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!debouncedSearchText) {
//         setResults([]);
//         setDropdownVisible(false);
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await fetch(
//           `https://media.upfrica.com/api/products/search/?q=${encodeURIComponent(
//             debouncedSearchText
//           )}`
//         );
//         const data = await response.json();
//         const fetchedResults = data?.results || [];
//         setResults(fetchedResults);
//         setDropdownVisible(fetchedResults.length > 0);
//       } catch (error) {
//         console.error('Error fetching search results:', error);
//         setResults([]);
//         setDropdownVisible(false);
//       }
//       setLoading(false);
//     };

//     fetchResults();
//   }, [debouncedSearchText]);

//   // Clear the search field and results
//   const clearSearch = () => {
//     setSearchText('');
//     setResults([]);
//     setDropdownVisible(false);
//     setLoading(false);
//   };

//   // Handle Enter key to navigate to /filter?q=…
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       const query = searchText.trim();
//       if (query) {
//         router.push(`/filter?q=${encodeURIComponent(query)}`);
//       }
//     }
//   };

//   return (
//     <div className="relative w-full xl:w-[50vw] 2xl:w-[55vw] flex items-center ">
//       {/* Left search icon always visible */}
//       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//         <IoMdSearch className="h-7 w-7 text-purple-500" />
//       </div>

//       <input
//         type="text"
//         value={searchText}
//         onChange={(e) => setSearchText(e.target.value)}
//         onKeyDown={handleKeyDown}
//         onFocus={() => results.length > 0 && setDropdownVisible(true)}
//         placeholder="Search for products..."
//         className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 tracking-wide text-lg"
//       />

//       {/* Right X button appears when there is text */}
//       <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//         {searchText && (
//           <button onClick={clearSearch} className="text-gray-500 hover:text-gray-700">
//             <IoMdClose className="h-7 w-7" />
//           </button>
//         )}
//       </div>

//       {(dropdownVisible || loading) && (
//         <div className="absolute top-full mt-1 w-full z-20">
//           <div className="bg-white border shadow-lg rounded-md max-h-[450px] overflow-y-auto p-2">
//             {loading ? (
//               <SkeletonLoader />
//             ) : (
//               results.map((item) => {
//                 const country = item.seller_country?.toLowerCase() || 'gh';
//                 const seo_slug = item.seo_slug || 'product';

//                 return (
//                   <Link
//                     href={`/${country}/${seo_slug}/`}
//                     key={item.id}
//                     className="block hover:bg-gray-100 p-3"
//                     onClick={() => setDropdownVisible(false)}
//                   >
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={item.product_images?.[0] || '/placeholder.jpg'}
//                         alt={item.title}
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                       <div>
//                         <p className="font-medium text-sm text-gray-800">{item.title}</p>
//                         <p className="text-xs text-gray-500">
//                           {item.price_cents / 100} {item.price_currency}
//                         </p>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBox;
'use client';

import { useState, useEffect } from 'react';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { convertPrice } from '@/app/utils/utils';
import { selectSelectedCountry } from '@/app/store/slices/countrySlice';

// Animated skeleton loader for when results are loading
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
  const selectedCountry = useSelector(selectSelectedCountry);
  const exchangeRates = useSelector(state => state.exchangeRates.rates);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Show loader immediately when user types
  useEffect(() => {
    if (searchText) {
      setLoading(true);
    } else {
      setLoading(false);
      setDropdownVisible(false);
      setResults([]);
    }
  }, [searchText]);

  // Fetch search results
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
        const data = await res.json();
        setResults(data.results || []);
        setDropdownVisible((data.results || []).length > 0);
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

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = searchText.trim();
      if (q) router.push(`/filter?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="relative w-full xl:w-[50vw] 2xl:w-[55vw] flex items-center">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <IoMdSearch className="h-7 w-7 text-purple-500" />
      </div>

      <input
        type="text"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setDropdownVisible(true)}
        placeholder="Search for products..."
        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 tracking-wide text-lg"
      />

      {/* Clear Button */}
      {searchText && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose className="h-7 w-7" />
        </button>
      )}

      {(dropdownVisible || loading) && (
        <div className="absolute top-full mt-1 w-full z-20">
          <div className="bg-white border shadow-lg rounded-md max-h-[450px] overflow-y-auto">
            {loading ? (
              <SkeletonLoader />
            ) : (
              results.map(item => {
                // Destructure and normalize
                const {
                  id,
                  product_images,
                  title,
                  price_cents,
                  price_currency,
                  sale_price_cents,
                  sale_end_date,
                  on_sales,
                  seller_country,
                  seo_slug,
                  slug
                } = item;

                // Determine routing slug
                const countryCode = seller_country?.toLowerCase() || 'gh';
                const linkSlug = seo_slug || slug;

                // Convert prices
                const regular = convertPrice(
                  price_cents / 100,
                  price_currency,
                  selectedCountry?.code,
                  exchangeRates
                );
                const saleActive = (
                  (sale_end_date && new Date(sale_end_date) > new Date() && sale_price_cents > 0)
                  || on_sales
                );
                const sale = saleActive && sale_price_cents
                  ? convertPrice(
                    sale_price_cents / 100,
                    price_currency,
                    selectedCountry?.code,
                    exchangeRates
                  )
                  : null;

                return (
                  <Link
                    href={`/${countryCode}/${linkSlug}/`}
                    key={id}
                    className="block hover:bg-gray-100 p-3"
                    onClick={() => setDropdownVisible(false)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product_images?.[0] || '/placeholder.jpg'}
                        alt={title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <p className="font-medium text-sm text-gray-800 truncate w-[200px]">
                          {title}
                        </p>
                        <div className="text-sm text-gray-900 flex items-baseline gap-2">
                          <span>
                            {selectedCountry?.symbol} {(sale ?? regular).toFixed(2)}
                          </span>
                          {sale && (
                            <span className="line-through text-gray-500">
                              {selectedCountry?.symbol} {regular.toFixed(2)}
                            </span>
                          )}
                        </div>
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
}

// 'use client'
// import { IoMdSearch } from "react-icons/io";
// import { FaImage } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// const SearchBox = () => {
//     const [searchText, setSearchText] = useState('');
//     const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
//     const [results, setResults] = useState([]);
//     const [dropdownVisible, setDropdownVisible] = useState(false); // dropdown visibility state

//     // console.log(searchText)

//     // ডিবাউন্সড মান আপডেট করার জন্য useEffect
//     useEffect(() => {
//         const timerId = setTimeout(() => {
//             setDebouncedSearchText(searchText);
//         }, 500); // ৫০০ms এর বিলম্ব সময়

//         return () => clearTimeout(timerId);
//     }, [searchText]);

//     // debouncedSearchText এর পরিবর্তনে API কল
//     useEffect(() => {
//         if (debouncedSearchText) {
//             const fetchData = async () => {
//                 try {
//                     const response = await fetch(`http://media.upfrica.com/api/products/search/?q=${debouncedSearchText}`);
//                     const data = await response.json();
//                     console.log(data.products);
//                     setResults(data.products || []); // ensuring data is an array
//                     setDropdownVisible(data.products && data.products.length > 0); // যদি রেসাল্ট পাওয়া যায় তাহলে dropdown দেখাবে
//                 } catch (error) {
//                     console.error('Error fetching data:', error);
//                     setDropdownVisible(false); // error হলে dropdown বন্ধ থাকবে
//                 }
//             };

//             fetchData();
//         } else {
//             setResults([]);
//             setDropdownVisible(false);
//         }
//     }, [debouncedSearchText]);
    

    
//     return (
//         <div className="relative w-full md:w-[40vw]  xl:w-[50vw]">
//             <input
//                 type="text"
//                 placeholder="Search for products or images..."
//                 className="w-full pl-4 pr-28 py-[7px] mt-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onFocus={() => setDropdownVisible(!!results.length)}
//             />
//             <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-4">
//                 <button className="text-gray-500 hover:text-gray-700">
//                     <IoMdSearch className="h-6 w-6" />
//                 </button>
//                 <button className="text-gray-500 hover:text-gray-700">
//                     <FaImage className="h-6 w-6" />
//                 </button>
//             </div>
//             {dropdownVisible && results.length > 0 && (
//                 <div className="absolute top-full mt-2 w-full">
//                     {/* Overlay for the dropdown */}
//                     <div className="fixed  inset-0 bg-black opacity-50 top-14 z-10" /> {/* Changed from fixed to absolute */}
//                     <div className="bg-white border px-4 shadow-lg z-10 relative py-5 ">
//                         {results.map((result, index) => (
//                             <div key={index} className="p-2  hover:bg-gray-100 cursor-pointer space-y-2 ">
//                                 <Link  href={`/details/${result.id}`}>{result.title}</Link>
//                                 <hr />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SearchBox;

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

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 200); // 400ms delay

    return () => clearTimeout(timer);
  }, [searchText]);

  // API call on debounced text
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
        setResults(data || []);
        setDropdownVisible(data.length > 0);
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

      {/* Dropdown */}
      {dropdownVisible && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-20">
          <div className="bg-white border shadow-lg rounded-md max-h-[300px] overflow-y-auto">
            {results.map((item) => (
              <Link
                href={`/details/${item.id}`}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;



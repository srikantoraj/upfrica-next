

// // Categore.js
// import React, { useState, useRef, useEffect } from 'react';
// import InputField from '../InputField';
// import useCategories from '../api/data';

// const Categore = ({ formik }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { categories, loading, error } = useCategories();
//   const wrapperRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Derive display name from the selected category id
//   const selectedName =
//     categories.find((c) => c.id === formik.values.category)?.name || '';

//   return (
//     <div className="py-4" ref={wrapperRef}>
//       <h2 className="text-2xl font-bold mb-2">*Category</h2>
//       <hr className="border-gray-300 mb-4" />

//       <div className="relative flex items-center border rounded-md border-purple-500 bg-purple-50 px-2">
//         <InputField
//           className="w-full focus:outline-none py-2 ps-3 hover:cursor-pointer"
//           type="text"
//           name="category"           // still tied to Formik
//           readOnly
//           placeholder="Select Category"
//           value={selectedName}
//           onClick={() => !loading && setDropdownOpen((o) => !o)}
//         />
//         <button
//           type="button"
//           className="ml-2 focus:outline-none"
//           onClick={() => !loading && setDropdownOpen((o) => !o)}
//         >
//           More
//         </button>

//         {dropdownOpen && (
//           <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10 max-h-60 overflow-auto">
//             <ul className="py-2">
//               {loading && (
//                 <li className="px-4 py-2 text-gray-500">লোড হচ্ছে…</li>
//               )}
//               {error && (
//                 <li className="px-4 py-2 text-red-500">
//                   Error: {error}
//                 </li>
//               )}
//               {!loading && !error && categories.map((cat) => (
//                 <li
//                   key={cat.id}
//                   className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
//                   onClick={() => {
//                     formik.setFieldValue('category', cat.id);
//                     setDropdownOpen(false);
//                   }}
//                 >
//                   {cat.name}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       <p className="mt-2 text-sm text-gray-600">
//         Select or tap on more
//       </p>
//     </div>
//   );
// };

// export default Categore;



import React, { useState, useRef, useEffect } from "react";
import InputField from "../InputField";
import useCategories from "../api/data";

const Categore = ({ formik }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { categories, loading, error } = useCategories();
  const wrapperRef = useRef(null);

  // close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // find the selected category object (loose compare for id types)
  const selectedCat = categories.find(
    (c) => c.id == formik.values.category
  );

  // display name or placeholder
  const displayName = selectedCat
    ? selectedCat.name
    : "Select Category";

  return (
    <div className="py-4" ref={wrapperRef}>
      <h2 className="text-2xl font-bold mb-2">*Category</h2>
      <hr className="border-gray-300 mb-4" />

      <div className="relative flex items-center border rounded-md border-purple-500 bg-purple-50 px-2">
        <InputField
          className="w-full focus:outline-none py-2 ps-3 hover:cursor-pointer"
          type="text"
          name="category"
          readOnly
          placeholder={displayName}
          value={displayName}
          onClick={() => !loading && setDropdownOpen((o) => !o)}
        />
        <button
          type="button"
          className="ml-2 focus:outline-none"
          onClick={() => !loading && setDropdownOpen((o) => !o)}
        >
          ▼
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10 max-h-60 overflow-auto">
            <ul className="py-2">
              {loading && (
                <li className="px-4 py-2 text-gray-500">
                  লোড হচ্ছে…
                </li>
              )}
              {error && (
                <li className="px-4 py-2 text-red-500">
                  Error: {error}
                </li>
              )}
              {!loading &&
                !error &&
                categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${cat.id == formik.values.category
                        ? "bg-gray-100 font-semibold"
                        : ""
                      }`}
                    onClick={() => {
                      formik.setFieldValue("category", cat.id);
                      setDropdownOpen(false);
                    }}
                  >
                    {cat.name}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Tap to {displayName === "Select Category" ? "choose" : "change"}.
      </p>
    </div>
  );
};

export default Categore;

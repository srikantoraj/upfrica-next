// 'use client'
// import React, { useState } from "react";
// import { FiSettings } from "react-icons/fi";

// export const TitleSection = ({ formik }) => {
//   const [showOptions, setShowOptions] = useState(false);
//   const [title, setTitle] = useState("Apple Watch SE (2022) 40mm Midnight Aluminium Case with Sport Band, Regular...");
//   const [subtitleEnabled, setSubtitleEnabled] = useState(false);

//   const toggleOptions = () => setShowOptions(!showOptions);

//   return (
//     <div className="">

//       {/* Title header */}
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-lg font-semibold">Title</h2>

//         <div className="relative">
//           <button
//             onClick={toggleOptions}
//             className="flex items-center space-x-1  text-sm hover:underline"
//           >
//             <span>See title options</span>
//             <FiSettings className="w-4 h-4" />
//           </button>

//           {showOptions && (
//             <div className="absolute right-0 mt-2 w-80 p-4 bg-white border rounded-md shadow z-10 text-sm">
//               <p className="mb-3 text-gray-700">
//                 Enable the items below that you’d like to show as an option when listing an item.
//               </p>

//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <label className="font-medium">Subtitle</label>
//                   <p className="text-xs text-gray-600">
//                     Subtitles appear in our search results in the list view, and can increase buyer interest by providing more descriptive info (non-refundable fee applies).
//                   </p>
//                 </div>

//                 <label className="inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={subtitleEnabled}
//                     onChange={() => setSubtitleEnabled(!subtitleEnabled)}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer relative transition-colors duration-200">
//                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform duration-200"></div>
//                   </div>
//                 </label>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Title Input */}
//       <div className="mb-1">
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//           Item title
//         </label>
//         <input
//           id="title"
//           name="title"
//           type="text"
//           maxLength={80}
//           value={formik.values.title}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//           required
//         />

//       </div>

//       {/* Character counter */}
//       <div className="flex justify-end text-xs text-gray-500">
//         {title.length}/80
//       </div>
//     </div>
//   );
// };


'use client';

import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";

export const TitleSection = ({ formik }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [subtitleEnabled, setSubtitleEnabled] = useState(false); // subtitle option er jonno

  const toggleOptions = () => setShowOptions(!showOptions);

  return (
    <div className="">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Title</h2>

        <div className="relative">
          <button
            type="button"
            onClick={toggleOptions}
            className="flex items-center space-x-1 text-sm hover:underline"
          >
            <span>See title options</span>
            <FiSettings className="w-4 h-4" />
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-80 p-4 bg-white border rounded-md shadow z-10 text-sm">
              <p className="mb-3 text-gray-700">
                Enable the items below that you’d like to show as an option when listing an item.
              </p>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <label className="font-medium">Subtitle</label>
                  <p className="text-xs text-gray-600">
                    Subtitles appear in our search results in the list view, and can increase buyer interest by providing more descriptive info (non-refundable fee applies).
                  </p>
                </div>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subtitleEnabled}
                    onChange={() => setSubtitleEnabled(!subtitleEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer relative transition-colors duration-200">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform duration-200"></div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-1">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Item title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={80}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          // required
        />
      </div>

      {/* Character Counter */}
      <div className="flex justify-end text-xs text-gray-500">
        {formik.values.title.length}/80
      </div>
    </div>
  );
};



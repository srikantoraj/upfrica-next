// import React from 'react';

// function Prelist() {
//   return (
//     <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//       <div className=" max-w-7xl mx-auto p-4 md:p-8">
//         <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">
//           Start your listing
//         </h1>

//         <div className="flex flex-col md:flex-row gap-4 mb-8">
//           <input
//             type="text"
//             placeholder="Tell us what you're selling"
//             className="flex-1 border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-3 flex items-center justify-center">
//             🔍
//           </button>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           {[1, 2, 3].map((step) => (
//             <div key={step} className="bg-white shadow-lg rounded-lg overflow-hidden">
//               <img
//                 src={`https://via.placeholder.com/400x200?text=Step+${step}`}
//                 alt={`Step ${step}`}
//                 className="w-full object-cover"
//               />
//               <div className="p-6">
//                 <span className="text-blue-600 font-bold">STEP {step}</span>
//                 <h3 className="text-lg font-semibold mt-2">
//                   {step === 1 && "Share item details"}
//                   {step === 2 && "Find a match"}
//                   {step === 3 && "Edit and list"}
//                 </h3>
//                 <p className="mt-2 text-gray-600">
//                   {step === 1 && "Use keywords like brand, model or unique info (ISBN, MPN, VIN)."}
//                   {step === 2 && "We'll search our catalogue to find similar items."}
//                   {step === 3 && "You can preview or make changes before listing your item."}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Prelist;


import React from 'react';

function Prelist() {
  return (
    <div className="bg-[#f9fafb] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-7xl p-6 md:p-10  rounded-xl ">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Start Your Listing
        </h1>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-10">
          <input
            type="text"
            placeholder="Tell us what you're selling"
            className="flex-1 w-full border border-gray-300 rounded-md px-5 py-3 text-gray-700 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-3 shadow transition duration-150">
            <span className="inline-flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Search
            </span>
          </button>
        </div>

        {/* Steps Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Share item details",
              desc: "Use keywords like brand, model or unique info (ISBN, MPN, VIN).",
              image: "https://i.ebayimg.com/00/s/MTIwMFgxNTAw/z/6TYAAOSw2NFlzRIU/%24_1.PNG?set_id=2",
              step: 1,
            },
            {
              title: "Find a match",
              desc: "We'll search our catalogue to find similar items.",
              image: "https://i.ebayimg.com/00/s/MTIwMFgxNTAw/z/-QAAAOSw2HZnkubn/$_1.PNG?set_id=2",
              step: 2,
            },
            {
              title: "Edit and list",
              desc: "You can preview or make changes before listing your item.",
              image: "https://i.ebayimg.com/00/s/MTIwMFgxNTAw/z/HA0AAOSwfi1nkubn/$_1.PNG?set_id=2",
              step: 3,
            },
          ].map(({ step, title, desc, image }) => (
            <div
              key={step}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img src={image} alt={`Step ${step}`} className="w-full h-48 object-cover" />
              <div className="p-5">
                <p className="text-blue-600 font-semibold text-sm">STEP {step}</p>
                <h3 className="text-lg font-bold text-gray-800 mt-1">{title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Prelist;


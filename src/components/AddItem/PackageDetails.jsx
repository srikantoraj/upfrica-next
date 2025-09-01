"use client";

// import { useState } from 'react';

export default function PackageDetails({ formik }) {
  // const [majorWeight, setMajorWeight] = useState('');
  // const [minorWeight, setMinorWeight] = useState('');
  // const [length, setLength] = useState('');
  // const [width, setWidth] = useState('');
  // const [depth, setDepth] = useState('');

  return (
    // <div className="w-3/4">
    //     <h3 className="text-lg font-semibold flex items-center gap-2">
    //         <span>Package size</span>
    //         <span className="text-gray-500 text-sm">(optional)</span>
    //     </h3>

    //     <div className='flex gap-5'>
    //         {/* Weight Section */}
    //         <fieldset>
    //             <legend className="sr-only">Package weight</legend>
    //             <label className="block font-medium mb-2">Package weight</label>
    //             <div className="flex gap-4">
    //                 <div className="relative">
    //                     <input
    //                         type="text"
    //                         name="majorWeight"
    //                         maxLength={3}
    //                         value={majorWeight}
    //                         onChange={(e) => setMajorWeight(e.target.value)}
    //                         className="border rounded px-3 py-2 pr-10 w-24"
    //                         placeholder="0"
    //                         aria-label="Enter weight in kilogrammes"
    //                     />
    //                     <span className="absolute right-3 top-2.5 text-gray-500 text-sm">kg</span>
    //                 </div>
    //                 <div className="relative">
    //                     <input
    //                         type="text"
    //                         name="minorWeight"
    //                         maxLength={3}
    //                         value={minorWeight}
    //                         onChange={(e) => setMinorWeight(e.target.value)}
    //                         className="border rounded px-3 py-2 pr-10 w-24"
    //                         placeholder="0"
    //                         aria-label="Enter weight in grammes"
    //                     />
    //                     <span className="absolute right-3 top-2.5 text-gray-500 text-sm">g</span>
    //                 </div>
    //             </div>
    //         </fieldset>

    //         {/* Dimension Section */}
    //         <fieldset>
    //             <legend className="sr-only">Package dimensions</legend>
    //             <label className="block font-medium mb-2">Package dimensions</label>
    //             <div className="flex items-center gap-2">
    //                 <div className="relative">
    //                     <input
    //                         type="text"
    //                         name="packageLength"
    //                         value={length}
    //                         onChange={(e) => setLength(e.target.value)}
    //                         className="border rounded px-3 py-2 pr-12 w-24"
    //                         placeholder="Length"
    //                         aria-label="Enter package length in centimetres"
    //                     />
    //                     <span className="absolute right-3 top-2.5 text-gray-500 text-sm">cm</span>
    //                 </div>
    //                 <span>x</span>
    //                 <div className="relative">
    //                     <input
    //                         type="text"
    //                         name="packageWidth"
    //                         value={width}
    //                         onChange={(e) => setWidth(e.target.value)}
    //                         className="border rounded px-3 py-2 pr-12 w-24"
    //                         placeholder="Width"
    //                         aria-label="Enter package width in centimetres"
    //                     />
    //                     <span className="absolute right-3 top-2.5 text-gray-500 text-sm">cm</span>
    //                 </div>
    //                 <span>x</span>
    //                 <div className="relative">
    //                     <input
    //                         type="text"
    //                         name="packageDepth"
    //                         value={depth}
    //                         onChange={(e) => setDepth(e.target.value)}
    //                         className="border rounded px-3 py-2 pr-12 w-24"
    //                         placeholder="Height"
    //                         aria-label="Enter package depth in centimetres"
    //                     />
    //                     <span className="absolute right-3 top-2.5 text-gray-500 text-sm">cm</span>
    //                 </div>
    //             </div>
    //         </fieldset>
    //     </div>
    // </div>

    <div className="lg:w-3/4 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>Package size</span>
        <span className="text-gray-500 text-sm">(optional)</span>
      </h3>

      <div className="md:flex gap-5">
        {/* Weight Section */}
        <fieldset>
          <legend className="sr-only">Package weight</legend>
          <label className="block font-medium mb-2">Package weight</label>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                name="majorWeight"
                maxLength={3}
                onChange={formik.handleChange}
                value={formik.values.majorWeight}
                className="border rounded px-3 py-2 pr-10 w-24"
                placeholder="0"
                aria-label="Enter weight in kilogrammes"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                kg
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                name="minorWeight"
                maxLength={3}
                onChange={formik.handleChange}
                value={formik.values.minorWeight}
                className="border rounded px-3 py-2 pr-10 w-24"
                placeholder="0"
                aria-label="Enter weight in grammes"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                g
              </span>
            </div>
          </div>
        </fieldset>

        {/* Dimensions Section */}
        <fieldset>
          <legend className="sr-only">Package dimensions</legend>
          <label className="block font-medium mb-2">Package dimensions</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                name="length"
                onChange={formik.handleChange}
                value={formik.values.length}
                className="border rounded px-3 py-2 pr-12 w-24"
                placeholder="Length"
                aria-label="Enter package length in centimetres"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                cm
              </span>
            </div>
            <span>x</span>
            <div className="relative">
              <input
                type="text"
                name="width"
                onChange={formik.handleChange}
                value={formik.values.width}
                className="border rounded px-3 py-2 pr-12 w-24"
                placeholder="Width"
                aria-label="Enter package width in centimetres"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                cm
              </span>
            </div>
            <span>x</span>
            <div className="relative">
              <input
                type="text"
                name="depth"
                onChange={formik.handleChange}
                value={formik.values.depth}
                className="border rounded px-3 py-2 pr-12 w-24"
                placeholder="Height"
                aria-label="Enter package depth in centimetres"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                cm
              </span>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Optional Submit Button to test */}
      {/* <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Package Details
        </button> */}
    </div>
  );
}

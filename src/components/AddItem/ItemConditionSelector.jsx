// 'use client'
// import React, { useState } from "react";

// const ItemConditionSelector = () => {
//     const [selectedCondition, setSelectedCondition] = useState("New");
//     const [showModal, setShowModal] = useState(false);

//     const conditions = [
//         {
//             label: "New",
//             description:
//                 "A brand-new, unused, unopened and undamaged item in original retail packaging.",
//         },
//         {
//             label: "Opened – never used",
//             description:
//                 "A new, unused item with absolutely no signs of wear. Packaging might be opened or missing.",
//         },
//         {
//             label: "Used",
//             description:
//                 "An item that has been previously used but is fully operational.",
//         },
//         {
//             label: "For parts or not working",
//             description:
//                 "Item that does not function as intended or requires repair.",
//         },
//     ];

//     const handleSelect = (value) => {
//         setSelectedCondition(value);
//         setShowModal(false);
//     };

//     return (
//         <div className="">
//             <h1 className="text-xl font-bold tracking-wide pb-3">condition</h1>
//             <h2 className="text-sm  mb-2">Item Condition</h2>
//             <button
//                 className="text-blue-600 underline"
//                 onClick={() => setShowModal(true)}
//             >
//                 {selectedCondition}
//             </button>

//             {/* {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
//             <h3 className="text-lg font-bold mb-4">Select Item Condition</h3>

//             <div className="space-y-4">
//               {conditions.map((cond) => (
//                 <label key={cond.label} className="block cursor-pointer">
//                   <input
//                     type="radio"
//                     name="condition"
//                     value={cond.label}
//                     checked={selectedCondition === cond.label}
//                     onChange={() => handleSelect(cond.label)}
//                     className="mr-2"
//                   />
//                   <span className="font-medium">{cond.label}</span>
//                   <div className="text-sm text-gray-600">{cond.description}</div>
//                 </label>
//               ))}
//             </div>

//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Done
//             </button>
//           </div>
//         </div>
//       )} */}

//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">

//                     <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
//                         <h3 className="text-lg font-bold mb-4"> Item Condition</h3>
//                         <div className="space-y-4">
//                             {conditions.map((cond) => (
//                                 <label key={cond.label} className="block cursor-pointer">
//                                     <input
//                                         type="radio"
//                                         name="condition"
//                                         value={cond.label}
//                                         checked={selectedCondition === cond.label}
//                                         onChange={() => handleSelect(cond.label)}
//                                         className="mr-2"
//                                     />
//                                     <span className="font-medium">{cond.label}</span>
//                                     <div className="text-sm text-gray-600">{cond.description}</div>
//                                 </label>
//                             ))}
//                         </div>

//                         <button
//                             onClick={() => setShowModal(false)}
//                             className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                         >
//                             Done
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ItemConditionSelector;

"use client"

import React, { useState } from "react";

  const ItemConditionSelector = ({ formik }) => {
    const [showModal, setShowModal] = useState(false);

    const conditions = [
        {
            label: "New",
            description:
                "A brand-new, unused, unopened and undamaged item in original retail packaging.",
        },
        {
            label: "Opened – never used",
            description:
                "A new, unused item with absolutely no signs of wear. Packaging might be opened or missing.",
        },
        {
            label: "Used",
            description:
                "An item that has been previously used but is fully operational.",
        },
        {
            label: "For parts or not working",
            description:
                "Item that does not function as intended or requires repair.",
        },
    ];

    const handleSelect = (value) => {
        formik.setFieldValue('condition', value); // 👈 Update formik
        setShowModal(false);
    };

    return (
        <div className="">
            <h1 className="text-xl font-bold tracking-wide pb-3">Condition</h1>
            <h2 className="text-sm mb-2">Item Condition</h2>
            <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => setShowModal(true)}
            >
                {formik.values.condition} {/* 👈 Use formik value */}
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Item Condition</h3>
                        <div className="space-y-4">
                            {conditions.map((cond) => (
                                <label key={cond.label} className="block cursor-pointer">
                                    <input
                                        type="radio"
                                        name="condition"
                                        value={cond.label}
                                        checked={formik.values.condition === cond.label}
                                        onChange={() => handleSelect(cond.label)}
                                        className="mr-2"
                                    />
                                    <span className="font-medium">{cond.label}</span>
                                    <div className="text-sm text-gray-600">{cond.description}</div>
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemConditionSelector;


// "use client";
// import React, { useState } from "react";
// import { MdOutlinePhone } from "react-icons/md";
// import { FaTrashAlt, FaEdit } from "react-icons/fa";
// import CustomerReviewsSection from "./CustomerReviewsSection";
// import CreateReves from './CreateReviews';
// import Link from "next/link";
// import { useSelector } from "react-redux";

// export default function DescriptionAndReviews({ details, condition, user, shop ,product}) {
//     const [showPhone, setShowPhone] = useState(false);
//     const [openTab, setOpenTab] = useState("specifics"); // default open
//     const { user: currentUser } = useSelector((state) => state.auth);

//     const condition_value = condition?.name || "N/A";
//     const phoneText = showPhone ? user?.phone_number : "Click to view number";
//     const properties = product?.properties || [];

//     return (
//         <main className="mx-auto max-w-screen-xl  py-8 text-gray-800">
//             {/* Section Header */}
//             <header className="pb-4 border-b border-gray-300">
              
//                 <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
//                     Item Details
//                 </h2>
//             </header>

//             {/* Collapsible Tabs */}
//             <section className="mt-6">
//                 {/* Product Specifics */}
//                 <div className="border rounded-xl mb-4">
//                     <button
//                         onClick={() => setOpenTab(openTab === 'specifics' ? '' : 'specifics')}
//                         className="w-full flex justify-between items-center p-4 font-medium text-left"
//                     >
//                         Product specifics
//                         <span>{openTab === 'specifics' ? '−' : '+'}</span>
//                     </button>
//                     {openTab === 'specifics' && (
//                         <div className="p-4 border-t text-sm text-gray-700 space-y-1">
//                             {currentUser?.username === user?.username || currentUser?.admin==true &&<Link href={`/products/edit/specifics/${product?.id}`} className="flex items-center gap-2">
//                             <FaEdit className="h-4 w-4 text-violet-700" />
//                             <span className="text-violet-700 hover:underline">Edit Specifics</span>
//                             </Link>}

//                             <p><b>Seller location:</b> {user?.town} - {user?.country}</p>
//                             <p><b>Condition:</b> {condition_value}</p>
//                             {/* Add more static/dynamic specifics if needed */}

//                             {/* Dynamic product properties */}
//                             {properties && properties.map((item) => (
//                                 <div key={item.id} >
//                                     <span ><b>{item.property.label}</b>: {item.value}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Item Description */}
//                 <div className="border rounded-xl">
//                     <button
//                         onClick={() => setOpenTab(openTab === 'description' ? '' : 'description')}
//                         className="w-full flex justify-between items-center p-4 font-medium text-left"
//                     >
//                         Item description from seller
//                         <span>{openTab === 'description' ? '−' : '+'}</span>
//                     </button>
//                     {openTab === 'description' && (
//                         <div
//                             className="p-4 border-t text-sm text-gray-700 leading-relaxed"
//                             dangerouslySetInnerHTML={{ __html: details }}
//                         />
//                     )}
//                 </div>
//             </section>

//             {/* Seller Info Card */}
//             <section className="mt-8 max-w-xl">
//                 <div className="lg:p-4 md:p-6">
//                     <div className="flex flex-col gap-4">
//                         <div className="flex items-center gap-4">
//                             {shop?.shop_logo ? (
//                                 <img
//                                     src={shop.shop_logo}
//                                     alt={shop?.name}
//                                     className="w-16 h-16 rounded-full shadow center"
//                                 />
//                             ) : (
//                                 <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                                     N/A
//                                 </div>
//                             )}
//                             <div>
//                                 <h6 className="text-sm md:text-base lg:text-lg font-medium mb-1">
//                                     {user?.username}
//                                 </h6>
//                                 <ul className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
//                                     <li>1 follower</li>
//                                     <li className="text-green-600">55 Items</li>
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="flex justify-between gap-2 text-center">
//                             <button className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold">Save seller</button>
//                             <Link href={`/shops/${shop?.slug}`}
//                                 className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold"
//                             >
//                                Shop all items
//                             </Link>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => setShowPhone(!showPhone)}
//                             className="flex items-center gap-2 justify-center w-full border border-purple-500 text-purple-500 rounded px-4 py-2 text-sm font-semibold"
//                         >
//                             <MdOutlinePhone />
//                             {phoneText}
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* Customer Reviews */}
//             <section className="mt-12">
//                 <h3 className="text-lg md:text-xl lg:text-2xl font-semibold border-b pb-2 mb-4">
//                     Verified Customer Review
//                 </h3>

//                 <div className="bg-gray-100 p-4 rounded-md mb-6">
//                     <div className="flex flex-col md:flex-row items-center gap-4">
//                         <div className="md:w-1/3 text-center">
//                             <h3 className="text-2xl font-bold mb-1">5.0</h3>
//                             <p className="text-sm text-gray-600">Based on 3 Customer Reviews</p>
//                             <div className="mt-1 text-yellow-400 text-lg">★★★★★</div>
//                         </div>
//                         <div className="md:w-2/3 flex flex-col space-y-2">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-2/3 bg-yellow-100 h-2 rounded">
//                                     <div className="bg-yellow-400 h-2 rounded" style={{ width: '95%' }}></div>
//                                 </div>
//                                 <span className="text-sm text-gray-700">85%</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-2/3 bg-yellow-100 h-2 rounded">
//                                     <div className="bg-yellow-400 h-2 rounded" style={{ width: '75%' }}></div>
//                                 </div>
//                                 <span className="text-sm text-gray-700">75%</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <CustomerReviewsSection slug={details?.slug} />
//             </section>

//             <CreateReves />

//             {/* Legal Disclaimer */}
//             <section className="bg-gray-100 p-4 mt-12 rounded-md text-sm leading-relaxed">
//                 <p className="mb-2"><strong>Legal Disclaimer:</strong> The Seller takes full responsibility for this listing.</p>
//                 <p className="mb-2">
//                     Product info may change. Always read the label and packaging before use. If in doubt, contact the manufacturer.
//                 </p>
//                 <p className="mb-2">
//                     Content is not intended as medical advice. Contact a health professional if needed.
//                 </p>
//                 <p>
//                     Upfrica is not liable for product errors or third-party misinformation. Your statutory rights are unaffected.
//                 </p>
//             </section>
//         </main>
//     );
// }


'use client';

import React, { useState } from "react";
import { MdOutlinePhone } from "react-icons/md";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import CustomerReviewsSection from "./CustomerReviewsSection";
import CreateReves from './CreateReviews';
import Link from "next/link";
import { useSelector } from "react-redux";

export default function DescriptionAndReviews({
    details,
    condition,
    user,
    shop,
    product
}) {
    const [showPhone, setShowPhone] = useState(false);
    const [openTab, setOpenTab] = useState("specifics"); // default open pane
    const { user: currentUser } = useSelector((state) => state.auth);

    const condition_value = condition?.name || "N/A";
    const phoneText = showPhone ? user?.phone_number : "Click to view number";
    const properties = product?.properties || [];

    // if there is at least one property, only admin can edit;
    // if there are zero properties, only the owner can edit
    const canEditSpecifics =
        properties.length >= 1
            ? currentUser?.admin === true
            : currentUser?.username === user?.username;

    return (
        <main className="mx-auto max-w-screen-xl py-8 text-gray-800">
            {/* Section Header */}
            <header className="pb-4 border-b border-gray-300">
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
                    Item Details
                </h2>
            </header>

            {/* Collapsible Tabs */}
            <section className="mt-6">
                {/* Product Specifics */}
                <div className="border rounded-xl mb-4">
                    <button
                        onClick={() =>
                            setOpenTab(openTab === "specifics" ? "" : "specifics")
                        }
                        className="w-full flex justify-between items-center p-4 font-medium text-left"
                    >
                        Product specifics
                        <span>{openTab === "specifics" ? "−" : "+"}</span>
                    </button>
                    {openTab === "specifics" && (
                        <div className="p-4 border-t text-sm text-gray-700 space-y-2">
                            {canEditSpecifics && (
                                <Link
                                    href={`/products/edit/specifics/${product?.id}`}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <FaEdit className="h-4 w-4 text-violet-700" />
                                    <span className="text-violet-700 hover:underline">
                                        Edit Specifics
                                    </span>
                                </Link>
                            )}

                            <p>
                                <b>Seller location:</b> {user?.town} – {user?.country}
                            </p>
                            <p>
                                <b>Condition:</b> {condition_value}
                            </p>

                            {/* Dynamic product properties */}
                            {properties.length > 0 ? (
                                properties.map((item) => (
                                    <div key={item.id}>
                                        <span>
                                            <b>{item.property.label}:</b> {item.value}
                                        </span>
                                    </div>
                                ))
                            ) : (
                               <></>
                            )}
                        </div>
                    )}
                </div>

                {/* Item Description */}
                <div className="border rounded-xl">
                    <button
                        onClick={() =>
                            setOpenTab(openTab === "description" ? "" : "description")
                        }
                        className="w-full flex justify-between items-center p-4 font-medium text-left"
                    >
                        Item description from seller
                        <span>{openTab === "description" ? "−" : "+"}</span>
                    </button>
                    {openTab === "description" && (
                        <div
                            className="p-4 border-t text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: details }}
                        />
                    )}
                </div>
            </section>

            {/* Seller Info Card */}
            <section className="mt-8 max-w-xl">
                <div className="lg:p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            {shop?.shop_logo ? (
                                <img
                                    src={shop.shop_logo}
                                    alt={shop?.name}
                                    className="w-16 h-16 rounded-full shadow"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    N/A
                                </div>
                            )}
                            <div>
                                <h6 className="text-sm md:text-base lg:text-lg font-medium mb-1">
                                    {user?.username}
                                </h6>
                                <ul className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
                                    <li>1 follower</li>
                                    <li className="text-green-600">55 Items</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-between gap-2 text-center">
                            <button className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold">
                                Save seller
                            </button>
                            <Link
                                href={`/shops/${shop?.slug}`}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold"
                            >
                                Shop all items
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPhone(!showPhone)}
                            className="flex items-center gap-2 justify-center w-full border border-purple-500 text-purple-500 rounded px-4 py-2 text-sm font-semibold"
                        >
                            <MdOutlinePhone />
                            {phoneText}
                        </button>
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="mt-12">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold border-b pb-2 mb-4">
                    Verified Customer Review
                </h3>

                <div className="bg-gray-100 p-4 rounded-md mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="md:w-1/3 text-center">
                            <h3 className="text-2xl font-bold mb-1">5.0</h3>
                            <p className="text-sm text-gray-600">
                                Based on 3 Customer Reviews
                            </p>
                            <div className="mt-1 text-yellow-400 text-lg">★★★★★</div>
                        </div>
                        <div className="md:w-2/3 flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2/3 bg-yellow-100 h-2 rounded">
                                    <div
                                        className="bg-yellow-400 h-2 rounded"
                                        style={{ width: "95%" }}
                                    />
                                </div>
                                <span className="text-sm text-gray-700">85%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2/3 bg-yellow-100 h-2 rounded">
                                    <div
                                        className="bg-yellow-400 h-2 rounded"
                                        style={{ width: "75%" }}
                                    />
                                </div>
                                <span className="text-sm text-gray-700">75%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <CustomerReviewsSection slug={details?.slug} />
            </section>

            <CreateReves />

            {/* Legal Disclaimer */}
            <section className="bg-gray-100 p-4 mt-12 rounded-md text-sm leading-relaxed">
                <p className="mb-2">
                    <strong>Legal Disclaimer:</strong> The Seller takes full
                    responsibility for this listing.
                </p>
                <p className="mb-2">
                    Product info may change. Always read the label and packaging
                    before use. If in doubt, contact the manufacturer.
                </p>
                <p className="mb-2">
                    Content is not intended as medical advice. Contact a health
                    professional if needed.
                </p>
                <p>
                    Upfrica is not liable for product errors or third-party
                    misinformation. Your statutory rights are unaffected.
                </p>
            </section>
        </main>
    );
}

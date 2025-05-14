


// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AiOutlineHome,
//   AiOutlineUser,
//   AiOutlinePhone,
// } from "react-icons/ai";

// export default function OrderCard({
//   order,
//   items = [], // array of order_items to render
// }) {
//   const router = useRouter();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [itemDropdown, setItemDropdown] = useState(null);
//   const [showFullInfo, setShowFullInfo] = useState(false);
//   const dropdownRef = useRef();

//   useEffect(() => {
//     const handler = (e) => {
//       if (!dropdownRef.current?.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const phone = order.address.address_data.phone_number;
//   const maskedPhone = phone.replace(/(\+\d{3})\s\d{2}\s\d{3}/, "$1 ***");

//   return (
//     <div className=" md:w-full bg-white rounded-xl shadow-upfrica mb-6 p-4">
//       {/* — Order Header — */}
//       <div className="flex flex-col md:flex-row justify-between bg-gray-100 rounded-lg p-4 gap-4">
//         <div className="flex-1 min-w-0">
//           <div className="text-green-600 font-bold flex items-center mb-2 text-sm sm:text-base">
//             ✅{" "}
//             {order.order_items.every(i => i.receive_status === 1)
//               ? "Received"
//               : "Processing"}
//           </div>
//           <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-black">
//             <div>
//               <span className="block font-bold text-green-600">Order #</span>
//               {String(order.id).padStart(8, "0")}
//             </div>
//             <div>
//               <span className="block font-bold text-green-600">Date</span>
//               {new Date(order.created_at).toLocaleDateString()}
//             </div>
//             <div>
//               <span className="block font-bold text-green-600">Total</span>
//               GHS {(order.total_fee_cents / 100).toFixed(2)}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//           <button
//             className="w-1/2 sm:w-auto h-8 text-white upfrica-btn-primary-sm text-sm"
//             onClick={() => router.push(`/new-dashboard/my-orders/${order.id}`)}
//           >
//             View details
//           </button>
//         </div>
//       </div>

//       {/* — Items List — */}
//       <div className="mt-4 space-y-4">
//         {items.map((item) => {
//           const status = item.receive_status === 1 ? "Received" : "Processing";
//           return (
//             <div
//               key={item.id}
//               className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 rounded-lg p-3 relative"
//             >
//               <img
//                 src={item.product.product_images?.[0] || "/placeholder.png"}
//                 alt={item.product.title}
//                 className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
//               />

//               <div className="flex-1 min-w-0 space-y-1">
//                 <h3 className="font-semibold truncate text-sm sm:text-base">
//                   {item.product.title}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-600">
//                   <strong>Status:</strong> {status}
//                 </p>
//                 <p className="text-xs sm:text-sm text-gray-600">
//                   <strong>Item ID:</strong> {item.id}
//                 </p>
//                 <p className="text-xs sm:text-sm text-gray-600">
//                   <strong>Price:</strong> GHS{" "}
//                   {(item.price_cents / 100).toFixed(2)}
//                 </p>
//               </div>

//               {/* per‐item More Actions dropdown */}
//               <div className="relative self-start sm:self-auto">
//                 <button
//                   className="text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                   onClick={() =>
//                     setItemDropdown(open =>
//                       open === item.id ? null : item.id
//                     )
//                   }
//                 >
//                   More Actions ▼
//                 </button>
//                 {itemDropdown === item.id && (
//                   <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-40">
//                     {[
//                       "Contact seller",
//                       "Return this item",
//                       "I didn’t receive it",
//                       "Sell this item",
//                       "Add note",
//                       "Hide Order",
//                       "Help & report",
//                     ].map((label, i) => (
//                       <button
//                         key={i}
//                         className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
//                       >
//                         {label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>




//             </div>
//           );
//         })}
//       </div>

//       {/* — Delivery Info — */}
//       <hr className="border-t border-gray-200 my-4" />
//       <div className="text-sm text-gray-700 space-y-2">
//         <span className="font-semibold text-gray-800">Delivery Info:</span>
//         <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <AiOutlineHome size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo
//                 ? `${order.address.address_data.address_line_1}${order.address.address_data.address_line_2
//                   ? ", " + order.address.address_data.address_line_2
//                   : ""
//                 }, ${order.address.address_data.local_area}, ${order.address.address_data.town
//                 }, ${order.address.address_data.country}`
//                 : `${order.address.address_data.town}, ${order.address.address_data.country}`}
//             </span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <AiOutlineUser size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo
//                 ? `${order.buyer.first_name} ${order.buyer.last_name}`
//                 : `${order.buyer.first_name} ${order.buyer.last_name[0]}.`}
//             </span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <AiOutlinePhone size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo ? phone : maskedPhone}
//             </span>
//           </div>
//         </div>
//         <button
//           onClick={() => setShowFullInfo(v => !v)}
//           className="text-sm text-purple-600 mt-2 underline"
//         >
//           {showFullInfo ? "Hide full info ▲" : "Show full info ▼"}
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AiOutlineHome,
//   AiOutlineUser,
//   AiOutlinePhone,
//   AiOutlineShoppingCart,
//   AiOutlineEdit,
//   AiOutlineShop,
// } from "react-icons/ai";
// import DirectBuyPopup from "@/components/DirectBuyPopup";


// export default function OrderCard({
//   order,
//   items = [], // array of order_items to render
// }) {
//   const router = useRouter();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [itemDropdown, setItemDropdown] = useState(null);
//   const [showFullInfo, setShowFullInfo] = useState(false);
//   // বদলে ফেলুন বা যোগ করুন:
//   const [popupItem, setPopupItem] = useState(null);   // যেই আইটেমের ডাটা পাঠাবো
//   const [showBuyPopup, setShowBuyPopup] = useState(false);  // মডাল খোলা/বন্ধ

//   const dropdownRef = useRef();

//   useEffect(() => {
//     const handler = (e) => {
//       if (!dropdownRef.current?.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const phone = order.address.address_data.phone_number;
//   const maskedPhone = phone.replace(/(\+\d{3})\s\d{2}\s\d{3}/, "$1 ***");

//   // --- New handlers for our buttons ---
//   const handleBuyAgain = (item) => {
//     // ১) সেট করি কোন আইটেমে ক্লিক হয়েছে
//     setPopupItem(item.product);
//     // ২) মডাল খুলতে বলি
//     setShowBuyPopup(true);

//     // navigate to product page so user can re-order
//     // router.push(`/product/${item.product.id}`);
//   };

//   const handleWriteReview = (item) => {
//     console.log("revews",item);

//     // navigate to review form
//     // router.push(`/product/${item.product.id}/review`);
//   };

//   const handleViewSellerItems = (item) => {
//     // navigate to seller's storefront
//     router.push(`/seller/${item.product.seller.id}/items`);
//   };




//   return (
//     <div className="md:w-full bg-white rounded-xl shadow-upfrica mb-6 p-4">
//       {/* — Order Header — */}
//       <div className="flex flex-col md:flex-row justify-between bg-gray-100 rounded-lg p-4 gap-4">
//         <div className="flex-1 min-w-0">
//           <div className="text-green-600 font-bold flex items-center mb-2 text-sm sm:text-base">
//             ✅{" "}
//             {order.order_items.every(i => i.receive_status === 1)
//               ? "Received"
//               : "Processing"}
//           </div>
//           <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-black">
//             <div>
//               <span className="block font-bold text-green-600">Order #</span>
//               {String(order.id).padStart(8, "0")}
//             </div>
//             <div>
//               <span className="block font-bold text-green-600">Date</span>
//               {new Date(order.created_at).toLocaleDateString()}
//             </div>
//             <div>
//               <span className="block font-bold text-green-600">Total</span>
//               GHS {(order.total_fee_cents / 100).toFixed(2)}
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//           <button
//             className="w-1/2 sm:w-auto h-8 text-white upfrica-btn-primary-sm text-sm"
//             onClick={() => router.push(`/new-dashboard/my-orders/${order.id}`)}
//           >
//             View details
//           </button>
//         </div>
//       </div>

//       {/* — Items List — */}
//       <div className="mt-4 space-y-4">
//         {items.map((item) => {
//           const status = item.receive_status === 1 ? "Received" : "Processing";
//           return (
//             <div
//               key={item.id}
//               className="bg-gray-50"
//             >
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 rounded-lg p-3 relative"
//               >
//                 <img
//                   src={item.product.product_images?.[0] || "/placeholder.png"}
//                   alt={item.product.title}
//                   className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
//                 />

//                 <div className="flex-1 min-w-0 space-y-1">
//                   <h3 className="font-semibold truncate text-sm sm:text-base">
//                     {item.product.title}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     <strong>Status:</strong> {status}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     <strong>Item ID:</strong> {item.id}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     <strong>Price:</strong> GHS{" "}
//                     {(item.price_cents / 100).toFixed(2)}
//                   </p>
//                 </div>

//                 {/* per-item More Actions dropdown */}
//                 <div className="relative self-start sm:self-auto">
//                   <button
//                     className="text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                     onClick={() =>
//                       setItemDropdown(open =>
//                         open === item.id ? null : item.id
//                       )
//                     }
//                   >
//                     More Actions ▼
//                   </button>
//                   {itemDropdown === item.id && (
//                     <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-40">
//                       {[
//                         "Contact seller",
//                         "Return this item",
//                         "I didn’t receive it",
//                         "Sell this item",
//                         "Add note",
//                         "Hide Order",
//                         "Help & report",
//                       ].map((label, i) => (
//                         <button
//                           key={i}
//                           className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
//                         >
//                           {label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>


//               {/* — New per-item buttons — */}
//               <div className=" p-2 flex gap-2">
//                 <button
//                   onClick={() => handleBuyAgain(item)}
//                   className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                 >
//                   <AiOutlineShoppingCart className="mr-1" size={16} />
//                   Buy it again
//                 </button>
//                 <button
//                   onClick={() => handleWriteReview(item)}
//                   className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                 >
//                   <AiOutlineEdit className="mr-1" size={16} />
//                   Write a review
//                 </button>
//                 <button
//                   onClick={() => handleViewSellerItems(item)}
//                   className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                 >
//                   <AiOutlineShop className="mr-1" size={16} />
//                   Seller’s items
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* — Delivery Info — */}
//       <hr className="border-t border-gray-200 my-4" />
//       <div className="text-sm text-gray-700 space-y-2">
//         <span className="font-semibold text-gray-800">Delivery Info:</span>
//         <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <AiOutlineHome size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo
//                 ? `${order.address.address_data.address_line_1}${order.address.address_data.address_line_2
//                   ? ", " + order.address.address_data.address_line_2
//                   : ""
//                 }, ${order.address.address_data.local_area}, ${order.address.address_data.town
//                 }, ${order.address.address_data.country}`
//                 : `${order.address.address_data.town}, ${order.address.address_data.country}`}
//             </span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <AiOutlineUser size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo
//                 ? `${order.buyer.first_name} ${order.buyer.last_name}`
//                 : `${order.buyer.first_name} ${order.buyer.last_name[0]}.`}
//             </span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <AiOutlinePhone size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo ? phone : maskedPhone}
//             </span>
//           </div>
//         </div>
//         <button
//           onClick={() => setShowFullInfo(v => !v)}
//           className="text-sm text-purple-600 mt-2 underline"
//         >
//           {showFullInfo ? "Hide full info ▲" : "Show full info ▼"}
//         </button>
//       </div>

//       {showBuyPopup && (
//         <DirectBuyPopup
//           product={popupItem}                // আইটেমের ডাটা পাঠাচ্ছি
//           onClose={() => {
//             setShowBuyPopup(false);       // বন্ধ করতে
//             setPopupItem(null);           // আইটেম পরিষ্কার করতে
//           }}
//         />
//       )}

//     </div>
//   );
// }


// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AiOutlineHome,
//   AiOutlineUser,
//   AiOutlinePhone,
//   AiOutlineShoppingCart,
//   AiOutlineEdit,
//   AiOutlineShop,
// } from "react-icons/ai";
// import DirectBuyPopup from "@/components/DirectBuyPopup";

// export default function OrderCard({ order, items = [] }) {
//   const router = useRouter();
//   const [itemDropdown, setItemDropdown] = useState(null);
//   const [showFullInfo, setShowFullInfo] = useState(false);
//   const [popupItem, setPopupItem] = useState(null);
//   const [popupQuantity, setPopupQuantity] = useState(1);
//   const [showBuyPopup, setShowBuyPopup] = useState(false);
//   const dropdownRef = useRef();

//   // close dropdown when clicking outside
//   useEffect(() => {
//     const handler = (e) => {
//       if (!dropdownRef.current?.contains(e.target)) {
//         setItemDropdown(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const phone = order.address.address_data.phone_number;
//   const maskedPhone = phone.replace(/(\+\d{3})\s\d{2}\s\d{3}/, "$1 ***");

//   // — Handlers for the new buttons —
//   const handleBuyAgain = (item) => {
//     setPopupItem(item.product);
//     setPopupQuantity(item.quantity || 1); // fall back to 1 if not provided
//     setShowBuyPopup(true);
//   };
//   const handleWriteReview = (item) => {
//     router.push(`/product/${item.product.id}/review`);
//   };
//   const handleViewSellerItems = (item) => {
//     router.push(`/seller/${item.product.seller.id}/items`);
//   };

//   return (
//     <div className="md:w-full bg-white rounded-xl shadow-upfrica mb-6 p-4">
//       {/* — Order Header — */}
//       <div className="flex flex-col md:flex-row justify-between bg-gray-100 rounded-lg p-4 gap-4">
//         <div className="flex-1 min-w-0">
//           <div className="text-green-600 font-bold flex items-center mb-2 text-sm sm:text-base">
//             ✅{" "}
//             {order.order_items.every(i => i.receive_status === 1)
//               ? "Received"
//               : "Processing"}
//           </div>
//           <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-black">
//             <div>
//               <span className="block font-bold text-green-600">Order #</span>
//               {String(order.id).padStart(8, "0")}
//             </div>
//             <div>
//               <span className="block font-bold text-green-600">Date</span>
//               {new Date(order.created_at).toLocaleDateString()}
//             </div>
//             <div>
//               <span className="block font-bold text-green-600">Total</span>
//               GHS {(order.total_fee_cents / 100).toFixed(2)}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//           <button
//             className="w-1/2 sm:w-auto h-8 text-white upfrica-btn-primary-sm text-sm"
//             onClick={() => router.push(`/new-dashboard/my-orders/${order.id}`)}
//           >
//             View details
//           </button>
//         </div>
//       </div>

//       {/* — Items List — */}
//       <div className="mt-4 space-y-4">
//         {items.map((item) => {
//           const status = item.receive_status === 1 ? "Received" : "Processing";
//           return (
//             <div key={item.id} className="bg-gray-50 rounded-lg">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3">
//                 <img
//                   src={item.product.product_images?.[0] || "/placeholder.png"}
//                   alt={item.product.title}
//                   className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
//                 />

//                 <div className="flex-1 min-w-0 space-y-1">
//                   <h3 className="font-semibold truncate text-sm sm:text-base">
//                     {item.product.title}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     <strong>Status:</strong> {status}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     <strong>Item ID:</strong> {item.id}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     <strong>Price:</strong> GHS {(item.price_cents / 100).toFixed(2)}
//                   </p>
//                 </div>

//                 {/* — More Actions dropdown — */}
//                 <div ref={dropdownRef} className="relative self-start sm:self-auto">
//                   <button
//                     className="text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                     onClick={() =>
//                       setItemDropdown(open => (open === item.id ? null : item.id))
//                     }
//                   >
//                     More Actions ▼
//                   </button>
//                   {itemDropdown === item.id && (
//                     <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-40">
//                       {[
//                         "Contact seller",
//                         "Return this item",
//                         "I didn’t receive it",
//                         "Sell this item",
//                         "Add note",
//                         "Hide Order",
//                         "Help & report",
//                       ].map((label, i) => (
//                         <button
//                           key={i}
//                           className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
//                         >
//                           {label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* — New per-item buttons — */}
//               <div className="p-2 flex gap-2">
//                 <button
//                   onClick={() => handleBuyAgain(item)}
//                   className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                 >
//                   <AiOutlineShoppingCart className="mr-1" size={16} />
//                   Buy it again
//                 </button>
//                 <button
//                   onClick={() => handleWriteReview(item)}
//                   className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                 >
//                   <AiOutlineEdit className="mr-1" size={16} />
//                   Write a review
//                 </button>
//                 <button
//                   onClick={() => handleViewSellerItems(item)}
//                   className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
//                 >
//                   <AiOutlineShop className="mr-1" size={16} />
//                   Seller’s items
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* — Delivery Info — */}
//       <hr className="border-t border-gray-200 my-4" />
//       <div className="text-sm text-gray-700 space-y-2">
//         <span className="font-semibold text-gray-800">Delivery Info:</span>
//         <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <AiOutlineHome size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo
//                 ? `${order.address.address_data.address_line_1}${
//                     order.address.address_data.address_line_2
//                       ? ", " + order.address.address_data.address_line_2
//                       : ""
//                   }, ${order.address.address_data.local_area}, ${
//                     order.address.address_data.town
//                   }, ${order.address.address_data.country}`
//                 : `${order.address.address_data.town}, ${order.address.address_data.country}`}
//             </span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <AiOutlineUser size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo
//                 ? `${order.buyer.first_name} ${order.buyer.last_name}`
//                 : `${order.buyer.first_name} ${order.buyer.last_name[0]}.`}
//             </span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <AiOutlinePhone size={18} />
//             <span className="text-xs sm:text-sm">
//               {showFullInfo ? phone : maskedPhone}
//             </span>
//           </div>
//         </div>
//         <button
//           onClick={() => setShowFullInfo(v => !v)}
//           className="text-sm text-purple-600 mt-2 underline"
//         >
//           {showFullInfo ? "Hide full info ▲" : "Show full info ▼"}
//         </button>
//       </div>

//       {/* — DirectBuyPopup — */}
//       {showBuyPopup && popupItem && (
//         <DirectBuyPopup
//           product={popupItem}
//           isVisible={showBuyPopup}
//           quantity={popupQuantity}
//           onClose={() => {
//             setShowBuyPopup(false);
//             setPopupItem(null);
//             setPopupQuantity(1);
//           }}
//         />
//       )}
//     </div>
//   );
// }


"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineShoppingCart,
  AiOutlineEdit,
  AiOutlineShop,
} from "react-icons/ai";
import { HiXMark } from "react-icons/hi2";
import DirectBuyPopup from "@/components/DirectBuyPopup";
import CreateReviews from "@/components/CreateReviews";

export default function OrderCard({ order, items = [] }) {
  const router = useRouter();
  const [itemDropdown, setItemDropdown] = useState(null);
  const [showFullInfo, setShowFullInfo] = useState(false);

  // Direct-buy popup state
  const [popupItem, setPopupItem] = useState(null);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const [showBuyPopup, setShowBuyPopup] = useState(false);

  // Review-popup state
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [reviewProductSlug, setReviewProductSlug] = useState("");

  const dropdownRef = useRef();

  // close “More Actions” if clicking outside
  useEffect(() => {
    const handler = e => {
      if (!dropdownRef.current?.contains(e.target)) {
        setItemDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const phone = order.address.address_data.phone_number;
  const maskedPhone = phone?.replace(/(\+\d{3})\s\d{2}\s\d{3}/, "$1 ***");

  const handleBuyAgain = item => {
    setPopupItem(item.product);
    setPopupQuantity(item.quantity || 1);
    setShowBuyPopup(true);
  };

  const handleWriteReview = item => {
    const slug = item.product.seo_slug || item.product.slug;
    setReviewProductSlug(slug);
    setShowReviewPopup(true);
  };

  const handleViewSellerItems = item => {
    console.log("item", item);
    router.push(`/shops/${item?.shop?.slug}`);
    // router.push(`/seller/${item.product.seller.id}/items`);
  };

  return (
    <div className="md:w-full bg-white rounded-xl shadow-upfrica mb-6 p-4">
      {/* — Order Header — */}
      <div className="flex flex-col md:flex-row justify-between bg-gray-100 rounded-lg p-4 gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-green-600 font-bold flex items-center mb-2 text-sm sm:text-base">
            ✅{" "}
            {order.order_items.every(i => i.receive_status === 1)
              ? "Received"
              : "Processing"}
          </div>
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-black">
            <div>
              <span className="block font-bold text-green-600">Order #</span>
              {String(order.id).padStart(8, "0")}
            </div>
            <div>
              <span className="block font-bold text-green-600">Date</span>
              {new Date(order.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="block font-bold text-green-600">Total</span>
              GHS {(order.total_fee_cents / 100).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            className="w-1/2 sm:w-auto h-8 text-white upfrica-btn-primary-sm text-sm"
            onClick={() => router.push(`/new-dashboard/my-orders/${order.id}`)}
          >
            View details
          </button>
        </div>
      </div>

      {/* — Items List — */}
      <div className="mt-4 space-y-4">
        {items.map(item => {
          const status = item.receive_status === 1 ? "Received" : "Processing";
          return (
            <div key={item.id} className="bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3">
                <img
                  src={item.product.product_images?.[0] || "/placeholder.png"}
                  alt={item.product.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold truncate text-sm sm:text-base lg:hidden">
                    {item.product.title.length > 30
                      ? `${item.product.title.substring(0, 30)}..`
                      : item.product.title}
                  </h3>
                  <h3 className="font-semibold truncate text-sm sm:text-base hidden lg:block">
                    {item.product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong>Status:</strong> {status}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong>Item ID:</strong> {item.id}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong>Price:</strong> GHS{" "}
                    {(item.price_cents / 100).toFixed(2)}
                  </p>
                </div>

                {/* — More Actions dropdown — */}
                <div ref={dropdownRef} className="relative self-start sm:self-auto">
                  <button
                    className="text-sm upfrica-btn-primary-outline-sm px-2 py-1"
                    onClick={() =>
                      setItemDropdown(open => (open === item.id ? null : item.id))
                    }
                  >
                    More Actions ▼
                  </button>
                  {itemDropdown === item.id && (
                    <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-40">
                      {[
                        "Contact seller",
                        "Return this item",
                        "I didn’t receive it",
                        "Sell this item",
                        "Add note",
                        "Hide Order",
                        "Help & report",
                      ].map((label, i) => (
                        <button
                          key={i}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* — New per-item buttons — */}
              <div className="p-2 flex flex-wrap gap-2 ">
                <button
                  onClick={() => handleBuyAgain(item)}
                  className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
                >
                  <AiOutlineShoppingCart className="mr-1" size={16} />
                  Buy it again
                </button>
                <button
                  onClick={() => handleWriteReview(item)}
                  className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
                >
                  <AiOutlineEdit className="mr-1" size={16} />
                  Write a review
                </button>
                <button
                  onClick={() => handleViewSellerItems(item)}
                  className="flex items-center text-sm upfrica-btn-primary-outline-sm px-2 py-1"
                >
                  <AiOutlineShop className="mr-1" size={16} />
                  Seller’s items
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* — Delivery Info — */}
      <hr className="border-t border-gray-200 my-4" />
      <div className="text-sm text-gray-700 space-y-2">
        <span className="font-semibold text-gray-800">Delivery Info:</span>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AiOutlineHome size={18} />
            <span className="text-xs sm:text-sm">
              {showFullInfo
                ? `${order.address.address_data.address_line_1}${order.address.address_data.address_line_2
                  ? ", " + order.address.address_data.address_line_2
                  : ""
                }, ${order.address.address_data.local_area}, ${order.address.address_data.town
                }, ${order.address.address_data.country}`
                : `${order.address.address_data.town}, ${order.address.address_data.country}`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineUser size={18} />
            <span className="text-xs sm:text-sm">
              {showFullInfo
                ? `${order.buyer.first_name} ${order.buyer.last_name}`
                : `${order.buyer.first_name} ${order.buyer.last_name[0]}.`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlinePhone size={18} />
            <span className="text-xs sm:text-sm">
              {showFullInfo ? phone : maskedPhone}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowFullInfo(v => !v)}
          className="text-sm text-purple-600 mt-2 underline"
        >
          {showFullInfo ? "Hide full info ▲" : "Show full info ▼"}
        </button>
      </div>

      {/* — DirectBuyPopup — */}
      {showBuyPopup && popupItem && (
        <DirectBuyPopup
          product={popupItem}
          isVisible={showBuyPopup}
          quantity={popupQuantity}
          onClose={() => {
            setShowBuyPopup(false);
            setPopupItem(null);
            setPopupQuantity(1);
          }}
        />
      )}

      {/* — CreateReviews Modal — */}
      {showReviewPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowReviewPopup(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setShowReviewPopup(false)}
            >
              <HiXMark size={24} />
            </button>
            <CreateReviews
              productSlug={reviewProductSlug}
              onClose={() => setShowReviewPopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}









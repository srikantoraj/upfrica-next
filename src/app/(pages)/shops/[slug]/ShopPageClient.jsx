// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useSelector } from 'react-redux';
// import {
//   AiOutlineLeft, AiOutlineRight, AiOutlineSearch, AiOutlineClose, AiOutlineFilter, AiOutlineShareAlt
// } from 'react-icons/ai';
// import { HiOutlineCalendar, HiOutlinePlus } from 'react-icons/hi';
// import { FaCheckCircle, FaStar, FaEdit, FaPhoneAlt, FaCommentDots } from 'react-icons/fa';
// import { FiShare2 } from 'react-icons/fi';
// import { AiOutlineHeart } from 'react-icons/ai';


// import ShopCard from '@/components/home/ProductList/ShopCard';
// import ShopFAQSection from '@/components/ShopFAQSection';
// import ProductCardSkeleton from './ProductCardSkeleton';
// import SearchResultSkeleton from './SearchResultSkeleton';
// import PriceRange from './PriceRange';
// import ShopEditModal from './ShopEditModal';
// import HeroSectionSkeleton from './HeroSectionSkeleton';
// import ShopProfileCard from './ShopProfileCard';
// import ShopProfileSkeleton from './ShopProfileSkeleton';
// import DirectBuyPopup from '@/components/DirectBuyPopup';
// import { usePathname, useRouter } from 'next/navigation';



// const PAGE_SIZE = 20;

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const [isMobile, setIsMobile] = useState(false);
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handlePageClick = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) onPageChange(page);
//   };

//   const getPageNumbers = () => {
//     if (isMobile) return totalPages <= 2 ? [1, ...(totalPages === 2 ? [2] : [])] : [1, 2, '...'];
//     if (totalPages <= 5) return [...Array(totalPages).keys()].map((i) => i + 1);
//     if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
//     if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
//     return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
//   };


//   return (
//     <div className="mt-8 flex justify-center overflow-x-auto">
//       <div className="inline-flex items-center space-x-2 whitespace-nowrap px-2">
//         <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
//           <AiOutlineLeft className="mr-1" /> <span>Prev</span>
//         </button>
//         {getPageNumbers().map((page, i) =>
//           typeof page === 'number' ? (
//             <button
//               key={i}
//               onClick={() => handlePageClick(page)}
//               className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${page === currentPage ? 'bg-violet-700 text-white font-semibold' : ''}`}
//             >{page}</button>
//           ) : (
//             <span key={i} className="px-3 py-1 text-gray-500">…</span>
//           )
//         )}
//         <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
//           <span>Next</span> <AiOutlineRight className="ml-1" />
//         </button>
//       </div>
//     </div>
//   );
// };


// //  * Fetches related products for the given slug




// export default function ShopPageClient({ slug }) {
//   console.log("slug", slug);

//   const { token, user } = useSelector((state) => state.auth);
//   const currentPath = usePathname();
//   const router = useRouter();


//   // ——— Popup state ———
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);

//   // ১) Related products এর জন্য state
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [relatedLoading, setRelatedLoading] = useState(false);
//   const [relatedError, setRelatedError] = useState(null);


//   // porduct 

//   const [porduct, setProduct] = useState([])


//   //   // ——— Address state for DirectBuyPopup ———
//   const [addresses, setAddresses] = useState([]);
//   const [isAddressLoading, setIsAddressLoading] = useState(true);
//   const [selectedAddressId, setSelectedAddressId] = useState('');

//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [shop, setShop] = useState(null);
//   const [mainProducts, setMainProducts] = useState([]);
//   const [mainLoading, setMainLoading] = useState(true);
//   const [mainError, setMainError] = useState(null);
//   const [shopCategories, setShopCategories] = useState([]);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);
//   const [shopConditions, setShopConditions] = useState([]);
//   const [conditionsLoading, setConditionsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
//   const [selectedConditionSlug, setSelectedConditionSlug] = useState('');
//   const [sortOption, setSortOption] = useState('');
//   const [priceMin, setPriceMin] = useState(0);
//   const [priceMax, setPriceMax] = useState(1000);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [filterLoading, setFilterLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('products');

//   const sidebarRef = useRef();


//   useEffect(() => {

//     (async () => {
//       try {
//         const res = await fetch("https://media.upfrica.com/api/addresses/", {
//           headers: { Authorization: `Token ${token}` },
//         });
//         if (!res.ok) throw new Error();
//         const data = await res.json();
//         const opts = data.map((a) => ({
//           id: a.id,
//           value: `${a.address_data.street}, ${a.address_data.city}, ${a.address_data.country}`,
//         }));
//         setAddresses(opts);
//         setSelectedAddressId(opts[0]?.id ?? null);
//       } catch {
//         setAddresses([]);
//         setSelectedAddressId(null);
//       } finally {
//         setIsAddressLoading(false);
//       }
//     })();
//   }, [token, router, currentPath]);



//   const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

//   const fetchMain = async () => {
//     setMainLoading(true);
//     try {
//       const res = await fetch(`https://media.upfrica.com/api/shops/${slug}/products/?page=${currentPage}`);
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setMainProducts(data.results || []);
//       setShop(data.shop || null);
//       setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
//     } catch (err) {
//       setMainError(err);
//     } finally {
//       setMainLoading(false);
//     }
//   };

//   useEffect(() => { fetchMain(); }, [slug, currentPage]);

//   useEffect(() => {
//     fetch(`https://media.upfrica.com/api/shops/${slug}/categories/`)
//       .then(r => r.json())
//       .then(setShopCategories)
//       .finally(() => setCategoriesLoading(false));

//     fetch(`https://media.upfrica.com/api/shops/${slug}/conditions/`)
//       .then(r => r.json())
//       .then(setShopConditions)
//       .finally(() => setConditionsLoading(false));
//   }, [slug]);

//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       setSearchLoading(false);
//       return;
//     }
//     const t = setTimeout(async () => {
//       setSearchLoading(true);
//       const res = await fetch(`https://media.upfrica.com/api/shops/${slug}/products/filter/?q=${encodeURIComponent(searchQuery)}`);
//       const data = res.ok ? await res.json() : { results: [] };
//       setSearchResults(data.results || []);
//       setSearchLoading(false);
//     }, 500);
//     return () => clearTimeout(t);
//   }, [searchQuery, slug]);

//   const displayProducts = filterProducts.length > 0 ? filterProducts : mainProducts;

//   const toggleSidebar = () => setIsSidebarOpen((v) => !v);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: shop?.name,
//         url: window.location.href,
//       }).catch(console.error);
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   if (mainError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
//         <p>Failed to load shop. Please try again later.</p>
//       </div>
//     );
//   }

//   //  ——— Handle Buy click: open popup & set product ———
//   // const handleBuyClick = (product) => {
//   //   setCurrentProduct(product);
//   //   setIsPopupOpen(true);
//   // };

//   // ——— Handle Buy ক্লিক করলেই related products ফেচ করা আর তারপর পপআপ খোলা ———
//   const handleBuyClick = async (product) => {
//     console.log('product', product)
//     setCurrentProduct(product);
//     setRelatedLoading(true);
//     try {
//       // product.slug অথবা product.seo_slug
//       const slugToFetch = product.slug || product.seo_slug;
//       const res = await fetch(
//         `https://media.upfrica.com/api/products/${slugToFetch}/related/`,
//         { cache: 'no-store' }
//       );
//       if (!res.ok) throw new Error(`Status ${res.status}`);
//       const data = await res.json();
//       console.log("data", data)
//       setRelatedProducts(data.results || []);
//       setRelatedError(null);
//     } catch (err) {
//       console.error('Failed to fetch related products:', err);
//       setRelatedError(err);
//       setRelatedProducts([]);
//     } finally {
//       setRelatedLoading(false);
//       setIsPopupOpen(true);
//     }
//   };




//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900" style={{ backgroundColor: shop?.bg_color || '#E8EAED' }}>
    

//       <>
//         {/* === HERO / BANNER === */}
//         <section className="relative">
//           {mainLoading || !shop ? (
//             <ShopProfileSkeleton />
//           ) : (
//             <ShopProfileCard shop={shop} user={user} setIsEditOpen={setIsEditOpen} />
//           )}
//         </section>

//         <ShopEditModal
//           isOpen={isEditOpen}
//           onClose={() => setIsEditOpen(false)}
//           shop={shop}
//           onSave={setShop}
//         />


//         {/* === NAVIGATION TABS + SHARE, CALL, CHAT === */}
//         <nav className="bg-white border-t border-b shadow-sm sticky top-0 z-30">
//           <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 md:px-6 py-3">
//             {/* Tabs */}
//             <ul className="flex flex-wrap gap-4 text-sm font-medium">
//               <li className={`cursor-pointer ${activeTab === 'products' ? 'text-violet-700 border-b-2 border-violet-700 pb-1' : 'hover:text-violet-700'}`} onClick={() => setActiveTab('products')}>
//                 Shop
//               </li>
//               <li className={`cursor-pointer ${activeTab === 'about' ? 'text-violet-700 border-b-2 border-violet-700 pb-1' : 'hover:text-violet-700'}`} onClick={() => setActiveTab('about')}>
//                 About
//               </li>
//               <li className={`cursor-pointer ${activeTab === 'reviews' ? 'text-violet-700 border-b-2 border-violet-700 pb-1' : 'hover:text-violet-700'}`} onClick={() => setActiveTab('reviews')}>
//                 Reviews
//               </li>
//             </ul>

//             {/* Buttons: Call / Chat / Share */}

//           </div>
//         </nav>

//         {/* === PAGE MAIN CONTENT === */}
//         <main className="mx-auto max-w-6xl gap-8 px-2 py-10 pb-32 md:grid md:grid-cols-[240px_1fr]">

//           {/* Desktop Sidebar (Filters) */}
//           {activeTab === 'products' && (
//             <aside className="hidden md:block space-y-6">
//               <h2 className="text-xl font-semibold">Filters</h2>

//               {/* Category Filter */}
//               <div className="p-5 bg-white border rounded-t-[5px] drop-shadow">
//                 <label className="block text-sm font-medium mb-1">Category</label>
//                 {categoriesLoading ? (
//                   <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
//                 ) : (
//                   <select
//                     value={selectedCategorySlug}
//                     onChange={(e) => {
//                       setSelectedCategorySlug(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="w-full rounded border px-3 py-2"
//                   >
//                     <option value="">All Categories</option>
//                     {shopCategories.map((c) => (
//                       <option key={c.id} value={c.slug}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>

//               {/* Condition Filter */}
//               <div className="p-5 bg-white border drop-shadow">
//                 <label className="block text-sm font-medium mb-1">Condition</label>
//                 {conditionsLoading ? (
//                   <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
//                 ) : (
//                   <select
//                     value={selectedConditionSlug}
//                     onChange={(e) => {
//                       setSelectedConditionSlug(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="w-full rounded border px-3 py-2"
//                   >
//                     <option value="">All Conditions</option>
//                     {shopConditions.map((c) => (
//                       <option key={c.id} value={c.slug}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>

//               {/* Sort */}
//               <div className="p-5 bg-white border drop-shadow">
//                 <label className="block text-sm font-medium mb-1">Sort By</label>
//                 <select
//                   value={sortOption}
//                   onChange={(e) => {
//                     setSortOption(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="w-full rounded border px-3 py-2"
//                 >
//                   <option value="">Sort by</option>
//                   <option value="price">Price: Low → High</option>
//                   <option value="-price">Price: High → Low</option>
//                 </select>
//               </div>

//               {/* Price Range */}
//               <PriceRange
//                 min={priceMin}
//                 max={priceMax}
//                 onChangeMin={(v) => {
//                   setPriceMin(v);
//                   setCurrentPage(1);
//                 }}
//                 onChangeMax={(v) => {
//                   setPriceMax(v);
//                   setCurrentPage(1);
//                 }}
//                 className="p-5 bg-white border drop-shadow"
//               />

//               {/* Static Ratings */}
//               <div className="p-5 bg-white border rounded-b-[5px] drop-shadow">
//                 <h2 className="mb-2 font-semibold">Ratings</h2>
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} className="text-yellow-400" />
//                   ))}
//                   <span className="ml-2 text-sm">4.5/5</span>
//                 </div>
//               </div>
//             </aside>
//           )}


//           {/* MOBILE SIDEBAR OVERLAY */}
//           {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />}

//           {/* MOBILE SIDEBAR */}
//           <div
//             ref={sidebarRef}
//             className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-white p-6 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//               } md:hidden`}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold">Filters</h2>
//               <button
//                 onClick={closeSidebar}
//                 className="inline-flex items-center rounded p-1 hover:bg-gray-100"
//               >
//                 <AiOutlineClose size={24} />
//               </button>
//             </div>

//             {/* replicate filter controls here... */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Category</label>
//               <select
//                 value={selectedCategorySlug}
//                 onChange={(e) => {
//                   setSelectedCategorySlug(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="">All Categories</option>
//                 {shopCategories.map((c) => (
//                   <option key={c.id} value={c.slug}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Condition</label>
//               <select
//                 value={selectedConditionSlug}
//                 onChange={(e) => {
//                   setSelectedConditionSlug(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="">All Conditions</option>
//                 {shopConditions.map((c) => (
//                   <option key={c.id} value={c.slug}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Sort By</label>
//               <select
//                 value={sortOption}
//                 onChange={(e) => {
//                   setSortOption(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="">Sort by</option>
//                 <option value="price">Price: Low → High</option>
//                 <option value="-price">Price: High → Low</option>
//               </select>
//             </div>

//             <PriceRange
//               min={priceMin}
//               max={priceMax}
//               onChangeMin={(v) => {
//                 setPriceMin(v);
//                 setCurrentPage(1);
//               }}
//               onChangeMax={(v) => {
//                 setPriceMax(v);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>

//           {/* Main Section */}
//           <section className="relative">
//             {activeTab === 'products' && (
//               <>
//                 {/* SEARCH BAR */}
//                 <div className="mb-6 relative">
//                   <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-700" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder={`Search products in ${shop?.name || 'this shop'}...`}
//                     className="w-full rounded-full border border-gray-700 px-10 py-2 focus:outline-none"
//                   />
//                   {searchQuery ? (
//                     <AiOutlineClose
//                       className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700"
//                       onClick={() => setSearchQuery('')}
//                     />
//                   ) : (
//                     <AiOutlineFilter
//                       className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700 md:hidden"
//                       onClick={toggleSidebar}
//                     />
//                   )}

//                   {searchQuery && (
//                     <div className="absolute left-0 right-0 z-20 mt-2 rounded bg-white shadow">
//                       {searchLoading
//                         ? [...Array(3)].map((_, i) => <SearchResultSkeleton key={i} />)
//                         : searchResults.slice(0, 5).map((p) => (
//                           <Link
//                             key={p.id}
//                             href={`/${p.seller_country}/${p.seo_slug}`}
//                             className="no-underline" // optional: remove underline
//                           >
//                             <div className="flex items-center gap-4 p-3 border-b last:border-0 hover:bg-gray-50">
//                               <img
//                                 src={p.product_images[0]}
//                                 alt={p.title}
//                                 className="h-12 w-12 rounded object-cover"
//                               />
//                               <div>
//                                 <p className="text-sm font-medium">{p.title}</p>
//                                 <p className="text-xs text-gray-500">
//                                   ₵{(p.price_cents / 100).toFixed(2)}
//                                 </p>
//                               </div>
//                             </div>
//                           </Link>
//                         ))}
//                     </div>
//                   )}             </div>
//                 {/* PRODUCT GRID */}
//                 {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">*/}
//                 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
//                   {(mainLoading || filterLoading) ? (
//                     [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
//                   ) : (
//                     displayProducts.map((p) => <ShopCard
//                       key={p.id}
//                       product={p}
//                       onBuy={() => handleBuyClick(p)}
//                     />)
//                   )}
//                 </div>

//                 {/* PAGINATION */}
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={setCurrentPage}
//                 />

//                 <ShopFAQSection shop={shop} />
//               </>
//             )}

//             {activeTab === 'about' && (
//               <div className="p-6 bg-white rounded-lg shadow">
//                 <h2 className="text-2xl font-bold mb-4">About {shop?.name}</h2>
//                 <p className="text-gray-700 text-sm">
//                   {/* Dummy About text */}
//                   We specialize in high-quality affordable products. Committed to excellent service and fast delivery.
//                 </p>
//               </div>
//             )}

//             {activeTab === 'reviews' && (
//               <div className="p-6 bg-white rounded-lg shadow">
//                 <h2 className="text-2xl font-bold mb-4">Reviews</h2>
//                 <div className="space-y-4">
//                   <div className="border p-4 rounded">
//                     <p className="text-gray-700">"Great products and fast delivery!"</p>
//                     <div className="flex mt-2 gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <FaStar key={i} className="text-yellow-400" />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </section>
//         </main>

//         {/* === MOBILE BOTTOM MENU === */}
//         {isMobile && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 shadow z-50">
//             <button onClick={toggleSidebar} className="flex flex-col items-center text-xs text-gray-700">
//               <AiOutlineFilter className="text-2xl" />
//               Menu
//             </button>
//             {shop?.user?.phone_number && (
//               <a href={`tel:${shop.user.phone_number}`} className="flex flex-col items-center text-xs text-gray-700">
//                 <FaPhoneAlt className="text-2xl" />
//                 Call
//               </a>
//             )}
//             <button onClick={() => setIsChatOpen(true)} className="flex flex-col items-center text-xs text-gray-700">
//               <FaCommentDots className="text-2xl" />
//               Chat
//             </button>
//           </div>
//         )}
//       </>


//       {/* === Direct Buy Popup === */}
//       {currentProduct && (
//         <DirectBuyPopup
//           product={currentProduct}
//           isVisible={isPopupOpen}
//           onClose={() => setIsPopupOpen(false)}
//           selectedAddressId={selectedAddressId}
//           isAddressLoading={isAddressLoading}
//           addresses={addresses}
//           relatedProducts={relatedProducts}
//           quantity={1}
//         />
//       )}



//     </div>
//   );
// }


'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import qs from 'query-string';

import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineFilter,
} from 'react-icons/ai';
import { FaStar, FaPhoneAlt, FaCommentDots } from 'react-icons/fa';

import ShopCard from '@/components/home/ProductList/ShopCard';
import ShopFAQSection from '@/components/ShopFAQSection';
import ProductCardSkeleton from './ProductCardSkeleton';
import SearchResultSkeleton from './SearchResultSkeleton';
import PriceRange from './PriceRange';
import ShopEditModal from './ShopEditModal';
import HeroSectionSkeleton from './HeroSectionSkeleton';
import ShopProfileCard from './ShopProfileCard';
import ShopProfileSkeleton from './ShopProfileSkeleton';
import DirectBuyPopup from '@/components/DirectBuyPopup';

const API_BASE = 'https://media.upfrica.com/api';
const PAGE_SIZE = 20;

// ———————————————————————————————
// Pagination component
// ———————————————————————————————
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleClick = (p) => {
    if (p >= 1 && p <= totalPages && p !== currentPage) {
      onPageChange(p);
    }
  };

  const pages = () => {
    if (isMobile) return totalPages <= 2 ? [1, ...(totalPages === 2 ? [2] : [])] : [1, 2, '…'];
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '…', totalPages];
    if (currentPage >= totalPages - 2) return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
  };

  return (
    <div className="mt-8 flex justify-center overflow-x-auto">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        <AiOutlineLeft className="mr-1" /> Prev
      </button>

      {pages().map((p, i) =>
        p === '…' ? (
          <span key={i} className="px-3 py-1 text-gray-500">…</span>
        ) : (
          <button
            key={i}
            onClick={() => handleClick(p)}
            className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${p === currentPage ? 'bg-violet-700 text-white font-semibold' : ''
              }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        Next <AiOutlineRight className="ml-1" />
      </button>
    </div>
  );
};

// ———————————————————————————————
// Main Shop Page Client Component
// ———————————————————————————————
export default function ShopPageClient({ slug }) {
  // Auth & router
  const { token, user } = useSelector((s) => s.auth);
  const router = useRouter();
  const currentPath = usePathname();

  // Shop meta
  const [shop, setShop] = useState(null);
  const [mainError, setMainError] = useState(null);

  // Products & pagination
  const [mainProducts, setMainProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [mainLoading, setMainLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [shopCategories, setShopCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [shopConditions, setShopConditions] = useState([]);
  const [conditionsLoading, setConditionsLoading] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedConditionId, setSelectedConditionId] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchDebounce = useRef();

  // Sidebar & edit
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Direct-buy popup
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState(null);

  // ———————————————————————————————
  // Fetch shop profile + unfiltered products
  // ———————————————————————————————
  const fetchMain = async () => {
    setMainLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shops/${slug}/products/?page=${currentPage}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setMainProducts(data.results || []);
      setShop(data.shop || null);
      setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      setMainError(null);
    } catch (err) {
      setMainError(err);
    } finally {
      setMainLoading(false);
    }
  };

  useEffect(() => {
    fetchMain();
  }, [slug, currentPage]);

  // ———————————————————————————————
  // Fetch categories & conditions (once)
  // ———————————————————————————————
  useEffect(() => {
    fetch(`${API_BASE}/shops/${slug}/categories/`)
      .then(r => r.json())
      .then((data) => setShopCategories(data))
      .finally(() => setCategoriesLoading(false));

    fetch(`${API_BASE}/shops/${slug}/conditions/`)
      .then(r => r.json())
      .then((data) => setShopConditions(data))
      .finally(() => setConditionsLoading(false));
  }, [slug]);

  // ———————————————————————————————
  // Build filter query-string
  // ———————————————————————————————
  const buildFilterQS = () => {
    const params = {};
    if (selectedCategoryId) params.category = selectedCategoryId;
    if (selectedConditionId) params.condition = selectedConditionId;
    if (priceMin !== 0) params.min_price = priceMin;
    if (priceMax !== 1000) params.max_price = priceMax;
    if (sortOption) params.ordering = sortOption;
    if (searchQuery.trim()) params.q = searchQuery.trim();
    params.page = currentPage;
    return qs.stringify(params);
  };

  // ———————————————————————————————
  // Fetch filtered products
  // ———————————————————————————————
  useEffect(() => {
    const noFilters =
      !selectedCategoryId &&
      !selectedConditionId &&
      priceMin === 0 &&
      priceMax === 1000 &&
      !sortOption &&
      !searchQuery.trim();

    if (noFilters) {
      setFilterProducts([]);
      return;
    }

    const ctrl = new AbortController();
    (async () => {
      setFilterLoading(true);
      try {
        const qs = buildFilterQS();
        const res = await fetch(
          `${API_BASE}/shops/${slug}/products/filter/?${qs}`,
          { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error('Filter failed');
        const data = await res.json();
        setFilterProducts(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setFilterLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [
    selectedCategoryId,
    selectedConditionId,
    priceMin,
    priceMax,
    sortOption,
    searchQuery,
    currentPage,
    slug,
  ]);

  // ———————————————————————————————
  // Debounced search dropdown
  // ———————————————————————————————
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    searchDebounce.current = setTimeout(async () => {
      // setSearchLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/shops/${slug}/products/filter/?q=${encodeURIComponent(searchQuery)}&page=1`
        );
        const data = res.ok ? await res.json() : { results: [] };
        // setSearchResults(data.results || []);
      } catch {
        setSearchResults([]);
      } finally {
        // setSearchLoading(false);
      }
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, slug]);

  // ———————————————————————————————
  // Handle buy → related products → popup
  // ———————————————————————————————
  const handleBuy = async (product) => {
    setCurrentProduct(product);
    setRelatedLoading(true);
    try {
      const slugToUse = product.slug || product.seo_slug;
      const res = await fetch(
        `${API_BASE}/products/${slugToUse}/related/`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const d = await res.json();
      setRelatedProducts(d.results || []);
      setRelatedError(null);
    } catch (err) {
      console.error(err);
      setRelatedProducts([]);
      setRelatedError(err);
    } finally {
      setRelatedLoading(false);
      setIsPopupOpen(true);
    }
  };

  // Decide which list to render
  const displayProducts = filterProducts.length ? filterProducts : mainProducts;

  // Sidebar toggles
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (mainError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <p>Failed to load shop. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ backgroundColor: shop?.bg_color || '#E8EAED' }}>
      {/* HERO */}
      <section className="relative flex justify-center items-center">
        {mainLoading || !shop ? (
          <HeroSectionSkeleton />
        ) : (
          <ShopProfileCard shop={shop} user={user} setIsEditOpen={setIsEditOpen} />
        )}
      </section>

      {/* EDIT MODAL */}
      <ShopEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        shop={shop}
        onSave={setShop}
      />

      {/* NAV TABS */}
      {/* ... you can drop in your existing tab nav here if needed ... */}

      <main className="mx-auto max-w-6xl gap-8 px-2 py-10 pb-32 md:grid md:grid-cols-[240px_1fr]">
        {/* DESKTOP FILTERS */}
        <aside className={`hidden md:block space-y-6 ${/* only on 'products' tab */''}`}>
          <h2 className="text-xl font-semibold">Filters</h2>

          {/* Category */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <label className="block text-sm font-medium mb-1">Category</label>
            {categoriesLoading ? (
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
            ) : (
              <select
                value={selectedCategoryId}
                onChange={(e) => { setSelectedCategoryId(e.target.value); setCurrentPage(1); }}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">All Categories</option>
                {shopCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Condition */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <label className="block text-sm font-medium mb-1">Condition</label>
            {conditionsLoading ? (
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
            ) : (
              <select
                value={selectedConditionId}
                onChange={(e) => { setSelectedConditionId(e.target.value); setCurrentPage(1); }}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">All Conditions</option>
                {shopConditions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Sort */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Sort by</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
            </select>
          </div>

          {/* Price Range */}
          <PriceRange
            min={priceMin}
            max={priceMax}
            onChangeMin={(v) => { setPriceMin(v); setCurrentPage(1); }}
            onChangeMax={(v) => { setPriceMax(v); setCurrentPage(1); }}
            className="p-5 bg-white border rounded drop-shadow"
          />

          {/* Ratings (static example) */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <h2 className="mb-2 font-semibold">Ratings</h2>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
              <span className="ml-2 text-sm">4.5/5</span>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-white p-6 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:hidden`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={closeSidebar} className="p-1 hover:bg-gray-100 rounded">
              <AiOutlineClose size={24} />
            </button>
          </div>
          {/* replicate the same filters here */}
          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => { setSelectedCategoryId(e.target.value); setCurrentPage(1); }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">All Categories</option>
              {shopCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* Condition */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              value={selectedConditionId}
              onChange={(e) => { setSelectedConditionId(e.target.value); setCurrentPage(1); }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">All Conditions</option>
              {shopConditions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* Sort */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Sort by</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
            </select>
          </div>
          {/* Price Range */}
          <PriceRange
            min={priceMin}
            max={priceMax}
            onChangeMin={(v) => { setPriceMin(v); setCurrentPage(1); }}
            onChangeMax={(v) => { setPriceMax(v); setCurrentPage(1); }}
          />
        </div>

        {/* MAIN CONTENT */}
        <section className="relative">
          {/* SEARCH BAR */}
          <div className="mb-6 relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Search products in ${shop?.name || 'this shop'}...`}
              className="w-full rounded-full border border-gray-700 px-10 py-2 focus:outline-none"
            />
            {searchQuery ? (
              <AiOutlineClose
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700"
                onClick={() => setSearchQuery('')}
              />
            ) : (
              <AiOutlineFilter
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700 md:hidden"
                onClick={toggleSidebar}
              />
            )}

            {/* live dropdown */}
            {searchQuery && (
              <div className="absolute left-0 right-0 z-20 mt-2 rounded bg-white shadow">
                {searchLoading
                  ? [...Array(3)].map((_, i) => <SearchResultSkeleton key={i} />)
                  : searchResults.slice(0, 5).map((p) => (
                    <Link
                      key={p.id}
                      href={`/${p.seller_country}/${p.seo_slug}`}
                      className="no-underline"
                    >
                      <div className="flex items-center gap-4 p-3 border-b last:border-0 hover:bg-gray-50">
                        <img
                          src={p.product_images[0]}
                          alt={p.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">
                            ₵{(p.price_cents / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {(mainLoading || filterLoading) ? (
              [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              displayProducts.map((p) => (
                <ShopCard key={p.id} product={p} onBuy={() => handleBuy(p)} />
              ))
            )}
          </div>

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* FAQ */}
          <ShopFAQSection shop={shop} />
        </section>
      </main>

      {/* MOBILE BOTTOM MENU */}
      {typeof window !== 'undefined' && window.innerWidth <= 768 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 shadow z-50">
          <button onClick={toggleSidebar} className="flex flex-col items-center text-xs text-gray-700">
            <AiOutlineFilter className="text-2xl" />
            Menu
          </button>
          {shop?.user?.phone_number && (
            <a
              href={`tel:${shop.user.phone_number}`}
              className="flex flex-col items-center text-xs text-gray-700"
            >
              <FaPhoneAlt className="text-2xl" />
              Call
            </a>
          )}
          <button
            onClick={() => {/* your chat open logic */ }}
            className="flex flex-col items-center text-xs text-gray-700"
          >
            <FaCommentDots className="text-2xl" />
            Chat
          </button>
        </div>
      )}

      {/* DIRECT BUY POPUP */}
      {currentProduct && (
        <DirectBuyPopup
          product={currentProduct}
          isVisible={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          relatedProducts={relatedProducts}
          isLoading={relatedLoading}
          error={relatedError}
        // …pass any other props you need…
        />
      )}
    </div>
  );
}

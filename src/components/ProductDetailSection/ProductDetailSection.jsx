

// 'use client'

// import React, { useEffect, useState, useCallback } from "react";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter, usePathname } from "next/navigation";
// import { MdArrowRightAlt } from "react-icons/md";
// import {
//     FaMinus,
//     FaPlus,
//     FaRegHeart,
//     FaEdit,
//     FaStar,
//     FaStarHalfAlt,
//     FaRegStar,
// } from "react-icons/fa";

// import MultiBuySection from "../MultiBuySection";
// import BasketModal from "../BasketModal";
// import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
// import DescriptionAndReviews from "../DescriptionAndReviews";
// import RecentlyViewed from "../RecentlyViewed";
// import ProductSlider from "./ProductSlider";
// import DirectBuyPopup from "../DirectBuyPopup";

// import { convertPrice } from "@/app/utils/utils";
// import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
// import { selectSelectedCountry } from "@/app/store/slices/countrySlice";
// import {
//     fetchReviewsStart,
//     fetchReviewsSuccess,
//     fetchReviewsFailure,
// } from "@/app/store/slices/reviewsSlice";

// const Breadcrumbs = ({ categoryTree, title }) => {
//     const flattenCategoryChain = (node) => {
//         const chain = [];
//         let current = node;
//         while (current) {
//             chain.push(current);
//             if (current.children && current.children.length) {
//                 current = current.children[0];
//             } else {
//                 break;
//             }
//         }
//         return chain;
//     };

//     const categoryChain = categoryTree ? flattenCategoryChain(categoryTree) : [];

//     return (
//         <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin text-sm text-gray-500 scrollbar-hide">
//             <Link href="/"><span className="text-blue-600 hover:underline">Upfrica</span></Link>
//             {categoryChain.map((cat) => (
//                 <React.Fragment key={cat.id}>
//                     <span className="text-blue-600">&gt;</span>
//                     <Link href={`/categories/${cat.slug}`}>
//                         <span className="text-blue-600 hover:underline">{cat.name}</span>
//                     </Link>
//                 </React.Fragment>
//             ))}
//             <span className="text-blue-600">&gt;</span>
//             <span className="font-semibold text-gray-700 truncate">{title}</span>
//         </div>
//     );
// };

// export default function ProductDetailSection({ product, relatedProducts }) {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const currentPath = usePathname();

//     // Auth, basket, currency
//     const { token, user: currentUser } = useSelector((s) => s.auth);
//     const basket = useSelector((s) => s.basket.items) || [];
//     const exchangeRates = useSelector((s) => s.exchangeRates.rates);
//     const selectedCountry = useSelector(selectSelectedCountry);
//     const symbol = selectedCountry?.symbol ?? "₵";
//     const currencyCode = selectedCountry?.code ?? "GHS";

//     // Reviews slice
//     const {
//         summary: { average_rating, review_count, rating_percent },
//         loading: reviewsLoading,
//         error: reviewsError,
//         reviews: reviewsList,
//     } = useSelector((s) => s.reviews);

//     // Fetch reviews on mount / when product changes
//     useEffect(() => {
//         if (!product?.id) return;
//         dispatch(fetchReviewsStart());
//         fetch(`/api/products/${product.id}/reviews`)
//             .then((res) => res.json())
//             .then((data) => {
//                 dispatch(
//                     fetchReviewsSuccess({
//                         results: data.reviews,
//                         average_rating: data.average_rating,
//                         review_count: data.review_count,
//                         rating_percent: data.rating_percent,
//                     })
//                 );
//             })
//             .catch((err) => dispatch(fetchReviewsFailure(err.toString())));
//     }, [dispatch, product?.id]);

//     // Helpers
//     const renderStars = (rating) => {
//         const full = Math.floor(rating);
//         const half = rating - full >= 0.5;
//         const empty = 5 - full - (half ? 1 : 0);
//         return (
//             <>
//                 {[...Array(full)].map((_, i) => <FaStar key={`full${i}`} />)}
//                 {half && <FaStarHalfAlt />}
//                 {[...Array(empty)].map((_, i) => <FaRegStar key={`empty${i}`} />)}
//             </>
//         );
//     };

//     // Multi-buy tier
//     const [selectedMultiBuyTier, setSelectedMultiBuyTier] = useState(null);
//     const handleTierSelect = useCallback((tier) => {
//         setSelectedMultiBuyTier((prev) =>
//             prev?.minQuantity === tier.minQuantity ? prev : tier
//         );
//     }, []);

//     // Quantity & modals
//     const [loading, setLoading] = useState(false);
//     const [quantity, setQuantity] = useState(1);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);

//     // Destructure product props
//     const {
//         id,
//         title,
//         description,
//         price_cents,
//         sale_price_cents,
//         price_currency,
//         sale_end_date,
//         product_video,
//         product_images,
//         condition,
//         category,
//         shop,
//         user,
//         variants,
//     } = product || {};

//     // Variant defaults
//     const [selectedVariants, setSelectedVariants] = useState({});
//     useEffect(() => {
//         if (variants?.length) {
//             const defaults = {};
//             variants.forEach((v) => {
//                 if (v.values?.length) defaults[v.id] = v.values[0];
//             });
//             setSelectedVariants(defaults);
//         }
//     }, [variants]);

//     // Color dispatch for slider
//     useEffect(() => {
//         const colorVariant = variants?.find((v) =>
//             v.label.toLowerCase().includes("color")
//         );
//         if (colorVariant && selectedVariants[colorVariant.id]) {
//             window.dispatchEvent(
//                 new CustomEvent("updateSelectedColor", {
//                     detail: selectedVariants[colorVariant.id].value.toLowerCase(),
//                 })
//             );
//         }
//     }, [selectedVariants, variants]);

//     // SKU & add-ons
//     const sku =
//         "SKU-" +
//         Object.values(selectedVariants)
//             .map((opt) => opt.value.replace(/\s+/g, "-").toUpperCase())
//             .join("-");
//     const totalAdditionalCents = Object.values(selectedVariants).reduce(
//         (sum, opt) => sum + (opt.additional_price_cents || 0),
//         0
//     );

//     // Sale logic & pricing
//     const saleEnd = sale_end_date ? new Date(sale_end_date) : null;
//     const now = new Date();
//     const saleActive = saleEnd && saleEnd > now && sale_price_cents > 0;
//     const baseCents = saleActive ? sale_price_cents : price_cents;
//     const activePriceCents = baseCents + totalAdditionalCents;
//     const originalPriceCents = price_cents + totalAdditionalCents;

//     const activePrice = convertPrice(
//         activePriceCents / 100,
//         price_currency,
//         currencyCode,
//         exchangeRates
//     ).toFixed(2);
//     const originalPrice = saleActive
//         ? convertPrice(
//             originalPriceCents / 100,
//             price_currency,
//             currencyCode,
//             exchangeRates
//         ).toFixed(2)
//         : null;

//     // Countdown
//     const [timeRemaining, setTimeRemaining] = useState({});
//     useEffect(() => {
//         if (!sale_end_date) return;
//         const end = new Date(sale_end_date);
//         const tick = () => {
//             const diff = end - new Date();
//             setTimeRemaining({
//                 days: Math.floor(diff / 86400000),
//                 hours: Math.floor((diff % 86400000) / 3600000),
//                 minutes: Math.floor((diff % 3600000) / 60000),
//                 seconds: Math.floor((diff % 60000) / 1000),
//             });
//         };
//         tick();
//         const iv = setInterval(tick, 1000);
//         return () => clearInterval(iv);
//     }, [sale_end_date]);

//     // Media items
//     const mediaItems = product_video
//         ? [
//             { type: "video", src: product_video },
//             ...product_images.map((src) => ({ type: "image", src })),
//         ]
//         : product_images;

//     // Handlers
//     const handleDirectBuyNow = () => {
//         if (!token) {
//             router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
//             return;
//         }
//         setIsDirectBuyPopupVisible(true);
//     };

//     const handleAddToWatchlist = async () => {
//         if (!token) {
//             router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
//             return;
//         }
//         setLoading(true);
//         try {
//             await fetch("https://media.upfrica.com/api/wishlist/", {
//                 method: "POST",
//                 headers: {
//                     Authorization: "Token " + token,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ product_id: id, note: "" }),
//             });
//         } catch (e) {
//             console.error(e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddToBasket = () => {
//         dispatch(
//             addToBasket({
//                 id,
//                 title,
//                 price_cents: activePriceCents,
//                 quantity: selectedMultiBuyTier
//                     ? selectedMultiBuyTier.minQuantity
//                     : quantity,
//                 image: product_images,
//                 variants: selectedVariants,
//                 sku,
//             })
//         );
//         setIsModalVisible(true);
//     };
//     const handleCloseModal = () => setIsModalVisible(false);
//     const handleQuantityChange = (pid, q) =>
//         dispatch(updateQuantity({ id: pid, quantity: q }));
//     const handleRemoveProduct = (pid) => dispatch(removeFromBasket(pid));

//     return (
//         <section className="pt-6 md:pt-8 lg:pt-10">
//             <RecentlyViewed product={product} />

//             <div data-sticky-container>
//                 <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
//                     {/* LEFT */}
//                     <div className="order-1 xl:col-span-7">
//                         <Breadcrumbs categoryTree={category?.category_tree} title={title} />
//                         <section className="mt-2">
//                             <ProductSlider mediaItems={mediaItems} />
//                         </section>

//                         {/* MOBILE CTA */}
//                         <section className="block xl:hidden mt-5">
//                             <Link
//                                 href={`/products/edit/${product?.slug}`}
//                                 className="flex items-center gap-2"
//                             >
//                                 <FaEdit className="h-4 w-4 text-violet-700" />
//                                 <span className="text-violet-700 hover:underline">Edit</span>
//                             </Link>
//                             <div className="bg-white p-4 space-y-4">
//                                 <h1 className="heading-lg text-base md:text-lg lg:text-xl font-bold text-gray-800">
//                                     {title}
//                                 </h1>
//                                 {shop && (
//                                     <div className="text-sm text-gray-500">
//                                         <Link href={`/shops/${shop.slug}`}>
//                                             <b>{product?.secondary_data?.sold_count || 'No'} sold</b> — Visit{" "}
//                                             <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra,
//                                             GH
//                                         </Link>
//                                     </div>
//                                 )}

//                                 {/* Price */}
//                                 <div>
//                                     {saleActive ? (
//                                         <div className="flex items-baseline space-x-2">
//                                             <span className="text-2xl font-bold text-green-700">
//                                                 {symbol}
//                                                 {activePrice}
//                                             </span>
//                                             <del className="text-gray-400">
//                                                 {symbol}
//                                                 {originalPrice}
//                                             </del>
//                                         </div>
//                                     ) : (
//                                         <span className="text-2xl font-bold text-green-700">
//                                             {symbol}
//                                             {activePrice}
//                                         </span>
//                                     )}
//                                     {saleActive && (
//                                         <p className="text-sm text-red-700 font-medium mt-1">
//                                             Sale ends in{" "}
//                                             {timeRemaining.days > 0
//                                                 ? `${timeRemaining.days}d `
//                                                 : ""}
//                                             {String(timeRemaining.hours).padStart(2, "0")}:
//                                             {String(timeRemaining.minutes).padStart(2, "0")}:
//                                             {String(timeRemaining.seconds).padStart(2, "0")}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <MultiBuySection
//                                     product={product}
//                                     onTierSelect={handleTierSelect}
//                                     selectedTier={selectedMultiBuyTier}
//                                 />

//                                 {/* Variants */}
//                                 <div className="space-y-4 my-4">
//                                     {variants?.map((variant) =>
//                                         variant.values?.length ? (
//                                             <div key={variant.id}>
//                                                 <p className="text-sm font-medium text-gray-700 mb-1">
//                                                     {variant.label}
//                                                 </p>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {variant.values.map((val) => (
//                                                         <button
//                                                             key={val.id}
//                                                             onClick={() =>
//                                                                 setSelectedVariants((prev) => ({
//                                                                     ...prev,
//                                                                     [variant.id]: val,
//                                                                 }))
//                                                             }
//                                                             className={`px-4 ${val.additional_price_cents === 0 && "py-2"
//                                                                 } border rounded-full text-sm ${selectedVariants[variant.id]?.id === val.id
//                                                                     ? "border-black font-semibold"
//                                                                     : "border-gray-300 text-gray-700"
//                                                                 }`}
//                                                         >
//                                                             {val.value}
//                                                             {val.additional_price_cents > 0 && (
//                                                                 <div className="text-gray-900 text-[10px]">
//                                                                     +{symbol}
//                                                                     {convertPrice(
//                                                                         val.additional_price_cents / 100,
//                                                                         price_currency,
//                                                                         currencyCode,
//                                                                         exchangeRates
//                                                                     ).toFixed(2)}
//                                                                 </div>
//                                                             )}
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ) : null
//                                     )}
//                                 </div>

//                                 <div className="grid gap-2">
//                                     <button
//                                         className="btn-base btn-primary"
//                                         onClick={handleDirectBuyNow}
//                                     >
//                                         Buy Now
//                                     </button>
//                                     <button
//                                         className="btn-base btn-outline"
//                                         onClick={handleAddToBasket}
//                                     >
//                                         Add to Basket
//                                     </button>
//                                     <button className="btn-base btn-outline">
//                                         Buy Now Pay Later (BNPL)
//                                     </button>
//                                     <button
//                                         className="btn-base btn-outline flex items-center justify-center gap-2"
//                                         onClick={handleAddToWatchlist}
//                                         disabled={loading}
//                                     >
//                                         <FaRegHeart />
//                                         Add to Watchlist
//                                     </button>
//                                 </div>

//                                 <PaymentDeliveryReturns
//                                     secondaryData={product?.secondary_data}
//                                     dispatchTime={product?.dispatch_time_in_days}
//                                     seller_payment_terms={product?.seller_payment_terms}
//                                 />
//                             </div>
//                         </section>

//                         <DescriptionAndReviews
//                             details={description}
//                             condition={condition}
//                             user={user}
//                             shop={shop}
//                             product={product}
//                             reviews={reviewsList}
//                             loading={reviewsLoading}
//                             error={reviewsError}
//                         />
//                     </div>

//                     {/* RIGHT SIDEBAR */}
//                     <aside className="order-2 hidden xl:block xl:col-span-5">
//                         <div className="sticky top-0 p-5 space-y-4">
//                             {(currentUser?.username === user?.username || currentUser?.admin) && (
//                                 <Link
//                                     href={`/products/edit/${product?.slug}`}
//                                     className="flex items-center gap-2"
//                                 >
//                                     <FaEdit className="h-4 w-4 text-violet-700" />
//                                     <span className="text-violet-700 hover:underline">Edit</span>
//                                 </Link>
//                             )}

//                             <h1 className="heading-lg text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
//                                 {title}
//                             </h1>
//                             {shop && (
//                                 <div className="text-sm text-gray-500">
//                                     <Link href={`/shops/${shop.slug}`}>
//                                         <b>{product?.secondary_data?.sold_count || 'No'} sold</b> — Visit{" "}
//                                         <b className="text-[#8710D8]">{shop.name}</b> — Accra, GH
//                                     </Link>
//                                 </div>
//                             )}

//                             {/* ←— REVIEW SUMMARY */}
//                             <div className="flex items-center text-sm text-yellow-400 gap-2">
                                

//                                 {review_count > 0 ? (
//                                     <>
                                        
//                                         <span>{average_rating.toFixed(1)}</span>
//                                         <span className="flex">{renderStars(average_rating)}</span>
//                                         <button
//                                             className="underline text-blue-600"
//                                             onClick={() => {
//                                                 /* scroll to reviews list */
//                                             }}
//                                         >
//                                             {review_count} Reviews
//                                         </button>
//                                     </>
//                                 ) : (
//                                     /* no reviews fallback */
//                                         <span className="text-yellow-400"></span>
//                                 )}

//                                 <span className="text-green-600">✅ Verified Seller</span>
//                             </div>

//                             {/* Variants for desktop */}
//                             <div className="space-y-4 my-4">
//                                 {(currentUser?.username === user?.username || currentUser?.admin) && (
//                                     <Link
//                                         href={`/products/edit/variants/${product?.id}`}
//                                         className="flex items-center gap-2"
//                                     >
//                                         <FaEdit className="h-4 w-4 text-violet-700" />
//                                         <span className="text-violet-700 hover:underline">
//                                             Edit Variants
//                                         </span>
//                                     </Link>
//                                 )}
//                                 {variants?.length > 0 && (
//                                     <>
//                                         <hr className="my-3 border-gray-200" />
//                                         {variants.map((variant) => (
//                                             <div key={variant.id}>
//                                                 <div className="flex items-center justify-between">
//                                                     <p className="text-sm font-medium text-gray-700 mb-1">
//                                                         {variant.label}
//                                                     </p>
//                                                     <span className="text-sm text-gray-400">{sku}</span>
//                                                 </div>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {variant.values.map((val) => {
//                                                         const isSel =
//                                                             selectedVariants[variant.id]?.id === val.id;
//                                                         return (
//                                                             <button
//                                                                 key={val.id}
//                                                                 onClick={() =>
//                                                                     setSelectedVariants((prev) => ({
//                                                                         ...prev,
//                                                                         [variant.id]: val,
//                                                                     }))
//                                                                 }
//                                                                 className={`px-4 ${val.additional_price_cents == 0 && "py-2"
//                                                                     } border rounded-full text-sm ${isSel
//                                                                         ? "border-black font-semibold"
//                                                                         : "border-gray-300 text-gray-700"
//                                                                     }`}
//                                                             >
//                                                                 {val.value}
//                                                                 {val.additional_price_cents > 0 && (
//                                                                     <div className="text-gray-900 text-[10px]">
//                                                                         (+
//                                                                         {symbol}
//                                                                         {convertPrice(
//                                                                             val.additional_price_cents / 100,
//                                                                             price_currency,
//                                                                             currencyCode,
//                                                                             exchangeRates
//                                                                         ).toFixed(2)}
//                                                                         )
//                                                                     </div>
//                                                                 )}
//                                                             </button>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </>
//                                 )}
//                             </div>
//                             <hr className="my-3 border-gray-200" />

//                             {/* Price & countdown */}
//                             <div>
//                                 {saleActive ? (
//                                     <div className="flex items-baseline space-x-2">
//                                         <span className="text-3xl font-bold text-green-700">
//                                             {symbol}
//                                             {activePrice}
//                                         </span>
//                                         <del className="text-gray-400 text-sm">
//                                             {symbol}
//                                             {originalPrice}
//                                         </del>
//                                     </div>
//                                 ) : (
//                                     <span className="text-3xl font-bold text-green-700">
//                                         {symbol}
//                                         {activePrice}
//                                     </span>
//                                 )}
//                             </div>
//                             {saleActive && (
//                                 <div className="text-sm text-red-700 font-medium mt-1">
//                                     Sale ends in{" "}
//                                     {timeRemaining.days > 0
//                                         ? `${timeRemaining.days}d `
//                                         : ""}
//                                     {String(timeRemaining.hours).padStart(2, "0")}:
//                                     {String(timeRemaining.minutes).padStart(2, "0")}:
//                                     {String(timeRemaining.seconds).padStart(2, "0")}
//                                 </div>
//                             )}

//                             {/* Quantity */}
//                             <div className="flex items-center gap-4 mb-6">
//                                 <span className="text-sm font-medium text-gray-800">
//                                     In stock
//                                 </span>
//                                 <div className="flex items-center rounded-md border border-gray-300 overflow-hidden w-fit">
//                                     <button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black"
//                                     >
//                                         –
//                                     </button>
//                                     <div className="w-12 h-10 flex items-center justify-center border-x text-lg font-medium">
//                                         {quantity}
//                                     </div>
//                                     <button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             </div>

//                             <MultiBuySection
//                                 product={product}
//                                 onTierSelect={handleTierSelect}
//                                 selectedTier={selectedMultiBuyTier}
//                             />

//                             <div className="mt-4 space-y-2">
//                                 <button
//                                     className="btn-base btn-primary w-full"
//                                     onClick={handleDirectBuyNow}
//                                 >
//                                     Buy Now
//                                 </button>
//                                 <button
//                                     className="btn-base btn-outline w-full"
//                                     onClick={handleAddToBasket}
//                                 >
//                                     Add to Basket
//                                 </button>
//                                 <button
//                                     className="btn-base btn-outline w-full flex items-center justify-center gap-2"
//                                     onClick={handleAddToWatchlist}
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <div className="flex space-x-2 justify-center items-center h-6">
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
//                                         </div>
//                                     ) : (
//                                         <>
//                                             <FaRegHeart />
//                                             <span>Add to Watchlist</span>
//                                         </>
//                                     )}
//                                 </button>
//                             </div>

//                             <PaymentDeliveryReturns
//                                 secondaryData={product?.secondary_data}
//                                 dispatchTime={product?.dispatch_time_in_days}
//                                 seller_payment_terms={product?.seller_payment_terms}
//                             />
//                         </div>
//                     </aside>

//                     {/* Basket Modal */}
//                     <BasketModal
//                         isModalVisible={isModalVisible}
//                         handleCloseModal={handleCloseModal}
//                         basket={basket}
//                         saleActive={saleActive}
//                         activePrice={activePrice}
//                         quantity={quantity}
//                         handleQuantityChange={handleQuantityChange}
//                         handleRemoveProduct={handleRemoveProduct}
//                     />
//                 </div>
//             </div>

//             {/* Direct Buy Popup */}
//             {isDirectBuyPopupVisible && (
//                 <DirectBuyPopup
//                     relatedProducts={relatedProducts}
//                     quantity={quantity}
//                     product={product}
//                     isVisible={isDirectBuyPopupVisible}
//                     onClose={() => setIsDirectBuyPopupVisible(false)}
//                 />
//             )}
//         </section>
//     );
// }



'use client'

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
    FaMinus,
    FaPlus,
    FaRegHeart,
    FaHeart,
    FaEdit,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
} from "react-icons/fa";

import MultiBuySection from "../MultiBuySection";
import BasketModal from "../BasketModal";
import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
import DescriptionAndReviews from "../DescriptionAndReviews";
import RecentlyViewed from "../RecentlyViewed";
import ProductSlider from "./ProductSlider";
import DirectBuyPopup from "../DirectBuyPopup";

import { convertPrice } from "@/app/utils/utils";
import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
import { selectSelectedCountry } from "@/app/store/slices/countrySlice";
import {
    fetchReviewsStart,
    fetchReviewsSuccess,
    fetchReviewsFailure,
} from "@/app/store/slices/reviewsSlice";

const Breadcrumbs = ({ categoryTree, title }) => {
    const flattenCategoryChain = (node) => {
        const chain = [];
        let current = node;
        while (current) {
            chain.push(current);
            if (current.children && current.children.length) {
                current = current.children[0];
            } else {
                break;
            }
        }
        return chain;
    };

    const categoryChain = categoryTree ? flattenCategoryChain(categoryTree) : [];

    return (
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin text-sm text-gray-500 scrollbar-hide">
            <Link href="/"><span className="text-blue-600 hover:underline">Upfrica</span></Link>
            {categoryChain.map((cat) => (
                <React.Fragment key={cat.id}>
                    <span className="text-blue-600">&gt;</span>
                    <Link href={`/categories/${cat.slug}`}>
                        <span className="text-blue-600 hover:underline">{cat.name}</span>
                    </Link>
                </React.Fragment>
            ))}
            <span className="text-blue-600">&gt;</span>
            <span className="font-semibold text-gray-700 truncate">{title}</span>
        </div>
    );
};

export default function ProductDetailSection({ product, relatedProducts }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const currentPath = usePathname();

    // Auth, basket, currency
    const { token, user: currentUser } = useSelector((s) => s.auth);
    const basket = useSelector((s) => s.basket.items) || [];
    const exchangeRates = useSelector((s) => s.exchangeRates.rates);
    const selectedCountry = useSelector(selectSelectedCountry);
    const symbol = selectedCountry?.symbol ?? "₵";
    const currencyCode = selectedCountry?.code ?? "GHS";

    // Reviews slice
    const {
        summary: { average_rating, review_count, rating_percent },
        loading: reviewsLoading,
        error: reviewsError,
        reviews: reviewsList,
    } = useSelector((s) => s.reviews);

    // Fetch reviews on mount / when product changes
    useEffect(() => {
        if (!product?.id) return;
        dispatch(fetchReviewsStart());
        fetch(`/api/products/${product.id}/reviews`)
            .then((res) => res.json())
            .then((data) => {
                dispatch(
                    fetchReviewsSuccess({
                        results: data.reviews,
                        average_rating: data.average_rating,
                        review_count: data.review_count,
                        rating_percent: data.rating_percent,
                    })
                );
            })
            .catch((err) => dispatch(fetchReviewsFailure(err.toString())));
    }, [dispatch, product?.id]);

    // Helpers
    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);
        return (
            <>
                {[...Array(full)].map((_, i) => <FaStar key={`full${i}`} />)}
                {half && <FaStarHalfAlt />}
                {[...Array(empty)].map((_, i) => <FaRegStar key={`empty${i}`} />)}
            </>
        );
    };

    // Multi-buy tier
    const [selectedMultiBuyTier, setSelectedMultiBuyTier] = useState(null);
    const handleTierSelect = useCallback((tier) => {
        setSelectedMultiBuyTier((prev) =>
            prev?.minQuantity === tier.minQuantity ? prev : tier
        );
    }, []);

    // Quantity & modals
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);

    // Wishlist state
    const [isWishlisted, setIsWishlisted] = useState(false);

    const { id, title, description, price_cents, sale_price_cents, price_currency, sale_end_date,
        product_video, product_images, condition, category, shop, user, variants } = product || {};

    // Initial fetch of wishlist status
    useEffect(() => {
        if (!token || !id) return;
        const url = `https://media.upfrica.com/api/wishlist/${id}/`;
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Token " + token,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setIsWishlisted(res.ok);
            })
            .catch((err) => {
                console.error("Error checking wishlist status:", err);
            });
    }, [token, id]);

    // Toggle wishlist
    const handleToggleWishlist = async () => {
        if (!token) {
            router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
            return;
        }
        setLoading(true);
        const url = `https://media.upfrica.com/api/wishlist/${id}/`;
        try {
            if (isWishlisted) {
                // Remove from wishlist
                await fetch(url, {
                    method: "DELETE",
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                });
                setIsWishlisted(false);
            } else {
                // Add to wishlist
                await fetch("https://media.upfrica.com/api/wishlist/", {
                    method: "POST",
                    headers: {
                        Authorization: "Token " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ product_id: id, note: "" }),
                });
                setIsWishlisted(true);
            }
        } catch (e) {
            console.error("Wishlist toggle error:", e);
        } finally {
            setLoading(false);
        }
    };

    // Variant defaults
    const [selectedVariants, setSelectedVariants] = useState({});
    useEffect(() => {
        if (variants?.length) {
            const defaults = {};
            variants.forEach((v) => {
                if (v.values?.length) defaults[v.id] = v.values[0];
            });
            setSelectedVariants(defaults);
        }
    }, [variants]);

    // Color dispatch for slider
    useEffect(() => {
        const colorVariant = variants?.find((v) =>
            v.label.toLowerCase().includes("color")
        );
        if (colorVariant && selectedVariants[colorVariant.id]) {
            window.dispatchEvent(
                new CustomEvent("updateSelectedColor", {
                    detail: selectedVariants[colorVariant.id].value.toLowerCase(),
                })
            );
        }
    }, [selectedVariants, variants]);

    // SKU & add-ons
    const sku =
        "SKU-" +
        Object.values(selectedVariants)
            .map((opt) => opt.value.replace(/\s+/g, "-").toUpperCase())
            .join("-");
    const totalAdditionalCents = Object.values(selectedVariants).reduce(
        (sum, opt) => sum + (opt.additional_price_cents || 0),
        0
    );

    // Sale logic & pricing
    const saleEnd = sale_end_date ? new Date(sale_end_date) : null;
    const now = new Date();
    const saleActive = saleEnd && saleEnd > now && sale_price_cents > 0;
    const baseCents = saleActive ? sale_price_cents : price_cents;
    const activePriceCents = baseCents + totalAdditionalCents;
    const originalPriceCents = price_cents + totalAdditionalCents;

    const activePrice = convertPrice(
        activePriceCents / 100,
        price_currency,
        currencyCode,
        exchangeRates
    ).toFixed(2);
    const originalPrice = saleActive
        ? convertPrice(
            originalPriceCents / 100,
            price_currency,
            currencyCode,
            exchangeRates
        ).toFixed(2)
        : null;

    // Countdown
    const [timeRemaining, setTimeRemaining] = useState({});
    useEffect(() => {
        if (!sale_end_date) return;
        const end = new Date(sale_end_date);
        const tick = () => {
            const diff = end - new Date();
            setTimeRemaining({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, [sale_end_date]);

    // Media items
    const mediaItems = product_video
        ? [
            { type: "video", src: product_video },
            ...product_images.map((src) => ({ type: "image", src })),
        ]
        : product_images;

    // Handlers
    const handleDirectBuyNow = () => {
        if (!token) {
            router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
            return;
        }
        setIsDirectBuyPopupVisible(true);
    };

    const handleAddToBasket = () => {
        dispatch(
            addToBasket({
                id,
                title,
                price_cents: activePriceCents,
                quantity: selectedMultiBuyTier
                    ? selectedMultiBuyTier.minQuantity
                    : quantity,
                image: product_images,
                variants: selectedVariants,
                sku,
            })
        );
        setIsModalVisible(true);
    };
    const handleCloseModal = () => setIsModalVisible(false);
    const handleQuantityChange = (pid, q) =>
        dispatch(updateQuantity({ id: pid, quantity: q }));
    const handleRemoveProduct = (pid) => dispatch(removeFromBasket(pid));

    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
            <RecentlyViewed product={product} />

            <div data-sticky-container>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* LEFT */}
                    <div className="order-1 xl:col-span-7">
                        <Breadcrumbs categoryTree={category?.category_tree} title={title} />
                        <section className="mt-2">
                            <ProductSlider mediaItems={mediaItems} />
                        </section>

                        {/* MOBILE CTA */}
                        <section className="block xl:hidden mt-5">
                            <Link
                                href={`/products/edit/${product?.slug}`}
                                className="flex items-center gap-2"
                            >
                                <FaEdit className="h-4 w-4 text-violet-700" />
                                <span className="text-violet-700 hover:underline">Edit</span>
                            </Link>
                            <div className="bg-white p-4 space-y-4">
                                <h1 className="heading-lg text-base md:text-lg lg:text-xl font-bold text-gray-800">
                                    {title}
                                </h1>
                                {shop && (
                                    <div className="text-sm text-gray-500">
                                        <Link href={`/shops/${shop.slug}`}>
                                            <b>{product?.secondary_data?.sold_count || 'No'} sold</b> — Visit{" "}
                                            <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
                                        </Link>
                                    </div>
                                )}

                                {/* Price */}
                                <div>
                                    {saleActive ? (
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-2xl font-bold text-green-700">
                                                {symbol}
                                                {activePrice}
                                            </span>
                                            <del className="text-gray-400">
                                                {symbol}
                                                {originalPrice}
                                            </del>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-green-700">
                                            {symbol}
                                            {activePrice}
                                        </span>
                                    )}
                                    {saleActive && (
                                        <p className="text-sm text-red-700 font-medium mt-1">
                                            Sale ends in{" "}
                                            {timeRemaining.days > 0
                                                ? `${timeRemaining.days}d `
                                                : ""}
                                            {String(timeRemaining.hours).padStart(2, "0")}:
                                            {String(timeRemaining.minutes).padStart(2, "0")}:
                                            {String(timeRemaining.seconds).padStart(2, "0")}
                                        </p>
                                    )}
                                </div>

                                <MultiBuySection
                                    product={product}
                                    onTierSelect={handleTierSelect}
                                    selectedTier={selectedMultiBuyTier}
                                />

                                {/* Variants */}
                                <div className="space-y-4 my-4">
                                    {variants?.map((variant) =>
                                        variant.values?.length ? (
                                            <div key={variant.id}>
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    {variant.label}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {variant.values.map((val) => (
                                                        <button
                                                            key={val.id}
                                                            onClick={() =>
                                                                setSelectedVariants((prev) => ({
                                                                    ...prev,
                                                                    [variant.id]: val,
                                                                }))
                                                            }
                                                            className={`px-4 ${val.additional_price_cents === 0 && "py-2"
                                                                } border rounded-full text-sm ${selectedVariants[variant.id]?.id === val.id
                                                                    ? "border-black font-semibold"
                                                                    : "border-gray-300 text-gray-700"
                                                                }`}
                                                        >
                                                            {val.value}
                                                            {val.additional_price_cents > 0 && (
                                                                <div className="text-gray-900 text-[10px]">
                                                                    +{symbol}
                                                                    {convertPrice(
                                                                        val.additional_price_cents / 100,
                                                                        price_currency,
                                                                        currencyCode,
                                                                        exchangeRates
                                                                    ).toFixed(2)}
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <button
                                        className="btn-base btn-primary"
                                        onClick={handleDirectBuyNow}
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        className="btn-base btn-outline"
                                        onClick={handleAddToBasket}
                                    >
                                        Add to Basket
                                    </button>
                                    <button className="btn-base btn-outline">
                                        Buy Now Pay Later (BNPL)
                                    </button>
                                    <button
                                        className="btn-base btn-outline flex items-center justify-center gap-2"
                                        onClick={handleToggleWishlist}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? <div className="flex space-x-2 justify-center items-center h-6">
                                                <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                                                <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            </div>
                                            : isWishlisted
                                                ? <>
                                                    <FaHeart className="w-6 h-6 text-violet-700 hover:text-violet-500 transition-colors" />
                                                    <span>Remove from Watchlist</span>
                                                </>
                                                : <>
                                                    <FaRegHeart />
                                                    <span>Add to Watchlist</span>
                                                </>}
                                    </button>
                                </div>

                                <PaymentDeliveryReturns
                                    secondaryData={product?.secondary_data}
                                    dispatchTime={product?.dispatch_time_in_days}
                                    seller_payment_terms={product?.seller_payment_terms}
                                />
                            </div>
                        </section>

                        <DescriptionAndReviews
                            details={description}
                            condition={condition}
                            user={user}
                            shop={shop}
                            product={product}
                            reviews={reviewsList}
                            loading={reviewsLoading}
                            error={reviewsError}
                        />
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="order-2 hidden xl:block xl:col-span-5">
                        <div className="sticky top-0 p-5 space-y-4">
                            {(currentUser?.username === user?.username || currentUser?.admin) && (
                                <Link
                                    href={`/products/edit/${product?.slug}`}
                                    className="flex items-center gap-2"
                                >
                                    <FaEdit className="h-4 w-4 text-violet-700" />
                                    <span className="text-violet-700 hover:underline">Edit</span>
                                </Link>
                            )}

                            <h1 className="heading-lg text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                                {title}
                            </h1>
                            {shop && (
                                <div className="text-sm text-gray-500">
                                    <Link href={`/shops/${shop.slug}`}>
                                        <b>{product?.secondary_data?.sold_count || 'No'} sold</b> — Visit{" "}
                                        <b className="text-[#8710D8]">{shop.name}</b> — Accra, GH
                                    </Link>
                                </div>
                            )}

                            {/* Review Summary */}
                            <div className="flex items-center text-sm text-yellow-400 gap-2">
                                {review_count > 0 ? (
                                    <>
                                        <span>{average_rating.toFixed(1)}</span>
                                        <span className="flex">{renderStars(average_rating)}</span>
                                        <button
                                            className="underline text-blue-600"
                                            onClick={() => {
                                                /* scroll to reviews list */
                                            }}
                                        >
                                            {review_count} Reviews
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-yellow-400"></span>
                                )}
                                <span className="text-green-600">✅ Verified Seller</span>
                            </div>

                            {/* Variants for desktop */}
                            <div className="space-y-4 my-4">
                                {(currentUser?.username === user?.username || currentUser?.admin) && (
                                    <Link
                                        href={`/products/edit/variants/${product?.id}`}
                                        className="flex items-center gap-2"
                                    >
                                        <FaEdit className="h-4 w-4 text-violet-700" />
                                        <span className="text-violet-700 hover:underline">
                                            Edit Variants
                                        </span>
                                    </Link>
                                )}
                                {variants?.length > 0 && (
                                    <>
                                        <hr className="my-3 border-gray-200" />
                                        {variants.map((variant) => (
                                            <div key={variant.id}>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                                        {variant.label}
                                                    </p>
                                                    <span className="text-sm text-gray-400">{sku}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {variant.values.map((val) => {
                                                        const isSel =
                                                            selectedVariants[variant.id]?.id === val.id;
                                                        return (
                                                            <button
                                                                key={val.id}
                                                                onClick={() =>
                                                                    setSelectedVariants((prev) => ({
                                                                        ...prev,
                                                                        [variant.id]: val,
                                                                    }))
                                                                }
                                                                className={`px-4 ${val.additional_price_cents == 0 && "py-2"
                                                                    } border rounded-full text-sm ${isSel
                                                                        ? "border-black font-semibold"
                                                                        : "border-gray-300 text-gray-700"
                                                                    }`}
                                                            >
                                                                {val.value}
                                                                {val.additional_price_cents > 0 && (
                                                                    <div className="text-gray-900 text-[10px]">
                                                                        (+
                                                                        {symbol}
                                                                        {convertPrice(
                                                                            val.additional_price_cents / 100,
                                                                            price_currency,
                                                                            currencyCode,
                                                                            exchangeRates
                                                                        ).toFixed(2)}
                                                                        )
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <hr className="my-3 border-gray-200" />

                            {/* Price & countdown */}
                            <div>
                                {saleActive ? (
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-3xl font-bold text-green-700">
                                            {symbol}
                                            {activePrice}
                                        </span>
                                        <del className="text-gray-400 text-sm">
                                            {symbol}
                                            {originalPrice}
                                        </del>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-green-700">
                                        {symbol}
                                        {activePrice}
                                    </span>
                                )}
                            </div>
                            {saleActive && (
                                <div className="text-sm text-red-700 font-medium mt-1">
                                    Sale ends in{" "}
                                    {timeRemaining.days > 0
                                        ? `${timeRemaining.days}d `
                                        : ""}
                                    {String(timeRemaining.hours).padStart(2, "0")}:
                                    {String(timeRemaining.minutes).padStart(2, "0")}:
                                    {String(timeRemaining.seconds).padStart(2, "0")}
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-medium text-gray-800">
                                    In stock
                                </span>
                                <div className="flex items-center rounded-md border border-gray-300 overflow-hidden w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black"
                                    >
                                        –
                                    </button>
                                    <div className="w-12 h-10 flex items-center justify-center border-x text-lg font-medium">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <MultiBuySection
                                product={product}
                                onTierSelect={handleTierSelect}
                                selectedTier={selectedMultiBuyTier}
                            />

                            <div className="mt-4 space-y-2">
                                <button
                                    className="btn-base btn-primary w-full"
                                    onClick={handleDirectBuyNow}
                                >
                                    Buy Now
                                </button>
                                <button
                                    className="btn-base btn-outline w-full"
                                    onClick={handleAddToBasket}
                                >
                                    Add to Basket
                                </button>
                                <button
                                    className="btn-base btn-outline w-full flex items-center justify-center gap-2"
                                    onClick={handleToggleWishlist}
                                    disabled={loading}
                                >
                                    {loading
                                        ? <div className="flex space-x-2 justify-center items-center h-6">
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        </div>
                                        : isWishlisted
                                            ? <>
                                                <FaHeart className="w-6 h-6 text-violet-700 hover:text-violet-500 transition-colors" />
                                                <span>Remove from Watchlist</span>
                                            </>
                                            : <>
                                                <FaRegHeart />
                                                <span>Add to Watchlist</span>
                                            </>}
                                </button>
                            </div>

                            <PaymentDeliveryReturns
                                secondaryData={product?.secondary_data}
                                dispatchTime={product?.dispatch_time_in_days}
                                seller_payment_terms={product?.seller_payment_terms}
                            />
                        </div>
                    </aside>

                    {/* Basket Modal */}
                    <BasketModal
                        isModalVisible={isModalVisible}
                        handleCloseModal={handleCloseModal}
                        basket={basket}
                        saleActive={saleActive}
                        activePrice={activePrice}
                        quantity={quantity}
                        handleQuantityChange={handleQuantityChange}
                        handleRemoveProduct={handleRemoveProduct}
                    />
                </div>
            </div>

            {/* Direct Buy Popup */}
            {isDirectBuyPopupVisible && (
                <DirectBuyPopup
                    relatedProducts={relatedProducts}
                    quantity={quantity}
                    product={product}
                    isVisible={isDirectBuyPopupVisible}
                    onClose={() => setIsDirectBuyPopupVisible(false)}
                />
            )}
        </section>
    );
}

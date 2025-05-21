
// 'use client'

// import React, { useEffect, useState, useCallback } from "react";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter, usePathname } from "next/navigation";
// import * as Yup from "yup";
// import {
//     FaMinus,
//     FaPlus,
//     FaRegHeart,
//     FaHeart,
//     FaEdit,
//     FaTrash,
//     FaEnvelope,
//     FaWhatsapp,
//     FaStar,
//     FaStarHalfAlt,
//     FaRegStar,
//     FaTruck,
// } from "react-icons/fa";

// import MultiBuySection from "../MultiBuySection";
// import BasketModal from "../BasketModal";
// import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
// import DescriptionAndReviews from "../DescriptionAndReviews";
// import RecentlyViewed from "../RecentlyViewed";
// import ProductSlider from "./ProductSlider";
// import DirectBuyPopup from "../DirectBuyPopup";
// import { CountryDropdown } from "react-country-region-selector";

// import { convertPrice } from "@/app/utils/utils";
// import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
// import { selectSelectedCountry } from "@/app/store/slices/countrySlice";
// import {
//     fetchReviewsStart,
//     fetchReviewsSuccess,
//     fetchReviewsFailure,
// } from "@/app/store/slices/reviewsSlice";
// import { AiOutlineClose } from "react-icons/ai";
// import { Formik, Form, Field, ErrorMessage } from "formik";

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

// const addressSchema = Yup.object().shape({
//     full_name: Yup.string().required("Required"),
//     street: Yup.string().required("Required"),
//     city: Yup.string().required("Required"),
//     state: Yup.string().required("Required"),
//     zip_code: Yup.string().required("Required"),
//     country: Yup.string().required("Required"),
// });

// export default function ProductDetailSection({ product, relatedProducts }) {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const currentPath = usePathname();

//     const [quantity, setQuantity] = useState(1);
//     const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);
//     const [showNewModal, setShowNewModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [isWishlisted, setIsWishlisted] = useState(false);

//     const {
//         id,
//         title,
//         description,
//         price_cents,
//         sale_price_cents,
//         postage_fee_cents,
//         price_currency,
//         sale_end_date,
//         product_video,
//         product_images,
//         condition,
//         category,
//         shop,
//         user,
//         variants,
//         is_published,
//     } = product || {};

//     const [addresses, setAddresses] = useState([]);
//     const [selectedAddressId, setSelectedAddressId] = useState(null);
//     const [isAddressLoading, setIsAddressLoading] = useState(true);

//     const { token, user: currentUser } = useSelector((s) => s.auth);
//     const basket = useSelector((s) => s.basket.items) || [];
//     const exchangeRates = useSelector((s) => s.exchangeRates.rates);
//     const selectedCountry = useSelector(selectSelectedCountry);
//     const symbol = selectedCountry?.symbol ?? "₵";
//     const currencyCode = selectedCountry?.code ?? "GHS";

//     const {
//         summary: { average_rating, review_count },
//         loading: reviewsLoading,
//         error: reviewsError,
//         reviews: reviewsList,
//     } = useSelector((s) => s.reviews);

//     // Fetch reviews
//     useEffect(() => {
//         if (!product?.id) return;
//         dispatch(fetchReviewsStart());
//         fetch(`/api/products/${product.id}/reviews`)
//             .then((res) => res.json())
//             .then((data) =>
//                 dispatch(
//                     fetchReviewsSuccess({
//                         results: data.reviews,
//                         average_rating: data.average_rating,
//                         review_count: data.review_count,
//                         rating_percent: data.rating_percent,
//                     })
//                 )
//             )
//             .catch((err) => dispatch(fetchReviewsFailure(err.toString())));
//     }, [dispatch, product?.id]);

//     // Wishlist status
//     useEffect(() => {
//         if (!token || !id) return;
//         fetch(`https://media.upfrica.com/api/wishlist/${id}/`, {
//             method: "GET",
//             headers: {
//                 Authorization: "Token " + token,
//                 "Content-Type": "application/json",
//             },
//         })
//             .then((res) => setIsWishlisted(res.ok))
//             .catch((err) => console.error("Error checking wishlist:", err));
//     }, [token, id]);

//     const handleToggleWishlist = async () => {
//         if (!token) {
//             router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
//             return;
//         }
//         setLoading(true);
//         const url = `https://media.upfrica.com/api/wishlist/${id}/`;
//         try {
//             if (isWishlisted) {
//                 await fetch(url, { method: "DELETE", headers: { Authorization: "Token " + token } });
//                 setIsWishlisted(false);
//             } else {
//                 await fetch("https://media.upfrica.com/api/wishlist/", {
//                     method: "POST",
//                     headers: { Authorization: "Token " + token, "Content-Type": "application/json" },
//                     body: JSON.stringify({ product_id: id, note: "" }),
//                 });
//                 setIsWishlisted(true);
//             }
//         } catch (e) {
//             console.error("Wishlist toggle error:", e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Admin actions
//     const handleDelete = async () => {
//         if (!window.confirm("Are you sure you want to delete this product?")) return;
//         await fetch(`https://media.upfrica.com/api/products/${id}/`, {
//             method: "DELETE",
//             headers: { Authorization: `Token ${token}` },
//         });
//         router.push("/"); // redirect after deletion
//     };

//     const handlePublish = async () => {
//         await fetch(`https://media.upfrica.com/api/products/${id}/publish/`, {
//             method: "POST",
//             headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
//         });
//         router.replace(router.asPath);
//     };

//     const handleUnpublish = async () => {
//         await fetch(`https://media.upfrica.com/api/products/${id}/unpublish/`, {
//             method: "POST",
//             headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
//         });
//         router.replace(router.asPath);
//     };

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

//     // Pricing logic
//     const totalAdditionalCents = Object.values(selectedVariants).reduce(
//         (sum, opt) => sum + (opt.additional_price_cents || 0),
//         0
//     );
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
//         ? convertPrice(originalPriceCents / 100, price_currency, currencyCode, exchangeRates).toFixed(2)
//         : null;

//     // Countdown timer
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

//     // Address fetch
//     useEffect(() => {
//         if (!token) {
//             router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
//             return;
//         }
//         (async () => {
//             try {
//                 const res = await fetch("https://media.upfrica.com/api/addresses/", {
//                     headers: { Authorization: `Token ${token}` },
//                 });
//                 if (!res.ok) throw new Error("Error fetching addresses");
//                 const data = await res.json();
//                 const opts = data.map((a) => ({
//                     id: a.id,
//                     value: `${a.address_data.street}, ${a.address_data.city}, ${a.address_data.country}`,
//                 }));
//                 setAddresses(opts);
//                 setSelectedAddressId(opts[0]?.id ?? null);
//             } catch (err) {
//                 console.error(err);
//                 setAddresses([]);
//                 setSelectedAddressId(null);
//             } finally {
//                 setIsAddressLoading(false);
//             }
//         })();
//     }, [token, router, currentPath]);

//     // Formik new address
//     const handleNewAddressSubmit = async (vals, { setSubmitting, resetForm }) => {
//         try {
//             const res = await fetch("https://media.upfrica.com/api/addresses/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Token ${token}`,
//                 },
//                 body: JSON.stringify({
//                     owner_id: currentUser.id,
//                     owner_type: "USER",
//                     default: false,
//                     full_name: vals.full_name,
//                     address_data: {
//                         street: vals.street,
//                         city: vals.city,
//                         state: vals.state,
//                         zip_code: vals.zip_code,
//                         country: vals.country,
//                     },
//                 }),
//             });
//             const json = await res.json();
//             setAddresses((prev) => [
//                 ...prev,
//                 {
//                     id: json.id,
//                     value: `${json.address_data.street}, ${json.address_data.city}, ${json.address_data.country}`,
//                 },
//             ]);
//             setSelectedAddressId(json.id);
//             resetForm();
//             setShowNewModal(false);
//             setIsDirectBuyPopupVisible(true);
//         } catch (e) {
//             console.error("Error creating address:", e);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handlers
//     const handleDirectBuyNow = () => {
//         if (!token) {
//             router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
//             return;
//         }
//         if (!isAddressLoading && addresses.length === 0) {
//             setShowNewModal(true);
//         } else {
//             setIsDirectBuyPopupVisible(true);
//         }
//     };
//     const handleAddToBasket = () => {
//         dispatch(
//             addToBasket({
//                 id,
//                 title,
//                 price_cents: activePriceCents,
//                 quantity,
//                 image: product_images,
//                 postage_fee: postage_fee_cents || 0,
//                 secondary_postage_fee: product?.secondary_postage_fee_cents || 0,
//                 variants: selectedVariants,
//                 sku:
//                     "SKU-" +
//                     Object.values(selectedVariants)
//                         .map((opt) => opt.value.replace(/\s+/g, "-").toUpperCase())
//                         .join("-"),
//             })
//         );
//         setIsModalVisible(true);
//     };
//     const handleCloseModal = () => setIsModalVisible(false);
//     const handleQuantityChange = (pid, q) => dispatch(updateQuantity({ id: pid, quantity: q }));
//     const handleRemoveProduct = (pid) => dispatch(removeFromBasket(pid));

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

//     const [selectedMultiBuyTier, setSelectedMultiBuyTier] = useState(null);
//     const handleTierSelect = useCallback((tier) => {
//         setSelectedMultiBuyTier((prev) =>
//             prev?.minQuantity === tier.minQuantity ? prev : tier
//         );
//     }, []);

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
//                                             <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
//                                         </Link>
//                                     </div>
//                                 )}

//                                 {/* Price */}
//                                 <div>
//                                     {saleActive ? (
//                                         <div className="flex items-baseline space-x-2">
//                                             <span className="text-2xl font-bold text-green-700">
//                                                 {symbol}{activePrice}
//                                             </span>
//                                             <del className="text-gray-400">
//                                                 {symbol}{originalPrice}
//                                             </del>
//                                         </div>
//                                     ) : (
//                                         <span className="text-2xl font-bold text-green-700">
//                                             {symbol}{activePrice}
//                                         </span>
//                                     )}
//                                     {saleActive && (
//                                         <p className="text-sm text-red-700 font-medium mt-1">
//                                             Sale ends in{" "}
//                                             {timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ""}
//                                             {String(timeRemaining.hours).padStart(2, "0")}:
//                                             {String(timeRemaining.minutes).padStart(2, "0")}:
//                                             {String(timeRemaining.seconds).padStart(2, "0")}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Postage / Delivery */}
//                                 <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
//                                     <FaTruck className="text-lg" />
//                                     {postage_fee_cents > 0 ? (
//                                         <span>Postage fee: {symbol}{(postage_fee_cents / 100).toFixed(2)}</span>
//                                     ) : (
//                                         <span className="text-green-600 font-semibold">Free delivery</span>
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
//                                                             className={`px-4 ${val.additional_price_cents === 0 && "py-2"} border rounded-full text-sm ${selectedVariants[variant.id]?.id === val.id
//                                                                     ? "border-black font-semibold"
//                                                                     : "border-gray-300 text-gray-700"
//                                                                 }`}
//                                                         >
//                                                             {val.value}
//                                                             {val.additional_price_cents > 0 && (
//                                                                 <div className="text-gray-900 text-[10px]">
//                                                                     +{symbol}{convertPrice(
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
//                                         onClick={handleToggleWishlist}
//                                         disabled={loading}
//                                     >
//                                         {loading ? (
//                                             <div className="flex space-x-2 justify-center items-center h-6">
//                                                 <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
//                                                 <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-150" />
//                                                 <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-300" />
//                                             </div>
//                                         ) : isWishlisted ? (
//                                             <>
//                                                 <FaHeart className="w-6 h-6 text-violet-700 hover:text-violet-500 transition-colors" />
//                                                 <span>Remove from Watchlist</span>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <FaRegHeart />
//                                                 <span>Add to Watchlist</span>
//                                             </>
//                                         )}
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
//                             {/* Owner or Admin: Edit */}
//                             {(currentUser?.username === user?.username || currentUser?.admin) && (
//                                 <Link
//                                     href={`/products/edit/${product?.slug}`}
//                                     className="flex items-center gap-2"
//                                 >
//                                     <FaEdit className="h-4 w-4 text-violet-700" />
//                                     <span className="text-violet-700 hover:underline">Edit</span>
//                                 </Link>
//                             )}

//                             {/* Admin-only controls */}
//                             {currentUser?.admin && (
//                                 <div className="space-y-4">
//                                     <button
//                                         onClick={handleDelete}
//                                         className="btn-base btn-danger w-full flex items-center justify-center gap-2"
//                                     >
//                                         <FaTrash /> Delete
//                                     </button>
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={handlePublish}
//                                             disabled={is_published}
//                                             className="btn-base btn-outline flex-1"
//                                         >
//                                             Publish
//                                         </button>
//                                         <button
//                                             onClick={handleUnpublish}
//                                             disabled={!is_published}
//                                             className="btn-base btn-outline flex-1"
//                                         >
//                                             Unpublish
//                                         </button>
//                                     </div>
//                                     <div className="mt-4 space-y-1 text-sm">
//                                         <div className="flex items-center gap-2">
//                                             <FaEnvelope /> <span>{user.email}</span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <FaWhatsapp /> <span>{user.whatsapp_number}</span>
//                                         </div>
//                                     </div>
//                                 </div>
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

//                             {/* Review Summary */}
//                             <div className="flex items-center text-sm text-yellow-400 gap-2">
//                                 {review_count > 0 ? (
//                                     <>
//                                         <span>{average_rating.toFixed(1)}</span>
//                                         <span className="flex">{renderStars(average_rating)}</span>
//                                         <button className="underline text-blue-600">
//                                             {review_count} Reviews
//                                         </button>
//                                     </>
//                                 ) : null}
//                                 <span className="text-green-600">✅ Verified Seller</span>
//                             </div>

//                             {/* Variants */}
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
//                                                     <span className="text-sm text-gray-400">
//                                                         SKU-{Object.values(selectedVariants).map((o) => o.value).join("-").toUpperCase()}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {variant.values.map((val) => {
//                                                         const isSel = selectedVariants[variant.id]?.id === val.id;
//                                                         return (
//                                                             <button
//                                                                 key={val.id}
//                                                                 onClick={() =>
//                                                                     setSelectedVariants((prev) => ({
//                                                                         ...prev,
//                                                                         [variant.id]: val,
//                                                                     }))
//                                                                 }
//                                                                 className={`px-4 ${val.additional_price_cents == 0 && "py-2"} border rounded-full text-sm ${isSel ? "border-black font-semibold" : "border-gray-300 text-gray-700"
//                                                                     }`}
//                                                             >
//                                                                 {val.value}
//                                                                 {val.additional_price_cents > 0 && (
//                                                                     <div className="text-gray-900 text-[10px]">
//                                                                         (+{symbol}{convertPrice(
//                                                                             val.additional_price_cents / 100,
//                                                                             price_currency,
//                                                                             currencyCode,
//                                                                             exchangeRates
//                                                                         ).toFixed(2)})
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
//                                             {symbol}{activePrice}
//                                         </span>
//                                         <del className="text-gray-400 text-sm">
//                                             {symbol}{originalPrice}
//                                         </del>
//                                     </div>
//                                 ) : (
//                                     <span className="text-3xl font-bold text-green-700">
//                                         {symbol}{activePrice}
//                                     </span>
//                                 )}
//                             </div>
//                             {saleActive && (
//                                 <div className="text-sm text-red-700 font-medium mt-1">
//                                     Sale ends in{" "}
//                                     {timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ""}
//                                     {String(timeRemaining.hours).padStart(2, "0")}:
//                                     {String(timeRemaining.minutes).padStart(2, "0")}:
//                                     {String(timeRemaining.seconds).padStart(2, "0")}
//                                 </div>
//                             )}

//                             {/* Postage / Delivery */}
//                             <div className="flex items-center gap-2 mt-4 mb-6 text-sm text-gray-600">
//                                 <FaTruck className="text-lg" />
//                                 {postage_fee_cents > 0 ? (
//                                     <span>Postage fee: {symbol}{(postage_fee_cents / 100).toFixed(2)}</span>
//                                 ) : (
//                                     <span className="text-green-600 font-semibold">Free delivery</span>
//                                 )}
//                             </div>

//                             {/* Quantity */}
//                             <div className="flex items-center gap-4 mb-6">
//                                 <span className="text-sm font-medium text-gray-800">In stock</span>
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
//                                 <button className="btn-base btn-primary w-full" onClick={handleDirectBuyNow}>
//                                     Buy Now
//                                 </button>
//                                 <button className="btn-base btn-outline w-full" onClick={handleAddToBasket}>
//                                     Add to Basket
//                                 </button>
//                                 <button
//                                     className="btn-base btn-outline w-full flex items-center justify-center gap-2"
//                                     onClick={handleToggleWishlist}
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <div className="flex space-x-2 justify-center items-center h-6">
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-150" />
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-300" />
//                                         </div>
//                                     ) : isWishlisted ? (
//                                         <>
//                                             <FaHeart className="w-6 h-6 text-violet-700 hover:text-violet-500 transition-colors" />
//                                             <span>Remove from Watchlist</span>
//                                         </>
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

//             {/* Add New Address Modal */}
//             {showNewModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
//                         <button
//                             onClick={() => setShowNewModal(false)}
//                             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                         >
//                             <AiOutlineClose size={24} />
//                         </button>
//                         <h3 className="text-xl font-semibold mb-4">Add New Address</h3>

//                         <Formik
//                             initialValues={{
//                                 full_name: "",
//                                 street: "",
//                                 city: "",
//                                 state: "",
//                                 zip_code: "",
//                                 country: "",
//                             }}
//                             validationSchema={addressSchema}
//                             onSubmit={handleNewAddressSubmit}
//                         >
//                             {({ isSubmitting, setFieldValue, values }) => (
//                                 <Form className="space-y-6">
//                                     {[
//                                         { name: "full_name", label: "Full Name" },
//                                         { name: "street", label: "Street" },
//                                         { name: "city", label: "City" },
//                                         { name: "state", label: "State" },
//                                         { name: "zip_code", label: "Zip Code" },
//                                     ].map((f) => (
//                                         <div key={f.name}>
//                                             <label className="block text-sm font-medium text-gray-700">
//                                                 {f.label}
//                                             </label>
//                                             <Field
//                                                 name={f.name}
//                                                 className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-3"
//                                             />
//                                             <ErrorMessage
//                                                 name={f.name}
//                                                 component="p"
//                                                 className="text-red-600 text-sm mt-1"
//                                             />
//                                         </div>
//                                     ))}

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">
//                                             Country
//                                         </label>
//                                         <CountryDropdown
//                                             value={values.country}
//                                             onChange={(val) => setFieldValue("country", val)}
//                                             defaultOptionLabel="Select Country"
//                                             className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-3"
//                                         />
//                                         <ErrorMessage
//                                             name="country"
//                                             component="p"
//                                             className="text-red-600 text-sm mt-1"
//                                         />
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         disabled={isSubmitting}
//                                         className="w-full py-3 rounded-lg font-semibold btn-primary transition"
//                                     >
//                                         {isSubmitting ? (
//                                             <div className="flex space-x-2 justify-center py-3">
//                                                 <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
//                                                 <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
//                                                 <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
//                                             </div>
//                                         ) : (
//                                             "Save Address"
//                                         )}
//                                     </button>
//                                 </Form>
//                             )}
//                         </Formik>
//                     </div>
//                 </div>
//             )}

//             {/* Direct Buy Popup */}
//             {isDirectBuyPopupVisible && addresses.length > 0 && (
//                 <DirectBuyPopup
//                     selectedAddressId={selectedAddressId}
//                     isAddressLoading={isAddressLoading}
//                     addresses={addresses}
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
import * as Yup from "yup";
import {
    FaMinus,
    FaPlus,
    FaRegHeart,
    FaHeart,
    FaEdit,
    FaTrash,
    FaEnvelope,
    FaWhatsapp,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaTruck,
    FaRegEye,
    FaEyeSlash,
} from "react-icons/fa";

import MultiBuySection from "../MultiBuySection";
import BasketModal from "../BasketModal";
import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
import DescriptionAndReviews from "../DescriptionAndReviews";
import RecentlyViewed from "../RecentlyViewed";
import ProductSlider from "./ProductSlider";
import DirectBuyPopup from "../DirectBuyPopup";
import { CountryDropdown } from "react-country-region-selector";

import { convertPrice } from "@/app/utils/utils";
import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
import { selectSelectedCountry } from "@/app/store/slices/countrySlice";
import {
    fetchReviewsStart,
    fetchReviewsSuccess,
    fetchReviewsFailure,
} from "@/app/store/slices/reviewsSlice";
import { AiOutlineClose } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";

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

const addressSchema = Yup.object().shape({
    full_name: Yup.string().required("Required"),
    street: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zip_code: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
});

export default function ProductDetailSection({ product, relatedProducts }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const currentPath = usePathname();

    // UI state
    const [quantity, setQuantity] = useState(1);
    const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Destructure product
    const {
        id,
        title,
        description,
        price_cents,
        sale_price_cents,
        postage_fee_cents,
        price_currency,
        sale_end_date,
        product_video,
        product_images,
        condition,
        category,
        shop,
        user,
        variants,
        is_published,
    } = product || {};

    // Addresses for direct buy
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressLoading, setIsAddressLoading] = useState(true);

    // Redux selectors
    const { token, user: currentUser } = useSelector((s) => s.auth);
    const basket = useSelector((s) => s.basket.items) || [];
    const exchangeRates = useSelector((s) => s.exchangeRates.rates);
    const selectedCountry = useSelector(selectSelectedCountry);
    const symbol = selectedCountry?.symbol ?? "₵";
    const currencyCode = selectedCountry?.code ?? "GHS";

    const {
        summary: { average_rating, review_count },
        loading: reviewsLoading,
        error: reviewsError,
        reviews: reviewsList,
    } = useSelector((s) => s.reviews);

    // Fetch reviews on mount / product change
    useEffect(() => {
        if (!id) return;
        dispatch(fetchReviewsStart());
        fetch(`/api/products/${id}/reviews`)
            .then((res) => res.json())
            .then((data) =>
                dispatch(
                    fetchReviewsSuccess({
                        results: data.reviews,
                        average_rating: data.average_rating,
                        review_count: data.review_count,
                        rating_percent: data.rating_percent,
                    })
                )
            )
            .catch((err) => dispatch(fetchReviewsFailure(err.toString())));
    }, [dispatch, id]);

    // Check wishlist status
    useEffect(() => {
        if (!token || !id) return;
        fetch(`https://media.upfrica.com/api/wishlist/${id}/`, {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
        })
            .then((res) => setIsWishlisted(res.ok))
            .catch(console.error);
    }, [token, id]);

    const handleToggleWishlist = async () => {
        if (!token) {
            router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
            return;
        }
        setLoading(true);
        const url = `https://media.upfrica.com/api/wishlist/${id}/`;
        try {
            if (isWishlisted) {
                await fetch(url, { method: "DELETE", headers: { Authorization: `Token ${token}` } });
                setIsWishlisted(false);
            } else {
                await fetch("https://media.upfrica.com/api/wishlist/", {
                    method: "POST",
                    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ product_id: id, note: "" }),
                });
                setIsWishlisted(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Admin actions: delete, publish, unpublish
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await fetch(`https://media.upfrica.com/api/products/${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Token ${token}` },
        });
        router.push("/");
    };
    const handlePublish = async () => {
        await fetch(`https://media.upfrica.com/api/products/${id}/publish/`, {
            method: "POST",
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        router.replace(router.asPath);
    };
    const handleUnpublish = async () => {
        await fetch(`https://media.upfrica.com/api/products/${id}/unpublish/`, {
            method: "POST",
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        router.replace(router.asPath);
    };

    // Variant defaults
    const [selectedVariants, setSelectedVariants] = useState({});
    useEffect(() => {
        if (!variants) return;
        const defaults = {};
        variants.forEach((v) => {
            if (v.values?.length) defaults[v.id] = v.values[0];
        });
        setSelectedVariants(defaults);
    }, [variants]);

    // Pricing logic
    const totalAdditionalCents = Object.values(selectedVariants).reduce(
        (sum, v) => sum + (v.additional_price_cents || 0),
        0
    );
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
        ? convertPrice(originalPriceCents / 100, price_currency, currencyCode, exchangeRates).toFixed(2)
        : null;

    // Countdown timer
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

    // Media items array
    const mediaItems = product_video
        ? [{ type: "video", src: product_video }, ...product_images.map((src) => ({ type: "image", src }))]
        : product_images;

    // Fetch addresses
    useEffect(() => {
        if (!token) {
            router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }
        (async () => {
            try {
                const res = await fetch("https://media.upfrica.com/api/addresses/", {
                    headers: { Authorization: `Token ${token}` },
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                const opts = data.map((a) => ({
                    id: a.id,
                    value: `${a.address_data.street}, ${a.address_data.city}, ${a.address_data.country}`,
                }));
                setAddresses(opts);
                setSelectedAddressId(opts[0]?.id ?? null);
            } catch {
                setAddresses([]);
                setSelectedAddressId(null);
            } finally {
                setIsAddressLoading(false);
            }
        })();
    }, [token, router, currentPath]);

    // New address form submit
    const handleNewAddressSubmit = async (vals, { setSubmitting, resetForm }) => {
        try {
            const res = await fetch("https://media.upfrica.com/api/addresses/", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
                body: JSON.stringify({
                    owner_id: currentUser.id,
                    owner_type: "USER",
                    default: false,
                    full_name: vals.full_name,
                    address_data: {
                        street: vals.street,
                        city: vals.city,
                        state: vals.state,
                        zip_code: vals.zip_code,
                        country: vals.country,
                    },
                }),
            });
            const json = await res.json();
            setAddresses((prev) => [
                ...prev,
                { id: json.id, value: `${json.address_data.street}, ${json.address_data.city}, ${json.address_data.country}` },
            ]);
            setSelectedAddressId(json.id);
            resetForm();
            setShowNewModal(false);
            setIsDirectBuyPopupVisible(true);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    // Handlers
    const handleDirectBuyNow = () => {
        if (!token) {
            router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
            return;
        }
        if (!isAddressLoading && addresses.length === 0) {
            setShowNewModal(true);
        } else {
            setIsDirectBuyPopupVisible(true);
        }
    };
    const handleAddToBasket = () => {
        dispatch(
            addToBasket({
                id,
                title,
                price_cents: activePriceCents,
                quantity,
                image: product_images,
                postage_fee: postage_fee_cents || 0,
                secondary_postage_fee: product?.secondary_postage_fee_cents || 0,
                variants: selectedVariants,
                sku:
                    "SKU-" +
                    Object.values(selectedVariants)
                        .map((opt) => opt.value.replace(/\s+/g, "-").toUpperCase())
                        .join("-"),
            })
        );
        setIsModalVisible(true);
    };
    const handleCloseModal = () => setIsModalVisible(false);
    const handleQuantityChange = (pid, q) => dispatch(updateQuantity({ id: pid, quantity: q }));
    const handleRemoveProduct = (pid) => dispatch(removeFromBasket(pid));

    // Render stars helper
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

    // Multi-buy section
    const [selectedMultiBuyTier, setSelectedMultiBuyTier] = useState(null);
    const handleTierSelect = useCallback((tier) => {
        setSelectedMultiBuyTier((prev) => (prev?.minQuantity === tier.minQuantity ? prev : tier));
    }, []);

    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
            <RecentlyViewed product={product} />
            <div data-sticky-container>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="order-1 xl:col-span-7">
                        <Breadcrumbs categoryTree={category?.category_tree} title={title} />
                        <section className="mt-2">
                            <ProductSlider mediaItems={mediaItems} />
                        </section>

                        {/* MOBILE CTA */}
                        <section className="block xl:hidden mt-5">
                            {/* Edit */}
                            <Link href={`/products/edit/${product?.slug}`} className="flex items-center gap-2 mb-2">
                                <FaEdit className="h-4 w-4 text-violet-700" />
                                <span className="text-violet-700 hover:underline">Edit</span>
                            </Link>

                            {/* Publish/Unpublish on mobile */}
                            {currentUser?.admin && (
                                <div className="flex items-center gap-2 mb-4">
                                    {/* <button
                                        onClick={handlePublish}
                                        disabled={is_published}
                                        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 transition"
                                    >
                                        <FaRegEye />
                                        <span>Publish</span>
                                    </button> */}
                                    <button
                                        onClick={handleUnpublish}
                                        disabled={!is_published}
                                        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 transition"
                                    >
                                        <FaEyeSlash />
                                        <span>Unpublish</span>
                                    </button>
                                </div>
                            )}

                            <div className="bg-white p-4 space-y-4">
                                <h1 className="heading-lg text-base md:text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
                                {shop && (
                                    <div className="text-sm text-gray-500">
                                        <Link href={`/shops/${shop.slug}`}>
                                            <b>{product?.secondary_data?.sold_count || 'No'} sold</b> — Visit{" "}
                                            <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
                                        </Link>
                                    </div>
                                )}

                                {/* Price & Sale */}
                                <div>
                                    {saleActive ? (
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-2xl font-bold text-green-700">{symbol}{activePrice}</span>
                                            <del className="text-gray-400">{symbol}{originalPrice}</del>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-green-700">{symbol}{activePrice}</span>
                                    )}
                                    {saleActive && (
                                        <p className="text-sm text-red-700 font-medium mt-1">
                                            Sale ends in{" "}
                                            {timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ""}
                                            {String(timeRemaining.hours).padStart(2, "0")}:
                                            {String(timeRemaining.minutes).padStart(2, "0")}:
                                            {String(timeRemaining.seconds).padStart(2, "0")}
                                        </p>
                                    )}
                                </div>

                                {/* Postage / Delivery */}
                                <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                                    <FaTruck className="text-lg" />
                                    {postage_fee_cents > 0 ? (
                                        <span>Postage fee: {symbol}{(postage_fee_cents / 100).toFixed(2)}</span>
                                    ) : (
                                        <span className="text-green-600 font-semibold">Free delivery</span>
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
                                                <p className="text-sm font-medium text-gray-700 mb-1">{variant.label}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {variant.values.map((val) => (
                                                        <button
                                                            key={val.id}
                                                            onClick={() =>
                                                                setSelectedVariants((prev) => ({ ...prev, [variant.id]: val }))
                                                            }
                                                            className={`px-4 ${val.additional_price_cents === 0 && "py-2"} border rounded-full text-sm ${selectedVariants[variant.id]?.id === val.id
                                                                    ? "border-black font-semibold"
                                                                    : "border-gray-300 text-gray-700"
                                                                }`}
                                                        >
                                                            {val.value}
                                                            {val.additional_price_cents > 0 && (
                                                                <div className="text-gray-900 text-[10px]">
                                                                    +{symbol}{convertPrice(
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

                                {/* Actions */}
                                <div className="grid gap-2">
                                    <button className="btn-base btn-primary" onClick={handleDirectBuyNow}>Buy Now</button>
                                    <button className="btn-base btn-outline" onClick={handleAddToBasket}>Add to Basket</button>
                                    <button className="btn-base btn-outline">Buy Now Pay Later (BNPL)</button>
                                    <button
                                        className="btn-base btn-outline flex items-center justify-center gap-2"
                                        onClick={handleToggleWishlist}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex space-x-2 justify-center items-center h-6">
                                                <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                                                <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-150" />
                                                <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-300" />
                                            </div>
                                        ) : isWishlisted ? (
                                            <>
                                                <FaHeart className="w-6 h-6 text-violet-700 hover:text-violet-500 transition-colors" />
                                                <span>Remove from Watchlist</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaRegHeart />
                                                <span>Add to Watchlist</span>
                                            </>
                                        )}
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
                        <div className="sticky top-0 p-5 px-0 space-y-4">

                            {/* Admin / Owner Controls */}
                            {(currentUser?.username === user?.username || currentUser?.admin) && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Link href={`/products/edit/${product?.slug}`} className="flex items-center gap-1 px-0  text-sm text-gray-700 rounded hover:bg-gray-100 transition">
                                        <FaEdit /> Edit
                                    </Link>
                                    {currentUser.admin && (
                                        <>
                                            <button
                                                onClick={handleDelete}
                                                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 transition"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                            {/* <button
                                                onClick={handlePublish}
                                                disabled={is_published}
                                                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 transition"
                                            >
                                                <FaRegEye /> Publish
                                            </button> */}
                                            <button
                                                onClick={handleUnpublish}
                                                disabled={!is_published}
                                                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 transition"
                                            >
                                                <FaEyeSlash /> Unpublish
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Admin-only contact info */}
                            {currentUser?.admin && (
                                <div className="flex items-center gap-4 text-sm mb-4">
                                    <span className="flex items-center gap-1">
                                        <FaEnvelope /> <a href={`mailto:${user.email}`}>{user.email}</a>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaWhatsapp /> <a href={`https://wa.me/${user.phone_number}`}>{user.phone_number}</a>
                                    </span>
                                </div>
                            )}

                            <h1 className="heading-lg text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">{title}</h1>
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
                                        <button className="underline text-blue-600">{review_count} Reviews</button>
                                    </>
                                ) : null}
                                <span className="text-green-600">✅ Verified Seller</span>
                            </div>

                            {/* Variants */}
                            <div className="space-y-4 my-4">
                                {(currentUser?.username === user?.username || currentUser?.admin) && (
                                    <Link href={`/products/edit/variants/${product?.id}`} className="flex items-center gap-2">
                                        <FaEdit className="h-4 w-4 text-violet-700" />
                                        <span className="text-violet-700 hover:underline">Edit Variants</span>
                                    </Link>
                                )}
                                {variants?.length > 0 && (
                                    <>
                                        <hr className="my-3 border-gray-200" />
                                        {variants.map((variant) => (
                                            <div key={variant.id}>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">{variant.label}</p>
                                                    <span className="text-sm text-gray-400">
                                                        SKU-{Object.values(selectedVariants).map((o) => o.value).join("-").toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {variant.values.map((val) => {
                                                        const isSel = selectedVariants[variant.id]?.id === val.id;
                                                        return (
                                                            <button
                                                                key={val.id}
                                                                onClick={() =>
                                                                    setSelectedVariants((prev) => ({ ...prev, [variant.id]: val }))
                                                                }
                                                                className={`px-4 ${val.additional_price_cents == 0 && "py-2"} border rounded-full text-sm ${isSel ? "border-black font-semibold" : "border-gray-300 text-gray-700"
                                                                    }`}
                                                            >
                                                                {val.value}
                                                                {val.additional_price_cents > 0 && (
                                                                    <div className="text-gray-900 text-[10px]">
                                                                        (+{symbol}{convertPrice(
                                                                            val.additional_price_cents / 100,
                                                                            price_currency,
                                                                            currencyCode,
                                                                            exchangeRates
                                                                        ).toFixed(2)})
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
                                        <span className="text-3xl font-bold text-green-700">{symbol}{activePrice}</span>
                                        <del className="text-gray-400 text-sm">{symbol}{originalPrice}</del>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-green-700">{symbol}{activePrice}</span>
                                )}
                            </div>
                            {saleActive && (
                                <div className="text-sm text-red-700 font-medium mt-1">
                                    Sale ends in{" "}
                                    {timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ""}
                                    {String(timeRemaining.hours).padStart(2, "0")}:
                                    {String(timeRemaining.minutes).padStart(2, "0")}:
                                    {String(timeRemaining.seconds).padStart(2, "0")}
                                </div>
                            )}

                            {/* Postage / Delivery */}
                            <div className="flex items-center gap-2 mt-4 mb-6 text-sm text-gray-600">
                                <FaTruck className="text-lg" />
                                {postage_fee_cents > 0 ? (
                                    <span>Postage fee: {symbol}{(postage_fee_cents / 100).toFixed(2)}</span>
                                ) : (
                                    <span className="text-green-600 font-semibold">Free delivery</span>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-medium text-gray-800">In stock</span>
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

                            {/* CTA Buttons */}
                            <div className="mt-4 space-y-2">
                                <button className="btn-base btn-primary w-full" onClick={handleDirectBuyNow}>
                                    Buy Now
                                </button>
                                <button className="btn-base btn-outline w-full" onClick={handleAddToBasket}>
                                    Add to Basket
                                </button>
                                <button
                                    className="btn-base btn-outline w-full flex items-center justify-center gap-2"
                                    onClick={handleToggleWishlist}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex space-x-2 justify-center items-center h-6">
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-150" />
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-300" />
                                        </div>
                                    ) : isWishlisted ? (
                                        <>
                                            <FaHeart className="w-6 h-6 text-violet-700 hover:text-violet-500 transition-colors" />
                                            <span>Remove from Watchlist</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaRegHeart />
                                            <span>Add to Watchlist</span>
                                        </>
                                    )}
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

            {/* Add New Address Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
                        <button
                            onClick={() => setShowNewModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Add New Address</h3>

                        <Formik
                            initialValues={{
                                full_name: "",
                                street: "",
                                city: "",
                                state: "",
                                zip_code: "",
                                country: "",
                            }}
                            validationSchema={addressSchema}
                            onSubmit={handleNewAddressSubmit}
                        >
                            {({ isSubmitting, setFieldValue, values }) => (
                                <Form className="space-y-6">
                                    {[
                                        { name: "full_name", label: "Full Name" },
                                        { name: "street", label: "Street" },
                                        { name: "city", label: "City" },
                                        { name: "state", label: "State" },
                                        { name: "zip_code", label: "Zip Code" },
                                    ].map((f) => (
                                        <div key={f.name}>
                                            <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                                            <Field
                                                name={f.name}
                                                className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-3"
                                            />
                                            <ErrorMessage
                                                name={f.name}
                                                component="p"
                                                className="text-red-600 text-sm mt-1"
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <CountryDropdown
                                            value={values.country}
                                            onChange={(val) => setFieldValue("country", val)}
                                            defaultOptionLabel="Select Country"
                                            className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-3"
                                        />
                                        <ErrorMessage
                                            name="country"
                                            component="p"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 rounded-lg font-semibold btn-primary transition"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex space-x-2 justify-center py-3">
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
                                            </div>
                                        ) : (
                                            "Save Address"
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {/* Direct Buy Popup */}
            {isDirectBuyPopupVisible && addresses.length > 0 && (
                <DirectBuyPopup
                    selectedAddressId={selectedAddressId}
                    isAddressLoading={isAddressLoading}
                    addresses={addresses}
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

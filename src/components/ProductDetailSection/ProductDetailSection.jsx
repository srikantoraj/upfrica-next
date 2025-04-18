


// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import MultiBuySection from "../MultiBuySection";
// import BasketModal from "../BasketModal";
// import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
// import DescriptionAndReviews from "../DescriptionAndReviews";
// import RecentlyViewed from "../RecentlyViewed";
// import ProductSlider from "./ProductSlider";
// import InfoPopover from "../InfoPopover";
// import DirectBuyPopup from "../DirectBuyPopup"; // Import the new direct buy popup component
// import { convertPrice } from "@/app/utils/utils";
// import { useDispatch, useSelector } from "react-redux";
// import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
// import { MdArrowRightAlt } from "react-icons/md";
// import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
// import { ImInfo } from "react-icons/im";
// import { useRouter, usePathname } from "next/navigation";

// /**
//  * Breadcrumbs Component
//  * Receives a nested category tree (categoryTree) and a product title.
//  */
// const Breadcrumbs = ({ categoryTree, title }) => {
//     const flattenCategoryChain = (node) => {
//         const chain = [];
//         let current = node;
//         while (current) {
//             chain.push(current);
//             if (current.children && current.children.length > 0) {
//                 current = current.children[0];
//             } else {
//                 break;
//             }
//         }
//         return chain;
//     };

//     const categoryChain = categoryTree ? flattenCategoryChain(categoryTree) : [];

//     return (
//         <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin text-sm text-gray-500">
//             <Link href="/">
//                 <span className="text-blue-600 hover:underline">Upfrica</span>
//             </Link>
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

// export default function ProductDetailSection({ product }) {
//     const { token } = useSelector((state) => state.auth);
//     const dispatch = useDispatch();
//     const currentPath = usePathname();
//     const basket = useSelector((state) => state.basket.items) || [];
//     const exchangeRates = useSelector((state) => state.exchangeRates.rates);
//     const router = useRouter();

//     const {
//         id,
//         title,
//         description,
//         price_cents,
//         sale_price_cents,
//         price_currency,
//         sale_end_date,
//         sale_start_date,
//         product_video,
//         product_images,
//         seller_town,
//         condition,
//         category,
//         shop,
//         user,
//         product_quantity,
//         variants // expecting product.variants to be passed
//     } = product || {};

//     // Use state to hold the selected variant options.
//     // It maps each variant id to the selected variant value object.
//     const [selectedVariants, setSelectedVariants] = useState({});

//     // Initialize default selections (first option of each variant, if available)
//     useEffect(() => {
//         if (variants && variants.length > 0) {
//             const defaults = {};
//             variants.forEach(variant => {
//                 if (variant.values && variant.values.length > 0) {
//                     defaults[variant.id] = variant.values[0];
//                 }
//             });
//             setSelectedVariants(defaults);
//         }
//     }, [variants]);

//     // If a variant with label matching "color" exists, dispatch update for the slider.
//     useEffect(() => {
//         if (variants && variants.length > 0) {
//             const colorVariant = variants.find(v => v.label.toLowerCase().includes("color"));
//             if (colorVariant && selectedVariants[colorVariant.id]) {
//                 window.dispatchEvent(new CustomEvent("updateSelectedColor", {
//                     detail: selectedVariants[colorVariant.id].value.toLowerCase(),
//                 }));
//             }
//         }
//     }, [selectedVariants, variants]);

//     // Compute final SKU from selected variant options.
//     const sku =
//         "SKU-" +
//         Object.values(selectedVariants)
//             .map((opt) => opt.value.replace(/\s+/g, "-").toUpperCase())
//             .join("-");

//     // Calculate additional price from selected variants.
//     const totalAdditionalCents = Object.values(selectedVariants).reduce(
//         (acc, option) => acc + (option.additional_price_cents || 0),
//         0
//     );
//     const finalPriceCents = price_cents + totalAdditionalCents;
//     const convertedPriceValue = convertPrice(finalPriceCents / 100, price_currency, "GHS", exchangeRates);

//     // Countdown: time remaining until sale_end_date.
//     const saleEndDate = sale_end_date ? new Date(sale_end_date) : null;
//     const now = new Date();
//     const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//     useEffect(() => {
//         if (sale_end_date) {
//             const saleEnd = new Date(sale_end_date);
//             const current = new Date();
//             const remaining = saleEnd - current;
//             setTimeRemaining({
//                 days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
//                 hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
//                 minutes: Math.floor((remaining / (1000 * 60)) % 60),
//                 seconds: Math.floor((remaining / 1000) % 60),
//             });
//         }
//     }, [sale_start_date, sale_end_date]);

//     // Build unified media items: if a product video exists, show it first; then list images.
//     const mediaItems = product_video
//         ? [{ type: "video", src: product_video }, ...product_images.map((img) => ({ type: "image", src: img }))]
//         : product_images;

//     // Handlers for direct buy and basket operations.
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

//         const myHeaders = new Headers();
//         myHeaders.append("Authorization", "Token " + token);
//         myHeaders.append("Content-Type", "application/json");

//         const raw = JSON.stringify({
//             "product_id": id,
//             "note": ""
//         });

//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow"
//         };

//         try {
//             const response = await fetch("https://media.upfrica.com/api/wishlist/", requestOptions);
//             const result = await response.json();
//             console.log("Wishlist API result:", result);
//         } catch (error) {
//             console.error("Error adding to wishlist:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddToBasket = () => {
//         const productData = {
//             id,
//             title,
//             price_cents: finalPriceCents,
//             quantity,
//             image: product_images,
//             variants: selectedVariants, // pass the selected variant options
//             sku: sku,
//         };
//         dispatch(addToBasket(productData));
//         setIsModalVisible(true);
//     };

//     const handleCloseModal = () => setIsModalVisible(false);
//     const handleQuantityChange = (id, newQuantity) => {
//         dispatch(updateQuantity({ id, quantity: newQuantity }));
//     };
//     const handleRemoveProduct = (id) => {
//         dispatch(removeFromBasket(id));
//     };

//     // State for product quantity.
//     const [loading, setLoading] = useState(false);
//     const [quantity, setQuantity] = useState(1);
//     // State for basket modal and direct buy popup.
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);

//     return (
//         <section className="pt-6 md:pt-8 lg:pt-10">
//             {/* Recently viewed product section */}
//             <RecentlyViewed product={product} />
//             <div data-sticky-container>
//                 <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
//                     {/* LEFT CONTENT */}
//                     <div className="order-1 xl:col-span-7">
//                         <Breadcrumbs categoryTree={category?.category_tree} title={title} />

//                         <section className="mt-2">
//                             <ProductSlider images={mediaItems} />
//                         </section>

//                         {/* MOBILE CTA */}
//                         <section className="block xl:hidden mt-5">
//                             <div className="bg-white space-y-4">
//                                 <h1 className="heading-lg text-base md:text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
//                                 {shop && (
//                                     <div className="text-sm text-gray-500">
//                                         <Link href={`/shops/${shop?.slug}`}>
//                                             <b>4480 sold</b> — Visit the <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
//                                         </Link>
//                                     </div>
//                                 )}
//                                 <div className="flex items-center text-sm space-x-2">
//                                     <span className="text-yellow-400">★★★★☆</span>
//                                     <span className="underline text-blue-600">595 Reviews</span>
//                                     <span className="text-green-600">✅ Verified Seller</span>
//                                 </div>
//                                 <hr className="border-gray-200" />
//                                 {/* Price Section */}
//                                 <div>
//                                     <span className="text-2xl font-bold text-green-700 tracking-tight">
//                                         {'₵'} {(convertedPriceValue || finalPriceCents / 100)?.toFixed(2)}
//                                     </span>
//                                     <del className="ml-2 text-sm text-gray-400">₵400</del>
//                                     <p className="text-sm text-gray-500">You Save: ₵200 (2%)</p>
//                                 </div>
//                                 <MultiBuySection product={product} />
//                                 {/* Dynamic Variant Selectors */}
//                                 <div className="space-y-4 my-4">
//                                     {variants && variants.length > 0 && variants.map((variant) => (
//                                         variant.values && variant.values.length > 0 && (
//                                             <div key={variant.id}>
//                                                 <p className="text-sm font-medium text-gray-700 mb-1">
//                                                     {variant.label}
//                                                 </p>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {variant.values.map((val) => (
//                                                         <button
//                                                             key={val.id}
//                                                             onClick={() =>
//                                                                 setSelectedVariants(prev => ({
//                                                                     ...prev,
//                                                                     [variant.id]: val,
//                                                                 }))
//                                                             }
//                                                             className={`px-4 ${val.additional_price_cents == 0 && 'py-2'} border rounded-full text-sm ${selectedVariants[variant.id]?.id === val.id
//                                                                     ? "border-black font-semibold"
//                                                                     : "border-gray-300 text-gray-700"
//                                                                 }`}
//                                                         >
//                                                             <div>{val.value}</div>
                                                            
//                                                             <div className=" text-gray-900 text-[10px]">
//                                                                 {val.additional_price_cents > 0 &&
//                                                                     ` (+${'₵'}${(convertPrice(val.additional_price_cents / 100, price_currency, "GHS", exchangeRates)).toFixed(2)})`}
//                                                             </div>
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )
//                                     ))}
//                                 </div>
//                                 <div className="grid gap-2">
//                                     <button className="btn-base btn-primary" onClick={handleDirectBuyNow}>
//                                         Buy Now
//                                     </button>
//                                     <button className="btn-base btn-outline" onClick={handleAddToBasket}>
//                                         Add to Basket
//                                     </button>
//                                     <button className="btn-base btn-outline">Buy Now Pay Later (BNPL)</button>
//                                     <button className="btn-base btn-outline flex items-center justify-center gap-2">
//                                         <FaRegHeart /> Add to Watchlist
//                                     </button>
//                                 </div>
//                                 <PaymentDeliveryReturns />
//                             </div>
//                         </section>
//                         <DescriptionAndReviews
//                             details={description}
//                             condition={product?.condition}
//                             user={product?.user}
//                             shop={shop}
//                             product={product}
//                         />
//                     </div>
//                     {/* END LEFT CONTENT */}
//                     {/* RIGHT SIDEBAR */}
//                     <aside className="order-2 hidden xl:block xl:col-span-5">
//                         <div className="sticky top-0 space-y-4 p-5">
//                             <h1 className="heading-lg text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">{title}</h1>
//                             {shop && (
//                                 <div className="text-sm text-gray-500">
//                                     <Link href={`/shops/${shop?.slug}`}>
//                                         <b>4480 sold</b> — Visit the <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
//                                     </Link>
//                                 </div>
//                             )}
//                             <div className="flex items-center text-sm text-yellow-400 gap-2">
//                                 <MdArrowRightAlt className="h-4 w-4" />
//                                 <span>4.5</span>
//                                 <span>★★★★☆</span>
//                                 <span className="underline text-blue-600">595 Reviews</span>
//                                 <span className="text-green-600">✅ Verified Seller</span>
//                             </div>
//                             <hr className="my-3 border-gray-200" />
//                             {/* Dynamic Variant Selectors for Desktop */}
//                             <div className="space-y-4 my-4">
//                                 {variants && variants.length > 0 && variants.map((variant) => (
//                                     variant.values && variant.values.length > 0 && (
//                                         <div key={variant.id}>
//                                             <div className="flex items-center justify-between">
//                                                 <p className="text-sm font-medium text-gray-700 mb-1">
//                                                     {variant.label}
//                                                 </p>
//                                                 <span className="text-sm text-gray-400">{sku}</span>
//                                             </div>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {variant.values.map((val) => (
//                                                     <button
//                                                         key={val.id}
//                                                         onClick={() =>
//                                                             setSelectedVariants(prev => ({
//                                                                 ...prev,
//                                                                 [variant.id]: val,
//                                                             }))
//                                                         }
//                                                         className={`px-4 ${val.additional_price_cents == 0 && 'py-2'} border rounded-full text-sm ${selectedVariants[variant.id]?.id === val.id
//                                                                 ? "border-black font-semibold"
//                                                                 : "border-gray-300 text-gray-700"
//                                                             }`}
//                                                     >
//                                                         <div>{val.value}</div>
//                                                         <div className=" text-gray-900 text-[10px]">
//                                                             {val.additional_price_cents > 0 &&
//                                                                 ` (+${'₵'}${(convertPrice(val.additional_price_cents / 100, price_currency, "GHS", exchangeRates )).toFixed(2)})`}
//                                                         </div>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )
//                                 ))}
//                             </div>
//                             <hr className="my-3 border-gray-200" />
//                             <div className="gap-4">
//                                 <span className="text-3xl font-bold text-green-700 tracking-tight">
//                                     {'₵'} {(convertedPriceValue || finalPriceCents / 100)?.toFixed(2)}
//                                 </span>
//                                 {saleEndDate && saleEndDate > now && (
//                                     <span className="ml-4 text-sm text-red-700 font-medium">
//                                         Sales ends in {timeRemaining.days} days {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="flex items-center gap-4 mb-6">
//                                 <span className="text-sm font-medium text-gray-800">In stock</span>
//                                 <div className="flex items-center rounded-md border border-gray-300 overflow-hidden w-fit">
//                                     <button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black focus:outline-none"
//                                     >
//                                         –
//                                     </button>
//                                     <div className="w-12 h-10 flex items-center justify-center border-x text-lg font-medium text-black">
//                                         {quantity}
//                                     </div>
//                                     <button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black focus:outline-none"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             </div>
//                             {product_quantity > 1 && <MultiBuySection product={product} />}
//                             <div className="mt-4 space-y-2">
//                                 <button className="btn-base btn-primary w-full" onClick={handleDirectBuyNow}>
//                                     Buy Now
//                                 </button>
//                                 <button className="btn-base btn-outline w-full" onClick={handleAddToBasket}>
//                                     Add to Basket
//                                 </button>
//                                 <button
//                                     onClick={handleAddToWatchlist}
//                                     className="btn-base btn-outline w-full flex items-center justify-center gap-2"
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <div className="flex space-x-2 justify-center items-center h-6">
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
//                                             <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
//                                         </div>
//                                     ) : (
//                                         <>
//                                             <FaRegHeart />
//                                             <span>Add to Watchlist</span>
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                             <PaymentDeliveryReturns />
//                         </div>
//                     </aside>
//                     {/* END RIGHT SIDEBAR */}
//                     <BasketModal
//                         isModalVisible={isModalVisible}
//                         handleCloseModal={handleCloseModal}
//                         basket={basket}
//                         handleQuantityChange={handleQuantityChange}
//                         handleRemoveProduct={handleRemoveProduct}
//                     />
//                 </div>
//             </div>
//             {isDirectBuyPopupVisible && (
//                 <DirectBuyPopup
//                     product={product}
//                     isVisible={isDirectBuyPopupVisible}
//                     onClose={() => setIsDirectBuyPopupVisible(false)}
//                 />
//             )}
//         </section>
//     );
// }



"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import MultiBuySection from "../MultiBuySection";
import BasketModal from "../BasketModal";
import PaymentDeliveryReturns from "../PaymentDeliveryReturns";
import DescriptionAndReviews from "../DescriptionAndReviews";
import RecentlyViewed from "../RecentlyViewed";
import ProductSlider from "./ProductSlider";
import InfoPopover from "../InfoPopover";
import DirectBuyPopup from "../DirectBuyPopup";
import { convertPrice } from "@/app/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
import { MdArrowRightAlt } from "react-icons/md";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import { useRouter, usePathname } from "next/navigation";

/**
 * Breadcrumbs Component
 */
const Breadcrumbs = ({ categoryTree, title }) => {
    const flattenCategoryChain = (node) => {
        const chain = [];
        let current = node;
        while (current) {
            chain.push(current);
            if (current.children && current.children.length > 0) {
                current = current.children[0];
            } else {
                break;
            }
        }
        return chain;
    };

    const categoryChain = categoryTree ? flattenCategoryChain(categoryTree) : [];

    return (
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin text-sm text-gray-500">
            <Link href="/">
                <span className="text-blue-600 hover:underline">Upfrica</span>
            </Link>
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

export default function ProductDetailSection({ product }) {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const currentPath = usePathname();
    const basket = useSelector((state) => state.basket.items) || [];
    const exchangeRates = useSelector((state) => state.exchangeRates.rates);
    const router = useRouter();

    const {
        id,
        title,
        description,
        price_cents,
        sale_price_cents,
        price_currency,
        sale_end_date,
        sale_start_date,
        product_video,
        product_images,
        condition,
        category,
        shop,
        user,
        product_quantity,
        variants
    } = product || {};

    // Variant selection state
    const [selectedVariants, setSelectedVariants] = useState({});
    useEffect(() => {
        if (variants && variants.length > 0) {
            const defaults = {};
            variants.forEach((variant) => {
                if (variant.values && variant.values.length > 0) {
                    defaults[variant.id] = variant.values[0];
                }
            });
            setSelectedVariants(defaults);
        }
    }, [variants]);

    // Emit color change for slider
    useEffect(() => {
        if (variants && variants.length > 0) {
            const colorVariant = variants.find((v) =>
                v.label.toLowerCase().includes("color")
            );
            if (colorVariant && selectedVariants[colorVariant.id]) {
                window.dispatchEvent(
                    new CustomEvent("updateSelectedColor", {
                        detail: selectedVariants[colorVariant.id].value.toLowerCase(),
                    })
                );
            }
        }
    }, [selectedVariants, variants]);

    // SKU and additional pricing
    const sku =
        "SKU-" +
        Object.values(selectedVariants)
            .map((opt) => opt.value.replace(/\s+/g, "-").toUpperCase())
            .join("-");
    const totalAdditionalCents = Object.values(selectedVariants).reduce(
        (acc, opt) => acc + (opt.additional_price_cents || 0),
        0
    );

    // Sale logic & prices
    const saleEndDate = sale_end_date ? new Date(sale_end_date) : null;
    const now = new Date();
    const saleActive = saleEndDate && saleEndDate > now;

    const basePriceCents = saleActive ? sale_price_cents : price_cents;
    const activePriceCents = basePriceCents + totalAdditionalCents;
    const originalPriceCents = price_cents + totalAdditionalCents;

    const activePrice = convertPrice(
        activePriceCents / 100,
        price_currency,
        "GHS",
        exchangeRates
    ).toFixed(2);

    const originalPrice = saleActive
        ? convertPrice(
            originalPriceCents / 100,
            price_currency,
            "GHS",
            exchangeRates
        ).toFixed(2)
        : null;

    // Countdown state
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (!saleActive) return;

        const update = () => {
            const diff = saleEndDate - new Date();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining({ days, hours, minutes, seconds });
        };

        update();
        const intervalId = setInterval(update, 1000);
        return () => clearInterval(intervalId);
    }, [saleEndDate, saleActive]);

    // Media items (video first, then images)
    const mediaItems = product_video
        ? [
            { type: "video", src: product_video },
            ...product_images.map((img) => ({ type: "image", src: img })),
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

    const handleAddToWatchlist = async () => {
        if (!token) {
            router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                "https://media.upfrica.com/api/wishlist/",
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Token " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ product_id: id, note: "" }),
                }
            );
            console.log(await response.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToBasket = () => {
        const productData = {
            id,
            title,
            price_cents: activePriceCents,
            quantity,
            image: product_images,
            variants: selectedVariants,
            sku,
        };
        dispatch(addToBasket(productData));
        setIsModalVisible(true);
    };

    const handleCloseModal = () => setIsModalVisible(false);
    const handleQuantityChange = (id, newQty) =>
        dispatch(updateQuantity({ id, quantity: newQty }));
    const handleRemoveProduct = (id) => dispatch(removeFromBasket(id));

    // Component state
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);

    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
            <RecentlyViewed product={product} />

            <div data-sticky-container>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* LEFT CONTENT */}
                    <div className="order-1 xl:col-span-7">
                        <Breadcrumbs categoryTree={category?.category_tree} title={title} />

                        <section className="mt-2">
                            <ProductSlider images={mediaItems} />
                        </section>

                        {/* MOBILE CTA */}
                        <section className="block xl:hidden mt-5">
                            <div className="bg-white space-y-4 p-4">
                                <h1 className="heading-lg text-base md:text-lg lg:text-xl font-bold text-gray-800">
                                    {title}
                                </h1>
                                {shop && (
                                    <div className="text-sm text-gray-500">
                                        <Link href={`/shops/${shop.slug}`}>
                                            <b>4480 sold</b> — Visit the{" "}
                                            <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
                                        </Link>
                                    </div>
                                )}

                                {/* Price */}
                                <div>
                                    {saleActive ? (
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-2xl font-bold text-green-700 tracking-tight">
                                                ₵{activePrice}
                                            </span>
                                            <del className="text-gray-400">₵{originalPrice}</del>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-green-700 tracking-tight">
                                            ₵{activePrice}
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

                                <MultiBuySection product={product} />

                                {/* Variant selectors */}
                                <div className="space-y-4 my-4">
                                    {variants &&
                                        variants.map((variant) =>
                                            variant.values && variant.values.length > 0 ? (
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
                                                                <div>{val.value}</div>
                                                                {val.additional_price_cents > 0 && (
                                                                    <div className="text-gray-900 text-[10px]">
                                                                        +₵
                                                                        {convertPrice(
                                                                            val.additional_price_cents / 100,
                                                                            price_currency,
                                                                            "GHS",
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
                                        onClick={handleAddToWatchlist}
                                        disabled={loading}
                                    >
                                        <FaRegHeart />
                                        Add to Watchlist
                                    </button>
                                </div>

                                <PaymentDeliveryReturns />
                            </div>
                        </section>

                        <DescriptionAndReviews
                            details={description}
                            condition={condition}
                            user={user}
                            shop={shop}
                            product={product}
                        />
                    </div>
                    {/* END LEFT CONTENT */}

                    {/* RIGHT SIDEBAR */}
                    <aside className="order-2 hidden xl:block xl:col-span-5">
                        <div className="sticky top-0 space-y-4 p-5">
                            <h1 className="heading-lg text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                                {title}
                            </h1>
                            {shop && (
                                <div className="text-sm text-gray-500">
                                    <Link href={`/shops/${shop.slug}`}>
                                        <b>4480 sold</b> — Visit the{" "}
                                        <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra,
                                        GH
                                    </Link>
                                </div>
                            )}
                            <div className="flex items-center text-sm text-yellow-400 gap-2">
                                <MdArrowRightAlt className="h-4 w-4" />
                                <span>4.5</span>
                                <span>★★★★☆</span>
                                <span className="underline text-blue-600">595 Reviews</span>
                                <span className="text-green-600">✅ Verified Seller</span>
                            </div>

                            <hr className="my-3 border-gray-200" />

                            {/* Desktop Variant selectors */}
                            <div className="space-y-4 my-4">
                                {variants &&
                                    variants.map((variant) =>
                                        variant.values && variant.values.length > 0 ? (
                                            <div key={variant.id}>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                                        {variant.label}
                                                    </p>
                                                    <span className="text-sm text-gray-400">{sku}</span>
                                                </div>
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
                                                            <div>{val.value}</div>
                                                            {val.additional_price_cents > 0 && (
                                                                <div className="text-gray-900 text-[10px]">
                                                                    +₵
                                                                    {convertPrice(
                                                                        val.additional_price_cents / 100,
                                                                        price_currency,
                                                                        "GHS",
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

                            <hr className="my-3 border-gray-200" />

                            {/* Price & countdown */}
                            <div className="gap-4">
                                {saleActive ? (
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-3xl font-bold text-green-700 tracking-tight">
                                            ₵{activePrice}
                                        </span>
                                        <del className="text-gray-400 text-sm">₵{originalPrice}</del>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-green-700 tracking-tight">
                                        ₵{activePrice}
                                    </span>
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

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-medium text-gray-800">
                                    In stock
                                </span>
                                <div className="flex items-center rounded-md border border-gray-300 overflow-hidden w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black focus:outline-none"
                                    >
                                        –
                                    </button>
                                    <div className="w-12 h-10 flex items-center justify-center border-x text-lg font-medium text-black">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black focus:outline-none"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {product_quantity > 1 && <MultiBuySection product={product} />}

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
                                    onClick={handleAddToWatchlist}
                                    className="btn-base btn-outline w-full flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex space-x-2 justify-center items-center h-6">
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                                        </div>
                                    ) : (
                                        <>
                                            <FaRegHeart />
                                            <span>Add to Watchlist</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <PaymentDeliveryReturns />
                        </div>
                    </aside>
                    {/* END RIGHT SIDEBAR */}

                    <BasketModal
                        isModalVisible={isModalVisible}
                        handleCloseModal={handleCloseModal}
                        basket={basket}
                        handleQuantityChange={handleQuantityChange}
                        handleRemoveProduct={handleRemoveProduct}
                    />
                </div>
            </div>

            {isDirectBuyPopupVisible && (
                <DirectBuyPopup
                    product={product}
                    isVisible={isDirectBuyPopupVisible}
                    onClose={() => setIsDirectBuyPopupVisible(false)}
                />
            )}
        </section>
    );
}


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
import { FaMinus, FaPlus, FaRegHeart, FaSearch, FaEdit } from "react-icons/fa";
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
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin text-sm text-gray-500 scrollbar-hide">
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

export default function ProductDetailSection({ product, relatedProducts }) {
    // console.log("detles product", product);
    const [selectedMultiBuyTier, setSelectedMultiBuyTier] = useState(null);

    // console.log("selectedMultiBuyTier",selectedMultiBuyTier);
    

    const { token, user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const currentPath = usePathname();
    const basket = useSelector((state) => state.basket.items) || [];
    const exchangeRates = useSelector((state) => state.exchangeRates.rates);
    const router = useRouter();

    // Component state
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);

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
        if (!sale_end_date) return;                // depend on the *string* prop

        const saleEnd = new Date(sale_end_date);   // build the Date inside the effect

        const update = () => {
            const diff = saleEnd - new Date();
            setTimeRemaining({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };

        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [sale_end_date]);  // 

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
            const res = await response.json();
            console.log(res)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // console.log("quantity",quantity);


    // const handleAddToBasket = () => {
    //     const productData = {
    //         id,
    //         title,
    //         price_cents: activePriceCents,
    //         quantity,
    //         image: product_images,
    //         variants: selectedVariants,
    //         sku,
    //     };
    //     dispatch(addToBasket(productData));
    //     setIsModalVisible(true);
    // };


    const handleAddToBasket = () => {
        const productData = {
          id,
          title,
          price_cents: activePriceCents,
          quantity: selectedMultiBuyTier
            ? selectedMultiBuyTier.minQuantity  // টিয়ার অনুযায়ী qty
            : quantity,                         // না থাকলে যেটা default
          image: product_images,
          variants: selectedVariants,
          sku,
          // চাইলে price_each: selectedMultiBuyTier?.price
        };
        dispatch(addToBasket(productData));
        setIsModalVisible(true);
      };
      

    const handleCloseModal = () => setIsModalVisible(false);
    const handleQuantityChange = (id, newQty) =>
        dispatch(updateQuantity({ id, quantity: newQty }));
    const handleRemoveProduct = (id) => dispatch(removeFromBasket(id));




    // console.log(quantity);


    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
            <RecentlyViewed product={product} />

            <div data-sticky-container>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* LEFT CONTENT */}
                    <div className="order-1 xl:col-span-7">
                        <Breadcrumbs categoryTree={category?.category_tree} title={title} />

                        <section className="mt-2">
                            <ProductSlider mediaItems={mediaItems} />
                        </section>

                        {/* MOBILE CTA */}
                        <section className="block xl:hidden mt-5">
                            < Link href={`/products/edit/${product?.slug}`} className="flex items-center gap-2">
                                <FaEdit className="h-4 w-4 text-violet-700" />
                                <span className="text-violet-700 hover:underline">Edit</span>
                            </Link>
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

                                <PaymentDeliveryReturns
                                    secondaryData={product?.secondary_data}
                                    dispatchTime={product?.dispatch_time_in_days}
                                />

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
                            {currentUser?.username === product?.user?.username || currentUser?.admin === true && <Link href={`/products/edit/${product?.slug}`} className="flex items-center gap-2">
                                <FaEdit className="h-4 w-4 text-violet-700" />
                                <span className="text-violet-700 hover:underline">Edit</span>
                            </Link>}
                            <h1 className="heading-lg text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                                {title}
                            </h1>
                            {shop && (
                                <div className="text-sm text-gray-500">
                                    <Link href={`/shops/${shop?.slug}`}>
                                        <b>4480 sold</b> | Sold by the <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
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

                            {/* Dynamic Variant Selectors for Desktop */}
                            <div className="space-y-4 my-4">

                                {currentUser?.username === product?.user?.username || currentUser?.admin == true && <Link href={`/products/edit/variants/${product?.id}`} className="flex items-center gap-2">
                                    <FaEdit className="h-4 w-4 text-violet-700" />
                                    <span className="text-violet-700 hover:underline">Edit Variants</span>
                                </Link>}

                                {variants && variants.length > 0 && (
                                    <>
                                        <hr className="my-3 border-gray-200" />
                                        {/* <Link href={`/products/edit/variants/${product?.id}`} className="flex items-center gap-2">
                                        <FaEdit className="h-4 w-4 text-violet-700" />
                                        <span className="text-violet-700 hover:underline">Edit Variants</span>
                                    </Link> */}
                                        {variants.map((variant) => (
                                            variant.values && variant.values.length > 0 && (
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
                                                                    setSelectedVariants(prev => ({
                                                                        ...prev,
                                                                        [variant.id]: val,
                                                                    }))
                                                                }
                                                                className={`px-4 ${val.additional_price_cents == 0 && 'py-2'} border rounded-full text-sm ${selectedVariants[variant.id]?.id === val.id
                                                                    ? "border-black font-semibold"
                                                                    : "border-gray-300 text-gray-700"
                                                                    }`}
                                                            >
                                                                <div>{val.value}</div>
                                                                <div className=" text-gray-900 text-[10px]">
                                                                    {val.additional_price_cents > 0 &&
                                                                        ` (+₵${(convertPrice(val.additional_price_cents / 100, price_currency, "GHS", exchangeRates)).toFixed(2)})`}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </>
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

                            {/* MultiBuySection */}

                            {/* {product_quantity > 1 && <MultiBuySection product={product} />} */}

                            {/* আগের কোড */}
                            {product_quantity > 1 && (
                                <MultiBuySection
                                    product={product}
                                    onTierSelect={setSelectedMultiBuyTier}  // ➋: পাস করি setter ফাংশন
                                    selectedTier={selectedMultiBuyTier}     // ➌: পাস করি আপনা একটিভ টিয়ার
                                />
                            )}


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

                            <PaymentDeliveryReturns
                                secondaryData={product?.secondary_data}
                                dispatchTime={product?.dispatch_time_in_days}
                            
                            />
                        </div>
                    </aside>
                    {/* END RIGHT SIDEBAR */}

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

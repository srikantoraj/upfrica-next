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
import DirectBuyPopup from "../DirectBuyPopup"; // Import the new direct buy popup component
import { convertPrice } from "@/app/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, updateQuantity, removeFromBasket } from "../../app/store/slices/cartSlice";
import { MdArrowRightAlt } from "react-icons/md";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import { useRouter, usePathname } from "next/navigation";

/**
 * Breadcrumbs Component
 * Receives a nested category tree (categoryTree) and a product title.
 * It traverses the tree (assuming a single chain via the first child) and renders each
 * category as a clickable link using Next.js Link. The product title is rendered as plain text.
 */
const Breadcrumbs = ({ categoryTree, title }) => {
    // Helper function to flatten the nested chain.
    // Assumes that each "children" array contains at most one child in the chain.
    const flattenCategoryChain = (node) => {
        const chain = [];
        let current = node;
        while (current) {
            chain.push(current);
            // Move to the first child if available.
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
            {/* Root link */}
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
        price_currency,
        sale_end_date,
        sale_start_date,
        product_video,
        product_images,
        seller_town,
        condition,
        category,
        shop,
        user,
        product_quantity,
    } = product || {};

    // Variation options (new branch design)
    const colors = ["Oak", "Dark Walnut", "White", "Dark", "Grey", "Green", "Red", "Purple", "Black Walnut"];
    const sizes = ["2-Seater", "4-Seater", "6-Seater", "8-Seater", "10-Seater", "12-Seater", "20-Seater"];
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const sku = `SKU-${selectedSize}-${selectedColor.replace(/\s+/g, "-").toUpperCase()}`;

    // Product quantity for adding to basket
    const [loading, setLoading] = useState(false);

    const [quantity, setQuantity] = useState(1);

    // State for basket modal and direct buy popup
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);

    // Calculate the converted price using your utility
    const convertedPrice = convertPrice(price_cents / 100, price_currency, "GHS", exchangeRates);

    // Countdown: time remaining until sale_end_date
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        if (sale_end_date) {
            const saleEnd = new Date(sale_end_date);
            const current = new Date();
            const remaining = saleEnd - current;
            setTimeRemaining({
                days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
                hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((remaining / (1000 * 60)) % 60),
                seconds: Math.floor((remaining / 1000) % 60),
            });
        }
    }, [sale_start_date, sale_end_date]);

    // Inform ProductSlider (if needed) about color change
    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("updateSelectedColor", {
                detail: selectedColor.toLowerCase(),
            })
        );
    }, [selectedColor]);

    // Build unified media items: if a product video exists, show it first; then list images.
    const mediaItems = product_video
        ? [{ type: "video", src: product_video }, ...product_images.map((img) => ({ type: "image", src: img }))]
        : product_images;

    // Handler for triggering the direct buy popup
    const handleDirectBuyNow = () => {
        if (!token) {
            router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
            return;
        }
        setIsDirectBuyPopupVisible(true);
    };
    const handleAddToWatchlist = async() => {
        console.log("Add to watchlist clicked");
        // Assuming `token` is used to check if the user is logged in
        if (!token) {
            router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
            return;
        }
        setLoading(true);

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + token);
        myHeaders.append("Content-Type", "application/json");

        // Define the payload; here note is set explicitly
        const raw = JSON.stringify({
            "product_id": id,    // product id from your product object
            "note": "" // the note to send (make sure it’s not an empty string)
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://media.upfrica.com/api/wishlist/", requestOptions);
            // You can parse as JSON if your API returns JSON data
            const result = await response.json();
            console.log("Wishlist API result:", result);
            // Optionally, update your UI to show a success message here
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        } finally {
            // Turn off the loader after the API call completes
            setLoading(false);
        }
    };

    // Handler for Add to Basket (kept for other actions)
    const handleAddToBasket = () => {
        const productData = {
            id,
            title,
            price_cents,
            quantity,
            image: product_images,
            color: selectedColor,
            size: selectedSize,
        };
        dispatch(addToBasket(productData));
        setIsModalVisible(true);
    };

    const handleCloseModal = () => setIsModalVisible(false);

    const handleQuantityChange = (id, newQuantity) => {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
    };

    const handleRemoveProduct = (id) => {
        dispatch(removeFromBasket(id));
    };

    return (
        <section className="pt-6 md:pt-8 lg:pt-10">
            {/* Recently viewed product section */}
            <RecentlyViewed product={product} />
            <div data-sticky-container>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* LEFT CONTENT */}
                    <div className="order-1 xl:col-span-7">
                        {/* Render dynamic breadcrumbs using the Breadcrumbs component */}
                        <Breadcrumbs categoryTree={category?.category_tree} title={title} />

                        {/* Product image/video slider */}
                        <section className="mt-2">
                            <ProductSlider images={mediaItems} />
                        </section>

                        {/* MOBILE CTA */}
                        <section className="block xl:hidden mt-5">
                            <div className="bg-white p-4 space-y-4">
                                <h1 className="heading-lg text-base md:text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
                                {shop && (
                                    <div className="text-sm text-gray-500">
                                        <Link href={`/shop/${shop?.slug}`}>
                                            <b>4480 sold</b> — Visit the <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
                                        </Link>
                                    </div>
                                )}
                                <div className="flex items-center text-sm space-x-2">
                                    <span className="text-yellow-400">★★★★☆</span>
                                    <span className="underline text-blue-600">595 Reviews</span>
                                    <span className="text-green-600">✅ Verified Seller</span>
                                </div>
                                <hr className="border-gray-200" />
                                {/* Price Section */}
                                <div>
                                    <span className="text-2xl font-bold text-green-700 tracking-tight">
                                        {price_currency} {(convertedPrice || price_cents / 100)?.toFixed(2)}
                                    </span>
                                    <del className="ml-2 text-sm text-gray-400">₵400</del>
                                    <p className="text-sm text-gray-500">You Save: ₵200 (2%)</p>
                                </div>
                                <MultiBuySection product={product} />
                                {/* Variation Selectors */}
                                <div className="space-y-4 my-4">
                                    {/* Color Selector */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Color</p>
                                        <div className="flex flex-wrap gap-2">
                                            {colors.map((color, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-4 py-2 border rounded-full text-sm ${selectedColor === color ? "border-black font-semibold" : "border-gray-300 text-gray-700"
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Size Selector */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Size</p>
                                            <span className="text-sm text-gray-400">{sku}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {sizes.map((size, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-4 py-2 border rounded-full text-sm ${selectedSize === size ? "border-black font-semibold" : "border-gray-300 text-gray-700"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    {/* “Buy Now” now calls the direct buy handler */}
                                    <button className="btn-base btn-primary" onClick={handleDirectBuyNow}>
                                        Buy Now
                                    </button>
                                    <button className="btn-base btn-outline" onClick={handleAddToBasket}>
                                        Add to Basket
                                    </button>
                                    <button className="btn-base btn-outline">Buy Now Pay Later (BNPL)</button>
                                    <button className="btn-base btn-outline flex items-center justify-center gap-2">
                                        <FaRegHeart /> Add to Watchlist
                                    </button>
                                </div>
                                <PaymentDeliveryReturns />
                            </div>
                        </section>
                        <DescriptionAndReviews details={description} user={product?.user} />
                    </div>
                    {/* END LEFT CONTENT */}
                    {/* RIGHT SIDEBAR */}
                    <aside className="order-2 hidden xl:block xl:col-span-5">
                        <div className="sticky top-0 space-y-4 p-5">
                        <h1 className="heading-lg text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">{title}</h1>
                            {shop && <div className="text-sm text-gray-500">
                                <Link href={`/shop/${shop?.slug}`}>

                                    <b>4480 sold</b> — Visit the <b className="text-[#8710D8]">{shop.name}</b> Shop — Accra, GH
                                </Link>
                            </div>}
                            <div className="flex items-center text-sm text-yellow-400 gap-2">
                                <MdArrowRightAlt className="h-4 w-4" />
                                <span>4.5</span>
                                <span>★★★★☆</span>
                                <span className="underline text-blue-600">595 Reviews</span>
                                <span className="text-green-600">✅ Verified Seller</span>
                            </div>
                            <hr className="my-3 border-gray-200" />
                            {/* Variation selectors for desktop */}
                            <div className="space-y-4 my-4">
                                {/* Color Selector */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Color</p>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 border rounded-full text-sm ${selectedColor === color ? "border-black font-semibold" : "border-gray-300 text-gray-700"
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Size Selector */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Size</p>
                                        <span className="text-sm text-gray-400">{sku}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-full text-sm ${selectedSize === size ? "border-black font-semibold" : "border-gray-300 text-gray-700"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr className="my-3 border-gray-200" />
                            <div className="gap-4">
                                <span className="text-3xl font-bold text-green-700 tracking-tight">
                                    {price_currency} {(convertedPrice || price_cents / 100)?.toFixed(2)}
                                </span>
                                <span className="ml-4 text-sm text-red-700 font-medium">
                                    Sales ends in {timeRemaining.days} days {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-800">In stock</span>
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

                            <div className="text-sm text-gray-700 flex items-center gap-1">
                                Condition: <span className="font-semibold">{condition?.name}</span>
                                <InfoPopover content="Displays all product details fully expanded." link="/help-center/full-product-details" />
                            </div>
                            <MultiBuySection />
                            <div className="mt-4 space-y-2">
                                {/* “Buy Now” button now calls the direct buy handler */}
                                <button className="btn-base btn-primary w-full" onClick={handleDirectBuyNow}>
                                    Buy Now
                                </button>
                                <button className="btn-base btn-outline w-full" onClick={handleAddToBasket}>
                                    Add to Basket
                                </button>
                                <button className="btn-base btn-outline w-full flex items-center justify-center gap-2">
                                    Buy Now Pay Later (BNPL) <ImInfo className="h-4 w-4" />
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
                    {/* Existing Basket Modal */}
                    <BasketModal
                        isModalVisible={isModalVisible}
                        handleCloseModal={handleCloseModal}
                        basket={basket}
                        handleQuantityChange={handleQuantityChange}
                        handleRemoveProduct={handleRemoveProduct}
                    />
                </div>
            </div>
            {/* Direct Buy Popup */}
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

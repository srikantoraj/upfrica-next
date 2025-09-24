"use client";

import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { HiXMark } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// ✅ same image path used in Slider & Basket
import SafeImage, { fixDisplayUrl } from "@/components/common/SafeImage";
import { FALLBACK_IMAGE } from "@/lib/image";

// ✅ localization / FX
import { useLocalization } from "@/contexts/LocalizationProvider";
import { symbolFor } from "@/lib/pricing-mini";

/* ---------- tiny helpers ---------- */

const LoadingDots = ({ color = "white" }) => {
  const style = { backgroundColor: color };
  return (
    <div className="flex space-x-1 justify-center items-center h-5">
      <div className="h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={style} />
      <div className="h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={style} />
      <div className="h-2 w-2 rounded-full animate-bounce" style={style} />
    </div>
  );
};

/* ---------- image helpers (mirrors BasketSheet) ---------- */

const toDisplayUrl = (raw) =>
  (typeof raw === "string" && raw.trim() ? fixDisplayUrl(raw) : FALLBACK_IMAGE) || FALLBACK_IMAGE;

const pickFromMediaList = (list) => {
  for (const it of list || []) {
    if (!it) continue;
    if (typeof it === "string" && it.trim()) return it;
    const u =
      it.image_url || it.url || it.src || it.secure_url || it.path || it.thumbnail || it.image;
    if (typeof u === "string" && u.trim()) return u;
  }
  return null;
};

const resolvePrimaryImage = (p) => {
  if (!p) return "";
  const singles = [
    p.card_image,
    p.card_image_url,
    p.thumbnail,
    p.image_url,
    p.image,
    p.main_image,
    p.product_image,
    p.product_image_url,
  ];
  for (const v of singles) if (typeof v === "string" && v.trim()) return v;

  const arrays = [
    p.product_images,
    p.images,
    p.imageObjects,
    p.image_objects,
    p.gallery,
    p.photos,
    p.media,
    p.assets,
    p.thumbnails,
    p.image, // sometimes an array
  ];
  for (const arr of arrays) {
    const picked = pickFromMediaList(arr);
    if (picked) return picked;
  }
  return "";
};

/* ---------- currency / FX helpers ---------- */

const currencyOf = (p) =>
  String(
    p?.price_currency ??
      p?.currency ??
      p?.seller_currency ??
      p?.sellerCurrency ??
      "USD"
  ).toUpperCase();

const amountOnly = (n, currency, locale = "en") => {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).formatToParts(Number(n || 0));
    return parts.filter((p) => p.type !== "currency").map((p) => p.value).join("").trim();
  } catch {
    return Number(n || 0).toFixed(2);
  }
};

const convMajorSafe = (major, fromCcy, convert, toCcy) => {
  const n = Number(major || 0);
  const src = String(fromCcy || "USD").toUpperCase();
  const dst = String(toCcy || src).toUpperCase();
  if (!convert || src === dst) return n;
  const out = Number(convert(n, src, dst));
  return Number.isFinite(out) && out >= 0 ? out : n;
};

/* ---------- component ---------- */

export default function DirectBuyPopup({
  selectedAddressId,
  setSelectedAddressId,
  isAddressLoading,
  addresses,
  product,
  isVisible,
  onClose,
  quantity,
}) {
  const router = useRouter();
  const { token } = useSelector((s) => s.auth) || {};

  // Deliver-to prefs
  const { country: uiCountry, currency: uiCurrency, convert, resolvedLanguage } = useLocalization();
  const isGH = String(uiCountry || "").trim().toLowerCase().startsWith("gh");
  const symbol = useMemo(
    () => symbolFor(uiCurrency || "USD", resolvedLanguage || "en") || "₵",
    [uiCurrency, resolvedLanguage]
  );

  // Auto-decide payment method (no radios shown)
  const [paymentMethod, setPaymentMethod] = useState(isGH ? "paystack" : "stripe");
  useEffect(() => {
    setPaymentMethod(isGH ? "paystack" : "stripe");
  }, [isGH]);

  const [acceptedPolicy, setAcceptedPolicy] = useState(true);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [error, setError] = useState("");

  const [directBuyQuantity, setDirectBuyQuantity] = useState(quantity);
  const [selectedProduct, setSelectedProduct] = useState({
    id: product?.id,
    image: toDisplayUrl(resolvePrimaryImage(product)),
    title: product?.title || "",
    price: product?.price_cents || 0, // cents (seller currency)
    currency: product?.price_currency || "USD",
  });

  // refresh per open
  useEffect(() => {
    if (!isVisible) return;
    setDirectBuyQuantity(quantity);
    setSelectedProduct({
      id: product?.id,
      image: toDisplayUrl(resolvePrimaryImage(product)),
      title: product?.title || "",
      price: product?.price_cents || 0,
      currency: product?.price_currency || "USD",
    });
  }, [isVisible, quantity, product]);

  // prevent background scroll + ESC close
  useEffect(() => {
    if (!isVisible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isVisible, onClose]);

  const decrementQuantity = () =>
    setDirectBuyQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const incrementQuantity = () => setDirectBuyQuantity((prev) => prev + 1);

  /* ---------- price / totals in UI currency ---------- */

  const sellerCcy = currencyOf(product);

  const unitPriceMajorUI = useMemo(
    () => convMajorSafe((selectedProduct.price || 0) / 100, sellerCcy, convert, uiCurrency),
    [selectedProduct.price, sellerCcy, convert, uiCurrency]
  );

  const postageMajorUI = useMemo(() => {
    const cents = Number(product?.postage_fee_cents);
    if (!Number.isFinite(cents)) return 0;
    const baseCcy = product?.postage_fee_currency || sellerCcy;
    return convMajorSafe(cents / 100, baseCcy, convert, uiCurrency);
  }, [product?.postage_fee_cents, product?.postage_fee_currency, sellerCcy, convert, uiCurrency]);

  const totalMajorUI = useMemo(
    () => unitPriceMajorUI * directBuyQuantity + postageMajorUI,
    [unitPriceMajorUI, directBuyQuantity, postageMajorUI]
  );

  /* ---------- confirm purchase ---------- */

  const handleConfirmPurchase = async () => {
    setError("");
    if (!acceptedPolicy) {
      setError("You must agree to the rules, guidelines, and policies to continue.");
      return;
    }
    if (!selectedAddressId) {
      setError("Please choose a shipping address.");
      return;
    }

    setIsConfirmLoading(true);
    try {
      const { data, status } = await axiosInstance.post(
        "api/cart/direct-buy/",
        {
          product: selectedProduct.id,
          quantity: directBuyQuantity,
          address: selectedAddressId,
          payment_method_id: paymentMethod, // paystack for GH, stripe otherwise
        },
        {
          withCredentials: true,
          validateStatus: () => true,
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
        }
      );

      if (status === 401) {
        const next =
          typeof window !== "undefined"
            ? location.pathname + location.search + location.hash
            : "/";
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      if (status < 200 || status >= 300) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "There was an issue processing your purchase. Please try again later."
        );
      }

      if (data?.payment_url) {
        router.push(data.payment_url);
        return;
      }

      throw new Error("Payment URL not received.");
    } catch (err) {
      console.error("Direct buy error:", err);
      setError(
        err?.message ||
          "There was an issue processing your purchase. Please try again later."
      );
      setIsConfirmLoading(false);
    }
  };

  if (!isVisible) return null;

  const estimatedDelivery = (() => {
    if (product?.dispatch_time_in_days) {
      const d = new Date();
      d.setDate(d.getDate() + parseInt(product.dispatch_time_in_days, 10));
      return d.toLocaleDateString();
    }
    return "N/A";
  })();

  return (
    <div aria-modal="true" role="dialog" aria-label="Buy Now" className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
      />

      {/* Sheet */}
      <div
        className="
          fixed left-0 right-0 bottom-0
          md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:w-[680px]
          bg-white dark:bg-slate-900
          rounded-t-2xl md:rounded-2xl shadow-2xl
          max-h-[88vh] flex flex-col
          translate-y-0 animate-[slideUp_220ms_ease-out]
        "
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-2">
          <span className="h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg md:text-xl font-semibold">Buy Now</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        {/* Product row */}
        <div className="px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex gap-3">
          <div className="w-[84px] h-[84px] md:w-[96px] md:h-[96px]">
            <SafeImage
              src={selectedProduct.image || FALLBACK_IMAGE}
              alt={selectedProduct.title || "Product"}
              width={96}
              height={96}
              sizes="96px"
              className="w-full h-full object-cover rounded"
              loading="lazy"
              quality={75}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm md:text-base font-medium line-clamp-2">
              {selectedProduct.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {symbol}
              {amountOnly(unitPriceMajorUI, uiCurrency, resolvedLanguage)}
            </p>

            <div className="mt-2 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
              <button onClick={decrementQuantity} className="w-9 h-8 text-lg" aria-label="Decrease quantity">
                −
              </button>
              <div className="min-w-[2.75rem] h-8 flex items-center justify-center border-l border-r border-gray-300 dark:border-gray-700 text-sm font-semibold" aria-live="polite">
                {directBuyQuantity}
              </div>
              <button onClick={incrementQuantity} className="w-9 h-8 text-lg" aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
          <div className="space-y-1 text-sm">
            <p>
              Estimated Delivery: <span className="font-medium">{estimatedDelivery}</span>
            </p>
            <p>
              Delivery Charges:{" "}
              <span className="font-medium">
                {Number(product?.postage_fee_cents) > 0
                  ? `${symbol}${amountOnly(postageMajorUI, uiCurrency, resolvedLanguage)}`
                  : "Free"}
              </span>
            </p>
          </div>

          {product?.cancellable ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 px-3 py-2 rounded text-[13px]">
              Return Policy: Can be returned within{" "}
              {product?.secondary_data?.return_in_days || "N/A"} days (Cost by:{" "}
              {product?.secondary_data?.returns_cost_by || "N/A"}).
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-3 py-2 rounded text-[13px]">
              Return Policy: This product is not returnable.
            </div>
          )}

          <p className="text-sm">
            Total Charges:{" "}
            <span className="font-semibold">
              {symbol}
              {amountOnly(totalMajorUI, uiCurrency, resolvedLanguage)}
            </span>
          </p>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptedPolicy}
              onChange={() => setAcceptedPolicy((v) => !v)}
              className="mt-0.5"
            />
            <span>I agree to the rules, guidelines, and policies.</span>
          </label>

          {/* address */}
          {!isAddressLoading && addresses?.length > 0 && (
            <div className="overflow-hidden">
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <select
                value={selectedAddressId ?? ""}
                onChange={(e) => setSelectedAddressId?.(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm"
              >
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.value}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Sticky footer */}
        <div className="px-4 md:px-6 pt-2 pb-3">
          <button
            onClick={handleConfirmPurchase}
            disabled={isConfirmLoading || !acceptedPolicy || !selectedAddressId}
            className="w-full rounded-xl py-3 font-semibold bg-[#8710D8] text-white hover:bg-[#7610c2] disabled:opacity-60 flex items-center justify-center"
          >
            {isConfirmLoading ? <LoadingDots color="white" /> : "Confirm Purchase"}
          </button>

          {/* minimal payment hint (like screenshot) */}
          <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>🔒</span>
            <span>{isGH ? "Upfrica SafePay — MoMo & Card" : "Upfrica SafePay — Card"}</span>
            <span aria-hidden>•</span>
            <span>{isGH ? "Paystack" : "Stripe"}</span>
          </div>
        </div>
      </div>

      {/* slide-up keyframes */}
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0%); }
        }
      `}</style>
    </div>
  );
}
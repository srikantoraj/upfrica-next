// src/app/(pages)/shops/ShopProfileCard.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "next-share";

import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa"; // Add these

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaCopy,
  FaCheckCircle,
  FaEdit,
  FaTimes,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

/* ----------------------------- helpers ----------------------------- */

// Always hit /api and avoid double slashes
const API_BASE = (BASE_API_URL || "").replace(/\/+$/, "");
const apiUrl = (path) => `${API_BASE}/api/${String(path).replace(/^\/+/, "")}`;

const codeToFlag = (code) => {
  if (!code || typeof code !== "string") return "🌍";
  const cc = code.trim().slice(0, 2).toUpperCase();
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt()));
};

const deriveLocFromShop = (shop) => {
  const town = shop?.user?.town || shop?.town || shop?.user?.city || "";
  const countryObj = shop?.user?.country || shop?.country;
  const code =
    countryObj?.code ||
    shop?.user?.country_code ||
    shop?.country_code ||
    shop?.seller_country ||
    shop?.listing_country_code ||
    "";
  const flag = countryObj?.flag_emoji || (code ? codeToFlag(code) : "🌍");
  return {
    town: town || "",
    countryCode: (code || "").slice(0, 2).toUpperCase(),
    flagEmoji: flag,
  };
};

/* ------------------------------------------------------------------- */

export default function ShopProfileCard({ shop, setIsEditOpen }) {
  const router = useRouter();
  const { user: currentUser } = useSelector((s) => s.auth);
  const cleanToken = getCleanToken();

  // seller/ownership
  const shopOwnerId = shop?.user?.id ?? null;
  const isOwner = !!(currentUser?.id && shopOwnerId && currentUser.id === shopOwnerId);

  // share state
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  // follow & counts
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(undefined);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // location
  const initialLoc = deriveLocFromShop(shop);
  const [town, setTown] = useState(initialLoc.town);
  const [countryCode, setCountryCode] = useState(initialLoc.countryCode);
  const [flagEmoji, setFlagEmoji] = useState(initialLoc.flagEmoji);

  useEffect(() => {
    if (typeof window !== "undefined") setCurrentUrl(window.location.href);
  }, [router]);

  /* 1) Follow status (also provides follower count)
     NOTE: fetch even if isOwner so we can display the count. */
  useEffect(() => {
    if (!shopOwnerId) return;
    if (!cleanToken) return; // endpoint requires auth

    fetch(apiUrl(`/users/${shopOwnerId}/follow/status/`), {
      headers: { Authorization: `Token ${cleanToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;

        // Only set "isFollowing" if not owner (button is hidden for owner anyway)
        if (!isOwner) setIsFollowing(!!data.is_following);

        const fCount = Number(data.followers_count ?? data.follower_count ?? 0);
        setFollowersCount(isNaN(fCount) ? 0 : fCount);

        if (typeof data.products_count === "number") {
          setProductsCount(data.products_count);
        }
      })
      .catch(() => {});
  }, [shopOwnerId, cleanToken, isOwner]);

  /* 2) Storefront summary → location + products_count */
  useEffect(() => {
    if (!shopOwnerId) return;

    (async () => {
      try {
        const r = await fetch(apiUrl(`/users/${shopOwnerId}/storefront-summary/`), {
          cache: "no-store",
        });
        if (!r.ok) return;
        const d = await r.json();

        const nextTown = d.town || town || "";
        const c = d.country || {};
        const nextCode = (c.code || countryCode || "").slice(0, 2).toUpperCase();
        const nextFlag = c.flag_emoji || flagEmoji || (nextCode ? codeToFlag(nextCode) : "🌍");

        setTown(nextTown);
        setCountryCode(nextCode);
        setFlagEmoji(nextFlag);

        if (typeof d.products_count === "number") {
          setProductsCount(d.products_count);
        }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopOwnerId]);

  /* 3) Last-resort product count */
  useEffect(() => {
    if (typeof productsCount === "number") return;
    const slug = shop?.slug;
    if (!slug) return;

    (async () => {
      try {
        const r = await fetch(apiUrl(`/shops/${slug}/products/?page=1`), {
          cache: "no-store",
        });
        if (r.ok) {
          const d = await r.json();
          if (typeof d?.count === "number") {
            setProductsCount(d.count);
            return;
          }
        }
      } catch {}
      if (typeof shop?.products_count === "number") setProductsCount(shop.products_count);
      else setProductsCount(0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop?.slug, productsCount]);

  // toggle follow/unfollow
  const handleToggleFollow = async () => {
    if (!shopOwnerId) return;
    if (isOwner) return; // cannot follow yourself

    if (!cleanToken) {
      alert("Please log in to follow sellers.");
      return;
    }

    setLoadingFollow(true);
    try {
      const res = await fetch(apiUrl(`/users/${shopOwnerId}/follow/`), {
        method: isFollowing ? "DELETE" : "POST",
        headers: { Authorization: `Token ${cleanToken}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 400 && (errData.detail === "Can't follow yourself." || errData.error)) {
          alert(errData.detail || errData.error);
          return;
        }
        throw new Error(errData.detail || "Follow action failed");
      }

      setIsFollowing((f) => !f);
      setFollowersCount((n) => n + (isFollowing ? -1 : 1));
    } catch {
      alert("Could not update follow status.");
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!shop || !shop.name) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-gray-400 animate-pulse">Loading shop...</span>
      </div>
    );
  }

  const shopType = shop.shoptype?.name || shop.shoptype_name || "General Goods";
  const locationText = [town, countryCode].filter(Boolean).join(", ");

  return (
    <div className="relative w-full animate-fadeInUp">
      {/* Background Cover */}
      <img
        src={shop.top_banner || "https://images.pexels.com/photos/34577/pexels-photo.jpg"}
        alt="Shop Banner"
        className="w-full object-cover h-[240px] md:h-[320px] rounded-lg"
      />

      {/* Profile Card */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-4 w-full max-w-md text-center space-y-4">
          {/* Logo */}
          <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden mx-auto">
            {shop.shop_logo ? (
              <img
                src={shop.shop_logo}
                alt="Shop Logo"
                className="object-cover w-full h-full"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500">
                Logo
              </div>
            )}
          </div>

          {/* Name + Edit */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
            {isOwner && (
              <motion.button
                onClick={() => setIsEditOpen(true)}
                className="p-1 rounded-full hover:bg-gray-200"
                title="Edit Shop"
                whileTap={{ scale: 0.9 }}
              >
                <FaEdit className="text-gray-500 text-sm" />
              </motion.button>
            )}
          </div>

          {/* Category */}
          <p className="text-gray-600">{shopType}</p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            {!isOwner && (
              <button
                onClick={handleToggleFollow}
                disabled={loadingFollow}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
                  isFollowing
                    ? "bg-gray-200 text-violet-700 border border-violet-700"
                    : "bg-white text-gray-700 border border-gray-300"
                } disabled:opacity-50`}
              >
                {loadingFollow ? (
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-700 rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                ) : (
                  <>
                    {isFollowing ? <FaHeart className="text-violet-700" /> : <FaRegHeart className="text-gray-600" />}
                    <span>{isFollowing ? "Following" : "Follow"}</span>
                  </>
                )}
              </button>
            )}

            <span>
              {followersCount} follower{followersCount !== 1 && "s"}
            </span>

            <motion.button
              onClick={() => setShareModalOpen(true)}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-200"
              title="Share shop"
            >
              <FiShare2 className="text-lg" />
            </motion.button>
          </div>

          {/* Counts / Location */}
          <div className="pb-8 md:pb-0 flex flex-wrap items-center justify-center gap-2 text-gray-700 text-sm">
            <span>{typeof productsCount === "number" ? productsCount : "—"} items</span>
            <span>
              {flagEmoji} {locationText || " "}
            </span>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareModalOpen(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="relative bg-white rounded-lg p-6 space-y-4 max-w-xs w-full">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
                  title="Close"
                >
                  <FaTimes className="text-gray-600" />
                </button>

                <h2 className="text-lg font-semibold">Share this shop</h2>

    <div className="flex flex-wrap justify-around gap-4 mt-4">
      {/* WhatsApp */}
      <WhatsappShareButton url={currentUrl} title={shop.name}>
        <WhatsappIcon size={48} round />
      </WhatsappShareButton>

      {/* Facebook */}
      <FacebookShareButton url={currentUrl} quote={shop.name}>
        <FacebookIcon size={48} round />
      </FacebookShareButton>

      {/* Twitter */}
      <TwitterShareButton url={currentUrl} title={shop.name}>
        <TwitterIcon size={48} round />
      </TwitterShareButton>

      {/* LinkedIn */}
      <LinkedinShareButton url={currentUrl} title={shop.name}>
        <LinkedinIcon size={48} round />
      </LinkedinShareButton>

      {/* TikTok (link to your page or show "Copy link") */}
      <a
        href="https://www.tiktok.com/@upfrica.gh"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80"
      >
        <FaTiktok size={48} className="text-black rounded-full" />
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/upfrica"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80"
      >
        <FaInstagram size={48} className="text-pink-500 rounded-full" />
      </a>

      {/* YouTube */}
      <a
        href="https://www.youtube.com/@upfricamarketplace8512"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80"
      >
        <FaYoutube size={48} className="text-red-600 rounded-full" />
      </a>
    </div>

                <div className="flex items-center justify-center gap-2">
                  <CopyToClipboard text={currentUrl} onCopy={() => {
                    navigator.clipboard.writeText(currentUrl).catch(() => {});
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}>
                    <button className="flex items-center gap-1 px-3 py-2 border rounded-full hover:bg-gray-100">
                      {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
                      <span>{copied ? "Copied" : "Copy link"}</span>
                    </button>
                  </CopyToClipboard>
                </div>

                <button
                  onClick={() => setShareModalOpen(false)}
                  className="mt-2 text-sm text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
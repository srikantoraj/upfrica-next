// src/components/ProductDetailSection/ProductSlider.jsx
"use client";

import React from "react";
import Modal from "react-modal";
import { FaPlay, FaTiktok, FaInstagram, FaYoutube, FaLink } from "react-icons/fa";
import { FiShare2, FiChevronUp, FiChevronDown } from "react-icons/fi";
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

//load product images
import ImageSkeleton from "@/components/common/ImageSkeleton";
import SafeImage, { fixDisplayUrl } from "@/components/common/SafeImage";

/* =========================== Helpers =========================== */
function normalizeMediaItems(mediaItems = []) {
  if (!Array.isArray(mediaItems)) return [];
  return mediaItems
    .map((item) => {
      const src =
        item?.image_url ||
        item?.url ||
        item?.src ||
        (typeof item === "string" ? item : null);
      if (!src) return null;

      const isVideo =
        typeof item?.type === "string" &&
        item.type.toLowerCase() === "video";

      return {
        type: isVideo ? "video" : "image",
      src: fixDisplayUrl(src),
     thumbnail: item?.thumbnail ? fixDisplayUrl(item.thumbnail) : null,
      };
    })
    .filter(Boolean);
}

/* ===========================
   Component
   =========================== */

const ProductSlider = ({
  mediaItems = [],
  inBaskets = 0,
  autoplay = true,
  autoplayDelay = 5000,
  shareTitle,
  shareText,
  shareUrl,
  tiktokUrl = "https://www.tiktok.com/@upfrica.gh",
  instagramUrl = "https://www.instagram.com/upfrica",
  youtubeUrl = "https://www.youtube.com/@upfricamarketplace8512",
}) => {
const items = React.useMemo(() => {
  const norm = normalizeMediaItems(mediaItems);
  const seen = new Set();
  return norm.filter((x) => {
    if (!x?.src) return false;
    const key = `${x.type}|${x.src}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}, [mediaItems]);


  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [showBasketBadge, setShowBasketBadge] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [computedUrl, setComputedUrl] = React.useState(shareUrl || "");
  const [computedTitle, setComputedTitle] = React.useState(shareTitle || "Share product");
  const [computedText, setComputedText] = React.useState(shareText || "Check this out on Upfrica");

  // Measure hero height to cap thumbnail column
  const heroRef = React.useRef(null);
  const [thumbMaxH, setThumbMaxH] = React.useState(null);

  // Thumbnail rail refs/state
  const thumbsRef = React.useRef(null);
  const rafScrollRef = React.useRef(null);
  const [thumbCanUp, setThumbCanUp] = React.useState(false);
  const [thumbCanDown, setThumbCanDown] = React.useState(false);
  const updateThumbScrollState = () => {
    const el = thumbsRef.current;
    if (!el) return;
    const canUp = el.scrollTop > 1;
    const canDown = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    setThumbCanUp(canUp);
    setThumbCanDown(canDown);
  };
  const stopThumbAutoScroll = () => {
    if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    rafScrollRef.current = null;
  };
const startThumbAutoScroll = (dir /* -1 up, +1 down */) => {
  stopThumbAutoScroll();
  const step = () => {
    const el = thumbsRef.current;
    if (!el) return;

    // read from DOM so we don't lag a frame behind state
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    if ((dir < 0 && atTop) || (dir > 0 && atBottom)) {
      stopThumbAutoScroll();
      return;
    }

    el.scrollTop += dir * 6;   // gentle continuous scroll
    updateThumbScrollState();  // keep arrows/fades in sync
    rafScrollRef.current = requestAnimationFrame(step);
  };
  rafScrollRef.current = requestAnimationFrame(step);
};

  const videoRef = React.useRef(null);
  const autoplayRef = React.useRef(null);
  const shareRef = React.useRef(null);

  const current = items[selectedIndex];

  // Swipe
  const touchStartX = React.useRef(null);
  const touchStartTime = React.useRef(null);

  React.useEffect(() => {
    if (!shareUrl && typeof window !== "undefined") setComputedUrl(window.location.href);
    if (!shareTitle && typeof document !== "undefined")
      setComputedTitle(document.title || "Share product");
  }, [shareUrl, shareTitle]);

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!shareRef.current) return;
      if (!shareRef.current.contains(e.target)) setIsShareOpen(false);
    };
    if (isShareOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isShareOpen]);

  React.useEffect(() => {
    if (autoplay && !isModalOpen && !isVideoPlaying && items.length > 1) {
      autoplayRef.current = setInterval(
        () => setSelectedIndex((i) => (i + 1) % items.length),
        autoplayDelay
      );
    }
    return () => clearInterval(autoplayRef.current);
  }, [selectedIndex, isModalOpen, isVideoPlaying, autoplay, autoplayDelay, items.length]);

  React.useEffect(() => {
    setIsVideoPlaying(false);
    videoRef.current?.pause?.();
  }, [selectedIndex]);

  React.useEffect(() => {
    if (inBaskets > 0) {
      setShowBasketBadge(true);
      const t = setTimeout(() => setShowBasketBadge(false), 5000);
      return () => clearTimeout(t);
    }
  }, [inBaskets]);

  // Sync thumb height with hero (and recompute scrollability)
  const measure = () => {
    const h = heroRef.current?.clientHeight || null;
    if (h && h !== thumbMaxH) setThumbMaxH(h);
    updateThumbScrollState();
  };
  React.useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const el = thumbsRef.current;
    el?.addEventListener("scroll", updateThumbScrollState, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      el?.removeEventListener("scroll", updateThumbScrollState);
      stopThumbAutoScroll();
    };
  }, []);

  // Swipe handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartTime.current = new Date().getTime();
  };
  const onTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const t = new Date().getTime() - (touchStartTime.current || 0);
    const delta = (touchStartX.current || 0) - touchEndX;
    const v = Math.abs(delta) / (t || 1);
    if (delta > 50 || (delta > 20 && v > 0.3)) setSelectedIndex((i) => (i + 1) % items.length);
    else if (delta < -50 || (delta < -20 && v > 0.3)) setSelectedIndex((i) => (i - 1 + items.length) % items.length);
  };

  const handleQuickShare = async () => {
    try {
      if (navigator?.share) {
        await navigator.share({ title: computedTitle, text: computedText, url: computedUrl });
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(computedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    } catch {}
  };
  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(computedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    } catch {}
  };

  if (items.length === 0) {
    return (
      <div className="relative w-full">
        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-md overflow-hidden">
          <ImageSkeleton className="absolute inset-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:flex md:items-start">
      {/* Desktop thumbnails with vertical scroll + hover arrows */}
      <div className="relative hidden md:block mr-3">
        <div
          ref={thumbsRef}
          className="flex flex-col gap-2 overflow-y-auto pr-1"
          style={{ maxHeight: thumbMaxH ? `${thumbMaxH}px` : undefined, width: 68 }}
        >
          {items.map((item, idx) => {
            const isActive = idx === selectedIndex;
            const border = isActive ? "border-2 border-green-500" : "border border-gray-300";
            return (
              <button
                type="button"
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer ${border}`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {item.type === "video" ? (
                  <>
                    {item.thumbnail ? (
                      <SafeImage
                        src={item.thumbnail}
                        alt={`Thumb ${idx + 1}`}
                        width={60}
                        height={60}
                        sizes="60px"
                        className="object-cover w-full h-full"
                        quality={70}
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={item.src}
                        muted
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <FaPlay className="text-white text-xl opacity-75" />
                    </div>
                  </>
                ) : (
                  <SafeImage
                    src={item.thumbnail || item.src}
                    alt={`Thumb ${idx + 1}`}
                    width={60}
                    height={60}
                    sizes="60px"
                    className="object-cover w-full h-full"
                    quality={70}
                    loading="lazy"
                  />
                )}
              </button>
            );
          })}
        </div>

        {(thumbCanUp || thumbCanDown) && (
          <>
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/90 to-transparent dark:from-neutral-900/90 rounded-t-md" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent dark:from-neutral-900/90 rounded-b-md" />
          </>
        )}

        {thumbCanUp && (
          <button
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/70 text-white flex items-center justify-center shadow"
            onMouseEnter={() => startThumbAutoScroll(-1)}
            onMouseLeave={stopThumbAutoScroll}
            onClick={() => thumbsRef.current?.scrollBy({ top: -120, behavior: "smooth" })}
            aria-label="Scroll thumbnails up"
          >
            <FiChevronUp />
          </button>
        )}

        {thumbCanDown && (
          <button
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/70 text-white flex items-center justify-center shadow"
            onMouseEnter={() => startThumbAutoScroll(1)}
            onMouseLeave={stopThumbAutoScroll}
            onClick={() => thumbsRef.current?.scrollBy({ top: 120, behavior: "smooth" })}
            aria-label="Scroll thumbnails down"
          >
            <FiChevronDown />
          </button>
        )}
      </div>

      {/* Main slider */}
      <div className="relative w-full overflow-hidden">
        {/* Top overlay controls */}
        <div className="absolute top-2 left-0 right-0 flex justify-between items-center px-3 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (typeof window !== "undefined") window.history.back();
              }}
              className="text-white text-sm bg-black/40 rounded-full px-2 py-1"
              aria-label="Back"
            >
              ←
            </button>
            {inBaskets > 0 && showBasketBadge && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow ml-1">
                IN {inBaskets} BASKETS
              </span>
            )}
          </div>

          <span className="text-xs text-white bg-black/40 rounded-full px-2 py-0.5">
            {selectedIndex + 1} / {items.length}
          </span>

          <div className="relative" ref={shareRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen((v) => !v);
              }}
              aria-label="Share product"
              className="bg-black/40 hover:bg-black/60 active:scale-95 transition text-white rounded-full p-2 md:p-2.5 flex items-center justify-center"
            >
              <FiShare2 className="text-base md:text-lg" />
            </button>

            {isShareOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-[min(92vw,360px)] rounded-xl shadow-xl border border-black/10 backdrop-blur bg-white/90 dark:bg-neutral-900/90 p-3 z-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Share</p>
                  <button
                    className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/10"
                    onClick={() => setIsShareOpen(false)}
                  >
                    Close
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={handleQuickShare}
                    className="text-xs px-3 py-1.5 rounded-md bg-black/80 text-white hover:bg-black"
                    aria-label="Quick share"
                    title="Quick share"
                  >
                    Quick Share
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="text-xs px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center gap-1"
                    aria-label="Copy link"
                    title="Copy link"
                  >
                    <FaLink className="text-[12px]" />
                    Copy link
                  </button>
                  {copied && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                      Link copied
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-3 justify-items-center">
                  <WhatsappShareButton url={computedUrl} title={computedTitle}>
                    <WhatsappIcon size={44} round />
                  </WhatsappShareButton>
                  <FacebookShareButton url={computedUrl} quote={computedTitle}>
                    <FacebookIcon size={44} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={computedUrl} title={computedTitle}>
                    <TwitterIcon size={44} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={computedUrl} title={computedTitle}>
                    <LinkedinIcon size={44} round />
                  </LinkedinShareButton>

                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                    aria-label="Open TikTok profile"
                    title="TikTok"
                  >
                    <FaTiktok size={44} className="rounded-full" />
                  </a>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                    aria-label="Open Instagram profile"
                    title="Instagram"
                  >
                    <FaInstagram size={44} className="rounded-full" />
                  </a>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                    aria-label="Open YouTube channel"
                    title="YouTube"
                  >
                    <FaYoutube size={44} className="rounded-full" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Track (slides) */}
        <div
          ref={heroRef}
          className="relative w-full h-auto flex transition-transform duration-300 ease-in-out"
          style={{
            width: `${items.length * 100}%`,
            transform: `translateX(-${selectedIndex * (100 / items.length)}%)`,
          }}
          onClick={() => setIsModalOpen(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {items.map((item, idx) => (
            <div key={idx} className="w-full flex-shrink-0" style={{ width: `${100 / items.length}%` }}>
              <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-100 dark:bg-neutral-800 rounded-md overflow-hidden">
                {item.type === "video" ? (
                  <video
                    ref={idx === selectedIndex ? videoRef : null}
                    controls
                    src={item.src}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onLoadedMetadata={measure}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <SafeImage
                    src={item.src}
                    alt={`Slide ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px"
                    className="object-contain"
                    priority={idx === 0}
                    quality={85}
                    onLoad={measure}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dots (mobile) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 md:hidden z-20">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(idx);
              }}
              className={`w-2 h-2 rounded-full ${idx === selectedIndex ? "bg-black" : "bg-gray-300"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
 <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Media Lightbox"
  ariaHideApp={false}
  /* ↑ keep react-modal portal; give the overlay a higher z than your header */
  overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
  /* ↑ content on top of overlay, a bit higher still + padding */
  className="fixed inset-0 z-[1001] flex items-center justify-center p-3 md:p-6"
>
  <div className="relative w-full h-full flex items-center justify-center">
    {/* CLOSE */}
    <button
      className="absolute text-white text-2xl md:text-3xl bg-black/60 hover:bg-black/70 p-2 rounded-full shadow-lg"
      /* safe area so it never hides under the OS bar */
      style={{
        top: 'max(env(safe-area-inset-top), 1rem)',
        right: 'max(env(safe-area-inset-right), 1rem)',
      }}
      onClick={() => setIsModalOpen(false)}
      aria-label="Close"
    >
      ✖
    </button>

    {/* PREV */}
    <button
      className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl bg-black/60 hover:bg-black/70 p-3 rounded-full shadow-lg z-[1002]"
      onClick={() => setSelectedIndex((i) => (i - 1 + items.length) % items.length)}
      aria-label="Previous"
    >
      ◀
    </button>

    <div className="flex-grow flex items-center justify-center">
      {current?.type === "video" ? (
        <video
          controls
          src={current.src}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
        />
      ) : (
        <SafeImage
          src={current?.src}
          alt={`Slide ${selectedIndex + 1}`}
          width={1600}
          height={1600}
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 80vw, 1200px"
          className="object-contain rounded-md"
          style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          priority
          quality={85}
        />
      )}
    </div>

    {/* NEXT */}
    <button
      className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl bg-black/60 hover:bg-black/70 p-3 rounded-full shadow-lg z-[1002]"
      onClick={() => setSelectedIndex((i) => (i + 1) % items.length)}
      aria-label="Next"
    >
      ▶
    </button>
  </div>
</Modal>
    </div>
  );
};

export default ProductSlider;
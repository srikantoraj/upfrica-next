"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { FaPlay } from "react-icons/fa";

const ProductSlider = ({
  mediaItems = [],
  inBaskets = 0,
  autoplay = true,
  autoplayDelay = 5000,
}) => {
  const items = Array.isArray(mediaItems)
    ? mediaItems.map((item) =>
        typeof item === "string" ? { type: "image", src: item } : item
      )
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [zoomPos, setZoomPos] = useState(null);
  const [showBasketBadge, setShowBasketBadge] = useState(true);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const autoplayRef = useRef(null);

  const current = items[selectedIndex];

  // Swipe refs
  const touchStartX = useRef(null);
  const touchStartTime = useRef(null);
  const touchEndX = useRef(null);

  // ✅ AUTOPLAY EFFECT: stop if modal open or video playing
  useEffect(() => {
    if (autoplay && !isModalOpen && !isVideoPlaying && items.length > 1) {
      autoplayRef.current = setInterval(() => {
        next();
      }, autoplayDelay);
    }
    return () => clearInterval(autoplayRef.current);
  }, [
    selectedIndex,
    isModalOpen,
    isVideoPlaying,
    autoplay,
    autoplayDelay,
    items.length,
  ]);

  // ✅ Reset video playing state when slide changes
  useEffect(() => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (inBaskets > 0) {
      setShowBasketBadge(true);
      const timer = setTimeout(() => setShowBasketBadge(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [inBaskets]);

  const openModal = () => {
    setIsModalOpen(true);
    clearInterval(autoplayRef.current);
  };
  const closeModal = () => setIsModalOpen(false);
  const next = () => setSelectedIndex((i) => (i + 1) % items.length);
  const prev = () => setSelectedIndex((i) => (i - 1 + items.length) % items.length);

  // ✅ Swipe handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartTime.current = new Date().getTime();
  };
  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const touchEndTime = new Date().getTime();
    handleSwipe(touchEndTime - touchStartTime.current);
  };
  const handleSwipe = (duration) => {
    const delta = touchStartX.current - touchEndX.current;
    const velocity = Math.abs(delta) / duration;
    if (delta > 50 || (delta > 20 && velocity > 0.3)) {
      next();
    } else if (delta < -50 || (delta < -20 && velocity > 0.3)) {
      prev();
    }
  };

  const onMouseMove = (e) => {
    if (current?.type !== "image" || !containerRef.current) return;
    const { left, top, width } = containerRef.current.getBoundingClientRect();
    const x = Math.min(
      100,
      Math.max(0, ((e.clientX - left) / width) * 100)
    );
    const y = Math.min(
      100,
      Math.max(0, ((e.clientY - top) / width) * 100)
    );
    setZoomPos({ x, y });
  };
  const onMouseLeave = () => setZoomPos(null);

  if (items.length === 0) {
    return <p className="text-center text-gray-500">No images available</p>;
  }

  return (
    <div className="relative md:flex md:items-start">
      {/* Desktop thumbnails */}
      <div className="hidden md:flex flex-col gap-2 mr-3">
        {items.map((item, idx) => {
          const isActive = idx === selectedIndex;
          const border = isActive
            ? "border-2 border-green-500"
            : "border border-gray-300";
          return (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer ${border}`}
            >
              {item.type === "video" ? (
                <>
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt="Video thumbnail"
                      width={60}
                      height={60}
                      className="object-cover w-full h-full"
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
                <Image
                  src={item.src}
                  alt={`Thumb ${idx + 1}`}
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main slider */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute top-2 left-0 right-0 flex justify-between items-center px-3 z-10">
          <button
            onClick={() => window.history.back()}
            className="text-white text-sm bg-black/40 rounded-full px-2 py-1"
          >
            ←
          </button>
          {inBaskets > 0 && showBasketBadge && (
            <span className="absolute top-11 left-3 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              IN {inBaskets} BASKETS
            </span>
          )}
          <span className="text-xs text-white bg-black/40 rounded-full px-2 py-0.5">
            {selectedIndex + 1} / {items.length}
          </span>
          <span className="text-xs font-semibold text-white bg-black/40 rounded-full px-2 py-0.5">
            15% OFF
          </span>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-auto flex transition-transform duration-300 ease-in-out"
          style={{
            width: `${items.length * 100}%`,
            transform: `translateX(-${
              selectedIndex * (100 / items.length)
            }%)`,
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={openModal}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {items.map((item, idx) =>
            item.type === "video" ? (
              <video
                key={idx}
                ref={idx === selectedIndex ? videoRef : null}
                controls
                src={item.src}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                className="w-full h-auto object-cover flex-shrink-0"
                style={{ width: `${100 / items.length}%` }}
              />
            ) : (
              <div
                key={idx}
                className="w-full flex-shrink-0 flex items-center justify-center"
                style={{ width: `${100 / items.length}%` }}
              >
                <Image
                  src={item.src}
                  alt={`Slide ${idx + 1}`}
                  width={800}
                  height={800}
                  className="object-cover w-full h-auto"
                  priority={idx === selectedIndex}
                />
              </div>
            )
          )}
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 md:hidden z-20">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(idx);
              }}
              className={`w-2 h-2 rounded-full ${
                idx === selectedIndex ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Media Lightbox"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-md"
        ariaHideApp={false}
      >
        <div className="relative flex items-center justify-center w-full h-full">
          <button
            className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full"
            onClick={closeModal}
          >
            ✖
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-3 rounded-full"
            onClick={prev}
          >
            ◀
          </button>
          <div className="flex-grow flex items-center justify-center">
            {current.type === "video" ? (
              <video
                controls
                src={current.src}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
              />
            ) : (
              <Image
                src={current.src}
                alt={`Slide ${selectedIndex + 1}`}
                width={1200}
                height={900}
                className="object-contain rounded-md"
                style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                priority
              />
            )}
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-3 rounded-full"
            onClick={next}
          >
            ▶
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductSlider;
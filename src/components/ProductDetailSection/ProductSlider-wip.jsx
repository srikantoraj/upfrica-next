"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";

const ProductSliderPremium = ({ mediaItems = [] }) => {
  const items = Array.isArray(mediaItems)
    ? mediaItems.map((item) =>
        typeof item === "string" ? { type: "image", src: item } : item
      )
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState(null);
  const [bgColor, setBgColor] = useState("#111111");
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const current = items[selectedIndex];
  const modalCurrent = items[modalIndex];

  useEffect(() => {
    const item = isModalOpen ? modalCurrent : current;
    if (!item || item.type !== "image") return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = item.src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 20;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 20, 20);
      const data = ctx.getImageData(0, 0, 20, 20).data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const [red, green, blue] = [data[i], data[i + 1], data[i + 2]];
        const isBlack = red < 25 && green < 25 && blue < 25;
        const isWhite = red > 240 && green > 240 && blue > 240;
        if (isBlack || isWhite) continue;
        r += red;
        g += green;
        b += blue;
        count++;
      }
      if (count) {
        setBgColor(
          `rgb(${Math.floor(r / count)}, ${Math.floor(
            g / count
          )}, ${Math.floor(b / count)})`
        );
      }
    };
  }, [current, modalCurrent, isModalOpen]);

  const onMouseMove = (e) => {
    if (current?.type !== "image" || !containerRef.current || window.innerWidth < 768) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - left) / width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const onMouseLeave = () => setZoomPos(null);

  const openModal = () => {
    setModalIndex(selectedIndex);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg mx-auto overflow-hidden bg-black" style={{ width: "100%", maxWidth: 600, aspectRatio: "1/1" }}>
        {loaded && (
          <motion.div
            key={bgColor}
            animate={{ background: `linear-gradient(to bottom, ${bgColor}, #000)` }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          />
        )}
        <div
          ref={containerRef}
          className="relative z-10 h-full w-full flex items-center justify-center cursor-zoom-in"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={openModal}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-10 h-10 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={current?.src}
            alt="Product"
            width={600}
            height={600}
            onLoadingComplete={() => setLoaded(true)}
            className="object-contain rounded-md"
          />
        </div>

        {selectedIndex > 0 && (
          <button
            onClick={() => {
              setSelectedIndex((prev) => prev - 1);
              setLoaded(false);
            }}
            className="absolute left-[10.5rem] top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full text-black text-xl"
          >
            ◀
          </button>
        )}
        {selectedIndex < items.length - 1 && (
          <button
            onClick={() => {
              setSelectedIndex((prev) => prev + 1);
              setLoaded(false);
            }}
            className="absolute right-[5.5rem] top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full text-black text-xl"
          >
            ▶
          </button>
        )}

        {zoomPos && current?.type === "image" && (
          <motion.div
            className="absolute pointer-events-none rounded-full border-2 border-white backdrop-blur-sm z-30"
            style={{
              width: 140,
              height: 140,
              left: `calc(${zoomPos.x}% - 70px)`,
              top: `calc(${zoomPos.y}% - 70px)`,
              backgroundImage: `url(${current.src})`,
              backgroundSize: "1000% 1000%",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              boxShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>

      <div className="flex justify-center gap-3 flex-wrap mt-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`w-16 h-16 rounded overflow-hidden border cursor-pointer ${idx === selectedIndex ? "border-orange-500" : "border-gray-300"}`}
            onClick={() => {
              setSelectedIndex(idx);
              setLoaded(false);
            }}
          >
            <Image
              src={item.src}
              alt={`Thumb ${idx + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)] overflow-hidden"
            onClick={closeModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex items-center justify-center w-full h-full"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full z-50"
              >
                ✖
              </button>

              {modalIndex > 0 && (
                <button
                  onClick={() => setModalIndex((prev) => prev - 1)}
                  className="absolute left-[10.5rem] top-1/2 -translate-y-1/2 text-white text-3xl p-2 z-40"
                >
                  ◀
                </button>
              )}
              {modalIndex < items.length - 1 && (
                <button
                  onClick={() => setModalIndex((prev) => prev + 1)}
                  className="absolute right-[5.5rem] top-1/2 -translate-y-1/2 text-white text-3xl p-2 z-40"
                >
                  ▶
                </button>
              )}

              <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-2 z-40 hidden md:block">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-16 h-16 rounded overflow-hidden cursor-pointer border ${idx === modalIndex ? "border-orange-500" : "border-transparent"}`}
                    onClick={() => setModalIndex(idx)}
                  >
                    <Image
                      src={item.src}
                      alt={`Thumb ${idx + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="max-w-[90vw] max-h-[70vh]">
                  <Image
                    src={modalCurrent?.src}
                    alt="Lightbox"
                    width={1200}
                    height={900}
                    className="w-auto max-w-full max-h-[70vh] object-contain rounded-md"
                  />
                </div>
                <div className="w-full max-w-md mt-6 space-y-3 px-4 text-center">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full text-lg">
                    Buy Now
                  </button>
                  <button className="w-full border border-yellow-400 hover:bg-yellow-50 text-gray-800 font-semibold py-3 rounded-full text-lg">
                    Add to Basket
                  </button>
                  <button className="w-full border border-yellow-400 hover:bg-yellow-50 text-gray-800 font-semibold py-3 rounded-full text-lg flex items-center justify-center gap-2">
                    <span>♡</span> Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductSliderPremium;
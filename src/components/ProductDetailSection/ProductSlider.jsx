// components/ProductSlider.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { FaPlay } from "react-icons/fa";

const ProductSlider = ({ mediaItems = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState(null);
  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(to bottom, #1f1f1f, #000)"
  );
  const containerRef = useRef(null);

  const currentItem = mediaItems[selectedIndex];

  const extractGradient = (src) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 20;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 20, 20);
      const data = ctx.getImageData(0, 0, 20, 20).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const [red, green, blue] = [data[i], data[i + 1], data[i + 2]];
        const isBlack = red < 25 && green < 25 && blue < 25;
        const isWhite = red > 240 && green > 240 && blue > 240;
        if (isBlack || isWhite) continue;
        r += red; g += green; b += blue; count++;
      }
      if (count) {
        const avg = `rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`;
        setBgGradient(`linear-gradient(to bottom, ${avg}, #000)`);
      }
    };
  };

  useEffect(() => {
    if (currentItem?.type === "image") {
      extractGradient(currentItem.src);
    }
  }, [currentItem]);

  const handleMouseMove = (e) => {
    if (currentItem?.type !== "image" || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - left) / width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - top) / height) * 100));
    setZoomPosition({ x, y });
  };
  const handleMouseLeave = () => setZoomPosition(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const next = () => setSelectedIndex(i => (i + 1) % mediaItems.length);
  const prev = () => setSelectedIndex(i => (i - 1 + mediaItems.length) % mediaItems.length);

  return (
    <div className="space-y-4">
      {/* Main media area: fixed 588×588 */}
      <div
        ref={containerRef}
        className="relative border rounded-md p-0 cursor-zoom-in mx-auto overflow-hidden"
        style={{
          width: "588px",
          height: "588px",
          background: currentItem?.type === "image" ? bgGradient : "transparent",
          transition: "background 0.3s ease-in-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={openModal}
      >
        {currentItem?.type === "video" ? (
          <video
            controls
            src={currentItem.src}
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <>
            <Image
              src={currentItem.src}
              alt={`Slide ${selectedIndex + 1}`}
              width={588}
              height={588}
              className="w-full h-full object-contain rounded-md"
              priority
            />
            {zoomPosition && (
              <div
                className="absolute pointer-events-none border-2 border-white rounded-full"
                style={{
                  width: "120px",
                  height: "120px",
                  left: `calc(${zoomPosition.x}% - 60px)`,
                  top: `calc(${zoomPosition.y}% - 60px)`,
                  backgroundImage: `url(${currentItem.src})`,
                  backgroundSize: "900% 900%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: "no-repeat",
                  boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                  transform: "scale(1.1)",
                  transition: "transform 0.1s ease-out",
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Thumbnails: fixed 60×60 */}
      <div className="flex mt-2 justify-center space-x-2 h-[60px] overflow-x-auto">
        {mediaItems.map((item, idx) => {
          const isActive = idx === selectedIndex;
          const borderClass = isActive
            ? "border-2 border-green-500"
            : "border border-gray-300";
          return item.type === "video" ? (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer ${borderClass}`}
            >
              <video
                src={item.src}
                muted
                preload="metadata"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <FaPlay className="text-white text-xl opacity-75" />
              </div>
            </div>
          ) : (
            <Image
              key={idx}
              src={item.src}
              alt={`Thumb ${idx + 1}`}
              width={60}
              height={60}
              className={`rounded-md object-cover cursor-pointer ${borderClass}`}
              onClick={() => setSelectedIndex(idx)}
            />
          );
        })}
      </div>

      {/* Lightbox modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Product Media Lightbox"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 backdrop-blur-md bg-black/30"
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
            {currentItem?.type === "video" ? (
              <video
                controls
                src={currentItem.src}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
              />
            ) : (
              <Image
                src={currentItem.src}
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

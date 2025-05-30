// components/ProductSlider.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { FaPlay } from "react-icons/fa";

const ProductSlider = ({ mediaItems = [] }) => {
  // Normalize: allow strings → images
  const items = Array.isArray(mediaItems)
    ? mediaItems.map(item =>
      typeof item === "string"
        ? { type: "image", src: item }
        : item
    )
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState(null);
  const [bgGradient, setBgGradient] = useState("linear-gradient(to bottom, #1f1f1f, #000)");
  const containerRef = useRef(null);

  if (items.length === 0) {
    return <p className="text-center text-gray-500">No images available</p>;
  }

  const current = items[selectedIndex];

  // For images: extract average color for background gradient
  useEffect(() => {
    if (current.type !== "image") return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = current.src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 20; canvas.height = 20;
      const ctx = canvas.getContext("2d");
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
  }, [current]);

  // Zoom handlers
  const onMouseMove = e => {
    if (current.type !== "image" || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - left) / width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };
  const onMouseLeave = () => setZoomPos(null);

  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const next = () => setSelectedIndex(i => (i + 1) % items.length);
  const prev = () => setSelectedIndex(i => (i - 1 + items.length) % items.length);

  return (
    <div className="space-y-4">
      {/* Main display (588×588) */}
      <div
        ref={containerRef}
        className="relative border rounded-md mx-auto overflow-hidden cursor-zoom-in w-full md:w-[588px] bg-gray-100"
      
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={openModal}
      >
        {current.type === "video" ? (
          <video
            controls
            src={current.src}
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <>
            <Image
              src={current.src}
              alt={`Slide ${selectedIndex + 1}`}
              width={588}
              height={588}
              className="object-contain rounded-md"
              priority
            />
            {zoomPos && (
              <div
                className="absolute pointer-events-none border-2 border-white rounded-full"
                style={{
                  width: 120,
                  height: 120,
                  left: `calc(${zoomPos.x}% - 60px)`,
                  top: `calc(${zoomPos.y}% - 60px)`,
                  backgroundImage: `url(${current.src})`,
                  backgroundSize: "900% 900%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                  transform: "scale(1.1)",
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Thumbnails (60×60) */}
      <div className="flex justify-center space-x-2">
        {items.map((item, idx) => {
          const isActive = idx === selectedIndex;
          const border = isActive ? "border-2 border-green-500" : "border border-gray-300";

          if (item.type === "video") {
            // show thumbnail if provided, else video frame
            const thumb = item.thumbnail;
            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer ${border}`}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt="Video thumbnail"
                    width={60}
                    height={60}
                    className="object-cover"
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
              </div>
            );
          }

          return (
            <Image
              key={idx}
              src={item.src}
              alt={`Thumb ${idx + 1}`}
              width={60}
              height={60}
              className={`object-cover rounded-md cursor-pointer ${border}`}
              onClick={() => setSelectedIndex(idx)}
            />
          );
        })}
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

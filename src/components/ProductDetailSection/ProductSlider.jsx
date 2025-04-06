"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Modal from "react-modal";

const ProductSlider = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState(null);
  const [bgGradient, setBgGradient] = useState("linear-gradient(to bottom, #1f1f1f, #000)");
  const imageContainerRef = useRef(null);

  const safeImages = Array.isArray(images)
    ? images.filter(
        (img) =>
          typeof img === "string" &&
          !img.toLowerCase().includes(".mp4") &&
          !img.toLowerCase().includes("video")
      )
    : [];

  const safeImage = safeImages[selectedIndex] || "";

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

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i],
          green = data[i + 1],
          blue = data[i + 2];

        const isBlack = red < 25 && green < 25 && blue < 25;
        const isWhite = red > 240 && green > 240 && blue > 240;
        if (isBlack || isWhite) continue;

        r += red;
        g += green;
        b += blue;
        count++;
      }

      if (count > 0) {
        const avgColor = `rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`;
        setBgGradient(`linear-gradient(to bottom, ${avgColor}, #000)`);
      }
    };
  };

  useEffect(() => {
    if (safeImage) extractGradient(safeImage);
  }, [selectedIndex]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % safeImages.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - left) / width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - top) / height) * 100));
    setZoomPosition({ x, y });
  };

  const handleMouseLeave = () => setZoomPosition(null);

  if (safeImages.length === 0) {
    return <p className="text-center text-gray-500">No valid images available</p>;
  }

  return (
    <div className="text-center">
      <div
        ref={imageContainerRef}
        className="relative border rounded-md p-2 cursor-zoom-in flex justify-center items-center mx-auto overflow-hidden"
        style={{
          maxWidth: "588px",
          maxHeight: "588px",
          background: bgGradient,
          transition: "background 0.3s ease-in-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={openModal}
      >
        <Image
          src={safeImage}
          alt={`Product Image ${selectedIndex + 1}`}
          width={588}
          height={588}
          className="rounded-md object-contain w-full h-full"
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
              backgroundImage: `url(${safeImage})`,
              backgroundSize: "900% 900%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: "no-repeat",
              boxShadow: "0px 0px 10px rgba(255,255,255,0.5)",
              transform: "scale(1.1)",
              transition: "transform 0.1s ease-out",
            }}
          />
        )}
      </div>

      <div className="flex mt-2 justify-center space-x-2">
        {safeImages.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={`Thumb ${i + 1}`}
            width={60}
            height={60}
            className={`cursor-pointer rounded-md ${
              selectedIndex === i ? "border-2 border-green-500" : "border border-gray-300"
            }`}
            onClick={() => setSelectedIndex(i)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Product Image Lightbox"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 backdrop-blur-md bg-black/30"
        ariaHideApp={false}
      >
        <div className="relative flex w-full h-full">
          <div className="hidden md:flex flex-col items-center space-y-2 p-4">
            {safeImages.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`Thumb ${i + 1}`}
                width={60}
                height={60}
                className={`cursor-pointer rounded-md ${
                  selectedIndex === i ? "border-2 border-orange-500" : "opacity-60"
                }`}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>

          <div className="flex-grow flex items-center justify-center relative" style={{ background: bgGradient }}>
            <button
              className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full"
              onClick={closeModal}
            >
              ✖
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-3 rounded-full"
              onClick={prevImage}
            >
              ◀
            </button>
            <div className="flex justify-center items-center w-full h-full">
              <Image
                src={safeImage}
                alt={`Product Image ${selectedIndex + 1}`}
                width={1200}
                height={900}
                className="rounded-md object-contain"
                style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                priority
              />
            </div>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-3 rounded-full"
              onClick={nextImage}
            >
              ▶
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductSlider;

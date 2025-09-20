//components/products/ProductWizard/steps/StepMedia.jsx
"use client";
import PhotosSection from "@/components/PhotosSection";

export default function StepMedia({ productId }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Media</h2>
      <PhotosSection productId={productId} ensureProductId={async () => productId} />
      <p className="text-xs text-gray-500 mt-1">Tip: set a primary image by starring it; long-press to reorder.</p>
    </div>
  );
}
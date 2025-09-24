// src/components/home/ProductList/RelatedProduct.jsx
"use client";

import React from "react";
import Link from "next/link";
import RelatedProductCard from "./RelatedProductCard";
import RelatedProductCardSkeleton from "./RelatedProductCardSkeleton";
import { withCountryPrefix } from "@/lib/locale-routing";
import { useLocalization } from "@/contexts/LocalizationProvider";

function RelatedProducts({
  productSlug,
  productTitle,
  relatedProducts,
  location = "Ghana",
}) {
  const { country: uiCountry } = useLocalization() || {};
  const cc = String(uiCountry || "gh").toLowerCase();

  // —— helpers
  const truncateTitle = React.useCallback((str, max = 64) => {
    if (!str || typeof str !== "string") return "";
    if (str.length <= max) return str;
    const slice = str.slice(0, max);
    const at = slice.lastIndexOf(" ");
    return (at > 28 ? slice.slice(0, at) : slice) + "…";
  }, []);

  const seoTitle = React.useMemo(() => truncateTitle(productTitle), [productTitle, truncateTitle]);

  const seeMoreHref = React.useMemo(
    () =>
      withCountryPrefix(
        cc,
        `/search?q=${encodeURIComponent(seoTitle || "")}&related=${encodeURIComponent(
          productSlug || ""
        )}`
      ),
    [cc, seoTitle, productSlug]
  );

  // —— states
  if (relatedProducts === undefined) {
    return (
      <section aria-label="Related items" className="py-8 md:py-10" id="related-items">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Items related to this {seoTitle || "product"}
          </h3>
          <span className="text-sm text-gray-500">Loading…</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <RelatedProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (relatedProducts === null) {
    return (
      <section className="py-8" aria-live="polite">
        <p className="text-red-600">❌ Error loading related products.</p>
      </section>
    );
  }

  if (!Array.isArray(relatedProducts) || relatedProducts.length === 0) {
    return null;
  }

  // —— mobile scroller with smart chevrons
  const rowRef = React.useRef(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  const updateArrows = React.useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const pad = 6; // small tolerance
    setCanLeft(el.scrollLeft > pad);
    setCanRight(el.scrollWidth - el.clientWidth - el.scrollLeft > pad);
  }, []);

  const scrollBy = React.useCallback((dir = 1) => {
    const el = rowRef.current;
    if (!el) return;
    const item = el.querySelector("[data-card]")?.clientWidth || 240;
    el.scrollBy({ left: dir * (item + 12), behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateArrows]);

  const onKeyScroll = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); scrollBy(1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); scrollBy(-1); }
  };

  return (
    <section className="py-8 md:py-10" id="related-items" aria-label="Related items">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
          Items related to {seoTitle} <span className="hidden md:inline">— Price in {location}</span>
        </h3>

        <Link
          href={seeMoreHref}
          className="ud-btn ud-btn-ghost ud-btn-link-underline text-sm"
          aria-label={`See more items related to ${seoTitle}`}
        >
          See more →
        </Link>
      </div>

      {/* Mobile: horizontal scroll (edge fade) */}
      <div className="relative md:hidden">
        <div
          ref={rowRef}
          className="scroll-fade no-scrollbar -mx-1.5 px-1.5 flex gap-3 overflow-x-auto snap-x snap-mandatory"
          role="list"
          aria-label="Related products"
          tabIndex={0}
          onKeyDown={onKeyScroll}
        >
          {relatedProducts.map((p) => (
            <div key={p.id} data-card role="listitem" className="snap-start basis-[66%] xs:basis-[58%] sm:basis-[46%] shrink-0">
              <RelatedProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Chevrons (only when overflow) */}
        {canLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[-6px]
                       rounded-full bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-gray-700
                       shadow-upfrica w-8 h-8 grid place-items-center"
          >
            ‹
          </button>
        )}
        {canRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[6px]
                       rounded-full bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-gray-700
                       shadow-upfrica w-8 h-8 grid place-items-center"
          >
            ›
          </button>
        )}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-5">
        {relatedProducts.map((p) => (
          <div key={p.id}>
            <RelatedProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
export const RealtedProduct = RelatedProducts; // back-compat
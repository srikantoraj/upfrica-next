// src/app/[cc]/product/[slug]/PriceBlock.jsx
"use client";
import Money from "@/components/common/Money";

export default function PriceBlock({ product }) {
  const baseCcy = product.currency || product.currency_code || "USD";
  return (
    <div className="space-y-1">
      <div className="text-2xl font-black">
        <Money amount={product.price} from={baseCcy} approx />
      </div>
      {product.compare_at_price && (
        <div className="text-sm text-[var(--ink-2)] line-through">
          <Money amount={product.compare_at_price} from={baseCcy} />
        </div>
      )}
    </div>
  );
}
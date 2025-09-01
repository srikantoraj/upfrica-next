// /src/app/[region]/[slug]/reviews/page.jsx


import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews } from "@/lib/products/api";
import ProductSummaryCard from "@/components/review/ProductSummaryCard";
import ReviewCard from "@/components/review/ReviewCard";
import StillInStockBanner from "@/components/review/StillInStockBanner";
import ReviewSummaryBox from "@/components/review/ReviewSummaryBox";

const CDN_BASE = "https://d3q0odwafjkyv1.cloudfront.net";

export async function generateMetadata({ params }) {
  const { slug, region } = params;
  const product = await getProductBySlug(region, slug);
  if (!product) return notFound();

  const firstImage = product.image_objects?.[0];
  const imageUrl =
    firstImage?.url?.startsWith("http")
      ? firstImage.url
      : firstImage?.key
      ? `${CDN_BASE}/${firstImage.key}`
      : product.product_image_url || null;

  return {
    title: `Reviews for ${product.seo_title || product.title} | Upfrica ${cc.toUpperCase()}`,
    description: `See what buyers are saying about ${product.title}. Verified reviews, star ratings, and real photos from ${product.seller_town || cc.toUpperCase()}.`,
    alternates: {
      canonical: product.canonical_url || `https://upfrica.com/${region}/${slug}/reviews`,
    },
    openGraph: {
      title: `Reviews for ${product.title}`,
      description: `Read verified reviews and see buyer photos for ${product.title}.`,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductReviewsPage({ params }) {
  const { slug, region } = params;

  const product = await getProductBySlug(region, slug);
  if (!product) return notFound();

  const {
    reviews = [],
    average_rating,
    review_count,
    rating_percent,
  } = await getProductReviews(region, slug);

  const price = product.price_cents
    ? (product.price_cents / 100).toFixed(2)
    : null;

  const firstImage = product.image_objects?.[0];
  const imageUrl =
    firstImage?.url?.startsWith("http")
      ? firstImage.url
      : firstImage?.key
      ? `${CDN_BASE}/${firstImage.key}`
      : product.product_image_url || null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back link */}
      <Link
        href={product.frontend_url || `/${region}/${slug}`}
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4"
      >
        ← Back to Product
      </Link>

      {/* Page Heading */}
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">
        Customer Reviews for <br className="sm:hidden" />
        {product.title}
      </h1>

      {/* Product summary card */}
      <div className="mb-5 sm:mb-6">
        <ProductSummaryCard
          title={product.title}
          image={imageUrl}
          price={price}
          condition={product.condition?.name}
          region={region}
          town={product.seller_town}
          buyUrl={product.frontend_url}
        />
      </div>

      {/* Ratings breakdown */}
      {review_count > 0 && (
        <div className="my-6">
          <ReviewSummaryBox
            averageRating={average_rating}
            reviewCount={review_count}
            ratingPercent={rating_percent}
          />
        </div>
      )}

      {/* Review list */}
      <div className="mt-6 space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="text-gray-500 italic">No reviews yet for this product.</p>
        )}
      </div>

      {/* Buy Again CTA */}
      {price && (
       
<div className="fixed bottom-0 left-0 right-0 sm:static bg-white sm:bg-transparent border-t sm:border-0 p-4 sm:p-0 z-50">
  <StillInStockBanner
    price={price}
    region={region}
    productSlug={slug}
  />
</div>
      
      )}
    </div>
  );
}
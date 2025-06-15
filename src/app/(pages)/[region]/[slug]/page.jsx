// // app/products/[slug]/page.js
// import { notFound } from 'next/navigation';
// import { BASE_API_URL } from '@/app/constants';
// import Footer from '@/components/common/footer/Footer';
// import Header from '@/components/common/header/Header';
// import RelatedProducts from '@/components/home/ProductList/RealtedProduct';
// import ProductDetailSection from '@/components/ProductDetailSection/ProductDetailSection';

// /**
//  * Fetch product data by slug
//  */
// async function getProductData(slug) {
//   if (!slug) throw new Error('No product slug provided');

//   const res = await fetch(`${BASE_API_URL}/api/products/${slug}/`, {
//     cache: 'no-store',
//   });

//   if (res.status === 404) return null;

//   if (!res.ok) {
//     throw new Error(`Failed to fetch product data (${res.status})`);
//   }

//   return res.json();
// }

// /**
//  * Fetch related products
//  */
// async function getRelatedProducts(slug) {
//   try {
//     const res = await fetch(`${BASE_API_URL}/api/products/${slug}/related/`, {
//       cache: 'no-store',
//     });

//     if (!res.ok) {
//       console.error('Failed to fetch related products:', res.status);
//       return [];
//     }

//     const data = await res.json();
//     return data.results || [];
//   } catch (err) {
//     console.error('Error fetching related products:', err);
//     return [];
//   }
// }

// /**
//  * Dynamic page metadata
//  */
// export async function generateMetadata({ params: { slug } }) {
//   const product = await getProductData(slug);
//   if (!product) return notFound();

//   return {
//     title: `${product.title} – ${product.user?.country || 'Upfrica'}`,
//     description: product.description?.body || '',
//   };
// }

// /**
//  * Server-rendered Product Page
//  */
// export default async function ProductPage({ params: { slug } }) {
//   const product = await getProductData(slug);

//   if (!product) return notFound();

//   const relatedProducts = await getRelatedProducts(product.slug);

//   return (
//     <>
//       <Header />
//       <main className="w-full max-w-[1380px] mx-auto py-8 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
//         <ProductDetailSection product={product} relatedProducts={relatedProducts} />

//         <RelatedProducts
//           relatedProducts={relatedProducts}
//           productSlug={product.slug}
//           productTitle={product.title}
//           location={product.seller_country || 'Ghana'}
//         />
//       </main>
//       <Footer />
//     </>
//   );
// }



// app/products/[slug]/page.js

import { notFound } from 'next/navigation';
import { BASE_API_URL } from '@/app/constants';
import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import RelatedProducts from '@/components/home/ProductList/RealtedProduct';
import ProductDetailSection from '@/components/ProductDetailSection/ProductDetailSection';

const PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.upfrica.com';

/**
 * Remove generic words, collapse spaces, limit to 6 words
 */
function cleanShortTitle(text) {
  const stopWords = [
    'promo', 'deal', 'bundle', 'amazing', 'best', 'top', 'offer', 'hot', 'discount',
    '4g', '5g', 'latest', 'new', 'original', 'first', 'cheap', 'quality', 'affordable',
    'price', 'special', 'limited', 'premium', 'super', 'portable', 'smart',
    'hd', 'led', 'with', 'and', 'includes', 'set', 'home', 'machine', 'device', 'equipment', 'electric'
  ];
  const regex = new RegExp(`\\b(${stopWords.join('|')})\\b`, 'gi');
  let cleaned = text.replace(regex, '').replace(/\s+/g, ' ').trim();
  if (!cleaned || cleaned.split(' ').length < 2) {
    cleaned = text;
  }
  return cleaned.split(' ').slice(0, 6).join(' ');
}

/**
 * Fetch product data by slug
 */
async function getProductData(slug) {
  if (!slug) throw new Error('No product slug provided');

  const res = await fetch(`${BASE_API_URL}/api/products/${slug}/`, {
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product data (${res.status})`);

  return res.json();
}

/**
 * Fetch related products
 */
async function getRelatedProducts(slug) {
  try {
    const res = await fetch(`${BASE_API_URL}/api/products/${slug}/related/`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('Failed to fetch related products:', res.status);
      return [];
    }
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error fetching related products:', err);
    return [];
  }
}

/**
 * Dynamic page metadata with full SEO logic
 */
export async function generateMetadata({ params: { slug } }) {
  const product = await getProductData(slug);
  if (!product) return notFound();

  // 1. Build the “core” title
  const rawTitle = product.seo_title?.trim() || product.title?.trim() || 'Product';
  const shortTitle = cleanShortTitle(rawTitle);
  const brandName = product.brand?.name?.trim() || '';
  const titleCore = brandName ? `${brandName} ${shortTitle}` : shortTitle;

  // 2. Add condition, city & country
  const condition = (product.condition?.name || 'Used').toUpperCase();
  const city = product.user?.city || 'Accra';
  const countryName = product.user?.country || 'Ghana';

  let seoTitle = `Buy ${titleCore} (${condition}) in ${city}, ${countryName} | Upfrica`;
  if (seoTitle.length > 60) {
    seoTitle = seoTitle
      .slice(0, 57)
      .replace(/\s+\S*$/, '')
      .trim() + '...';
  }

  // 3. SEO description template
  const seoDescription =
    `Affordable ${product.title} at the best price in ${countryName}. ` +
    `Fast delivery in ${city}. Shop now at Upfrica – trusted by buyers.`;

  // 4. Canonical URL & image for social cards
  const canonicalUrl = `${PUBLIC_URL}/products/${slug}`;
  const firstImage = product.image_objects?.[0]?.image;
  const imageUrl = firstImage
    ? firstImage.startsWith('http')
      ? firstImage
      : `${PUBLIC_URL}${firstImage}`
    : `${PUBLIC_URL}/default-product.jpg`;

  return {
    title: seoTitle,
    description: seoDescription,
    robots: 'index, follow',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: imageUrl }],
      site_name: 'Upfrica',
      locale: `en_${(product.user?.country_code || countryName.slice(0, 2)).toUpperCase()}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
  };
}

/**
 * Server-rendered Product Page
 */
export default async function ProductPage({ params: { slug } }) {
  const product = await getProductData(slug);
  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(product.slug);

  // Retrieve SEO title & description from generateMetadata
  const { title: seoTitle, description: seoDescription } =
    await generateMetadata({ params: { slug } });

  return (
    <>
      <Header />
      <main className="w-full max-w-[1380px] mx-auto py-8 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
        <ProductDetailSection
          product={product}
          relatedProducts={relatedProducts}
          seoTitle={seoTitle}
          seoDescription={seoDescription}
        />

        <RelatedProducts
          relatedProducts={relatedProducts}
          productSlug={product.slug}
          productTitle={product.title}
          location={product.seller_country || 'Ghana'}
        />
      </main>
      <Footer />
    </>
  );
}

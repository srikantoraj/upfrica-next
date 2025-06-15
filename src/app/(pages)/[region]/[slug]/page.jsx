// app/products/[slug]/page.js
import { notFound } from 'next/navigation';
import { BASE_API_URL } from '@/app/constants';
import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import RelatedProducts from '@/components/home/ProductList/RealtedProduct';
import ProductDetailSection from '@/components/ProductDetailSection/ProductDetailSection';

/**
 * Fetch product data by slug
 */
async function getProductData(slug) {
  if (!slug) throw new Error('No product slug provided');

  const res = await fetch(`${BASE_API_URL}/api/products/${slug}/`, {
    cache: 'no-store',
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Failed to fetch product data (${res.status})`);
  }

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
 * Dynamic page metadata
 */
export async function generateMetadata({ params: { slug } }) {
  const product = await getProductData(slug);
  if (!product) return notFound();

  return {
    title: `${product.title} – ${product.user?.country || 'Upfrica'}`,
    description: product.description?.body || '',
  };
}

/**
 * Server-rendered Product Page
 */
export default async function ProductPage({ params: { slug } }) {
  const product = await getProductData(slug);

  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(product.slug);

  return (
    <>
      <Header />
      <main className="w-full max-w-[1380px] mx-auto py-8 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
        <ProductDetailSection product={product} relatedProducts={relatedProducts} />

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
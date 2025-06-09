// app/products/[slug]/page.js

import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import RelatedProducts from '@/components/home/ProductList/RealtedProduct';


import ProductDetailSection from '@/components/ProductDetailSection/ProductDetailSection';

/**
 * Dynamically generates the page’s metadata (title & description)
 */
export async function generateMetadata({ params: { slug } }) {
    const product = await getProductData(slug);

    return {
        title: `${product?.title} – ${product?.user?.country}`,
        description: product?.description?.body,
    };
}

/**
 * Fetches the main product data by slug
 */
async function getProductData(slug) {
    if (!slug) {
        throw new Error('No product slug provided');
    }

    //const res = await fetch(`https://media.upfrica.com/api/products/${slug}/`, {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${slug}/`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch product data (${res.status})`);
    }

    return res.json();
}

/**
 * Fetches related products for the given slug
 */
async function getRelatedProducts(slug) {
    try {
        //const res = await fetch(`https://media.upfrica.com/api/products/${slug}/related/`, {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${slug}/`, {
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
 * The server component that renders the product page
 */
export default async function ProductPage({ params: { slug } }) {
    const product = await getProductData(slug);
    const relatedProducts = await getRelatedProducts(product.slug);

    return (
        <>
            <Header />

            <main className="w-full max-w-[1380px] mx-auto py-8 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
                <ProductDetailSection
                    product={product}
                    relatedProducts={relatedProducts}
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

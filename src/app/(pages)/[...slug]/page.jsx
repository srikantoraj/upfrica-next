import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import ProductList from '@/components/home/ProductList/ProductList';
import RelatedProducts from '@/components/home/ProductList/RealtedProduct';
import ProductDetailSection from '@/components/ProductDetailSection/ProductDetailSection';
import Slider from '@/components/Slider';
import TextSection from '@/components/TextSection';
import Dummy from '@/components/ui/details/Dummy';
import React from 'react';

// Update getProductData to accept a string slug directly
async function getProductData(slug) {
    if (!slug) {
        throw new Error('No product selected');
    }
    const res = await fetch(`https://media.upfrica.com/api/products/${slug}/`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch product data');
    }

    return res.json();
}

// Generate dynamic metadata for each product page
export async function generateMetadata({ params }) {
    // params.slug is an array; get the last segment (the actual product slug)
    const slugArray = params.slug || [];
    const slug = slugArray[slugArray.length - 1];

    const product = await getProductData(slug);

    // Example of cleaning description text (if needed)
    function removeSpecificTags(input) {
        if (typeof input !== 'string') {
            throw new TypeError('Input must be a string');
        }
        const regex = /<\/?(li|ul|p)[^>]*>/gi;
        return input.replace(regex, '');
    }

    return {
        title: `${product.title} - ${product?.user?.country}`,
        description: product?.description?.body,
    };
}

// The main component to render product details
export default async function ProductDetails({ params }) {
    // Extract the slug from the params. Use the last element of the catch-all array.
    const slugArray = params.slug || [];
    // Assume that if there are two segments, the first is the county
    const countryFromUrl = slugArray.length > 1 ? slugArray[0] : null;
    const productSlug = slugArray[slugArray.length - 1];

    const product = await getProductData(productSlug);

    return (
        <>
            <Header />
            <div className="container mx-auto">
                <ProductDetailSection product={product} />
                <RelatedProducts productId={productSlug} />
            </div>
            <Footer />
        </>
    );
}

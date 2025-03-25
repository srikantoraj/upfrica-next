// // 'use client'
// import Footer from '@/components/common/footer/Footer';
// import Header from '@/components/common/header/Header';
// import ProductList from '@/components/home/ProductList/ProductList';
// import RelatedProducts from '@/components/home/ProductList/RealtedProduct';
// import ProductDetailSection from '@/components/ProductDetailSection/ProductDetailSection';
// import Slider from '@/components/Slider';
// import TextSection from '@/components/TextSection';
// import Dummy from '@/components/ui/details/Dummy';
// import React from 'react';
// // import ReactImageMagnify from 'react-image-magnify';

// async function getProductData({ params }) {

//     if (!params || !params.slug) {
//         return <h1>No product selected</h1>;
//     }
//     const res = await fetch(`https://media.upfrica.com/api/products/${slug}/`, {
//         // Cache the response for better performance
//         cache: 'no-store', // Use 'no-store' if data changes frequently
//     });

//     if (!res.ok) {
//         // Handle errors gracefully
//         throw new Error('Failed to fetch product data');
//     }

//     const product = await res.json();
//     return product;
// }





// // Function to generate dynamic metadata for each product page
// export async function generateMetadata({ params }) {
//     const { slug } = params;
//     const product = await getProductData(slug);

//     function removeSpecificTags(input) {
//         if (typeof input !== 'string') {
//             throw new TypeError('Input must be a string');
//         }
//         const regex = /<\/?(li|ul|p)[^>]*>/gi;
//         const cleanedString = input.replace(regex, '');

//         return cleanedString;
//     }

//     return {
//         title: `${product.title}  - ${product?.user?.country}`, // Ensure 'product.name' exists
//         description: product?.description?.body,     // Ensure 'product.description.body' exists
//         // You can add more metadata here if needed

//     };
// }

// // The main component to render product details
// export default async function ProductDetails({ params }) {
//     const { slug } = params;
//     // Fetch the product data
//     const product = await getProductData(slug);
//     const {
//         product_images,
//         title,
//         description,

//     } = product || {};


//     const laptopDetails = [
//         {
//             Condition: "Renewed",
//             Brand: "Dell",
//             Type: "Laptops",
//             ModelName: "Dell Latitude 3380",
//             ScreenSizeInches: 13.3,
//             HardDiskSizeGB: 128,
//             CpuModelGHz: 2.0,
//             RamMemoryGB: 4,
//             OperatingSystem: "Windows 11",
//             Series: "Core i3",
//             Features: ["HDMI", "Bluetooth", "Camera", "WiFi Connection", "USB Ports"],
//             UpfricaItemID: "JERB7PX8",
//             ItemNumber: "0000003487",
//         },
//     ];

//     return (
//         <>
//             <Header />
//             <div>
//                 <div className=" container mx-auto">
//                     {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-10 ">
//             <Slider images={product_images} />
//             <TextSection product={product} />
//           </div> */}
//                     <ProductDetailSection product={product} />
//                     {/* <Dummy title={title} description={description || "This is a test description"} /> */}
//                     <RelatedProducts productId={slug} />
//                 </div>
//             </div>
//             <Footer />
//         </>

//     );
// }




// No "use client" directive here because this is a server component

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
        // You might want to handle this case differently in a server component.
        throw new Error('No product selected');
    }
    const res = await fetch(`https://media.upfrica.com/api/products/${slug}/`, {
        cache: 'no-store', // Use 'no-store' if data changes frequently
    });

    if (!res.ok) {
        // Handle errors gracefully
        throw new Error('Failed to fetch product data');
    }

    return res.json();
}

// Generate dynamic metadata for each product page
export async function generateMetadata({ params }) {
    // params.slug is an array; extract the first segment or join if necessary.
    const slugArray = params.slug || [];
    const slug = slugArray[0]; // or use: const slug = slugArray.join('/');

    const product = await getProductData(slug);

    // Example of cleaning description text
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
        // Additional metadata can be added here.
    };
}

// The main component to render product details
export default async function ProductDetails({ params }) {
    // Extract the slug from the params. Since this is a catch-all route, it's an array.
    const slugArray = params.slug || [];
    const slug = slugArray[0]; // or use: const slug = slugArray.join('/');

    // Fetch the product data using the slug
    const product = await getProductData(slug);

    return (
        <>
            <Header />
            <div className="container mx-auto">
                <ProductDetailSection product={product} />
                <RelatedProducts productId={slug} />
            </div>
            <Footer />
        </>
    );
}

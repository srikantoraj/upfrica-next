// 'use client'
import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import ProductList from '@/components/home/ProductList/ProductList';
import RelatedProducts from '@/components/home/ProductList/RealtedProduct';
import ProductDetailSection from '@/components/ProductDetailSection/ProductDetailSection';
import Slider from '@/components/Slider';
import TextSection from '@/components/TextSection';
import Dummy from '@/components/ui/details/Dummy';
import React from 'react';
// import ReactImageMagnify from 'react-image-magnify';

async function getProductData(slug) {
  const res = await fetch(`https://media.upfrica.com/api/products/${slug}/`, {
    // Cache the response for better performance
    cache: 'no-store', // Use 'no-store' if data changes frequently
  });

  if (!res.ok) {
    // Handle errors gracefully
    throw new Error('Failed to fetch product data');
  }

  const product = await res.json();
  return product;
}





// Function to generate dynamic metadata for each product page
export async function generateMetadata({ params }) {
  const { slug } = params;
  const product = await getProductData(slug);

  function removeSpecificTags(input) {
    if (typeof input !== 'string') {
      throw new TypeError('Input must be a string');
    }
    const regex = /<\/?(li|ul|p)[^>]*>/gi;
    const cleanedString = input.replace(regex, '');

    return cleanedString;
  }

  return {
    title: `${product.title}  - ${product?.user?.country}`, // Ensure 'product.name' exists
    description: product?.description?.body,     // Ensure 'product.description.body' exists
    // You can add more metadata here if needed

  };
}

// The main component to render product details
export default async function ProductDetails({ params }) {
  const { slug } = params;
  // Fetch the product data
  const product = await getProductData(slug);
  const {
    product_images,
    title,
    description,

  } = product || {};


  const laptopDetails = [
    {
      Condition: "Renewed",
      Brand: "Dell",
      Type: "Laptops",
      ModelName: "Dell Latitude 3380",
      ScreenSizeInches: 13.3,
      HardDiskSizeGB: 128,
      CpuModelGHz: 2.0,
      RamMemoryGB: 4,
      OperatingSystem: "Windows 11",
      Series: "Core i3",
      Features: ["HDMI", "Bluetooth", "Camera", "WiFi Connection", "USB Ports"],
      UpfricaItemID: "JERB7PX8",
      ItemNumber: "0000003487",
    },
  ];

  return (
    <>
      <Header />
      <div>
        <div className=" container mx-auto">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-10 ">
            <Slider images={product_images} />
            <TextSection product={product} />
          </div> */}
          <ProductDetailSection product={product} />
          {/* <Dummy title={title} description={description || "This is a test description"} /> */}
          <RelatedProducts productId={slug} />
        </div>
      </div>
      <Footer />
    </>

  );
}
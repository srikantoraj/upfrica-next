// 'use client'
import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import ProductList from '@/components/home/ProductList/ProductList';
import Slider from '@/components/Slider';
import TextSection from '@/components/TextSection';
import Dummy from '@/components/ui/details/Dummy';
import React from 'react';
// import ReactImageMagnify from 'react-image-magnify';

async function getProductData(id) {
  const res = await fetch(`https://upfrica-staging.herokuapp.com/api/v1/products/${id}`, {
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

// Function to generate static paths for all products
export async function generateStaticParams() {
  const res = await fetch('https://upfrica-staging.herokuapp.com/api/v1/products');

  if (!res.ok) {
    throw new Error('Failed to fetch products for static paths');
  }

  const products = await res.json();

  return products.products.map((product) => ({
    id: product.id.toString(),
  }));
}

// Function to generate dynamic metadata for each product page
export async function generateMetadata({ params }) {
  const { id } = params;
  const product = await getProductData(id);

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
    description: removeSpecificTags(product?.description?.body),     // Ensure 'product.description.body' exists
    // You can add more metadata here if needed

  };
}

// The main component to render product details
export default async function ProductDetails({ params }) {
  const { id } = params;

  // Fetch the product data
  const product = await getProductData(id);
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

  // const datas = [
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNzhHQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--f9d701000402b6634ad598665ecd048f568c26a1/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--1f597fae043315a1f6069a2ebe258ef78d4a385e/10263691_001.jpeg",
  //     title: "Good nothing country.",
  //     price: 27.9,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdkZBIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7187ba3759a9a83763c40f1d668e9a827178ff4c/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--f6a9d5da1ca7272c0d5ee49ccee29a1023f14abe/617myiTpYRL._AC_UF1000,1000_QL80_FMwebp_.webp",
  //     title: "Really scientist certainly tax.",
  //     price: 63.89,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdGQ5IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--520b2ab8ded488bab1b390f2df544b1c71717db3/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBUT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--3095e24fd31f63b05a82bb8e43a2ff174971486d/Screenshot%202023-10-18%20095415.png",
  //     title: "Reach goal six throughout price.",
  //     price: 66.27,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcWZzIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--364d7db8f1ede59593008a31995065bf1091c871/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--1f597fae043315a1f6069a2ebe258ef78d4a385e/upfrica-laptop.jpeg",
  //     title: "Study movement.",
  //     price: 12.1,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcnJ0IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--56c1277bc68ea0b20d49622a739f9e85732f4238/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBUT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--7e58ae838154e3bab96ff19fe4ba2866ae9322e2/IMG-20240509-WA0002.jpg",
  //     title: "Lot politics factor apply memory.",
  //     price: 84.67,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcnJ0IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--56c1277bc68ea0b20d49622a739f9e85732f4238/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBUT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--7e58ae838154e3bab96ff19fe4ba2866ae9322e2/IMG-20240509-WA0002.jpg",
  //     title: "Market program Republican wear money.",
  //     price: 75.24,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdXpHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e3d36e806d492162640f955880df13995e4c1356/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBUT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--3095e24fd31f63b05a82bb8e43a2ff174971486d/IdeaPad_1_14IGL7_CT4_01.png",
  //     title: "Stuff thought know yet.",
  //     price: 56.23,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdWR3IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--0a059c8204038053d036a7dc735ea3412e8a7512/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBUT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--7e58ae838154e3bab96ff19fe4ba2866ae9322e2/microsoft-3tgg.jpg",
  //     title: "Foot red.",
  //     price: 15.25,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBamxwIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--633e907e4242bd4cd68d6a2515ed502d12b7b73a/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--0f68375eaf441ecd8b3a772d120bb6aff2c461ab/Screenshot%202023-08-11%20at%2012.16.55.png",
  //     title: "May team ahead whole.",
  //     price: 28.42,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBendJQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--ba5cb6fb796f4311949ce46de50e07472e5c3caf/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--0f68375eaf441ecd8b3a772d120bb6aff2c461ab/Screenshot%202024-08-31%20at%2018.14.50.png",
  //     title: "Feeling position water.",
  //     price: 28.38,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBelVJQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--6b7a9774f2923e0469c9754357cb4e73a965b840/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--822becc989580aaeb23fb25e468593064e9c80da/s-l1200.webp",
  //     title: "But ok care how.",
  //     price: 57.55,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeW9JQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0e80103fe0bd107770bae6213b279bc234ceea61/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--0f68375eaf441ecd8b3a772d120bb6aff2c461ab/Screenshot%202024-08-31%20at%2016.18.14.png",
  //     title: "Sit choice both.",
  //     price: 53.04,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeG9JQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--5bc7abdea300067e0ba7d79787884e08db0c33e7/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--0f68375eaf441ecd8b3a772d120bb6aff2c461ab/Screenshot%202024-08-31%20at%2015.09.37.png",
  //     title: "Agree management interest.",
  //     price: 11.14,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBamNHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7c4f67b56f4c6b808e59526d2218a94b89cf568d/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bd58729da459fbfda670b840147c70989e0602a2/HTB1XxGvaRCw3KVjSZR0q6zcUpXaR.jpg",
  //     title: "Blood property Democrat style.",
  //     price: 22.02,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcHBlIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--ec317547139e778bce8d6691358157053300cf86/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--822becc989580aaeb23fb25e468593064e9c80da/up-bdyuy1.webp",
  //     title: "Bar face thus floor course.",
  //     price: 40.96,
  //     },
  //     {
  //     img: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBc0pyIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--b725957f19ea1b06b9ce10d8e44709008068cb69/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--822becc989580aaeb23fb25e468593064e9c80da/fis-scale-1.webp",
  //     title: "Draw hundred will.",
  //     price: 89.13,
  //     },
  // ];

  return (
    <>
      <Header />
      <div className='px-4'>

        <div className=" container space-y-6 md:w-full lg:w-3/4 xl:w-4/5  lg:mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5 lg:mx-auto">
            <Slider product_images={product_images} />

            <TextSection product={product} />
          </div>
          <Dummy title={title} description={description || "This is a test description"} />
        </div>

        {/* <ProductList title={'Recommended'} /> */}
      </div>
      <Footer />
    </>

  );
}
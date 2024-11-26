// "use client"
// import { useEffect, useState } from "react";

import Header from "@/components/common/header/Header";
import ProductList from "@/components/home/ProductList/ProductList";
import FAQ from "@/components/home/Faq/Faq";
import Footer from "@/components/common/footer/Footer";
import Categories from "@/components/home/Categories/Categories";
import AboutSection from "@/components/home/About/About";
import Link from "next/link";
import User from "@/components/User";
import Cover from "@/components/common/header/Cover";
import EarlyDeals from "@/components/EarlyDeals";
import Selling from "@/components/Selling";

export default function Home() {
  return (
    <div className="bg-gray-200">
      <Header />
      <Cover/>
      <EarlyDeals/>
      {/* <Categories /> */}
        <ProductList />
        <Selling/>
        <AboutSection />
        <ProductList title="Selected for you" />
        <FAQ />
      <Footer />
      <User />
    </div>
  );
}

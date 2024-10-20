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


export default function Home() {
 
  return (
    <>
      <Header />
      <Categories />
      <ProductList />
      <AboutSection />
      <ProductList title="Selected for you" />
      <FAQ />
      <Footer />
      <User/>
      
    </>
  );
}

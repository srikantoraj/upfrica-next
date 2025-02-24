

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
import Tranding from "@/components/Tranding";
import SellectedItem from "@/components/SellectedItem";

export default function Home() {
  return (
    <div className="bg-gray-100">
      <Header />
      {/* <Cover /> */}
      <EarlyDeals />
      <ProductList />
      <Selling />
      <Tranding title="Trending in Women’s Fashion" />
      <SellectedItem />
      <Selling color="green" />
      <Tranding title="New arrivals" />
      <Categories />
      {/* <AboutSection /> */}
      {/* <ProductList title="Selected for you" /> */}
      <FAQ />
      <Footer />
      <User />
    </div>
  );
}

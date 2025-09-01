import Footer from "@/components/common/footer/Footer";
import CtaFooterBanner from "@/components/shopify/CtaFooterBanner";
import Header from "@/components/shopify/Header";
import NewsletterBanner from "@/components/shopify/NewsletterBanner";
import ShopifyBanner from "@/components/shopify/ShopifyBanner";
import ShopifyShippingHero from "@/components/shopify/ShopifyShippingHero";
import TradeUpdateSection from "@/components/shopify/TradeUpdateSection";
import React from "react";

const Shopify = () => {
  return (
    <div className="">
      <Header />
      <ShopifyBanner />
      <ShopifyShippingHero />
      <TradeUpdateSection />
      <NewsletterBanner />
      <CtaFooterBanner />
      <Footer />
    </div>
  );
};

export default Shopify;

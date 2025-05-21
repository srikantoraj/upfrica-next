// import Header from "@/components/common/header/Header";
// import ProductList from "@/components/home/ProductList/ProductList";
// import FAQ from "@/components/home/Faq/Faq";
// import Footer from "@/components/common/footer/Footer";
// import Categories from "@/components/home/Categories/Categories";
// import AboutSection from "@/components/home/About/About";
// import Link from "next/link";
// import User from "@/components/User";
// import Cover from "@/components/common/header/Cover";
// import EarlyDeals from "@/components/EarlyDeals";
// import Selling from "@/components/Selling";
// import Tranding from "@/components/WomenFasion";
// import SellectedItem from "@/components/SellectedItem";
// import NewArrivals from "@/components/common/New arrivals/NewArrivals";
// import WomenFasion from "@/components/WomenFasion";
// import MenFashion from "@/components/men fashion/MenFashion";
// import RecentlyViewedList from "@/components/home/ProductList/RecentlyViewedList";
// import RegionSetter from "./RegionSetter";

// export default function CountrySpecificHome({params}) {
//   const { region } = params;
//   console.log("Region:", region);
//   return (
//     <div className="bg-gray-100">
//       <RegionSetter region={region} />
//       <Header />
//       <EarlyDeals />
//       <ProductList title={"Selected by Upfrica"} />
//       <Selling />
//       <RecentlyViewedList title="Recently Viewed Products" />
//       <WomenFasion title="Trending in Women’s Fashion" />
//       <SellectedItem />
//       <MenFashion title="Trending in Men’s Fashion" />
//       <Selling color="green" />
//       <NewArrivals title="New arrivals" />
//       <Categories />
//       <FAQ />
//       <Footer />
//       <User />
//     </div>
//   );
// }



// app/[region]/page.js

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
import Tranding from "@/components/WomenFasion";
import SellectedItem from "@/components/SellectedItem";
import NewArrivals from "@/components/common/New arrivals/NewArrivals";
import WomenFasion from "@/components/WomenFasion";
import MenFashion from "@/components/men fashion/MenFashion";
import RecentlyViewedList from "@/components/home/ProductList/RecentlyViewedList";
import RegionSetter from "./RegionSetter";

/**
 * Dynamically generates the page’s metadata (title & description)
 * based on the country code in the URL (bd, gb, gh, etc.)
 */
export async function generateMetadata({ params: { region } }) {
  // map region codes to display names
  const regionNames = {
    bd: "Bangladesh",
    gb: "United Kingdom",
    gh: "Ghana",
    // add more as needed
  };
  const countryName = regionNames[region] || "Global";

  return {
    title: `Upfrica — ${countryName}`,
    description: `Explore our curated selection of products in ${countryName}.`,
  };
}

export default function CountrySpecificHome({ params: { region } }) {
  console.log("Region:", region);

  return (
    <div className="bg-gray-100">
      <RegionSetter region={region} />

      <Header />
      <Cover />

      <EarlyDeals />
      <ProductList title={`Selected by Upfrica — ${region.toUpperCase()}`} />

      <Selling />
      <RecentlyViewedList title="Recently Viewed Products" />

      <WomenFasion title="Trending in Women’s Fashion" />
      <SellectedItem />

      <MenFashion title="Trending in Men’s Fashion" />
      <Selling color="green" />

      <NewArrivals title="New arrivals" />
      <Categories />

      <AboutSection />

      <FAQ />
      <Footer />

      <User />
    </div>
  );
}

// app/(pages)/[cc]/layout.jsx
import { cookies } from "next/headers";
import { isoToCc } from "@/lib/cc";
import { api } from "@/lib/api";
import { COUNTRY_META, fetchCategories } from "@/lib/home";

import LocalizationProvider from "@/contexts/LocalizationProvider"; // ⬅️ add this
import Header from "@/components/home/Header";
import TopBar from "@/components/home/TopBar";
import Footer from "@/components/home/Footer";
import BottomBar from "@/components/home/BottomBar";

export const dynamic = "force-static";
export const revalidate = 21600; // 6h

export async function generateMetadata({ params: { cc } }) {
  const BASE = "https://www.upfrica.com";
  const data = await api(`/api/countries/`, {
    next: { revalidate: 21600, tags: ["countries"] },
  }).catch(() => null);

  const items = Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data)
    ? data
    : [];

  const markets = (items.length ? items : [{ code: "GH" }, { code: "NG" }, { code: "GB" }])
    .map((c) => isoToCc(c.code || c.iso || "GH"));

  const langs = Object.fromEntries(
    markets.map((x) => [`en-${x === "uk" ? "GB" : x.toUpperCase()}`, `${BASE}/${x}`])
  );

  return { alternates: { languages: { ...langs } } };
}

export const dynamicParams = true;

export default async function CountryLayout({ children, params: { cc } }) {
  const country = String(cc || "gh").toLowerCase();
  const meta = COUNTRY_META[country] || COUNTRY_META.gh;

  // deliver-to city hint for header pill
  const ck = cookies();
  const deliverTo =
    ck.get(`deliver_to_${country}`)?.value ||
    ck.get("deliver_to")?.value ||
    (COUNTRY_META[country]?.cities?.[0] || "City");

  // categories for header's "All Categories" menu
  const categories = await fetchCategories(country).catch(() => []);

  return (
    <LocalizationProvider routeCc={country}>
      <div className="min-h-screen flex flex-col">
        <Header
          cc={country}
          countryCode={meta.code}
          searchPlaceholder="Search products, brands, shops…"
          deliverCity={deliverTo}
          categories={categories}
        />
        <TopBar cc={country} country={meta.name} />

        <main className="flex-1">{children}</main>

        <Footer cc={country} />
        <BottomBar cc={country} />
      </div>
    </LocalizationProvider>
  );
}
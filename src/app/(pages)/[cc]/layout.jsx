// app/(pages)/[cc]/layout.jsx
import { isoToCc } from "@/lib/cc";
import { api } from "@/lib/api";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";

export const dynamic = "force-static";
export const revalidate = 21600; // 6h

export async function generateMetadata({ params: { cc } }) {
  const BASE = "https://www.upfrica.com";
  // Countries from API (fallback hard-coded)
  const data = await api(`/api/countries/`, { next: { revalidate: 21600, tags: ["countries"] } }).catch(() => null);
  const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  const markets = (items.length ? items : [{ code: "GH" }, { code: "NG" }, { code: "GB" }])
    .map(c => isoToCc(c.code || c.iso || "GH"));
  const langs = Object.fromEntries(
    markets.map(x => [`en-${x === "uk" ? "GB" : x.toUpperCase()}`, `${BASE}/${x}`])
  );
  return {
    alternates: { languages: { ...langs } },
  };
}

// Optional safety: 404/redirect unknown cc
export const dynamicParams = true;

export default function CountryLayout({ children, params: { cc } }) {
  return (
    <div className="min-h-screen">
      {/*<Header />*/}
      {children}
      <Footer />
    </div>
  );
}
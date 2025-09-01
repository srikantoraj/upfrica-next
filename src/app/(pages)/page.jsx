// app/(pages)/page.jsx
import Link from "next/link";

// Serve a static x-default page; refresh every 6 hours
export const dynamic = "force-static";
export const revalidate = 21600; // 6h

// Hard-coded markets (expand as needed)
const MARKETS = [
  { cc: "gh", name: "Ghana", flag: "🇬🇭", locale: "en-GH" },
  { cc: "ng", name: "Nigeria", flag: "🇳🇬", locale: "en-NG" },
  { cc: "uk", name: "United Kingdom", flag: "🇬🇧", locale: "en-GB" },
];

// Absolute URLs for hreflang (good for SEO)
const BASE = "https://www.upfrica.com";

export async function generateMetadata() {
  const languages = Object.fromEntries(
    MARKETS.map((m) => [m.locale, `${BASE}/${m.cc}`])
  );
  languages["x-default"] = `${BASE}/`;

  return {
    title: "Upfrica — Choose your country",
    description: "Select your country to shop local products with fast delivery.",
    alternates: { languages },
    openGraph: {
      title: "Upfrica",
      description: "Shop locally across Africa & the diaspora.",
      url: `${BASE}/`,
      siteName: "Upfrica",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Upfrica",
      description: "Shop locally across Africa & the diaspora.",
    },
  };
}

export default function XDefaultRoot() {
  return (
    <main className="min-h-[100svh] bg-[#f6f7f9] text-[#111827]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight">Upfrica</h1>
          <p className="mt-2 text-gray-600">
            Choose your country to see local products, pricing, and delivery.
          </p>
        </header>

        <section
          aria-label="Country picker"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {MARKETS.map((m) => (
            <Link
              key={m.cc}
              href={`/${m.cc}`}
              prefetch={false}
              className="group rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-sm transition"
            >
              <div className="text-3xl" aria-hidden>
                {m.flag}
              </div>
              <div className="mt-3 font-semibold">{m.name}</div>
              <div className="text-sm text-gray-500">/{m.cc}</div>
            </Link>
          ))}
        </section>

        <footer className="mt-10 text-center text-xs text-gray-500">
          Humans may be redirected automatically based on location.
          Crawlers see this x-default page with hreflang links.
        </footer>
      </div>
    </main>
  );
}
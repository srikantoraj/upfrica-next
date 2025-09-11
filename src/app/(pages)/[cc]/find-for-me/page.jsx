//src/app/(pages)/[cc]/find-for-me/page.jsx
import Script from "next/script";
import RequestForm from "@/components/sourcing/RequestForm";
import OfferList from "@/components/sourcing/OfferList";

const CC_NAMES = {
  gh: "Ghana",
  ng: "Nigeria",
  ke: "Kenya",
  tz: "Tanzania",
  ug: "Uganda",
  za: "South Africa",
};

// Dynamic, per-cc metadata
export async function generateMetadata({ params }) {
  const cc = (params?.cc || "gh").toLowerCase();
  const country = CC_NAMES[cc] || cc.toUpperCase();
  const canonical = `/${cc}/find-for-me`;
  const title = `Find-for-me sourcing in ${country} | Upfrica`;
  const description =
    "Tell us what you need. We’ll find vetted sellers, negotiate, and bring you offers.";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "x-default": "/find-for-me",
        [`en-${cc.toUpperCase()}`]: canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function FindForMePage({ params }) {
  const cc = (params?.cc || "gh").toLowerCase();
  const country = CC_NAMES[cc] || cc.toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Find-for-me sourcing – Upfrica ${country}`,
    areaServed: {
      "@type": "Country",
      name: country,
      isoAlpha2Code: cc.toUpperCase(),
    },
    provider: {
      "@type": "Organization",
      name: "Upfrica",
      url: "/",
    },
    description:
      "Concierge sourcing: submit a request, get matched to sellers, compare offers, and checkout securely.",
    potentialAction: {
      "@type": "OrderAction",
      target: `/${cc}/find-for-me`,
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Script id="ld-json-find-for-me" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      <h1 className="text-2xl font-semibold mb-2">Find-for-me</h1>
      <p className="text-neutral-600 mb-6">
        Tell us what you need in {country}. We’ll source offers from vetted sellers.
      </p>

      <RequestForm cc={cc} />
      <OfferList cc={cc} />
    </div>
  );
}
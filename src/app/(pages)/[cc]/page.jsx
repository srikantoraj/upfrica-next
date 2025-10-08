
// app/(pages)/[cc]/page.jsx
import { Suspense } from "react";
import HeroCurved from "@/components/home/HeroCurved";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoTiles from "@/components/home/PromoTiles";
import ValuePills from "@/components/home/ValuePills";
import NavCategories from "@/components/home/NavCategories";
import PersonalizedRails from "@/components/home/PersonalizedRails.server";

import { api } from "@/lib/api"; // use proxy for CMS fetch too ✅
import {
  COUNTRY_META,
  fetchCategories,
  getHomeRails,
} from "@/lib/home";
import { SITE_BASE_URL, API_BASE } from "@/app/constants";

export const revalidate = 300;
export const dynamic = "auto";

/* ---------- ISO <-> slug helpers (GB <-> uk) ---------- */
const isoToSlug = (iso) =>
  (String(iso).toUpperCase() === "GB" ? "uk" : String(iso || "").toLowerCase());
const slugToIso = (slug) =>
  (String(slug).toLowerCase() === "uk" ? "GB" : String(slug || "").toUpperCase());

/* ---------- consistent cc normalization (uk → gb for backend) ---------- */
const COUNTRY_ALIAS = { uk: "gb" };
const normCc = (cc) =>
  (COUNTRY_ALIAS?.[cc?.toLowerCase?.()] ?? cc ?? "gh").toLowerCase();

/* ---------- build static params from backend-supported countries ---------- */
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/i18n/init/`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`init ${res.status}`);
    const data = await res.json();
    const supported = (data?.supported?.countries || [])
      .map((c) => isoToSlug(c.code))
      .filter(Boolean);
    const uniq = Array.from(new Set(supported));
    return (uniq.length ? uniq : ["gh", "ng", "uk"]).map((cc) => ({ cc }));
  } catch {
    return ["gh", "ng", "uk"].map((cc) => ({ cc }));
  }
}

export async function generateMetadata({ params }) {
  const ccSlug = (params?.cc || "gh").toLowerCase(); // gh|ng|uk (slug)
  const meta = COUNTRY_META[ccSlug] || COUNTRY_META.gh;

  let countryName = meta.name;
  try {
    const res = await fetch(`${API_BASE}/i18n/init/?country=${encodeURIComponent(ccSlug)}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const j = await res.json();
      const iso = slugToIso(ccSlug);
      const hit = (j?.supported?.countries || []).find(
        (c) => String(c.code).toUpperCase() === iso
      );
      if (hit?.name) countryName = hit.name;
    }
  } catch { }

  const baseUrl = SITE_BASE_URL || "https://www.upfrica.com";
  const url = `${baseUrl}/${ccSlug}`;

  return {
    title: `${countryName} • Upfrica Marketplace — Fast Delivery, Local Sellers`,
    description: meta.lcpTagline,
    alternates: {
      canonical: url,
      languages: {
        "en-GH": `${baseUrl}/gh`,
        "en-NG": `${baseUrl}/ng`,
        "en-GB": `${baseUrl}/uk`,
        "x-default": `${baseUrl}/`,
      },
    },
    openGraph: {
      title: `Upfrica ${countryName}`,
      description: meta.lcpTagline,
      url,
      siteName: "Upfrica",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og/upfrica-${ccSlug}.png`,
          width: 1200,
          height: 630,
          alt: `Upfrica ${countryName}`,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Upfrica ${countryName}`,
      description: meta.lcpTagline,
      images: [`${baseUrl}/og/upfrica-${ccSlug}.png`],
    },
  };
}

/* ---------------------- CMS fetch helper (via proxy) ---------------------- */
// Route CMS/home through the same proxy as products/categories
async function fetchCountryHome(cc) {
  const ccn = normCc(cc);
  try {
    const data = await api(`/home/${ccn}/`, {
      method: "GET",
      next: { revalidate: 300, tags: [`home-${ccn}`] },
    });
    if (data && typeof data === "object") return data;
    return { country: ccn, version: 0, updated_at: null, sections: [] };
  } catch {
    return { country: ccn, version: 0, updated_at: null, sections: [] };
  }
}

function pickImage(section, name, fallback) {
  if (!section) return fallback;
  if (section.primary_image?.url) return section.primary_image.url;
  const byName = section.images_by_name || {};
  if (byName[name]) return byName[name];
  return section.images?.[0]?.url || fallback;
}

const HERO_FALLBACK = {
  gh: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=2400&auto=format&fit=crop",
  ng: "https://images.unsplash.com/photo-1590648938591-6fc4f1a6391c?q=80&w=2400&auto=format&fit=crop",
  uk: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2400&auto=format&fit=crop",
  gb: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2400&auto=format&fit=crop",
};
const heroImage = (cc) => HERO_FALLBACK[cc] || HERO_FALLBACK.gh;

function cardImageFromCMS(card, section, fallback) {
  if (card?.image) return card.image;
  if (card?.image_name) {
    const byName = section?.images_by_name || {};
    if (byName[card.image_name]) return byName[card.image_name];
    const hit = section?.images?.find?.((i) => i.name === card.image_name);
    if (hit?.url) return hit.url;
  }
  return fallback;
}

function heroCurvedFromCMS(section, ccSlug, meta) {
  const cfg = section?.config || {};
  const cityList =
    Array.isArray(cfg.cities) && cfg.cities.length > 0
      ? cfg.cities
      : COUNTRY_META[ccSlug]?.cities || ["Your City"];
  const city = cityList[0];

  const normalizeHref = (href) => {
    if (!href || typeof href !== "string") return href;
    if (!href.startsWith("/")) return href; // leave externals
    // Rewrite internal paths that start with a country prefix to the current slug
    return href.replace(/^\/(gh|ng|uk|gb)(?=\/|$)/i, `/${ccSlug}`);
  };

  const defaults = [
    { title: "Today’s Deals", href: `/${ccSlug}/deals` },
    { title: `Same-Day in ${city}`, href: `/${ccSlug}/search?delivery=same-day` },
    { title: "Wholesale & Bulk", href: `/${ccSlug}/wholesale` },
  ];

  const rawCards = Array.isArray(cfg.mini_cards) ? cfg.mini_cards.slice(0, 3) : [];
  const miniCards = Array.from({ length: 3 }).map((_, i) => {
    const raw = rawCards[i] || {};
    const fallbackImageName = `hero_card_${i}`;
    const image = cardImageFromCMS(
      { image: raw.image, image_name: raw.image_name || fallbackImageName },
      section,
      null
    );
    return {
      title: raw.title || defaults[i].title,
      href: normalizeHref(raw.href || defaults[i].href),
      ...(image ? { image } : {}),
    };
  });

  const mainImage =
    (cfg.image_slot &&
      (section?.images_by_name?.[cfg.image_slot] ||
        section?.images?.find?.((i) => i.name === cfg.image_slot)?.url)) ||
    pickImage(section, "hero", heroImage(ccSlug));

  const primaryCtaRaw =
    cfg.primaryCta || cfg.primary_cta || { label: "Browse Today’s Deals", href: `/${ccSlug}/deals` };
  const secondaryCtaRaw =
    cfg.secondaryCta || cfg.secondary_cta || { label: "Sell on Upfrica", href: `/${ccSlug}/sell` };

  const primaryCta = { ...primaryCtaRaw, href: normalizeHref(primaryCtaRaw.href) };
  const secondaryCta = { ...secondaryCtaRaw, href: normalizeHref(secondaryCtaRaw.href) };

  return {
    cc: ccSlug,
    headline: cfg.headline || meta.lcpHeadline,
    tagline: cfg.tagline || meta.lcpTagline,
    image: mainImage,
    alt: cfg.alt || `Upfrica ${meta.name} marketplace deals banner`,
    primaryCta,
    secondaryCta,
    miniCards,
  };
}

function bannersFromCMS(section, ccSlug) {
  if (!section) return [];
  const cfg = section.config || {};
  const imgs = section.images || [];
  return imgs.map((img, i) => ({
    title: cfg[`title_${i + 1}`] || section.title || "Featured",
    sub: cfg[`sub_${i + 1}`] || section.subtitle || "",
    href: cfg[`href_${i + 1}`] || `/${ccSlug}/deals`,
    img: img.url,
  }));
}

function promosFromCMS(section, ccSlug) {
  if (!section) return [];
  const cfg = section.config || {};
  const imgs = section.images || [];
  return imgs.slice(0, 3).map((img, i) => ({
    title: (cfg.promos && cfg.promos[i]?.title) || cfg[`title_${i + 1}`] || "Promo",
    href: (cfg.promos && cfg.promos[i]?.href) || cfg[`href_${i + 1}`] || `/${ccSlug}/deals`,
    image: img.url,
  }));
}

/* --------------------------------- PAGE --------------------------------- */
export default async function CountryHome({ params }) {
  // ccSlug is what appears in the URL (gh|ng|uk)
  const ccSlug = (params?.cc || "gh").toLowerCase();
  // cc is what the backend expects (uk -> gb)
  const cc = normCc(ccSlug);
  const meta = COUNTRY_META[ccSlug] || COUNTRY_META.gh;

  const [cms, categories, fallbackRails] = await Promise.all([
    fetchCountryHome(cc),               // via proxy ✅ ensures correct CC headers
    fetchCategories(cc).catch(() => []),
    getHomeRails(cc),                   // static fallback rails (no cookies)
  ]);

  const sections = cms?.sections || [];
  const heroSec =
    sections.find((s) => s.kind === "hero_curved" && s.key === "hero") ||
    sections.find((s) => s.kind === "hero_curved");
  const bannerSec = sections.find((s) => s.kind === "banner_carousel");
  const promoSec = sections.find((s) => s.kind === "promo_tiles");

  const heroProps = heroCurvedFromCMS(heroSec, ccSlug, meta);
  const banners = bannersFromCMS(bannerSec, ccSlug);
  const promos = promosFromCMS(promoSec, ccSlug);

  return (
    <main className="bg-[#f1f2f4] text-[var(--ink)]">
      <HeroCurved section={heroSec} cc={ccSlug} {...heroProps} />
      {banners.length > 0 && <HeroCarousel banners={banners} />}
      <ValuePills cc={ccSlug} />
      <NavCategories categories={categories} />
      {promos.length > 0 && <PromoTiles tiles={promos} />}

      {/* cookie/personalized rails in a dynamic nested component */}
      <Suspense fallback={null}>
        <PersonalizedRails cc={ccSlug} fallbackRails={fallbackRails} />
      </Suspense>
    </main>
  );
}

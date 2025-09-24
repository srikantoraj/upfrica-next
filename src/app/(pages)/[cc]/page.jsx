// app/(pages)/[cc]/page.jsx
import { Suspense } from "react";

import HeroCurved from "@/components/home/HeroCurved";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoTiles from "@/components/home/PromoTiles";
import ValuePills from "@/components/home/ValuePills";
import NavCategories from "@/components/home/NavCategories";
import PersonalizedRails from "@/components/home/PersonalizedRails.server";

import {
  COUNTRY_META,
  fetchCategories,
  getHomeRails,
} from "@/lib/home";
import { SITE_BASE_URL, API_BASE, COUNTRY_ALIAS } from "@/app/constants";

export const revalidate = 300;
export const dynamic = "auto"; // or remove

/* ---------- helpers to map ISO <-> slug (GB <-> uk) ---------- */
const isoToSlug = (iso) =>
  (String(iso).toUpperCase() === "GB" ? "uk" : String(iso || "").toLowerCase());
const slugToIso = (slug) =>
  (String(slug).toLowerCase() === "uk" ? "GB" : String(slug || "").toUpperCase());

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
  const cc = (params?.cc || "gh").toLowerCase();
  const meta = COUNTRY_META[cc] || COUNTRY_META.gh;

  let countryName = meta.name;
  try {
    const res = await fetch(`${API_BASE}/i18n/init/?country=${encodeURIComponent(cc)}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const j = await res.json();
      const iso = slugToIso(cc);
      const hit = (j?.supported?.countries || []).find(
        (c) => String(c.code).toUpperCase() === iso
      );
      if (hit?.name) countryName = hit.name;
    }
  } catch {}

  const baseUrl = SITE_BASE_URL || "https://www.upfrica.com";
  const url = `${baseUrl}/${cc}`;

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
          url: `${baseUrl}/og/upfrica-${cc}.png`,
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
      images: [`${baseUrl}/og/upfrica-${cc}.png`],
    },
  };
}

/* ---------------------- server fetch helpers (static-safe) ---------------------- */
async function fetchCountryHome(cc) {
  const norm = (COUNTRY_ALIAS?.[cc] ?? cc ?? "gh").toLowerCase();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);
  try {
    const res = await fetch(`${API_BASE}/home/${norm}/`, {
      next: { revalidate: 300, tags: [`home-${norm}`] },
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) return res.json();
    if (res.status === 404)
      return { country: norm, version: 0, updated_at: null, sections: [] };
    return null;
  } catch {
    clearTimeout(timer);
    return null;
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

function heroCurvedFromCMS(section, cc, meta) {
  const cfg = section?.config || {};
  const cityList =
    Array.isArray(cfg.cities) && cfg.cities.length > 0
      ? cfg.cities
      : COUNTRY_META[cc]?.cities || ["Your City"];
  const city = cityList[0];

const normalizeHref = (href) => {
  if (!href || typeof href !== "string") return href;
  // Leave absolute/external URLs unchanged
  if (!href.startsWith("/")) return href;
  // Rewrite internal paths that start with a country prefix
  return href.replace(/^\/(gh|ng|uk|gb)(?=\/|$)/i, `/${cc}`);
};

  const defaults = [
    { title: "Today’s Deals", href: `/${cc}/deals` },
    { title: `Same-Day in ${city}`, href: `/${cc}/search?delivery=same-day` },
    { title: "Wholesale & Bulk", href: `/${cc}/wholesale` },
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
    pickImage(section, "hero", heroImage(cc));

  const primaryCtaRaw =
    cfg.primaryCta || cfg.primary_cta || { label: "Browse Today’s Deals", href: `/${cc}/deals` };
  const secondaryCtaRaw =
    cfg.secondaryCta || cfg.secondary_cta || { label: "Sell on Upfrica", href: `/${cc}/sell` };

  const primaryCta = { ...primaryCtaRaw, href: normalizeHref(primaryCtaRaw.href) };
  const secondaryCta = { ...secondaryCtaRaw, href: normalizeHref(secondaryCtaRaw.href) };

  return {
    cc,
    headline: cfg.headline || meta.lcpHeadline,
    tagline: cfg.tagline || meta.lcpTagline,
    image: mainImage,
    alt: cfg.alt || `Upfrica ${meta.name} marketplace deals banner`,
    primaryCta,
    secondaryCta,
    miniCards,
  };
}

function bannersFromCMS(section, cc) {
  if (!section) return [];
  const cfg = section.config || {};
  const imgs = section.images || [];
  return imgs.map((img, i) => ({
    title: cfg[`title_${i + 1}`] || section.title || "Featured",
    sub: cfg[`sub_${i + 1}`] || section.subtitle || "",
    href: cfg[`href_${i + 1}`] || `/${cc}/deals`,
    img: img.url,
  }));
}

function promosFromCMS(section, cc) {
  if (!section) return [];
  const cfg = section.config || {};
  const imgs = section.images || [];
  return imgs.slice(0, 3).map((img, i) => ({
    title: (cfg.promos && cfg.promos[i]?.title) || cfg[`title_${i + 1}`] || "Promo",
    href: (cfg.promos && cfg.promos[i]?.href) || cfg[`href_${i + 1}`] || `/${cc}/deals`,
    image: img.url,
  }));
}

/* --------------------------------- PAGE --------------------------------- */
export default async function CountryHome({ params }) {
  const cc = (params?.cc || "gh").toLowerCase();
  const meta = COUNTRY_META[cc] || COUNTRY_META.gh;

  const [cms, categories, fallbackRails] = await Promise.all([
    fetchCountryHome(cc),
    fetchCategories(cc).catch(() => []),
    getHomeRails(cc), // static fallback (no cookies)
  ]);

  const sections = cms?.sections || [];
  const heroSec =
    sections.find((s) => s.kind === "hero_curved" && s.key === "hero") ||
    sections.find((s) => s.kind === "hero_curved");
  const bannerSec = sections.find((s) => s.kind === "banner_carousel");
  const promoSec = sections.find((s) => s.kind === "promo_tiles");

  const heroProps = heroCurvedFromCMS(heroSec, cc, meta);
  const banners = bannersFromCMS(bannerSec, cc);
  const promos = promosFromCMS(promoSec, cc);

  return (
    <main className="bg-[#f1f2f4] text-[var(--ink)]">
      <HeroCurved section={heroSec} cc={cc} {...heroProps} />
      {banners.length > 0 && <HeroCarousel banners={banners} />}
      <ValuePills cc={cc} />
      <NavCategories categories={categories} />
      {promos.length > 0 && <PromoTiles tiles={promos} />}

      {/* cookie/personalized rails in a dynamic nested component */}
      <Suspense fallback={null}>
        <PersonalizedRails cc={cc} fallbackRails={fallbackRails} />
      </Suspense>
    </main>
  );
}
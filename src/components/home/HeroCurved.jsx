// src/components/home/HeroCurved.jsx
"use client";
import Image from "next/image";
import { fixImageUrl } from "@/lib/image"; // your CDN normalizer

export default function HeroCurved(props) {
  // Accept either <HeroCurved section={s} cc="uk" /> or individual props
  const section = props.section ?? {};
  const cc = (props.cc ?? section.cc ?? "uk").toLowerCase();

  const cfg = section.config ?? {};
  const byName =
    props.imagesByName ??
    props.images_by_name ??
    section.images_by_name ??
    {};

  // ⬇️ Add this block here
  if (process.env.NODE_ENV !== "production") {
    console.debug("[HeroCurved] byName slots", {
      hero:  byName?.hero,
      card1: byName?.hero_card_1,
      card2: byName?.hero_card_2,
      card3: byName?.hero_card_3,
    });
  }


  const headline =
    props.headline ?? cfg.headline ?? "Shop Upfrica";
  const tagline =
    props.tagline ??
    cfg.tagline ??
    "Verified sellers • Great prices • Buyer Protection";

  // --- image resolvers ------------------------------------------------------
  const imageFromList = (name) =>
    section.images?.find?.((i) => i?.name === name)?.url || null;

  const pick = (...candidates) =>
    fixImageUrl(candidates.find((v) => !!v) || "");

  const heroImage = pick(
    props.image,
    byName.hero,
    section.primary_image?.url,
    imageFromList("hero")
  );

  const alt =
    props.alt ??
    cfg.alt ??
    section.primary_image?.alt ??
    "Upfrica hero";

  const city = CITY_MAP[cc]?.[0] || "Your City";

  // Build 3 mini-cards. Order of precedence per slot:
  // 1) explicit miniCards[i].image (if provided)
  // 2) API slot images: images_by_name.hero_card_1/2/3
  // 3) images[] fallback by name
  // 4) default picsum
  const cards = normalizeMiniCards({
    cc,
    city,
    miniCardsProp: props.miniCards,
    byName,
    sectionImages: section.images,
  });

  if (process.env.NODE_ENV !== "production") {
    console.debug("[HeroCurved] resolved", { heroImage, byName, cards });
  }

  // --- render ---------------------------------------------------------------
  return (
    <section id="content" className="relative">
      <div className="bg-gradient-to-br from-[var(--brand-50)] via-white to-[var(--accent-100)] rounded-b-3xl border-b border-[var(--line)] overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-16">
          <div className="absolute -top-10 -left-10 h-64 w-64 bg-[var(--brand-100)]/60 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-0 h-64 w-64 bg-[var(--accent-100)] rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-12 gap-6 items-center">
            {/* Copy */}
            <div className="md:col-span-6">
              <h1 className="text-2xl md:text-5xl font-black tracking-tight leading-[1.08] line-clamp-3">
                {headline}
              </h1>
              <p className="mt-3 text-[var(--ink-2)] text-base md:text-lg">{tagline}</p>

              <div className="mt-6 grid grid-cols-2 gap-2 max-w-md">
                <a
                  href={props.primaryCta?.href || cfg.primaryCta?.href || `/${cc}/deals`}
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--brand-600)] px-4 py-3 text-white font-semibold hover:bg-[var(--brand-700)] w-full"
                >
                  {props.primaryCta?.label || cfg.primaryCta?.label || "Browse Today’s Deals"}
                </a>
                <a
                  href={props.secondaryCta?.href || cfg.secondaryCta?.href || `/${cc}/sell`}
                  className="inline-flex items-center justify-center rounded-2xl border border-[var(--violet-500,#A435F0)] text-[var(--violet-600,#9333EA)] px-4 py-3 font-semibold hover:bg-[var(--violet-50,#F3E8FF)] w-full"
                >
                  {props.secondaryCta?.label || cfg.secondaryCta?.label || "Sell on Upfrica"}
                </a>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {["Buyer Protection","Verified Sellers","Same-Day / Next-Day","Local Payments & BNPL"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-[var(--ink-2)]">
                    <span className="text-[var(--success)]">●</span>{t}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--ink-2)]">
                <div className="flex items-center gap-2"><span>🛍️</span><span>50k+ items</span></div>
                <div className="flex items-center gap-2"><span>🏬</span><span>5k+ sellers</span></div>
                <div className="flex items-center gap-2"><span>📍</span><span>24+ cities</span></div>
              </div>
            </div>

            {/* Visual */}
            <div className="md:col-span-6">
              <div className="relative h-[320px] md:h-[420px] overflow-hidden">
                <div className="absolute inset-0 rounded-3xl bg-[var(--alt-surface)] overflow-hidden shadow-[0_8px_24px_rgba(17,24,39,0.08)]">
                  <Image
                    src={heroImage}
                    alt={alt}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Left / bottom */}
                <a
                  href={cards[0].href}
                  className="absolute -left-0 bottom-8 w-40 md:w-48 rounded-2xl overflow-hidden border border-[var(--line)] bg-white rotate-[-3deg] will-change-transform"
                >
                  <div className="relative h-28 w-full">
                    <Image
                      src={cards[0].image}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="160px"
                      className="object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-2 text-xs font-semibold">{cards[0].title}</div>
                </a>

                {/* Right / top */}
                <a
                  href={cards[1].href}
                  className="absolute right-2 -top-4 md:right-2 md:-top-6 w-36 md:w-44 rounded-2xl overflow-hidden border border-[var(--line)] bg-white rotate-[4deg] will-change-transform"
                >
                  <div className="relative h-24 w-full">
                    <Image
                      src={cards[1].image}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="140px"
                      className="object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-2 text-xs font-semibold">{cards[1].title}</div>
                </a>

                {/* Right / bottom */}
                <a
                  href={cards[2].href}
                  className="absolute right-10 bottom-0 w-44 md:w-52 rounded-2xl overflow-hidden border border-[var(--line)] bg-white rotate-[1deg] will-change-transform"
                >
                  <div className="relative h-28 w-full">
                    <Image
                      src={cards[2].image}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="180px"
                      className="object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-2 text-xs font-semibold">{cards[2].title}</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- helpers --------------------------- */
function normalizeMiniCards({ cc, city, miniCardsProp, byName, sectionImages }) {
  const defaults = [
    { title: "Today’s Deals",         href: `/${cc}/deals`,                         image: "https://picsum.photos/seed/upfrica-hero-a/400/300" },
    { title: `Same-Day in ${city}`,   href: `/${cc}/search?delivery=same-day`,      image: "https://picsum.photos/seed/upfrica-hero-b/400/300" },
    { title: "Wholesale & Bulk",      href: `/${cc}/wholesale`,                     image: "https://picsum.photos/seed/upfrica-hero-c/400/300" },
  ];

const byNameSlot = (i) =>
  // try 0-based then 1-based keys, then sectionImages fallbacks
  byName?.[`hero_card_${i}`] ||
  byName?.[`hero_card_${i + 1}`] ||
  sectionImages?.find?.((img) => img?.name === `hero_card_${i}`)?.url ||
  sectionImages?.find?.((img) => img?.name === `hero_card_${i + 1}`)?.url ||
  null;

// support {image} | {image_url} | {imageUrl}
const getImgProp = (o) => o?.image || o?.image_url || o?.imageUrl || null;
const withCity   = (s) => String(s || "").replace(/\{city\}/gi, city);
const first      = (...vals) => vals.find((v) => (typeof v === "string" ? v.trim() : v)) || null;

return [0, 1, 2].map((i) => {
  const raw = miniCardsProp?.[i] ?? {};
  // pick raw candidate first, then normalize **once**
  const rawCandidate = first(
    byNameSlot(i),       // ✅ now aligned with 0-based map; also checks 1-based
    getImgProp(raw),     // then explicit prop image
    defaults[i].image
  );
  const picked = fixImageUrl(rawCandidate);

  return {
    title: withCity(raw.title ?? defaults[i].title),
    href: raw.href || defaults[i].href,
    image: picked,
  };
});
}

const CITY_MAP = {
  gh: ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"],
  ng: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Abeokuta"],
  uk: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
};
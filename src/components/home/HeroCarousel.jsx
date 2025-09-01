//src/components/home/HeroCarousel.jsx
import Image from "next/image";

export default function HeroCarousel({ banners = [] }) {
  if (!banners.length) return null;
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4" aria-label="Promoted offers">
          {banners.map((b, i) => (
            <a key={i} href={b.href} className="snap-start shrink-0 w-[92%] md:w-[48%] lg:w-[32%] rounded-3xl overflow-hidden border border-[var(--line)] bg-white relative">
              <div className="relative aspect-[16/9]">
                <Image src={b.img} alt={b.title} fill sizes="(max-width:1024px) 92vw, 33vw" className="object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <div className="text-base md:text-lg font-extrabold leading-tight">{b.title}</div>
                <div className="text-sm opacity-90">{b.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
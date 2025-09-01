//src/components/home/PromoTiles.jsx
import Image from "next/image";

export default function PromoTiles({ tiles = [] }) {
  if (!tiles.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 pb-6">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <a key={i} href={t.href} className="relative rounded-2xl overflow-hidden border border-[var(--line)] bg-white group">
            <div className="relative aspect-[4/3]">
              <Image
                src={t.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform group-hover:scale-[1.02]"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="text-sm font-semibold">{t.title}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
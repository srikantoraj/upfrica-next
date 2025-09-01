// components/home/RailCard.jsx
import Image from "next/image";

export default function RailCard({ cc, item, currency, currencySymbol }) {
  if (!item) return null;
  const showDiscount =
    Number.isFinite(item.compareAt) && item.compareAt > item.price;
  const pct = showDiscount
    ? Math.round(100 * (1 - item.price / item.compareAt))
    : 0;

  return (
    <li className="snap-start shrink-0 w-[224px]">
      <a
        href={item.href}
        className="group block h-[460px] rounded-2xl border border-[var(--line)] bg-white hover:shadow-sm overflow-hidden flex flex-col"
      >
        <div className="relative aspect-square">
          <Image
            src={item.image}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width:768px) 60vw, 224px"
            className="object-cover transition-transform group-hover:scale-[1.01]"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <div className="text-sm font-medium leading-5 line-clamp-2 min-h-[40px]">
            {item.title}
          </div>

          {(item.city || item.rating) ? (
            <div className="mt-1 text-[11px] text-[var(--ink-2)] leading-4 min-h-4">
              {item.city}
              {item.city && item.rating ? " · " : ""}
              {item.rating ? <>★ {item.rating}</> : null}
            </div>
          ) : (
            <div className="mt-1 min-h-4" />
          )}

          <div className="mt-2 text-base font-extrabold tracking-tight">
            {formatMoney(item.price, currency, currencySymbol)}
          </div>

          {showDiscount ? (
            <div className="mt-1 h-4 text-[11px] text-[var(--ink-2)]">
              <span className="line-through opacity-60">
                {formatMoney(item.compareAt, currency, currencySymbol)}
              </span>
              <span className="ml-1 text-[var(--danger-700)] font-semibold">
                -{pct}%
              </span>
            </div>
          ) : (
            <div className="mt-1 h-4" />
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="self-start text-xs px-2.5 py-1 rounded-full bg-white border border-[var(--success-400)] text-[var(--success-700)]">
              Verified
            </span>
          </div>
        </div>
      </a>
    </li>
  );
}

function formatMoney(n, currency = "USD", symbol) {
  if (!Number.isFinite(n)) return "";
  const sym =
    symbol || ({ GHS: "GH₵", NGN: "₦", GBP: "£", USD: "$", EUR: "€" }[currency] || "");
  const amount = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  return sym ? `${sym}${amount}` : new Intl.NumberFormat(undefined, {
    style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0
  }).format(n);
}
//src/components/home/ValuePills.jsx
export default function ValuePills({ cc }) {
  const items = [
    ["🛡️", "Buyer Protection", "Refunds if things go wrong"],
    ["✅", "Verified Sellers", "Trusted stores"],
    ["⚡", "Fast Delivery", "Same-day / Next-day"],
    ["💳", "Flexible Payments", cc === "gh" ? "MoMo & BNPL" : cc === "ng" ? "Card/Transfer & PoD" : "Card & PayPal"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 mt-8 md:mt-12" aria-label="Why Upfrica">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(([icon, h, p], i) => (
          <div key={i} className="rounded-2xl border border-[var(--line)] bg-white p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--alt-surface)] border border-[var(--line)] flex items-center justify-center text-lg">
              <span aria-hidden>{icon}</span>
            </div>
            <div>
              <div className="font-semibold leading-none text-sm md:text-base">{h}</div>
              <div className="text-[var(--ink-2)] text-xs mt-1">{p}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
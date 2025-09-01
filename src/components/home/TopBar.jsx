//src/components/home/TopBar.jsx

export default function TopBar({ cc, country, ticker = [] }) {
  const prefix = `/${cc}`;
  return (
    <div className="w-full text-white text-sm bg-gradient-to-r from-[var(--brand-700)] via-[var(--violet-600,#A435F0)] to-[var(--brand-600)]">
      {/* 1fr | auto | 1fr keeps center perfectly centered */}
      <div className="mx-auto max-w-8xl px-4 py-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 min-w-0">
        {/* Left */}
        <p className="text-xs sm:text-sm truncate">
          Shopping in <strong>{country}</strong>
        </p>

        {/* Center: primary links */}
        <nav
          className="hidden sm:flex items-center gap-6 justify-center"
          aria-label="Primary"
        >
          <a className="underline/50 hover:underline" href={`${prefix}/shops`}>Shops</a>
          <a className="underline/50 hover:underline" href={`${prefix}/deals`}>Today's Deals</a>
          <a className="underline/50 hover:underline" href={`${prefix}/shops`}>Wholesale & Bulk</a>
          <a className="underline/50 hover:underline" href={`${prefix}/shops`}>Same-Day Near Me</a>
        </nav>

        {/* Right: utility links */}
        <nav
          className="hidden sm:flex items-center gap-4 justify-end"
          aria-label="Utility"
        >
          <a className="underline/50 hover:underline" href={`${prefix}/track`}>
            Track Order
          </a>
          <a className="underline/50 hover:underline" href={`${prefix}/help`}>
            Help
          </a>
          <a className="underline/50 hover:underline" href="/download-app">
            Download App
          </a>
        </nav>
      </div>

      {ticker?.length > 0 && (
        <div className="bg-white/5 border-t border-white/10 hidden md:block">
          <div className="mx-auto max-w-7xl px-4 py-1 overflow-x-auto whitespace-nowrap text-xs">
            {ticker.map((t, i) => (
              <span
                key={i}
                className="mr-6 opacity-90 before:mr-2 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--violet-500,#A435F0)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
//src/components/home/BottomBar.jsx
export default function BottomBar({ cc }) {
  const prefix = `/${cc}`;
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-[var(--line)] [padding-bottom:env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-2 py-2.5 flex justify-between text-sm">
        <a href={prefix} aria-current="page" className="group flex flex-col items-center gap-0.5 px-2 py-1">
          <span className="text-[22px] leading-none font-extrabold">🏠</span>
          <span className="text-[12px] font-semibold">Home</span>
        </a>
        <label htmlFor="nav-drawer" className="group flex flex-col items-center gap-0.5 px-2 py-1">
          <span className="text-[22px] leading-none font-extrabold">📂</span>
          <span className="text-[12px] font-semibold">Menu</span>
        </label>
        <a href={`${prefix}/deals`} className="group flex flex-col items-center gap-0.5 px-2 py-1">
          <span className="text-[22px] leading-none font-extrabold">🔥</span>
          <span className="text-[12px] font-semibold">Deals</span>
        </a>
        <a href={`${prefix}/messages`} className="group flex flex-col items-center gap-0.5 px-2 py-1">
          <span className="text-[22px] leading-none font-extrabold">💬</span>
          <span className="text-[12px] font-semibold">Messages</span>
        </a>
        <a href={`${prefix}/cart`} className="group flex flex-col items-center gap-0.5 px-2 py-1">
          <span className="text-[22px] leading-none font-extrabold">🛒</span>
          <span className="text-[12px] font-semibold">Cart</span>
        </a>
      </div>
    </nav>
  );
}
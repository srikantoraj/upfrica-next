//src/components/home/NavCategories.jsx
export default function NavCategories({ categories }) {
  if (!categories?.length) return null;
  return (
    <nav className="sticky top-[60px] z-30 bg-white border-b border-[var(--line)] hidden md:block">
      <div className="mx-auto max-w-7xl px-4 flex gap-2 overflow-x-auto no-scrollbar py-2 scroll-fade">
        {categories.map((c) => (
          <a key={c.id} href={c.href} className="shrink-0 rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink-2)] hover:border-[var(--violet-500,#A435F0)] hover:text-[var(--violet-500,#A435F0)]">
            {c.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
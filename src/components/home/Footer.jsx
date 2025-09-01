//src/components/home/Footer.jsx
export default function Footer({ cc }) {
  const prefix = `/${cc}`;
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="text-xl font-black">Upfrica</div>
          <p className="text-[var(--ink-2)] mt-2">The African marketplace — fast, local, and trusted.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Buyers</h4>
          <ul className="space-y-1 text-[var(--ink-2)]">
            <li><a href={`${prefix}/help/buyer-protection`} className="hover:underline">Buyer Protection</a></li>
            <li><a href={`${prefix}/help/delivery`} className="hover:underline">Delivery Options</a></li>
            <li><a href={`${prefix}/help/returns`} className="hover:underline">Returns & Refunds</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Sellers & Earners</h4>
          <ul className="space-y-1 text-[var(--ink-2)]">
            <li><a href={`${prefix}/sell`} className="hover:underline">Sell on Upfrica</a></li>
            <li><a href={`${prefix}/agents`} className="hover:underline">Become an Agent</a></li>
            <li><a href={`${prefix}/sourcing-agents`} className="hover:underline">Become a Sourcing Agent</a></li>
            <li><a href={`${prefix}/sourcing`} className="hover:underline">Earn Money Sourcing</a></li>
            <li><a href={`${prefix}/affiliate`} className="hover:underline">Become an Affiliate</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-[var(--ink-2)]">
            <li><a href={`/about`} className="hover:underline">About</a></li>
            <li><a href={`/contact`} className="hover:underline">Contact</a></li>
            <li><a href={`/careers`} className="hover:underline">Careers</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--line)] py-4 text-center text-xs text-[var(--ink-2)]">© {new Date().getFullYear()} Upfrica. All rights reserved.</div>
    </footer>
  );
}
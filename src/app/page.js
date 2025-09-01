// app/page.js
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const SUPPORTED = new Set(["gh", "ng", "uk"]);
const ALIAS = { gb: "uk" };

function canon(v) { if (!v) return null; const lc = v.toLowerCase(); return ALIAS[lc] || lc; }
function fromAcceptLang(al) {
  if (!al) return null;
  for (const part of al.toLowerCase().split(",")) {
    const m = part.trim().match(/-([a-z]{2})$/i);
    if (m) return canon(m[1]);
  }
  return null;
}
function isBot(ua="") {
  return /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|discordbot/i.test(ua);
}

export default function Root() {
  const h = headers();
  const ua = h.get("user-agent") || "";
  if (isBot(ua)) {
    // Simple static chooser for bots (x-default content)
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-black mb-4">Choose your country</h1>
        <ul className="space-y-2">
          <li><a className="underline" href="/gh">🇬🇭 Ghana</a></li>
          <li><a className="underline" href="/ng">🇳🇬 Nigeria</a></li>
          <li><a className="underline" href="/uk">🇬🇧 United Kingdom</a></li>
        </ul>
      </main>
    );
  }

  const cookieCc = canon(cookies().get("cc")?.value);
  const langCc = fromAcceptLang(h.get("accept-language"));
  const cc = (cookieCc && SUPPORTED.has(cookieCc)) ? cookieCc : (langCc || "gh");
  redirect(`/${cc}`);
}
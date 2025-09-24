// middleware.js
import { NextResponse, userAgent } from "next/server";
import { canonCc, isTwoLetter } from "@/lib/geo";

const YEAR = 60 * 60 * 24 * 365;

const GLOBAL_PREFIXES = new Set([
  "onboarding","new-dashboard","dashboard","agent","affiliate",
  "seller","buyer","login","signup","password","account","messages",
  "cart","download-app","about","contact","careers","api","_next",
]);

export function middleware(req) {
  const url = req.nextUrl;
  const { pathname, searchParams } = url;

  const first = pathname.split("/")[1] || "";
  if (GLOBAL_PREFIXES.has(first) || first.includes(".")) {
    return NextResponse.next();
  }

  const ua = userAgent(req);
  const isBot = ua?.isBot;

  // ── IMPORTANT: split browsing vs delivery ────────────────────────────
  const forcedCcRaw = (searchParams.get("cc") || "").toLowerCase();        // browsing
  const forcedCc = canonCc(forcedCcRaw);

  const forcedRegionRaw = (searchParams.get("region") || "").toLowerCase(); // delivery
  const forcedRegionCc = canonCc(forcedRegionRaw);

  // NEW: read either cookie name for browsing
  const cookieCc = canonCc(
    req.cookies.get("cc")?.value || req.cookies.get("upfrica_cc")?.value
  );

  const geoCc = canonCc(req.geo?.country);
  const alMatch = req.headers.get("accept-language")?.toLowerCase().match(/-([a-z]{2})$/i);
  const alCc = canonCc(alMatch?.[1]);

  const cc = (forcedCc || cookieCc || geoCc || alCc || "gh").toLowerCase();

  const parts = pathname.split("/");
  const seg1Raw = parts[1] || "";
  const seg1Canon = canonCc(seg1Raw);
  const seg2 = parts[2] || "";

  // 1) Canonicalize /GB -> /uk and uppercase→lowercase
  if (isTwoLetter(seg1Raw) && seg1Raw !== seg1Canon) {
    const to = url.clone();
    to.pathname = `/${seg1Canon}${parts.length > 2 ? "/" + parts.slice(2).join("/") : ""}`;
    return NextResponse.redirect(to, 308);
  }

  // 2) Global paths under a cc → global
  if (isTwoLetter(seg1Canon) && GLOBAL_PREFIXES.has(seg2)) {
    const to = url.clone();
    to.pathname = `/${seg2}${parts.length > 3 ? "/" + parts.slice(3).join("/") : ""}`;
    return NextResponse.redirect(to, 308);
  }

  // 3) Visiting /{cc} sets the BROWSING cookie to match the URL (not delivery!)
  if (isTwoLetter(seg1Canon) && seg1Canon !== (cookieCc || "")) {
    const res = NextResponse.next();
    res.cookies.set("cc", seg1Canon, { path: "/", maxAge: YEAR, sameSite: "lax" });
    // NEW: mirror cookie used by the client provider
    res.cookies.set("upfrica_cc", seg1Canon, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  // 4) “/” → “/{cc}” for humans (not bots)
  if (pathname === "/" && !isBot) {
    const to = url.clone();
    to.pathname = `/${cc}`;
    const res = NextResponse.redirect(to);
    res.cookies.set("cc", cc, { path: "/", maxAge: YEAR, sameSite: "lax" });
    // NEW: mirror cookie for CSR parity
    res.cookies.set("upfrica_cc", cc, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  // 5a) Persist FORCED DELIVERY region (no redirect, separate cookie)
  if (forcedRegionCc) {
    const res = NextResponse.next();
    res.cookies.set("deliver_cc", forcedRegionCc, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  // 5b) Persist FORCED BROWSING cc via ?cc=... (no redirect)
  if (forcedCc && forcedCc !== (cookieCc || "")) {
    const res = NextResponse.next();
    res.cookies.set("cc", forcedCc, { path: "/", maxAge: YEAR, sameSite: "lax" });
    // NEW: mirror cookie
    res.cookies.set("upfrica_cc", forcedCc, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/((?!_next|api|.*\\.).*)"] };
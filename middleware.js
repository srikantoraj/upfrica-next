// middleware.js
import { NextResponse, userAgent } from "next/server";
import { canonCc, isTwoLetter } from "@/lib/geo";

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

  const forcedRaw = (searchParams.get("cc") || searchParams.get("region") || "").toLowerCase();
  const forcedCc = canonCc(forcedRaw);
  const cookieCc = canonCc(req.cookies.get("cc")?.value);
  const geoCc = canonCc(req.geo?.country);
  const alMatch = req.headers.get("accept-language")?.toLowerCase().match(/-([a-z]{2})$/i);
  const alCc = canonCc(alMatch?.[1]);
  const cc = (forcedCc || cookieCc || geoCc || alCc || "gh").toLowerCase();

  const parts = pathname.split("/");
  const seg1Raw = parts[1] || "";
  const seg1Canon = canonCc(seg1Raw);
  const seg2 = parts[2] || "";

  // 1) Canonicalize /GB -> /uk and upper→lower
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

  // 3) Set/refresh cookie when on /{cc}
  if (isTwoLetter(seg1Canon) && seg1Canon !== (cookieCc || "")) {
    const res = NextResponse.next();
    res.cookies.set("cc", seg1Canon, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }

  // 4) “/” → “/{cc}” for humans (not bots)
  if (pathname === "/" && !isBot) {
    const to = url.clone();
    to.pathname = `/${cc}`;
    const res = NextResponse.redirect(to);
    res.cookies.set("cc", cc, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }

  // 5) Persist forced cc via query (no redirect)
  if (forcedCc && forcedCc !== (cookieCc || "")) {
    const res = NextResponse.next();
    res.cookies.set("cc", cc, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/((?!_next|api|.*\\.).*)"] };
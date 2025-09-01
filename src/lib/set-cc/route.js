//app/set-cc/route.js  (manual switching)
import { NextResponse } from "next/server";
export async function GET(req) {
  const cc = (req.nextUrl.searchParams.get("cc") || "").toLowerCase();
  if (!/^[a-z]{2}$/.test(cc)) return NextResponse.redirect(new URL("/", req.url));
  const to = new URL(`/${cc}`, req.url);
  const res = NextResponse.redirect(to, 302);
  res.cookies.set("cc", cc, { path: "/", maxAge: 60*60*24*365, sameSite: "lax" });
  return res;
}
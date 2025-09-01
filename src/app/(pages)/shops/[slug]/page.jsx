// src/app/(pages)/shops/[slug]/page.jsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { BASE_API_URL } from "@/app/constants";

function getAuthHeaders() {
  const t =
    cookies().get("auth_token")?.value || cookies().get("token")?.value;
  return t ? { Authorization: `Token ${t}` } : {};
}

function pickRegionFromCookie() {
  // your RegionSetter stores { name, code, symbol, region }
  const raw = cookies().get("selected_country")?.value;
  if (!raw) return null;
  try {
    const v = JSON.parse(decodeURIComponent(raw));
    return (v?.region || v?.code)?.toString().slice(0, 2).toLowerCase() || null;
  } catch {
    return null;
  }
}

export default async function Page({ params }) {
  const { slug } = params;

  let cc = null;

  // 1) Try API (no-store so we don't loop on cached empties)
  try {
    const r = await fetch(`${BASE_API_URL}/api/shops/${slug}/products/`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (r.ok) {
      const data = await r.json();
      cc =
        data?.shop?.user?.country_code?.toLowerCase() ||
        data?.shop?.user?.country?.code?.toLowerCase() ||
        data?.shop?.seller_country?.toLowerCase() ||
        data?.shop?.listing_country_code?.toLowerCase() ||
        null;
    }
  } catch {}

  // 2) Cookie fallback
  if (!cc) cc = pickRegionFromCookie();

  // 3) Optional default (comment out if you’d rather 404)
  if (!cc) cc = "gh";

  // 4) Redirect to canonical regional path
  redirect(`/${cc}/shops/${slug}`);
}
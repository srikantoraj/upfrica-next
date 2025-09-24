// components/home/PersonalizedRails.server.jsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import ProductRail from "./ProductRail";
import { API_BASE } from "@/app/constants";
import { getHomeRails } from "@/lib/home";
import { fixImageUrl as fixDisplayUrl } from "@/lib/image"; // server-safe image normalizer

/* ---------------- helpers ---------------- */
function truthyStr(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function sanitizeRailItem(item) {
  if (!item || typeof item !== "object") return item;
  // Light touch: normalize a pre-supplied image string if present.
  // (ProductRail will further normalize images/links/prices regardless.)
  if (truthyStr(item.image)) {
    return { ...item, image: fixDisplayUrl(item.image) };
  }
  return item;
}

function normalizeRails(raw) {
  // Accept { rails: [...] } or an array of rails
  const list = Array.isArray(raw?.rails) ? raw.rails : Array.isArray(raw) ? raw : [];
  return list
    .filter(Boolean)
    .map((r, i) => ({
      key: r.key || r.slug || r.id || `rail-${i}`,
      title: r.title || "Featured",
      subtitle: r.subtitle || "",
      // If API already returned products, keep them; else let ProductRail fetch via params
      items: Array.isArray(r.items) && r.items.length ? r.items.map(sanitizeRailItem) : null,
      params: r.params || {},
    }));
}

async function fetchPersonalizedRails(cc) {
  const ck = cookies();
  const cookieHeader = ck.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  try {
    const res = await fetch(`${API_BASE}/home/${cc}/rails/`, {
      headers: {
        Accept: "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ---------------- component ---------------- */
export default async function PersonalizedRails({ cc, fallbackRails }) {
  // Ensure this renders dynamically (cookies/personalization)
  noStore();
  cookies(); // bind to the current request

  const remote = await fetchPersonalizedRails(cc);
  const rails = normalizeRails(remote || fallbackRails || (await getHomeRails(cc)));

  if (!rails.length) return null;

  return (
    <>
      {rails.map((r) => (
        <ProductRail
          key={r.key}
          railKey={r.key}
          cc={cc}
          title={r.title}
          subtitle={r.subtitle}
          items={r.items}  // if null, ProductRail will fetch using params
          params={r.params}
        />
      ))}
    </>
  );
}
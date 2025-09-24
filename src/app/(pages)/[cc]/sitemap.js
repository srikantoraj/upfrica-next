//Per country (simple): app/(pages)/[cc]/sitemap.js
import { ccToISO } from "@/lib/cc";
import { api } from "@/lib/api";

export default async function sitemap({ params: { cc } }) {
  const base = "https://www.upfrica.com";
  const ISO = ccToISO(cc);
  // grab first N products; expand later/paginate
  const data = await api(`/api/products/?user__country__code=${ISO}&page_size=100`, { next: { revalidate: 3600 }});
  const items = Array.isArray(data?.results) ? data.results : [];
  return items.map(p => ({
    url: p.canonical_url || `${base}${p.frontend_url || `/${cc}/${p.slug}`}`,
    lastModified: p.updated_at || p.created_at,
    changeFrequency: "daily",
    priority: 0.7,
  }));
}
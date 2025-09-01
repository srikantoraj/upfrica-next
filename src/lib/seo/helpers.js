//src/lib/seo/helpers.js
export const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_BASE_URL || "https://www.upfrica.com").replace(/\/$/, "");

export const absUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_BASE}/${String(url).replace(/^\//, "")}`;
};

export const stripHtml = (s = "") =>
  s
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const truncate = (s = "", n = 155) =>
  s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
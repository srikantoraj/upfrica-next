export default async function sitemap() {
  const base = "https://www.upfrica.com";
  const markets = ["gh","ng","uk"]; // replace with API later
  return [
    { url: base, changeFrequency: "weekly", priority: 0.6 },
    ...markets.map(cc => ({ url: `${base}/${cc}`, changeFrequency: "daily", priority: 0.9 })),
  ];
}
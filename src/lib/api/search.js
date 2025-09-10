//src/lib/api/search.js
export async function fetchSearch({ q, deliver_to, brand, delivery_speed, sort = 'relevance', limit = 30 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (deliver_to) params.set('deliver_to', deliver_to.toLowerCase());
  if (brand) {
    (Array.isArray(brand) ? brand : [brand]).forEach(b => params.append('brand', b));
  }
  if (delivery_speed) {
    (Array.isArray(delivery_speed) ? delivery_speed : [delivery_speed]).forEach(s => params.append('delivery_speed', s));
  }
  params.set('sort', sort);
  params.set('limit', String(limit));

  const res = await fetch(`/api/products/search/?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json(); // { results, facets, meta }
}
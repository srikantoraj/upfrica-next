//src/lib/api/suggest.js
export async function fetchSuggest(q, { cc, deliverTo, limit = 8 } = {}) {
  const _cc = (cc || 'gh').toLowerCase();
  const _deliverTo = (deliverTo || _cc).toLowerCase();
  const url = `/api/products/suggest/?q=${encodeURIComponent(q)}&cc=${_cc}&deliver_to=${_deliverTo}&limit=${limit}`;

  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Suggest failed: ${res.status}`);
  const data = await res.json();
  return data.items || [];
}
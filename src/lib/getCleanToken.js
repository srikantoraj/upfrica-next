// app/lib/getCleanToken.js
export function getCleanToken() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('token');
  return raw?.replace(/^"|"$/g, '').trim() || null;
}
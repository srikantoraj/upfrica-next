export function withCountryPrefix(cc, href) {
  const path = href.startsWith('/') ? href : `/${href}`;
  const stripped = path.replace(/^\/[a-z]{2}(?=\/)/i, ''); // drop leading /cc
  return `/${cc.toLowerCase()}${stripped}`;
}
// src/app/utils/roles.js

export function normalizeRole(role) {
  if (role === 'seller_private' || role === 'seller_business') return 'seller';
  return role;
}
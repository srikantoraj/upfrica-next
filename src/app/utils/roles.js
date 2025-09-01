// src/app/utils/roles.js

// Normalize UI role names
export function normalizeRole(roleView) {
  if (roleView === "seller") return "seller";
  if (roleView === "agent") return "agent";
  if (roleView === "affiliate") return "affiliate";
  return "buyer";
}

// ✅ NEW: Try to infer roles from many possible shapes
export function deriveRawRoles(user) {
  if (!user || typeof user !== "object") return ["buyer"];

  const out = new Set();
  const push = (v) => v && out.add(v);

  // 0) direct account_type if present (string or array)
  if (Array.isArray(user.account_type)) {
    user.account_type.filter(Boolean).forEach((r) => push(r));
  } else if (typeof user.account_type === "string") {
    push(user.account_type);
  }

  // 1) generic “roles” arrays that might be strings or objects
  const tryArrays = [
    user.roles,
    user.user_roles,
    user.userRoles,
    user.groups,          // [{name, slug}] from DRF/ Django usually
    user.permissions,
    user.perms,
  ].filter(Boolean);

  for (const arr of tryArrays) {
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (typeof item === "string") {
        // normalize common variants
        if (/seller/.test(item)) push("seller");
        if (/agent/.test(item)) push("agent");
        if (/affiliate/.test(item)) push("affiliate");
        if (/buyer/.test(item)) push("buyer");
      } else if (item && typeof item === "object") {
        const name = item.name || item.slug || item.code || item.key;
        if (typeof name === "string") {
          if (/seller/.test(name)) push("seller");
          if (/agent/.test(name)) push("agent");
          if (/affiliate/.test(name)) push("affiliate");
          if (/buyer/.test(name)) push("buyer");
        }
      }
    }
  }

  // 2) boolean-ish flags commonly seen
  if (user.is_seller || user.has_store || user.seller_type) push("seller");
  if (user.is_agent || user.agent) push("agent");
  if (user.is_affiliate || user.affiliate) push("affiliate");

  // 3) onboarding hints
  const ob = user.onboarding;
  if (ob && typeof ob === "object") {
    const hinted = ob.roles || ob.role || ob.selected_roles;
    if (Array.isArray(hinted)) {
      hinted.forEach((r) => {
        if (typeof r === "string") push(r);
      });
    } else if (typeof hinted === "string") {
      push(hinted);
    }
  }

  // 4) subscriptions / plans (very common source)
  const subs = user.subscriptions || user.plans || user.memberships;
  if (Array.isArray(subs)) {
    for (const s of subs) {
      const plan = (s && (s.plan || s.name || s.slug)) || "";
      if (typeof plan === "string") {
        if (/seller/.test(plan)) push("seller");
        if (/agent/.test(plan)) push("agent");
        if (/affiliate/.test(plan)) push("affiliate");
      }
    }
  }

  // 5) collapse seller_* → seller
  const collapsed = new Set();
  for (const r of out) {
    if (r === "seller_private" || r === "seller_business") {
      collapsed.add("seller");
    } else {
      collapsed.add(r);
    }
  }

  // Always allow buyer as baseline if we still got nothing
  if (collapsed.size === 0) collapsed.add("buyer");

  const result = Array.from(collapsed);

  // Debug so you can see exactly what we got every time
  try {
    // Keep these while you’re diagnosing
    console.log("[roles] deriveRawRoles() input keys:", Object.keys(user || {}));
    console.log("[roles] deriveRawRoles() harvested:", result);
  } catch {}

  return result;
}
// src/lib/plan-features-checker.js

// Aliases let backends use different slugs while the app uses one name.
export const ALIASES = {
  bulk_price_update: [
    "bulk_price_update",
    "bulk_price",
    "bulk_edit_price",
    "bulk_price_tool",
    "can_bulk_price",
  ],
  // Add more features here: schedule, phone_display, etc.
};

const TRUTHY = new Set(["true","1","yes","y","on","enabled","allow","allowed"]);
const FALSY  = new Set(["false","0","no","n","off","disabled","deny","denied"]);

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v > 0;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (TRUTHY.has(s)) return true;
    if (FALSY.has(s))  return false;
  }
  return undefined; // unknown
}

function asAliases(wanted) {
  const key = String(wanted || "").toLowerCase();
  return (ALIASES[key] || [key]).map((s) => s.toLowerCase());
}

function arrayHasSlug(arr, aliases) {
  if (!Array.isArray(arr)) return undefined;

  // Array of strings?
  if (arr.every((x) => typeof x === "string")) {
    const lower = arr.map((x) => x.toLowerCase());
    return aliases.some((k) => lower.includes(k));
  }

  // Array of objects (generic or Django-like)?
  for (const row of arr) {
    const name = String(
      row?.feature?.name ??
      row?.name ??
      row?.code ??
      row?.slug ??
      ""
    ).toLowerCase();

    if (!aliases.includes(name)) continue;

    const enabled =
      toBool(row?.enabled) ??
      toBool(row?.active) ??
      toBool(row?.value);

    // If no boolean flag exists, treat presence as enabled
    return enabled !== undefined ? enabled : true;
  }
  return undefined;
}

/** Tri-state read: true | false | undefined (unknown) */
export function hasFeature(source, wanted) {
  const aliases = asAliases(wanted);
  if (!source) return undefined;

  // 1) Array of slugs or objects
  const fromArray = arrayHasSlug(source, aliases);
  if (fromArray !== undefined) return fromArray;

  // 2) Direct boolean keys on the object
  for (const k of aliases) {
    if (Object.prototype.hasOwnProperty.call(source, k)) {
      const v = toBool(source[k]);
      if (v !== undefined) return v;
    }
  }

  // 3) Known nesting buckets (common API shapes)
  for (const bucket of ["tools","advanced","features","plan_features","included","allowed"]) {
    if (source[bucket] != null) {
      const v = hasFeature(source[bucket], aliases[0]);
      if (v !== undefined) return v;
    }
  }

  // 4) Django-style matrix on account objects
  const fm = source.feature_matrix || source.plan_feature_matrix;
  const fromMatrix = arrayHasSlug(fm, aliases);
  if (fromMatrix !== undefined) return fromMatrix;

  return undefined;
}

/** Convenience: always returns a boolean with a fallback (default false). */
export function featureEnabled(source, wanted, fallback = false) {
  const v = hasFeature(source, wanted);
  return v === undefined ? !!fallback : !!v;
}
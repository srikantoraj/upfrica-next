// src/lib/seller-contact.js

/** -------------------------------------------
 * Entitlement helpers
 * - Works with either a plain string[] from /entitlements
 *   OR a stateOf() getter that returns 'active' | 'available' | 'included_locked'
 * ------------------------------------------*/

/**
 * @param {Object} opts
 * @param {string[]} [opts.entitlements]  // e.g. ['contact_display','storefront_unlock'] or ['allow_display_seller_contact']
 * @param {(name:string)=>('active'|'available'|'included_locked'|undefined)} [opts.stateOf]
 * @param {boolean} [opts.requireStorefront=false]
 * @param {boolean} [opts.fallbackIfUnknown=false]  // ✅ strict by default: don't show when unknown
 * @returns {{allowed:boolean, reason?:string, states?:Record<string,string|boolean|undefined>}}
 */
export function canDisplaySellerContact({
  entitlements,
  stateOf,
  requireStorefront = false,
  fallbackIfUnknown = false,
} = {}) {
  const entSet = Array.isArray(entitlements) ? new Set(entitlements) : null;
  const hasEntList = entSet !== null;

  // support alias names in entitlements
  const hasAny = (names = []) => {
    if (!entSet) return undefined;
    for (const n of names) if (entSet.has(n)) return true;
    return false;
  };

  const isActive = (s) => s === "active";
  const isLocked = (s) => s === "available" || s === "included_locked";

  // --- contact (prefer entitlements; fall back to state) ---
  const contactState = stateOf?.("allow_display_seller_contact");
  const contactFromEnt = hasAny(["contact_display", "allow_display_seller_contact"]);

  let contactAllowed;
  if (hasEntList) {
    // strict: must be entitled to display contact
    contactAllowed = contactFromEnt === true;
  } else {
    contactAllowed =
      isActive(contactState) ? true
      : isLocked(contactState) ? false
      : null; // unknown
  }

  // --- storefront (optional; prefer entitlements; fall back to state) ---
  const storeState = stateOf?.("storefront_unlock");
  const storeFromEnt = hasAny(["storefront_unlock", "allow_storefront_unlock", "allow_storefront"]);

  let storeAllowed;
  if (!requireStorefront) {
    storeAllowed = true;
  } else if (hasEntList) {
    storeAllowed = storeFromEnt === true;
  } else {
    storeAllowed =
      isActive(storeState) ? true
      : isLocked(storeState) ? false
      : null; // unknown
  }

  const isUnknown =
    contactAllowed === null || (requireStorefront && storeAllowed === null);

  const allowed = isUnknown
    ? fallbackIfUnknown
    : Boolean(contactAllowed && storeAllowed);

  // best-effort reason
  let reason = "";
  if (!allowed) {
    if (hasEntList) {
      if (contactAllowed === false) reason = "missing_entitlement";
      else if (requireStorefront && storeAllowed === false) reason = "missing_storefront_entitlement";
      else if (isUnknown) reason = "unknown";
    } else {
      if (contactAllowed === false) {
        reason =
          contactState === "included_locked" ? "kyc_required"
          : contactState === "available" ? "plan_locked"
          : "feature_locked";
      } else if (requireStorefront && storeAllowed === false) {
        reason =
          storeState === "included_locked" ? "kyc_required_storefront"
          : storeState === "available" ? "plan_locked_storefront"
          : "storefront_locked";
      } else if (isUnknown) {
        reason = "unknown";
      }
    }
  }

  return {
    allowed,
    reason,
    states: {
      // return actual state string if present; else boolean if known via entitlements; else undefined
      contact: contactState ?? (contactFromEnt === true ? true : undefined),
      storefront: storeState ?? (storeFromEnt === true ? true : undefined),
    },
  };
}

/** -------------------------------------------
 * Phone selection
 * ------------------------------------------*/

/**
 * Pick the number to display publicly on shop/PDP.
 * Prefers:
 *   1) phones tagged 'shop_public' AND primary
 *   2) 'shop_public' AND verified
 *   3) newest 'shop_public'
 *   4) otherwise: primary → verified → newest of all
 *
 * @param {Array<Object>} phones
 * @returns {null | {
 *   id:any, e164:string, display:string, hasWhatsapp:boolean,
 *   isPrimary:boolean, isVerified:boolean, uses:string[]
 * }}
 */
export function pickShopPhone(phones = []) {
  const list = Array.isArray(phones) ? phones.slice() : [];
  if (list.length === 0) return null;

  const withUse = list.filter((p) => Array.isArray(p.uses) && p.uses.includes("shop_public"));
  const pool = withUse.length ? withUse : list;

  const byUpdated = (a, b) =>
    new Date(b.updated_at || b.modified || 0) - new Date(a.updated_at || a.modified || 0);

  const chosen =
    pool.find((p) => p.is_primary) ||
    pool.find((p) => p.is_verified) ||
    pool.slice().sort(byUpdated)[0] ||
    null;

  if (!chosen) return null;

  const e164 = String(chosen.e164 || chosen.number || "").replace(/[^\d+]/g, "");
  return {
    id: chosen.id,
    e164,
    display: chosen.display || chosen.national || chosen.local || e164,
    hasWhatsapp: Array.isArray(chosen.uses) && chosen.uses.includes("whatsapp"),
    isPrimary: !!chosen.is_primary,
    isVerified: !!chosen.is_verified,
    uses: chosen.uses || [],
  };
}

/** Build a WhatsApp deep link for a given E.164 string */
export function whatsappUrl(e164) {
  const digits = String(e164 || "").replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
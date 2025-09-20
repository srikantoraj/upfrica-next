// src/lib/product-metrics.js
import { b } from "./api-path";

const SS_OK = () => typeof window !== "undefined" && "sessionStorage" in window;

// Off by default — turn on only if your API supports a generic "click" event
let SEND_GENERIC_CLICKS = false;
export function setSendGenericClicks(on = false) { SEND_GENERIC_CLICKS = !!on; }

function sid() {
  try {
    const k = "upfrica_sid";
    let v = localStorage.getItem(k);
    if (!v) {
      v = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(k, v);
    }
    return v;
  } catch { return ""; }
}
function onceKey(slug, name, target) { return `pm:${slug}:${name}${target ? ":" + target : ""}`; }
function markOnce(slug, name, target) {
  if (!SS_OK()) return false;
  const k = onceKey(slug, name, target);
  if (sessionStorage.getItem(k) === "1") return true;
  sessionStorage.setItem(k, "1");
  return false;
}

// strip non-serializable/circular bits from meta
function safeMeta(val, depth = 0, seen = new WeakSet()) {
  if (val == null) return val;
  const t = typeof val;
  if (t === "string") return val.length > 1000 ? val.slice(0, 1000) + "…" : val;
  if (t === "number" || t === "boolean") return val;
  if (t === "function") return undefined;
  if (val?.nativeEvent || val?.preventDefault || val?.target?.nodeType) return undefined;
  if (Array.isArray(val)) {
    if (depth > 3) return undefined;
    return val.slice(0, 20).map(v => safeMeta(v, depth + 1, seen)).filter(v => v !== undefined);
  }
  if (t === "object") {
    if (seen.has(val) || depth > 3) return undefined;
    seen.add(val);
    const proto = Object.getPrototypeOf(val);
    if (proto && proto !== Object.prototype && proto !== null) return undefined;
    const out = {};
    let count = 0;
    for (const k of Object.keys(val)) {
      if (k === "nativeEvent" || k === "target" || k === "currentTarget") continue;
      const v = safeMeta(val[k], depth + 1, seen);
      if (v !== undefined) {
        out[k] = v;
        if (++count >= 20) break;
      }
    }
    return out;
  }
  try { return String(val); } catch { return undefined; }
}

async function post(slug, body) {
  if (!slug) return;
  const payloadObj = { session_id: sid(), source: "web", ...body };
  if (!payloadObj.event) return; // safety
  if (payloadObj.meta) payloadObj.meta = safeMeta(payloadObj.meta);
  const payload = JSON.stringify(payloadObj);

  const url = b(`products/${slug}/event/`);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "text/plain; charset=UTF-8" });
      navigator.sendBeacon(url, blob);
      return;
    }
  } catch {}

  try {
    await fetch(url, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
      body: payload,
    });
  } catch {}
}

/* ── public helpers ── */
export function trackProductEvent(
  slug,
  { event, target, meta, source, oncePerSession } = {}
) {
  if (!slug || !event) return;
  if (oncePerSession && markOnce(slug, event, target)) return;
  return post(slug, { event, target, meta, ...(source ? { source } : {}) });
}

export function markView(slug, meta = {}, { once = true, source } = {}) {
  return trackProductEvent(slug, {
    event: "view",
    meta,
    source,
    oncePerSession: !!once,
  });
}

export function markGenericClick(slug, target, meta = {}) {
  if (!SEND_GENERIC_CLICKS) return; // <- won’t send unless you enable it
  return trackProductEvent(slug, { event: "click", target, meta });
}
export function markPrimaryBuyClick(slug, meta = {}) {
  // only the specific event; generic is gated above
  return trackProductEvent(slug, { event: "buy_click", target: "buy_primary", meta });
}
export function markAddToBasket(slug, meta = {}) {
  return trackProductEvent(slug, { event: "basket_add", target: "basket", meta });
}
export function markBNPLClick(slug, meta = {}) {
  return trackProductEvent(slug, { event: "bnpl_click", target: "bnpl", meta });
}
export function markWishlistToggle(slug, added, meta = {}) {
  return trackProductEvent(slug, { event: added ? "wishlist_add" : "wishlist_remove", target: "wishlist", meta });
}
export function markContactReveal(slug, meta = {}) {
  return trackProductEvent(slug, { event: "contact_reveal", target: "phone", meta, oncePerSession: true });
}
export function markWhatsAppClick(slug, meta = {}) {
  return trackProductEvent(slug, { event: "whatsapp_click", target: "whatsapp", meta });
}
export function markPhoneClick(slug, meta = {}) {
  return trackProductEvent(slug, { event: "phone_click", target: "phone", meta });
}
export function markContactClick(slug, meta = {}) {
  return trackProductEvent(slug, { event: "contact_click", target: "contact", meta, oncePerSession: true });
}
// Back-compat aliases if you referenced these names elsewhere:
export const markCopyContact = markContactClick;
export function markWishlistClick(slug, meta = {}) { return markWishlistToggle(slug, true, meta); }

export function installImpressionObserver(node, slug, { source = "pdp" } = {}) {
  if (typeof window === "undefined" || !node || !slug) return () => {};
  if (SS_OK() && sessionStorage.getItem(onceKey(slug, "view", "")) === "1") return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some(e => e.isIntersecting && e.intersectionRatio > 0)) {
        // source is top-level now
        markView(slug, {}, { source, once: true });
        io.disconnect();
      }
    },
    { threshold: [0, 0.2], rootMargin: "0px" }
  );
  io.observe(node);
  return () => io.disconnect();
}
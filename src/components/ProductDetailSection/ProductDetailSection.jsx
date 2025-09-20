// components/ProductDetailSection/ProductDetailSection.jsx
'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useSaleCountdown } from '@/hooks/useSaleCountdown';

import axios from '@/lib/axiosInstance';
import { b } from '@/lib/api-path';
import * as pm from '@/lib/product-metrics';

import { pickProductImage } from '@/lib/image';

import {
  FaHeart, FaRegHeart, FaEdit, FaTrash, FaEnvelope, FaWhatsapp, FaEyeSlash, FaMapMarkerAlt,
} from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CountryDropdown } from 'react-country-region-selector';

import ProductSlider from './ProductSlider';
import DetailsTabs from './DetailsTabs';
import DisplayReviews from '@/components/review/DisplayReviews';
import MultiBuySection from '../MultiBuySection';
import PaymentDeliveryReturns from '../PaymentDeliveryReturns';
import DirectBuyPopup from '../DirectBuyPopup';
import RecentlyViewed from '../RecentlyViewed';
import BasketSheet from '../BasketSheet';
import SellerCard from './SellerCard';
import StickyPriceBar from './StickyPriceBar';
import Breadcrumbs from './Breadcrumbs';
import ContactSellerCard from '../ContactSellerCard';

import SimplePrice from '@/components/SimplePrice';

import {
  fetchReviewsStart, fetchReviewsSuccess, fetchReviewsFailure,
} from '@/app/store/slices/reviewsSlice';
import { getCleanToken } from '@/lib/getCleanToken';
import { canDisplaySellerContact, pickShopPhone, whatsappUrl } from '@/lib/seller-contact';
import { fixImageUrl, FALLBACK_IMAGE } from '@/lib/image';
import { useLocalization } from '@/contexts/LocalizationProvider';
import { buildPricing as buildPricingMini, symbolFor } from '@/lib/pricing-mini';
import { withCountryPrefix } from '@/lib/locale-routing';

const DEBUG =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('debug');

const CONTACT_REASON_COPY = {
  missing_entitlement: 'Seller plan doesn’t include public phone yet.',
  plan_required: 'Seller plan doesn’t include public phone yet.',
  kyc_required: 'Seller must complete KYC to show a public phone.',
  storefront_locked: 'Seller’s storefront is locked; contact phone hidden.',
  no_number: 'Seller hasn’t added a public phone yet.',
  unknown: 'Contact phone not available.',
};
function contactReasonText(reason, allowed) {
  if (allowed) return CONTACT_REASON_COPY.no_number;
  const key = String(reason || '').trim().toLowerCase();
  const alias = {
    no_phone: 'no_number',
    not_entitled: 'missing_entitlement',
    missing_entitlements: 'missing_entitlement',
    locked: 'storefront_locked',
  };
  return CONTACT_REASON_COPY[alias[key] || key] || CONTACT_REASON_COPY.unknown;
}

/* ---------------- tiny helpers ---------------- */
function readCookie(name) {
  try {
    if (typeof document === 'undefined') return '';
    const parts = document.cookie ? document.cookie.split('; ') : [];
    for (const part of parts) {
      const [k, ...rest] = part.split('=');
      if (k === name) return decodeURIComponent(rest.join('='));
    }
    return '';
  } catch {
    return '';
  }
}

function openLocaleSheetSafe() {
  try {
    const btn = document.querySelector('button[aria-label="Open region & preferences"]');
    if (btn) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => btn.click(), 200);
    }
  } catch {}
}

/* ---------------- image resolver ---------------- */
function resolveRelatedImage(item) {
  if (!item) return FALLBACK_IMAGE;
  const isGood = (v) => typeof v === 'string' && v.trim() && !/^(null|none|undefined)$/i.test(v);

  const toArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      const s = v.trim();
      if (s.startsWith('[')) {
        try {
          const arr = JSON.parse(s);
          return Array.isArray(arr) ? arr : [];
        } catch {}
      }
      return s.split(/[,\|]\s*|\s{2,}/g).filter(Boolean);
    }
    if (typeof v === 'object') {
      for (const k of Object.keys(v)) {
        const child = v[k];
        if (Array.isArray(child)) return child;
      }
    }
    return [];
  };

  const pickFromOne = (x) => {
    if (typeof x === 'string') return x;
    if (x && typeof x === 'object') {
      return (
        x.image_url ||
        x.url ||
        x.secure_url ||
        x.src ||
        x.thumbnail ||
        x.image ||
        x.path ||
        null
      );
    }
    return null;
  };

  const arrayishKeys = [
    'product_images',
    'images',
    'photos',
    'image_objects',
    'imageObjects',
    'gallery',
    'pictures',
    'thumbnails',
    'media',
    'assets',
    'primary_media',
    'image_urls',
  ];
  for (const k of arrayishKeys) {
    const arr = toArray(item[k]);
    for (const it of arr) {
      const u = pickFromOne(it);
      if (isGood(u)) return fixImageUrl(u);
    }
  }

  for (const parentKey of ['media', 'assets', 'primary_media']) {
    const parent = item[parentKey];
    if (parent && typeof parent === 'object') {
      for (const k of Object.keys(parent)) {
        const arr = toArray(parent[k]);
        for (const it of arr) {
          const u = pickFromOne(it);
          if (isGood(u)) return fixImageUrl(u);
        }
      }
      const direct = pickFromOne(parent);
      if (isGood(direct)) return fixImageUrl(direct);
    }
  }

  const singleKeys = [
    'product_image_url',
    'product_image',
    'thumbnail_url',
    'thumbnail',
    'primary_image_url',
    'main_image',
    'seo_image',
    'image_url',
    'image',
    'picture_url',
    'picture',
    'cover_image',
    'preview',
  ];
  for (const k of singleKeys) {
    const v = item[k];
    if (isGood(v)) return fixImageUrl(v);
  }

  return FALLBACK_IMAGE;
}

/* ---------------- phones helpers ---------------- */
function normalizeShopPhones(shop) {
  if (!shop) return [];
  if (Array.isArray(shop.phones) && shop.phones.length) return shop.phones;
  const scn = shop.seller_contact_number;
  if (!scn) return [];
  const base = {
    id: 'legacy',
    uses: ['shop_public'],
    is_primary: true,
    is_verified: !!shop.seller_contact_verified,
    updated_at: shop.updated_at,
  };
  if (typeof scn === 'string')
    return [
      {
        ...base,
        e164: scn,
        number: scn,
        display: scn,
        national: scn,
        local: scn,
      },
    ];
  if (typeof scn === 'object') {
    const e = scn.e164 || scn.number || scn.display || scn.national || scn.local || '';
    return [
      {
        ...base,
        e164: e,
        number: scn.number || e,
        display: scn.display || scn.national || scn.local || e,
        national: scn.national,
        local: scn.local,
        uses: Array.isArray(scn.uses)
          ? Array.from(new Set([...scn.uses, 'shop_public']))
          : ['shop_public'],
        is_primary: scn.is_primary ?? base.is_primary,
        is_verified: scn.is_verified ?? base.is_verified,
        updated_at: scn.updated_at || base.updated_at,
        id: scn.id || base.id,
      },
    ];
  }
  return [];
}
function legacyPhoneFromSellerContact(scn, shopUpdatedAt, isVerified) {
  if (!scn) return null;
  const base = {
    id: 'legacy',
    uses: ['shop_public'],
    is_primary: true,
    is_verified: !!isVerified,
    updated_at: shopUpdatedAt,
  };
  if (typeof scn === 'string') {
    const e = scn.replace(/[^\d+]/g, '');
    if (!e) return null;
    return { ...base, e164: e, display: scn, number: scn, national: scn, local: scn };
  }
  if (typeof scn === 'object') {
    const raw = scn.e164 || scn.number || scn.display || scn.national || scn.local || '';
    const e = String(raw).replace(/[^\d+]/g, '');
    if (!e) return null;
    return {
      ...base,
      id: scn.id || base.id,
      e164: e,
      number: scn.number || e,
      display: scn.display || scn.national || scn.local || e,
      national: scn.national,
      local: scn.local,
      uses: Array.isArray(scn.uses)
        ? Array.from(new Set([...scn.uses, 'shop_public']))
        : ['shop_public'],
      is_primary: scn.is_primary ?? base.is_primary,
      is_verified: scn.is_verified ?? base.is_verified,
      updated_at: scn.updated_at || base.updated_at,
    };
  }
  return null;
}

const SignalsPills = ({ views24h = 0, baskets24h = 0, wishlistsTotal = 0 }) => (
  <div className="mt-2 mb-3 flex flex-wrap gap-2 text-xs">
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
      👀 {Number(views24h).toLocaleString()} views (24h)
    </span>
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
      🧺 {Number(baskets24h).toLocaleString()} added to basket (24h)
    </span>
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
      ❤️ {Number(wishlistsTotal).toLocaleString()} wishlists
    </span>
  </div>
);

/* ---------- contact click tracking ---------- */
function hasFiredContactFor(slug) {
  try {
    return sessionStorage.getItem(`ccf:${slug}`) === '1';
  } catch {
    return false;
  }
}
function markFiredContactFor(slug) {
  try {
    sessionStorage.setItem(`ccf:${slug}`, '1');
  } catch {}
}
function getOrCreateSessionId() {
  try {
    const k = 'upfrica_sid';
    let id = localStorage.getItem(k);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(k, id);
    }
    return id;
  } catch {
    return '';
  }
}
async function postContactClick(slug, source = 'pdp') {
  const url = b(`products/${slug}/event/`);
  const payload = JSON.stringify({ event: 'contact_click', session_id: getOrCreateSessionId(), source });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
  } catch {}
  try {
    await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      keepalive: true,
      body: payload,
    });
  } catch {}
}

/* ---------------- PDP ---------------- */
export default function ProductDetailSection({ product, signals }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = usePathname();

  const containerRef = React.useRef(null);


  // --- Add these inside ProductDetailSection component (near other hooks) ---
const mark = useCallback(async (kind, delta = 1) => {
  if (!product?.id) return;
  const sid = getOrCreateSessionId();
  const url = `${b('pdp')}?id=${encodeURIComponent(product.id)}&kind=${encodeURIComponent(kind)}&delta=${delta}&sid=${encodeURIComponent(sid)}`;
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob(["1"], { type: "text/plain" }));
    } else {
      await fetch(url, {
        method: "POST",
        keepalive: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Session-Id": sid,
        },
      });
    }
  } catch {}
}, [product?.id]);

useEffect(() => {
  if (!product?.id || !containerRef.current) return;

  const onceKey = `pv:${product.id}:seen`;
  if (sessionStorage.getItem(onceKey) === '1') return;

  const cb = (entries, obs) => {
    if (entries.some(e => e.isIntersecting)) {
      sessionStorage.setItem(onceKey, '1');
      mark('views', 1);
      obs.disconnect();
    }
  };

  // <-- here
  const io = new IntersectionObserver(cb, { threshold: 0, rootMargin: '100px' });
  io.observe(containerRef.current);

  return () => io.disconnect();
}, [product?.id, mark]);




  const { country: uiCountry, currency: uiCurrency, price: conv, resolvedLanguage } =
    useLocalization();

  const convSafe = useCallback(
    (amount, fromCurrency) => {
      if (amount == null) return null;
      if (!conv || !uiCurrency || uiCurrency === fromCurrency) return amount;
      try {
        const out = Number(conv(amount, fromCurrency));
        if (!Number.isFinite(out) || out <= 0) return amount;
        const ratio = out / amount;
        if (ratio > 10 || ratio < 0.1) return amount;
        return out;
      } catch {
        return amount;
      }
    },
    [conv, uiCurrency]
  );

  const amountOnly = useCallback(
    (n, currency) => {
      try {
        const parts = new Intl.NumberFormat(resolvedLanguage || 'en', {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).formatToParts(n);
        return parts
          .filter((p) => p.type !== 'currency')
          .map((p) => p.value)
          .join('')
          .trim();
      } catch {
        return Number(n || 0).toFixed(2);
      }
    },
    [resolvedLanguage]
  );


  useEffect(() => {
    try {
      document.documentElement.setAttribute('lang', resolvedLanguage || 'en');
    } catch {}
  }, [resolvedLanguage]);

  const {
    id, title, product_images, shop, user, variants, is_published,
  } = product || {};

  const { token, user: currentUser } = useSelector((s) => s.auth);
  const basket = useSelector((s) => s.basket.items) || [];

  const [quantity, setQuantity] = useState(1);
  const [isDirectBuyPopupVisible, setIsDirectBuyPopupVisible] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* contact gate */
  const sellerEntitlements = Array.isArray(shop?.entitlements) ? shop.entitlements : undefined;
  const stateOf = useCallback(
    (name) => {
      if (name === 'allow_display_seller_contact') return shop?.contact_display_state;
      if (name === 'storefront_unlock') return shop?.storefront_state;
      return undefined;
    },
    [shop?.contact_display_state, shop?.storefront_state]
  );
  const gate = canDisplaySellerContact({
    entitlements: sellerEntitlements,
    stateOf,
    fallbackIfUnknown: false,
  });

  const phonesFromShop = normalizeShopPhones(shop);
  const legacyPhone = legacyPhoneFromSellerContact(
    shop?.seller_contact_number,
    shop?.updated_at,
    shop?.seller_contact_verified
  );
  const phoneToShow = useMemo(() => {
    if (!gate.allowed) return null;
    if (phonesFromShop.length) return pickShopPhone(phonesFromShop);
    return legacyPhone;
  }, [gate.allowed, phonesFromShop, legacyPhone]);

  const canShowPhone = !!phoneToShow;
  const isVerifiedSeller = useMemo(() => {
    if (!canShowPhone) return false;
    const entitlesContact =
      Array.isArray(shop?.entitlements) && shop.entitlements.includes('contact_display');
    return Boolean(
      phoneToShow?.is_verified ??
        shop?.seller_contact_verified ??
        shop?.seller_contact_number_verified ??
        user?.kyc_verified ??
        user?.verified ??
        entitlesContact
    );
  }, [canShowPhone, phoneToShow, shop, user]);

  const [contactRevealed, setContactRevealed] = useState(false);
  const isOwnerOrStaff = useMemo(() => {
    const me = currentUser;
    const owner = me?.id && product?.user?.id && me.id === product.user.id;
    return !!(owner || me?.is_staff || me?.is_superuser);
  }, [currentUser, product?.user?.id]);
  const fireContactOnce = useCallback(() => {
    const slug = product?.slug;
    if (!slug || isOwnerOrStaff) return;
    if (hasFiredContactFor(slug)) return;
    markFiredContactFor(slug);
    postContactClick(slug, 'pdp');
  }, [product?.slug, isOwnerOrStaff]);
  useEffect(() => {
    if (contactRevealed) fireContactOnce();
  }, [contactRevealed, fireContactOnce]);

  const [copied, setCopied] = useState(false);
  const rawDisplay = useMemo(() => {
    const n = phoneToShow?.display ?? phoneToShow?.e164 ?? phoneToShow?.number ?? '';
    return String(n).trim();
  }, [phoneToShow?.display, phoneToShow?.e164, phoneToShow?.number]);
  const telDigits = useMemo(() => rawDisplay.replace(/[^\d+]/g, ''), [rawDisplay]);
  const waNumber = useMemo(() => phoneToShow?.e164 || telDigits || '', [phoneToShow?.e164, telDigits]);
  const waLink = useMemo(() => (contactRevealed ? whatsappUrl(waNumber) : null), [contactRevealed, waNumber]);

  // ---- Signals (normalize + live refresh) ----
  const normalizeSignals = useCallback((src) => {
    const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    const s = src || {};
    return {
      views24h:       n(s.views24h ?? s.views_24h ?? s.views_last_24h ?? s.views),
      baskets24h:     n(s.baskets24h ?? s.baskets_24h ?? s.added_to_basket_24h ?? s.baskets),
      wishlistsTotal: n(s.wishlistsTotal ?? s.wishlists_total ?? s.wishlist_total ?? s.wishlists),
    };
  }, []);

  const [sig, setSig] = useState(() => normalizeSignals(signals));

  useEffect(() => {
    setSig(normalizeSignals(signals));
  }, [signals, normalizeSignals]);

  useEffect(() => {
    if (!product?.id) return;
    let cancelled = false;

    const refresh = async () => {
      try {
        const url = `${b('pdp/signals')}?id=${encodeURIComponent(product.id)}`;
        const res = await fetch(url, {
          cache: 'no-store',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setSig(normalizeSignals(data));
      } catch {}
    };

    refresh();
    const catchPing = setTimeout(refresh, 1200);
    const iv = setInterval(refresh, 15000);

    return () => { cancelled = true; clearTimeout(catchPing); clearInterval(iv); };
  }, [product?.id, normalizeSignals]);

  const maskPhone = useCallback((s) => {
    const digits = String(s || '').replace(/[^\d]/g, '');
    if (digits.length <= 4) return '••••';
    const tail = digits.slice(-4);
    return `••• •• ${tail}`;
  }, []);
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(rawDisplay || telDigits || '');
      setCopied(true);
      fireContactOnce();
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }, [rawDisplay, telDigits, fireContactOnce]);

  /* ---------------- related + reviews state ---------------- */
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    average_rating: 0,
    review_count: 0,
    rating_percent: {},
  });

  /* ---------------- Related products (proxied) ---------------- */
  useEffect(() => {
    if (!product?.slug || !uiCountry) return;

    const parseSlug = (slug) => {
      const parts = String(slug).split('-');
      if (parts.length < 3) return { base_slug: slug, condition: '', city: '' };
      const city = parts.slice(-2).join('-');
      const condition = parts[parts.length - 3];
      const base_slug = parts.slice(0, parts.length - 3).join('-');
      return { base_slug, condition, city };
    };

    const { base_slug, condition: cond, city } = parseSlug(product.slug);
    const countryCode = (uiCountry || 'gh').toLowerCase();
    const finalSlug = `${base_slug}-${cond}-${city}`;

    (async () => {
      try {
        const { data, status } = await axios.get(
          b([countryCode, finalSlug, 'related']),
          {
            withCredentials: true,
            validateStatus: () => true,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
          }
        );
        if (status >= 200 && status < 300) {
          setRelatedProducts(Array.isArray(data?.results) ? data.results : (data || []));
        }
      } catch {}
    })();
  }, [product?.slug, uiCountry]);

  /* ---------------- Reviews (single effect via proxy) ---------------- */
  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    dispatch(fetchReviewsStart());

    (async () => {
      try {
        const { data, status } = await axios.get(b(['product', id, 'reviews']), {
          withCredentials: true,
          validateStatus: () => true,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (cancelled) return;
        if (status < 200 || status >= 300) throw new Error(`HTTP ${status}`);

        const results = data.results ?? data.reviews ?? [];

        const countsFromApi =
          data.rating_counts ?? data.rating_count ?? data.counts ?? null;
        let ratingPercent = data.rating_percent ?? data.rating_distribution ?? null;

        if (!ratingPercent) {
          const counts =
            countsFromApi ??
            results.reduce((acc, r) => {
              const s = Math.max(1, Math.min(5, Math.round(Number(r?.rating) || 0)));
              acc[s] = (acc[s] || 0) + 1;
              return acc;
            }, {});
          const total = Object.values(counts || {}).reduce((a, b) => a + b, 0);
          const pct = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          if (total > 0) {
            for (let s = 1; s <= 5; s++) {
              const c = Number(counts?.[s] || 0);
              pct[s] = Math.round((c / total) * 100);
            }
          }
          ratingPercent = pct;
        }

        dispatch(
          fetchReviewsSuccess({
            results,
            average_rating: data.average_rating ?? 0,
            review_count: data.review_count ?? results.length,
            rating_percent: ratingPercent ?? {},
          })
        );

        setReviewStats({
          average_rating: data.average_rating ?? 0,
          review_count: data.review_count ?? results.length,
          rating_percent: ratingPercent ?? {},
        });
      } catch (err) {
        if (!cancelled) {
          dispatch(fetchReviewsFailure(err?.message || String(err)));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, id]);

  /* Variants selection */
  const [selectedVariants, setSelectedVariants] = useState({});
  useEffect(() => {
    if (!variants) return;
    const defaults = {};
    variants.forEach((v) => {
      if (v.values?.length) defaults[v.id] = v.values[0];
    });
    setSelectedVariants(defaults);
  }, [variants]);

  // ---- Pricing base (safe FX) ----
  const pricing = useMemo(
    () =>
      buildPricingMini(product, {
        uiCurrency,
        locale: resolvedLanguage || 'en',
        conv: convSafe,
      }),
    [product, uiCurrency, resolvedLanguage, convSafe]
  );
  const priceSymbol = pricing.display.symbol;
  const saleActive = pricing.saleActive;

  // ---- SKUs (combo rows) ----
  const [skus, setSkus] = useState([]);
  useEffect(() => {
    if (!product?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, status } = await axios.get(b([`products`, product.id, `skus`]));
        if (cancelled) return;
        if (status >= 200 && status < 300) {
          setSkus(Array.isArray(data?.results) ? data.results : (data || []));
        } else {
          setSkus([]);
        }
      } catch {
        if (!cancelled) setSkus([]);
      }
    })();
    return () => { cancelled = true; };
  }, [product?.id]);

  const valueSortIndex = useMemo(() => {
    const map = {};
    (product?.variants || []).forEach((variant) => {
      const ord = Number(variant?.ordering ?? 0);
      (variant?.values || []).forEach((val) => { map[val.id] = [ord, val.id]; });
    });
    return map;
  }, [product?.variants]);

  const keyFor = useCallback(
    (ids) =>
      (ids || [])
        .slice()
        .map(Number)
        .sort((a, b) => {
          const A = valueSortIndex[a] || [0, a];
          const B = valueSortIndex[b] || [0, b];
          return A[0] - B[0] || A[1] - B[1];
        })
        .map((id) => `v${id}`)
        .join('-'),
    [valueSortIndex]
  );

  const haveSkus = (skus || []).length > 0;
  const activeSkus = useMemo(
    () => (skus || []).filter((s) => s?.is_active !== false && (s?.quantity ?? 0) > 0),
    [skus]
  );
  const skuByKey = useMemo(() => {
    const m = new Map();
    (skus || []).forEach((s) => m.set(s.options_key, s));
    return m;
  }, [skus]);

  const containsSubset = useCallback(
    (ids) => {
      if (!haveSkus) return true;
      if (!ids?.length) return true;
      const tokens = ids.map((id) => `v${id}`);
      for (const s of activeSkus) {
        const ok = tokens.every((t) => s.options_key.includes(t));
        if (ok) return true;
      }
      return false;
    },
    [activeSkus, haveSkus]
  );

  const selectedValueIds = useMemo(
    () => Object.values(selectedVariants || {}).map((v) => v?.id).filter(Boolean),
    [selectedVariants]
  );
  const selectedKey = useMemo(() => keyFor(selectedValueIds), [keyFor, selectedValueIds]);
  const selectedSku = useMemo(() => skuByKey.get(selectedKey) || null, [skuByKey, selectedKey]);

  const outOfStock = useMemo(() => {
    if (!haveSkus) return false;
    if (!selectedSku) return true;
    return (selectedSku.quantity ?? 0) <= 0 || selectedSku.is_active === false;
  }, [haveSkus, selectedSku]);

  const totalAdditionalCents = useMemo(
    () => Object.values(selectedVariants).reduce((s, v) => s + (v.additional_price_cents || 0), 0),
    [selectedVariants]
  );

  const baseActiveMajor = useMemo(() => {
    const cents = saleActive ? (product?.sale_price_cents || 0) : (product?.price_cents || 0);
    return Number(cents) / 100;
  }, [saleActive, product?.sale_price_cents, product?.price_cents]);

  const baseOriginalMajor = useMemo(() => Number(product?.price_cents || 0) / 100, [product?.price_cents]);
  const addonMajor = useMemo(() => Number(totalAdditionalCents || 0) / 100, [totalAdditionalCents]);

  const selectedActiveSellerMajor = useMemo(() => {
    if (selectedSku) {
      if (saleActive && selectedSku.sale_price_cents_override != null) {
        return Number(selectedSku.sale_price_cents_override) / 100;
      }
      if (selectedSku.price_cents_override != null) {
        return Number(selectedSku.price_cents_override) / 100;
      }
    }
    return baseActiveMajor + addonMajor;
  }, [selectedSku, saleActive, baseActiveMajor, addonMajor]);

  const selectedOriginalSellerMajor = useMemo(
    () => baseOriginalMajor + addonMajor,
    [baseOriginalMajor, addonMajor]
  );

  const toDisplayMajorNumber = useCallback((sellerMajor) => {
    const displayCcy = pricing.display.currency;
    const sellerCcy = pricing.sellerCurrency || 'USD';
    let n = Number(sellerMajor || 0);
    if (convSafe && displayCcy !== sellerCcy) {
      const x = Number(convSafe(n, sellerCcy));
      if (Number.isFinite(x) && x > 0) n = x;
    }
    return n;
  }, [pricing.display.currency, pricing.sellerCurrency, convSafe]);

  const activeDisplayMajor = useMemo(
    () => toDisplayMajorNumber(selectedActiveSellerMajor),
  [toDisplayMajorNumber, selectedActiveSellerMajor]
  );

  const originalDisplayMajor = useMemo(
    () => (saleActive ? toDisplayMajorNumber(selectedOriginalSellerMajor) : null),
    [saleActive, toDisplayMajorNumber, selectedOriginalSellerMajor]
  );

  const activeAmountOnly = useMemo(
    () => amountOnly(activeDisplayMajor, pricing.display.currency),
    [activeDisplayMajor, pricing.display.currency]
  );

  const originalAmountOnly = useMemo(
    () => (originalDisplayMajor != null
      ? amountOnly(originalDisplayMajor, pricing.display.currency)
      : null),
    [originalDisplayMajor, pricing.display.currency]
  );

  const savedDisplayMajor = useMemo(() => {
    return originalDisplayMajor != null
      ? Math.max(0, originalDisplayMajor - activeDisplayMajor)
      : 0;
  }, [originalDisplayMajor, activeDisplayMajor]);

  const discountPct = useMemo(() => {
    return originalDisplayMajor
      ? Math.round((savedDisplayMajor / originalDisplayMajor) * 100)
      : null;
  }, [savedDisplayMajor, originalDisplayMajor]);

  /* Wishlist (proxied) */
// --- Replace your handleToggleWishlist with this ---
const handleToggleWishlist = async () => {
  const authed = await verifyAuth();
  if (!authed) {
    router.push(`/login?next=${encodeURIComponent(currentPath)}`);
    return;
  }

  setLoading(true);
  try {
    if (isWishlisted) {
      await fetch(b(`wishlist/${id}/`), {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });
      setIsWishlisted(false);
      // decrement wishlists
      mark('wishlists', -1);
    } else {
      await fetch(b('wishlist/'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify({ product_id: id, note: '' }),
      });
      setIsWishlisted(true);
      // increment wishlists
      mark('wishlists', 1);
    }
  } catch {
  } finally {
    setLoading(false);
  }
};

  /* Admin actions (proxied) */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(b(`products/${id}/`), {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });
      router.back();
    } catch {}
  };

  const handleUnpublish = async () => {
    try {
      await fetch(b(`products/${id}/unpublish/`), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });
      router.refresh?.();
    } catch {}
  };

  // ---- Shipping preview (min fee + availability, proxied) ----
  const [shipPreview, setShipPreview] = useState({
    available: null,
    minFeeCents: null,
    currency: pricing.sellerCurrency || 'USD',
    method: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPreview() {
      if (!product?.id) return;

      const cc = uiCountry || 'gh';
      const city = typeof document !== 'undefined' ? readCookie(`deliver_to_${cc}`) || '' : '';

      const paths = [
        `products/${product.id}/shipping/preview/?cc=${encodeURIComponent(cc)}&city=${encodeURIComponent(city)}`,
        `product/${product.id}/shipping/preview/?cc=${encodeURIComponent(cc)}&city=${encodeURIComponent(city)}`,
      ];
      if (shop?.slug) {
        paths.push(
          `shops/${shop.slug}/shipping/preview/?cc=${encodeURIComponent(cc)}&city=${encodeURIComponent(city)}`,
          `shop/${shop.slug}/shipping/preview/?cc=${encodeURIComponent(cc)}&city=${encodeURIComponent(city)}`
        );
      }

      let ok = false;
      for (const path of paths) {
        try {
          const t = getCleanToken();
          const res = await fetch(b(path), {
            credentials: 'include',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              ...(t ? { Authorization: `Token ${t}` } : {}),
            },
          });
          if (!res.ok) continue;
          const d = await res.json();

          const opts = Array.isArray(d.options) ? d.options.filter((o) => o && o.enabled !== false) : [];
          const min = opts.reduce((best, cur) => (best && best.fee_cents <= cur.fee_cents ? best : cur), null);

          if (!cancelled) {
            setShipPreview({
              available: d.available === false ? false : opts.length > 0 ? true : null,
              minFeeCents: min ? Number(min.fee_cents || 0) : opts.length ? 0 : null,
              currency: d.currency || pricing.sellerCurrency || 'USD',
              method: min?.method || null,
            });
          }
          ok = true;
          break;
        } catch {}
      }

      if (!ok && !cancelled) {
        setShipPreview((prev) => ({
          ...prev,
          available: null,
          minFeeCents: null,
          currency: pricing.sellerCurrency || prev.currency,
        }));
      }
    }

    fetchPreview();
    return () => {
      cancelled = true;
    };
  }, [product?.id, shop?.slug, uiCountry, pricing.sellerCurrency]);

  const postageSymbol = useMemo(
    () =>
      symbolFor(shipPreview.currency || pricing.sellerCurrency || 'USD', resolvedLanguage || 'en'),
    [shipPreview.currency, pricing.sellerCurrency, resolvedLanguage]
  );

  const shipBlocked = shipPreview.available === false;
  const shipOrStockBlocked = shipBlocked || outOfStock;

  const { timeRemaining, progressPct: saleProgressPct } =
    useSaleCountdown(product?.sale_start_date, product?.sale_end_date);

  const showCountdown = Boolean(saleActive && product?.sale_end_date);

  React.useEffect(() => {
    const open = () => setIsModalVisible(true);
    window.addEventListener('open-basket-sheet', open);
    return () => window.removeEventListener('open-basket-sheet', open);
  }, []);

  /* Basket */
// --- Replace your handleAddToBasket with this ---
const handleAddToBasket = () => {
  if (shipOrStockBlocked) return;

  // record "added to basket"
  mark('baskets', 1);

  // keep your existing analytics if you want
  // pm.markAddToBasket(product.slug, { source: 'pdp' });

  const basketPriceCents = Math.round(selectedActiveSellerMajor * 100);

  dispatch({
    type: 'basket/addToBasket',
    payload: {
      id,
      title,
      price_cents: basketPriceCents,
      quantity,
      image: product_images,
      postage_fee: product?.postage_fee_cents || 0,
      secondary_postage_fee: product?.secondary_postage_fee_cents || 0,
      variants: selectedVariants,
      sku_id: selectedSku?.id || null,
      options_key: selectedKey,
      value_ids: selectedValueIds,
      sku:
        selectedSku?.sku ||
        ('SKU-' +
          Object.values(selectedVariants)
            .map((o) => o.value.replace(/\s+/g, '-').toUpperCase())
            .join('-')),
    },
  });
  setIsModalVisible(true);
};


  const handleCloseModal = () => setIsModalVisible(false);
  const handleQuantityChange = (pid, q) =>
    dispatch({ type: 'basket/updateQuantity', payload: { id: pid, quantity: q } });
  const handleRemoveProduct = (pid) =>
    dispatch({ type: 'basket/removeFromBasket', payload: pid });

  /* Multi-buy */
  const [selectedMultiBuyTier, setSelectedMultiBuyTier] = useState(null);
  const handleTierSelect = useCallback((tier) => {
    setSelectedMultiBuyTier((prev) => (prev?.minQuantity === tier.minQuantity ? prev : tier));
  }, []);

  const verifyAuth = useCallback(async () => {
    try {
      const r = await fetch(b('users/me'), {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      });
      if (!r.ok) return false;
      const j = await r.json().catch(() => ({}));
      return Boolean(j?.id || j?.email || j?.username || j?.is_authenticated);
    } catch {
      return false;
    }
  }, []);

  const handleDirectBuyNow = async (arg) => {
    const uiSource = typeof arg === 'string' ? arg : 'primary_panel';
    if (arg && typeof arg.preventDefault === 'function') arg.preventDefault();

    if (shipOrStockBlocked) return;

    pm.markPrimaryBuyClick(product.slug, { source: 'pdp', ui: uiSource });

    const authed = await verifyAuth();
    if (!authed) {
      const next = typeof window !== 'undefined'
        ? location.pathname + location.search + location.hash
        : '/';
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    setIsDirectBuyPopupVisible(true);
    if (!isAddressLoading && (!addresses || addresses.length === 0)) setShowNewModal(true);
  };

  const descriptionHtml = useMemo(() => {
    const pick = (...vals) => vals.find((v) => typeof v === 'string' && v.trim().length > 0)?.trim();
    let raw = pick(product?.description_html, product?.rich_description_html, product?.description);
    if (raw && /&lt;|&gt;/.test(raw)) {
      try {
        const doc = new DOMParser().parseFromString(raw, 'text/html');
        raw = doc.documentElement.textContent || raw;
      } catch {}
    }
    return raw || '<p>No description provided.</p>';
  }, [product]);

  const formatAddonInDisplayCurrency = useCallback(
    (sellerMajor) => {
      const displayCurrency = pricing.display.currency;
      let out = sellerMajor;
      try {
        if (convSafe && displayCurrency !== pricing.sellerCurrency) {
          const n = Number(convSafe(sellerMajor, pricing.sellerCurrency));
          if (Number.isFinite(n) && n > 0) out = n;
        }
      } catch {}
      return `${priceSymbol}${amountOnly(out, displayCurrency)}`;
    },
    [amountOnly, convSafe, priceSymbol, pricing.display.currency, pricing.sellerCurrency]
  );

  const relatedHref = useCallback(
    (seoSlug) => {
      const clean = String(seoSlug || '').replace(/^\/?[a-z]{2}\//i, '');
      return withCountryPrefix(uiCountry || 'gh', `/${clean}`);
    },
    [uiCountry]
  );

  /* ---------------- Addresses (proxied via axiosInstance) ---------------- */
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const asList = (payload) =>
      Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
        ? payload.results
        : Array.isArray(payload?.items)
        ? payload.items
        : [];

    (async () => {
      setIsAddressLoading(true);
      try {
        const { data, status } = await axios.get(b('addresses'), {
          withCredentials: true,
          validateStatus: () => true,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (cancelled) return;

        if (status === 401 || status === 403) {
          setAddresses([]);
          setSelectedAddressId(null);
          return;
        }
        if (status < 200 || status >= 300) {
          setAddresses([]);
          setSelectedAddressId(null);
          return;
        }

        const rows = asList(data).filter((a) => !a.is_deleted);
        const opts = rows.map((a) => ({
          id: a.id,
          value:
            a.display_address ||
            [
              a.address_line_1 ?? a.address_data?.address_line_1,
              a.address_line_2 ?? a.address_data?.address_line_2,
              a.local_area ?? a.address_data?.local_area,
              a.town ?? a.address_data?.town,
              a.state_or_region ?? a.address_data?.state_or_region,
              a.postcode ?? a.address_data?.postcode,
              a.country ?? a.country_code ?? a.address_data?.country,
            ]
              .filter(Boolean)
              .join(', '),
        }));

        setAddresses(opts);
        const def = rows.find((r) => r.default);
        setSelectedAddressId(def?.id ?? opts[0]?.id ?? null);
      } catch {
        if (!cancelled) {
          setAddresses([]);
          setSelectedAddressId(null);
        }
      } finally {
        if (!cancelled) setIsAddressLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleNewAddressSubmit = async (vals, { setSubmitting, resetForm }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(token
          ? { Authorization: `Token ${token}` }
          : (() => {
              const csrftoken = readCookie('csrftoken');
              return csrftoken ? { 'X-CSRFToken': csrftoken } : {};
            })()),
      };

      const payload = {
        owner_id: currentUser.id,
        owner_type: 'USER',
        default: false,
        full_name: vals.full_name,
        address_data: {
          street: vals.street,
          city: vals.city,
          state: vals.state,
          zip_code: vals.zip_code,
          country: vals.country,
        },
      };

      const { data, status } = await axios.post(b('addresses'), payload, {
        withCredentials: true,
        validateStatus: () => true,
        headers,
      });

      if (status === 401 || status === 403) {
        setShowNewModal(false);
        return;
      }
      if (status < 200 || status >= 300) {
        return;
      }

      setAddresses((prev) => [
        ...prev,
        {
          id: data.id,
          value: `${data.address_data.street}, ${data.address_data.city}, ${data.address_data.country}`,
        },
      ]);
      setSelectedAddressId(data.id);
      resetForm();
      setShowNewModal(false);
      setIsDirectBuyPopupVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <section className="pt-6 md:pt-8 lg:pt-10 text-gray-900 dark:text-gray-100 bg-transparent">
      <RecentlyViewed product={product} />

      <div data-sticky-container>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="order-1 xl:col-span-7">
            <div>
              <Breadcrumbs path={product?.category_breadcrumb || []} title={product?.title || ''} />
            </div>

            {/* impression sentinel for view metric */}
            <span ref={containerRef} className="block h-px" aria-hidden />
            {/* popularity pills (mobile + desktop) */}
            <SignalsPills
              views24h={sig.views24h}
              baskets24h={sig.baskets24h}
              wishlistsTotal={sig.wishlistsTotal}
            />

            {DEBUG && (
              <pre className="text-[10px] opacity-70 select-text">
                signals(live): {JSON.stringify(sig)}
              </pre>
            )}

            {/* image slider (mobile full-bleed + desktop) */}
            <div className="block md:hidden relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              <ProductSlider mediaItems={product.product_images} inBaskets={sig.baskets24h} />
            </div>
            <div className="hidden md:block">
              <ProductSlider mediaItems={product.product_images} inBaskets={sig.baskets24h} />
            </div>

            {/* ------- MOBILE SUMMARY ------- */}
            <section className="block xl:hidden mt-5 space-y-4">
              <div className="p-0 space-y-1 bg-white dark:bg-neutral-900">
                <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-neutral-100">
                  {title}
                </h1>
                <SellerCard
                  shop={shop}
                  user={user}
                  secondaryData={product?.secondary_data}
                  reviewStats={reviewStats}
                />
              </div>

              <div className="rounded-xl p-4 border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-neutral-900">
                {/* Limited-time deal card + progress */}
                {showCountdown && (
                  <section
                    className="mb-3 rounded-xl border border-orange-200/70 bg-gradient-to-r from-orange-50 to-amber-50
                               dark:from-orange-900/20 dark:to-amber-900/10 ring-1 ring-orange-200/60 dark:ring-orange-800/40 p-3"
                    aria-label="Limited-time deal"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-orange-900 dark:text-orange-100">
                        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full
                                        bg-orange-100 dark:bg-orange-900/40">
                          <span className="absolute inline-flex h-full w-full rounded-full animate-ping
                                           opacity-20 bg-orange-300 dark:bg-orange-600
                                           motion-reduce:hidden" />
                          ⏳
                        </span>
                        Limited-time deal
                      </span>

                      <time
                        dateTime={product?.sale_end_date}
                        className="font-mono tabular-nums text-xs font-extrabold text-orange-900 dark:text-orange-50"
                        aria-live="off"
                      >
                        {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                      </time>
                    </div>

                    {product?.sale_start_date && product?.sale_end_date && (
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-orange-100 dark:bg-orange-950/40">
                        <div
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(Math.min(100, Math.max(0, saleProgressPct)))}
                          className="h-full bg-orange-400 dark:bg-orange-500 transition-[width] duration-1000"
                          style={{ width: `${Math.min(100, Math.max(0, saleProgressPct))}%` }}
                        />
                      </div>
                    )}

                    <span className="sr-only" aria-live="polite">
                      Sale ends in {timeRemaining.days} days and {timeRemaining.hours} hours
                    </span>
                  </section>
                )}

                <SimplePrice
                  symbol={priceSymbol}
                  activeAmountOnly={activeAmountOnly}
                  originalAmountOnly={originalAmountOnly}
                  saleActive={saleActive}
                  postageCents={shipPreview.minFeeCents}
                  postageSymbol={postageSymbol}
                  shipAvailable={shipPreview.available}
                />

                {saleActive && originalAmountOnly && (
                  <div className="mt-1 text-xs text-green-700 dark:text-green-300">
                    You save <strong>{priceSymbol}{amountOnly(savedDisplayMajor, pricing.display.currency)}</strong>
                    {typeof discountPct === 'number' ? ` (${discountPct}% off)` : null}
                  </div>
                )}

                {/* Cheapest method label + change location */}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>
                    {shipPreview.method && shipPreview.minFeeCents !== null
                      ? <>via <strong>{shipPreview.method}</strong></>
                      : <>Shipping fees shown at checkout</>}
                  </span>
                  <button
                    type="button"
                    onClick={openLocaleSheetSafe}
                    className="inline-flex items-center gap-1 text-[var(--violet-600,#7c3aed)] hover:underline"
                  >
                    <FaMapMarkerAlt aria-hidden /> Change location
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={handleAddToBasket}
                  disabled={shipOrStockBlocked}
                  className={`w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 ${
                    shipOrStockBlocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Add to Basket
                </button>

                <button
                  type="button"
                  onMouseDown={() => pm.markBNPLClick(product.slug, { source: 'pdp' })}
                  onClick={() => {}}
                  aria-pressed={false}
                  title="Pay later (coming soon)"
                  disabled
                  className="w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  BNPL
                </button>

                <button
                  type="button"
                  onMouseDown={() =>
                    pm.markWishlistToggle(product.slug, !isWishlisted, { source: 'pdp' })
                  }
                  onClick={handleToggleWishlist}
                  aria-pressed={!!isWishlisted}
                  aria-label={isWishlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  title={isWishlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  data-testid="wishlist-cta"
                  disabled={loading}
                  className="w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  {loading ? (
                    <div className="flex space-x-2 justify-center items-center h-6">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-150" />
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-300" />
                    </div>
                  ) : (
                    <>
                      {isWishlisted ? <FaHeart className="w-5 h-5 text-violet-700" /> : <FaRegHeart className="w-5 h-5" />}
                      <span>{isWishlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                    </>
                  )}
                </button>
              </div>

              {canShowPhone && (
                <ContactSellerCard
                  productSlug={product?.slug}
                  canShowPhone={canShowPhone}
                  unavailableText={contactReasonText(gate?.reason, gate?.allowed)}
                  verified={isVerifiedSeller}
                  rawDisplay={rawDisplay}
                  telDigits={telDigits}
                  waLink={waLink}
                  maskPhone={maskPhone}
                  contactRevealed={contactRevealed}
                  setContactRevealed={(v) => {
                    setContactRevealed(v);
                    if (v) fireContactOnce();
                  }}
                  copyToClipboard={copyToClipboard}
                  copied={copied}
                  onWhatsApp={fireContactOnce}
                  onCall={fireContactOnce}
                  isLoggedIn={!!token}
                  signinUrl="/login"
                  onBuySafely={handleDirectBuyNow}
                />
              )}

              <PaymentDeliveryReturns
                secondaryData={product?.secondary_data}
                dispatchTime={product?.dispatch_time_in_days}
                seller_payment_terms={product?.seller_payment_terms}
              />
            </section>

            <DetailsTabs
              specificsContent={
                <>
                  <p>
                    <b>Seller location:</b> {user?.town || '—'} — {user?.country || '—'}
                  </p>
                  <p>
                    <b>Condition:</b> {product?.condition?.name || '—'}
                  </p>
                </>
              }
              descriptionHtml={descriptionHtml}
            />

            {/* Reviews (standalone) */}
            {reviewStats?.review_count > 0 && (
              <section id="reviews" className="mt-8">
                <h2 className="sr-only">Customer reviews</h2>
                <DisplayReviews product={product} />
              </section>
            )}
          </div>

          {/* RIGHT (sticky) */}
          <aside className="order-2 hidden xl:block xl:col-span-5 pl-8">
            <div className="sticky top-0 p-5 px-0 space-y-4">
              {((currentUser?.username && currentUser?.username === user?.username) ||
                currentUser?.admin) && (
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/products/edit/${product?.slug}`}
                    className="flex items-center gap-1 text-sm hover:underline"
                  >
                    <FaEdit /> Edit
                  </Link>
                  {currentUser?.admin && (
                    <>
                      <button onClick={handleDelete} className="flex items-center gap-1 text-sm hover:underline">
                        <FaTrash /> Delete
                      </button>
                      <button
                        onClick={handleUnpublish}
                        disabled={!is_published}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <FaEyeSlash /> Unpublish
                      </button>
                    </>
                  )}
                </div>
              )}

              {currentUser?.admin && (
                <div className="flex items-center gap-4 text-sm">
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <FaEnvelope /> <a href={`mailto:${user.email}`}>{user.email}</a>
                    </span>
                  )}
                  {user?.phone_number && (
                    <span className="flex items-center gap-1">
                      <FaWhatsapp /> <a href={`https://wa.me/${user.phone_number}`}>{user.phone_number}</a>
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                  {title}
                </h1>
                <SellerCard
                  shop={shop}
                  user={user}
                  secondaryData={product?.secondary_data}
                  reviewStats={reviewStats}
                />
              </div>

              {canShowPhone && (
                <ContactSellerCard
                  productSlug={product?.slug}
                  canShowPhone={canShowPhone}
                  unavailableText={contactReasonText(gate?.reason, gate?.allowed)}
                  verified={isVerifiedSeller}
                  rawDisplay={rawDisplay}
                  telDigits={telDigits}
                  waLink={waLink}
                  maskPhone={maskPhone}
                  contactRevealed={contactRevealed}
                  setContactRevealed={(v) => {
                    setContactRevealed(v);
                    if (v) fireContactOnce();
                  }}
                  copyToClipboard={copyToClipboard}
                  copied={copied}
                  onWhatsApp={fireContactOnce}
                  onCall={fireContactOnce}
                  isLoggedIn={!!token}
                  signinUrl="/login"
                  onBuySafely={handleDirectBuyNow}
                />
              )}

              <div className="rounded-xl p-4 border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-slate-900">
                {showCountdown && (
                  <section
                    className="mb-3 rounded-xl border border-orange-200/70 bg-gradient-to-r from-orange-50 to-amber-50
                               dark:from-orange-900/20 dark:to-amber-900/10 ring-1 ring-orange-200/60 dark:ring-orange-800/40 p-3"
                    aria-label="Limited-time deal"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-orange-900 dark:text-orange-100">
                        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full
                                        bg-orange-100 dark:bg-orange-900/40">
                          <span className="absolute inline-flex h-full w-full rounded-full animate-ping
                                           opacity-20 bg-orange-300 dark:bg-orange-600
                                           motion-reduce:hidden" />
                          ⏳
                        </span>
                        Limited-time deal
                      </span>

                      <time
                        dateTime={product?.sale_end_date}
                        className="font-mono tabular-nums text-xs font-extrabold text-orange-900 dark:text-orange-50"
                        aria-live="off"
                      >
                        {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                      </time>
                    </div>

                    {product?.sale_start_date && product?.sale_end_date && (
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-orange-100 dark:bg-orange-950/40">
                        <div
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(Math.min(100, Math.max(0, saleProgressPct)))}
                          className="h-full bg-orange-400 dark:bg-orange-500 transition-[width] duration-1000"
                          style={{ width: `${Math.min(100, Math.max(0, saleProgressPct))}%` }}
                        />
                      </div>
                    )}
                  </section>
                )}

                {variants?.map((variant) =>
                  variant.values?.length ? (
                    <div key={variant.id} className="mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {variant.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variant.values.map((val) => {
                          const nextSel = { ...selectedVariants, [variant.id]: val };
                          const nextIds = Object.values(nextSel).map((v) => v.id);
                          const disabled = !containsSubset(nextIds);
                          const addSellerMajor = (val.additional_price_cents || 0) / 100;

                          return (
                            <button
                              key={val.id}
                              onClick={() => !disabled && setSelectedVariants(nextSel)}
                              disabled={disabled}
                              className={`px-4 ${val.additional_price_cents === 0 && 'py-2'} border rounded-full text-sm
                                ${selectedVariants[variant.id]?.id === val.id
                                  ? 'border-black dark:border-white font-semibold'
                                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'}
                                ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              {val.value}
                              {val.additional_price_cents > 0 && (
                                <div className="text-gray-900 dark:text-gray-100 text-[10px]">
                                  +{formatAddonInDisplayCurrency(addSellerMajor)}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null
                )}

                <div className="mt-2">
                  <SimplePrice
                    symbol={priceSymbol}
                    activeAmountOnly={activeAmountOnly}
                    originalAmountOnly={originalAmountOnly}
                    saleActive={saleActive}
                    postageCents={shipPreview.minFeeCents}
                    postageSymbol={postageSymbol}
                    shipAvailable={shipPreview.available}
                  />
                  {saleActive && originalAmountOnly && (
                    <div className="mt-1 text-xs text-green-700 dark:text-green-300">
                      You save <strong>{priceSymbol}{amountOnly(savedDisplayMajor, pricing.display.currency)}</strong>
                      {typeof discountPct === 'number' ? ` (${discountPct}% off)` : null}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>
                      {shipPreview.method && shipPreview.minFeeCents !== null
                        ? <>via <strong>{shipPreview.method}</strong></>
                        : <>Shipping fees shown at checkout</>}
                    </span>
                    <button
                      type="button"
                      onClick={openLocaleSheetSafe}
                      className="inline-flex items-center gap-1 text-[var(--violet-600,#7c3aed)] hover:underline"
                    >
                      <FaMapMarkerAlt aria-hidden /> Change location
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {outOfStock ? 'Out of stock' : 'In stock'}
                </span>
                <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black dark:hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300 dark:border-gray-700 text-lg font-medium" aria-live="polite">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 text-lg font-semibold text-gray-500 hover:text-black dark:hover:text-white"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <MultiBuySection
                product={product}
                onTierSelect={handleTierSelect}
                selectedTier={selectedMultiBuyTier}
              />

              <div className="mt-2 space-y-2">
                <button
                  className={`w-full rounded-full py-3 font-semibold bg-[var(--violet-600,#7c3aed)] text-white hover:bg-[var(--violet-700,#6d28d9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-500 ${
                    shipOrStockBlocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleDirectBuyNow}
                  disabled={shipOrStockBlocked}
                >
                  Buy Now (SafePay)
                </button>

                <button
                  type="button"
                  onClick={handleAddToBasket}
                  disabled={shipOrStockBlocked}
                  className={`w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 ${
                    shipOrStockBlocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Add to Basket
                </button>

                <button
                  type="button"
                  onMouseDown={() => pm.markBNPLClick(product.slug, { source: 'pdp' })}
                  onClick={() => {}}
                  aria-pressed={false}
                  title="Pay later (coming soon)"
                  disabled
                  className="w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  BNPL
                </button>

                <button
                  type="button"
                  onMouseDown={() =>
                    pm.markWishlistToggle(product.slug, !isWishlisted, { source: 'pdp' })
                  }
                  onClick={handleToggleWishlist}
                  aria-pressed={!!isWishlisted}
                  aria-label={isWishlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  title={isWishlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  data-testid="wishlist-cta"
                  disabled={loading}
                  className="w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  {loading ? (
                    <div className="flex space-x-2 justify-center items-center h-6">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-150" />
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-300" />
                    </div>
                  ) : (
                    <>
                      {isWishlisted ? (
                        <FaHeart className="w-5 h-5 text-violet-700" />
                      ) : (
                        <FaRegHeart className="w-5 h-5" />
                      )}
                      <span>{isWishlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                    </>
                  )}
                </button>
              </div>

              <PaymentDeliveryReturns
                secondaryData={product?.secondary_data}
                dispatchTime={product?.dispatch_time_in_days}
                seller_payment_terms={product?.seller_payment_terms}
              />
            </div>
          </aside>

          <BasketSheet
            isOpen={isModalVisible}
            onClose={handleCloseModal}
            basket={basket}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveProduct}
            onUndoRemove={(item) => dispatch({ type: 'basket/addToBasket', payload: item })}
            relatedProducts={relatedProducts}
            onAddSuggested={(item) => {
              const raw =
                item.__resolved_image ||
                item.image_url ||
                item.image?.[0]?.image_url ||
                item.image_objects?.[0]?.url ||
                item.thumbnail ||
                pickProductImage(item);

              const img = fixImageUrl(raw);

              const price_cents =
                typeof item.sale_price_cents === 'number'
                  ? item.sale_price_cents
                  : typeof item.price_cents === 'number'
                  ? item.price_cents
                  : Math.round(Number(item.price_major || 0) * 100);

              dispatch({
                type: 'basket/addToBasket',
                payload: {
                  id: item.id,
                  title: item.title,
                  price_cents,
                  quantity: 1,
                  sku: item.sku,
                  __resolved_image: img,
                  image: [{ image_url: img }],
                },
              });
            }}
          />
        </div>
      </div>

      {/* New Address Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-lg relative">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close add address dialog"
            >
              <AiOutlineClose size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
            <Formik
              initialValues={{ full_name: '', street: '', city: '', state: '', zip_code: '', country: '' }}
              validationSchema={Yup.object().shape({
                full_name: Yup.string().required('Required'),
                street: Yup.string().required('Required'),
                city: Yup.string().required('Required'),
                state: Yup.string().required('Required'),
                zip_code: Yup.string().required('Required'),
                country: Yup.string().required('Required'),
              })}
              onSubmit={handleNewAddressSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-6">
                  {[
                    { name: 'full_name', label: 'Full Name' },
                    { name: 'street', label: 'Street' },
                    { name: 'city', label: 'City' },
                    { name: 'state', label: 'State' },
                    { name: 'zip_code', label: 'Zip Code' },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {f.label}
                      </label>
                      <Field
                        name={f.name}
                        className="mt-1 block w-full border-b border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:outline-none py-3 bg-transparent"
                      />
                      <ErrorMessage name={f.name} component="p" className="text-red-500 text-sm mt-1" />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country
                    </label>
                    <CountryDropdown
                      value={values.country}
                      onChange={(val) => setFieldValue('country', val)}
                      defaultOptionLabel="Select Country"
                      className="mt-1 block w-full border-b border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:outline-none py-3 bg-transparent"
                    />
                    <ErrorMessage name="country" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg font-semibold bg-[var(--violet-600,#7c3aed)] text-white hover:bg-[var(--violet-700,#6d28d9)]"
                  >
                    {isSubmitting ? (
                      <div className="flex space-x-2 justify-center py-1.5">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
                      </div>
                    ) : (
                      'Save Address'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Direct Buy */}
      {isDirectBuyPopupVisible && (
        <DirectBuyPopup
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          isAddressLoading={isAddressLoading}
          addresses={addresses}
          quantity={quantity}
          product={product}
          isVisible={isDirectBuyPopupVisible}
          onClose={() => setIsDirectBuyPopupVisible(false)}
        />
      )}

      <StickyPriceBar
        symbol={priceSymbol}
        activePrice={activeAmountOnly}
        onBuyNow={() => handleDirectBuyNow('sticky_bar')}
      />
    </section>
  );
}
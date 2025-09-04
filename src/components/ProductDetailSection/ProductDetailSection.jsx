// components/ProductDetailSection/ProductDetailSection.jsx
'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';

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

/** 💸 Simple price/delivery block (receives final, pre-formatted values) */
import SimplePrice from '@/components/SimplePrice';

import {
  fetchReviewsStart, fetchReviewsSuccess, fetchReviewsFailure,
} from '@/app/store/slices/reviewsSlice';
import { BASE_API_URL } from '@/app/constants';
import { getCleanToken } from '@/lib/getCleanToken';
import { canDisplaySellerContact, pickShopPhone, whatsappUrl } from '@/lib/seller-contact';
import { fixImageUrl, FALLBACK_IMAGE } from '@/lib/image';

/** i18n / FX */
import { useLocalization } from '@/contexts/LocalizationProvider';

/** Minimal, one-shot pricing (prevents double FX) */
import { buildPricing as buildPricingMini, symbolFor } from '@/lib/pricing-mini';

/** Keep links under the current market */
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
    const m = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/[-.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)')
    );
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

/* Try to open the Region & Preferences sheet in the header (no coupling) */
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
function RelatedThumb({ item, alt }) {
  const candidate = React.useMemo(() => resolveRelatedImage(item), [item]);
  React.useEffect(() => {
    if (DEBUG)
      console.info('[related item]', { id: item?.id, picked: candidate, raw: item });
  }, [item, candidate]);
  const [broken, setBroken] = React.useState(false);
  const src = broken ? FALLBACK_IMAGE : candidate;
  return (
    <div className="relative w-full h-40">
      <Image
        key={src}
        src={src}
        alt={alt || 'Product image'}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={80}
        onError={() => setBroken(true)}
      />
    </div>
  );
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
  const url = `${BASE_API_URL}/api/products/${slug}/event/`;
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
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: payload,
    });
  } catch {}
}

/* ---------------- PDP ---------------- */
export default function ProductDetailSection({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = usePathname();

  // i18n / FX from provider
  const { country: uiCountry, currency: uiCurrency, price: conv, resolvedLanguage } =
    useLocalization();

  // Safeguarded one-shot converter (prevents double/inverted FX)
  const convSafe = useCallback(
    (amount, fromCurrency) => {
      if (amount == null) return null;
      if (!conv || !uiCurrency || uiCurrency === fromCurrency) return amount;
      try {
        const out = Number(conv(amount, fromCurrency));
        if (!Number.isFinite(out) || out <= 0) return amount;
        const ratio = out / amount;
        if (ratio > 10 || ratio < 0.1) return amount; // block obviously wrong FX
        return out;
      } catch {
        return amount;
      }
    },
    [conv, uiCurrency]
  );

  // amount-only formatter for arbitrary currency (used for add-ons)
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
    id, title, price_cents, sale_price_cents, postage_fee_cents, sale_end_date,
    product_images, shop, user, variants, is_published
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

  /* Related products (uses uiCountry) */
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    if (!product?.slug || !uiCountry) return;

    const parseSlug = (slug) => {
      const parts = slug.split('-');
      if (parts.length < 3) return { base_slug: slug, condition: '', city: '' };
      const city = parts.slice(-2).join('-');
      const condition = parts[parts.length - 3];
      const base_slug = parts.slice(0, parts.length - 3).join('-');
      return { base_slug, condition, city };
    };

    const { base_slug, condition: cond, city } = parseSlug(product.slug);
    const countryCode = uiCountry || 'gh';
    const finalSlug = `${base_slug}-${cond}-${city}`;
    const apiUrl = `${BASE_API_URL}/api/${countryCode}/${finalSlug}/related/`;

    (async () => {
      try {
        const t = getCleanToken();
        const res = await fetch(apiUrl, {
          headers: t ? { Authorization: `Token ${t}` } : {},
        });
        if (!res.ok) return;
        const data = await res.json();
        setRelatedProducts(data.results || []);
      } catch {}
    })();
  }, [product?.slug, uiCountry]);

  /* Reviews summary */
  const [reviewStats, setReviewStats] = useState({
    average_rating: 0,
    review_count: 0,
  });
  useEffect(() => {
    if (!product?.id) return;
    const t = getCleanToken();
    fetch(`${BASE_API_URL}/api/product/${product.id}/reviews/`, {
      headers: t ? { Authorization: `Token ${t}` } : {},
    })
      .then(async (r) => (r.ok ? r.json() : null))
      .then(
        (d) =>
          d &&
          setReviewStats({
            average_rating: d.average_rating || 0,
            review_count: d.review_count || 0,
          })
      )
      .catch(() => {});
  }, [product?.id]);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchReviewsStart());
    const url = `${BASE_API_URL}/api/product/${id}/reviews/`;
    let cancelled = false;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (cancelled) return;
        const results = d.results ?? d.reviews ?? [];
        dispatch(
          fetchReviewsSuccess({
            results,
            average_rating: d.average_rating ?? 0,
            review_count: d.review_count ?? results.length,
            rating_percent: d.rating_percent ?? {},
          })
        );
      })
      .catch((err) => {
        if (!cancelled) dispatch(fetchReviewsFailure(err.message || String(err)));
      });
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

  // ---- Pricing (minimal, safe FX) ----
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
  const activePrice = pricing.display.activeAmountOnly;
  const originalPrice = pricing.display.originalAmountOnly;

  // ---- Shipping preview (min fee + availability) ----
  const [shipPreview, setShipPreview] = useState({
    available: null, // true | false | null (unknown)
    minFeeCents: null, // number | null (seller cents)
    currency: pricing.sellerCurrency || 'USD', // fee currency (seller)
    method: null, // optional label
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPreview() {
      if (!product?.id) return;

      const cc = uiCountry || 'gh';
      const city = typeof document !== 'undefined' ? readCookie(`deliver_to_${cc}`) || '' : '';

      const urls = [
        `${BASE_API_URL}/api/products/${product.id}/shipping/preview/?cc=${encodeURIComponent(
          cc
        )}&city=${encodeURIComponent(city)}`,
        shop?.slug
          ? `${BASE_API_URL}/api/shops/${shop.slug}/shipping/preview/?cc=${encodeURIComponent(
              cc
            )}&city=${encodeURIComponent(city)}`
          : null,
      ].filter(Boolean);

      let ok = false;
      for (const u of urls) {
        try {
          const t = getCleanToken();
          const res = await fetch(u, { headers: t ? { Authorization: `Token ${t}` } : {} });
          if (!res.ok) continue;
          const d = await res.json();

          // expected: { available:boolean, currency:"GHS", options:[{enabled:true, method, fee_cents}] }
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
        } catch {
          /* try next url */
        }
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

  // Optional countdown (uses product.sale_end_date)
  const [timeRemaining, setTimeRemaining] = useState(null);
  useEffect(() => {
    if (!sale_end_date || !saleActive) {
      setTimeRemaining(null);
      return;
    }
    const end = new Date(sale_end_date);
    const tick = () => {
      const diff = end.getTime() - Date.now();
      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [sale_end_date, saleActive]);

  /* Wishlist */
  const handleToggleWishlist = async () => {
    if (!token) {
      router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
      return;
    }
    setLoading(true);
    const url = `${BASE_API_URL}/api/wishlist/${id}/`;
    try {
      if (isWishlisted) {
        await fetch(url, { method: 'DELETE', headers: { Authorization: `Token ${token}` } });
        setIsWishlisted(false);
      } else {
        await fetch(`${BASE_API_URL}/api/wishlist/`, {
          method: 'POST',
          headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: id, note: '' }),
        });
        setIsWishlisted(true);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  /* Admin actions */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`${BASE_API_URL}/api/products/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    });
    router.back();
  };
  const handleUnpublish = async () => {
    await fetch(`${BASE_API_URL}/api/products/${id}/unpublish/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
    });
    router.refresh?.();
  };

  // Additional price cents for basket calc (server currency minor units)
  const totalAdditionalCents = useMemo(
    () =>
      Object.values(selectedVariants).reduce((s, v) => s + (v.additional_price_cents || 0), 0),
    [selectedVariants]
  );

  /* Basket */
  const handleAddToBasket = () => {
    if (shipBlocked) return; // guard
    const priceCentsForBasket =
      price_cents || sale_price_cents
        ? saleActive
          ? Math.round((sale_price_cents || 0) + (totalAdditionalCents || 0))
          : Math.round((price_cents || 0) + (totalAdditionalCents || 0))
        : Math.round(pricing.seller.activeMajor * 100) + Math.round(totalAdditionalCents || 0);

    dispatch({
      type: 'basket/addToBasket',
      payload: {
        id,
        title,
        price_cents: priceCentsForBasket,
        quantity,
        image: product_images,
        postage_fee: product?.postage_fee_cents || 0,
        secondary_postage_fee: product?.secondary_postage_fee_cents || 0,
        variants: selectedVariants,
        sku:
          'SKU-' +
          Object.values(selectedVariants)
            .map((o) => o.value.replace(/\s+/g, '-').toUpperCase())
            .join('-'),
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

  /* Addresses */
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
        const t = getCleanToken();
        if (!t) {
          setAddresses([]);
          return;
        }
        const res = await fetch(`${BASE_API_URL}/api/addresses/`, {
          headers: { Authorization: `Token ${t}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
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
        if (cancelled) return;
        setAddresses(opts);
        const defaultRow = rows.find((r) => r.default);
        setSelectedAddressId(defaultRow?.id ?? opts[0]?.id ?? null);
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
      const res = await fetch(`${BASE_API_URL}/api/addresses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
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
        }),
      });
      const json = await res.json();
      setAddresses((prev) => [
        ...prev,
        {
          id: json.id,
          value: `${json.address_data.street}, ${json.address_data.city}, ${json.address_data.country}`,
        },
      ]);
      setSelectedAddressId(json.id);
      resetForm();
      setShowNewModal(false);
      setIsDirectBuyPopupVisible(true);
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const handleDirectBuyNow = () => {
    if (!token) {
      router.push(`/signin?next=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (isAddressLoading || shipBlocked) return;
    if (addresses.length > 0) setIsDirectBuyPopupVisible(true);
    else setShowNewModal(true);
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

  // helper to print variant add-on in the same display currency as the main price
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

  /* Build a market-prefixed href for related items (keeps /{cc}/...) */
  const relatedHref = useCallback(
    (seoSlug) => {
      const clean = String(seoSlug || '').replace(/^\/?[a-z]{2}\//i, '');
      return withCountryPrefix(uiCountry || 'gh', `/${clean}`);
    },
    [uiCountry]
  );

  /* Render */
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

            <div className="block md:hidden relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              <ProductSlider mediaItems={product.product_images} />
            </div>
            <div className="hidden md:block">
              <ProductSlider mediaItems={product.product_images} />
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
                {/* Sale countdown chip */}
                {saleActive && timeRemaining && (
                  <div
                    className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-200"
                    aria-live="polite"
                  >
                    ⏳ Sale ends in {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                  </div>
                )}
                <SimplePrice
                  symbol={pricing.display.symbol}
                  activeAmountOnly={activePrice}
                  originalAmountOnly={originalPrice}
                  saleActive={saleActive}
                  /* shipping preview (postage always seller currency) */
                  postageCents={shipPreview.minFeeCents}
                  postageSymbol={postageSymbol}
                  shipAvailable={shipPreview.available}
                />
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
                  disabled={shipBlocked}
                  className={`w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 ${
                    shipBlocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Add to Basket
                </button>

                <button
                  type="button"
                  disabled={shipBlocked}
                  className={`w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 ${
                    shipBlocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Buy Now Pay Later (BNPL)
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={loading}
                  aria-pressed={!!isWishlisted}
                  className="w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  {loading ? '…' : isWishlisted ? '💜 Remove from Watchlist' : '♡ Add to Watchlist'}
                </button>
              </div>

              {canShowPhone && (
                <ContactSellerCard
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
              reviewsNode={<DisplayReviews product={product} />}
              reviewMeta={{ review_count: product?.secondary_data?.reviews_count }}
            />

            {relatedProducts.length > 0 && (
              <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Items related to this {title}
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {relatedProducts.map((p) => {
                    const relPricing = buildPricingMini(p, {
                      uiCurrency,
                      locale: resolvedLanguage || 'en',
                      conv: convSafe,
                    });
                    const relSymbol = relPricing.display.symbol;
                    const relActive = relPricing.display.activeAmountOnly;
                    return (
                      <Link
                        key={p.id}
                        href={relatedHref(p.seo_slug)}
                        className="block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-slate-900"
                      >
                        <RelatedThumb item={p} alt={p.title} />
                        <div className="p-2">
                          <h3 className="text-sm font-semibold line-clamp-2">{p.title}</h3>
                          {relActive ? (
                            <span className="text-green-700 dark:text-green-400 font-bold">
                              {relSymbol}
                              {relActive}
                            </span>
                          ) : (
                            <span className="text-gray-500">Ask for price</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
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
                  canShowPhone={canShowPhone}
                  unavailableText={contactReasonText(gate?.reason, gate?.allowed)}
                  verified={!!phoneToShow?.is_verified}
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
                />
              )}

              <div className="rounded-xl p-4 border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-slate-900">
                {/* Sale countdown chip (desktop) */}
                {saleActive && timeRemaining && (
                  <div
                    className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-200"
                    aria-live="polite"
                  >
                    ⏳ Sale ends in {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                  </div>
                )}
                {variants?.map((variant) =>
                  variant.values?.length ? (
                    <div key={variant.id} className="mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {variant.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variant.values.map((val) => {
                          const addSellerMajor = (val.additional_price_cents || 0) / 100;
                          return (
                            <button
                              key={val.id}
                              onClick={() =>
                                setSelectedVariants((prev) => ({ ...prev, [variant.id]: val }))
                              }
                              className={`px-4 ${val.additional_price_cents === 0 && 'py-2'} border rounded-full text-sm ${
                                selectedVariants[variant.id]?.id === val.id
                                  ? 'border-black dark:border-white font-semibold'
                                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                              }`}
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
                    symbol={pricing.display.symbol}
                    activeAmountOnly={activePrice}
                    originalAmountOnly={originalPrice}
                    saleActive={saleActive}
                    postageCents={shipPreview.minFeeCents}
                    postageSymbol={postageSymbol}
                    shipAvailable={shipPreview.available}
                  />
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
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">In stock</span>
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
                    shipBlocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleDirectBuyNow}
                  disabled={shipBlocked}
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={handleAddToBasket}
                  disabled={shipBlocked}
                  className={`w-full rounded-full py-2.5 font-medium border border-neutral-300 text-slate-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 ${
                    shipBlocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Add to Basket
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-pressed={!!isWishlisted}
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
      {isDirectBuyPopupVisible && addresses.length > 0 && (
        <DirectBuyPopup
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          isAddressLoading={isAddressLoading}
          addresses={addresses}
          relatedProducts={relatedProducts}
          quantity={quantity}
          product={product}
          isVisible={isDirectBuyPopupVisible}
          onClose={() => setIsDirectBuyPopupVisible(false)}
        />
      )}

      <StickyPriceBar symbol={priceSymbol} activePrice={activePrice} onBuyNow={handleDirectBuyNow} />
    </section>
  );
}
// components/BasketSheet.mobile.jsx
'use client';

import React, { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiXMark, HiPlus, HiMinus, HiTrash } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { selectSelectedCountry } from '@/app/store/slices/countrySlice';
import SafeImage, { fixDisplayUrl } from '@/components/common/SafeImage';
import { pickProductImage, FALLBACK_IMAGE } from '@/lib/image';
import { useLocalization } from '@/contexts/LocalizationProvider';
import { symbolFor } from '@/lib/pricing-mini';

/* ───────────────── image helpers (unchanged) ───────────────── */
const getDisplayUrl = (raw) =>
  (typeof raw === 'string' && raw.trim() ? fixDisplayUrl(raw) : FALLBACK_IMAGE) || FALLBACK_IMAGE;

const pickFromMediaList = (list) => {
  for (const it of list || []) {
    if (!it) continue;
    if (typeof it === 'string' && it.trim()) return it;
    const u = it.image_url || it.url || it.src || it.secure_url || it.path || it.thumbnail || it.image;
    if (typeof u === 'string' && u.trim()) return u;
  }
  return null;
};

const imageOfCartItem = (p) =>
  getDisplayUrl(
    p?.__resolved_image ||
      p?.image?.[0]?.image_url ||
      p?.image?.[0]?.url ||
      p?.image_url ||
      p?.thumbnail ||
      p?.image ||
      pickProductImage(p) ||
      FALLBACK_IMAGE
  );

const imageOfSuggested = (p) => {
  let raw =
    p?.card_image ||
    p?.card_image_url ||
    p?.thumbnail ||
    p?.image_url ||
    (typeof p?.image === 'string' ? p.image : '') ||
    (typeof p?.main_image === 'string' ? p.main_image : '') ||
    (typeof p?.product_image === 'string' ? p.product_image : '') ||
    (typeof p?.product_image_url === 'string' ? p.product_image_url : '');
  if (!raw) {
    raw =
      pickFromMediaList(p?.image) ||
      pickFromMediaList(p?.images) ||
      pickFromMediaList(p?.gallery) ||
      pickFromMediaList(p?.photos) ||
      pickFromMediaList(p?.media) ||
      pickFromMediaList(p?.assets) ||
      pickFromMediaList(p?.thumbnails) ||
      pickFromMediaList(p?.product_images) ||
      pickFromMediaList(p?.image_objects) ||
      pickFromMediaList(p?.imageObjects);
  }
  return getDisplayUrl(raw || pickProductImage(p) || FALLBACK_IMAGE);
};

/* ───────────────── currency helpers (unchanged) ───────────────── */
const centsOf = (item) =>
  Number(
    item?.sale_price_cents ??
      item?.price_cents ??
      (typeof item?.price_major === 'number' ? Math.round(item.price_major * 100) : 0)
  );

export default function BasketSheet({
  isOpen = false,
  open = undefined,
  onClose,
  basket = [],
  onQuantityChange,
  onRemove,
  onUndoRemove,
  relatedProducts = [],
  onAddSuggested,
}) {
  const actuallyOpen = open ?? isOpen;
  const router = useRouter();
  const titleId = useId();
  const panelRef = useRef(null);
  const scrollerRef = useRef(null);
  const activeBeforeOpenRef = useRef(null);

  const selectedCountry = useSelector(selectSelectedCountry);
  const { currency: uiCurrency, convert, resolvedLanguage } = useLocalization();
  const symbol =
    symbolFor(uiCurrency || 'USD', resolvedLanguage || 'en') || selectedCountry?.symbol || '₵';

  const convMajorSafe = useCallback(
    (major, fromCcy) => {
      const n = Number(major || 0);
      const src = (fromCcy || uiCurrency || 'USD').toUpperCase();
      const dst = (uiCurrency || src).toUpperCase();
      if (!convert || src === dst) return n;
      const out = Number(convert(n, src, dst));
      return Number.isFinite(out) && out >= 0 ? out : n;
    },
    [convert, uiCurrency]
  );

  const currencyOf = (p) =>
    String(
      p?.price_currency ??
        p?.currency ??
        p?.seller_currency ??
        p?.sellerCurrency ??
        p?.listing_currency ??
        p?.ccy ??
        uiCurrency ??
        'USD'
    ).toUpperCase();

  const computeUnitPriceUI = useCallback(
    (p) => {
      const now = new Date();
      const onSale = Number(p?.sale_price_cents) > 0 && (!p?.sale_end_date || new Date(p.sale_end_date) > now);
      const cents = Number(onSale ? p?.sale_price_cents : p?.price_cents);
      const majorSeller = (Number.isFinite(cents) ? cents : 0) / 100;
      return convMajorSafe(majorSeller, currencyOf(p));
    },
    [convMajorSafe]
  );

  /* ───────────────── state & lifecycle ───────────────── */
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isViewBasketLoading, setIsViewBasketLoading] = useState(false);
  const [liveMsg, setLiveMsg] = useState('');
  const [toast, setToast] = useState(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  // Prevent background scroll + restore focus
  useEffect(() => {
    if (actuallyOpen) {
      activeBeforeOpenRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const id = setTimeout(() => panelRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
    document.body.style.overflow = '';
    activeBeforeOpenRef.current instanceof HTMLElement && activeBeforeOpenRef.current.focus?.();
    return () => (document.body.style.overflow = '');
  }, [actuallyOpen]);

  // Scroll cues
  useEffect(() => {
    if (!actuallyOpen) return;
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      setAtTop(el.scrollTop <= 2);
      setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight <= 2);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [actuallyOpen]);

  // Esc to close
  useEffect(() => {
    if (!actuallyOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actuallyOpen, onClose]);

  /* ───────────────── actions ───────────────── */
  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    router.push('/checkout');
  };
  const handleViewBasket = () => {
    setIsViewBasketLoading(true);
    router.push('/cart');
  };

  // Debounce quantity updates so we don’t spam the server
  const qtyTimer = useRef(null);
  const updateQty = useCallback((payload) => {
    window.clearTimeout(qtyTimer.current);
    qtyTimer.current = window.setTimeout(() => onQuantityChange?.(payload), 120);
  }, [onQuantityChange]);

  const inc = (p) => {
    navigator.vibrate?.(10);
    const next = Math.max(1, (p.quantity || 1) + 1);
    updateQty({ id: p.id, sku: p.sku ?? null, quantity: next });
    setLiveMsg(`Increased quantity of ${p.title}`);
  };
  const dec = (p) => {
    const current = p.quantity || 1;
    if (current <= 1) return;
    navigator.vibrate?.(10);
    updateQty({ id: p.id, sku: p.sku ?? null, quantity: current - 1 });
    setLiveMsg(`Decreased quantity of ${p.title}`);
  };

  const doRemove = (p) => {
    onRemove?.({ id: p.id, sku: p.sku });
    setToast({ title: p.title, item: p });
    setLiveMsg(`Removed ${p.title} from basket`);
    setTimeout(() => setToast(null), 5000);
  };
  const undoRemove = () => {
    toast?.item && onUndoRemove?.(toast.item);
    setToast(null);
  };

  /* ───────────────── derived ───────────────── */
  const subtotal = useMemo(
    () => (basket || []).reduce((s, p) => s + computeUnitPriceUI(p) * (p.quantity || 1), 0),
    [basket, computeUnitPriceUI]
  );
  const titleText = useMemo(() => {
    const n = basket?.length ?? 0;
    return `${n} Item${n === 1 ? '' : 's'} in your basket`;
  }, [basket]);
  const onBackdrop = (e) => e.target === e.currentTarget && onClose?.();

  /* ───────────────── memoized rows ───────────────── */
  const LineItem = memo(function LineItem({ product }) {
    const qty = product.quantity || 1;
    const img = imageOfCartItem(product);
    const unit = computeUnitPriceUI(product);
    const lineTotal = unit * qty;

    return (
      <li
        className="flex items-stretch gap-4 py-3 [content-visibility:auto] [contain-intrinsic-size:140px]"
        role="group"
        aria-label={product.title}
      >
        <div className="w-[84px] h-[84px] flex-shrink-0">
          <SafeImage
            src={img}
            alt={product.title || 'Product'}
            width={84}
            height={84}
            sizes="84px"
            className="h-full w-full object-cover rounded-lg bg-neutral-100 dark:bg-neutral-800"
            loading="lazy"
            quality={70}
          />
        </div>

        <div className="flex-1 min-w-0">
          {product.sku && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">SKU: {product.sku}</p>
          )}
          <p className="text-[13.5px] sm:text-sm font-semibold line-clamp-2">{product.title}</p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-11 w-11 grid place-items-center border border-neutral-300 dark:border-neutral-700 rounded-md disabled:opacity-50"
                onClick={() => dec(product)}
                disabled={qty <= 1}
                aria-label={`Decrease quantity of ${product.title}`}
              >
                <HiMinus className="h-4 w-4" />
              </button>
              <span className="w-7 text-center text-sm font-medium tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="h-11 w-11 grid place-items-center border border-neutral-300 dark:border-neutral-700 rounded-md"
                onClick={() => inc(product)}
                aria-label={`Increase quantity of ${product.title}`}
              >
                <HiPlus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-sm font-extrabold whitespace-nowrap">{symbol}{lineTotal.toFixed(2)}</div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => doRemove(product)}
              className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
            >
              <HiTrash className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      </li>
    );
  }, (a, b) => {
    const pa = a.product, pb = b.product;
    return pa.id === pb.id && pa.sku === pb.sku && pa.quantity === pb.quantity &&
      centsOf(pa) === centsOf(pb);
  });

  const SuggestCard = memo(function SuggestCard({ item, onAdd, onView }) {
    const img = imageOfSuggested(item);
    const cents = centsOf(item);
    const showPrice = Number.isFinite(cents) && cents > 0;
    const sellerMajor = (showPrice ? cents : 0) / 100;
    const majorUI = convMajorSafe(sellerMajor, currencyOf(item));

    return (
      <div className="flex-shrink-0 w-[148px] select-none">
        <button type="button" onClick={() => onView(item)} className="block text-left" aria-label={item.title}>
          <SafeImage
            src={img}
            alt={item.title ?? 'Product image'}
            width={148}
            height={110}
            sizes="148px"
            className="w-[148px] h-[110px] object-cover rounded-lg border bg-neutral-50 dark:bg-neutral-800"
            loading="lazy"
            quality={70}
          />
          <div className="mt-1 text-[12.5px] font-medium line-clamp-2">{item.title}</div>
        </button>

        <div className="mt-1 flex items-center justify-between">
          <div className="text-[12px] font-semibold">
            {showPrice ? `${symbol}${majorUI.toFixed(2)}` : 'Ask'}
          </div>
          <button
            type="button"
            aria-label={`Add ${item.title} to basket`}
            onClick={() => onAdd(item)}
            className="h-7 w-7 grid place-items-center rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <HiPlus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  });

  /* ───────────────── render ───────────────── */
  return (
    <div
      aria-hidden={!actuallyOpen}
      className={[
        'fixed inset-0 z-[80] md:z-[90] transition-opacity duration-200',
        actuallyOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={onBackdrop}
    >
      <div aria-live="polite" className="sr-only">{liveMsg}</div>

      {/* Backdrop */}
      <div
        className={[
          'absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity',
          actuallyOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={panelRef}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[720px] outline-none"
      >
        <div
          className={[
            'mx-auto w-full bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl',
            'border-t border-neutral-200 dark:border-neutral-800',
            'transition-transform duration-200 will-change-transform',
          ].join(' ')}
          style={{ transform: actuallyOpen ? 'translateY(0)' : 'translateY(110%)' }}
        >
          {/* Grab handle (swipe-to-close only here → doesn’t fight with list scroll) */}
          <GrabHandle onClose={onClose} />

          {/* Header */}
          <div className="px-4 sm:px-6 pb-3 flex items-center justify-between">
            <h2 id={titleId} className="text-lg sm:text-xl font-extrabold">{titleText}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label="Close basket"
            >
              <HiXMark className="h-6 w-6" />
            </button>
          </div>

          {/* Items + Suggestions */}
          <div
            ref={scrollerRef}
            className="relative px-4 sm:px-6 max-h-[70vh] md:max-h-[72vh] overflow-y-auto pb-4 overscroll-contain"
          >
            <div
              aria-hidden="true"
              className={[
                'sticky top-0 -mt-4 h-4 bg-gradient-to-b from-white/95 dark:from-neutral-900/95 pointer-events-none z-10 transition-opacity duration-200',
                atTop ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />
            {basket?.length ? (
              <ul role="list" className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {basket.map((p) => (
                  <LineItem key={`${p.id}-${p.sku ?? ''}`} product={p} />
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
                Your basket is empty.
              </div>
            )}

            {relatedProducts?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold mb-2">You might also need</p>
                <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
                  <div className="flex gap-3 pb-1">
                    {relatedProducts.slice(0, 12).map((item) => (
                      <SuggestCard
                        key={item.id ?? item.seo_slug ?? item.slug}
                        item={item}
                        onAdd={(it) => {
                          const img = imageOfSuggested(it);
                          onAddSuggested?.({
                            ...it,
                            __resolved_image: img,
                            image: [{ image_url: img }],
                          });
                          setLiveMsg(`Added ${it?.title ?? 'item'} to basket`);
                        }}
                        onView={(it) => {
                          const slug = it?.seo_slug || it?.slug;
                          slug && router.push(`/${slug}`);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div
              aria-hidden="true"
              className={[
                'sticky bottom-0 -mb-4 h-4 bg-gradient-to-t from-white/95 dark:from-neutral-900/95 pointer-events-none z-10 transition-opacity duration-200',
                atBottom ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />
          </div>

          {/* Subtotal + CTAs (safe-area padding) */}
          {!!basket?.length && (
            <>
              <div className="px-4 sm:px-6 pb-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Subtotal ({basket.length} item{basket.length === 1 ? '' : 's'})
                  </span>
                  <span className="font-extrabold text-neutral-900 dark:text-neutral-100" aria-live="polite">
                    {symbol}{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] mt-1 text-neutral-500 dark:text-neutral-400">
                  Excluding delivery & fees
                </div>
              </div>

              <div className="px-4 sm:px-6 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-neutral-200 dark:border-neutral-800 space-y-3 bg-white dark:bg-neutral-900 rounded-b-3xl">
                <button
                  type="button"
                  onClick={handleCheckout}
                  aria-busy={isCheckoutLoading}
                  className="w-full rounded-full py-3 font-semibold bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  {isCheckoutLoading ? (
                    <Dots />
                  ) : (
                    <>Checkout • {symbol}{subtotal.toFixed(2)}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleViewBasket}
                  className="w-full rounded-full py-2.5 font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  {isViewBasketLoading ? <Dots /> : 'View Basket'}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span>🔒 Secure checkout</span>
                  <span aria-hidden>•</span>
                  <span>VISA • MasterCard • G&nbsp;Pay</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Undo toast */}
      {toast && (
        <div className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[95]">
          <div className="pointer-events-auto rounded-full bg-neutral-900 text-white px-4 py-2 text-sm shadow-lg flex items-center gap-3">
            <span className="line-clamp-1">Removed “{toast.title}”</span>
            {onUndoRemove && (
              <button type="button" onClick={undoRemove} className="font-semibold underline underline-offset-2">
                Undo
              </button>
            )}
            <button type="button" onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 ml-1" aria-label="Dismiss">
              <HiXMark className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── helpers ───────── */

function Dots() {
  return (
    <span className="inline-flex items-center gap-2 h-6">
      <span className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 bg-current rounded-full animate-bounce" />
    </span>
  );
}

// Isolated handle with swipe-down → doesn’t block list scrolling
function GrabHandle({ onClose }) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const startT = useRef(0);
  const DRAG_MAX = 240;
  const DRAG_CLOSE = 140;
  const VELOCITY_CLOSE = 1.0;

  const down = (e) => {
    setDragging(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startT.current = performance.now();
  };
  const move = (e) => {
    if (!dragging) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    let d = Math.max(0, y - startY.current);
    if (d > DRAG_MAX) d = DRAG_MAX + (d - DRAG_MAX) * 0.2;
    setDragY(d);
  };
  const up = () => {
    if (!dragging) return;
    const dur = Math.max(1, performance.now() - startT.current);
    const vel = dragY / dur;
    setDragging(false);
    setDragY(0);
    if (dragY > DRAG_CLOSE || vel > VELOCITY_CLOSE) onClose?.();
  };

  return (
    <div
      className="pt-3 pb-2 flex justify-center select-none touch-pan-x"
      style={{ transform: dragY ? `translateY(${dragY}px)` : undefined }}
      onMouseDown={down}
      onMouseMove={move}
      onMouseUp={up}
      onTouchStart={down}
      onTouchMove={move}
      onTouchEnd={up}
    >
      <span className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
    </div>
  );
}
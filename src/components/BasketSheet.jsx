// components/BasketSheet.jsx
'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiXMark, HiPlus, HiMinus } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { selectSelectedCountry } from '@/app/store/slices/countrySlice';
import { getCardImage } from '@/app/constants';
import { pickProductImage, fixImageUrl, FALLBACK_IMAGE } from '@/lib/image';

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

  /* ───────────────── image helpers (strings only, SSR-safe) ───────────────── */

  const getCardImageFn = typeof getCardImage === 'function' ? getCardImage : undefined;

  // Resolve a usable cart image (handles basket-shape + products)
  const imageOfCartItem = (p) => {
    const raw =
      p?.__resolved_image ||
      p?.image?.[0]?.image_url ||
      p?.image?.[0]?.url ||
      p?.image_url ||
      p?.thumbnail ||
      p?.image ||
      getCardImageFn?.(p) ||
      pickProductImage(p) ||
      FALLBACK_IMAGE;

    return fixImageUrl(raw);
  };

  // Resolve a usable suggested card image
  const imageOfSuggested = (p) => {
    const raw =
      getCardImageFn?.(p) ||
      p?.card_image ||
      p?.card_image_url ||
      p?.thumbnail ||
      p?.image_url ||
      p?.image ||
      pickProductImage(p) ||
      FALLBACK_IMAGE;

    return fixImageUrl(raw);
  };

  /* ───────────────────────────────────────────────────────────────────────── */

  const selectedCountry = useSelector(selectSelectedCountry);
  const symbol = selectedCountry?.symbol ?? '₵';

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isViewBasketLoading, setIsViewBasketLoading] = useState(false);

  const [liveMsg, setLiveMsg] = useState('');
  const [toast, setToast] = useState(null); // {title, item}

  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  // scroll lock + focus restore
  useEffect(() => {
    if (actuallyOpen) {
      activeBeforeOpenRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const id = setTimeout(() => panelRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
    document.body.style.overflow = '';
    if (activeBeforeOpenRef.current instanceof HTMLElement) {
      activeBeforeOpenRef.current.focus?.();
    }
    return () => (document.body.style.overflow = '');
  }, [actuallyOpen]);

  // keep cues in sync
  useEffect(() => {
    if (!actuallyOpen) return;
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const top = el.scrollTop <= 2;
      const bottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 2;
      setAtTop(top);
      setAtBottom(bottom);
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

  // Focus trap
  const onKeyDownTrap = (e) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const els = Array.from(
      panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');
    if (!els.length) return;
    const firstEl = els[0];
    const lastEl = els[els.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === firstEl || !panelRef.current.contains(active)) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  };

  // swipe to close
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const startTRef = useRef(0);

  const DRAG_MAX_PX = 240;
  const DRAG_CLOSE_PX = 140;
  const VELOCITY_CLOSE = 1.0;

  const onPointerDown = (e) => {
    setDragging(true);
    startYRef.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startTRef.current = performance.now();
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    let delta = Math.max(0, y - startYRef.current);
    if (delta > DRAG_MAX_PX) {
      const overflow = delta - DRAG_MAX_PX;
      delta = DRAG_MAX_PX + overflow * 0.2;
    }
    setDragY(delta);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    const durMs = Math.max(1, performance.now() - startTRef.current);
    const velocity = dragY / durMs;
    const shouldClose = dragY > DRAG_CLOSE_PX || velocity > VELOCITY_CLOSE;
    setDragging(false);
    setDragY(0);
    if (shouldClose) onClose?.();
  };

  // actions
  const Loader = (
    <span className="inline-flex items-center gap-2 h-6">
      <span className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 bg-current rounded-full animate-bounce" />
    </span>
  );

  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    router.push('/checkout');
  };
  const handleViewBasket = () => {
    setIsViewBasketLoading(true);
    router.push('/cart');
  };

  const computeUnitPrice = (p) => {
    const now = new Date();
    const saleEnd = p.sale_end_date ? new Date(p.sale_end_date) : null;
    const isOnSale = p.sale_price_cents > 0 && (!saleEnd || saleEnd > now);
    const cents = isOnSale ? p.sale_price_cents : p.price_cents;
    return (cents || 0) / 100;
  };

  const subtotal = useMemo(
    () => (basket || []).reduce((s, p) => s + computeUnitPrice(p) * (p.quantity || 1), 0),
    [basket]
  );

  const checkoutLabel = isCheckoutLoading ? Loader : `Checkout • ${symbol}${subtotal.toFixed(2)}`;

  const titleText = useMemo(() => {
    const n = basket?.length ?? 0;
    return `${n} Item${n === 1 ? '' : 's'} in your basket`;
  }, [basket]);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const inc = (p) => {
    navigator.vibrate?.(10);
    onQuantityChange?.(p.id, p.sku, (p.quantity || 1) + 1);
    setLiveMsg(`Increased quantity of ${p.title}`);
  };

  const dec = (p) => {
    if ((p.quantity || 1) <= 1) return;
    navigator.vibrate?.(10);
    onQuantityChange?.(p.id, p.sku, (p.quantity || 1) - 1);
    setLiveMsg(`Decreased quantity of ${p.title}`);
  };

  const doRemove = (p) => {
    onRemove?.({ id: p.id, sku: p.sku });
    setToast({ title: p.title, item: p });
    setLiveMsg(`Removed ${p.title} from basket`);
    setTimeout(() => setToast(null), 5000);
  };

  const undoRemove = () => {
    if (toast?.item && onUndoRemove) onUndoRemove(toast.item);
    setToast(null);
  };

  const priceCentsOf = (item) =>
    Number(
      item?.sale_price_cents ??
        item?.price_cents ??
        (typeof item?.price_major === 'number' ? Math.round(item.price_major * 100) : 0)
    );

  const viewSuggested = (item) => {
    const slug = item?.seo_slug || item?.slug;
    if (slug) router.push(`/${slug}`);
  };
  const addSuggested = (item) => {
    if (onAddSuggested) {
      const img = imageOfSuggested(item);
      onAddSuggested({
        ...item,
        __resolved_image: img,             // give parent a ready-to-use URL
        image: [{ image_url: img }],       // matches what the basket reads
      });
      setLiveMsg(`Added ${item?.title ?? 'item'} to basket`);
    } else {
      viewSuggested(item);
    }
  };

  return (
    <div
      aria-hidden={!actuallyOpen}
      className={[
        'fixed inset-0 z-[80] md:z-[90] transition-opacity duration-200',
        actuallyOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={onBackdrop}
    >
      {/* Live region for SR */}
      <div aria-live="polite" className="sr-only">{liveMsg}</div>

      {/* Backdrop */}
      <div
        className={[
          'absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity',
          actuallyOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* Sheet container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={panelRef}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[720px] outline-none"
        onKeyDown={onKeyDownTrap}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        <div
          className={[
            'mx-auto w-full bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl',
            'border-t border-neutral-200 dark:border-neutral-800',
            'transition-transform duration-200 will-change-transform',
          ].join(' ')}
          style={{ transform: actuallyOpen ? `translateY(${dragY}px)` : 'translateY(110%)' }}
        >
          {/* Grab handle */}
          <div
            className="pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing select-none touch-action-none"
            onMouseDown={onPointerDown}
            onTouchStart={onPointerDown}
          >
            <span className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/* Header */}
          <div className="px-4 sm:px-6 pb-3 flex items-center justify-between">
            <h2 id={titleId} className="text-lg sm:text-xl font-semibold">
              {titleText}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label="Close basket"
            >
              <HiXMark className="h-6 w-6" />
            </button>
          </div>

          {/* Items + Suggestions scroller */}
          <div
            ref={scrollerRef}
            className="relative px-4 sm:px-6 max-h-[70vh] md:max-h-[72vh] overflow-y-auto pb-4 overscroll-contain"
          >
            {/* top scroll cue */}
            <div
              aria-hidden="true"
              className={[
                'sticky top-0 -mt-4 h-4 bg-gradient-to-b from-white/95 dark:from-neutral-900/95 pointer-events-none z-10 transition-opacity duration-200',
                atTop ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />

            {basket?.length ? (
              <ul role="list" className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {basket.map((product) => {
                  const unitPrice = computeUnitPrice(product);
                  const lineTotal = (unitPrice * (product.quantity || 1)).toFixed(2);
                  const img = imageOfCartItem(product);

                  return (
                    <li
                      key={`${product.id}-${product.sku ?? ''}`}
                      className="flex items-stretch gap-4 py-4"
                      role="group"
                      aria-label={product.title}
                    >
                      {/* Image */}
                      <div className="w-[96px] h-[96px] flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={product.title || 'Product'}
                          width={96}
                          height={96}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover rounded-lg bg-neutral-100 dark:bg-neutral-800"
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          draggable={false}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        {product.sku && (
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
                            SKU: {product.sku}
                          </p>
                        )}
                        <p className="text-sm sm:text-base font-semibold line-clamp-2">
                          {product.title}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="h-10 w-10 sm:h-8 sm:w-8 p-0 grid place-items-center border border-neutral-300 dark:border-neutral-700 rounded-md disabled:opacity-50"
                              onClick={() => dec(product)}
                              disabled={product.quantity <= 1}
                              aria-label={`Decrease quantity of ${product.title}`}
                            >
                              <HiMinus className="h-4 w-4" />
                            </button>
                            <span className="w-7 text-center text-sm font-medium tabular-nums" aria-live="polite">
                              {product.quantity}
                            </span>
                            <button
                              type="button"
                              className="h-10 w-10 sm:h-8 sm:w-8 p-0 grid place-items-center border border-neutral-300 dark:border-neutral-700 rounded-md"
                              onClick={() => inc(product)}
                              aria-label={`Increase quantity of ${product.title}`}
                            >
                              <HiPlus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-sm font-semibold whitespace-nowrap">
                            {symbol}{lineTotal}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => doRemove(product)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
                Your basket is empty.
              </div>
            )}

            {/* Suggestions */}
            {relatedProducts?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold mb-2">You might also need</p>

                <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
                  <div className="flex gap-3 pb-1">
                    {relatedProducts.slice(0, 12).map((item) => {
                      const img = imageOfSuggested(item);
                      const cents = priceCentsOf(item);
                      const showPrice = Number.isFinite(cents) && cents > 0;

                      return (
                        <div
                          key={item.id ?? item.seo_slug ?? item.slug}
                          className="flex-shrink-0 w-[160px] select-none"
                        >
                          <button
                            type="button"
                            onClick={() => viewSuggested(item)}
                            className="block text-left"
                            aria-label={item.title}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                              alt={item.title ?? 'Product image'}
                              className="w-[160px] h-[120px] object-cover rounded-lg border bg-neutral-50 dark:bg-neutral-800"
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              draggable={false}
                            />
                            <div className="mt-1 text-[13px] font-medium line-clamp-2">
                              {item.title}
                            </div>
                          </button>

                          <div className="mt-1 flex items-center justify-between">
                            <div className="text-[12px] font-semibold">
                              {showPrice ? `${symbol}${(cents / 100).toFixed(2)}` : 'Ask'}
                            </div>
                            <button
                              type="button"
                              aria-label={`Add ${item.title} to basket`}
                              onClick={() => addSuggested(item)}
                              className="h-7 w-7 grid place-items-center rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            >
                              <HiPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* bottom scroll cue */}
            <div
              aria-hidden="true"
              className={[
                'sticky bottom-0 -mb-4 h-4 bg-gradient-to-t from-white/95 dark:from-neutral-900/95 pointer-events-none z-10 transition-opacity duration-200',
                atBottom ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />
          </div>

          {/* Subtotal summary */}
          {basket?.length > 0 && (
            <div className="px-4 sm:px-6 pb-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Subtotal ({basket.length} item{basket.length === 1 ? '' : 's'})
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100" aria-live="polite">
                  {symbol}{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="text-[11px] mt-1 text-neutral-500 dark:text-neutral-400">
                Excluding delivery & fees
              </div>
            </div>
          )}

          {/* Footer CTAs */}
          {basket?.length > 0 && (
            <div className="px-4 sm:px-6 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-neutral-200 dark:border-neutral-800 space-y-3 bg-white dark:bg-neutral-900 rounded-b-3xl">
              <button
                type="button"
                onClick={handleCheckout}
                aria-busy={isCheckoutLoading}
                className="w-full rounded-full py-3 font-semibold bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                {checkoutLabel}
              </button>
              <button
                type="button"
                onClick={handleViewBasket}
                className="w-full rounded-full py-2.5 font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                {isViewBasketLoading ? Loader : 'View Basket'}
              </button>

              {/* tiny trust row */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                <span>🔒 Secure checkout</span>
                <span aria-hidden>•</span>
                <span>VISA • MasterCard • G&nbsp;Pay</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Undo toast */}
      {toast && (
        <div className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[95]">
          <div className="pointer-events-auto rounded-full bg-neutral-900 text-white px-4 py-2 text-sm shadow-lg flex items-center gap-3">
            <span className="line-clamp-1">Removed “{toast.title}”</span>
            {onUndoRemove && (
              <button
                type="button"
                onClick={undoRemove}
                className="font-semibold underline underline-offset-2"
              >
                Undo
              </button>
            )}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="opacity-70 hover:opacity-100 ml-1"
              aria-label="Dismiss"
            >
              <HiXMark className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { HiXMark, HiPhone, HiChatBubbleOvalLeft, HiClipboard, HiCheck } from 'react-icons/hi2';

export default function ContactSheet({
  isOpen = false,
  open = undefined,   // alias
  onClose,
  shopName = 'Seller',
  phoneDisplay,       // e.g. "+233 24 123 4567"
  e164,               // e.g. "+233241234567" (digits only and +)
  verified = false,
  hoursText = 'Available Mon–Sat, 9am–6pm',
}) {
  const actuallyOpen = open ?? isOpen;

  const titleId = useId();
  const panelRef = useRef(null);
  const activeBeforeOpenRef = useRef(null);

  // reveal/copy
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Swipe-to-close (same feel as BasketSheet)
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
    if (delta > DRAG_MAX_PX) delta = DRAG_MAX_PX + (delta - DRAG_MAX_PX) * 0.2;
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

  // focus/scroll locking
  useEffect(() => {
    if (actuallyOpen) {
      activeBeforeOpenRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => panelRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      if (activeBeforeOpenRef.current instanceof HTMLElement) {
        activeBeforeOpenRef.current.focus?.();
      }
    }
    return () => (document.body.style.overflow = '');
  }, [actuallyOpen]);

  // esc to close
  useEffect(() => {
    if (!actuallyOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actuallyOpen, onClose]);

  const telHref = useMemo(() => (e164 ? `tel:${e164.replace(/[^\d+]/g, '')}` : null), [e164]);
  const waHref  = useMemo(() => (e164 ? `https://wa.me/${e164.replace(/[^\d]/g, '')}` : null), [e164]);

  const maskPhone = (s) => {
    const digits = String(s || '').replace(/[^\d]/g, '');
    if (digits.length <= 4) return '••••';
    return `••• •• ${digits.slice(-4)}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(phoneDisplay || e164 || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      aria-hidden={!actuallyOpen}
      className={[
        'fixed inset-0 z-[85] transition-opacity duration-200',
        actuallyOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={onBackdrop}
    >
      {/* Backdrop */}
      <div
        className={[
          'absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity',
          actuallyOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={panelRef}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[640px] outline-none"
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
          {/* handle */}
          <div
            className="pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing select-none touch-action-none"
            onMouseDown={onPointerDown}
            onTouchStart={onPointerDown}
          >
            <span className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/* header */}
          <div className="px-4 sm:px-6 pb-3 flex items-center justify-between">
            <h2 id={titleId} className="text-lg sm:text-xl font-semibold">
              Contact {shopName}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label="Close"
            >
              <HiXMark className="h-6 w-6" />
            </button>
          </div>

          {/* body */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <span className="inline-flex items-center gap-1">
                  {verified ? '✅ Verified seller' : 'Seller'}
                </span>
                <span aria-hidden>•</span>
                <span>{hoursText}</span>
              </div>

              {/* number */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-xl font-semibold tabular-nums">
                  {revealed ? (phoneDisplay || e164 || '—') : maskPhone(phoneDisplay || e164)}
                </div>
                {!revealed && (
                  <button
                    onClick={() => setRevealed(true)}
                    className="rounded-full px-3 py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    👀 Reveal number
                  </button>
                )}
              </div>
            </div>

            {/* actions */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={revealed && telHref ? telHref : undefined}
                onClick={(e) => { if (!revealed) e.preventDefault(); }}
                className={[
                  'inline-flex items-center justify-center gap-2 rounded-full py-3 font-semibold',
                  'bg-violet-600 text-white hover:bg-violet-700 text-center',
                  !revealed ? 'opacity-60 cursor-not-allowed' : '',
                ].join(' ')}
              >
                <HiPhone className="h-5 w-5" />
                Call
              </a>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full py-3 font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-center"
                >
                  <HiChatBubbleOvalLeft className="h-5 w-5" />
                  WhatsApp
                </a>
              )}
              <button
                onClick={copy}
                className="inline-flex items-center justify-center gap-2 rounded-full py-3 font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                {copied ? <HiCheck className="h-5 w-5" /> : <HiClipboard className="h-5 w-5" />}
                {copied ? 'Copied' : 'Copy number'}
              </button>
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              We never share your phone. Standard carrier rates apply.
            </p>
          </div>

          {/* safe-area footer spacer */}
          <div className="h-[max(8px,env(safe-area-inset-bottom))]" />
        </div>
      </div>
    </div>
  );
}
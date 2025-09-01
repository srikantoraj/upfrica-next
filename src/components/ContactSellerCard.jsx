// components/ContactSellerCard.jsx
'use client';

import React, { useId, useMemo, useRef } from 'react';

export default function ContactSellerCard({
  // gating + text
  canShowPhone,
  unavailableText,                 // contactReasonText(gate?.reason, gate?.allowed)
  verified = false,
  hoursText = 'Available Mon–Sat, 9am–6pm',

  // phone + actions (computed in parent)
  rawDisplay = '',
  telDigits = '',
  waLink = null,
  maskPhone,                       // optional; falls back to built-in masker
  contactRevealed = false,
  setContactRevealed,
  copyToClipboard,
  copied = false,

  // optional analytics hooks
  onReveal,
  onCall,
  onWhatsApp,
  onCopy,

  // optional styling toggles
  accentWhenVerified = true,
  verificationLabel = 'Verified seller',
  verificationTooltip = 'KYC verified',
}) {
  const titleId = useId();
  const numberId = useId();
  const actionsId = useId();
  const firedRevealOnce = useRef(false);

  // --- helpers ---
  const fallbackMask = (s) => {
    const digits = String(s || '').replace(/[^\d]/g, '');
    if (!digits) return '••••';
    if (digits.length <= 4) return '••••';
    const tail = digits.slice(-4);
    return `••• •• ${tail}`;
  };

  const masked = useMemo(
    () => (contactRevealed ? rawDisplay : (maskPhone || fallbackMask)(rawDisplay)),
    [contactRevealed, rawDisplay, maskPhone]
  );

  const telHref = useMemo(() => {
    const clean = String(telDigits || '').replace(/[^\d+]/g, '');
    return clean ? `tel:${clean}` : '';
  }, [telDigits]);

  const handleReveal = () => {
    setContactRevealed?.(true);
    if (!firedRevealOnce.current) {
      onReveal?.();
      firedRevealOnce.current = true;
    }
  };

  const handleCopy = async () => {
    await copyToClipboard?.();
    onCopy?.();
  };

  // --- early exit when gated ---
  if (!canShowPhone) {
    return (
      <div className="rounded-xl p-4 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          {unavailableText || 'Contact phone not available.'}
        </p>
      </div>
    );
  }

  // --- verified accent classes ---
  const baseCard = 'relative rounded-xl p-4 shadow bg-white dark:bg-neutral-900';
  const borderClass = verified && accentWhenVerified
    ? 'border border-emerald-300/70 dark:border-emerald-700/60 ring-1 ring-emerald-200/40 dark:ring-emerald-800/30'
    : 'border border-gray-200 dark:border-neutral-700';

  return (
    <section
      className={`${baseCard} ${borderClass}`}
      aria-labelledby={titleId}
      data-testid="contact-seller-card"
    >
      {/* top gradient stripe when verified */}
      {verified && accentWhenVerified && (
        <div
          aria-hidden="true"
          className="absolute -top-px inset-x-0 h-[3px] rounded-t-xl
                     bg-gradient-to-r from-emerald-400/80 via-emerald-500/80 to-teal-400/80"
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <p id={titleId} className="font-semibold text-gray-900 dark:text-neutral-100">
          📞 Contact Seller
        </p>

        {verified && (
          <span
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full
                       bg-emerald-50 dark:bg-emerald-900/30
                       text-emerald-700 dark:text-emerald-300
                       border border-emerald-300/60 dark:border-emerald-700/60"
            title={verificationTooltip}
            aria-label={verificationLabel}
          >
            {/* tiny shield-check icon (inline SVG, no deps) */}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12 2l7 3v6c0 5-3.4 9-7 11-3.6-2-7-6-7-11V5l7-3z" />
              <path d="M10.2 12.8l-1.9-1.9-1.1 1.1 3 3c.4.4 1 .4 1.4 0l5.2-5.2-1.1-1.1-4.5 4.5z" className="text-white" />
            </svg>
            {verificationLabel}
          </span>
        )}
      </div>

      {/* Number line (masked → revealed) */}
      <div id={numberId} className="flex items-center justify-between gap-2" aria-live="polite">
        <div
          className={`text-base font-semibold text-center flex-1 tabular-nums transition-colors ${
            contactRevealed ? 'text-gray-900 dark:text-neutral-100'
                            : 'text-gray-600 dark:text-neutral-400'
          }`}
        >
          {masked}
        </div>

        {contactRevealed && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full
                       border border-gray-300 dark:border-neutral-700
                       hover:bg-gray-50 dark:hover:bg-neutral-800
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-violet-400 focus-visible:ring-offset-2"
            aria-label="Copy phone number"
            data-testid="copy-number"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div id={actionsId} className="mt-2">
        {contactRevealed ? (
          <div className="grid grid-cols-2 gap-2">
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={onWhatsApp}
                className="bg-green-600 text-white py-2 rounded-full text-center
                           hover:bg-green-700
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-green-400 focus-visible:ring-offset-2"
                data-testid="whatsapp-cta"
              >
                💬 WhatsApp
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
            {telHref ? (
              <a
                href={telHref}
                onClick={onCall}
                className="py-2 rounded-full text-center text-white
                           bg-violet-600 hover:bg-violet-700
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                data-testid="call-cta"
              >
                📞 Call Now
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="py-2 rounded-full text-center text-white
                           bg-violet-400 cursor-not-allowed opacity-70"
                aria-disabled="true"
                data-testid="call-cta-disabled"
              >
                📞 Call Now
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            aria-expanded={contactRevealed}
            aria-controls={actionsId}
            onClick={handleReveal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); handleReveal();
              }
            }}
            className="w-full bg-violet-50 dark:bg-violet-950/20
                       text-violet-700 dark:text-violet-300
                       border border-violet-300 dark:border-violet-900/50
                       font-medium py-2 px-4 rounded-full
                       hover:bg-violet-100 dark:hover:bg-violet-900/30
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-violet-400 focus-visible:ring-offset-2"
            data-testid="reveal-cta"
          >
            👀 Reveal phone number
          </button>
        )}
      </div>

      <p className="text-[11px] text-center text-gray-500 dark:text-neutral-400 mt-2">
        {hoursText}
      </p>
    </section>
  );
}
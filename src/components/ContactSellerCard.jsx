'use client';
import axiosInstance from '@/lib/axiosInstance';

import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

export default function ContactSellerCard({
  canShowPhone,
  unavailableText,
  verified = false,
  hoursText = 'Available Mon–Sat, 9am–6pm',

  // auth
  isLoggedIn = false,
  signinUrl = '/login',

  // identify PDP + auto-open safety sheet once after login
  productSlug = null,
  autoOpenSafetyOnce = false,

  maxDailyReveals = 5,

  rawDisplay = '',
  telDigits = '',
  waLink = null,
  maskPhone,
  contactRevealed = false,
  setContactRevealed,
  copyToClipboard,
  copied = false,

  onReveal,
  onCall,
  onWhatsApp,
  onCopy,
  onBuySafely,

  accentWhenVerified = true,
  verificationLabel = 'Verified seller',
  verificationTooltip = 'KYC verified',
}) {
  const titleId = useId();
  const numberId = useId();
  const actionsId = useId();
  const sheetTitleId = useId();
  const firedRevealOnce = useRef(false);
  const autoOpenedRef = useRef(false);

  const [safetyOpen, setSafetyOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  // -------- safety sheet --------
  const SAFETY_KEY = 'upfrica:safety_sheet_hide_until';
  const shouldShowSafety = () => {
    try {
      const v = localStorage.getItem(SAFETY_KEY);
      if (!v) return true;
      const until = Number(v);
      return !Number.isFinite(until) || Date.now() >= until;
    } catch { return true; }
  };
  const snoozeSafety = () => {
    try { localStorage.setItem(SAFETY_KEY, String(Date.now() + 7*24*60*60*1000)); } catch {}
  };

  // -------- soft cap --------
  const REVEAL_KEY = 'upfrica:reveals_today';
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const readReveal = () => {
    try {
      const raw = localStorage.getItem(REVEAL_KEY);
      const obj = raw ? JSON.parse(raw) : { d: todayStr(), n: 0 };
      return obj.d === todayStr() ? obj.n : 0;
    } catch { return 0; }
  };
  const bumpReveal = () => {
    try { localStorage.setItem(REVEAL_KEY, JSON.stringify({ d: todayStr(), n: readReveal() + 1 })); } catch {}
  };
  const canRevealAgain = () => readReveal() < maxDailyReveals;

  // -------- helpers --------
  const prefersReducedMotion = useMemo(() => {
    try { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false; }
    catch { return false; }
  }, []);
  const vibrate = useCallback((ms = 30) => {
    try { if (!prefersReducedMotion) navigator.vibrate?.(ms); } catch {}
  }, [prefersReducedMotion]);

  const fallbackMask = (s) => {
    const digits = String(s || '').replace(/[^\d]/g, '');
    if (!digits || digits.length <= 4) return '••••';
    return `••• •• ${digits.slice(-4)}`;
  };

  const masked = useMemo(
    () => (contactRevealed ? rawDisplay : (maskPhone || fallbackMask)(rawDisplay)),
    [contactRevealed, rawDisplay, maskPhone]
  );

  const telHref = useMemo(() => {
    const clean = String(telDigits || '').replace(/[^\d+]/g, '');
    return clean ? `tel:${clean}` : '';
  }, [telDigits]);

  // -------- auth probe (use /api/b proxy) --------
  const hasAuthCookie = () => {
    try { return /(?:^|;\s*)up_auth=/.test(document.cookie); } catch { return false; }
  };


  // -------- robust auth probe (always confirm with backend) --------
 const extractAuthed = (j) => {
   if (!j || typeof j !== 'object') return false;
   const check = (o) =>
     !!o && typeof o === 'object' && (
       o.is_authenticated === true ||
       o.id != null || o.pk != null || o.user_id != null ||
       typeof o.username === 'string' || typeof o.email === 'string'
     );
   if (check(j)) return true;
   const candidates = [
     j.user, j.me, j.data, j.result, j.results, j.profile,
     j.data?.user, j.result?.user, j.results?.user, j.user?.data
   ];
   return candidates.some(check);
 };


  // tiny 5s cache to avoid flooding on quick re-clicks
  const authCache = useRef({ t: 0, ok: false });
 const verifyAuth = useCallback(async () => {
   const now = Date.now();
   if (now - authCache.current.t < 5000) return authCache.current.ok;
   try {
     // IMPORTANT: backend path (axios baseURL = "/api/b")
     const { status, data } = await axiosInstance.get('api/users/me/', {
       headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
       withCredentials: true,
     });
     const ok = status >= 200 && status < 300 && extractAuthed(data);
     authCache.current = { t: now, ok };
     return ok;
   } catch {
     authCache.current = { t: now, ok: false };
     return false;
   }
 }, []);



  const goToSignin = useCallback(() => {
    const next = typeof window !== 'undefined'
      ? location.pathname + location.search + location.hash
      : '/';
    try {
      sessionStorage.setItem('upfrica:postlogin_intent',
        JSON.stringify({ action: 'reveal_phone', slug: productSlug || null, at: Date.now() })
      );
    } catch {}
    try {
      const url = new URL(signinUrl || '/login', location.origin);
      url.searchParams.set('next', next);
      location.replace(url.toString());  // hard redirect
    } catch {
      location.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [productSlug, signinUrl]);

  const actuallyReveal = () => {
    setContactRevealed?.(true);
    bumpReveal();
    vibrate(25);
    if (!firedRevealOnce.current) {
      onReveal?.();
      firedRevealOnce.current = true;
    }
  };

  const handleRevealClick = async () => {
    const authed = await verifyAuth();
    if (!authed) return goToSignin();

    if (!canRevealAgain()) {
      alert('You’ve reached today’s limit. Please use Buy Safely (SafePay).');
      return;
    }
    if (shouldShowSafety()) setSafetyOpen(true);
    else actuallyReveal();
  };

  const handleCopy = async () => {
    await copyToClipboard?.();
    vibrate(15);
    onCopy?.();
  };

  const openWA = (e) => {
    if (!waLink && !telDigits) return;
    e.preventDefault();
    const prefill = `Hi, I'm interested in "${(typeof document !== 'undefined' && document.title) || 'your item'}". I will pay via Upfrica SafePay.`;
    const base =
      waLink && !waLink.includes('text=')
        ? `${waLink}${waLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(prefill)}`
        : waLink || `https://wa.me/${telDigits}?text=${encodeURIComponent(prefill)}`;
    const native = `whatsapp://send?phone=${encodeURIComponent(telDigits || '')}&text=${encodeURIComponent(prefill)}`;

    let usedNative = false;
    let timer;
    try {
      location.href = native;
      usedNative = true;
      timer = window.setTimeout(() => {
        if (usedNative) window.open(base, '_blank', 'noopener,noreferrer');
      }, 600);
    } catch {
      window.open(base, '_blank', 'noopener,noreferrer');
    }
    window.addEventListener('pagehide', () => timer && clearTimeout(timer), { once: true });
    onWhatsApp?.();
  };

  // Auto-open once after login (parent hint)
  useEffect(() => {
    if (autoOpenedRef.current) return;
    if (!autoOpenSafetyOnce || contactRevealed !== false) return;

    let cancelled = false;
    (async () => {
      const authed = await verifyAuth();
      if (cancelled || !authed) return;
      if (shouldShowSafety()) setSafetyOpen(true);
      else actuallyReveal();
      autoOpenedRef.current = true;
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenSafetyOnce, verifyAuth, contactRevealed]);

  // Consume post-login intent
  useEffect(() => {
    if (autoOpenedRef.current) return;

    let cancelled = false;
    (async () => {
      try {
        const raw = sessionStorage.getItem('upfrica:postlogin_intent');
        if (!raw) return;
        const intent = JSON.parse(raw);
        if (intent?.action !== 'reveal_phone') return;
        if (intent?.slug && productSlug && intent.slug !== productSlug) return;

        const authed = await verifyAuth();
        if (cancelled || !authed) return;

        sessionStorage.removeItem('upfrica:postlogin_intent');
        if (shouldShowSafety()) setSafetyOpen(true);
        else actuallyReveal();
        autoOpenedRef.current = true;
      } catch {}
    })();

    return () => { cancelled = true; };
  }, [productSlug, verifyAuth]);

  // ESC closes sheet
  useEffect(() => {
    if (!safetyOpen) return;
    const onKey = (e) => e.key === 'Escape' && setSafetyOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [safetyOpen]);

  if (!canShowPhone) {
    return (
      <div className="rounded-xl p-4 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          {unavailableText || 'Contact phone not available.'}
        </p>
      </div>
    );
  }

  const baseCard = 'relative rounded-xl p-4 shadow bg-white dark:bg-neutral-900';
  const borderClass =
    verified && accentWhenVerified
      ? 'border border-emerald-300/70 dark:border-emerald-700/60 ring-1 ring-emerald-200/40 dark:ring-emerald-800/30'
      : 'border border-gray-200 dark:border-neutral-700';

  return (
    <section className={`${baseCard} ${borderClass}`} aria-labelledby={titleId} data-testid="contact-seller-card">
      {verified && accentWhenVerified && (
        <div
          aria-hidden="true"
          className="absolute -top-px inset-x-0 h-[3px] rounded-t-xl
                     bg-gradient-to-r from-emerald-400/80 via-emerald-500/80 to-teal-400/80"
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <p id={titleId} className="font-semibold text-gray-900 dark:text-neutral-100">📞 Contact Seller</p>
        {verified && (
          <span
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full
                       bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300
                       border border-emerald-300/60 dark:border-emerald-700/60"
            title={verificationTooltip}
            aria-label={verificationLabel}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12 2l7 3v6c0 5-3.4 9-7 11-3.6-2-7-6-7-11V5l7-3z" />
              <path d="M10.2 12.8l-1.9-1.9-1.1 1.1 3 3c.4.4 1 .4 1.4 0l5.2-5.2-1.1-1.1-4.5 4.5z" className="text-white" />
            </svg>
            {verificationLabel}
          </span>
        )}
      </div>

      <div id={numberId} className="flex items-center justify-between gap-2" aria-live="polite">
        <div className={`text-base font-semibold text-center flex-1 tabular-nums transition-colors ${
          contactRevealed ? 'text-gray-900 dark:text-neutral-100' : 'text-gray-600 dark:text-neutral-400'
        }`}>
          {masked}
        </div>

        {contactRevealed && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-300 dark:border-neutral-700
                       hover:bg-gray-50 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-violet-400 focus-visible:ring-offset-2"
            aria-label="Copy phone number"
            data-testid="copy-number"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      <div id={actionsId} className="mt-2">
        {contactRevealed ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {waLink || telDigits ? (
                <a
                  href={waLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={openWA}
                  className="bg-green-600 text-white py-2 rounded-full text-center hover:bg-green-700
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
                  data-testid="whatsapp-cta"
                >
                  💬 WhatsApp
                </a>
              ) : <span aria-hidden="true" />}
              {telHref ? (
                <a
                  href={telHref}
                  onClick={onCall}
                  className="py-2 rounded-full text-center text-white bg-violet-600 hover:bg-violet-700
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                  data-testid="call-cta"
                >
                  📞 Call Now
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="py-2 rounded-full text-center text-white bg-violet-400 cursor-not-allowed opacity-70"
                  aria-disabled="true"
                  data-testid="call-cta-disabled"
                >
                  📞 Call Now
                </button>
              )}
            </div>

            <div className="mt-2 flex justify-center">
              <span className="text-[11px] px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                ⚠️ No Buyer Protection off-platform
              </span>
            </div>
          </>
        ) : (
          <button
            type="button"
            aria-expanded={contactRevealed}
            aria-controls={actionsId}
            onClick={handleRevealClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRevealClick(); } }}
            className="w-full bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300
                       border border-violet-300 dark:border-violet-900/50 font-medium py-2 px-4 rounded-full
                       hover:bg-violet-100 dark:hover:bg-violet-900/30 focus-visible:outline-none focus-visible:ring-2
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

      {safetyOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSafetyOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={sheetTitleId}
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white dark:bg-neutral-900 p-5 shadow-2xl"
          >
            <h3 id={sheetTitleId} className="text-lg font-bold">Stay Safe on Upfrica</h3>

            <ul className="mt-3 grid grid-cols-3 text-center text-sm">
              <li className="flex flex-col items-center gap-1"><span className="text-2xl">🛡️</span><span>Pay in App</span></li>
              <li className="flex flex-col items-center gap-1"><span className="text-2xl">📦</span><span>Get Item</span></li>
              <li className="flex flex-col items-center gap-1"><span className="text-2xl">🔢</span><span>Give OTP</span></li>
            </ul>

            <p className="mt-3 text-sm text-red-600">Don’t send MoMo first.</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { if (dontShow) snoozeSafety(); setSafetyOpen(false); onBuySafely?.(); }}
                className="h-12 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
              >
                Buy Safely (SafePay)
              </button>
              <button
                type="button"
                onClick={() => { if (dontShow) snoozeSafety(); setSafetyOpen(false); actuallyReveal(); }}
                className="h-12 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
              >
                Reveal Number
              </button>
            </div>

            <label className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-neutral-400">
              <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} className="h-4 w-4" />
              Don’t show again this week
            </label>
          </div>
        </div>
      )}
    </section>
  );
}
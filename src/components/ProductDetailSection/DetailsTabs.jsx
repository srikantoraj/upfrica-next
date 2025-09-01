'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function DetailsTabs({
  specificsContent,
  descriptionHtml,
  reviewsNode,
  reviewMeta = {},
}) {
  const [tab, setTab] = useState('specifics');
  const reviewCount = Number(reviewMeta?.review_count || 0);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsDesktop(!!e.matches);
    handler(mq);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  // --- helpers ---
  const unescapeIfNeeded = (html) => {
    if (typeof html !== 'string') return '';
    let raw = html.trim();
    if (/&lt;|&gt;|&amp;/.test(raw)) {
      try {
        const doc = new DOMParser().parseFromString(raw, 'text/html');
        raw = doc.documentElement.textContent || raw;
      } catch {}
    }
    return raw;
  };

  const escapeHtml = (str) =>
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const smartListify = (html) => {
    if (!html) return '';
    if (/(<\s*(ul|ol|li)\b)/i.test(html)) return html;

    const withBreaks = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/&nbsp;/gi, ' ')
      .trim();

    const plain = withBreaks.replace(/<[^>]+>/g, '');

    let lines = plain
      .split(/\n+/)
      .map((l) => l.replace(/^\s*([•\-\*\u2022·]+)\s*/u, '').trim())
      .filter(Boolean);

    const lookedLikeBullets = /[•\u2022]/.test(plain);
    const manyShortLines =
      lines.length >= 4 &&
      lines.filter((l) => l.length <= 140).length >= Math.max(3, Math.floor(lines.length * 0.6));

    if (lookedLikeBullets || manyShortLines) {
      const items = lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('');
      // class hooks are optional now that we hard-override in CSS below
      return `<ul class="listified">${items}</ul>`;
    }
    return html;
  };

  const finalDescriptionHtml = useMemo(() => {
    const unescaped = unescapeIfNeeded(descriptionHtml);
    return smartListify(unescaped || '<p>No description provided.</p>');
  }, [descriptionHtml]);

  // panels
const Specifics = (
  <div className="text-sm text-gray-800 space-y-4" id="specifics">
    <div>
      <p className="text-base font-semibold text-gray-900 mb-1">📌 Seller Location:</p>
      <p className="text-sm text-gray-700">Accra — GH</p>
    </div>

    <div>
      <p className="text-base font-semibold text-gray-900 mb-1">📦 Condition:</p>
      <p className="text-sm text-gray-700">Brand New</p>
    </div>

    <div>
      <p className="text-base font-semibold text-gray-900">📄 Product Specifications</p>
      <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
        <table className="w-full border-collapse text-left text-sm" aria-label="Product specifications table">
          <tbody>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 font-medium text-gray-600 w-1/3">🏷️ Brand</th>
              <td className="py-3 px-4">Mulli</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-600">🎨 Colour</th>
              <td className="py-3 px-4">Black</td>
            </tr>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 font-medium text-gray-600">✨ Special Feature</th>
              <td className="py-3 px-4">Portable</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-600">🧪 Capacity</th>
              <td className="py-3 px-4">380 ml</td>
            </tr>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 font-medium text-gray-600">📏 Product Dimensions</th>
              <td className="py-3 px-4">8D x 8W x 25H cm</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-600">🧴 Material</th>
              <td className="py-3 px-4">
                BPA-Free Plastic <span className="text-gray-400 text-xs">(unverified)</span>
              </td>
            </tr>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 font-medium text-gray-600">🔋 Battery</th>
              <td className="py-3 px-4">USB Rechargeable (1200mAh est.)</td>
            </tr>
            <tr className="border-b">
              <th className="py-3 px-4 font-medium text-gray-600">📦 What’s in the Box</th>
              <td className="py-3 px-4">Mini Blender, USB Cable, User Manual</td>
            </tr>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 font-medium text-gray-600">🍹 Ideal For</th>
              <td className="py-3 px-4">Smoothies, Protein Shakes, Baby Food</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

  const Description = (
    <div
      id="description"
      className="richtext prose max-w-none text-sm text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: finalDescriptionHtml }}
      suppressHydrationWarning
    />
  );

  const Reviews = (
    <div id="reviews">
      {reviewsNode ?? <p className="text-sm text-gray-600">No reviews yet.</p>}
    </div>
  );

  // desktop tabs
  if (isDesktop) {
    const TabBtn = (key, label, extras = null) => (
      <button
        type="button"
        onClick={() => setTab(key)}
        className={[
          'w-full px-4 py-3 text-sm font-medium border-b-2 transition',
          tab === key
            ? 'border-violet-600 text-violet-700 bg-violet-50'
            : 'border-transparent text-gray-700 hover:bg-gray-50',
        ].join(' ')}
        aria-selected={tab === key}
        role="tab"
      >
        <span className="inline-flex items-center gap-2">
          {label}
          {extras}
        </span>
      </button>
    );

    return (
      <section className="mt-6 border rounded-xl bg-white" id="details-tabs">
        <div className="grid grid-cols-3 rounded-t-xl overflow-hidden" role="tablist" aria-label="Product details tabs">
          {TabBtn('specifics', 'Product specifics')}
          {TabBtn('description', 'Description')}
          {TabBtn(
            'reviews',
            'Reviews',
            reviewCount > 0 && (
              <span className="inline-flex items-center justify-center text-xs min-w-[1.25rem] h-5 px-1 rounded-full bg-gray-900 text-white">
                {reviewCount}
              </span>
            )
          )}
        </div>

        <div className="p-4 md:p-5" role="tabpanel" aria-labelledby={tab}>
          {tab === 'specifics' && Specifics}
          {tab === 'description' && Description}
          {tab === 'reviews' && Reviews}
        </div>

        {/* Scoped CSS to restore bullets/numbers inside description only */}
        <style jsx>{`
          /* strong specificity + !important to beat global reset */
          #details-tabs :global(.richtext ul),
          #details-tabs :global(.richtext ol) {
            list-style-position: outside !important;
            margin-left: 1.25rem !important; /* ~ml-5 */
            padding-left: 0.25rem !important;
          }
          #details-tabs :global(.richtext ul) { list-style-type: disc !important; }
          #details-tabs :global(.richtext ol) { list-style-type: decimal !important; }
          #details-tabs :global(.richtext li) { margin: 0.25rem 0; }
          /* If our smartListify added <ul class="listified">, make sure it shows bullets */
          #details-tabs :global(.richtext ul.listified) { list-style-type: disc !important; }
        `}</style>
      </section>
    );
  }

  // mobile accordions
  return (
    <section className="mt-6 space-y-3" id="details-accordions">
      <details className="group rounded-xl border bg-white open:shadow-sm">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium">
          <span>Product specifics</span>
          <span className="transition group-open:rotate-180">▾</span>
        </summary>
        <div className="px-4 pb-4">{Specifics}</div>
      </details>

      <details className="group rounded-xl border bg-white open:shadow-sm">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium">
          <span>Description</span>
          <span className="transition group-open:rotate-180">▾</span>
        </summary>
        <div className="px-4 pb-4">{Description}</div>
      </details>

      <details className="group rounded-xl border bg-white open:shadow-sm" id="reviews">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            Reviews
            {reviewCount > 0 && (
              <span className="inline-flex items-center justify-center text-xs min-w-[1.25rem] h-5 px-1 rounded-full bg-gray-900 text-white">
                {reviewCount}
              </span>
            )}
          </span>
          <span className="transition group-open:rotate-180">▾</span>
        </summary>
        <div className="px-4 pb-4">{Reviews}</div>
      </details>

      {/* Same override for mobile container */}
      <style jsx>{`
        #details-accordions :global(.richtext ul),
        #details-accordions :global(.richtext ol) {
          list-style-position: outside !important;
          margin-left: 1.25rem !important;
          padding-left: 0.25rem !important;
        }
        #details-accordions :global(.richtext ul) { list-style-type: disc !important; }
        #details-accordions :global(.richtext ol) { list-style-type: decimal !important; }
        #details-accordions :global(.richtext li) { margin: 0.25rem 0; }
        #details-accordions :global(.richtext ul.listified) { list-style-type: disc !important; }
      `}</style>
    </section>
  );
}
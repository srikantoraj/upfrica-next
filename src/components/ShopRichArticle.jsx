// components/ShopRichArticle.jsx
"use client";

import React, { useMemo, useState } from "react";

function slugify(txt) {
  return String(txt || "")
    .toLowerCase()
    .replace(/<\/?[^>]+(>|$)/g, "")       // strip tags
    .replace(/&[a-z]+;/g, "-")            // entities
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/** Inject ids into h2/h3 so TOC links work */
function addHeadingIds(html) {
  const used = new Set();
  return (html || "").replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_m, lvl, attrs, inner) => {
      let idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
      let id = idMatch?.[1] || slugify(inner);
      while (used.has(id)) id = `${id}-x`;
      used.add(id);
      const newAttrs = attrs.includes(" id=") ? attrs : `${attrs} id="${id}"`;
      return `<h${lvl}${newAttrs}>${inner}</h${lvl}>`;
    }
  );
}

/** Extract [ {id, text, level} ] from H2/H3 for a mini TOC */
function extractToc(html) {
  const out = [];
  const re = /<h([23])[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    const [, level, id, inner] = m;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (text) out.push({ id, text, level: Number(level) });
  }
  return out;
}

export default function ShopRichArticle({
  html,
  schema,
  className = "",
  collapsed = true,           // start collapsed
  maxHeight = 560,            // px height when collapsed
  showToc = true,
}) {
  const [open, setOpen] = useState(!collapsed);

  // Ensure headings have ids for in-page anchors
  const htmlWithIds = useMemo(() => addHeadingIds(html || ""), [html]);

  // Build TOC once ids are present
  const toc = useMemo(() => extractToc(htmlWithIds), [htmlWithIds]);

  if (!html) return null;

  return (
    <section
      className={`mt-10 ${className}`}
      itemScope
      itemType="https://schema.org/Article"
    >
      {/* Optional mini Table of Contents */}
      {showToc && toc.length > 0 && (
        <nav
          aria-label="Table of contents"
          className="mx-auto max-w-4xl mb-4 rounded-lg border bg-white p-3 text-sm shadow-sm"
        >
          <div className="font-semibold mb-2">On this page</div>
          <ul className="list-disc pl-5 space-y-1">
            {toc.map(({ id, text, level }) => (
              <li key={id} className={level === 3 ? "ml-4 list-[circle]" : ""}>
                <a
                  href={`#${id}`}
                  className="text-violet-700 hover:underline"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Article body: FULL HTML is rendered for SEO */}
      <div className="mx-auto max-w-4xl">
        <div
          className={`prose prose-lg dark:prose-invert max-w-none relative transition-[max-height] duration-300 border rounded-md bg-white shadow-sm p-5`}
          style={
            open
              ? undefined
              : { maxHeight, overflow: "hidden" }
          }
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlWithIds }}
        />

        {/* Gradient & button only when clamped */}
        {!open && (
          <div className="relative -mt-24 pt-24">
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-white dark:to-slate-950" />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium shadow"
                aria-expanded={open}
              >
                Read more
              </button>
            </div>
          </div>
        )}

        {open && (
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-full text-sm border hover:bg-gray-50"
              aria-expanded={open}
            >
              Show less
            </button>
          </div>
        )}
      </div>

      {/* JSON-LD */}
      {schema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </section>
  );
}
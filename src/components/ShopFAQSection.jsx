// components/ShopFAQSection.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { BASE_API_URL } from "@/app/constants";

/** Strip simple HTML and parse Q:/A: blocks into [{question, answer}] */
function parseQAFromRichText(text = "") {
  if (!text) return [];
  const plain = text.replace(/<[^>]*>/g, "\n").replace(/\n{2,}/g, "\n").trim();
  const lines = plain.split("\n").map((l) => l.trim());
  const out = [];
  let cur = null;

  for (const line of lines) {
    if (/^Q[:：]/i.test(line)) {
      if (cur && cur.question && cur.answer) out.push(cur);
      cur = { question: line.replace(/^Q[:：]\s*/i, "").trim(), answer: "" };
    } else if (/^A[:：]/i.test(line) && cur) {
      cur.answer = line.replace(/^A[:：]\s*/i, "").trim();
    } else if (cur) {
      cur.answer = (cur.answer ? cur.answer + " " : "") + line;
    }
  }
  if (cur && cur.question && cur.answer) out.push(cur);
  return out.filter((f) => f.question && f.answer);
}

function normalizeFaqArray(arr) {
  const seen = new Set();
  return (Array.isArray(arr) ? arr : [])
    .map((f) => ({
      question: String(f?.question ?? "").trim(),
      answer: String(f?.answer ?? "").trim(),
    }))
    .filter((f) => f.question && f.answer)
    .filter((f) => {
      const key = f.question.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 10);
}

export default function ShopFAQSection({
  shop,
  faqs: faqsFromApi,           // optional, from server
  faqSchema: faqSchemaFromApi, // optional, from server
  className = "",
  emitSchema = false,          // 🔸 NEW: default off to avoid duplicate JSON-LD
}) {
  const [remoteFaqs, setRemoteFaqs] = useState(null);
  const [remoteSchema, setRemoteSchema] = useState(null);

  const slug = shop?.slug;

  // If not provided by the page, fetch the public FAQs endpoint on the client.
  useEffect(() => {
    let cancelled = false;
    async function go() {
      if (faqsFromApi?.length || !slug) return;
      try {
        const res = await fetch(`${BASE_API_URL}/api/shops/${slug}/faqs/`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) {
          setRemoteFaqs(normalizeFaqArray(json?.faqs));
          setRemoteSchema(json?.faq_schema || null);
        }
      } catch {
        // ignore — fallbacks will handle it
      }
    }
    go();
    return () => {
      cancelled = true;
    };
  }, [slug, faqsFromApi]);

  const shopName = shop?.name || "This Shop";
  const town = shop?.user?.town || "your town";
  const country = shop?.user?.country_name || shop?.user?.country || "your country";
  const shopType = shop?.shoptype?.name || "store";

  const deliveryWindow =
    shop?.shop_attributes?.delivery_window ||
    shop?.shop_attributes?.delivery_time ||
    "1–5 days";

  const faqs = useMemo(() => {
    // 1) prefer incoming server FAQs (SSR) or client-fetched FAQs
    const api = normalizeFaqArray(faqsFromApi ?? remoteFaqs);
    if (api.length) return api;

    // 2) JSON attributes saved on the Shop
    const fromJson = normalizeFaqArray(shop?.shop_attributes?.faqs);
    if (fromJson.length) return fromJson;

    // 3) Rich text Q:/A:
    const fromRT = parseQAFromRichText(shop?.answers || "");
    if (fromRT.length) return fromRT;

    // 4) sensible SEO-friendly defaults
    return [
      {
        question: `How long does delivery take from ${shopName} in ${town}?`,
        answer: `Delivery from ${shopName} usually takes ${deliveryWindow} within ${town}, ${country}. We partner with reliable logistics companies to ensure timely delivery.`,
      },
      {
        question: `Does ${shopName} offer returns or exchanges?`,
        answer: `Yes. ${shopName} accepts returns or exchanges within 7 days if the item is defective or not as described.`,
      },
      {
        question: `Is payment on delivery available at ${shopName}?`,
        answer: `${shopName} supports secure online payments. Some products may allow pay-on-delivery, depending on your location in ${country}.`,
      },
      {
        question: `What kind of products does ${shopName} sell?`,
        answer: `${shopName} is a trusted ${shopType} in ${town}, offering authentic, high-quality items at competitive prices.`,
      },
      {
        question: `Can I contact ${shopName} for wholesale or bulk orders?`,
        answer: `Absolutely. ${shopName} offers wholesale pricing and bulk deals. Contact us via the "Contact Seller" button above.`,
      },
    ];
  }, [faqsFromApi, remoteFaqs, shop, shopName, town, country, shopType, deliveryWindow]);

  const faqSchema = useMemo(() => {
    // prefer schema returned by API (SSR or client) else build from final list
    const provided = faqSchemaFromApi || remoteSchema;
    if (provided && provided.mainEntity?.length) return provided;

    const top = faqs.slice(0, 6);
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: top.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
  }, [faqSchemaFromApi, remoteSchema, faqs]);

  if (!faqs.length) return null;

  return (
    <section className={`mt-12 ${className}`} id="shop-faq" aria-labelledby="shop-faq-title">
      <h2 id="shop-faq-title" className="text-2xl font-bold mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={`${idx}-${faq.question.slice(0, 24)}`}
            className="group border border-gray-300 rounded-md p-4 bg-white shadow-sm"
          >
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-800">
              <span className="pr-3">{faq.question}</span>
              <HiChevronDown className="w-5 h-5 shrink-0 transform group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
          </details>
        ))}
      </div>

      {/* JSON-LD Schema Markup (optional) */}
      {emitSchema && (
        <script
          type="application/ld+json"
          // compact to reduce hydration noise
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </section>
  );
}
// components/ShopFAQSection.jsx
'use client';

import React from 'react';
import { HiChevronDown } from 'react-icons/hi';

export default function ShopFAQSection({ shop }) {
  const shopName = shop?.name || 'This Shop';
  const town = shop?.user?.town || 'your town';
  const country = shop?.user?.country_name || shop?.user?.country || 'your country';
  const shopType = shop?.shoptype?.name || 'store';

  const faqs = [
    {
      question: `How long does delivery take from ${shopName} in ${town}?`,
      answer: `Delivery from ${shopName} usually takes 1–5 days within ${town}, ${country}. We partner with reliable logistics companies to ensure timely delivery.`,
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
      answer: `Absolutely. ${shopName} offers wholesale pricing and bulk deals. Contact us via the 'Contact Seller' button above.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-12" id="shop-faq">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group border border-gray-300 rounded-md p-4 bg-white shadow-sm"
          >
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-800">
              {faq.question}
              <HiChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
          </details>
        ))}
      </div>

      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
      />
    </section>
  );
}

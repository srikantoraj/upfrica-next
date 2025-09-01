"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key";

function buildOutlineTemplate(shop) {
  const shopName = shop?.name || "Your Shop";
  const town = shop?.user?.town || "Your City";
  const country = shop?.user?.country_name || shop?.user?.country || "Your Country";
  const h1 = `Machines in ${country} — ${shopName}`;
  const shopUrl = `/shops/${shop?.slug || ""}`;

  return `
<h1>${h1}</h1>
<p><strong>${shopName}</strong> supplies quality machinery to businesses and individuals in ${town}, ${country}. This evergreen guide covers popular categories, selection tips, delivery timelines, after-sales support, and how to buy safely on Upfrica.</p>
<h2>Popular machine categories</h2>
<ul>
  <li><a href="${shopUrl}?category=construction" rel="nofollow">Construction &amp; building</a></li>
  <li><a href="${shopUrl}?category=agriculture" rel="nofollow">Agriculture &amp; agro-processing</a></li>
  <li><a href="${shopUrl}?category=manufacturing" rel="nofollow">Manufacturing &amp; fabrication</a></li>
  <li><a href="${shopUrl}?category=energy" rel="nofollow">Power &amp; energy</a></li>
  <li><a href="${shopUrl}?category=spare-parts" rel="nofollow">Spare parts &amp; accessories</a></li>
</ul>
<h2>How to choose the right machine</h2>
<ul>
  <li>Define the workload (hours/day), capacity and required tolerances.</li>
  <li>Compare power options (single/three phase, diesel, petrol) and fuel/energy costs.</li>
  <li>Check availability of spares, service and warranties.</li>
  <li>Evaluate safety features and operator training needs.</li>
  <li>Consider total cost of ownership, not just the sticker price.</li>
</ul>
<h2>Delivery &amp; installation in ${town}</h2>
<p>Standard delivery is typically <em>1–5 days</em> within ${town}. Nationwide delivery is available. Installation and commissioning can be arranged on request.</p>
<h2>After-sales support</h2>
<ul>
  <li>Warranty coverage on eligible products.</li>
  <li>Spare parts and scheduled servicing.</li>
  <li>Phone and WhatsApp support for troubleshooting.</li>
</ul>
<h2>Top picks from ${shopName}</h2>
<ul>
  <li><a href="${shopUrl}" rel="nofollow">Browse all products</a> or filter by category from the list above.</li>
</ul>
<h2>How to order on Upfrica</h2>
<ol>
  <li>Open the product page and review specs, price and delivery.</li>
  <li>Click <strong>Add to Basket</strong> or <strong>Buy Now</strong> to checkout.</li>
  <li>Choose delivery address; pay securely online or as offered.</li>
</ol>
<p><strong>Need help?</strong> Contact <a href="${shopUrl}">${shopName}</a> for quotes, bulk orders or custom configurations.</p>
`.trim();
}

export default function SeoArticleEditor({ value, onChange, shop }) {
  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">SEO Article</label>
        <button
          type="button"
          className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
          onClick={() => onChange(buildOutlineTemplate(shop))}
          title="Insert a structured evergreen outline"
        >
          Insert outline
        </button>
      </div>

      <Editor
        key={shop?.slug}                 // reset when switching shops
        apiKey={apiKey}
        value={value ?? ""}              // fully controlled
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 520,
          menubar: "file edit view insert format tools table help",
          plugins:
            "autolink lists link anchor table code preview searchreplace wordcount media autoresize",
          toolbar:
            "undo redo | blocks | bold italic underline | bullist numlist | link table blockquote | " +
            "alignleft aligncenter alignright | removeformat | preview code",
          toolbar_mode: "sliding",
          toolbar_sticky: true,
          branding: false,
          convert_urls: false,
          relative_urls: false,
          default_link_target: "_self",
          link_assume_external_targets: "https",
          block_formats:
            "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Blockquote=blockquote",
          content_style:
            "body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,'Noto Sans';line-height:1.65;font-size:16px} h1,h2,h3{margin-top:1.25em} ul,ol{padding-left:1.25em}",
          valid_elements: "*[*]",
        }}
      />

      <p className="text-xs text-gray-500">
        Aim for ~800–1,800 words. Include an H1 with your main query (e.g. “Machines in Ghana — {shop?.name}”),
        clear H2s, bullet points, and internal links to your shop categories & top products.
      </p>
    </div>
  );
}
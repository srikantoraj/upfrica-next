// Server layout just for /[cc]/sourcing
import Link from 'next/link';
import Script from 'next/script';

export default function SourcingLayout({ children, params: { cc } }) {
  const CC = (cc || '').toLowerCase();
  const CC_UP = CC.toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Product Sourcing in ${CC_UP} | Upfrica`,
    "url": `https://www.upfrica.com/${CC}/sourcing`,
    "description": "Tell us what you need. We source verified products and quotes from vetted sellers.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.upfrica.com/${CC}` },
        { "@type": "ListItem", "position": 2, "name": "Sourcing", "item": `https://www.upfrica.com/${CC}/sourcing` }
      ]
    }
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl p-4 text-sm">
        <ol className="flex gap-2 text-gray-500">
          <li><Link href={`/${CC}`} className="hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-gray-900 font-medium">Sourcing</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pb-10">
        {children}
      </div>

      <Script
        id="sourcing-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
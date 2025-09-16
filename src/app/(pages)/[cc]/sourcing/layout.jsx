// src/app/(pages)/[cc]/sourcing/layout.jsx
import Link from 'next/link';
import Script from 'next/script';
import { headers } from 'next/headers';

function absoluteBase() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host') || 'www.upfrica.com';
  return `${proto}://${host}`;
}

export async function generateMetadata({ params: { cc } }) {
  const base = absoluteBase();
  const CC = String(cc || '').toLowerCase();
  const CC_UP = CC.toUpperCase();
  const path = `/${CC}/sourcing`;
  const url = `${base}${path}`;

  const title = `Product Sourcing in ${CC_UP} | Upfrica`;
  const description =
    'Tell us what you need. We source verified products and quotes from vetted sellers.';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Upfrica',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    // keep it indexable
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function SourcingLayout({ children, params: { cc } }) {
  const base = absoluteBase();
  const CC = String(cc || '').toLowerCase();
  const CC_UP = CC.toUpperCase();
  const pageUrl = `${base}/${CC}/sourcing`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Product Sourcing in ${CC_UP} | Upfrica`,
    url: pageUrl,
    description:
      'Tell us what you need. We source verified products and quotes from vetted sellers.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${base}/${CC}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sourcing',
          item: pageUrl,
        },
      ],
    },
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl p-4 text-sm">
        <ol className="flex gap-2 text-gray-500">
          <li>
            <Link href={`/${CC}`} className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-gray-900 font-medium">Sourcing</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pb-10">
        {/* tiny, friendly tip bar to reinforce escrow and delivery accuracy */}
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong>Tip:</strong> Pay only via Upfrica to stay protected. Accurate{' '}
          <span className="underline decoration-dotted">delivery city</span> helps sellers quote the
          right delivery fee.
        </div>

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
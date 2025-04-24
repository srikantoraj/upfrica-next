import ShopPageClient from './ShopPageClient';

export async function generateMetadata({ params }) {
  const slug = params.slug;

  const res = await fetch(`https://media.upfrica.com/api/shops/${slug}/products/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return {
      title: 'Shop | Upfrica',
      description: 'Explore verified African shops and sellers on Upfrica.',
    };
  }

  const data = await res.json();
  const shop = data.shop || {};
  const products = data.results || [];

  const truncate = (text = '', max = 40) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  const shopName = truncate(shop.name || '');
  const shopType = shop.shoptype?.name || 'Shop';
  const town = shop.user?.town || '';
  const country = shop.user?.country_name || shop.user?.country || 'Africa';

  // Dynamic Title
  const title = `${shopName} Shop. Online ${shopType}, ${town} :Upfrica ${country}`;

  // Dynamic Meta Description
  const description = `${shopName}: Online shopping anywhere with ${shopName} Shop, ${town}, ${country}. Low prices on Upfrica: ${shopName} Shop, ${shopType}`;

  // Keywords
  const keywords = [
    shopName,
    shopType,
    town,
    country,
    'Upfrica',
    'online shopping',
    'marketplace',
  ].filter(Boolean).join(', ');

  // Image
  const image = products?.length > 0
    ? `https://www.upfrica.com${products[products.length - 1]?.ordered_product_images?.[0] || ''}`
    : shop.top_banner || 'https://upfrica.com/default-og-banner.jpg';

  // Canonical URL
  const canonicalUrl = `https://upfrica.com/shops/${slug}`;

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: shop.name,
    description: description,
    url: canonicalUrl,
    image: image,
    address: {
      "@type": "PostalAddress",
      addressLocality: town,
      addressCountry: country,
    },
  };

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [image],
      siteName: 'Upfrica',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

export default function Page({ params }) {
  return <ShopPageClient slug={params.slug} />;
}
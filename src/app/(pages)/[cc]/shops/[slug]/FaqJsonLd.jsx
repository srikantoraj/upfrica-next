//app/(pages)/[region]/shops/[slug]/FaqJsonLd.jsx
export default function FaqJsonLd({ schema }) {
  if (!schema?.mainEntity?.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
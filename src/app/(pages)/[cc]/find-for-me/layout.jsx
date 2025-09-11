// src/app/(pages)/[cc]/find-for-me/layout.jsx

// Dynamic, cc-aware SEO metadata
export async function generateMetadata({ params }) {
  const cc = (params?.cc || "gh").toLowerCase();
  const canonical = `/${cc}/find-for-me`;

  return {
    title: "Find-for-me | Upfrica",
    description: "Tell us what you need — we’ll source it, negotiate, and bring you offers.",
    alternates: {
      canonical,
      languages: {
        "x-default": "/find-for-me",
        [`en-${cc.toUpperCase()}`]: canonical,
      },
    },
    openGraph: {
      title: "Find-for-me | Upfrica",
      description: "Tell us what you need — we’ll source it, negotiate, and bring you offers.",
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Find-for-me | Upfrica",
      description: "Tell us what you need — we’ll source it, negotiate, and bring you offers.",
    },
  };
}

export default function Layout({ children }) {
  return (
    <section className="bg-neutral-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </section>
  );
}
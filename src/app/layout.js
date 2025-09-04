// src/app/layout.js
import "./globals.css";
import { Roboto } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import BasketSheetGlobal from "@/components/BasketSheetGlobal";

// i18n/currency provider + DOM lang sync
import LocalizationProvider from "@/contexts/LocalizationProvider";
import LangDomSync from "@/components/common/LangDomSync";

const SITE =
  (process.env.NEXT_PUBLIC_SITE_BASE_URL || "https://upfrica.com").replace(/\/$/, "");

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
    { media: "(prefers-color-scheme: light)", color: "#1E5BFF" },
  ],
};

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Upfrica Marketplace", template: "%s | Upfrica" },
  description:
    "Buy and sell online in Ghana and across Africa. Post free ads for phones, cars, electronics, fashion, and more on Upfrica Marketplace.",
  keywords: ["Upfrica","marketplace","Ghana","phones","cars","fashion","electronics","buy and sell","free ads"],
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Upfrica",
    title: "Upfrica Marketplace",
    description:
      "Buy and sell online in Ghana and across Africa. Post free ads for phones, cars, electronics, fashion, and more.",
    url: SITE,
    images: [{ url: "/default-og-banner.jpg", width: 1200, height: 630, alt: "Upfrica Marketplace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upfrica Marketplace",
    description:
      "Buy and sell online in Ghana and across Africa. Post free ads for phones, cars, electronics, fashion, and more.",
    images: ["/default-og-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Upfrica",
    url: SITE,
    logo: `${SITE}/android-chrome-512x512.png`,
    sameAs: [],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} min-h-screen antialiased bg-white text-slate-900 dark:bg-neutral-950 dark:text-slate-100`}
        suppressHydrationWarning
      >
        {/* Currency + i18n context */}
        <LocalizationProvider>
          {/* Keep <html lang> in sync with user’s language */}
          <LangDomSync />

          <Providers>
            {children}

            {/* Global basket sheet lives here (renders into #portal-root) */}
            <BasketSheetGlobal />

            {/* Toasts */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  padding: "12px 16px",
                  fontSize: "14px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                },
                success: { style: { background: "#d1fae5", color: "#065f46" } },
                error: { style: { background: "#fee2e2", color: "#991b1b" } },
                info: { style: { background: "#e0f2fe", color: "#075985" } },
                loading: { style: { background: "#fef3c7", color: "#92400e" } },
              }}
            />
          </Providers>
        </LocalizationProvider>

        {/* Portal root for sheets/modals (outside main stacking contexts) */}
        <div id="portal-root" />

        {/* Site-wide Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
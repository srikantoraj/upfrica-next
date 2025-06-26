// src/app/layout.js
import "./globals.css";
import { Roboto } from "next/font/google";
import Providers from "./providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-roboto",
});

export const metadata = {
  metadataBase: new URL("https://upfrica.com"),
  title: {
    default: "Upfrica Marketplace",
    template: "%s | Upfrica",
  },
  description:
    "Buy and sell online in Ghana. Post free ads for phones, cars, electronics, fashion, and more on Upfrica Marketplace.",
  keywords: [
    "Ghana",
    "marketplace",
    "phones",
    "cars",
    "fashion",
    "electronics",
    "Upfrica",
    "buy and sell",
    "free ads",
  ],
  openGraph: {
    type: "website",
    title: "Upfrica Marketplace",
    description:
      "Buy and sell online in Ghana. Post free ads for phones, cars, electronics, fashion, and more.",
    url: "https://upfrica.com",
    siteName: "Upfrica",
    images: [
      {
        url: "/default-og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Upfrica Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upfrica Marketplace",
    description:
      "Buy and sell online in Ghana. Post free ads for phones, cars, electronics, fashion, and more.",
    images: ["/default-og-banner.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
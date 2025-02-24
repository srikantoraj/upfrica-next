
import "./globals.css";
import { Inter, Montserrat } from 'next/font/google';

// Load fonts with subsets for better performance
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata = {
  title: "Online Shopping Ghana, Nigeria, Sell Online Free: Upfrica",
  description: "Upfrica, online shopping Ghana, upafrica, online shopping nigeria, free online shop, sell online, Africa maketplace, Online shop in Ghana, african market, amazon ghana, ebay ghana, how to make money online in ghana, how to make money online, africa.com, Jumia, Olx, Tonaton, Africa online market, Africa market, Africa marketplace, Sell online, Buy online, Africa classifieds, tonaton ghana, Jiji Ghana, Jiji nigeria, Africa buy online, Africa classified ads, Africa wanted classifieds, Africa post free ads, Africa free advertising sites, Africa classified advertisement website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

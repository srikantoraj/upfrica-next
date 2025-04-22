
// import "./globals.css";
// import { Inter, Montserrat } from 'next/font/google';
// import Providers from "./providers";


// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
// const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

// export const metadata = {
//   title: "Buy & Sell Online in Ghana | Post Free Ads – Upfrica Marketplace",
//   description: "Upfrica is Ghana’s trusted free online marketplace to buy and sell phones, cars, electronics, fashion, and more. Post ads for free and connect with real buyers today",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${inter.variable} ${montserrat.variable}`}
//       >
//         <Providers>{children}</Providers>
    
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import { Roboto } from 'next/font/google';
import Providers from "./providers";

const roboto = Roboto({
  subsets: ['latin'],
  weight: '300', // specify the weight you want to use
  variable: '--font-roboto'
});

export const metadata = {
  title: "Buy & Sell Online in Ghana | Post Free Ads – Upfrica Marketplace",
  description: "Upfrica is Ghana’s trusted free online marketplace to buy and sell phones, cars, electronics, fashion, and more. Post ads for free and connect with real buyers today",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`} >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

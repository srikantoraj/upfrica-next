import Footer from "@/components/common/footer/Footer";
import Header from "@/components/common/header/Header";

export default function RootLayout({ children }) {
  return (
    <>
      <Header></Header>
      {children}
      <Footer />
    </>
  );
}

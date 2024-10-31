import Footer from "@/components/common/footer/Footer";
import Header from "@/components/common/header/Header";

const layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default layout;

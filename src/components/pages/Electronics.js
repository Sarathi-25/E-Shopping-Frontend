import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductData from "../data/ProductData";
import slide1 from "../../assets/images/E1.jpg";
import slide2 from "../../assets/images/E2.jpg";
import slide3 from "../../assets/images/E3.jpg";
import slide4 from "../../assets/images/E4.png";

const Electronics = () => {
  const { products, setCartCount } = useContext(AppContext);

  // Filter only electronics category
  const electronicsProducts = products.filter(
    (product) => product.category === "Electronics"
  );

  const slides = [slide1, slide2, slide3, slide4];

  return (
    <ProductData
      title="Electronics"
      products={electronicsProducts}
      slides={slides}
      setCartCount={setCartCount}
    />
  );
};

export default Electronics;

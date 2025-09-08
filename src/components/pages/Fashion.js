import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductData from "../data/ProductData";
import slide1 from "../../assets/images/F1.jpg";
import slide2 from "../../assets/images/F2.jpg";
import slide3 from "../../assets/images/F3.png";
import slide4 from "../../assets/images/F4.png";

const Fashion = () => {
  const { products, setCartCount } = useContext(AppContext);

  // Filter only fashion products
  const fashionProducts = products.filter(
    (product) => product.category === "Fashion"
  );

  const slides = [slide1, slide2, slide3, slide4];

  return (
    <ProductData
      title="Fashion"
      products={fashionProducts}
      slides={slides}
      setCartCount={setCartCount}
    />
  );
};

export default Fashion;

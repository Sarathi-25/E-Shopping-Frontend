import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductData from "../data/ProductData";
import slide1 from "../../assets/images/G1.jpg";
import slide2 from "../../assets/images/G2.jpg";
import slide3 from "../../assets/images/G3.jpg";
import slide4 from "../../assets/images/G4.jpg";

const Grocery = () => {
  const { products, setCartCount } = useContext(AppContext);

  // Filter only grocery category
  const groceryProducts = products.filter(
    (product) => product.category === "Grocery"
  );

  const slides = [slide1, slide2, slide3, slide4];

  return (
    <ProductData
      title="Grocery"
      products={groceryProducts}
      slides={slides}
      setCartCount={setCartCount}
    />
  );
};

export default Grocery;

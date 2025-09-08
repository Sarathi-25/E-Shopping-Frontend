// src/components/pages/CategoryPage.js
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProductData from "../data/ProductData";
import D1 from "../../assets/images/D1.jpg";
import D2 from "../../assets/images/D2.jpg";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ Default slide (shown if category has no images yet)
const defaultSlide = [D1, D2];

const CategoryPage = () => {
  const { category } = useParams();
  const { products, categories, setCartCount } = useContext(AppContext);

  // ✅ find this category in DB
  const catData = categories.find(
    (c) => c.name.toLowerCase() === category.toLowerCase()
  );

  // ✅ if DB has slides use them, else fallback to default
  const slides =
    catData && catData.slides && catData.slides.length > 0
      ? catData.slides.map((s) => `${API}${s}`)
      : defaultSlide;

  const categoryProducts = products.filter(
    (product) => product.category?.toLowerCase() === category.toLowerCase()
  );

  return (
    <ProductData
      title={category}
      products={categoryProducts}
      slides={slides}
      setCartCount={setCartCount}
    />
  );
};

export default CategoryPage;

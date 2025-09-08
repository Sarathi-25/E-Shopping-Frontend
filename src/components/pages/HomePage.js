import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import ProductData from "../data/ProductData";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const HomePage = () => {
  const { products, setCartCount, loggedInUserEmail } = useContext(AppContext);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const loadHomeSlides = async () => {
      const res = await fetch(`${API}/api/home/slides`);
      const data = await res.json();
      if (data && data.length > 0) {
        setSlides(data.map((s) => `${API}${s}`));
      } else {
        // fallback if no slides yet
        setSlides(["/fallback1.jpg", "/fallback2.jpg"]);
      }
    };
    loadHomeSlides();
  }, []);

  return (
    <div style={{ backgroundColor: "#ECF5F9", paddingBottom: "20px" }}>
      <ProductData
        title="Home Page"
        products={products}
        slides={slides}
        setCartCount={setCartCount}
        loggedInUserEmail={loggedInUserEmail}
      />
    </div>
  );
};

export default HomePage;

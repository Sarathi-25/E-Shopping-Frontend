import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { addProductToCart, getImageUrl } from "../../utils/api";

// ---------------- Carousel component ----------------
const Carousel = ({ slides = [] }) => {
  if (!slides || slides.length === 0) {
    return (
      <section className="carousel-section text-center py-4">
        <p className="text-muted">No slides available</p>
      </section>
    );
  }

  return (
    <section id="carousel" className="carousel-section">
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ maxWidth: "100%", height: "250px", overflow: "hidden" }}
      >
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="carousel-inner" style={{ height: "250px" }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={slide}
                className="d-block w-100"
                alt={`Slide ${index + 1}`}
                style={{ height: "250px", width: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
};

// ---------------- Product grid ----------------
const ProductGrid = ({ title, products, addToCart }) => {
  const navigate = useNavigate();

  return (
    <section id={`category-${title}`} className="products mb-5">
      <h2 className="text-center my-4">{title}</h2>
      <div className="product-grid d-flex flex-wrap justify-content-center gap-3">
        {products.length === 0 ? (
          <p className="text-center">No products available</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="product border p-3 rounded d-flex flex-column justify-content-between"
              style={{
                width: "250px",
                cursor: "pointer",
                position: "relative",
                backgroundColor: "#f1f3f596",
              }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div>
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="img-fluid mb-2 rounded d-flex mx-auto"
                  style={{
                    maxHeight: "250px",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>₹{product.price}</p>
              </div>

              <div className="mt-3">
                <button
                  className="btn btn-primary"
                  onClick={(e) => addToCart(product, e)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

// ---------------- ProductData wrapper ----------------
const ProductData = ({ title, products = [], slides = [] }) => {
  const { setCartCount, loggedInUserEmail } = useContext(AppContext);

  // ✅ Add to Cart handler
  const addToCart = async (product, e) => {
    e?.stopPropagation();
    if (!loggedInUserEmail) {
      toast.error("Please log in to add products to cart.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Auth token missing");
      return;
    }

    try {
      const updatedItems = await addProductToCart(token, {
        productId: product._id,
        quantity: 1,
      });
      const totalQuantity = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalQuantity);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  // ✅ Group products by category
  const groupedByCategory = products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  // ✅ Render UI
  return (
    <div>
      <Carousel slides={slides} />

      {Object.keys(groupedByCategory).length === 0 ? (
        <p className="text-center my-4">No products found in this category.</p>
      ) : (
        Object.keys(groupedByCategory).map((category) => (
          <ProductGrid
            key={category}
            title={category}
            products={groupedByCategory[category]}
            addToCart={addToCart}
          />
        ))
      )}
    </div>
  );
};

export default ProductData;

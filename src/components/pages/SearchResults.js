import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const { allProducts, searchQuery } = useContext(AppContext);
  const navigate = useNavigate();

  // Defensive check to avoid runtime errors
  if (!Array.isArray(allProducts) || allProducts.length === 0) {
    return <p className="text-center mt-4">Loading products...</p>;
  }

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">
        Search Results for:{" "}
        <span className="text-primary">"{searchQuery}"</span>
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => {
            console.log("Product data:", product); // ✅ Debugging line

            // Pick correct image field
            const imageSrc = product.image // case 1: simple string like "shirt.jpg"
              ? `http://localhost:5000/uploads/${product.image}`
              : product.imageUrl // case 2: direct full URL
              ? product.imageUrl
              : product.images && product.images.length > 0 // case 3: array
              ? `http://localhost:5000/uploads/${product.images[0]}`
              : "https://via.placeholder.com/400"; // fallback

            return (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={imageSrc}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "250px", objectFit: "contain" }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted">₹{product.price}</p>
                    </div>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

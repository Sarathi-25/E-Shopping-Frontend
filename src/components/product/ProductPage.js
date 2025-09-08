// src/components/product/ProductPage.js
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  addProductToCart,
  fetchSingleProduct,
  getImageUrl,
} from "../../utils/api";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCartCount, loggedInUserEmail } = useContext(AppContext);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchSingleProduct(id);
        setProduct(fetchedProduct);
      } catch (err) {
        console.error(err);
        toast.error("Product not found!");
      }
    };
    loadProduct();
  }, [id]);

  if (!product) return <h2>Loading product...</h2>;

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

  const handleBuyNow = async () => {
    await addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="container mt-4" style={{ marginBottom: "80px" }}>
      <button onClick={() => navigate(-1)} className="btn btn-primary mb-3">
        Back
      </button>

      <div className="row">
        <div className="col-md-5">
          <div
            className="card"
            style={{
              maxWidth: "550px",
              height: "550px",
              margin: "0 auto",
              border: "1px solid #ddd",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="card-img-top"
              style={{
                maxHeight: "450px",
                objectFit: "contain",
                backgroundColor: "#f8f9fa",
              }}
            />
            <div className="card-body">
              <div className="d-flex justify-content-between gap-3">
                <button
                  className="btn btn-primary w-50"
                  onClick={(e) => addToCart(product, e)}
                >
                  Add to Cart
                </button>
                <button className="btn btn-success w-50" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <h1>{product.name}</h1>
          <h3 className="text-danger">₹{product.price}</h3>
          <p>{product.description}</p>
          {product.specifications?.length > 0 && (
            <>
              <h4>Specifications:</h4>
              <ul>
                {product.specifications.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

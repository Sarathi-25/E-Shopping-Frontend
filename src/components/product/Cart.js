// src/components/cart/Cart.js
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
  getImageUrl,
} from "../../utils/api";

const Cart = () => {
  const { setCartCount, loggedInUserEmail } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setCartItems([]);
      try {
        const items = await getCart(token);
        setCartItems(items);
        setCartCount(items.reduce((s, i) => s + i.quantity, 0));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart.");
      }
    };
    fetchCartItems();
  }, [loggedInUserEmail, setCartCount]);

  const removeItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const items = await removeCartItemApi(token, id);
      setCartItems(items);
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
      toast.info("Item removed from cart.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.");
    }
  };

  const updateQuantity = async (id, quantity) => {
    const token = localStorage.getItem("token");
    try {
      const items = await updateCartItemApi(token, { productId: id, quantity });
      setCartItems(items);
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity.");
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    try {
      await clearCartApi(token);
      setCartItems([]);
      setCartCount(0);
      toast.success("Cart cleared successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart.");
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info text-center">Your cart is empty!</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId._id}>
                  <td>
                    <img
                      src={getImageUrl(item.productId.image)}
                      alt={item.productId.name}
                      style={{ height: "80px", objectFit: "contain" }}
                    />
                    {item.productId.name}
                  </td>
                  <td>₹{item.productId.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productId._id,
                          parseInt(e.target.value)
                        )
                      }
                      className="form-control"
                      style={{ width: "80px" }}
                    />
                  </td>
                  <td>₹{item.productId.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(item.productId._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <h4>Total: ₹{calculateTotal()}</h4>
            <div>
              <button className="btn btn-warning me-2" onClick={clearCart}>
                Clear Cart
              </button>
              <button
                className="btn btn-success"
                onClick={() => navigate("/checkoutPage")}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

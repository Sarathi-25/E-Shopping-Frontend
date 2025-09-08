import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { getCart, clearCartApi, placeOrder } from "../../utils/api";

const CheckoutPage = () => {
  const { user, setCartCount, token } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 to check current route

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    const init = async () => {
      const localToken = token || localStorage.getItem("token");
      if (!localToken || !user?._id) {
        navigate("/LoginPage");
        return;
      }

      try {
        const data = await getCart(localToken);
        const items = Array.isArray(data)
          ? data
          : data?.items || data?.cart?.items || [];

        // 👇 Only redirect to /Cart if we are on the checkout page
        if (
          (!items || items.length === 0) &&
          location.pathname === "/checkout"
        ) {
          toast.info("Your cart is empty.");
          navigate("/Cart");
          return;
        }

        setCartItems(items);
      } catch (err) {
        console.error("Cart fetch error:", err);
        toast.error("Failed to load cart. Please login again.");
        navigate("/LoginPage");
      }
    };

    init();
  }, [token, user, navigate, location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price =
        item?.product?.price ?? item?.productId?.price ?? item?.price ?? 0;
      const qty = item?.quantity ?? 1;
      return total + price * qty;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (Object.values(formData).some((v) => String(v).trim() === "")) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    const localToken = token || localStorage.getItem("token");
    if (!localToken) {
      toast.error("Not authenticated. Please log in.");
      navigate("/LoginPage");
      return;
    }

    try {
      const itemsPayload = cartItems.map((item) => ({
        productId:
          item?.product?._id ?? item?.productId?._id ?? item?.productId,
        name: item?.product?.name ?? item?.productId?.name ?? item?.name,
        price: item?.product?.price ?? item?.productId?.price ?? item?.price,
        quantity: item?.quantity ?? 1,
      }));

      const res = await placeOrder(localToken, {
        userEmail: user.email,
        items: itemsPayload,
        shippingDetails: formData,
        paymentMethod,
        totalAmount: calculateTotal(),
      });

      await clearCartApi(localToken);
      setCartItems([]);
      setCartCount(0);

      toast.success("Order placed successfully!");
      navigate(`/order-success/${res.order._id}`);
    } catch (err) {
      console.error("Place order failed:", err);
      toast.error(err.message || "Order failed. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Checkout</h2>
      <div className="row">
        <div className="col-md-6">
          <h4>Shipping Address</h4>
          {Object.keys(formData).map((key) => (
            <div className="mb-3" key={key}>
              <label
                className="form-label"
                style={{ textTransform: "capitalize" }}
              >
                {key}
              </label>
              <input
                type="text"
                className="form-control"
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <div>
              <label className="me-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ms-2">Cash on Delivery</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ms-2">Credit/Debit Card</span>
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h4>Order Summary</h4>
          <ul className="list-group mb-3">
            {cartItems.map((item, idx) => {
              const name =
                item?.product?.name ?? item?.productId?.name ?? "Product";
              const price = item?.product?.price ?? item?.productId?.price ?? 0;
              const qty = item?.quantity ?? 1;
              const pid =
                item?.product?._id ??
                item?.productId?._id ??
                item?.productId ??
                idx;
              return (
                <li
                  key={pid}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {name} x {qty}
                  <span>₹{price * qty}</span>
                </li>
              );
            })}
          </ul>
          <h5>Total: ₹{calculateTotal()}</h5>
          <button
            className="btn btn-success mt-3 w-100"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

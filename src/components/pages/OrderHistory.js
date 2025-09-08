import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { getOrders, cancelOrderApi } from "../../utils/api"; // adjust path if needed

const OrderHistory = () => {
  const { token } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrders(token); // should return array
        console.log("Orders API response:", data); // debugging
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders.");
      }
    };

    fetchOrders();
  }, [token]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const updatedOrder = await cancelOrderApi(token, orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel order.");
    }
  };

  if (!orders || orders.length === 0) {
    return <h2 className="text-center mt-5">You have no orders yet.</h2>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="card mb-4">
          <div className="card-body">
            <h5>Order ID: {order._id}</h5>
            <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p
              className={`fw-bold ${
                order.status === "Cancelled" ? "text-danger" : "text-primary"
              }`}
            >
              Status: {order.status}
            </p>

            <h6>Items:</h6>
            <ul className="list-group mb-3">
              {(order.items || []).map((item, idx) => (
                <li
                  key={item._id || idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.name} x {item.quantity}
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <h5>Total: ₹{order.totalAmount}</h5>

            {order.status === "Processing" && (
              <button
                className="btn btn-danger"
                onClick={() => cancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;

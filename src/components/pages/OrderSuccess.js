import { useParams, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-success mb-4">Order Placed Successfully!</h2>
      <p>
        Your Order ID: <strong>{orderId}</strong>
      </p>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;

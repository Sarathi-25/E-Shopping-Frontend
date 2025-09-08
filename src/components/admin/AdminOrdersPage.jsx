import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL || "";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const fetchOrders = async (page = 1) => {
    try {
      const res = await fetch(`${API}/api/orders?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin - Orders Management</h2>

      <table className="table table-bordered mt-3 ">
        <thead>
          <tr className="text-center">
            <th >Si No</th>
            <th>User</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ordered On</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id}>
              <td>{(pagination.currentPage - 1) * 10 + (idx + 1)}</td>
              <td>{order.userEmail || "N/A"}</td>
              <td>
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} x {item.quantity}
                    {i < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </td>
              <td>₹{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-primary"
          disabled={pagination.currentPage === 1}
          onClick={() => fetchOrders(pagination.currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => fetchOrders(pagination.currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrdersPage;

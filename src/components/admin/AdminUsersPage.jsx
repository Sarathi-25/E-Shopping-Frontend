import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminUsersPage = () => {
  const { token } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API}/api/auth`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Fetch users error:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  return (
    <div className="container mt-4">
      {/* ✅ Centered Title */}
      <h2 className="text-center mb-4">Admin - Users Management</h2>

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark text-center">
            <tr>
              <th>Si No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  {/* ✅ Serial number */}
                  <td className="text-center">{index + 1}</td>
                  <td>
                    {`${user.firstname || ""} ${user.lastname || ""}`.trim() ||
                      "N/A"}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;

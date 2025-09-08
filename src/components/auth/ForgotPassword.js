import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.phoneNumber === phone
    );

    if (!user) {
      toast.error("Invalid email or phone number.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const updatedUsers = users.map((u) =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast.success("Password reset successfully.");
    navigate("/LoginPage");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: "#f79e1d" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}
      >
        <h3 className="text-center mb-4 text-primary">Reset Your Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your registered phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </div>

          <div className="text-center mt-3">
            <button
              className="btn btn-link"
              type="button"
              onClick={() => navigate("/LoginPage")}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;

import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/api";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const { handleLogin } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- NORMAL LOGIN ----------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.token) {
        handleLogin(res, res.token);
        toast.success("Login successful");
        navigate("/HomePage");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;
      if (!credential) throw new Error("No Google credential received");

      // Decode token for frontend greeting
      let decoded = {};
      try {
        decoded = jwtDecode(credential);
      } catch (err) {
        console.warn("JWT decode failed:", err);
      }

      // Send credential to backend for verification / login
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        }
      );

      const data = await res.json();

      if (data.token) {
        handleLogin(data, data.token);
        toast.success(`Welcome ${decoded?.name || "User"}!`);
        navigate("/HomePage");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed");
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#97c5ff" }}
    >
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="card shadow-lg border-0 p-4"
          style={{
            maxWidth: "450px",
            width: "100%",
            borderRadius: "15px",
            backgroundColor: "#ffffff",
          }}
        >
          <h3 className="text-center text-primary mb-4">Welcome Back</h3>
          <p className="text-center text-muted mb-4">Login to your account</p>

          {/* EMAIL/PASSWORD FORM */}
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div
                onClick={() => navigate("/ForgotPassword")}
                className="text-decoration-none text-primary"
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
              >
                Forgot Password?
              </div>
            </div>
            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* DIVIDER */}
          <div className="text-center my-3">
            <span className="text-muted">OR</span>
          </div>

          {/* GOOGLE LOGIN */}
          <div className="d-flex justify-content-center mb-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}          // ✅ disable auto-login
              ux_mode="popup"            // ✅ login in popup
              prompt="select_account"    // ✅ always show account chooser
            />
          </div>

          {/* SIGN UP LINK */}
          <div className="text-center">
            <p className="mb-0">
              Don't have an account?{" "}
              <span
                className="text-primary fw-semibold"
                onClick={() => navigate("/SignUpPage")}
                style={{ cursor: "pointer" }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContext } from "../context/AppContext";
import logo from "../../assets/images/Logo.png";

const API = process.env.REACT_APP_API_URL || "";

const Header = () => {
  const {
    isAuthenticated,
    handleLogout,
    fullName,
    cartCount,
    setSearchQuery,
    role,
  } = useContext(AppContext);

  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/api/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") return;
    setSearchQuery(searchInput);
    navigate("/SearchResults");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button
          className="btn p-0 border-0 bg-transparent"
          onClick={() => navigate("/HomePage")}
          style={{ maxWidth: "150px" }}
        >
          <img
            src={logo}
            alt="E-Shopping Logo"
            className="img-fluid"
            style={{ maxHeight: "40px", borderRadius: "8px" }}
          />
        </button>

        {/* Hamburger for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="row w-100">
            {/* Search Bar */}
            <div className="col-sm-4 ms-auto">
              <form className="d-flex" onSubmit={handleSearchSubmit}>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search products"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button className="btn btn-primary ms-2" type="submit">
                  Search
                </button>
              </form>
            </div>

            {/* Right Side Buttons */}
            <div className="col-md-6 d-flex justify-content-end align-items-center">
              {/* Category Dropdown (dynamic) */}
              <div className="dropdown me-2">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Category
                </button>
                <ul className="dropdown-menu">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate(`/category/${cat.name}`)}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="dropdown-item text-muted">
                        No categories
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {!isAuthenticated && (
                <>
                  <button
                    className="btn btn-outline-light me-2"
                    onClick={() => navigate("/LoginPage")}
                  >
                    Login
                  </button>
                </>
              )}

              {isAuthenticated && (
                <>
                  {/* Profile / Account Dropdown */}
                  <div className="dropdown me-2">
                    <button
                      className="btn btn-outline-light dropdown-toggle fw-bold"
                      data-bs-toggle="dropdown"
                    >
                      Hello, {fullName || "Profile"}
                    </button>
                    <ul
                      className="dropdown-menu p-2"
                      style={{ minWidth: "162px" }}
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate("/ProfilePage")}
                        >
                          Profile
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Cart / Orders / Admin Links */}
                  {!isAdmin && (
                    <>
                      <button
                        className="btn btn-outline-light me-2"
                        onClick={() => navigate("/OrderHistory")}
                      >
                        Order History
                      </button>
                      <button
                        className="btn btn-outline-light position-relative me-2"
                        onClick={() => navigate("/Cart")}
                      >
                        Cart
                        {cartCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-outline-warning me-2"
                        onClick={() => navigate("/admin/products")}
                      >
                        Products
                      </button>
                      <button
                        className="btn btn-outline-warning me-2"
                        onClick={() => navigate("/admin/categories")}
                      >
                        Categories
                      </button>
                      <button
                        className="btn btn-outline-warning me-2"
                        onClick={() => navigate("/admin/users")}
                      >
                        Users
                      </button>
                      <button
                        className="btn btn-outline-warning me-2"
                        onClick={() => navigate("/admin/orders")}
                      >
                        Orders
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

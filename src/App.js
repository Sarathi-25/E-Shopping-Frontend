import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";
import { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import HomePage from "./components/pages/HomePage";
import ProfilePage from "./components/pages/ProfilePage";
import Header from "./components/layout/Header";
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import Cart from "./components/product/Cart";
import Footer from "./components/layout/Footer";
import ProductPage from "./components/product/ProductPage";
import { AppContext } from "./components/context/AppContext";
import CheckoutPage from "./components/pages/CheckoutPage";
import OrderSuccess from "./components/pages/OrderSuccess";
import OrderHistory from "./components/pages/OrderHistory";
import SearchResults from "./components/pages/SearchResults";
import ForgotPassword from "./components/auth/ForgotPassword";

// Dynamic Category Page
import CategoryPage from "./components/pages/CategoryPage";

// Admin pages
import AdminProductsPage from "./components/admin/AdminProductsPage";
import AdminUsersPage from "./components/admin/AdminUsersPage";
import AdminOrdersPage from "./components/admin/AdminOrdersPage";
import AdminCategoriesPage from "./components/admin/AdminCategoriesPage"; // ✅ New

const App = () => {
  const { isAuthenticated, isAdmin } = useContext(AppContext);

  // Private route wrapper
  const PrivateRoute = () => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/LoginPage" />;
  };

  // Admin route wrapper
  const AdminRoute = () => {
    return isAuthenticated && isAdmin ? (
      <Outlet />
    ) : (
      <Navigate to="/HomePage" />
    );
  };

  return (
    <BrowserRouter>
      <div id="root">
        <Header />
        <div style={{ marginTop: "53px" }}>
          <Routes>
            {/* Public Routes */}
            <Route path="*" element={<Navigate to="/HomePage" />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route
              path="/LoginPage"
              element={
                isAuthenticated ? <Navigate to="/HomePage" /> : <LoginPage />
              }
            />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route
              path="/SignUpPage"
              element={
                isAuthenticated ? <Navigate to="/HomePage" /> : <SignUpPage />
              }
            />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/ProfilePage" element={<ProfilePage />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/checkoutPage" element={<CheckoutPage />} />
              <Route
                path="/order-success/:orderId"
                element={<OrderSuccess />}
              />
              <Route path="/OrderHistory" element={<OrderHistory />} />
              <Route path="/SearchResults" element={<SearchResults />} />

              {/* ✅ Dynamic category route */}
              <Route path="/category/:category" element={<CategoryPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route
                path="/admin/categories"
                element={<AdminCategoriesPage />}
              />{" "}
              {/* ✅ */}
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

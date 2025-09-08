import { createContext, useState, useEffect, useCallback } from "react";
import {
  fetchUserProfile,
  getCart,
  fetchProducts,
  fetchSingleProduct,
} from "../../utils/api";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ------------------ User & Auth State ------------------
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(
    localStorage.getItem("loggedInUserEmail") || null
  );
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [isAdmin, setIsAdmin] = useState(role === "admin");

  // ------------------ Cart ------------------
  const [cartCount, setCartCount] = useState(0);

  // ------------------ Search ------------------
  const [searchQuery, setSearchQuery] = useState("");

  // ------------------ Products ------------------
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ------------------ Categories ------------------
  const [categories, setCategories] = useState([]);

  // ------------------ Fetch User Profile ------------------
  const fetchProfile = useCallback(
    async (authToken) => {
      if (!authToken) {
        handleLogout();
        return;
      }

      try {
        const userData = await fetchUserProfile(authToken);
        if (!userData || !userData.email) throw new Error("Invalid user data");

        // Ensure firstname and lastname exist for Google users
        let firstname = userData.firstname || "";
        let lastname = userData.lastname || "";
        if ((!firstname || !lastname) && userData.fullName) {
          const [first, ...rest] = userData.fullName.split(" ");
          firstname = first;
          lastname = rest.join(" ");
        }

        const updatedUserData = { ...userData, firstname, lastname };

        setUser(updatedUserData);
        setFullName(`${firstname} ${lastname}`.trim());
        setLoggedInUserEmail(userData.email);
        setRole(userData.role || "user");
        setIsAdmin(userData.role === "admin");
        localStorage.setItem("role", userData.role || "user");
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        setIsAuthenticated(true);
        setToken(authToken);

        if (userData.role !== "admin") {
          const cartItems = await getCart(authToken);
          const totalQuantity = cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(totalQuantity);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        toast.error("Session expired. Please login again.", {
          toastId: "session-expired",
        });
        handleLogout();
      }
    },
    [] // no dependencies
  );

  // ------------------ Login ------------------
  const handleLogin = async (userData, authToken) => {
    const userObj = userData.user || userData;

    // Ensure firstname and lastname exist
    let firstname = userObj.firstname || "";
    let lastname = userObj.lastname || "";
    if ((!firstname || !lastname) && userObj.fullName) {
      const [first, ...rest] = userObj.fullName.split(" ");
      firstname = first;
      lastname = rest.join(" ");
    }

    const updatedUserObj = { ...userObj, firstname, lastname };

    localStorage.setItem("token", authToken);
    localStorage.setItem("loggedInUserEmail", updatedUserObj.email);
    localStorage.setItem("role", updatedUserObj.role || "user");
    localStorage.setItem("userData", JSON.stringify(updatedUserObj));

    setToken(authToken);
    setIsAuthenticated(true);
    setLoggedInUserEmail(updatedUserObj.email);
    setFullName(`${firstname} ${lastname}`.trim());
    setRole(updatedUserObj.role || "user");
    setIsAdmin(updatedUserObj.role === "admin");
    setUser(updatedUserObj);

    try {
      if (updatedUserObj.role !== "admin") {
        const cartItems = await getCart(authToken);
        const totalQuantity = cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalQuantity);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch cart after login:", err.message);
      setCartCount(0);
    }
  };

  // ------------------ Logout ------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUserEmail");
    localStorage.removeItem("role");
    localStorage.removeItem("userData");

    setToken(null);
    setIsAuthenticated(false);
    setLoggedInUserEmail(null);
    setFullName("");
    setCartCount(0);
    setRole("user");
    setIsAdmin(false);

    toast.success("Logged out successfully", { toastId: "logout-success" });
  };

  // ------------------ Products ------------------
  const fetchAllProducts = useCallback(async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      toast.error("Could not load products. Please try again later.");
    }
  }, []);

  const fetchProductById = async (id) => {
    try {
      const product = await fetchSingleProduct(id);
      setSelectedProduct(product);
    } catch (error) {
      console.error("Failed to fetch product:", error.message);
      setSelectedProduct(null);
    }
  };

  // ------------------ Categories ------------------
  const fetchAllCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error.message);
      toast.error("Could not load categories. Please try again later.");
    }
  }, []);

  // ------------------ Initialize ------------------
  useEffect(() => {
    fetchAllProducts();
    fetchAllCategories();
    if (token) fetchProfile(token);
  }, [fetchAllProducts, fetchAllCategories, fetchProfile, token]);

  useEffect(() => {
    setIsAdmin(role === "admin");
  }, [role]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loggedInUserEmail,
        setLoggedInUserEmail,
        fullName,
        setFullName,
        handleLogin,
        handleLogout,
        token,
        setToken,
        cartCount,
        setCartCount,
        searchQuery,
        setSearchQuery,
        products,
        selectedProduct,
        fetchProductById,
        allProducts,
        setAllProducts,
        role,
        setRole,
        isAdmin,
        categories, // ✅ now available
        setCategories, // ✅ exposed too
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

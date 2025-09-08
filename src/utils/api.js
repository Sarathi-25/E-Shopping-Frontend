// src/utils/api.js
const BASE_URL = "http://localhost:5000/api"; // update for production

// Helper: fetch wrapper with better error handling
const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    console.error("API Error:", res.status, data);
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// ------------------ AUTH ------------------
export const signupUser = async (formData) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

export const loginUser = async (formData) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

export const fetchUserProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const updateUserProfile = async (token, profileData) => {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(res);
};

// ------------------ PRODUCTS ------------------
export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return handleResponse(res);
};

export const fetchSingleProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(res);
};

export const createProductApi = async (token, productData) => {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(res);
};

export const updateProductApi = async (token, id, productData) => {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(res);
};

export const deleteProductApi = async (token, id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// ------------------ CART ------------------
export const getCart = async (token) => {
  const res = await fetch(`${BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const addProductToCart = async (token, { productId, quantity = 1 }) => {
  const res = await fetch(`${BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(res);
};

export const updateCartItemApi = async (token, { productId, quantity }) => {
  const res = await fetch(`${BASE_URL}/cart/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(res);
};

export const removeCartItemApi = async (token, productId) => {
  const res = await fetch(`${BASE_URL}/cart/item/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const clearCartApi = async (token) => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// ------------------ ORDERS ------------------
export const placeOrder = async (token, orderData) => {
  const res = await fetch(`${BASE_URL}/orders/place`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
};

export const getOrders = async (token) => {
  const res = await fetch(`${BASE_URL}/orders/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const cancelOrderApi = async (token, orderId) => {
  const res = await fetch(`${BASE_URL}/orders/cancel/${orderId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// src/utils/api.js
export const API = BASE_URL.replace("/api", ""); // root backend URL

// Helper to get full image URL
export const getImageUrl = (path) => (path ? `${API}${path}` : "https://via.placeholder.com/200");

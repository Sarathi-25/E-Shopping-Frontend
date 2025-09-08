const BASE_URL =
  (process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api";

export const getCart = async (token) => {
  const res = await fetch(`${BASE_URL}/cart/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
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
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
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
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
};

export const removeCartItemApi = async (token, productId) => {
  const res = await fetch(`${BASE_URL}/cart/item/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to remove cart item");
  return res.json();
};

export const clearCartApi = async (token) => {
  const res = await fetch(`${BASE_URL}/cart/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
};

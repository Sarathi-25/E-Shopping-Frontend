// src/components/admin/AdminProductsPage.js
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    specifications: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("token");
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  // ---------------- Load Products ----------------
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/products`);
      if (!res.ok) throw new Error(`Error loading products: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Load Categories ----------------
  const loadCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      if (!res.ok) throw new Error(`Error loading categories: ${res.status}`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // ---------------- Handle Change ----------------
  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      category: "",
      brand: "",
      description: "",
      specifications: "",
      image: null,
    });
    setNewCategory("");
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---------------- Start Edit ----------------
  const startEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      price: p.price || "",
      category: p.category || "",
      brand: p.brand || "",
      description: p.description || "",
      specifications: (p.specifications || []).join(", "),
      image: null,
    });
    setPreview(p.image ? `${API}${p.image}` : null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ---------------- Save Product ----------------
  const saveProduct = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== "") fd.append(k, v);
    });

    const url = editing
      ? `${API}/api/products/${editing._id}`
      : `${API}/api/products`;
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Save error:", err);
        toast.error(err.error || `Save failed (Status: ${res.status})`);
        return;
      }

      toast.success("Saved successfully");
      resetForm();
      loadProducts();
    } catch (err) {
      console.error("Save exception:", err);
      toast.error(err.message || "Save failed");
    }
  };

  // ---------------- Delete Product ----------------
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${API}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Delete error:", err);
        toast.error(err.error || `Delete failed (Status: ${res.status})`);
        return;
      }

      toast.success("Deleted successfully");
      loadProducts();
    } catch (err) {
      console.error("Delete exception:", err);
      toast.error(err.message || "Delete failed");
    }
  };

  // ---------------- Upload Image Only ----------------
  const uploadImageOnly = async (id, file) => {
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch(`${API}/api/products/${id}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Image upload error:", err);
        toast.error(err.error || `Image upload failed (Status: ${res.status})`);
        return;
      }

      toast.success("Image uploaded");
      loadProducts();
    } catch (err) {
      console.error("Image upload exception:", err);
      toast.error(err.message || "Image upload failed");
    }
  };

  // ---------------- Add New Category ----------------
  const addCategory = async () => {
    if (!newCategory) return;
    if (
      categories.find((c) => c.name.toLowerCase() === newCategory.toLowerCase())
    ) {
      toast.error("Category already exists");
      return;
    }
    try {
      const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });
      if (res.ok) {
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
        setForm((prev) => ({ ...prev, category: created.name }));
        setNewCategory("");
        toast.success("Category added");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Admin – Products</h2>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={saveProduct}
        className="border rounded p-3 mb-4 bg-light"
      >
        <h5>{editing ? "Edit Product" : "Add Product"}</h5>
        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={onChange}
            />
          </div>

          {/* Category Dropdown + Add new */}
          <div className="col-md-6">
            <select
              className="form-control"
              name="category"
              value={form.category}
              onChange={onChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="mt-2 d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Or add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addCategory}
              >
                Add
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              name="specifications"
              placeholder="Specifications (comma separated)"
              value={form.specifications}
              onChange={onChange}
            />
          </div>
          <div className="col-12">
            <textarea
              className="form-control"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={onChange}
            />
          </div>

          {/* Image Upload with Preview */}
          <div className="col-md-6">
            <input
              ref={fileInputRef}
              className="form-control"
              type="file"
              name="image"
              accept="image/*"
              onChange={onChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded"
                style={{ height: 120, objectFit: "contain" }}
              />
            )}
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div className="col-md-4 mb-3" key={p._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={
                    p.image
                      ? `${API}${p.image}`
                      : "https://via.placeholder.com/400"
                  }
                  className="card-img-top"
                  alt={p.name}
                  style={{
                    height: 220,
                    objectFit: "contain",
                    background: "#f8f9fa",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="text-muted mb-2">₹{p.price}</p>

                  <label className="form-label">Add/Replace Image</label>
                  <input
                    className="form-control mb-2"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      uploadImageOnly(p._id, e.target.files[0])
                    }
                  />

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && <p>No products yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;

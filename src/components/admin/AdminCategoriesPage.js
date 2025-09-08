// src/components/admin/AdminCategoriesPage.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [homeSlides, setHomeSlides] = useState([]); // homepage
  const [selectedHomeFiles, setSelectedHomeFiles] = useState(null); // homepage
  const [newCategory, setNewCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({}); // category slides
  const token = localStorage.getItem("token");

  // ----------------- Load Categories -----------------
  const loadCategories = async () => {
    const res = await fetch(`${API}/api/categories`);
    const data = await res.json();
    setCategories(data);
  };

  // ----------------- Load Home Slides -----------------
  const loadHomeSlides = async () => {
    const res = await fetch(`${API}/api/home/slides`);
    const data = await res.json();
    setHomeSlides(data);
  };

  useEffect(() => {
    loadCategories();
    loadHomeSlides();
  }, []);

  // ----------------- Add Category -----------------
  const addCategory = async () => {
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
        toast.success("Category added");
        setNewCategory("");
        loadCategories();
      }
    } catch {
      toast.error("Failed to add category");
    }
  };

  // ----------------- Upload Category Slides -----------------
  const uploadSlides = async (id) => {
    if (!selectedFiles[id]) {
      toast.error("Please choose files first");
      return;
    }
    const fd = new FormData();
    [...selectedFiles[id]].forEach((f) => fd.append("slides", f));

    try {
      const res = await fetch(`${API}/api/categories/${id}/slides`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        toast.success("Slides updated");
        setSelectedFiles((prev) => ({ ...prev, [id]: null }));
        loadCategories();
      }
    } catch {
      toast.error("Slide upload failed");
    }
  };

  // ----------------- Delete Category Slide -----------------
  const deleteSlide = async (catId, slidePath) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`${API}/api/categories/${catId}/slides`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slide: slidePath }),
      });
      if (res.ok) {
        toast.success("Slide deleted");
        loadCategories();
      }
    } catch {
      toast.error("Failed to delete slide");
    }
  };

  // ----------------- Delete Category -----------------
  const deleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const res = await fetch(`${API}/api/categories/${catId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Category deleted");
        loadCategories();
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // ----------------- Upload Home Slides -----------------
  const uploadHomeSlides = async () => {
    if (!selectedHomeFiles) {
      toast.error("Please choose files first");
      return;
    }
    const fd = new FormData();
    [...selectedHomeFiles].forEach((f) => fd.append("slides", f));

    try {
      const res = await fetch(`${API}/api/home/slides`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        toast.success("Homepage slides updated");
        setSelectedHomeFiles(null);
        loadHomeSlides();
      }
    } catch {
      toast.error("Failed to upload homepage slides");
    }
  };

  // ----------------- Delete Home Slide -----------------
  const deleteHomeSlide = async (slidePath) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`${API}/api/home/slides`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slide: slidePath }),
      });
      if (res.ok) {
        toast.success("Homepage slide deleted");
        loadHomeSlides();
      }
    } catch {
      toast.error("Failed to delete homepage slide");
    }
  };

  return (
    <div className="container my-4">
      <h2>Admin – Categories & Homepage</h2>

      {/* ✅ Homepage Slides Section */}
      <div className="card p-3 mb-4">
        <h4>Homepage Slides</h4>

        <div className="d-flex flex-wrap gap-3">
          {homeSlides.map((s, i) => (
            <div key={i} className="position-relative">
              <img
                src={`${API}${s}`}
                alt=""
                className="img-fluid rounded"
                style={{ maxWidth: "200px" }}
              />
              <button
                className="btn btn-sm btn-outline-danger mt-1 w-100"
                onClick={() => deleteHomeSlide(s)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          className="form-control mt-3"
          onChange={(e) => setSelectedHomeFiles(e.target.files)}
        />
        <button className="btn btn-success mt-2" onClick={uploadHomeSlides}>
          Upload Homepage Slides
        </button>
      </div>

      {/* ✅ Categories Section */}
      <h4>Categories</h4>
      <div className="d-flex gap-2 mb-3">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="form-control"
        />
        <button className="btn btn-primary" onClick={addCategory}>
          Add
        </button>
      </div>

      <div className="row">
        {categories.map((cat) => (
          <div className="col-md-4 mb-3" key={cat._id}>
            <div className="card p-2">
              <div className="d-flex justify-content-between align-items-center">
                <h5>{cat.name}</h5>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCategory(cat._id)}
                >
                  Delete Category
                </button>
              </div>

              {cat.slides?.map((s, i) => (
                <div key={i} className="position-relative mb-2">
                  <img
                    src={`${API}${s}`}
                    alt=""
                    className="img-fluid rounded"
                  />
                  <button
                    className="btn btn-sm btn-outline-danger mt-1"
                    onClick={() => deleteSlide(cat._id, s)}
                  >
                    Delete Slide
                  </button>
                </div>
              ))}

              <input
                type="file"
                multiple
                className="form-control mt-2"
                onChange={(e) =>
                  setSelectedFiles((prev) => ({
                    ...prev,
                    [cat._id]: e.target.files,
                  }))
                }
              />

              <button
                className="btn btn-success mt-2"
                onClick={() => uploadSlides(cat._id)}
              >
                Upload Slides
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;

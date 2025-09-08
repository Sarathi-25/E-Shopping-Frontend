import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchUserProfile } from "../../utils/api";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import DEFAULT_PROFILE_IMAGE from "../../assets/images/Default-image.jpg"; // <-- Import default image

const ProfilePage = () => {
  const token = localStorage.getItem("token");
  const { setUser: setGlobalUser, setFullName } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    address: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(DEFAULT_PROFILE_IMAGE);

  // Fetch profile on load
  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchUserProfile(token);
        if (!data) return;

        // Ensure firstname and lastname exist
        let firstname = data.firstname || "";
        let lastname = data.lastname || "";
        if ((!firstname || !lastname) && data.fullName) {
          const [first, ...rest] = data.fullName.split(" ");
          firstname = first;
          lastname = rest.join(" ");
        }

        const updatedData = { ...data, firstname, lastname };

        setUser(updatedData);
        setFormData({ ...updatedData });
        setImagePreview(updatedData.image || DEFAULT_PROFILE_IMAGE);
      } catch (err) {
        toast.error("Error loading profile");
      }
    };
    getProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String); // Update preview
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const response = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...data,
          firstname: data.firstname || formData.firstname,
          lastname: data.lastname || formData.lastname,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setFormData({ ...updatedUser });
        setImagePreview(updatedUser.image || DEFAULT_PROFILE_IMAGE);

        setGlobalUser(updatedUser);
        setFullName(`${updatedUser.firstname} ${updatedUser.lastname}`.trim());

        toast.success("Profile updated successfully");
        setEditMode(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving changes");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-5">
        <h2>No user found. Please log in.</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="row g-0">
              <div className="col-md-4 bg-info text-white text-center p-4">
                <img
                  src={imagePreview || DEFAULT_PROFILE_IMAGE}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    border: "3px solid white",
                  }}
                />
                {editMode && (
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control form-control-sm"
                    />
                  </div>
                )}
                <h4 className="fw-bold mt-2">
                  {formData.firstname} {formData.lastname}
                </h4>
                <button
                  className={`btn btn-${editMode ? "success" : "light"} mt-3`}
                  onClick={() => (editMode ? handleSave() : setEditMode(true))}
                >
                  {editMode ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="col-md-8 p-4 border border-secondary rounded">
                <h3 className="mb-4 border-bottom pb-2">Account Information</h3>
                {[
                  "firstname",
                  "lastname",
                  "email",
                  "phoneNumber",
                  "address",
                ].map((field) => (
                  <div className="row mb-3" key={field}>
                    <div className="col-sm-4 fw-bold text-capitalize">
                      {field === "phoneNumber" ? "Phone" : field}
                    </div>
                    <div className="col-sm-8">
                      {editMode ? (
                        field === "address" ? (
                          <textarea
                            className="form-control"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            rows="2"
                          />
                        ) : (
                          <input
                            className="form-control"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            readOnly={field === "email"}
                          />
                        )
                      ) : (
                        <span>{formData[field]}</span>
                      )}
                    </div>
                  </div>
                ))}
                {editMode && (
                  <div className="text-end">
                    <button
                      className="btn btn-secondary mt-3"
                      onClick={() => {
                        setFormData({ ...user });
                        setImagePreview(user.image || DEFAULT_PROFILE_IMAGE);
                        setEditMode(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

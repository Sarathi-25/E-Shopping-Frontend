import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.firstName || !/^[A-Za-z]+$/.test(formData.firstName)) {
      validationErrors.firstName =
        "First name is required and must contain only letters.";
    }

    if (!formData.lastName || !/^[A-Za-z]+$/.test(formData.lastName)) {
      validationErrors.lastName =
        "Last name is required and must contain only letters.";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Valid email is required.";
    }

    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }

    if (
      !formData.address ||
      !/^[a-zA-Z0-9\s,.'-]{3,}$/.test(formData.address)
    ) {
      validationErrors.address = "Valid address is required.";
    }

    if (
      !formData.password ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
        formData.password
      )
    ) {
      validationErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.";
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords must match.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstName,
        lastname: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };

      await axios.post("http://localhost:5000/api/auth/signup", payload);

      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect after toast shows
      setTimeout(() => {
        navigate("/LoginPage");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-start py-2"
      style={{ backgroundColor: "#2de443ff", minHeight: "100vh" }}
    >
      <ToastContainer />
      <div
        className="card p-4 my-5"
        style={{
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {[
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "address",
            "password",
            "confirmPassword",
          ].map((field, idx) => (
            <div key={idx} className="mb-3">
              <label htmlFor={field} className="form-label">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (char) => char.toUpperCase())}
              </label>
              <input
                type={
                  field.toLowerCase().includes("password") ? "password" : "text"
                }
                className="form-control"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
              {errors[field] && (
                <small className="text-danger">{errors[field]}</small>
              )}
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>

          <div className="text-center mt-3">
            <p>Already have an account?</p>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate("/LoginPage")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;

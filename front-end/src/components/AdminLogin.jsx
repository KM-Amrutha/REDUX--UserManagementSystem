
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../redux/axiosInterceptor";
import Cookies from "js-cookie";

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();

  const onChangeData = (key, value) => {
    setLoginData((prev) => ({ ...prev, [key]: value }));
    setError((prev) => ({ ...prev, [key]: "", general: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    if (!loginData.email) {
      setError((prev) => ({ ...prev, email: "Email is required." }));
      isValid = false;
    }
    if (!loginData.password) {
      setError((prev) => ({ ...prev, password: "Password is required." }));
      isValid = false;
    }
    return isValid;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axiosInstance.post("/admin/login", loginData);

      if (response.status === 200 && response.data.token) {
        Cookies.set("authToken", response.data.token,{expires:30});
        navigate("/admin-home");
      } else {
        setError({ general: "Login failed. Please check your credentials." });
      }
    } catch (error) {
      setError({
        general: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: " linear-gradient(135deg, #ffdde1 0%, #ee9ca7 50%, #ff7e5f 100%)",
    },
    formWrapper: {
      background: "linear-gradient(180deg,rgb(235, 131, 4) 0%,rgb(204, 0, 146) 100%)", 
      padding: "2rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "320px",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#fff",
      marginBottom: "0.5rem",
      textAlign: "center",
    },
    subtitle: {
      color: "#a0aec0", // gray-400
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#cbd5e0", // gray-300
      marginBottom: "0.25rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #4a5568", // gray-700
      borderRadius: "0.5rem",
      backgroundColor: "#fff", // gray-800
      color: "#000",
      outline: "none",
      marginBottom: "0.25rem",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#4299e1", // blue-500
    },
    errorText: {
      color: "#000", // red-500
      fontSize: "1rem",
      marginBottom: "0.75rem",
    },
    button: {
      width: "100%",
      backgroundColor: "#3182ce", // blue-600
      color: "#fff",
      padding: "0.5rem",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "background-color 0.2s ease",
    },
    buttonHover: {
      backgroundColor: "#2b6cb0", // blue-700
    },
  };


  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.title}>Admin Login</div>
        <div style={styles.subtitle}>Login to your admin account</div>

        <form onSubmit={loginSubmit}>
          <div>
            <label style={styles.label} htmlFor="admin-email">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => onChangeData("email", e.target.value)}
              style={styles.input}
              id="admin-email"
            />
            {error.email && <p style={styles.errorText}>{error.email}</p>}
          </div>

          <div>
            <label style={styles.label} htmlFor="admin-password">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => onChangeData("password", e.target.value)}
              style={styles.input}
              id="admin-password"
            />
            {error.password && <p style={styles.errorText}>{error.password}</p>}
          </div>

          {error.general && <p style={styles.errorText}>{error.general}</p>}

          <button
            type="submit"
            style={btnHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

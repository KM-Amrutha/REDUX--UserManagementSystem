
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("userToken"); 
    navigate("/login"); 
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 50%, #ff7e5f 100%)",
    },
    box: {
      background:"linear-gradient(180deg,rgb(235, 131, 4) 0%,rgb(204, 0, 146) 100%)",
      padding: "2rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      width: "320px",
      textAlign: "center",
      color: "white",
    },
    profileImage: {
      width: "128px",
      height: "128px",
      borderRadius: "9999px",
      margin: "1rem auto",
      objectFit: "cover",
    },
    logoutBtn: {
      backgroundColor: "#8B0000",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      cursor: "pointer",
      border: "none",
      transition: "background-color 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>
          Welcome <span>{user?.name}</span>
        </h1>
        {user?.profileImg && (
          <img
            alt="Profile"
            src={user.profileImg}
            style={styles.profileImage}
          />
        )}
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c53030")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e53e3e")}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;

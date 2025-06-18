import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import EditProfileModal from "./EditProfileModal";
import { useDispatch } from "react-redux";
import {logout} from '../redux/AuthSlice'

const Home = () => {
  
  const user = useSelector((state) => state.auth.user);

  
  // const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

useEffect(() => {
  const token = Cookies.get("authToken");

  if (!token) {
    dispatch(logout());
    window.location.replace("/login");
    return;
  }

  if (user) {
    if (user.role !== "user") {
      Cookies.remove("authToken");
      dispatch(logout());
      window.location.replace("/login");
    } else {
      setUpdatedUser(user);
      setLoading(false);
    }
  }
}, [user, dispatch]);




  const handleLogout = () => {
    Cookies.remove("authToken");
     dispatch(logout()); 
      window.location.replace("/login")
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 50%, #ff7e5f 100%)",
    },
    box: {
      background:
        "linear-gradient(180deg,rgb(235, 131, 4) 0%,rgb(204, 0, 146) 100%)",
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

    if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>
          Welcome <span>{updatedUser?.name}</span>
        </h1>
        {updatedUser?.profileImage && (
          <img
            alt="Profile"
            src={updatedUser.profileImage}
            style={styles.profileImage}
          />
        )}
        <p>
          <strong>Name:</strong> {updatedUser?.name}
        </p>
        <p>
          <strong>Email:</strong> {updatedUser?.email}
        </p>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c53030")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e53e3e")}
        >
          Logout
        </button>
        <button
          onClick={() => setShowEdit(true)}
          style={{
            marginTop: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
        {showEdit && (
          <EditProfileModal
            user={updatedUser}
            setShowEdit={setShowEdit}
            onUserUpdated={(newUser) => {
              setUpdatedUser(newUser);
              setShowEdit(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;

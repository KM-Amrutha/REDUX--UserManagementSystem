
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAxiosInstance } from "../redux/axiosInterceptor";
import Cookies from "js-cookie";
import ModalAddUser from "./AddUser";
import Modal from "./Modal";


const styles = {
  adminPanel: {
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 50%, #ff7e5f 100%)",
},
  sidebar: {
    height: "100vh",
    width: "16rem", 
    background: "linear-gradient(180deg,rgb(235, 131, 4) 0%,rgb(204, 0, 146) 100%)",
    color: "white",
    position: "fixed",
    left: 0,
    top: 0,
    padding: "1rem",
  },
  logo: {
    marginBottom: "1.5rem",
  },
  navList: {
    paddingLeft: "1rem",
  },
  navItem: {
    marginBottom: "1rem",
  },
  btnBlue: {
    marginTop: "1rem",
    backgroundColor: "#4299e1", 
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
  },
  btnBlueHover: {
    backgroundColor: "#2b6cb0", 
  },
  btnRed: {
    marginTop: "1rem",
    backgroundColor: "#f56565", 
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
    marginLeft: "16rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "white",
  },
  content: {},
  heading2: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  searchContainer: {
    marginBottom: "1rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #ccc",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "0.375rem",
    borderCollapse: "collapse",
  },
  th: {
    padding: "0.5rem",
    backgroundColor: "#e2e8f0",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "0.5rem",
    border: "1px solid #ddd",
  },
  imgProfile: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    objectFit: "cover",
  },
  actionButtons: {
    display: "flex",
    gap: "0.5rem",
  },
  btnEdit: {
    backgroundColor: "#4299e1", 
    color: "white",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
     marginTop:"10px",
  },
  btnDelete: {
    backgroundColor: "#f56565",
    color: "white",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
     marginTop:"10px"
  },
  noUsersRow: {
    padding: "0.5rem",
    textAlign: "center",
  },
};

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [edituser, setEditUser] = useState(false);
  const [adduser, setadduser] = useState(false);

  const navigate = useNavigate();

  const getEditedDatas = (editedDatas, id) => {
    const newData = [...users].map((val) =>
      val._id === id ? { ...val, ...editedDatas } : val
    );
    setUsers(newData);
  };

  const addUserTolist = (newUser) => {
    setUsers((prevuser) => [...prevuser, newUser]);
  };

  useEffect(() => {
    const fetchdatas = async () => {
      try {
        const response = await adminAxiosInstance.get("/admin/users");
        
        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };
    fetchdatas();
  }, []);

  const filteredUsers = users.filter((user) => {
    
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const HandleEditClick = (usr) => {
    setEditUser(usr);
  };

 const handleDeleteClick = async (userid) => {
  try {
    await adminAxiosInstance.delete(`/admin/user/${userid}`);
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userid));
  } catch (error) {
    console.log("error deleting", error);
  }
};


  const handleLogout = () => {
    navigate("/admin-login");
    Cookies.remove("adminToken");
  };

  const handleadduser = () => {
    setadduser(true);
  };

  return (
    <div style={styles.adminPanel}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Admin Panel</h2>
        </div>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <a href="#dashboard" style={{ color: "white", textDecoration: "none" }}>
                Dashboard
              </a>
            </li>
            <li style={styles.navItem}>
              <button onClick={handleadduser} style={styles.btnBlue}>
                Add User
              </button>
            </li>
            <li style={styles.navItem}>
              <button onClick={handleLogout} style={styles.btnRed}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Dashboard</h1>
          <div style={styles.userInfo}>
            <span>Admin</span>
          </div>
        </header>

        <section style={styles.content}>
          <h2 style={styles.heading2}>Users</h2>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search user..."
              style={styles.searchInput}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <tr key={user._id}>
                      <td style={styles.td}>{idx + 1}</td>
                      <td style={styles.td}>
                        <img
                          src={user.profileImage}
                          alt="Profile"
                          style={styles.imgProfile}
                        />
                      </td>
                      <td style={styles.td}>{user.name}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={{ ...styles.td, ...styles.actionButtons }}>
                        <button
                          onClick={() => HandleEditClick(user)}
                          style={styles.btnEdit}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          style={styles.btnDelete}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.noUsersRow}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {edituser && (
          <Modal
            editeduser={getEditedDatas}
            edituser={edituser}
            setEditUser={setEditUser}
          />
        )}
        {adduser && (
          <ModalAddUser SetaddUser={setadduser} addUserTolist={addUserTolist} />
        )}
      </main>
    </div>
  );
};

export default AdminHome;

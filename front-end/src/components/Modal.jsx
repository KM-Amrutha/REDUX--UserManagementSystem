import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { adminAxiosInstance } from "../redux/axiosInterceptor";
import Cookies from "js-cookie";

export default function Modal({ edituser, setEditUser, editeduser }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState({
    name: "",
    email: "",
    profileImage: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (edituser) {
      setData({
        name: edituser.name || "",
        email: edituser.email || "",
        profileImage: null,
        imagePreview: edituser.profileImage || null,
      });
    }
  }, [edituser]);

  const handleClose = () => setEditUser("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setData((prev) => ({
          ...prev,
          profileImage: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOk = async () => {
    try {
      const formData = new FormData();
      formData.append("_id", edituser._id);
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await adminAxiosInstance.put(
        `/admin/edit-user/${edituser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data.updatedUser || response.data.user;

      editeduser(
        {
          name: updatedUser.name,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
        },
        edituser._id
      );

      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={!!edituser}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          background:
            "linear-gradient(180deg, rgb(235, 131, 4) 0%, rgb(204, 0, 146) 100%)",
          color: "#fff",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle id="responsive-dialog-title" sx={{ color: "#fff" }}>
        Edit User Details
      </DialogTitle>

      <DialogContent sx={{ color: "#fff" }}>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Name"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px",
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "#fff",
            borderWidth: "1px",
            borderRadius: "4px",
            borderStyle: "solid",
            outline: "none",
          }}
        />
        <input
          type="text"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px",
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "#fff",
            borderWidth: "1px",
            borderRadius: "4px",
            borderStyle: "solid",
            outline: "none",
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "16px",
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "#fff",
            borderWidth: "1px",
            borderRadius: "4px",
            borderStyle: "solid",
            outline: "none",
          }}
        />
        {data.imagePreview && (
          <img
            src={data.imagePreview}
            alt="Preview"
            style={{
              width: "100%",
              marginTop: "16px",
              borderRadius: "4px",
              border: "2px solid #fff",
            }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ color: "#fff" }}>
        <Button
          autoFocus
          onClick={handleClose}
          sx={{
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "rgba(139, 0, 0, 0.8)" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOk}
          autoFocus
          sx={{
            backgroundColor: "rgba(0, 0, 255, 0.8)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "rgba(0, 0, 139, 0.8)" },
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { axiosInstance } from "../redux/axiosInterceptor";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function Modal({ edituser, setEditUser, editeduser }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState({
    name: "",
    email: "",
    profileImage: null,
    imagePreview: null,
  });

  const [fileError, setFileError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (edituser) {
      setData({
        name: edituser.name || "",
        email: edituser.email || "",
        profileImage: null,
        imagePreview: edituser.profileImage || null,
      });
      setFieldErrors({});
      setFileError("");
    }
  }, [edituser]);

  const handleClose = () => setEditUser("");

const handleChange = (e) => {
  const { name, value } = e.target;

  setFieldErrors((prev) => ({ ...prev, [name]: "" }));

  setData((prev) => ({ ...prev, [name]: value }));
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 2;

    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, PNG, or WEBP images allowed");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`Image must be under ${maxSizeMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setData((prev) => ({
        ...prev,
        profileImage: file,
        imagePreview: reader.result,
      }));
      setFileError("");
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Invalid email format";

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !fileError;
  };

  const handleOk = async () => {
    if (!validate()) {
      toast.error("Please fill all the fileds correctly");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("_id", edituser._id);
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await axiosInstance.put(
        `/admin/edit-user/${edituser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
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

      toast.success("User updated successfully");
      handleClose();
    } catch (error) {
      toast.error("Error updating user");
      console.error(error);
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
          style={inputStyle}
        />
        {fieldErrors.name && <p style={errorStyle}>{fieldErrors.name}</p>}

        <input
          type="text"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          style={inputStyle}
        />
        {fieldErrors.email && <p style={errorStyle}>{fieldErrors.email}</p>}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={inputStyle}
        />
        {fileError && <p style={errorStyle}>{fileError}</p>}

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
          onClick={handleClose}
          sx={cancelButtonStyle}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOk}
          sx={okButtonStyle}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// 🔧 Styles
const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  color: "#fff",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  border: "1px solid #fff",
  borderRadius: "4px",
  outline: "none",
};

const errorStyle = {
  color: "black",
  marginTop: "-10px",
  marginBottom: "10px",
  fontSize: "0.9rem",
};

const cancelButtonStyle = {
  backgroundColor: "rgba(255, 0, 0, 0.8)",
  color: "white",
  padding: "8px 16px",
  borderRadius: "8px",
  "&:hover": { backgroundColor: "rgba(139, 0, 0, 0.8)" },
};

const okButtonStyle = {
  backgroundColor: "rgba(0, 0, 255, 0.8)",
  color: "white",
  padding: "8px 16px",
  borderRadius: "8px",
  "&:hover": { backgroundColor: "rgba(0, 0, 139, 0.8)" },
};

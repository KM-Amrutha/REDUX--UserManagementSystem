import  React,{useState, useEffect} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { axiosInstance } from "../redux/axiosInterceptor";
import Cookies from "js-cookie";
import {toast} from 'react-hot-toast'


export default function EditProfileModal({ user, setShowEdit, onUserUpdated }) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = React.useState({
    name: "",
    email: "",
    profileImage: null,
    imagePreview: null,
  });
const [isImageValid, setIsImageValid] = useState(true);

  useEffect(() => {
    if (user) {
      setData({
        name: user.name || "",
        email: user.email || "",
        profileImage: null,
        imagePreview: user.profileImage || null,
      });
    }
  }, [user]);

  const handleClose = () => setShowEdit(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
const handleFileChange = (e) => {
  const file = e.target.files[0];
   if (!file) {
    setIsImageValid(true);
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeMB = 1;

  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPG, PNG, or WEBP images are allowed");
    setIsImageValid(false);
    return;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    toast.error(`Image must be less than ${maxSizeMB}MB`);
    setIsImageValid(false);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    setData((prev) => ({
      ...prev,
      profileImage: file,
      imagePreview: reader.result,
    }));
     setIsImageValid(true);
  };
  reader.readAsDataURL(file);
};


  const handleOk = async () => {
    
    if (!data.name.trim()) {
    toast.error("Name is required");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim() || !emailRegex.test(data.email)) {
    toast.error("Enter a valid email");
    return;
  }
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await axiosInstance.put(`/user/edit-profile`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.user;

      if (onUserUpdated) {
        onUserUpdated({
          name: updatedUser.name,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
        });
      }
toast.success("Profile updated successfully");
      handleClose();
    } catch (error) {
      toast.error("Error updating user:", error);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={!!user}
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
        Edit Profile
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
          disabled={!isImageValid}
          sx={{
            backgroundColor: "rgba(79, 79, 188, 0.8)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "rgba(20, 20, 74, 0.8)" },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

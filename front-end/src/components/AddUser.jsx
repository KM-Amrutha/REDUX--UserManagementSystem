import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { adminAxiosInstance } from "../redux/axiosInterceptor";

export default function AddUser({ SetaddUser, addUserTolist }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Invalid email format";
    if (!data.password || data.password.length < 6)
      newErrors.password = "Min 6 chars password";
    if (!data.profileImage) newErrors.profileImage = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => SetaddUser(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setData({ ...data, profileImage: file });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await adminAxiosInstance.get("/admin/authenticated");
      const userId = res.data?.data?._id;
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("profileImage", data.profileImage);
      formData.append("userId", userId);

      const uploadRes = await adminAxiosInstance.post("/admin/add-user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addUserTolist(uploadRes.data.user);
      SetaddUser(false);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={true}
      onClose={handleClose}
     PaperProps={{
  sx: {
    background: "linear-gradient(180deg, rgb(235, 131, 4) 0%, rgb(204, 0, 146) 100%)",
    color: "#fff",
  },
}}
    >
      <DialogTitle>Add User Details</DialogTitle>

      <DialogContent>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={data.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={data.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={data.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
        />
        <input
          type="file"
          name="profileImage"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginTop: "16px", color: "#fff" }}
        />
        {errors.profileImage && (
          <p style={{ color: "red", marginTop: "4px" }}>{errors.profileImage}</p>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ bgcolor: "red", color: "#fff", ":hover": { bgcolor: "#c00" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{ bgcolor: "#1976d2", color: "#fff", ":hover": { bgcolor: "#115293" } }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
